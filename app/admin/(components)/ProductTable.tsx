// app/admin/(components)/ProductTable.tsx
import { Product } from '@/types/index'

interface Props {
  products: Product[];
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
}

export default function ProductTable({ products, onDelete, onEdit }: Props) {
  return (
    <div className="overflow-x-auto mt-8 bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 text-black">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Produk</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Harga</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Stok</th>
            <th className="px-6 py-3 text-center text-xs font-medium uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((p) => (
            <tr key={p.id}>
              <td className="px-6 py-4 flex items-center gap-3">
                <img src={p.image_url} className="w-10 h-10 object-cover rounded" />
                <span>{p.name}</span>
              </td>
              <td className="px-6 py-4">Rp {p.price.toLocaleString()}</td>
              <td className="px-6 py-4">{p.stock}</td>
              <td className="px-6 py-4 text-center space-x-2">
                <button onClick={() => onEdit(p)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => onDelete(p.id)} className="text-red-600 hover:underline">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}