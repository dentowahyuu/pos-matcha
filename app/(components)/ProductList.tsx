import { Product } from '@/types/index'; // Import interface yang sudah kita buat
import ProductCard from './ProductCard';

interface ProductListProps {
  products: Product[];
  onAdd: (product: Product) => void;
}

export default function ProductList({ products, onAdd }: ProductListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-black text-center md:text-left">
        Menu Produk
      </h2>
      
      {products.length === 0 ? (
        <div className="text-center text-gray-400 mt-10">
          Tidak ada produk tersedia.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAdd={onAdd} 
            />
          ))}
        </div>
      )}
    </div>
  );
}