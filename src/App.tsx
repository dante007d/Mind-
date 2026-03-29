import React, { useEffect, useState } from 'react';
import { useSettingsStore } from './store/useSettingsStore';
import { useBookStore } from './store/useBookStore';
import { THEMES } from './constants';
import Library from './components/Library';
import Reader from './components/Reader';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const theme = useSettingsStore((state) => state.theme);
  const activeBookId = useBookStore((state) => state.activeBookId);
  const library = useBookStore((state) => state.library);
  const activeBook = library.find((b) => b.id === activeBookId);

  useEffect(() => {
    const root = document.documentElement;
    const themeColors = THEMES[theme];
    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] transition-colors duration-500 overflow-hidden">
      {/* Paper Grain Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply z-[9999]">
        <svg width="100%" height="100%">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {!activeBookId ? (
          <Library key="library" />
        ) : (
          <Reader key="reader" book={activeBook!} />
        )}
      </AnimatePresence>
    </div>
  );
}
