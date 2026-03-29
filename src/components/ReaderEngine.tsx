import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useBookStore } from '../store/useBookStore';
import { Chapter, ReadingMode } from '../types';
import { cn } from '../lib/utils';
import { Virtuoso } from 'react-virtuoso';
import SelectionMenu from './SelectionMenu';
import { Bookmark as BookmarkIcon } from 'lucide-react';

interface ReaderEngineProps {
  chapter: Chapter;
  mode: ReadingMode;
  isFocusMode: boolean;
  onProgressUpdate: (progress: number) => void;
  onDefine: (word: string) => void;
  scrollToIndex?: number;
  key?: string;
}

export default function ReaderEngine({ chapter, mode, isFocusMode, onProgressUpdate, onDefine, scrollToIndex }: ReaderEngineProps) {
  const virtuosoRef = useRef<any>(null);
  const settings = useSettingsStore();
  const addBookmark = useBookStore((state) => state.addBookmark);
  const addHighlight = useBookStore((state) => state.addHighlight);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selection, setSelection] = useState<{ x: number; y: number; text: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollToIndex !== undefined && virtuosoRef.current && mode === 'scroll') {
      virtuosoRef.current.scrollToIndex({
        index: scrollToIndex,
        align: 'start',
        behavior: 'smooth'
      });
    }
  }, [scrollToIndex, mode]);

  // Handle text selection
  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 0) {
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelection({
        x: rect.left + rect.width / 2,
        y: rect.top,
        text: sel.toString().trim(),
      });
    } else {
      setSelection(null);
    }
  }, []);

  const handleHighlight = (color: string) => {
    if (selection) {
      addHighlight({
        id: Math.random().toString(36).substr(2, 9),
        bookId: 'meditations-marcus-aurelius',
        chapterId: chapter.id,
        offset: 0, // Simplified for now
        length: selection.text.length,
        text: selection.text,
        color,
        timestamp: Date.now(),
      });
      setSelection(null);
      window.getSelection()?.removeAllRanges();
    }
  };

  const handleBookmark = (paragraphText: string) => {
    addBookmark({
      id: Math.random().toString(36).substr(2, 9),
      bookId: 'meditations-marcus-aurelius',
      chapterId: chapter.id,
      offset: 0,
      textSnippet: paragraphText.substring(0, 100),
      chapterName: chapter.title,
      timestamp: Date.now(),
    });
  };

  // Split content into paragraphs for virtual scrolling
  const paragraphs = useMemo(() => {
    const div = document.createElement('div');
    div.innerHTML = chapter.content;
    return Array.from(div.children).map(child => child.outerHTML);
  }, [chapter.content]);

  // Calculate pages for paginated mode
  useEffect(() => {
    if (mode === 'paginated' && containerRef.current && contentRef.current) {
      const viewportHeight = containerRef.current.clientHeight;
      const contentHeight = contentRef.current.scrollHeight;
      setTotalPages(Math.ceil(contentHeight / viewportHeight));
    }
  }, [mode, chapter.content, settings]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (mode === 'scroll') {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      onProgressUpdate(progress);
    }
  };

  const handlePageTurn = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const readingWidthClass = {
    narrow: 'max-w-2xl',
    medium: 'max-w-4xl',
    wide: 'max-w-6xl',
    full: 'max-w-full',
  }[settings.readingWidth];

  const fontStyles = {
    fontSize: `${settings.fontSize}px`,
    lineHeight: settings.lineHeight,
    letterSpacing: `${settings.letterSpacing}px`,
    fontFamily: settings.fontFamily,
    textAlign: settings.textAlign as any,
    padding: `${settings.margin}px`,
  };

  return (
    <div 
      ref={containerRef}
      onMouseUp={handleMouseUp}
      className={cn(
        "flex-1 h-full overflow-hidden relative flex flex-col items-center z-10",
        isFocusMode ? "bg-black" : "bg-[var(--bg)]"
      )}
    >
      <AnimatePresence>
        {selection && (
          <SelectionMenu 
            position={selection}
            onHighlight={handleHighlight}
            onDefine={() => {
              onDefine(selection.text);
              setSelection(null);
            }}
            onCopy={() => {
              navigator.clipboard.writeText(selection.text);
              setSelection(null);
            }}
            onAddNote={() => {
              // TODO: Implement notes
              setSelection(null);
            }}
            onSearch={() => {
              // TODO: Implement search
              setSelection(null);
            }}
            onClose={() => setSelection(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {mode === 'scroll' ? (
          <motion.div
            key="scroll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <Virtuoso
              ref={virtuosoRef}
              style={{ height: '100%', width: '100%' }}
              data={paragraphs}
              components={{
                Header: () => (
                  <div className={cn("mx-auto py-20 text-center", readingWidthClass)}>
                    <span className="font-display text-[var(--accent)] text-6xl opacity-20 mb-4 block">✦</span>
                    <h1 className="text-5xl font-display mb-8 tracking-widest">{chapter.title}</h1>
                    <div className="flex items-center justify-center gap-4 opacity-30 mb-12">
                      <div className="h-px w-12 bg-[var(--ink)]" />
                      <span className="text-xl">❧</span>
                      <div className="h-px w-12 bg-[var(--ink)]" />
                    </div>
                  </div>
                )
              }}
              itemContent={(index, paragraph) => (
                <div className="relative group">
                  {/* Bookmark Ribbon */}
                  {!isFocusMode && (
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      onClick={() => handleBookmark(paragraph)}
                      className="absolute left-[-40px] top-2 p-2 text-[var(--accent)] opacity-0 group-hover:opacity-40 transition-all"
                    >
                      <BookmarkIcon size={20} />
                    </motion.button>
                  )}
                  
                  <div 
                    className={cn(
                      "mx-auto transition-all duration-500",
                      readingWidthClass
                    )}
                    style={fontStyles}
                    dangerouslySetInnerHTML={{ __html: paragraph }}
                  />
                </div>
              )}
              onScroll={handleScroll}
            />
          </motion.div>
        ) : (
          <motion.div
            key="paginated"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex flex-col items-center"
          >
            <div 
              className={cn(
                "flex-1 w-full overflow-hidden relative",
                readingWidthClass
              )}
            >
              <motion.div
                ref={contentRef}
                animate={{ y: -currentPage * (containerRef.current?.clientHeight || 0) }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0"
                style={fontStyles}
              >
                <div className="py-12 text-center">
                  <span className="font-display text-[var(--accent)] text-4xl opacity-20 mb-2 block">✦</span>
                  <h1 className="text-4xl font-display mb-6 tracking-widest">{chapter.title}</h1>
                  <div className="flex items-center justify-center gap-3 opacity-30 mb-8">
                    <div className="h-px w-8 bg-[var(--ink)]" />
                    <span className="text-lg">❧</span>
                    <div className="h-px w-8 bg-[var(--ink)]" />
                  </div>
                </div>
                <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
              </motion.div>
            </div>

            {/* Pagination Controls */}
            <div className="h-12 w-full flex items-center justify-between px-8 border-t border-[var(--border)] bg-[var(--bg)]/50 backdrop-blur-sm z-50">
              <button 
                onClick={() => handlePageTurn('prev')}
                disabled={currentPage === 0}
                className="font-display text-sm uppercase tracking-widest opacity-60 hover:opacity-100 disabled:opacity-20"
              >
                Previous
              </button>
              <div className="font-mono text-xs opacity-40">
                PAGE {currentPage + 1} OF {totalPages}
              </div>
              <button 
                onClick={() => handlePageTurn('next')}
                disabled={currentPage === totalPages - 1}
                className="font-display text-sm uppercase tracking-widest opacity-60 hover:opacity-100 disabled:opacity-20"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
