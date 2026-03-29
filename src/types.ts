export type Theme = 'light' | 'dark' | 'sepia' | 'night';

export type FontStyle = 'Lora' | 'Merriweather' | 'OpenDyslexic' | 'Georgia';

export type ReadingMode = 'scroll' | 'paginated';

export interface BookSettings {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  fontFamily: FontStyle;
  theme: Theme;
  readingWidth: 'narrow' | 'medium' | 'wide' | 'full';
  textAlign: 'left' | 'justified';
  margin: number;
}

export interface Highlight {
  id: string;
  bookId: string;
  chapterId: string;
  offset: number;
  length: number;
  text: string;
  color: string;
  note?: string;
  timestamp: number;
}

export interface Bookmark {
  id: string;
  bookId: string;
  chapterId: string;
  offset: number;
  textSnippet: string;
  chapterName: string;
  timestamp: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  progress: number;
  lastReadChapterId?: string;
  lastReadOffset?: number;
  content: Chapter[];
  isSample?: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  content: string; // HTML or Markdown
  sections?: Chapter[];
}

export interface ReadingSession {
  bookId: string;
  startTime: number;
  endTime?: number;
  pagesRead: number;
}

export interface ReadingStats {
  totalReadingTime: number; // minutes
  wpm: number;
  streak: number;
  dailyGoal: number; // pages
  history: Record<string, number>; // date string -> pages read
}

export interface VocabWord {
  word: string;
  definition: string;
  phonetic?: string;
  audio?: string;
  timestamp: number;
}
