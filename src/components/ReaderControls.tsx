import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useSettingsStore } from '../store/useSettingsStore';
import { ReadingMode } from '../types';
import { Play, Pause, ChevronLeft, ChevronRight, Layout, Scroll, Sliders } from 'lucide-react';
import { cn } from '../lib/utils';

interface ReaderControlsProps {
  mode: ReadingMode;
  onModeToggle: () => void;
  onAutoScrollToggle: () => void;
  isAutoScrolling: boolean;
  autoScrollSpeed: number;
  onAutoScrollSpeedChange: (speed: number) => void;
}

export default function ReaderControls({ 
  mode, 
  onModeToggle, 
  onAutoScrollToggle, 
  isAutoScrolling, 
  autoScrollSpeed, 
  onAutoScrollSpeedChange 
}: ReaderControlsProps) {
  return (
    <motion.div 
      initial={{ y: 60 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 h-16 border-t border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md flex items-center justify-between px-8 z-50"
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 p-1 bg-[var(--accent-muted)] rounded-sm">
          <button 
            onClick={() => mode !== 'paginated' && onModeToggle()}
            className={cn(
              "p-2 rounded-sm transition-all",
              mode === 'paginated' ? "bg-[var(--accent)] text-[var(--bg)]" : "opacity-40 hover:opacity-100"
            )}
          >
            <Layout size={18} />
          </button>
          <button 
            onClick={() => mode !== 'scroll' && onModeToggle()}
            className={cn(
              "p-2 rounded-sm transition-all",
              mode === 'scroll' ? "bg-[var(--accent)] text-[var(--bg)]" : "opacity-40 hover:opacity-100"
            )}
          >
            <Scroll size={18} />
          </button>
        </div>

        <div className="w-px h-6 bg-[var(--border)]" />

        <div className="flex items-center gap-4">
          <button 
            onClick={onAutoScrollToggle}
            className={cn(
              "p-2 rounded-full transition-all",
              isAutoScrolling ? "bg-[var(--accent)] text-[var(--bg)]" : "bg-[var(--accent-muted)] text-[var(--accent)]"
            )}
          >
            {isAutoScrolling ? <Pause size={18} /> : <Play size={18} />}
          </button>
          
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">Speed</span>
            <input 
              type="range" 
              min={10} 
              max={200} 
              value={autoScrollSpeed} 
              onChange={(e) => onAutoScrollSpeedChange(parseInt(e.target.value))}
              className="w-32 accent-[var(--accent)] h-1 bg-[var(--border)] rounded-full appearance-none cursor-pointer"
            />
            <span className="font-mono text-[10px] text-[var(--accent)] w-12">{autoScrollSpeed} WPM</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="font-display text-xs uppercase tracking-widest opacity-40">
          {mode === 'paginated' ? 'Paginated Mode' : 'Infinite Scroll'}
        </div>
      </div>
    </motion.div>
  );
}
