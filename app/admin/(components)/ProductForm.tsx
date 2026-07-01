'use client'

import { useState, useEffect } from 'react'
import { Category, Product } from '@/types'

interface ProductFormProps {
  categories: Category[]
  onSubmit: (name: string, price: number, stock: number, categoryId: string, file: File | null) => void
  loading: boolean
  initialData?: Product | null
}

export default function ProductForm({ categories, onSubmit, loading, initialData }: ProductFormProps) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    if (initialData) {
      setName(initialData.name ?? '');
      setPrice(initialData.price?.toString() ?? '0');
      setStock(initialData.stock?.toString() ?? '0');
      setCategoryId(initialData.category_id || ''); 
      setFile(null);
    } else {
      setName('');
      setPrice('');
      setStock('');
      setCategoryId('');
      setFile(null);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !price || !stock || !categoryId) {
      alert('Mohon lengkapi semua data wajib')
      return
    }
    onSubmit(name, Number(price), Number(stock), categoryId, file)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-stone-800">
      <div>
        <label className="block text-xs font-bold tracking-wider uppercase text-stone-400 mb-2">Nama Produk</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 text-sm bg-stone-50/50 border border-stone-200 rounded-2xl focus:outline-none focus:border-matcha-500 focus:ring-1 focus:ring-matcha-500 text-stone-700 placeholder-stone-300 font-medium transition-all"
          placeholder="Contoh: Matcha Latte"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold tracking-wider uppercase text-stone-400 mb-2">Harga (Rp)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-stone-50/50 border border-stone-200 rounded-2xl focus:outline-none focus:border-matcha-500 focus:ring-1 focus:ring-matcha-500 text-stone-700 placeholder-stone-300 font-semibold transition-all"
            placeholder="0"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold tracking-wider uppercase text-stone-400 mb-2">Stok</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-stone-50/50 border border-stone-200 rounded-2xl focus:outline-none focus:border-matcha-500 focus:ring-1 focus:ring-matcha-500 text-stone-700 placeholder-stone-300 font-semibold transition-all"
            placeholder="0"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold tracking-wider uppercase text-stone-400 mb-2">Kategori</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-4 py-2.5 text-sm bg-stone-50/50 border border-stone-200 rounded-2xl focus:outline-none focus:border-matcha-500 focus:ring-1 focus:ring-matcha-500 text-stone-700 font-semibold transition-all cursor-pointer"
          required
        >
          <option value="" className="text-stone-400">Pilih Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold tracking-wider uppercase text-stone-400 mb-2">Gambar Produk (Opsional)</label>
        <div className="mt-1 flex flex-col items-center justify-center p-4 border border-stone-200 border-dashed rounded-2xl bg-stone-50/50 text-stone-400 hover:bg-stone-50 transition-all">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="w-full text-xs text-stone-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-matcha-50 file:text-matcha-700 hover:file:bg-matcha-100 cursor-pointer"
          />
          {initialData?.image_url && !file && (
            <p className="mt-2 text-[10px] text-stone-400 font-medium">Kosongkan jika tidak ingin mengubah gambar.</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3.5 rounded-2xl text-white font-extrabold tracking-wider text-xs uppercase transition-all duration-200 active:scale-[0.98] shadow-md ${
          loading 
            ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none' 
            : 'bg-matcha-600 hover:bg-matcha-700 shadow-matcha-100/80 cursor-pointer'
        }`}
      >
        {loading ? 'Menyimpan...' : (initialData ? 'Simpan Perubahan' : 'Tambah Produk')}
      </button>
    </form>
  )
}