export interface ImageVariants {
  thumb: string;
  card: string;
  full: string;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'distance_asc' | 'stock_asc';
  lat?: number;
  lng?: number;
  radius?: number;
  page?: number;
  limit?: number;
  maxPrice?: number;
  expiry?: 'Hari Ini' | '< 1 Jam' | '< 3 Jam' | '< 6 Jam';
  ids?: string; // comma-separated UUIDs
}

export interface Product {
  id: string;
  name: string;
  storeName: string;
  originalPrice: number;
  discountedPrice: number;
  stock: number;
  imageUrl: string | null;
  imageVariants: ImageVariants | null;
  category: 'meals' | 'bakery' | 'drinks';
  description?: string;
  discountPercent?: number;
  storeAddress?: string;
  storeLat?: number;
  storeLng?: number;
  expiresAt?: string;
  distanceKm?: number;
  averageRating?: number;
  reviewCount?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  storeName: string;
  price: number;
  originalPrice: number;
  quantity: number;
  imageUrl: string | null;
  imageVariants: ImageVariants | null;
  stock: number;
}

export interface Cart {
  id: string;
  storeName: string | null;
  items: CartItem[];
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  storeName: string;
  price: number;
  originalPrice: number;
  quantity: number;
  imageUrl: string | null;
  imageVariants: ImageVariants | null;
}

export interface Order {
  id: string;
  status: string;
  pickupCode: string;
  total: number;
  savingAmount: number;
  storeName: string;
  pickupExpiresAt?: string;
  items: OrderItem[];
  buyerName: string;
  buyerPhone: string;
  notes?: string;
  createdAt?: string;
  hasReviewed?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  productId?: string;
  orderId?: string;
  isRead: boolean;
  createdAt: string;
  relativeTime: string;
}

export interface ReviewItem {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  distribution: Record<number, number>;
}

export interface ProductReviewsResponse {
  summary: ReviewSummary;
  reviews: ReviewItem[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: 'FOOD_SAVER' | 'MITRA';
  isVerified: boolean;
}

export interface MitraProduct {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  stock: number;
  imageUrl: string | null;
  imageVariants: ImageVariants | null;
  category: string;
  description?: string;
  expiresAt: string;
}

export interface MitraOrder {
  id: string;
  status: string;
  pickupCode: string;
  total: number;
  savingAmount: number;
  items: OrderItem[];
  buyerName: string;
  buyerPhone: string;
  notes?: string;
  createdAt: string;
}

export interface MitraStats {
  totalRevenue: number;
  mealsSaved: number;
  activeProductsCount: number;
  pendingOrdersCount: number;
  activeOrders: number;
  productCount: number;
  totalSold: number;
  revenue: number;
}
