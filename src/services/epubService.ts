import ePub from 'epubjs';
import { Book, Chapter } from '../types';

export const parseEpub = async (file: File): Promise<Book> => {
  const reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error('Failed to read file');
        
        const book = ePub(data as ArrayBuffer);
        const metadata = await book.loaded.metadata;
        const coverUrl = await book.coverUrl();
        
        const spine = book.spine;
        const chapters: Chapter[] = [];
        
        // Load all chapters
        const spineItems: any[] = [];
        spine.each((item: any) => spineItems.push(item));

        for (const item of spineItems) {
          const section = await book.load(item.href);
          const body = (section as any).body || section;
          
          chapters.push({
            id: item.idref,
            title: item.label || `Chapter ${chapters.length + 1}`,
            content: body.innerHTML,
          });
        }
        
        resolve({
          id: Math.random().toString(36).substr(2, 9),
          title: metadata.title || file.name,
          author: metadata.creator || 'Unknown Author',
          coverUrl: coverUrl || 'https://picsum.photos/seed/book/400/600',
          progress: 0,
          content: chapters,
        });
      } catch (err) {
        reject(err);
      }
    };
    
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsArrayBuffer(file);
  });
};
