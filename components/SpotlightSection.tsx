
import React, { useState } from 'react';

interface SpotlightItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  driveId: string;
  specs: { label: string; value: string }[];
}

const SPOTLIGHT_ITEMS: SpotlightItem[] = [
  {
    id: 'car-1',
    title: 'Mitsubishi Eclipse Cross',
    subtitle: 'PHEV Sport Edition',
    description: 'Experience the perfect fusion of electric efficiency and SUV versatility. The silver diamond finish catches every light, while the sophisticated all-wheel control system keeps you grounded in any terrain.',
    driveId: '1UKA3RauKFpZE3xYGiv3__AkEC9KYJd8S',
    specs: [
      { label: 'Performance', value: 'Super All-Wheel Control' },
      { label: 'Efficiency', value: 'Dual Motor PHEV' }
    ]
  },
  {
    id: 'car-2',
    title: 'Mitsubishi Outlander',
    subtitle: 'Next-Gen Luxury',
    description: 'A bold, white pearl masterpiece designed for the modern family. Featuring a redesigned interior with premium materials and advanced safety technology that anticipates the road ahead.',
    driveId: '1tF-LU9FZsMQeeoNhVnS-bAwyPPVsha6v',
    specs: [
      { label: 'Interior', value: 'Triple-Zone Climate' },
      { label: 'Safety', value: 'MI-PILOT Assist' }
    ]
  },
  {
    id: 'car-3',
    title: 'Mitsubishi Pajero Sport',
    subtitle: 'Off-Road Legend',
    description: 'The ultimate adventure companion. Built with a rugged body-on-frame construction and a powerful diesel engine that delivers relentless torque for those who dare to go beyond the paved path.',
    driveId: '1uNCfBsEt-p-bm0reRub-SReV2boOy1_K',
    specs: [
      { label: 'Capability', value: 'Super Select 4WD-II' },
      { label: 'Utility', value: '3100kg Braked Towing' }
    ]
  }
];

export const SpotlightSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  
  const currentItem = SPOTLIGHT_ITEMS[activeIndex];
  const driveImageUrl = `https://lh3.googleusercontent.com/d/${currentItem.driveId}`;

  const nextSlide = () => {
    setImageError(false);
    setActiveIndex((prev) => (prev + 1) % SPOTLIGHT_ITEMS.length);
  };

  const prevSlide = () => {
    setImageError(false);
    setActiveIndex((prev) => (prev - 1 + SPOTLIGHT_ITEMS.length) % SPOTLIGHT_ITEMS.length);
  };

  return (
    <section className="mt-20 px-4 md:px-0">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 to-indigo-900/40 border border-white/10 p-8 md:p-12 transition-all duration-700">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"></div>
        
        {/* Navigation Arrows */}
        <div className="absolute top-8 right-8 flex gap-2 z-20">
          <button 
            onClick={prevSlide}
            className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all active:scale-90"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button 
            onClick={nextSlide}
            className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all active:scale-90"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className="relative flex flex-col md:flex-row items-center gap-12 min-h-[400px]">
          <div key={`${currentItem.id}-content`} className="flex-1 space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="flex items-center gap-2">
              <span className="inline-block px-4 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest">
                Exclusive Spotlight
              </span>
              <div className="flex gap-1">
                {SPOTLIGHT_ITEMS.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-4 bg-emerald-400' : 'w-1.5 bg-white/20'}`}></div>
                ))}
              </div>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              {currentItem.title} <span className="text-blue-400 block md:inline">{currentItem.subtitle}</span>
            </h2>
            
            <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
              {currentItem.description}
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              {currentItem.specs.map((spec, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                  <p className="text-blue-400 text-xs font-bold uppercase mb-1">{spec.label}</p>
                  <p className="text-white font-semibold">{spec.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-blue-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-lg shadow-white/10">
                Explore Configuration
              </button>
              <button className="px-8 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
                Download Specs
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              </button>
            </div>
          </div>

          <div key={`${currentItem.id}-image`} className="flex-1 w-full flex items-center justify-center animate-in fade-in slide-in-from-right-12 duration-1000">
            {!imageError ? (
              <div className="relative group">
                <div className="absolute -inset-12 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-1000"></div>
                <img 
                  src={driveImageUrl} 
                  alt={currentItem.title} 
                  className="relative w-full max-w-lg drop-shadow-[0_25px_60px_rgba(0,0,0,0.6)] transition-all duration-700 group-hover:scale-110"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className="w-full max-w-md aspect-video rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-white/5 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Image Loading...</h4>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                    Estamos conectando con el servidor de Google Drive. Asegúrate de que los permisos de enlace sean públicos.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
