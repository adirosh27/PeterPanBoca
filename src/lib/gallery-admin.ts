import { promises as fs } from 'fs';
import path from 'path';
import { del, list } from '@vercel/blob';

// Gallery photo management for the admin "delete photos" page.
//
// Photos live in Vercel Blob at images/<year>/<event>/<file> (see
// README-PHOTOS.md). The galleries read their photo list from the committed
// public/image-manifest.json, so a delete does two things:
//   1. Remove the photos from the manifest. With GITHUB_TOKEN set this is
//      committed to GitHub, which redeploys the site; when running locally
//      (not on Vercel) the manifest file is rewritten on disk instead.
//   2. Delete the photos from Blob.
// The manifest goes first: if that fails nothing is deleted, and the admin
// can simply retry.

export const IMAGES_PREFIX = 'images/';
const MEDIA_RE = /\.(jpg|jpeg|png|gif|webp|mp4|mov|webm)$/i;
const MANIFEST_PATH = 'public/image-manifest.json';

const GITHUB_REPO = process.env.GITHUB_REPO || 'adirosh27/PeterPanBoca';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

export interface GalleryFile {
  path: string; // Blob pathname, e.g. images/2025/<event>/IMG_1.jpg
  name: string;
  url: string; // public Blob URL
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

/** A path is deletable only if it is a media file at images/<year>/<event>/<file> in Blob. */
export function isDeletablePath(p: unknown): p is string {
  if (typeof p !== 'string' || !p.startsWith(IMAGES_PREFIX)) return false;
  const rest = p.slice(IMAGES_PREFIX.length).split('/');
  if (rest.length !== 3) return false;
  if (rest.some((seg) => !seg || seg === '.' || seg === '..' || seg.includes('\\'))) return false;
  return MEDIA_RE.test(p);
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

// ---------- Blob ----------

function requireBlobToken() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error('BLOB_READ_WRITE_TOKEN is not set');
}

async function listBlob(): Promise<GalleryFile[]> {
  requireBlobToken();
  const files: GalleryFile[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: IMAGES_PREFIX, cursor, limit: 1000 });
    for (const b of page.blobs) {
      if (!isDeletablePath(b.pathname)) continue;
      const name = b.pathname.split('/').pop()!;
      files.push({
        path: b.pathname,
        name,
        url: b.url,
        size: b.size,
        type: /\.(mp4|mov|webm)$/i.test(name) ? 'video' : 'image',
      });
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return files;
}

// ---------- Manifest ----------

type Manifest = Record<string, { urlPrefix: string; images: { name: string; url: string }[] }>;

function removeFromManifest(manifest: Manifest, paths: string[]) {
  const byEvent = new Map<string, Set<string>>();
  for (const p of paths) {
    const [year, event, name] = p.slice(IMAGES_PREFIX.length).split('/');
    const key = `${year}/${event}`;
    if (!byEvent.has(key)) byEvent.set(key, new Set());
    byEvent.get(key)!.add(name);
  }
  for (const [key, names] of byEvent) {
    if (manifest[key]) manifest[key].images = manifest[key].images.filter((img) => !names.has(img.name));
  }
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

async function commitManifestToGithub(paths: string[]): Promise<{ commitUrl: string }> {
  const ref = await gh<{ object: { sha: string } }>(`/git/ref/heads/${encodeURIComponent(GITHUB_BRANCH)}`);
  const commitSha = ref.object.sha;
  const head = await gh<{ tree: { sha: string } }>(`/git/commits/${commitSha}`);

  const manifestFile = await gh<{ content: string }>(
    `/contents/${MANIFEST_PATH}?ref=${encodeURIComponent(GITHUB_BRANCH)}`
  );
  const manifest = JSON.parse(Buffer.from(manifestFile.content, 'base64').toString('utf-8'));
  removeFromManifest(manifest, paths);

  const tree = await gh<{ sha: string }>(`/git/trees`, {
    method: 'POST',
    body: JSON.stringify({
      base_tree: head.tree.sha,
      tree: [{ path: MANIFEST_PATH, mode: '100644', type: 'blob', content: JSON.stringify(manifest) }],
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

async function writeManifestLocally(paths: string[]) {
  const manifestAbs = path.join(process.cwd(), MANIFEST_PATH);
  const manifest = JSON.parse(await fs.readFile(manifestAbs, 'utf-8'));
  removeFromManifest(manifest, paths);
  await fs.writeFile(manifestAbs, JSON.stringify(manifest));
}

// ---------- API ----------

export async function listGallery(): Promise<GalleryEvent[]> {
  if (getMode() === 'unconfigured') throw new Error('GITHUB_TOKEN is not set on this deployment');
  return groupByEvent(await listBlob());
}

export async function deletePhotos(paths: string[]): Promise<{ mode: Mode; commitUrl?: string }> {
  const mode = getMode();
  if (mode === 'unconfigured') throw new Error('GITHUB_TOKEN is not set on this deployment');
  requireBlobToken();

  let commitUrl: string | undefined;
  if (mode === 'github') ({ commitUrl } = await commitManifestToGithub(paths));
  else await writeManifestLocally(paths);

  await del(paths);
  return { mode, commitUrl };
}
