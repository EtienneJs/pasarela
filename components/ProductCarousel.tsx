
import React, { useRef, useState, useEffect } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductCarouselProps {
  products: Product[];
  isLoading: boolean;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320; // width of card + margin
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex gap-6 overflow-hidden px-4 md:px-12 py-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-shrink-0 w-72 h-[450px] bg-white/5 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative group/carousel">
      {/* Navigation Arrows */}
      {showLeftArrow && (
        <button 
          onClick={() => scroll('left')}
          className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-full text-white transition-all hover:bg-white/20 hover:scale-110 active:scale-95 hidden md:block"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      
      {showRightArrow && (
        <button 
          onClick={() => scroll('right')}
          className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-full text-white transition-all hover:bg-white/20 hover:scale-110 active:scale-95 hidden md:block"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Product Strip */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar px-4 md:px-0 py-8 snap-x snap-mandatory"
      >
        {products.map((product) => (
          <div key={product.id} className="snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      
      {/* Mobile Hint */}
      <div className="md:hidden flex justify-center gap-2 mt-4">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce delay-100"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce delay-200"></div>
      </div>
    </div>
  );
};
