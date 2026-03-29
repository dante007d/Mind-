import React from 'react';
import { motion } from 'motion/react';
import { useBookStore } from '../store/useBookStore';
import { Book, Chapter, Highlight, Bookmark } from '../types';
import { X, List, Highlighter, Bookmark as BookmarkIcon, BarChart2, Notebook, Trash2, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface ReaderSidebarProps {
  tab: 'toc' | 'highlights' | 'bookmarks' | 'stats' | 'notes';
  onClose: () => void;
  book: Book;
  activeChapterIndex: number;
  onChapterSelect: (index: number) => void;
}

export default function ReaderSidebar({ tab, onClose, book, activeChapterIndex, onChapterSelect }: ReaderSidebarProps) {
  const highlights = useBookStore((state) => state.highlights.filter(h => h.bookId === book.id));
  const bookmarks = useBookStore((state) => state.bookmarks.filter(b => b.bookId === book.id));
  const stats = useBookStore((state) => state.stats);

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -400, opacity: 0 },
  };

  return (
    <motion.aside
      initial="closed"
      animate="open"
      exit="closed"
      variants={sidebarVariants}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-y-0 left-0 w-[400px] bg-[var(--bg)] border-r border-[var(--border)] z-[100] flex flex-col shadow-2xl"
    >
      <header className="h-16 border-b border-[var(--border)] flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          {tab === 'toc' && <List size={20} className="text-[var(--accent)]" />}
          {tab === 'highlights' && <Highlighter size={20} className="text-[var(--accent)]" />}
          {tab === 'bookmarks' && <BookmarkIcon size={20} className="text-[var(--accent)]" />}
          {tab === 'stats' && <BarChart2 size={20} className="text-[var(--accent)]" />}
          {tab === 'notes' && <Notebook size={20} className="text-[var(--accent)]" />}
          <h2 className="font-display text-lg uppercase tracking-widest">{tab}</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-[var(--accent-muted)] rounded-full transition-colors">
          <X size={20} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        {tab === 'toc' && (
          <div className="flex flex-col gap-2">
            {book.content.map((chapter, i) => (
              <button
                key={chapter.id}
                onClick={() => onChapterSelect(i)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-sm border border-transparent transition-all group",
                  i === activeChapterIndex 
                    ? "bg-[var(--accent-muted)] border-[var(--accent)] text-[var(--accent)]" 
                    : "hover:bg-[var(--accent-muted)]/50 hover:border-[var(--border)]"
                )}
              >
                <div className="flex flex-col items-start">
                  <span className="font-mono text-[10px] uppercase tracking-widest opacity-40 mb-1">Chapter {i + 1}</span>
                  <span className="font-serif font-bold text-lg">{chapter.title}</span>
                </div>
                <ChevronRight size={16} className={cn("opacity-0 group-hover:opacity-100 transition-opacity", i === activeChapterIndex && "opacity-100")} />
              </button>
            ))}
          </div>
        )}

        {tab === 'highlights' && (
          <div className="flex flex-col gap-6">
            {highlights.length === 0 ? (
              <EmptyState icon={<Highlighter size={48} />} message="No highlights yet. Select text to highlight." />
            ) : (
              highlights.map((h) => (
                <HighlightCard key={h.id} highlight={h} />
              ))
            )}
          </div>
        )}

        {tab === 'bookmarks' && (
          <div className="flex flex-col gap-6">
            {bookmarks.length === 0 ? (
              <EmptyState icon={<BookmarkIcon size={48} />} message="No bookmarks yet. Click the ribbon to bookmark." />
            ) : (
              bookmarks.map((b) => (
                <BookmarkCard key={b.id} bookmark={b} />
              ))
            )}
          </div>
        )}

        {tab === 'stats' && (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Total Time" value={`${stats.totalReadingTime}m`} />
              <StatCard label="Reading Speed" value={`${stats.wpm} WPM`} />
              <StatCard label="Current Streak" value={`${stats.streak} Days`} />
              <StatCard label="Completion" value={`${Math.round(book.progress)}%`} />
            </div>
            
            <div className="p-6 bg-[var(--accent-muted)] rounded-sm border border-[var(--accent)]/20">
              <h3 className="font-display text-sm uppercase tracking-widest mb-4 opacity-60">Reading Activity</h3>
              <div className="flex items-end gap-1 h-32">
                {Object.values(stats.history).slice(-7).map((pages, i) => (
                  <div 
                    key={i}
                    style={{ height: `${Math.min(100, (pages / stats.dailyGoal) * 100)}%` }}
                    className="flex-1 bg-[var(--accent)] rounded-t-sm opacity-60 hover:opacity-100 transition-opacity"
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 font-mono text-[10px] opacity-40">
                <span>MON</span>
                <span>SUN</span>
              </div>
            </div>
          </div>
        )}

        {tab === 'notes' && (
          <div className="flex flex-col gap-6">
            <EmptyState icon={<Notebook size={48} />} message="No notes yet. Add notes to your highlights." />
          </div>
        )}
      </div>
    </motion.aside>
  );
}

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
      <div className="mb-6">{icon}</div>
      <p className="font-serif italic text-lg">{message}</p>
    </div>
  );
}

function HighlightCard({ highlight }: { highlight: Highlight; key?: string }) {
  return (
    <div className="relative p-4 rounded-sm border border-[var(--border)] bg-[var(--bg)] shadow-sm hover:shadow-md transition-shadow group">
      <div 
        className="absolute top-0 left-0 bottom-0 w-1 rounded-l-sm"
        style={{ backgroundColor: highlight.color }}
      />
      <p className="font-serif italic text-sm mb-3 opacity-80 leading-relaxed">"{highlight.text}"</p>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">{format(highlight.timestamp, 'MMM d, yyyy')}</span>
        <button className="p-1.5 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

function BookmarkCard({ bookmark }: { bookmark: Bookmark; key?: string }) {
  return (
    <div className="relative p-5 rounded-sm border border-[var(--border)] bg-[var(--bg)] shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
      {/* Folded Corner Effect */}
      <div className="absolute top-0 right-0 w-6 h-6 bg-[var(--accent-muted)] border-l border-b border-[var(--border)] origin-top-right transform -translate-x-1 translate-y-1 rotate-45" />
      
      <div className="flex flex-col gap-2">
        <span className="font-display text-[10px] uppercase tracking-widest text-[var(--accent)]">{bookmark.chapterName}</span>
        <p className="font-serif italic text-sm opacity-80 line-clamp-2 leading-relaxed">"{bookmark.textSnippet}"</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">{format(bookmark.timestamp, 'MMM d, h:mm a')}</span>
          <button className="p-1.5 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-sm flex flex-col items-center text-center">
      <span className="font-mono text-[10px] uppercase tracking-widest opacity-40 mb-1">{label}</span>
      <span className="font-display text-xl text-[var(--accent)]">{value}</span>
    </div>
  );
}
