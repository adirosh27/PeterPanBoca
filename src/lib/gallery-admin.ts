import { promises as fs } from 'fs';
import path from 'path';

// Gallery photo management for the admin "delete photos" page.
//
// Photos live in the git repo under public/images/<year>/<event>/<file>.
// A deployed Vercel site cannot delete its own static files, so:
//   - When GITHUB_TOKEN is set, deletions are committed to GitHub (one commit
//     per batch), which triggers a redeploy that drops the files for real.
//   - Otherwise, when running locally (not on Vercel), files are deleted from
//     disk; commit the result yourself.

export const IMAGES_PREFIX = 'public/images/';
const MEDIA_RE = /\.(jpg|jpeg|png|gif|webp|mp4|mov|webm)$/i;
const MANIFEST_PATH = 'public/image-manifest.json';

const GITHUB_REPO = process.env.GITHUB_REPO || 'adirosh27/PeterPanBoca';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

export interface GalleryFile {
  path: string; // repo-relative, e.g. public/images/2025/<event>/IMG_1.jpg
  name: string;
  url: string; // public URL, e.g. /images/2025/<event>/IMG_1.jpg
  size: number; // bytes
  type: 'image' | 'video';
}

export interface GalleryEvent {
  key: string; // "<year>/<event>"
  year: string;
  event: string;
  files: GalleryFile[];
  totalSize: number;
}

export type Mode = 'github' | 'local' | 'unconfigured';

export function getMode(): Mode {
  if (process.env.GITHUB_TOKEN) return 'github';
  if (!process.env.VERCEL) return 'local';
  return 'unconfigured';
}

/** A path is deletable only if it is a media file inside public/images/<year>/<event>/. */
export function isDeletablePath(p: unknown): p is string {
  if (typeof p !== 'string' || !p.startsWith(IMAGES_PREFIX)) return false;
  const rest = p.slice(IMAGES_PREFIX.length).split('/');
  if (rest.length !== 3) return false;
  if (rest.some((seg) => !seg || seg === '.' || seg === '..' || seg.includes('\\'))) return false;
  return MEDIA_RE.test(p);
}

function toFile(p: string, size: number): GalleryFile {
  const name = p.split('/').pop()!;
  return {
    path: p,
    name,
    url: '/' + p.slice('public/'.length),
    size,
    type: /\.(mp4|mov|webm)$/i.test(name) ? 'video' : 'image',
  };
}

function groupByEvent(files: GalleryFile[]): GalleryEvent[] {
  const map = new Map<string, GalleryEvent>();
  for (const f of files) {
    const [year, event] = f.path.slice(IMAGES_PREFIX.length).split('/');
    const key = `${year}/${event}`;
    let ev = map.get(key);
    if (!ev) {
      ev = { key, year, event, files: [], totalSize: 0 };
      map.set(key, ev);
    }
    ev.files.push(f);
    ev.totalSize += f.size;
  }
  const events = [...map.values()];
  for (const ev of events) ev.files.sort((a, b) => a.name.localeCompare(b.name));
  // Newest year first, then event name.
  events.sort((a, b) => b.year.localeCompare(a.year) || a.event.localeCompare(b.event));
  return events;
}

// ---------- GitHub ----------

