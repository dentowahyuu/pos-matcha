import { useState } from 'react';
import { CartItem } from '@/types/index';
import { Trash, Coins, QrCode, Printer, CheckCircle, X, Plus, Minus, Receipt } from '@phosphor-icons/react';

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
  onClose?: () => void;
}

export default function Cart({ cart, onCheckout, onUpdateQty, onRemove, onClose }: CartProps) {
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'QRIS'>('CASH');
  const [receipt, setReceipt] = useState<{ transaction: Transaction, items: CartItem[] } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handlePayment = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    
    const currentItems = [...cart];
    const transaction = await onCheckout(paymentMethod);
    
    if (transaction) {
      setReceipt({ transaction, items: currentItems });
    }
    setIsProcessing(false);
  };

  const handlePrint = () => {
    if (!receipt) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up terblokir. Mohon izinkan pop-up untuk mencetak struk.');
      return;
    }

    const formatRp = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Struk Pembayaran</title>
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
              <span>${new Date(receipt.transaction.created_at).toLocaleString('id-ID')}</span>
            </div>
            <div class="meta-row">
              <span>No. Transaksi:</span>
              <span>#${receipt.transaction.id.slice(0, 8)}</span>
            </div>
            <div class="meta-row">
              <span>Metode Bayar:</span>
              <span>${receipt.transaction.payment_method}</span>
            </div>
          </div>

          <div class="items">
            ${receipt.items.map(item => `
              <div class="item">
                <span>${item.name} x${item.qty}</span>
                <span>${formatRp(item.price * item.qty)}</span>
              </div>
            `).join('')}
          </div>

          <div class="total-section">
            <div class="total-row">
              <span>TOTAL</span>
              <span>${formatRp(receipt.transaction.total_price)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Terima Kasih atas kunjungan Anda!</p>
            <p>Nikmati kebaikan teh hijau premium kami setiap hari.</p>
          </div>
          
          <button class="btn-print no-print" onclick="window.print()">Cetak Struk</button>

          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); }, 500);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="w-full md:w-96 bg-white border-l border-stone-200 flex flex-col h-full shadow-2xl md:shadow-none">
      {/* Header Cart */}
      <div className="flex justify-between items-center px-6 py-5 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <Receipt size={20} className="text-matcha-600" />
          <h2 className="text-base font-bold text-stone-900 tracking-tight">Daftar Belanja</h2>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden p-2 rounded-xl bg-white border border-stone-200 text-stone-500 hover:text-stone-700 active:scale-95 transition-all"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      {/* List Items */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-40 text-stone-400 py-16">
            <Receipt size={48} weight="light" className="mb-2 text-stone-300" />
            <p className="text-xs font-semibold tracking-wide uppercase">Keranjang kosong</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex flex-col pb-4 border-b border-stone-100 last:border-0 last:pb-0">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-stone-800 text-sm tracking-tight leading-tight">{item.name}</p>
                  <p className="text-xs text-stone-400 mt-1 font-medium">@ Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
                <p className="font-extrabold text-stone-900 text-sm whitespace-nowrap">
                  Rp {(item.price * item.qty).toLocaleString('id-ID')}
                </p>
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-2.5 bg-stone-100 rounded-full p-1 border border-stone-200/50">
                  <button 
                    onClick={() => onUpdateQty(item.id, -1)}
                    className="w-7 h-7 flex items-center justify-center bg-white rounded-full text-stone-600 hover:bg-red-50 hover:text-red-600 shadow-sm border border-stone-200/40 active:scale-90 transition-all text-xs font-bold"
                  >
                    <Minus size={12} weight="bold" />
                  </button>
                  <span className="text-sm font-bold w-6 text-center text-stone-800">{item.qty}</span>
                  <button 
                    onClick={() => onUpdateQty(item.id, 1)}
                    className="w-7 h-7 flex items-center justify-center bg-white rounded-full text-stone-600 hover:bg-matcha-50 hover:text-matcha-600 shadow-sm border border-stone-200/40 active:scale-90 transition-all text-xs font-bold"
                  >
                    <Plus size={12} weight="bold" />
                  </button>
                </div>
                <button 
                  onClick={() => onRemove(item.id)}
                  className="w-8 h-8 rounded-xl bg-stone-50 border border-stone-200/80 text-stone-400 hover:text-red-500 hover:border-red-200 flex items-center justify-center transition-all active:scale-90"
                  title="Hapus Item"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Summary & Actions */}
      <div className="border-t border-stone-200 p-6 bg-stone-50/50 space-y-5">
        {/* Payment Methods */}
        <div>
          <p className="text-xs font-bold tracking-wider uppercase text-stone-400 mb-2.5">Metode Pembayaran</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod('CASH')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold border transition-all duration-200 active:scale-[0.98] ${
                paymentMethod === 'CASH' 
                  ? 'bg-matcha-600 border-matcha-600 text-white shadow-sm shadow-matcha-100' 
                  : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50'
              }`}
            >
              <Coins size={18} />
              <span>TUNAI</span>
            </button>
            <button
              onClick={() => setPaymentMethod('QRIS')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold border transition-all duration-200 active:scale-[0.98] ${
                paymentMethod === 'QRIS' 
                  ? 'bg-matcha-600 border-matcha-600 text-white shadow-sm shadow-matcha-100' 
                  : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50'
              }`}
            >
              <QrCode size={18} />
              <span>QRIS</span>
            </button>
          </div>
        </div>

        {/* Grand Total */}
        <div className="flex justify-between items-baseline border-t border-stone-200/60 pt-4">
          <span className="text-sm font-bold text-stone-500 uppercase tracking-wider">Total</span>
          <span className="text-2xl font-extrabold text-matcha-600">Rp {total.toLocaleString('id-ID')}</span>
        </div>
        
        {/* Checkout Button */}
        <button 
          disabled={cart.length === 0 || isProcessing}
          className="w-full bg-matcha-600 text-white py-4 rounded-xl font-bold hover:bg-matcha-700 disabled:bg-stone-200 disabled:text-stone-400 transition-all active:scale-[0.98] shadow-lg shadow-matcha-100 disabled:shadow-none flex items-center justify-center gap-2"
          onClick={handlePayment}
        >
          {isProcessing ? 'Memproses...' : 'BAYAR SEKARANG'}
        </button>
      </div>

      {/* Success Receipt Modal */}
      {receipt && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-stone-150 transform transition-all">
            <div className="p-6 text-center border-b border-dashed border-stone-200 bg-stone-50/50">
              <div className="w-12 h-12 bg-matcha-50 text-matcha-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} weight="fill" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 tracking-tight">Pembayaran Sukses</h3>
              <p className="text-xs text-stone-400 mt-1">🍃 POS Matcha Indonesia 🍃</p>
            </div>
            
            <div className="p-6 bg-white space-y-4 text-xs">
              <div className="flex justify-between text-stone-400 font-medium">
                <span>{new Date(receipt.transaction.created_at).toLocaleString('id-ID')}</span>
                <span>#{receipt.transaction.id.slice(0, 8)}</span>
              </div>
              
              <div className="border-t border-dashed border-stone-200 my-2"></div>
              
              <div className="space-y-3">
                {receipt.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-stone-700 font-medium">
                    <span>{item.name} <span className="text-stone-400">x{item.qty}</span></span>
                    <span className="text-stone-900 font-semibold">Rp {(item.price * item.qty).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-stone-200 my-2"></div>

              <div className="flex justify-between font-extrabold text-base text-stone-900 pt-1">
                <span>Total</span>
                <span className="text-matcha-600">Rp {receipt.transaction.total_price.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-stone-500 font-medium pt-1">
                <span>Metode Pembayaran</span>
                <span className="font-bold text-stone-850">{receipt.transaction.payment_method}</span>
              </div>
            </div>

            <div className="p-5 bg-stone-50 border-t border-stone-150 flex gap-3">
              <button 
                onClick={handlePrint}
                className="flex-grow flex items-center justify-center gap-2 bg-matcha-600 text-white py-3 rounded-xl font-bold hover:bg-matcha-700 active:scale-95 transition-all text-xs shadow-md shadow-matcha-100"
              >
                <Printer size={16} />
                Cetak Struk
              </button>
              <button 
                onClick={() => setReceipt(null)}
                className="flex-grow bg-stone-900 text-white py-3 rounded-xl font-bold hover:bg-stone-800 active:scale-95 transition-all text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}