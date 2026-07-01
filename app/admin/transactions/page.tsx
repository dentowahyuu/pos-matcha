'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import PrintReceiptButton from '../(components)/PrintReceiptButton'
import { Leaf, ArrowLeft, Clock, Info } from '@phosphor-icons/react'

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
    <div className="min-h-[100dvh] bg-stone-50/50 text-stone-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-matcha-50 text-matcha-600">
              <Clock size={24} weight="fill" />
            </div>
            <div>
              <h1 className="text-xl font-black text-stone-900 tracking-tight">Riwayat Transaksi</h1>
              <p className="text-xs font-semibold text-stone-400 mt-0.5">Laporan penjualan dan detail penjualan menu</p>
            </div>
          </div>
          <Link
            href="/admin"
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-stone-100/80 hover:bg-stone-200/60 text-stone-600 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm border border-stone-200/40 active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} weight="bold" />
            <span>KEMBALI KE ADMIN</span>
          </Link>
        </header>

        {/* Transaction Table Panel */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-stone-400 gap-3">
              <div className="w-8 h-8 border-4 border-stone-200 border-t-matcha-600 rounded-full animate-spin"></div>
              <span className="text-xs font-bold tracking-wider uppercase">Memuat data transaksi...</span>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center text-stone-400">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-3">
                <Info size={24} />
              </div>
              <h3 className="text-sm font-semibold text-stone-600">Belum ada transaksi</h3>
              <p className="text-xs text-stone-400 mt-1 max-w-[28ch] leading-relaxed">
                Riwayat transaksi kosong. Silakan lakukan penjualan di aplikasi kasir.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-stone-600">
                <thead className="bg-stone-50/50 border-b border-stone-200/60">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-400">ID / Waktu</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-stone-400">Detail Item</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-stone-400">Total & Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {transactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-stone-50/30 transition-colors">
                      <td className="px-6 py-5 align-top">
                        <div className="font-extrabold text-stone-900 tracking-tight">#{trx.id.slice(0, 8)}</div>
                        <div className="text-xs text-stone-400 mt-1 font-medium">
                          {new Date(trx.created_at).toLocaleString('id-ID')}
                        </div>
                        <div className="mt-2.5">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${
                            trx.payment_method === 'QRIS'
                              ? 'bg-matcha-50 text-matcha-700'
                              : 'bg-stone-100 text-stone-700'
                          }`}>
                            {trx.payment_method}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 align-top">
                        <ul className="space-y-2">
                          {trx.transaction_items.map((item, idx) => (
                            <li key={idx} className="flex justify-between text-stone-700 font-medium">
                              <span>
                                {item.products?.name || 'Produk Dihapus'} <span className="text-stone-400 ml-1 font-bold">x{item.quantity}</span>
                              </span>
                              <span className="text-stone-550 font-semibold">
                                Rp {(item.price_at_time * item.quantity).toLocaleString('id-ID')}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-5 align-top text-right space-y-3">
                        <div className="font-black text-matcha-600 text-base">
                          Rp {trx.total_price.toLocaleString('id-ID')}
                        </div>
                        <div>
                          <PrintReceiptButton
                            transaction={{
                              id: trx.id,
                              date: trx.created_at,
                              total: trx.total_price,
                              paymentMethod: trx.payment_method,
                              items: trx.transaction_items.map((item) => ({
                                name: item.products?.name || 'Produk Dihapus',
                                price: item.price_at_time,
                                quantity: item.quantity,
                              })),
                            }}
                          />
                        </div>
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

