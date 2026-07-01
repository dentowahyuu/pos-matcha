'use client'

import { useState } from 'react'
import { usePos } from '@/hooks/usePos' 
import ProductList from '@/app/(components)/ProductList'
import Cart from '@/app/(components)/Cart'
import Link from 'next/link'
import { Leaf, Gear, ShoppingCart, MagnifyingGlass } from '@phosphor-icons/react'

export default function CashierPage() {
  const { products, categories, cart, addToCart, handleCheckout, updateQuantity, removeFromCart } = usePos()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  // Filter products based on search query and category selector
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategoryId ? product.category_id === selectedCategoryId : true
    return matchesSearch && matchesCategory
  })

  const cartItemsCount = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <main className="flex flex-col min-h-[100dvh] bg-stone-50/50 text-stone-900 font-sans selection:bg-matcha-100 selection:text-matcha-900">
      {/* Premium Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-stone-200/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-matcha-50 text-matcha-600">
            <Leaf size={22} weight="fill" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-stone-900">Matcha POS</h1>
            <p className="text-xs font-medium text-stone-400">Premium Beverages Cashier</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            href="/admin" 
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-stone-600 border border-stone-200/80 bg-white hover:bg-stone-50 hover:text-matcha-600 active:scale-[0.98] transition-all font-medium text-sm shadow-sm"
          >
            <Gear size={18} />
            <span className="hidden sm:inline">Panel Admin</span>
          </Link>
        </div>
      </header>

      {/* Main Cashier Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-6">
          {/* Controls Bar: Search and Category Filter Tabs */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            {/* Custom Category Selection Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full md:w-auto scrollbar-none">
              <button
                onClick={() => setSelectedCategoryId(null)}
                className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-200 ${
                  selectedCategoryId === null
                    ? 'bg-matcha-600 border-matcha-600 text-white shadow-sm'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                Semua Menu
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-200 whitespace-nowrap ${
                    selectedCategoryId === cat.id
                      ? 'bg-matcha-600 border-matcha-600 text-white shadow-sm'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Custom Search Box */}
            <div className="relative w-full md:w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                <MagnifyingGlass size={18} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk matcha..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-stone-200 rounded-full focus:outline-none focus:border-matcha-500 focus:ring-1 focus:ring-matcha-500 text-stone-700 placeholder-stone-400 shadow-sm transition-all"
              />
            </div>
          </div>

          {/* Product Menu Grid */}
          <div className="flex-1 min-h-0">
            <ProductList 
              products={filteredProducts} 
              onAdd={addToCart} 
            />
          </div>
        </div>

        {/* Sidebar Cart View (Static on Desktop, Sliding Drawer on Mobile) */}
        <div 
          className={`fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-sm transition-opacity duration-300 md:static md:bg-transparent md:backdrop-blur-none md:z-auto md:w-auto ${
            isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'
          }`}
          onClick={() => setIsCartOpen(false)}
        >
          <div 
            className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-white transition-transform duration-300 ease-out md:static md:translate-x-0 ${
              isCartOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <Cart 
              cart={cart} 
              onCheckout={handleCheckout} 
              onUpdateQty={updateQuantity}
              onRemove={removeFromCart}
              onClose={() => setIsCartOpen(false)}
            />
          </div>
        </div>
      </div>

      {/* Floating Action Button (Mobile Only) */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-30 w-14 h-14 bg-matcha-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-matcha-700 active:scale-95 transition-all"
      >
        <ShoppingCart size={24} weight="bold" />
        {cartItemsCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
            {cartItemsCount}
          </span>
        )}
      </button>
    </main>
  )
}