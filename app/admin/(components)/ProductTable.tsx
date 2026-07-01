import { Product } from '@/types/index'
import { PencilSimple, TrashSimple } from '@phosphor-icons/react'

interface Props {
  products: Product[];
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
}

export default function ProductTable({ products, onDelete, onEdit }: Props) {
  return (
    <div className="overflow-x-auto border border-stone-200/60 rounded-2xl bg-white shadow-sm">
      <table className="min-w-full divide-y divide-stone-150 text-stone-800 text-sm">
        <thead className="bg-stone-50/50">
          <tr>
            <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-stone-400">Produk</th>
            <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-stone-400">Harga</th>
            <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-stone-400">Stok</th>
            <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-wider text-stone-400">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {products.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-10 text-center text-xs font-semibold text-stone-400">
                Belum ada menu produk. Silakan tambahkan baru.
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id} className="hover:bg-stone-50/30 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-stone-200/50 shadow-sm" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg border border-stone-200/50 bg-stone-100 flex items-center justify-center text-[10px] text-stone-400 font-bold uppercase">
                      No img
                    </div>
                  )}
                  <span className="font-semibold text-stone-850 tracking-tight">{p.name}</span>
                </td>
                <td className="px-6 py-4 font-bold text-matcha-600">Rp {p.price.toLocaleString('id-ID')}</td>
                <td className="px-6 py-4 font-semibold">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    p.stock > 5 
                      ? 'bg-matcha-50 text-matcha-700' 
                      : p.stock > 0 
                      ? 'bg-yellow-50 text-yellow-700' 
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {p.stock} pcs
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => onEdit(p)} 
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-matcha-50 hover:bg-matcha-100/60 text-matcha-750 text-xs font-extrabold rounded-xl border border-matcha-200/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <PencilSimple size={14} />
                      Ubah
                    </button>
                    <button 
                      onClick={() => onDelete(p.id)} 
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100/60 text-red-650 text-xs font-extrabold rounded-xl border border-red-200/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <TrashSimple size={14} />
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}