import { useState } from 'react';
import { CartItem } from '@/types/index';

interface Transaction {
  id: string;
  created_at: string;
  total_price: number;
  payment_method: string;
}

interface CartProps {
  cart: CartItem[];
  onCheckout: (method: 'CASH' | 'QRIS') => Promise<Transaction | null>;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export default function Cart({ cart, onCheckout, onUpdateQty, onRemove }: CartProps) {
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'QRIS'>('CASH');
  const [receipt, setReceipt] = useState<{ transaction: Transaction, items: CartItem[] } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // TypeScript sekarang tahu item.price dan item.qty adalah number
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handlePayment = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    
    // Simpan item saat ini untuk struk karena cart akan dikosongkan oleh hook
    const currentItems = [...cart];
    const transaction = await onCheckout(paymentMethod);
    
    if (transaction) {
      setReceipt({ transaction, items: currentItems });
    }
    setIsProcessing(false);
  };

  const handlePrint = () => {
    if (!receipt) return;

    // Buka jendela baru untuk struk
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked. Mohon izinkan pop-up untuk mencetak struk.');
      return;
    }

    // Generate HTML untuk item belanja
    const itemsHtml = receipt.items.map(item => `
      <div class="item">
        <span>${item.name} x${item.qty}</span>
        <span>Rp ${(item.price * item.qty).toLocaleString('id-ID')}</span>
      </div>
    `).join('');

    // Template HTML Struk Thermal
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Struk Pembayaran</title>
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
            @media print {
              @page { margin: 0; }
              body { padding: 10px; }
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
              <span>${new Date(receipt.transaction.created_at).toLocaleString('id-ID')}</span>
            </div>
            <div class="meta-row">
              <span>No. Transaksi:</span>
              <span>#${receipt.transaction.id.slice(0, 8)}</span>
            </div>
            <div class="meta-row">
              <span>Pembayaran:</span>
              <span>${receipt.transaction.payment_method}</span>
            </div>
          </div>

          <div class="items">
            ${itemsHtml}
          </div>

          <div class="total-section">
            <div class="total-row">
              <span>TOTAL</span>
              <span>Rp ${receipt.transaction.total_price.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div class="footer">
            <p>Terima Kasih atas kunjungan Anda!</p>
            <p>Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.</p>
          </div>
          
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="w-96 bg-white rounded-lg shadow-lg p-6 flex flex-col h-full border-l border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-black border-b pb-2">Keranjang</h2>
      
      <div className="flex-1 overflow-y-auto pr-2">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-40">
            <p className="mt-4">Keranjang kosong</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex flex-col mb-3 text-gray-700 border-b border-gray-50 pb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">@ Rp {item.price.toLocaleString()}</p>
                </div>
                <p className="font-semibold text-gray-900 text-sm">
                  Rp {(item.price * item.qty).toLocaleString()}
                </p>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button 
                    onClick={() => onUpdateQty(item.id, -1)}
                    className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition font-bold"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
                  <button 
                    onClick={() => onUpdateQty(item.id, 1)}
                    className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:bg-green-50 hover:text-green-600 transition font-bold"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={() => onRemove(item.id)}
                  className="text-gray-400 hover:text-red-500 transition p-1"
                  title="Hapus Item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t pt-4 mt-4">
        {/* Pilihan Metode Pembayaran */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Metode Pembayaran:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPaymentMethod('CASH')}
              className={`py-2 px-4 rounded-lg text-sm font-bold border transition-all ${
                paymentMethod === 'CASH' 
                  ? 'bg-blue-50 border-blue-500 text-blue-700' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              💵 CASH
            </button>
            <button
              onClick={() => setPaymentMethod('QRIS')}
              className={`py-2 px-4 rounded-lg text-sm font-bold border transition-all ${
                paymentMethod === 'QRIS' 
                  ? 'bg-blue-50 border-blue-500 text-blue-700' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              📱 QRIS
            </button>
          </div>
        </div>

        <div className="flex justify-between text-xl font-bold text-black mb-6">
          <span>Total:</span>
          <span className="text-green-600">Rp {total.toLocaleString()}</span>
        </div>
        
        <button 
          disabled={cart.length === 0 || isProcessing}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 transition-all active:scale-95 shadow-lg shadow-green-100 disabled:shadow-none"
          onClick={handlePayment}
        >
          {isProcessing ? 'Memproses...' : 'BAYAR SEKARANG'}
        </button>
      </div>

      {/* Modal Struk */}
      {receipt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl overflow-hidden">
            <div className="p-6 text-center border-b border-dashed border-gray-300">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Pembayaran Berhasil!</h3>
              <p className="text-sm text-gray-500 mt-1">POS Matcha Indonesia</p>
            </div>
            
            <div className="p-6 bg-gray-50 space-y-4 text-sm">
              <div className="flex justify-between text-gray-500 text-xs">
                <span>{new Date(receipt.transaction.created_at).toLocaleString('id-ID')}</span>
                <span>#{receipt.transaction.id.slice(0, 8)}</span>
              </div>
              
              <div className="border-t border-dashed border-gray-300 my-2"></div>
              
              <div className="space-y-2">
                {receipt.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-gray-700">
                    <span>{item.name} <span className="text-gray-400">x{item.qty}</span></span>
                    <span>Rp {(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-300 my-2"></div>

              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>Rp {receipt.transaction.total_price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-xs mt-1">
                <span>Metode Bayar</span>
                <span className="font-semibold">{receipt.transaction.payment_method}</span>
              </div>
            </div>

            <div className="p-4 bg-white border-t flex gap-3">
              <button 
                onClick={handlePrint}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                Cetak
              </button>
              <button 
                onClick={() => setReceipt(null)}
                className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                Tutup & Transaksi Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}