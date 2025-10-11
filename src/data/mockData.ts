import { MenuItem, Order, User, CommunityPost, Review, SalesData, Ingredient } from '../types';

export const menuItems: MenuItem[] = [
  {
    id: 'pad-thai',
    name: 'ผัดไทย',
    price: 120,
    image: 'https://images.unsplash.com/photo-1729708475167-71a6eb3cd741?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwZm9vZCUyMHBhZCUyMHRoYWl8ZW58MXx8fHwxNzU5ODI2NjM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'ก๋วยเตี๋ยวผัดกับกุ้ง เต้าหู้ และถั่ว',
    category: 'main',
    spicyLevel: 1,
    isAvailable: true,
  },
  {
    id: 'fried-rice',
    name: 'ข้าวผัด',
    price: 90,
    image: 'https://images.unsplash.com/photo-1646340916384-9845d7686e2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMHJpY2UlMjBhc2lhbnxlbnwxfHx8fDE3NTk3MTE4ODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'ข้าวผัดสไตล์ไทยใส่ไข่และผัก',
    category: 'main',
    spicyLevel: 0,
    isAvailable: true,
  },
  {
    id: 'tom-yum',
    name: 'ต้มยำกุ้ง',
    price: 110,
    image: 'https://images.unsplash.com/photo-1628430043175-0e8820df47c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b20lMjB5dW0lMjBzb3VwfGVufDF8fHx8MTc1OTgyMDI3MHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'ซุปไทยรสเปรี้ยวเผ็ดใส่กุ้ง',
    category: 'main',
    spicyLevel: 3,
    isAvailable: true,
  },
  {
    id: 'green-curry',
    name: 'แกงเขียวหวาน',
    price: 130,
    image: 'https://images.unsplash.com/photo-1668665772043-bdd32e348998?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGN1cnJ5JTIwdGhhaXxlbnwxfHx8fDE3NTk4MjAyNzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'แกงกะทิไก่ใส่โหระพา',
    category: 'main',
    spicyLevel: 2,
    isAvailable: true,
  },
  {
    id: 'spring-rolls',
    name: 'ปอเปี๊ยะสด',
    price: 60,
    image: 'https://images.unsplash.com/photo-1679310290259-78d9eaa32700?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJpbmclMjByb2xscyUyMGFzaWFufGVufDF8fHx8MTc1OTgzODQ5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'ผักสดห่อด้วยแป้งปอเปี๊ยะ',
    category: 'appetizer',
    spicyLevel: 0,
    isAvailable: true,
  },
  {
    id: 'mango-sticky-rice',
    name: 'ข้าวเหนียวมะม่วง',
    price: 80,
    image: 'https://images.unsplash.com/photo-1711161988375-da7eff032e45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMHN0aWNreSUyMHJpY2V8ZW58MXx8fHwxNzU5ODI0NTUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'ข้าวเหนียวหวานกับมะม่วงสดและกะทิ',
    category: 'dessert',
    spicyLevel: 0,
    isAvailable: true,
  },
  {
    id: 'thai-tea',
    name: 'ชาไทยเย็น',
    price: 45,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500',
    description: 'ชาไทยหวานมันเสิร์ฟพร้อมน้ำแข็ง',
    category: 'drink',
    spicyLevel: 0,
    isAvailable: true,
  },
  {
    id: 'papaya-salad',
    name: 'ส้มตำ',
    price: 70,
    image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=500',
    description: 'ส้มตำมะละกอดิบรสเผ็ดใส่ถั่ว',
    category: 'appetizer',
    spicyLevel: 3,
    isAvailable: true,
  },
];

export const ingredients: Ingredient[] = [
  // Meats
  { id: 'pork-neck', name: 'สันคอหมูอบโอ่ง', icon: '/assets/A1.png', category: 'meat' },
  { id: 'crispy-pork', name: 'หมูกรอบอบโอ่ง', icon: '/assets/หมูกรอบ.png', category: 'meat' },
  { id: 'chicken', name: 'ไก่', icon: '/assets/ไก่.png', category: 'meat' },
  { id: 'dolly-fish', name: 'ปลาดอลลี่', icon: '/assets/ปลาดอลลี่.png', category: 'meat' },
  { id: 'silkworm-pupae', name: 'ดักแด้', icon: '/assets/ดักแด้.png', category: 'meat' },
  
  // Special
  { id: 'sil', name: 'พิเศษ', icon: '', category: 'special' },
  { id: 'upae', name: 'พิเศษตะโกน', icon: '', category: 'special' },
  
  // Vegetables
  { id: 'oyster-sauce', name: 'ซอสหอย', icon: '/assets/ซอสหอย.png', category: 'sauce' },
  { id: 'fish-sauce', name: 'น้ำปลา', icon: '/assets/น้ำปลา.png', category: 'sauce' },
  { id: 'green-cap-sauce', name: 'ซอสฝาเขียว', icon: '/assets/ซองฝาเขียว.png', category: 'sauce' },
  { id: 'light-soy-sauce', name: 'ซีอิ้วขาว', icon: '/assets/ซีอิ้วขาว.png', category: 'sauce' },

  { id: 'sugar', name: 'น้ำตาล', icon: '/assets/น้ำตาล.png', category: 'spice' },
  { id: 'salt', name: 'เกลือ', icon: '/assets/เกลือ.png', category: 'spice' },
  { id: 'msg', name: 'ผงชูรส', icon: '/assets/ผงชูรส.png', category: 'spice' },
  { id: 'chili', name: 'พริก', icon: '/assets/พริก.png', category: 'spice' },
  { id: 'garlic', name: 'กระเทียม', icon: '/assets/กะเทียม.png', category: 'spice' },
  { id: 'holy-basil', name: 'ใบกะเพรา', icon: '/assets/กะเพรา.png', category: 'spice' },
  { id: 'mala', name: 'หมาล่า', icon: '/assets/หมาล่า.png', category: 'spice' },
  { id: 'curry-paste', name: 'พริกแกง', icon: '/assets/พริกแกง.png', category: 'spice' },

  // Toppings
  { id: 'fried-egg', name: 'ไข่ดาว', icon: 'assets/ไข่ดาว.png', category: 'topping' },
  { id: 'creamy-omelette', name: 'ไข่ข้น', icon: 'assets/ไข่ข้น.png', category: 'topping' },
  { id: 'omelette', name: 'ไข่เจียว', icon: 'assets/ไข่เจียว.png', category: 'topping' },
  { id: 'mushroom', name: 'เห็ด', icon: '/assets/เห็ด.png', category: 'topping' },
];

