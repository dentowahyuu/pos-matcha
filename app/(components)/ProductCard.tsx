import { Product } from '@/types/index';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  const isAvailable = product.stock > 0;

  return (
    <button
      onClick={() => onAdd(product)}
      disabled={!isAvailable}
      className={`group flex flex-col p-0 overflow-hidden rounded-2xl border text-left shadow-sm transition-all duration-300 ${
        isAvailable 
          ? 'bg-white border-stone-200/80 hover:border-matcha-500 hover:shadow-md hover:shadow-matcha-50/50 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer' 
          : 'bg-stone-100/80 border-stone-200 cursor-not-allowed opacity-75'
      }`}
    >
      {/* Product Image Container */}
      <div className="w-full h-36 bg-stone-100 relative overflow-hidden">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-matcha-50/30 text-matcha-600/60 p-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 opacity-40 mb-1">
              <path d="M2 9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9Z" />
              <path fillRule="evenodd" d="M12 2.5a5.5 5.5 0 0 0-5.5 5.5.75.75 0 0 0 1.5 0 4 4 0 1 1 8 0 .75.75 0 0 0 1.5 0A5.5 5.5 0 0 0 12 2.5Z" clipRule="evenodd" />
            </svg>
            <span className="text-[10px] uppercase font-bold tracking-wider">No Image</span>
          </div>
        )}
        
        {/* Modern Out of Stock Overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-stone-950/45 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-stone-900/90 text-white text-[10px] tracking-widest font-extrabold px-3 py-1 rounded-full shadow-sm">
              HABIS
            </span>
          </div>
        )}
      </div>
 
      {/* Product Text Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <p className="font-bold text-stone-800 text-sm tracking-tight leading-tight group-hover:text-matcha-700 transition-colors line-clamp-2">
            {product.name}
          </p>
        </div>
        
        <div className="mt-2.5 flex items-baseline justify-between">
          <p className="text-matcha-600 font-extrabold text-sm">
            Rp {product.price ? product.price.toLocaleString('id-ID') : '0'}
          </p>
          
          <p className={`text-[10px] font-bold tracking-wide uppercase ${isAvailable ? 'text-stone-400' : 'text-red-500'}`}>
            {isAvailable ? `Stock: ${product.stock}` : 'Kosong'}
          </p>
        </div>
      </div>
    </button>
  );
}