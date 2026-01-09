
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group relative flex-shrink-0 w-72 h-[450px] bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
      <div className="h-56 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-blue-600/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
          {product.category}
        </div>
      </div>
      
      <div className="p-6 flex flex-col h-[calc(450px-224px)] justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white truncate mb-2">{product.name}</h3>
          <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-bold text-white">${product.price.toLocaleString()}</span>
          <button className="bg-white text-slate-900 px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:bg-blue-500 hover:text-white active:scale-95">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};
