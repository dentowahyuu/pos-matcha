'use client'

import { WarningCircle, CheckCircle, XCircle, Info, X } from '@phosphor-icons/react'
import { PosToast } from '@/hooks/usePos'

interface ToastProps {
  toast: PosToast | null
  onClose: () => void
}

export default function Toast({ toast, onClose }: ToastProps) {
  if (!toast) return null

  const isWarning = toast.type === 'warning'
  const isError = toast.type === 'error'
  const isSuccess = toast.type === 'success'

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-none transition-all duration-300">
      <div 
        className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md border transition-all transform animate-bounce-once ${
          isWarning
            ? 'bg-amber-600 text-white border-amber-500 shadow-amber-900/20'
            : isError
            ? 'bg-rose-600 text-white border-rose-500 shadow-rose-900/20'
            : isSuccess
            ? 'bg-matcha-600 text-white border-matcha-500 shadow-matcha-900/20'
            : 'bg-stone-800 text-white border-stone-700 shadow-stone-900/20'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0">
            {isWarning && <WarningCircle size={24} weight="fill" className="text-amber-100" />}
            {isError && <XCircle size={24} weight="fill" className="text-rose-100" />}
            {isSuccess && <CheckCircle size={24} weight="fill" className="text-matcha-100" />}
            {!isWarning && !isError && !isSuccess && <Info size={24} weight="fill" className="text-stone-200" />}
          </div>
          <p className="text-xs sm:text-sm font-semibold leading-snug drop-shadow-sm">
            {toast.message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-white/20 active:scale-95 transition-colors text-white"
          aria-label="Tutup notifikasi"
        >
          <X size={16} weight="bold" />
        </button>
      </div>
    </div>
  )
}
