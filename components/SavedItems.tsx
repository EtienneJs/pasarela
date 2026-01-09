
import React from 'react';
import { Product } from '../types';

interface SavedItemsProps {
  items: Product[];
}

export const SavedItems: React.FC<SavedItemsProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <section className="mt-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.71 3.502L1.15 15l3.438 6h13.123l3.438-6L14.59 3.502H7.71zM9.03 5.502h4.24l5.378 9.434h-4.24L9.03 5.502z"/>
          </svg>
          Recently Saved to Drive
        </h2>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all group">
            <div className="aspect-video overflow-hidden">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-white truncate">{item.name}</h3>
                <span className="text-xs text-emerald-400 font-bold">${item.price}</span>
              </div>
              <p className="text-slate-500 text-xs line-clamp-1 mb-4">{item.description}</p>
              
              <div className="flex flex-col gap-2">
                <div className="bg-slate-950/50 rounded-lg p-2 flex items-center gap-2 border border-white/5">
                  <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                  </svg>
                  <span className="text-[10px] text-slate-400 truncate font-mono">{item.driveUrl}</span>
                </div>
                
                <a 
                  href={item.driveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-bold py-2 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
                >
                  View on Google Drive
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
