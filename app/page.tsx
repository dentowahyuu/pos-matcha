'use client'

import { useState } from 'react'
// Pastikan path import sesuai dengan struktur folder Anda
import { usePos } from '@/hooks/usePos' 
import ProductList from '@/app/(components)/ProductList'
import Cart from '@/app/(components)/Cart'
import Link from 'next/link'

export default function CashierPage() {
  // TypeScript secara otomatis mengenali tipe data dari usePos()
  const { products, cart, addToCart, handleCheckout, updateQuantity, removeFromCart } = usePos()
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <main className="flex h-screen bg-gray-50 overflow-hidden relative">
      {/* Karena ProductList sudah kita update interface-nya, 
          ia sekarang menuntut 'products' berupa Product[] dan 
          'onAdd' berupa fungsi yang menerima Product.
      */}

        <Link 
        href="/admin" 
        className="absolute bottom-6 left-6 z-10 flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full shadow-sm hover:bg-gray-50 hover:text-blue-600 transition-all font-medium text-sm hidden md:flex"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        Panel Admin
      </Link>
      
      {/* Link Admin untuk Mobile (Icon Only di pojok kiri atas) */}
      <Link href="/admin" className="md:hidden absolute top-4 left-4 z-10 bg-white p-2 rounded-full shadow-md text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
      </Link>

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <ProductList 
          products={products} 
          onAdd={addToCart} 
        />
      </div>

      {/* Cart Wrapper: Fixed full screen on mobile, static on desktop */}
      <div className={`fixed inset-0 z-40 bg-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:bg-transparent md:z-auto md:w-auto ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <Cart 
          cart={cart} 
          onCheckout={handleCheckout} 
          onUpdateQty={updateQuantity}
          onRemove={removeFromCart}
          onClose={() => setIsCartOpen(false)}
        />
      </div>

      {/* Floating Cart Button (Mobile Only) */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-30 bg-green-600 text-white p-4 rounded-full shadow-xl flex items-center justify-center hover:bg-green-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white">
            {cart.reduce((sum, item) => sum + item.qty, 0)}
          </span>
        )}
      </button>
    </main>
  )
}