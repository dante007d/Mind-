import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Book, Highlight, Bookmark, VocabWord, ReadingStats } from '../types';
import { SAMPLE_BOOK } from '../constants';

interface BookState {
  library: Book[];
  activeBookId: string | null;
  highlights: Highlight[];
  bookmarks: Bookmark[];
  vocab: VocabWord[];
  stats: ReadingStats;
  
  // Actions
  addBook: (book: Book) => void;
  removeBook: (id: string) => void;
  setActiveBook: (id: string | null) => void;
  updateProgress: (bookId: string, progress: number, chapterId?: string, offset?: number) => void;
  
  addHighlight: (highlight: Highlight) => void;
  removeHighlight: (id: string) => void;
  
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (id: string) => void;
  
  addVocab: (vocab: VocabWord) => void;
  removeVocab: (word: string) => void;
  
  updateStats: (pages: number, time: number) => void;
}

export const useBookStore = create<BookState>()(
  persist(
    (set, get) => ({
      library: [SAMPLE_BOOK],
      activeBookId: null,
      highlights: [],
      bookmarks: [],
      vocab: [],
      stats: {
        totalReadingTime: 0,
        wpm: 0,
        streak: 0,
        dailyGoal: 50,
        history: {},
      },

      addBook: (book) => set((state) => ({ library: [...state.library, book] })),
      removeBook: (id) => set((state) => ({ library: state.library.filter((b) => b.id !== id) })),
      setActiveBook: (id) => set({ activeBookId: id }),
      
      updateProgress: (bookId, progress, chapterId, offset) => set((state) => ({
        library: state.library.map((b) => 
          b.id === bookId ? { ...b, progress, lastReadChapterId: chapterId, lastReadOffset: offset } : b
        )
      })),

      addHighlight: (highlight) => set((state) => ({ highlights: [...state.highlights, highlight] })),
      removeHighlight: (id) => set((state) => ({ highlights: state.highlights.filter((h) => h.id !== id) })),

      addBookmark: (bookmark) => set((state) => ({ bookmarks: [...state.bookmarks, bookmark] })),
      removeBookmark: (id) => set((state) => ({ bookmarks: state.bookmarks.filter((b) => b.id !== id) })),

      addVocab: (vocab) => set((state) => ({ vocab: [...state.vocab, vocab] })),
      removeVocab: (word) => set((state) => ({ vocab: state.vocab.filter((v) => v.word !== word) })),

      updateStats: (pages, time) => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        const history = { ...state.stats.history };
        history[today] = (history[today] || 0) + pages;
        
        return {
          stats: {
            ...state.stats,
            totalReadingTime: state.stats.totalReadingTime + time,
            history,
          }
        };
      }),
    }),
    {
      name: 'book-reader-data',
    }
  )
);
