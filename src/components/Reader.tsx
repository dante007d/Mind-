import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useBookStore } from '../store/useBookStore';
import { Book, Chapter, ReadingMode } from '../types';
import ReaderEngine from './ReaderEngine';
import ReaderSidebar from './ReaderSidebar';
import ReaderOverlay from './ReaderOverlay';
import ReaderControls from './ReaderControls';
import { ChevronLeft, Menu, Settings, Search, Bookmark, Highlighter, BarChart2, Notebook, Maximize2, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface ReaderProps {
  book: Book;
  key?: string;
}

export default function Reader({ book }: ReaderProps) {
  const setActiveBook = useBookStore((state) => state.setActiveBook);
  const updateProgress = useBookStore((state) => state.updateProgress);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [readingMode, setReadingMode] = useState<ReadingMode>('scroll');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'toc' | 'highlights' | 'bookmarks' | 'stats' | 'notes'>('toc');
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [overlayType, setOverlayType] = useState<'settings' | 'search' | 'dictionary' | 'shortcuts' | null>(null);
  const [dictionaryWord, setDictionaryWord] = useState<string | undefined>(undefined);
  const [scrollToIndex, setScrollToIndex] = useState<number | undefined>(undefined);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(100);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const updateStats = useBookStore((state) => state.updateStats);
  const [progress, setProgress] = useState(book.progress);

  // Track reading time
  useEffect(() => {
    if (isFocusMode || !isSidebarOpen) { // Only track when reading
      const interval = setInterval(() => {
        updateStats(0.1, 1); // 1 second, 0.1 "pages" (simulated)
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isFocusMode, isSidebarOpen, updateStats]);

  const activeChapter = book.content[activeChapterIndex];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'f') {
          e.preventDefault();
          setOverlayType('search');
          setIsOverlayOpen(true);
        } else if (e.key === 'b') {
          e.preventDefault();
          setSidebarTab('bookmarks');
          setIsSidebarOpen(true);
        } else if (e.key === 't') {
          e.preventDefault();
          setSidebarTab('toc');
          setIsSidebarOpen(true);
        }
      } else if (e.key === 'f') {
        setIsFocusMode(!isFocusMode);
      } else if (e.key === 's') {
        setOverlayType('settings');
        setIsOverlayOpen(true);
      } else if (e.key === 'h') {
        setSidebarTab('highlights');
        setIsSidebarOpen(true);
      } else if (e.key === 'm') {
        setReadingMode(readingMode === 'scroll' ? 'paginated' : 'scroll');
      } else if (e.key === 'a') {
        setIsAutoScrolling(!isAutoScrolling);
      } else if (e.key === 'ArrowRight') {
        if (activeChapterIndex < book.content.length - 1) setActiveChapterIndex(activeChapterIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        if (activeChapterIndex > 0) setActiveChapterIndex(activeChapterIndex - 1);
      } else if (e.key === 'Escape') {
        setIsSidebarOpen(false);
        setIsOverlayOpen(false);
        setIsFocusMode(false);
      } else if (e.key === '?') {
        setOverlayType('shortcuts');
        setIsOverlayOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode, activeChapterIndex, readingMode, isAutoScrolling, book.content.length]);

  useEffect(() => {
    if (isAutoScrolling && readingMode === 'scroll') {
      const scrollSpeed = 1000 / (autoScrollSpeed / 60); // ms per pixel roughly
      scrollIntervalRef.current = setInterval(() => {
        window.scrollBy(0, 1);
      }, 50); // smooth scroll
    } else {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    }
    return () => {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    };
  }, [isAutoScrolling, autoScrollSpeed, readingMode]);

  const handleChapterChange = (index: number) => {
    setActiveChapterIndex(index);
    setIsSidebarOpen(false);
    // Update progress based on chapter
    const newProgress = (index / book.content.length) * 100;
    setProgress(newProgress);
    updateProgress(book.id, newProgress, book.content[index].id);
  };

  return (
    <div className={cn(
      "relative h-screen flex flex-col transition-all duration-1000",
      isFocusMode && "bg-black"
    )}>
      {/* Top Progress Bar */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress / 100 }}
        className="fixed top-0 left-0 right-0 h-0.5 bg-[var(--accent)] origin-left z-[100]"
      />

      {/* Header Toolbar */}
      <AnimatePresence>
        {!isFocusMode && (
          <motion.header 
            initial={{ y: -60 }}
            animate={{ y: 0 }}
            exit={{ y: -60 }}
            className="h-16 border-b border-[var(--border)] flex items-center justify-between px-6 z-50 bg-[var(--bg)]/80 backdrop-blur-md"
          >
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveBook(null)}
                className="p-2 hover:bg-[var(--accent-muted)] rounded-full transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="flex flex-col">
                <span className="font-display text-sm tracking-widest uppercase opacity-40 leading-none">Reading</span>
                <span className="font-serif font-bold text-lg">{book.title}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ToolbarButton icon={<Menu size={20} />} onClick={() => { setSidebarTab('toc'); setIsSidebarOpen(true); }} />
              <ToolbarButton icon={<Search size={20} />} onClick={() => { setOverlayType('search'); setIsOverlayOpen(true); }} />
              <ToolbarButton icon={<Bookmark size={20} />} onClick={() => { setSidebarTab('bookmarks'); setIsSidebarOpen(true); }} />
              <ToolbarButton icon={<Highlighter size={20} />} onClick={() => { setSidebarTab('highlights'); setIsSidebarOpen(true); }} />
              <ToolbarButton icon={<BarChart2 size={20} />} onClick={() => { setSidebarTab('stats'); setIsSidebarOpen(true); }} />
              <ToolbarButton icon={<Notebook size={20} />} onClick={() => { setSidebarTab('notes'); setIsSidebarOpen(true); }} />
              <div className="w-px h-6 bg-[var(--border)] mx-2" />
              <ToolbarButton icon={<Maximize2 size={20} />} onClick={() => setIsFocusMode(true)} />
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main Reading Area */}
      <main className="flex-1 relative overflow-hidden flex">
        <ReaderEngine 
          chapter={activeChapter} 
          mode={readingMode} 
          isFocusMode={isFocusMode}
          onProgressUpdate={(p) => setProgress(p)}
          onDefine={(word) => {
            setDictionaryWord(word);
            setOverlayType('dictionary');
            setIsOverlayOpen(true);
          }}
          scrollToIndex={scrollToIndex}
        />

        {/* Chapter Progress Indicator (Right Side) */}
        {!isFocusMode && (
          <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40">
            {book.content.map((_, i) => (
              <button
                key={i}
                onClick={() => handleChapterChange(i)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  i === activeChapterIndex ? "h-8 bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" : "bg-[var(--border)] hover:bg-[var(--accent-muted)]"
                )}
              />
            ))}
          </div>
        )}
      </main>

      {/* Reader Bottom Controls */}
      {!isFocusMode && (
        <ReaderControls 
          mode={readingMode}
          onModeToggle={() => setReadingMode(readingMode === 'scroll' ? 'paginated' : 'scroll')}
          onAutoScrollToggle={() => setIsAutoScrolling(!isAutoScrolling)}
          isAutoScrolling={isAutoScrolling}
          autoScrollSpeed={autoScrollSpeed}
          onAutoScrollSpeedChange={setAutoScrollSpeed}
        />
      )}

      {/* Floating Settings Button */}
      {!isFocusMode && (
        <motion.button
          whileHover={{ rotate: 90 }}
          onClick={() => { setOverlayType('settings'); setIsOverlayOpen(true); }}
          className="fixed bottom-24 right-8 p-4 bg-[var(--accent)] text-[var(--bg)] rounded-full shadow-2xl z-50 hover:bg-[var(--accent-hover)] transition-colors"
        >
          <Settings size={24} />
        </motion.button>
      )}

      {/* Focus Mode Exit Button */}
      {isFocusMode && (
        <motion.button
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          onClick={() => setIsFocusMode(false)}
          className="fixed top-8 right-8 p-2 text-[var(--ink)] opacity-20 hover:opacity-100 transition-opacity z-[100]"
        >
          <X size={32} />
        </motion.button>
      )}

      {/* Sidebars & Overlays */}
      <AnimatePresence>
        {isSidebarOpen && (
          <ReaderSidebar 
            tab={sidebarTab} 
            onClose={() => setIsSidebarOpen(false)} 
            book={book}
            activeChapterIndex={activeChapterIndex}
            onChapterSelect={handleChapterChange}
          />
        )}
        {isOverlayOpen && (
          <ReaderOverlay 
            type={overlayType} 
            onClose={() => setIsOverlayOpen(false)} 
            book={book}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            dictionaryWord={dictionaryWord}
            onResultClick={(chapterIdx, offset) => {
              setActiveChapterIndex(chapterIdx);
              setIsOverlayOpen(false);
              
              // Find paragraph index for the offset
              const chapter = book.content[chapterIdx];
              const paragraphs = chapter.content.split(/\n\n+/);
              let currentOffset = 0;
              let paragraphIndex = 0;
              
              for (let i = 0; i < paragraphs.length; i++) {
                if (offset >= currentOffset && offset < currentOffset + paragraphs[i].length + 2) {
                  paragraphIndex = i;
                  break;
                }
                currentOffset += paragraphs[i].length + 2; // +2 for the split characters
              }
              
              setScrollToIndex(paragraphIndex);
              // Reset after a delay to allow re-triggering
              setTimeout(() => setScrollToIndex(undefined), 100);
            }}
          />
        )}
      </AnimatePresence>

      {/* Ambient Breathing Background (Focus Mode) */}
      {isFocusMode && (
        <motion.div 
          animate={{ opacity: [0.01, 0.03, 0.01] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="fixed inset-0 bg-[var(--accent)] pointer-events-none z-0"
        />
      )}
    </div>
  );
}

function ToolbarButton({ icon, onClick }: { icon: React.ReactNode; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="p-2.5 text-[var(--ink)] opacity-60 hover:opacity-100 hover:bg-[var(--accent-muted)] rounded-sm transition-all"
    >
      {icon}
    </button>
  );
}
