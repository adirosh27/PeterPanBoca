'use client';

import { useTheme } from './ThemeProvider';
import { themes } from '@/lib/themes';
import { useEffect } from 'react';

export default function ThemedBody({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const themeConfig = themes[theme];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Apply body background class
      document.body.className = `min-h-screen flex flex-col ${themeConfig.body}`;
    }
  }, [theme, themeConfig.body]);

  return <>{children}</>;
}