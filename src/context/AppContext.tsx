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
  skipQueueForOrder: (orderId: string, queuesToSkip: number) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUser);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [posts, setPosts] = useState<CommunityPost[]>(communityPosts);
  const [reviewsList, setReviewsList] = useState<Review[]>(reviews);
  const [currentQueueNumber, setCurrentQueueNumber] = useState(6);

  const addOrder = (order: Order) => {
    const newOrder = { ...order, queueNumber: currentQueueNumber };
    setOrders([...orders, newOrder]);
    setCurrentQueueNumber(currentQueueNumber + 1);
  };

  const renumberActiveQueues = (ordersToUpdate: Order[]): Order[] => {
    const activeQueues = ordersToUpdate
      .filter(o => ['pending', 'cooking', 'ready'].includes(o.status))
      .sort((a, b) => a.queueNumber - b.queueNumber);
    
    const otherOrders = ordersToUpdate.filter(o => !['pending', 'cooking', 'ready'].includes(o.status));

    const renumberedActive = activeQueues.map((order, index) => ({
      ...order,
      queueNumber: index + 1,
    }));
    
    // Update the next queue number for new orders
    setCurrentQueueNumber(renumberedActive.length + 1);

    return [...renumberedActive, ...otherOrders];
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prevOrders => {
      const updatedWithStatus = prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      // After status update, renumber all active queues to ensure they are contiguous
      return renumberActiveQueues(updatedWithStatus);
    });
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

  const skipQueueForOrder = (orderId: string, queuesToSkip: number): boolean => {
    let success = false;
    setOrders(prevOrders => {
      const cost = queuesToSkip * 50;
      const orderToSkip = prevOrders.find(o => o.id === orderId);

      // Validations
      if (!orderToSkip || queuesToSkip <= 0 || !user || user.coins < cost || !['pending', 'cooking'].includes(orderToSkip.status)) {
        return prevOrders;
      }
      
      const activeQueues = prevOrders
        .filter(o => ['pending', 'cooking'].includes(o.status))
        .sort((a, b) => a.queueNumber - b.queueNumber);
      
      const otherOrders = prevOrders.filter(o => !['pending', 'cooking'].includes(o.status));

      const currentIndex = activeQueues.findIndex(o => o.id === orderId);

      if (currentIndex === -1 || currentIndex < queuesToSkip) {
        return prevOrders;
      }

      // Spend coins
      if (!spendCoins(cost)) {
          return prevOrders;
      }
      
      // Reorder the array
      const [movedOrder] = activeQueues.splice(currentIndex, 1);
      const newIndex = currentIndex - queuesToSkip;
      activeQueues.splice(newIndex, 0, movedOrder);

      // Re-number the newly ordered active queue to make it contiguous
      const renumberedActive = activeQueues.map((order, index) => ({
        ...order,
        queueNumber: index + 1, // Start queue from 1
      }));
      
      setCurrentQueueNumber(renumberedActive.length + 1);

      success = true;
      return [...otherOrders, ...renumberedActive];
    });
    return success;
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
      skipQueueForOrder,
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