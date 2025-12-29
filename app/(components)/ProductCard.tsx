import { Product } from '@/types/index';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <button
      onClick={() => onAdd(product)}
      disabled={product.stock <= 0}
      className={`group p-0 overflow-hidden rounded-xl shadow-sm border transition text-left 
        ${product.stock > 0 
          ? 'bg-white hover:bg-blue-50 border-gray-100 hover:border-blue-500 cursor-pointer' 
          : 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-70'
        }`}
    >
      {/* Container Gambar */}
      <div className="w-full h-32 bg-gray-200 relative overflow-hidden">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            Tidak ada gambar
          </div>
        )}
        
        {/* Badge Stok Habis di atas gambar */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
              HABIS
            </span>
          </div>
        )}
      </div>

      {/* Konten Teks */}
      <div className="p-3">
        <p className="font-semibold text-gray-800 truncate leading-tight">
          {product.name}
        </p>
        
        <p className="text-blue-600 font-bold mt-1 text-sm">
          Rp {product.price ? product.price.toLocaleString() : '0'}
        </p>
        
        <p className={`text-[10px] mt-1 font-medium ${product.stock > 0 ? 'text-gray-400' : 'text-red-500'}`}>
          {product.stock > 0 ? `Stok: ${product.stock}` : 'Stok Kosong'}
        </p>
      </div>
    </button>
  );
}