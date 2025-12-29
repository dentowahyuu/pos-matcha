'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

interface TransactionItem {
  id: string
  quantity: number
  price_at_time: number
  products: {
    name: string
  } | null
}

interface Transaction {
  id: string
  created_at: string
  total_price: number
  payment_method: string
  transaction_items: TransactionItem[]
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        transaction_items (
          quantity,
          price_at_time,
          products (
            name
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching transactions:', error)
    } else {
      setTransactions(data || [])
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-100 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Riwayat Transaksi</h1>
            <p className="text-sm text-gray-500">Laporan penjualan dan detail item</p>
          </div>
          <Link
            href="/admin"
            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 transition"
          >
            ← Kembali ke Admin
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Memuat data transaksi...</div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Belum ada transaksi.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-100 uppercase text-xs font-semibold text-gray-700">
                  <tr>
                    <th className="px-6 py-4">ID / Waktu</th>
                    <th className="px-6 py-4">Detail Item</th>
                    <th className="px-6 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 align-top">
                        <div className="font-medium text-gray-900">#{trx.id.slice(0, 8)}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(trx.created_at).toLocaleString('id-ID')}
                        </div>
                        <div className="mt-1 inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                          {trx.payment_method}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <ul className="space-y-1">
                          {trx.transaction_items.map((item, idx) => (
                            <li key={idx} className="flex justify-between text-gray-700">
                              <span>
                                {item.products?.name || 'Produk Dihapus'} <span className="text-gray-400">x{item.quantity}</span>
                              </span>
                              <span className="text-gray-500">
                                Rp {(item.price_at_time * item.quantity).toLocaleString('id-ID')}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4 align-top text-right font-bold text-gray-900">
                        Rp {trx.total_price.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
