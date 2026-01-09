
import React, { useState, useEffect, useCallback } from 'react';
import { Product } from './types';
import { fetchTrendingProducts } from './services/geminiService';
import { ProductCarousel } from './components/ProductCarousel';
import { DriveUpload } from './components/DriveUpload';
import { SavedItems } from './components/SavedItems';
import { SpotlightSection } from './components/SpotlightSection';
import { ImageGenerator } from './components/ImageGenerator';

const categories = [
  { id: 'electronics', label: 'Tech', icon: '⚡' },
  { id: 'vehicles', label: 'Vehicles', icon: '🚗' },
  { id: 'fashion', label: 'Fashion', icon: '👕' },
  { id: 'home-decor', label: 'Home', icon: '🏠' }
];

// Pre-analyzed products based on user's images
const INITIAL_SAVED_ITEMS: Product[] = [
  {
    id: 'car-1',
    name: 'Mitsubishi Eclipse Cross',
    price: 25900,
    category: 'Vehicles',
    description: 'A sophisticated silver compact SUV featuring a bold dynamic shield design and advanced Super All-Wheel Control.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1UKA3RauKFpZE3xYGiv3__AkEC9KYJd8S',
    driveUrl: 'https://drive.google.com/file/d/1UKA3RauKFpZE3xYGiv3__AkEC9KYJd8S/view'
  },
  {
    id: 'car-2',
    name: 'Mitsubishi Outlander',
    price: 31500,
    category: 'Vehicles',
    description: 'Next-gen luxury SUV with white pearl finish, MI-PILOT safety tech, and premium interior comfort.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1tF-LU9FZsMQeeoNhVnS-bAwyPPVsha6v',
    driveUrl: 'https://drive.google.com/file/d/1tF-LU9FZsMQeeoNhVnS-bAwyPPVsha6v/view'
  },
  {
    id: 'car-3',
    name: 'Mitsubishi Pajero Sport',
    price: 48900,
    category: 'Vehicles',
    description: 'Rugged off-road capability meets high-torque diesel performance. Built for the toughest terrain.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1uNCfBsEt-p-bm0reRub-SReV2boOy1_K',
    driveUrl: 'https://drive.google.com/file/d/1uNCfBsEt-p-bm0reRub-SReV2boOy1_K/view'
  }
];

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [savedProducts, setSavedProducts] = useState<Product[]>(INITIAL_SAVED_ITEMS);
  const [activeCategory, setActiveCategory] = useState('electronics');
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [toast, setToast] = useState<{ message: string, url?: string, type: 'success' | 'error' } | null>(null);

  const loadProducts = useCallback(async (cat: string) => {
    setLoading(true);
    try {
      const data = await fetchTrendingProducts(cat);
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts(activeCategory);
  }, [activeCategory, loadProducts]);

  const handleUploadSuccess = (newProduct: Product) => {
    setSavedProducts(prev => [newProduct, ...prev]);
    setShowUpload(false);
    setToast({ 
      message: 'Product successfully uploaded to Google Drive!', 
      url: newProduct.driveUrl,
      type: 'success' 
    });
    setTimeout(() => setToast(null), 8000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-[60] animate-in slide-in-from-right-8 fade-in">
          <div className={`p-6 rounded-2xl border shadow-2xl backdrop-blur-xl max-w-sm ${
            toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-emerald-500/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm mb-1">{toast.message}</p>
                {toast.url && (
                  <p className="text-[10px] font-mono text-slate-500 truncate mb-3">{toast.url}</p>
                )}
                {toast.url && (
                  <a href={toast.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-white bg-emerald-600 px-3 py-1.5 rounded-lg inline-block transition-transform active:scale-95">
                    Open File
                  </a>
                )}
              </div>
              <button onClick={() => setToast(null)} className="text-slate-500 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="mb-16 text-center relative">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          <span>Powered by Gemini AI</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
          Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Pulse</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
          Explore our AI-curated selection of premium products. Real-time trends, high-quality visuals, and seamless shopping.
        </p>

        <button 
          onClick={() => setShowUpload(true)}
          className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl font-bold shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-1 active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Upload & Analyze
        </button>
      </header>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeCategory === cat.id
                ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Main Carousel Area */}
      <main className="relative min-h-[500px]">
        <ProductCarousel products={products} isLoading={loading} />
      </main>

      {/* Updated Spotlight Section with Carousel */}
      <SpotlightSection />

      {/* New AI Image Generator Section */}
      <ImageGenerator />

      {/* Saved Items Section */}
      <SavedItems items={savedProducts} />

      {showUpload && (
        <DriveUpload 
          onSuccess={handleUploadSuccess} 
          onCancel={() => setShowUpload(false)} 
        />
      )}

      {/* Footer Info */}
      <footer className="mt-24 pt-12 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>© 2024 Gemini Pulse Design. Built with React, Tailwind & Gemini 3 Flash.</p>
        <div className="mt-4 flex justify-center gap-6">
          <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
