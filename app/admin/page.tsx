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

  // Cek Sesi Login
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

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-black">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel Admin</h1>
            <p className="text-sm text-gray-500">Logged in as: {user.email}</p>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/admin/transactions" 
              className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-100 transition shadow-sm"
            >
              📄 Riwayat
            </Link>
            <Link 
              href="/" 
              className="bg-blue-50 text-blue-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-100 transition shadow-sm"
            >
              ← Kasir
            </Link>
            <button 
              onClick={() => setIsPasswordModalOpen(true)}
              className="bg-yellow-50 text-yellow-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-yellow-100 transition shadow-sm"
            >
              🔑 Ganti Password
            </button>
            <button 
              onClick={handleLogout}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-100 transition shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 text-black">
          {/* Section Form */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingProduct ? `Edit Produk: ${editingProduct.name}` : 'Tambah Produk Baru'}
              </h2>
              {editingProduct && (
                <button 
                  onClick={() => setEditingProduct(null)}
                  className="text-xs text-red-500 hover:underline"
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

          {/* Section Daftar Produk (Tabel) */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Daftar Produk</h2>
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

      {/* Modal Ganti Password */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-black">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Ganti Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Password Baru</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  required
                  minLength={6}
                  placeholder="Minimal 6 karakter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  required
                  minLength={6}
                  placeholder="Ulangi password baru"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={passwordLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {passwordLoading ? 'Menyimpan...' : 'Simpan Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}