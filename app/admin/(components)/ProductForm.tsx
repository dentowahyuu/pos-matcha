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

  // Efek: Isi form otomatis jika initialData berubah (saat tombol Edit diklik)
    useEffect(() => {
  // Hanya jalankan logika jika memang ada data atau form perlu di-reset
  if (initialData) {
      setName(initialData.name);
      setPrice(initialData.price.toString());
      setStock(initialData.stock.toString());
      setCategoryId(initialData.category_id);
    setFile(null);
  } else {
    setName('');
    setPrice('');
    setStock('');
    setCategoryId('');
    setFile(null);
  }
}, [initialData]); // Dependency array sudah benar

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !price || !stock || !categoryId) {
      alert('Mohon lengkapi semua data wajib')
      return
    }
    onSubmit(name, Number(price), Number(stock), categoryId, file)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
          placeholder="Contoh: Matcha Latte"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Harga</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
            placeholder="0"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Stok</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
            placeholder="0"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Kategori</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
          required
        >
          <option value="">Pilih Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Gambar (Opsional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {initialData?.image_url && !file && (
          <p className="mt-1 text-xs text-gray-500">Biarkan kosong jika tidak ingin mengubah gambar.</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 rounded-md text-white transition ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {loading ? 'Menyimpan...' : (initialData ? 'Simpan Perubahan' : 'Tambah Produk')}
      </button>
    </form>
  )
}