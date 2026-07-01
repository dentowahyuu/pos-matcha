'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Leaf, EnvelopeSimple, LockSimple, ArrowRight, WarningCircle } from '@phosphor-icons/react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      window.location.replace('/')
    }
  }

  return (
    <div className="min-h-[100dvh] flex bg-stone-50 font-sans">
      {/* Left Column: Visual Asset (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-stone-900 overflow-hidden select-none">
        <img 
          src="/matcha-hero.png" 
          alt="Premium Matcha Tea" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay scale-100 hover:scale-105 transition-transform duration-10000 ease-out"
        />
        {/* Abstract pattern & branding */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/40" />
        <div className="absolute bottom-16 left-16 right-16 text-white space-y-4 z-10">
          <div className="flex items-center gap-2 text-matcha-200">
            <Leaf size={28} weight="fill" />
            <span className="text-sm font-bold tracking-widest uppercase">Matcha POS</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight max-w-[15ch]">
            Keindahan dalam kesederhanaan.
          </h2>
          <p className="text-stone-300 text-sm font-medium leading-relaxed max-w-[40ch]">
            Kebaikan teh hijau premium Jepang dalam setiap gelas. Kelola transaksi penjualan dengan sistem kasir yang modern, tenang, dan efisien.
          </p>
        </div>
      </div>

      {/* Right Column: Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16">
        <div className="w-full max-w-md bg-white border border-stone-200/60 p-8 sm:p-10 rounded-3xl shadow-xl shadow-stone-100/60 flex flex-col space-y-8">
          
          {/* Header & Logo */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-matcha-50 text-matcha-600 flex items-center justify-center shadow-inner">
              <Leaf size={26} weight="fill" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">Selamat Datang</h1>
              <p className="text-xs font-semibold text-stone-400 mt-1">Masuk untuk mengelola kasir dan menu produk</p>
            </div>
          </div>
          
          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl text-xs font-semibold animate-shake">
              <WarningCircle size={20} weight="fill" className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold tracking-wider uppercase text-stone-400 mb-2">Alamat Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                  <EnvelopeSimple size={18} />
                </span>
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 text-sm bg-stone-50/50 border border-stone-200 rounded-2xl focus:outline-none focus:border-matcha-500 focus:ring-1 focus:ring-matcha-500 text-stone-700 placeholder-stone-400/80 transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pos.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wider uppercase text-stone-400 mb-2">Kata Sandi</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                  <LockSimple size={18} />
                </span>
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 text-sm bg-stone-50/50 border border-stone-200 rounded-2xl focus:outline-none focus:border-matcha-500 focus:ring-1 focus:ring-matcha-500 text-stone-700 placeholder-stone-400/80 transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-matcha-600 text-white py-3.5 rounded-2xl font-bold hover:bg-matcha-700 disabled:bg-stone-200 disabled:text-stone-400 active:scale-[0.98] transition-all shadow-lg shadow-matcha-100/80 disabled:shadow-none text-sm"
            >
              <span>{loading ? 'Memproses...' : 'MASUK SEKARANG'}</span>
              {!loading && <ArrowRight size={16} weight="bold" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}