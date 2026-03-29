import React from 'react';
import { motion } from 'motion/react';
import { Highlighter, Book, Copy, Notebook, Search, X } from 'lucide-react';

interface SelectionMenuProps {
  position: { x: number; y: number };
  onHighlight: (color: string) => void;
  onDefine: () => void;
  onCopy: () => void;
  onAddNote: () => void;
  onSearch: () => void;
  onClose: () => void;
}

export default function SelectionMenu({ position, onHighlight, onDefine, onCopy, onAddNote, onSearch, onClose }: SelectionMenuProps) {
  const colors = [
    { name: 'yellow', value: '#FFEB3B' },
    { name: 'amber', value: '#FFC107' },
    { name: 'green', value: '#4CAF50' },
    { name: 'pink', value: '#E91E63' },
    { name: 'purple', value: '#9C27B0' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      style={{ left: position.x, top: position.y }}
      className="fixed z-[300] -translate-x-1/2 -translate-y-full mb-4 bg-[var(--bg)] border border-[var(--border)] rounded-sm shadow-2xl flex flex-col overflow-hidden min-w-[200px]"
    >
      <div className="flex items-center gap-1 p-2 border-b border-[var(--border)]">
        {colors.map((c) => (
          <button
            key={c.name}
            onClick={() => onHighlight(c.value)}
            style={{ backgroundColor: c.value }}
            className="w-6 h-6 rounded-full border border-black/10 hover:scale-110 transition-transform"
          />
        ))}
        <div className="w-px h-4 bg-[var(--border)] mx-1" />
        <button onClick={onClose} className="p-1 hover:bg-[var(--accent-muted)] rounded-full">
          <X size={14} />
        </button>
      </div>
      
      <div className="flex flex-col">
        <MenuButton icon={<Book size={14} />} label="Define" onClick={onDefine} />
        <MenuButton icon={<Copy size={14} />} label="Copy" onClick={onCopy} />
        <MenuButton icon={<Notebook size={14} />} label="Add Note" onClick={onAddNote} />
        <MenuButton icon={<Search size={14} />} label="Search" onClick={onSearch} />
      </div>
    </motion.div>
  );
}

function MenuButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--accent-muted)] transition-colors text-sm font-serif italic"
    >
      <span className="text-[var(--accent)]">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