export const mockUser: User = {
  id: 'user-1',
  name: 'สมชาย',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai',
  coins: 150,
  memberSince: new Date('2024-01-15'),
  favoriteItems: ['pad-thai', 'tom-yum'],
  totalOrders: 23,
};

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    queueNumber: 42,
    items: [
      { menuItem: menuItems[0], quantity: 2, customizations: 'เผ็ดมาก' },
      { menuItem: menuItems[4], quantity: 1 },
    ],
    totalPrice: 300,
    status: 'cooking',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    tableNumber: 5,
    orderType: 'game',
  },
  {
    id: 'order-2',
    queueNumber: 43,
    items: [
      { menuItem: menuItems[2], quantity: 1 },
      { menuItem: menuItems[6], quantity: 2 },
    ],
    totalPrice: 200,
    status: 'pending',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    tableNumber: 8,
    orderType: 'lazy',
  },
  {
    id: 'order-3',
    queueNumber: 44,
    items: [
      { menuItem: menuItems[3], quantity: 1 },
      { menuItem: menuItems[5], quantity: 1 },
    ],
    totalPrice: 210,
    status: 'ready',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    tableNumber: 3,
    userId: 'user-1',
    orderType: 'lazy',
  },
];

export const communityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    userId: 'user-2',
    userName: 'นริศา',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Narisa',
    image: menuItems[0].image,
    caption: 'ผัดไทยอร่อยที่สุดในเมือง! 🍜✨ รสชาติกลมกล่อมลงตัว!',
    likes: 24,
    comments: [
      {
        id: 'comment-1',
        userId: 'user-3',
        userName: 'ประยุทธ์',
        text: 'ดูน่าอร่อยมาก! ต้องลอง!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ],
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    menuType: 'main',
  },
  {
    id: 'post-2',
    userId: 'user-3',
    userName: 'ประยุทธ์',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prayut',
    image: menuItems[2].image,
    caption: 'ท้าทายต้มยำสำเร็จ! 🔥🌶️ ปากแทบไหม้แต่คุ้มมาก!',
    likes: 31,
    comments: [],
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    menuType: 'main',
  },
  {
    id: 'post-3',
    userId: 'user-4',
    userName: 'ศิริพร',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siriporn',
    image: menuItems[5].image,
    caption: 'ปิดท้ายมื้ออาหารที่สมบูรณ์แบบ 🥭 ข้าวเหนียวมะม่วงคือที่สุด!',
    likes: 18,
    comments: [
      {
        id: 'comment-2',
        userId: 'user-1',
        userName: 'สมชาย',
        text: 'ดูน่าอร่อยจัง!',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
    ],
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    menuType: 'dessert',
  },
];

export const reviews: Review[] = [
  {
    id: 'review-1',
    orderId: 'order-1',
    userId: 'user-2',
    userName: 'นริศา',
    rating: 5,
    comment: 'อร่อยมาก! เกมทำอาหารทำให้การสั่งอาหารสนุกขึ้นเยอะ!',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    menuItems: ['ผัดไทย', 'ปอเปี๊ยะสด'],
  },
  {
    id: 'review-2',
    orderId: 'order-2',
    userId: 'user-3',
    userName: 'ประยุทธ์',
    rating: 4,
    comment: 'อาหารอร่อย แต่ช่วงเวลาเร่งด่วนรอนานไปหน่อย',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    menuItems: ['ต้มยำกุ้ง', 'ชาไทยเย็น'],
  },
  {
    id: 'review-3',
    orderId: 'order-3',
    userId: 'user-4',
    userName: 'ศิริพร',
    rating: 5,
    comment: 'ชอบระบบเหรียญ หิว หิว หิว มาก! ข้ามคิวแล้วได้อาหารเร็ว!',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    menuItems: ['แกงเขียวหวาน'],
  },
];

export const salesData: SalesData[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  revenue: Math.floor(Math.random() * 15000) + 8000,
  orders: Math.floor(Math.random() * 50) + 30,
}));