'use client'

import { useState, useEffect } from 'react'
import { usePos } from '@/hooks/usePos'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import ProductForm from '@/app/admin/(components)/ProductForm'
import { User } from '@supabase/supabase-js'
import ProductTable from '@/app/admin/(components)/ProductTable'
import { Product } from '@/types'
import { Leaf, Storefront, Clock, Key, SignOut, Plus, Pencil, Password, ShieldWarning } from '@phosphor-icons/react'

export default function AdminPage() {
  const router = useRouter()
  const { products, categories, addProduct, updateProduct, deleteProduct } = usePos()
  
  const [loading, setLoading] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
      }
    }
    checkUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('Password konfirmasi tidak cocok')
      return
    }
    if (newPassword.length < 6) {
      alert('Password minimal 6 karakter')
      return
    }

    setPasswordLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    
    if (error) {
      alert('Gagal mengganti password: ' + error.message)
    } else {
      alert('Password berhasil diganti!')
      setIsPasswordModalOpen(false)
      setNewPassword('')
      setConfirmPassword('')
    }
    setPasswordLoading(false)
  }

  const handleSaveProduct = async (
    name: string, 
    price: number, 
    stock: number, 
    categoryId: string, 
    file: File | null
  ) => {
    setLoading(true)
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, name, price, stock, categoryId, file || undefined)
        setEditingProduct(null)
      } else {
        await addProduct(name, price, stock, categoryId, file || undefined)
      }
    } catch (err) {
      console.error(err)
      alert("Terjadi kesalahan saat menyimpan data")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-stone-50 text-stone-500 font-sans gap-3">
        <div className="w-10 h-10 border-4 border-matcha-250 border-t-matcha-600 rounded-full animate-spin"></div>
        <span className="text-xs font-bold tracking-wider uppercase">Loading Dashboard...</span>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-stone-50/50 text-stone-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Modern Admin Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-matcha-50 text-matcha-600">
              <Leaf size={24} weight="fill" />
            </div>
            <div>
              <h1 className="text-xl font-black text-stone-900 tracking-tight">Panel Pengelola</h1>
              <p className="text-xs font-semibold text-stone-400 mt-0.5">Admin: {user.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
            <Link 
              href="/admin/transactions" 
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-stone-100/80 hover:bg-stone-200/60 text-stone-600 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm border border-stone-200/40 active:scale-[0.98]"
            >
              <Clock size={16} />
              <span>RIWAYAT</span>
            </Link>
            <Link 
              href="/" 
              className="flex-grow sm:flex-initial flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-matcha-600 border border-stone-200 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm active:scale-[0.98]"
            >
              <Storefront size={16} />
              <span>APLIKASI KASIR</span>
            </Link>
            <button 
              onClick={() => setIsPasswordModalOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-600 border border-stone-200 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm active:scale-[0.98]"
            >
              <Key size={16} />
              <span>PASSWORD</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex-grow sm:flex-initial flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100/80 text-red-600 border border-red-100 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm active:scale-[0.98]"
            >
              <SignOut size={16} />
              <span>KELUAR</span>
            </button>
          </div>
        </header>

        {/* Dashboard Panels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Panel (4 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                {editingProduct ? (
                  <Pencil size={18} className="text-matcha-600" />
                ) : (
                  <Plus size={18} className="text-matcha-600" />
                )}
                <h2 className="text-sm font-bold tracking-wider uppercase text-stone-800">
                  {editingProduct ? 'Ubah Menu' : 'Tambah Menu'}
                </h2>
              </div>
              {editingProduct && (
                <button 
                  onClick={() => setEditingProduct(null)}
                  className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline"
                >
                  Batal Edit
                </button>
              )}
            </div>
            
            <ProductForm 
              categories={categories} 
              onSubmit={handleSaveProduct} 
              loading={loading}
              initialData={editingProduct}
            />
          </div>

          {/* Table Panel (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm">
            <div className="border-b border-stone-100 pb-3 mb-6">
              <h2 className="text-sm font-bold tracking-wider uppercase text-stone-800">Daftar Menu Produk</h2>
            </div>
            
            <ProductTable 
              products={products} 
              onEdit={(p) => {
                setEditingProduct(p)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              onDelete={deleteProduct}
            />
          </div>
        </div>
      </div>

      {/* Ganti Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md border border-stone-150 transform transition-all space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                <Password size={20} weight="bold" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 tracking-tight">Ganti Password</h3>
                <p className="text-xs text-stone-400 font-medium">Ubah kata sandi admin Anda</p>
              </div>
            </div>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-stone-400 mb-2">Password Baru</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-stone-50/50 border border-stone-200 rounded-2xl focus:outline-none focus:border-matcha-500 focus:ring-1 focus:ring-matcha-500 text-stone-700 placeholder-stone-400/80 transition-all font-medium"
                  required
                  minLength={6}
                  placeholder="Minimal 6 karakter"
                />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-stone-400 mb-2">Konfirmasi Password Baru</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-stone-50/50 border border-stone-200 rounded-2xl focus:outline-none focus:border-matcha-500 focus:ring-1 focus:ring-matcha-500 text-stone-700 placeholder-stone-400/80 transition-all font-medium"
                  required
                  minLength={6}
                  placeholder="Konfirmasi password baru"
                />
              </div>
              
              <div className="flex gap-3 pt-3 border-t border-stone-100">
                <button 
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 bg-stone-100 hover:bg-stone-250/60 text-stone-600 py-3 rounded-xl font-bold transition text-xs active:scale-95 border border-stone-200/40"
                >
                  BATAL
                </button>
                <button 
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-grow bg-matcha-600 text-white py-3 rounded-xl font-bold hover:bg-matcha-700 disabled:bg-stone-200 transition text-xs shadow-md shadow-matcha-100 active:scale-95"
                >
                  {passwordLoading ? 'Menyimpan...' : 'SIMPAN PASSWORD'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}