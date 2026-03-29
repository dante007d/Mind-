import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useBookStore } from '../store/useBookStore';
import { Theme, FontStyle, VocabWord, Book } from '../types';
import { X, Settings, Search, Book as BookIcon, Keyboard, Play, Plus, Trash2, Volume2, ChevronRight, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface ReaderOverlayProps {
  type: 'settings' | 'search' | 'dictionary' | 'shortcuts' | null;
  onClose: () => void;
  book: Book;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  dictionaryWord?: string;
  onResultClick?: (chapterIdx: number, offset: number) => void;
}

export default function ReaderOverlay({ type, onClose, book, searchQuery = '', onSearchChange, dictionaryWord, onResultClick }: ReaderOverlayProps) {
  const settings = useSettingsStore();
  const vocab = useBookStore((state) => state.vocab);
  const addVocab = useBookStore((state) => state.addVocab);
  const removeVocab = useBookStore((state) => state.removeVocab);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [definition, setDefinition] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (type === 'dictionary' && dictionaryWord) {
      const fetchDefinition = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${dictionaryWord}`);
          if (!response.ok) throw new Error('Word not found in the ancient archives.');
          const data = await response.json();
          setDefinition(data[0]);
        } catch (err: any) {
          setError(err.message);
          setDefinition(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDefinition();
    }
  }, [type, dictionaryWord]);

  useEffect(() => {
    if (type === 'search' && searchQuery.length > 2) {
      const results: any[] = [];
      const query = searchQuery.toLowerCase();
      
      book.content.forEach((chapter, chapterIdx) => {
        const content = chapter.content.toLowerCase();
        let index = content.indexOf(query);
        
        while (index !== -1 && results.length < 20) {
          const start = Math.max(0, index - 40);
          const end = Math.min(content.length, index + query.length + 40);
          const snippet = chapter.content.substring(start, end);
          
          results.push({
            chapterIdx,
            chapterTitle: chapter.title,
            snippet: snippet.replace(new RegExp(query, 'gi'), (match) => `<span class="bg-[var(--accent)]/30 text-[var(--accent)] font-bold px-1">${match}</span>`),
            index
          });
          
          index = content.indexOf(query, index + 1);
        }
      });
      
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, type, book.content]);

  const overlayVariants = {
    open: { opacity: 1, scale: 1 },
    closed: { opacity: 0, scale: 0.95 },
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial="closed"
        animate="open"
        exit="closed"
        variants={overlayVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full max-w-2xl bg-[var(--bg)] border border-[var(--border)] rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        <header className="h-16 border-b border-[var(--border)] flex items-center justify-between px-6 bg-[var(--bg)]/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {type === 'settings' && <Settings size={20} className="text-[var(--accent)]" />}
            {type === 'search' && <Search size={20} className="text-[var(--accent)]" />}
            {type === 'dictionary' && <BookIcon size={20} className="text-[var(--accent)]" />}
            {type === 'shortcuts' && <Keyboard size={20} className="text-[var(--accent)]" />}
            <h2 className="font-display text-lg uppercase tracking-widest">{type}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--accent-muted)] rounded-full transition-colors">
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {type === 'settings' && (
            <div className="flex flex-col gap-10">
              {/* Theme Switcher */}
              <section>
                <h3 className="font-display text-xs uppercase tracking-widest opacity-40 mb-4">Aesthetic Theme</h3>
                <div className="grid grid-cols-4 gap-4">
                  {(['light', 'dark', 'sepia', 'night'] as Theme[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => settings.setTheme(t)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-sm border transition-all",
                        settings.theme === t 
                          ? "border-[var(--accent)] bg-[var(--accent-muted)]" 
                          : "border-[var(--border)] hover:border-[var(--accent-muted)]"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full border border-black/10",
                        t === 'light' && "bg-[#FAF6EF]",
                        t === 'dark' && "bg-[#0D0B08]",
                        t === 'sepia' && "bg-[#F4ECD8]",
                        t === 'night' && "bg-black"
                      )} />
                      <span className="font-mono text-[10px] uppercase tracking-widest">{t}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Typography */}
              <section>
                <h3 className="font-display text-xs uppercase tracking-widest opacity-40 mb-4">Typography</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {(['Lora', 'Merriweather', 'OpenDyslexic', 'Georgia'] as FontStyle[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => settings.setFontFamily(f)}
                      style={{ fontFamily: f }}
                      className={cn(
                        "p-4 rounded-sm border transition-all text-lg",
                        settings.fontFamily === f 
                          ? "border-[var(--accent)] bg-[var(--accent-muted)]" 
                          : "border-[var(--border)] hover:border-[var(--accent-muted)]"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-6">
                  <Slider label="Font Size" value={settings.fontSize} min={12} max={32} onChange={settings.setFontSize} unit="px" />
                  <Slider label="Line Height" value={settings.lineHeight} min={1.2} max={2.4} step={0.1} onChange={settings.setLineHeight} />
                  <Slider label="Letter Spacing" value={settings.letterSpacing} min={-1} max={4} step={0.5} onChange={settings.setLetterSpacing} unit="px" />
                </div>
              </section>

              {/* Layout */}
              <section>
                <h3 className="font-display text-xs uppercase tracking-widest opacity-40 mb-4">Layout & Alignment</h3>
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">Reading Width</span>
                    <div className="flex gap-2">
                      {(['narrow', 'medium', 'wide', 'full'] as const).map((w) => (
                        <button
                          key={w}
                          onClick={() => settings.setReadingWidth(w)}
                          className={cn(
                            "flex-1 p-2 rounded-sm border font-mono text-[10px] uppercase tracking-widest transition-all",
                            settings.readingWidth === w ? "bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]" : "border-[var(--border)] hover:bg-[var(--accent-muted)]"
                          )}
                        >
                          {w[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">Alignment</span>
                    <div className="flex gap-2">
                      {(['left', 'justified'] as const).map((a) => (
                        <button
                          key={a}
                          onClick={() => settings.setTextAlign(a)}
                          className={cn(
                            "flex-1 p-2 rounded-sm border font-mono text-[10px] uppercase tracking-widest transition-all",
                            settings.textAlign === a ? "bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]" : "border-[var(--border)] hover:bg-[var(--accent-muted)]"
                          )}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {type === 'search' && (
            <div className="flex flex-col gap-8">
              <div className="relative">
                <Search size={24} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Search the codex..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-[var(--accent-muted)] border border-[var(--accent)]/20 rounded-sm font-serif text-xl focus:outline-none focus:border-[var(--accent)] transition-all"
                />
              </div>

              {searchQuery ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">Found {searchResults.length} matches</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">Showing top 20</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {searchResults.length > 0 ? (
                      searchResults.map((res, i) => (
                        <button 
                          key={i} 
                          onClick={() => onResultClick?.(res.chapterIdx, res.index)}
                          className="p-4 rounded-sm border border-[var(--border)] hover:bg-[var(--accent-muted)]/50 transition-all text-left flex flex-col gap-2 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-display text-[10px] uppercase tracking-widest text-[var(--accent)]">{res.chapterTitle}</span>
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p 
                            className="font-serif italic text-sm opacity-80 line-clamp-2 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: `"...${res.snippet}..."` }}
                          />
                        </button>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 opacity-40">
                        <p className="font-serif italic">No matches found for "{searchQuery}".</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
                  <Search size={48} className="mb-6" />
                  <p className="font-serif italic text-lg">Enter a word or phrase to search across all chapters.</p>
                </div>
              )}
            </div>
          )}

          {type === 'dictionary' && (
            <div className="flex flex-col gap-8">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-pulse">
                  <BookIcon size={48} className="mb-6 opacity-20" />
                  <p className="font-serif italic text-lg opacity-40">Consulting the ancient archives...</p>
                </div>
              ) : error ? (
                <div className="p-8 bg-red-500/5 rounded-sm border border-red-500/20 text-center">
                  <X size={48} className="mx-auto mb-6 text-red-500 opacity-40" />
                  <p className="font-serif italic text-lg text-red-500">{error}</p>
                </div>
              ) : definition ? (
                <div className="p-8 bg-[var(--accent-muted)] rounded-sm border border-[var(--accent)]/20">
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <h3 className="text-4xl font-display mb-1 capitalize">{definition.word}</h3>
                      <span className="font-mono text-sm opacity-40 italic">{definition.phonetic || definition.phonetics?.[0]?.text}</span>
                    </div>
                    {definition.phonetics?.[0]?.audio && (
                      <button 
                        onClick={() => new Audio(definition.phonetics[0].audio).play()}
                        className="p-3 bg-[var(--accent)] text-[var(--bg)] rounded-full hover:scale-110 transition-transform"
                      >
                        <Volume2 size={24} />
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    {definition.meanings.slice(0, 2).map((meaning: any, idx: number) => (
                      <div key={idx}>
                        <span className="font-mono text-[10px] uppercase tracking-widest opacity-40 block mb-2">{meaning.partOfSpeech}</span>
                        <p className="font-serif text-lg leading-relaxed">{meaning.definitions[0].definition}</p>
                        {meaning.definitions[0].example && (
                          <p className="font-serif italic opacity-60 mt-2 text-sm">"{meaning.definitions[0].example}"</p>
                        )}
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => addVocab({ 
                        word: definition.word, 
                        definition: definition.meanings[0].definitions[0].definition, 
                        timestamp: Date.now() 
                      })}
                      className="flex items-center gap-2 px-6 py-3 bg-[var(--bg)] border border-[var(--accent)] text-[var(--accent)] rounded-sm font-display text-sm hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all"
                    >
                      <Plus size={16} />
                      <span>Add to Vocabulary</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
                  <BookIcon size={48} className="mb-6" />
                  <p className="font-serif italic text-lg">Select a word to see its definition from the archives.</p>
                </div>
              )}

              <div className="flex flex-col gap-4">
                <h3 className="font-display text-xs uppercase tracking-widest opacity-40">Your Vocabulary</h3>
                <div className="grid grid-cols-1 gap-2">
                  {vocab.length === 0 ? (
                    <p className="font-serif italic opacity-20 text-center py-10">Your vocabulary list is empty.</p>
                  ) : (
                    vocab.map((v) => (
                      <div key={v.word} className="flex items-center justify-between p-4 border border-[var(--border)] rounded-sm hover:bg-[var(--accent-muted)]/50 transition-all group">
                        <div className="flex flex-col">
                          <span className="font-display text-lg">{v.word}</span>
                          <span className="font-serif text-xs opacity-60 line-clamp-1">{v.definition}</span>
                        </div>
                        <button onClick={() => removeVocab(v.word)} className="p-2 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {type === 'shortcuts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <ShortcutItem keys={["→", "Space"]} action="Next Page" />
              <ShortcutItem keys={["←"]} action="Previous Page" />
              <ShortcutItem keys={["Ctrl", "F"]} action="Search Codex" />
              <ShortcutItem keys={["Ctrl", "B"]} action="Toggle Bookmarks" />
              <ShortcutItem keys={["Ctrl", "T"]} action="Table of Contents" />
              <ShortcutItem keys={["F"]} action="Focus / Zen Mode" />
              <ShortcutItem keys={["?"]} action="Show Shortcuts" />
              <ShortcutItem keys={["Esc"]} action="Close Panel" />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function Slider({ label, value, min, max, step = 1, onChange, unit = "" }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; unit?: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">{label}</span>
        <span className="font-mono text-[10px] text-[var(--accent)]">{value}{unit}</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-[var(--accent)] h-1 bg-[var(--border)] rounded-full appearance-none cursor-pointer"
      />
    </div>
  );
}

function ShortcutItem({ keys, action }: { keys: string[]; action: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
      <span className="font-serif italic opacity-60">{action}</span>
      <div className="flex gap-1">
        {keys.map((k) => (
          <kbd key={k} className="px-2 py-1 bg-[var(--accent-muted)] border border-[var(--border)] rounded-sm font-mono text-[10px] min-w-[24px] text-center">{k}</kbd>
        ))}
      </div>
    </div>
  );
}
