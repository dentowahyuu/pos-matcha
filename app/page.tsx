'use client'

// Pastikan path import sesuai dengan struktur folder Anda
import { usePos } from '@/hooks/usePos' 
import ProductList from '@/app/(components)/ProductList'
import Cart from '@/app/(components)/Cart'
import Link from 'next/link'

export default function CashierPage() {
  // TypeScript secara otomatis mengenali tipe data dari usePos()
  const { products, cart, addToCart, handleCheckout, updateQuantity, removeFromCart } = usePos()

  return (
    <main className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Karena ProductList sudah kita update interface-nya, 
          ia sekarang menuntut 'products' berupa Product[] dan 
          'onAdd' berupa fungsi yang menerima Product.
      */}

        <Link 
        href="/admin" 
        className="absolute bottom-6 left-6 z-10 flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full shadow-sm hover:bg-gray-50 hover:text-blue-600 transition-all font-medium text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        Panel Admin
      </Link>

      <ProductList 
        products={products} 
        onAdd={addToCart} 
      />

      {/* Cart sekarang menuntut 'cart' berupa CartItem[] 
          dan 'onCheckout' berupa fungsi tanpa parameter.
      */}
      <Cart 
        cart={cart} 
        onCheckout={handleCheckout} 
        onUpdateQty={updateQuantity}
        onRemove={removeFromCart}
      />
    </main>
  )
}