// Shared types for the restaurant system

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: 'main' | 'appetizer' | 'dessert' | 'drink';
  spicyLevel: number; // 0-3
  isAvailable: boolean;
}

export interface Order {
  id: string;
  queueNumber: number;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'cooking' | 'ready' | 'completed';
  timestamp: Date;
  tableNumber?: number;
  userId?: string;
  orderType: 'game' | 'lazy';
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  customizations?: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  coins: number;
  memberSince: Date;
  favoriteItems: string[];
  totalOrders: number;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  image: string;
  caption: string;
  likes: number;
  comments: Comment[];
  timestamp: Date;
  menuType?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
}

export interface Review {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  timestamp: Date;
  menuItems: string[];
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface Ingredient {
  id: string;
  name: string;
  icon: string; // Can be an emoji or an image URL
  category: 'meat' | 'seafood' | 'vegetable' | 'sauce' | 'spice' | 'topping';
}