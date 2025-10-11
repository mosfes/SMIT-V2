import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ShoppingCart, Plus, Minus, Flame } from 'lucide-react';
import { MenuItem, OrderItem } from '../../types';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ManualOrderProps {
  menuItems: MenuItem[];
  onOrderComplete: (items: OrderItem[]) => void;
  onBack: () => void;
}

export function ManualOrder({ menuItems, onOrderComplete, onBack }: ManualOrderProps) {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.menuItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.menuItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { menuItem: item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.menuItem.id === itemId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>← กลับ</Button>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <span>{totalItems} รายการ</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 pb-32">
        <div className="mb-6">
          <h2>😴 โหมดคนขี้เกียจ</h2>
          <p className="text-muted-foreground">เลือกชมและสั่งอาหารจากเมนูของเรา</p>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">ทั้งหมด</TabsTrigger>
            <TabsTrigger value="main" className="flex-1">อาหารจานหลัก</TabsTrigger>
            <TabsTrigger value="appetizer" className="flex-1">อาหารเรียกน้ำย่อย</TabsTrigger>
            <TabsTrigger value="dessert" className="flex-1">ของหวาน</TabsTrigger>
            <TabsTrigger value="drink" className="flex-1">เครื่องดื่ม</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredItems.map(item => {
            const cartItem = cart.find(c => c.menuItem.id === item.id);
            return (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {item.spicyLevel > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-sm">
                      <Flame className="w-3 h-3" />
                      {item.spicyLevel}
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3>{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>฿{item.price}</span>
                    {cartItem ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center">{cartItem.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" onClick={() => addToCart(item)}>
                        <Plus className="w-4 h-4 mr-1" />
                        เพิ่ม
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{totalItems} รายการ</p>
                <p>รวม: ฿{totalPrice}</p>
              </div>
              <Button
                onClick={() => onOrderComplete(cart)}
                className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600"
              >
                สั่งอาหาร
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}