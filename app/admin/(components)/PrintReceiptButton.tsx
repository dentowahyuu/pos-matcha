'use client'

import React from 'react'
import { Printer } from '@phosphor-icons/react'

export interface TransactionItem {
  name: string
  price: number
  quantity: number
}

export interface Transaction {
  id: string
  date: string | Date
  items: TransactionItem[]
  total: number
  paymentMethod?: string
}

interface PrintReceiptButtonProps {
  transaction: Transaction
}

export default function PrintReceiptButton({ transaction }: PrintReceiptButtonProps) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=400,height=600')
    if (!printWindow) {
      alert('Pop-up diblokir. Mohon izinkan pop-up untuk situs ini agar bisa mencetak struk.')
      return
    }

    const dateStr = new Date(transaction.date).toLocaleString('id-ID')
    const formatRp = (num: number) => `Rp ${num.toLocaleString('id-ID')}`

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Struk #${transaction.id}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: 'Courier New', Courier, monospace; 
              padding: 24px; 
              max-width: 320px; 
              margin: 0 auto; 
              color: #1c1d1a; 
              background: #fff;
            }
            .header { 
              text-align: center; 
              margin-bottom: 24px; 
              border-bottom: 1px dashed #c0c0b8; 
              padding-bottom: 16px; 
            }
            .title { 
              font-size: 18px; 
              font-weight: bold; 
              text-transform: uppercase; 
              letter-spacing: 1px;
            }
            .subtitle { 
              font-size: 11px; 
              margin-top: 6px; 
              color: #666;
            }
            .meta { 
              font-size: 11px; 
              margin-bottom: 20px; 
              color: #444;
            }
            .meta-row { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 6px; 
            }
            .items { 
              margin-bottom: 20px; 
              border-bottom: 1px dashed #c0c0b8; 
              padding-bottom: 16px; 
            }
            .item { 
              display: flex; 
              justify-content: space-between; 
              font-size: 11px; 
              margin-bottom: 8px; 
            }
            .total-section { 
              font-size: 14px; 
              font-weight: bold; 
              border-bottom: 1px dashed #c0c0b8; 
              padding-bottom: 16px; 
              margin-bottom: 20px; 
            }
            .total-row { 
              display: flex; 
              justify-content: space-between; 
              margin-top: 6px; 
            }
            .footer { 
              text-align: center; 
              font-size: 10px; 
              margin-top: 24px; 
              color: #666;
              line-height: 1.4;
            }
            .no-print { 
              display: none; 
            }
            @media print {
              .no-print { display: none !important; }
              @page { margin: 0; }
              body { padding: 12px; }
            }
            .btn-print {
              display: block; 
              width: 100%; 
              padding: 12px; 
              background: #588157; 
              color: #fff; 
              text-align: center; 
              border: none; 
              margin-top: 24px; 
              cursor: pointer; 
              font-size: 12px; 
              font-weight: bold;
              border-radius: 8px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Matcha POS</div>
            <div class="subtitle">🍃 Premium Matcha Café 🍃</div>
          </div>
          
          <div class="meta">
            <div class="meta-row">
              <span>Tanggal:</span>
              <span>${dateStr}</span>
            </div>
            <div class="meta-row">
              <span>No. Transaksi:</span>
              <span>#${transaction.id.slice(0, 8)}</span>
            </div>
            ${transaction.paymentMethod ? `
            <div class="meta-row">
              <span>Pembayaran:</span>
              <span>${transaction.paymentMethod}</span>
            </div>
            ` : ''}
          </div>

          <div class="items">
            ${transaction.items.map(item => `
              <div class="item">
                <span>${item.name} x${item.quantity}</span>
                <span>${formatRp(item.price * item.quantity)}</span>
              </div>
            `).join('')}
          </div>

          <div class="total-section">
            <div class="total-row">
              <span>TOTAL</span>
              <span>${formatRp(transaction.total)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Terima Kasih atas kunjungan Anda!</p>
            <p>Nikmati kebaikan teh hijau premium kami setiap hari.</p>
          </div>

          <button class="btn-print no-print" onclick="window.print()">Cetak Struk</button>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            }
          </script>
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
  }

  return (
    <button
      onClick={handlePrint}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200/60 text-stone-650 text-xs font-extrabold rounded-xl border border-stone-200/50 shadow-sm active:scale-95 transition-all cursor-pointer"
      title="Cetak Struk"
    >
      <Printer size={14} />
      <span>CETAK</span>
    </button>
  )
}