async function gh<T>(apiPath: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}${apiPath}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`GitHub ${init?.method || 'GET'} ${apiPath} failed: ${res.status} ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

interface GhTreeEntry { path: string; type: string; size?: number; sha: string }

async function githubHead() {
  const ref = await gh<{ object: { sha: string } }>(`/git/ref/heads/${encodeURIComponent(GITHUB_BRANCH)}`);
  const commit = await gh<{ tree: { sha: string } }>(`/git/commits/${ref.object.sha}`);
  return { commitSha: ref.object.sha, treeSha: commit.tree.sha };
}

async function listGithub(): Promise<GalleryFile[]> {
  const { treeSha } = await githubHead();
  const tree = await gh<{ tree: GhTreeEntry[]; truncated: boolean }>(`/git/trees/${treeSha}?recursive=1`);
  if (tree.truncated) throw new Error('GitHub tree listing was truncated');
  return tree.tree
    .filter((e) => e.type === 'blob' && isDeletablePath(e.path))
    .map((e) => toFile(e.path, e.size ?? 0));
}

async function deleteGithub(paths: string[]): Promise<{ commitUrl: string }> {
  const { commitSha, treeSha } = await githubHead();

  // Keep the committed manifest in sync (the build regenerates it anyway).
  const manifestFile = await gh<{ content: string }>(
    `/contents/${MANIFEST_PATH}?ref=${encodeURIComponent(GITHUB_BRANCH)}`
  );
  const manifest = JSON.parse(Buffer.from(manifestFile.content, 'base64').toString('utf-8'));
  removeFromManifest(manifest, paths);

  const tree = await gh<{ sha: string }>(`/git/trees`, {
    method: 'POST',
    body: JSON.stringify({
      base_tree: treeSha,
      tree: [
        ...paths.map((p) => ({ path: p, mode: '100644', type: 'blob', sha: null })),
        { path: MANIFEST_PATH, mode: '100644', type: 'blob', content: JSON.stringify(manifest) },
      ],
    }),
  });

  const commit = await gh<{ sha: string; html_url: string }>(`/git/commits`, {
    method: 'POST',
    body: JSON.stringify({
      message: `chore: delete ${paths.length} gallery photo${paths.length === 1 ? '' : 's'} via admin page`,
      tree: tree.sha,
      parents: [commitSha],
    }),
  });

  // Not forced: if main moved in between, this fails and the admin can retry.
  await gh(`/git/refs/heads/${encodeURIComponent(GITHUB_BRANCH)}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });

  return { commitUrl: commit.html_url };
}

// ---------- Local filesystem ----------

const repoRoot = () => process.cwd();

async function listLocal(): Promise<GalleryFile[]> {
  const base = path.join(repoRoot(), IMAGES_PREFIX);
  const out: GalleryFile[] = [];
  const years = await fs.readdir(base, { withFileTypes: true });
  for (const y of years.filter((d) => d.isDirectory())) {
    const events = await fs.readdir(path.join(base, y.name), { withFileTypes: true });
    for (const e of events.filter((d) => d.isDirectory())) {
      const dir = path.join(base, y.name, e.name);
      for (const f of await fs.readdir(dir, { withFileTypes: true })) {
        const rel = `${IMAGES_PREFIX}${y.name}/${e.name}/${f.name}`;
        if (!f.isFile() || !isDeletablePath(rel)) continue;
        const stat = await fs.stat(path.join(dir, f.name));
        out.push(toFile(rel, stat.size));
      }
    }
  }
  return out;
}

async function deleteLocal(paths: string[]) {
  const base = path.resolve(repoRoot(), IMAGES_PREFIX);
  for (const p of paths) {
    const abs = path.resolve(repoRoot(), p);
    if (!abs.startsWith(base + path.sep)) throw new Error(`Refusing to delete outside images: ${p}`);
    await fs.rm(abs, { force: true });
  }
  const manifestAbs = path.join(repoRoot(), MANIFEST_PATH);
  try {
    const manifest = JSON.parse(await fs.readFile(manifestAbs, 'utf-8'));
    removeFromManifest(manifest, paths);
    await fs.writeFile(manifestAbs, JSON.stringify(manifest));
  } catch {
    // Manifest missing is fine; the build regenerates it.
  }
}

// ---------- Shared ----------

type Manifest = Record<string, { urlPrefix: string; images: { url: string }[] }>;

function removeFromManifest(manifest: Manifest, paths: string[]) {
  const urls = new Set(paths.map((p) => '/' + p.slice('public/'.length)));
  for (const key of Object.keys(manifest)) {
    manifest[key].images = manifest[key].images.filter((img) => !urls.has(img.url));
  }
}

export async function listGallery(): Promise<GalleryEvent[]> {
  const mode = getMode();
  if (mode === 'unconfigured') throw new Error('GITHUB_TOKEN is not set on this deployment');
  return groupByEvent(mode === 'github' ? await listGithub() : await listLocal());
}

export async function deletePhotos(paths: string[]): Promise<{ mode: Mode; commitUrl?: string }> {
  const mode = getMode();
  if (mode === 'unconfigured') throw new Error('GITHUB_TOKEN is not set on this deployment');
  if (mode === 'github') return { mode, ...(await deleteGithub(paths)) };
  await deleteLocal(paths);
  return { mode };
}
