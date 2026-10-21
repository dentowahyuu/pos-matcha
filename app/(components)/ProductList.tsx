import { Product, CartItem } from '@/types/index';
import ProductCard from './ProductCard';
import { Coffee } from '@phosphor-icons/react';

interface ProductListProps {
  products: Product[];
  cart?: CartItem[];
  onAdd: (product: Product) => void;
}

export default function ProductList({ products, cart = [], onAdd }: ProductListProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-stone-400">
          Pilihan Menu ({products.length})
        </h2>
      </div>
      
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-stone-200 rounded-3xl bg-stone-50/50">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
            <Coffee size={24} />
          </div>
          <h3 className="text-sm font-semibold text-stone-600">Menu tidak ditemukan</h3>
          <p className="text-xs text-stone-400 mt-1 max-w-[24ch] text-center leading-relaxed">
            Tidak ada produk matcha yang cocok dengan pencarian Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => {
            const cartItem = cart.find((item) => item.id === product.id);
            const cartQty = cartItem ? cartItem.qty : 0;
            return (
              <ProductCard 
                key={product.id} 
                product={product} 
                cartQty={cartQty}
                onAdd={onAdd} 
              />
            );
          })}
        </div>
      )}
    </div>
  );
}