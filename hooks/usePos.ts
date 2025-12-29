import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Product, CartItem, Category } from '@/types/index'

export function usePos() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) {
      console.error(error)
      return
    }
    setProducts(data as Product[])
  }

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error(error)
      return
    }
    setCategories(data as Category[])
  }

  // --- FUNGSI: TAMBAH PRODUK ---
  const addProduct = async (
    name: string, 
    price: number, 
    stock: number, 
    categoryId: string,
    imageFile?: File
  ) => {
    try {
      let imageUrl = '';
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile, { upsert: true });

        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }

      const { error: dbError } = await supabase
        .from('products')
        .insert([{ name, price, stock, category_id: categoryId, image_url: imageUrl }]);

      if (dbError) throw dbError;
      alert('Produk berhasil ditambahkan!');
      fetchProducts(); 
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menambah produk');
    }
  }

// --- FUNGSI UPDATE PRODUK (Tanpa Any) ---
  const updateProduct = async (
    id: string,
    name: string,
    price: number,
    stock: number,
    categoryId: string,
    imageFile?: File
  ) => {
    try {
      let imageUrl = '';
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile, { upsert: true });

        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }

      // Menggunakan Partial<Product> agar aman dan tidak merah
      const updatePayload: Partial<Product> = { 
        name, 
        price, 
        stock, 
        category_id: categoryId 
      };

      // Hanya tambahkan image_url jika ada gambar baru yang diupload
      if (imageUrl) {
        updatePayload.image_url = imageUrl;
      }

      const { error: dbError } = await supabase
        .from('products')
        .update(updatePayload)
        .eq('id', id);

      if (dbError) throw dbError;
      alert('Produk berhasil diperbarui!');
      fetchProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal memperbarui produk');
    }
  }

// --- FUNGSI BARU: DELETE PRODUK ---
  const deleteProduct = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;

    try {
      // Cek apakah produk sudah pernah terjual (ada di transaction_items)
      const { count, error: checkError } = await supabase
        .from('transaction_items')
        .select('*', { count: 'exact', head: true })
        .eq('product_id', id);

      if (checkError) throw checkError;

      if (count && count > 0) {
        alert('Gagal hapus: Produk ini sudah memiliki riwayat transaksi. Menghapusnya akan merusak data laporan.');
        return;
      }

      const { error: dbError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;
      alert('Produk berhasil dihapus!');
      fetchProducts();
    } catch (err) { 
      // Menggunakan pengecekan tipe instance of Error atau pesan default
      const errorMessage = err instanceof Error ? err.message : 'Gagal menghapus produk';
      alert(errorMessage);
    }
  }

  // --- LOGIKA KASIR ---
  const addToCart = (product: Product) => {
    if (product.stock <= 0) return
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        if (existing.qty >= product.stock) return prev
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.id === productId) {
          const newQty = item.qty + delta
          if (newQty > item.stock) return item // Jangan melebihi stok
          if (newQty < 1) return null // Jika < 1, tandai untuk dihapus (atau biarkan 1)
          return { ...item, qty: newQty }
        }
        return item
      }).filter((item): item is CartItem => item !== null) // Hapus item yang null (qty < 1)
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }

  const handleCheckout = async (paymentMethod: 'CASH' | 'QRIS') => {
    if (cart.length === 0) return null
    try {
      const total_price = cart.reduce((sum, item) => sum + (item.price * item.qty), 0)
      const { data: transData, error: transError } = await supabase
        .from('transactions')
        .insert([{ total_price, payment_method: paymentMethod }])
        .select().single()

      if (transError) throw transError

      const itemPromises = cart.map(async (item) => {
        await supabase.from('transaction_items').insert([{
          transaction_id: transData.id,
          product_id: item.id,
          quantity: item.qty,
          price_at_time: item.price
        }])
        
        await supabase.from('products')
          .update({ stock: item.stock - item.qty })
          .eq('id', item.id)
      })

      await Promise.all(itemPromises)
      setCart([])
      fetchProducts() 
      return transData // Kembalikan data transaksi untuk struk
    } catch (err) {
      let message = 'Terjadi kesalahan';
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        message = (err as { message: string }).message;
      }
      alert('Gagal memproses transaksi: ' + message);
      return null
    }
  }

  return { 
    products, 
    categories, 
    cart, 
    addToCart, 
    handleCheckout,
    addProduct,
    updateProduct, // Ekspos fungsi update
    deleteProduct,  // Ekspos fungsi delete
    updateQuantity,
    removeFromCart
  }
}