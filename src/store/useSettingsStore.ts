import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BookSettings, Theme, FontStyle } from '../types';

interface SettingsState extends BookSettings {
  setTheme: (theme: Theme) => void;
  setFontSize: (size: number) => void;
  setLineHeight: (height: number) => void;
  setLetterSpacing: (spacing: number) => void;
  setFontFamily: (font: FontStyle) => void;
  setReadingWidth: (width: BookSettings['readingWidth']) => void;
  setTextAlign: (align: BookSettings['textAlign']) => void;
  setMargin: (margin: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      fontSize: 18,
      lineHeight: 1.6,
      letterSpacing: 0,
      fontFamily: 'Lora',
      readingWidth: 'medium',
      textAlign: 'justified',
      margin: 40,

      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setLineHeight: (lineHeight) => set({ lineHeight }),
      setLetterSpacing: (letterSpacing) => set({ letterSpacing }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setReadingWidth: (readingWidth) => set({ readingWidth }),
      setTextAlign: (textAlign) => set({ textAlign }),
      setMargin: (margin) => set({ margin }),
    }),
    {
      name: 'book-reader-settings',
    }
  )
);
