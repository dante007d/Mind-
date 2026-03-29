import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { useBookStore } from '../store/useBookStore';
import { Book } from '../types';
import { Plus, BookOpen, Trash2, Upload, Loader2, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { parseEpub } from '../services/epubService';

export default function Library() {
  const library = useBookStore((state) => state.library);
  const setActiveBook = useBookStore((state) => state.setActiveBook);
  const removeBook = useBookStore((state) => state.removeBook);
  const addBook = useBookStore((state) => state.addBook);
  
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const book = await parseEpub(file);
      addBook(book);
    } catch (err: any) {
      setError(err.message || 'Failed to parse the ancient codex.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-6 py-12 h-screen overflow-y-auto"
    >
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-display mb-2 tracking-wider">Digital Sanctum</h1>
          <p className="text-[var(--ink)] opacity-60 font-serif italic">Your personal codex collection</p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <input 
            type="file" 
            accept=".epub" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-[var(--bg)] rounded-sm font-display hover:bg-[var(--accent-hover)] transition-all disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
            <span>{isUploading ? 'Parsing Codex...' : 'Add Tome'}</span>
          </button>
          <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">Supports .epub format</span>
        </div>
      </header>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-sm flex items-center justify-between text-red-500 overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <X size={20} />
              <span className="font-serif italic">{error}</span>
            </div>
            <button onClick={() => setError(null)} className="p-1 hover:bg-red-500/10 rounded-full">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
        {library.map((book) => (
          <BookCard 
            key={book.id} 
            book={book} 
            onOpen={() => setActiveBook(book.id)}
            onDelete={() => removeBook(book.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}

function BookCard({ book, onOpen, onDelete }: { book: Book; onOpen: () => void; onDelete: () => void; key?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="relative group cursor-pointer"
      onClick={onOpen}
    >
      <div 
        style={{ transform: "translateZ(50px)" }}
        className="relative aspect-[2/3] bg-[var(--accent-muted)] rounded-sm overflow-hidden border border-[var(--border)] shadow-2xl transition-shadow group-hover:shadow-[var(--accent-muted)]"
      >
        {book.coverUrl ? (
          <img 
            src={book.coverUrl} 
            alt={book.title} 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <BookOpen size={48} className="mb-4 opacity-20" />
            <span className="font-display text-lg">{book.title}</span>
          </div>
        )}
        
        {/* Progress Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--border)]">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${book.progress}%` }}
            className="h-full bg-[var(--accent)]"
          />
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); onOpen(); }}
            className="p-3 bg-[var(--bg)] text-[var(--ink)] rounded-full hover:scale-110 transition-transform"
          >
            <BookOpen size={24} />
          </button>
          {!book.isSample && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-3 bg-red-900 text-white rounded-full hover:scale-110 transition-transform"
            >
              <Trash2 size={24} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4" style={{ transform: "translateZ(20px)" }}>
        <h3 className="font-display text-xl tracking-tight">{book.title}</h3>
        <p className="font-serif italic opacity-60 text-sm">{book.author}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">Progress</span>
          <span className="font-mono text-[10px] text-[var(--accent)]">{Math.round(book.progress)}%</span>
        </div>
      </div>
    </motion.div>
  );
}
