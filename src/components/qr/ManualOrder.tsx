import { useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { ShoppingCart, Plus, Minus, Flame } from 'lucide-react';
import { MenuItem, OrderItem, Ingredient } from '../../types';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ingredients } from '../../data/mockData';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { Separator } from '../ui/separator';

type Size = 'regular' | 'special' | 'extra-special';

interface ManualOrderProps {
  menuItems: MenuItem[];
  onOrderComplete: (items: OrderItem[]) => void;
  onBack: () => void;
}

export function ManualOrder({ menuItems, onOrderComplete, onBack }: ManualOrderProps) {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{
    meat: string | null;
    egg: string | null;
    size: Size;
    seasoning: string[];
  }>({ meat: null, egg: 'none', size: 'regular', seasoning: [] });

  const meats = ingredients.filter(i => i.category === 'meat');
  const eggs = ingredients.filter(i => i.category === 'topping' && i.name.includes('ไข่'));
  const seasonings = ingredients.filter(i => i.category === 'seasoning');

  const getSizePrice = (size: Size): number => {
    switch (size) {
      case 'special':
        return 10;
      case 'extra-special':
        return 20;
      default:
        return 0;
    }
  };

  const calculatedPrice = useMemo(() => {
    if (!selectedItem) return 0;
    let price = selectedItem.price;
    if (selectedItem.category === 'main') {
        if (selectedOptions.meat) price += 10;
        if (selectedOptions.egg && selectedOptions.egg !== 'none') price += 10;
        price += getSizePrice(selectedOptions.size);
    }
    // No price change for appetizer seasoning
    return price;
  }, [selectedItem, selectedOptions]);

  const handleAddToCart = () => {
    if (!selectedItem) return;

    if (selectedItem.category === 'main') {
        if (!selectedOptions.meat) return;

        const selectedMeat = meats.find(m => m.id === selectedOptions.meat);
        const selectedEgg = eggs.find(e => e.id === selectedOptions.egg);

        if (!selectedMeat) return;

        let customizedName = `${selectedItem.name} ${selectedMeat.name}`;
        if (selectedEgg) {
          customizedName += ` + ${selectedEgg.name}`;
        }

        const cartId = `${selectedItem.id}-${selectedMeat.id}-${selectedEgg?.id || 'none'}-${selectedOptions.size}`;

        const existingItem = cart.find(cartItem => cartItem.cartId === cartId);

        if (existingItem) {
          setCart(cart.map(cartItem =>
            cartItem.cartId === cartId
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          ));
        } else {
          const newItem: OrderItem = {
            cartId,
            menuItem: {
              ...selectedItem,
              id: cartId, // Make item id unique for cart
              name: customizedName,
              price: calculatedPrice,
            },
            quantity: 1,
            size: selectedOptions.size,
          };
          setCart([...cart, newItem]);
        }
    } else if (selectedItem.category === 'appetizer') {
        const selectedSeasonings = seasonings.filter(s => selectedOptions.seasoning.includes(s.id));
        let customizedName = selectedItem.name;
        if (selectedSeasonings.length > 0) {
            customizedName += ` (ผง${selectedSeasonings.map(s => s.name).join(', ')})`;
        }

        const cartId = `${selectedItem.id}-${selectedOptions.seasoning.sort().join('-')}`;
        const existingItem = cart.find(cartItem => cartItem.cartId === cartId);

        if(existingItem) {
            setCart(cart.map(cartItem =>
                cartItem.cartId === cartId
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            ));
        } else {
            const newItem: OrderItem = {
                cartId,
                menuItem: {
                    ...selectedItem,
                    id: cartId,
                    name: customizedName,
                    price: calculatedPrice,
                },
                quantity: 1,
            };
            setCart([...cart, newItem]);
        }
    }


    setSelectedItem(null);
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(currentCart => {
      const updatedCart = currentCart.map(item => {
        if (item.cartId === cartId) {
          return { ...item, quantity: item.quantity + delta };
        }
        return item;
      });
      return updatedCart.filter(item => item.quantity > 0);
    });
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const handleOpenDialog = (item: MenuItem) => {
    setSelectedItem(item);
    setSelectedOptions({ meat: null, egg: 'none', size: 'regular', seasoning: [] });
  };


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
          <div className="overflow-x-auto pb-2">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all" className="flex-1">ทั้งหมด</TabsTrigger>
              <TabsTrigger value="main" className="flex-1">ข้าว</TabsTrigger>
              <TabsTrigger value="appetizer" className="flex-1">ของทานเล่น</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map(item => {
            const itemsInCart = cart.filter(c => c.menuItem.id.startsWith(item.id));
            const totalQuantityInCart = itemsInCart.reduce((sum, i) => sum + i.quantity, 0);

            return (
              <Card key={item.id} className="overflow-hidden flex flex-col">
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
                <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                  <div className="break-words">
                    <h3>{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>

                  {itemsInCart.length > 0 ? (
                    <div className="space-y-2">
                      {itemsInCart.map(cartItem => (
                        <div key={cartItem.cartId} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{cartItem.menuItem.name}</p>
                            <p className="text-sm text-muted-foreground">฿{cartItem.menuItem.price}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => cartItem.cartId && updateQuantity(cartItem.cartId, -1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center">{cartItem.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => cartItem.cartId && updateQuantity(cartItem.cartId, 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button size="sm" variant="outline" className="w-full" onClick={() => handleOpenDialog(item)}>
                        <Plus className="w-4 h-4 mr-1" />
                        เพิ่มตัวเลือกอื่น
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>฿{item.price}</span>
                      <Button size="sm" onClick={() => handleOpenDialog(item)}>
                        <Plus className="w-4 h-4 mr-1" />
                        เพิ่ม
                      </Button>
                    </div>
                  )}
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

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ปรับแต่ง {selectedItem?.name}</DialogTitle>
            <DialogDescription>
              {selectedItem?.category === 'main'
                ? 'เลือกเนื้อสัตว์และท็อปปิ้งไข่ที่คุณต้องการ'
                : 'เลือกผงคลุกสำหรับของทานเล่นของคุณ (สูงสุด 3 อย่าง)'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">

            {selectedItem?.category === 'main' ? (
                <>
                    <div>
                      <h4 className="mb-2 font-medium">เลือกเนื้อสัตว์ <span className="text-destructive">*</span></h4>
                      <ToggleGroup
                        type="single"
                        className="grid grid-cols-2 gap-2"
                        onValueChange={(value) => value && setSelectedOptions(prev => ({ ...prev, meat: value }))}
                      >
                        {meats.map(meat => (
                          <ToggleGroupItem key={meat.id} value={meat.id} className="h-auto flex-col py-2 gap-1 cursor-pointer">
                            <ImageWithFallback src={meat.icon} alt={meat.name} className="w-16 h-12 object-contain" />
                            <span>{meat.name}</span>
                            <span className="text-xs text-muted-foreground">(+฿10)</span>
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </div>

                    <div>
                      <h4 className="mb-2 font-medium">เลือกไข่</h4>
                      <ToggleGroup
                        type="single"
                        defaultValue='none'
                        className="grid grid-cols-2 gap-2"
                        onValueChange={(value) => setSelectedOptions(prev => ({ ...prev, egg: value }))}
                      >
                        <ToggleGroupItem value="none" className="h-10 cursor-pointer">ไม่ใส่ไข่</ToggleGroupItem>
                        {eggs.map(egg => (
                          <ToggleGroupItem key={egg.id} value={egg.id} className="h-10 cursor-pointer">
                            {egg.name} (+฿10)
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </div>

                    <div>
                      <h4 className="mb-2 font-medium">เลือกขนาด</h4>
                      <ToggleGroup
                        type="single"
                        defaultValue="regular"
                        className="grid grid-cols-3 gap-2"
                        onValueChange={(value: Size) => value && setSelectedOptions(prev => ({ ...prev, size: value }))}
                      >
                        <ToggleGroupItem value="regular" className="cursor-pointer">ธรรมดา</ToggleGroupItem>
                        <ToggleGroupItem value="special" className="cursor-pointer">พิเศษ (+฿10)</ToggleGroupItem>
                        <ToggleGroupItem value="extra-special" className="cursor-pointer">พิเศษตะโกน (+฿20)</ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                </>
            ) : (
                <div>
                    <h4 className="mb-2 font-medium">เลือกผงคลุก</h4>
                    <ToggleGroup
                        type="multiple"
                        className="grid grid-cols-2 gap-2"
                        value={selectedOptions.seasoning}
                        onValueChange={(value) => {
                            if (value.length <= 3) {
                                setSelectedOptions(prev => ({ ...prev, seasoning: value }))
                            }
                        }}
                    >
                        {seasonings.map(seasoning => (
                            <ToggleGroupItem key={seasoning.id} value={seasoning.id} className="h-10 cursor-pointer" disabled={selectedOptions.seasoning.length >= 3 && !selectedOptions.seasoning.includes(seasoning.id)}>
                                {seasoning.icon} {seasoning.name}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>
            )}
            
          </div>
          <Separator />
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-semibold">ราคารวม:</span>
            <span className="text-xl font-bold">฿{calculatedPrice}</span>
          </div>
          <Button onClick={handleAddToCart} disabled={selectedItem?.category === 'main' && !selectedOptions.meat} size="lg" className="w-full mt-2">
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มลงในตะกร้า
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}