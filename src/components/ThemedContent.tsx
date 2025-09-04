'use client';

import { useTheme } from './ThemeProvider';
import { themes, ThemeConfig } from '@/lib/themes';

interface ThemedContentProps {
  children: (themeConfig: ThemeConfig) => React.ReactNode;
}

export default function ThemedContent({ children }: ThemedContentProps) {
  const { theme } = useTheme();
  const themeConfig = themes[theme];
  
  return <>{children(themeConfig)}</>;
}