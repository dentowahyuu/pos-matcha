'use client'

import React from 'react'

// Definisikan tipe data yang dibutuhkan untuk struk
// Anda bisa menyesuaikan ini dengan tipe Transaction yang ada di @/types jika sudah ada
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
    // Membuka jendela baru untuk print
    const printWindow = window.open('', '_blank', 'width=400,height=600')
    if (!printWindow) {
      alert('Pop-up diblokir. Mohon izinkan pop-up untuk situs ini agar bisa mencetak struk.')
      return
    }

    const dateStr = new Date(transaction.date).toLocaleString('id-ID')
    
    // Helper format Rupiah
    const formatRp = (num: number) => `Rp ${num.toLocaleString('id-ID')}`

    // Template HTML untuk struk
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Struk #${transaction.id}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Courier New', Courier, monospace; padding: 20px; max-width: 300px; margin: 0 auto; color: #000; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
            .title { font-size: 16px; font-weight: bold; text-transform: uppercase; }
            .subtitle { font-size: 12px; margin-top: 5px; }
            .meta { font-size: 12px; margin-bottom: 15px; }
            .meta-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
            .items { margin-bottom: 15px; border-bottom: 1px dashed #000; padding-bottom: 15px; }
            .item { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; }
            .total-section { font-size: 14px; font-weight: bold; border-bottom: 1px dashed #000; padding-bottom: 15px; margin-bottom: 15px; }
            .total-row { display: flex; justify-content: space-between; margin-top: 5px; }
            .footer { text-align: center; font-size: 10px; margin-top: 20px; }
            .no-print { display: none; }
            @media print {
              .no-print { display: none !important; }
              @page { margin: 0; }
              body { padding: 10px; }
            }
            .btn-print {
              display: block; width: 100%; padding: 12px; background: #000; color: #fff; text-align: center; border: none; margin-top: 20px; cursor: pointer; font-size: 14px; border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">POS Matcha</div>
            <div class="subtitle">Indonesia</div>
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
            <p>Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.</p>
          </div>

          <!-- Tombol Manual untuk HP jika auto-print gagal -->
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
      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition border border-gray-300"
      title="Cetak Struk"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
      </svg>
      Cetak
    </button>
  )
}