import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order, User, CommunityPost, Review, MenuItem } from '../types';
import { mockOrders, mockUser, communityPosts, reviews, menuItems } from '../data/mockData';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  posts: CommunityPost[];
  addPost: (post: CommunityPost) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, comment: { id: string; userId: string; userName: string; text: string; timestamp: Date }) => void;
  reviewsList: Review[];
  addReview: (review: Review) => void;
  menuItems: MenuItem[];
  currentQueueNumber: number;
  spendCoins: (amount: number) => boolean;
  addCoins: (amount: number) => void;
  skipQueue: (queues: number) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUser);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [posts, setPosts] = useState<CommunityPost[]>(communityPosts);
  const [reviewsList, setReviewsList] = useState<Review[]>(reviews);
  const [currentQueueNumber, setCurrentQueueNumber] = useState(45);

  const addOrder = (order: Order) => {
    const newOrder = { ...order, queueNumber: currentQueueNumber };
    setOrders([...orders, newOrder]);
    setCurrentQueueNumber(currentQueueNumber + 1);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const addPost = (post: CommunityPost) => {
    setPosts([post, ...posts]);
  };

  const likePost = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const addComment = (postId: string, comment: { id: string; userId: string; userName: string; text: string; timestamp: Date }) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, comments: [...post.comments, comment] } : post
    ));
  };

  const addReview = (review: Review) => {
    setReviewsList([review, ...reviewsList]);
  };

  const spendCoins = (amount: number): boolean => {
    if (user && user.coins >= amount) {
      setUser({ ...user, coins: user.coins - amount });
      return true;
    }
    return false;
  };

  const addCoins = (amount: number) => {
    if (user) {
      setUser({ ...user, coins: user.coins + amount });
    }
  };

  const skipQueue = (queues: number): boolean => {
    const cost = queues * 100;
    if (spendCoins(cost)) {
      setCurrentQueueNumber(currentQueueNumber - queues);
      return true;
    }
    return false;
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      orders,
      addOrder,
      updateOrderStatus,
      posts,
      addPost,
      likePost,
      addComment,
      reviewsList,
      addReview,
      menuItems,
      currentQueueNumber,
      spendCoins,
      addCoins,
      skipQueue,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}