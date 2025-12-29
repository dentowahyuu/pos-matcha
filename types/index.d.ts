// types/index.ts

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image_url?: string; // Tanda tanya berarti opsional
  category_id?: string;
  created_at?: string;
}

export interface CartItem extends Product {
  qty: number;
}

export interface Transaction {
  id?: string;
  total_price: number;
  payment_method: string;
  created_at?: string;
}