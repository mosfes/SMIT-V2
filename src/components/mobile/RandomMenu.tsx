import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dices, Flame, Heart } from 'lucide-react';
import { MenuItem } from '../../types';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface RandomMenuProps {
  menuItems: MenuItem[];
  onBack: () => void;
}

export function RandomMenu({ menuItems, onBack }: RandomMenuProps) {
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [filters, setFilters] = useState({
    maxPrice: 200,
    maxSpicy: 3,
    category: 'all' as string,
  });

  const rollDice = () => {
    setIsRolling(true);
    
    // Filter items based on preferences
    let filtered = menuItems;
    if (filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category);
    }
    filtered = filtered.filter(item => 
      item.price <= filters.maxPrice && item.spicyLevel <= filters.maxSpicy
    );

    // Simulate rolling animation
    let count = 0;
    const interval = setInterval(() => {
      const randomItem = filtered[Math.floor(Math.random() * filtered.length)];
      setCurrentItem(randomItem);
      count++;
      
      if (count > 10) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>← กลับ</Button>
          <div className="flex items-center gap-2">
            <Dices className="w-5 h-5" />
            <span>สุ่มเมนู</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-4xl">🎲</div>
          <h2>ตัดสินใจไม่ได้?</h2>
          <p className="text-muted-foreground">
            ให้เราเลือกอาหารให้คุณจากเมนูยอดนิยม!
          </p>
        </div>

        {/* Filters */}
        <Card className="p-4 bg-white space-y-4">
          <h3>ความชอบของคุณ</h3>
          
          <div>
            <label className="text-sm text-muted-foreground">ราคาสูงสุด: ฿{filters.maxPrice}</label>
            <input
              type="range"
              min="50"
              max="200"
              step="10"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">
              ระดับความเผ็ด: {filters.maxSpicy === 0 ? 'ไม่เผ็ด' : '🌶️'.repeat(filters.maxSpicy)}
            </label>
            <input
              type="range"
              min="0"
              max="3"
              step="1"
              value={filters.maxSpicy}
              onChange={(e) => setFilters({ ...filters, maxSpicy: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-2">หมวดหมู่</label>
            <div className="flex flex-wrap gap-2">
              {['all', 'main', 'appetizer', 'dessert', 'drink'].map(cat => (
                <Badge
                  key={cat}
                  variant={filters.category === cat ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setFilters({ ...filters, category: cat })}
                >
                  {cat === 'all' ? 'ทั้งหมด' : cat === 'main' ? 'อาหารจานหลัก' : cat === 'appetizer' ? 'ของทานเล่น' : cat === 'dessert' ? 'ของหวาน' : 'เครื่องดื่ม'}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Result Card */}
        {currentItem && (
          <Card className={`overflow-hidden ${isRolling ? 'animate-pulse' : ''}`}>
            <div className="aspect-video relative">
              <ImageWithFallback
                src={currentItem.image}
                alt={currentItem.name}
                className="w-full h-full object-cover"
              />
              {currentItem.spicyLevel > 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-sm">
                  <Flame className="w-3 h-3" />
                  {currentItem.spicyLevel}
                </div>
              )}
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h2>{currentItem.name}</h2>
                <p className="text-muted-foreground">{currentItem.description}</p>
              </div>
              <div className="flex items-center justify-between">
                <span>฿{currentItem.price}</span>
                <Badge>{currentItem.category}</Badge>
              </div>
              {!isRolling && (
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <p className="text-sm text-green-700">
                    ✨ เป็นที่นิยมในหมู่นักชิมวันนี้!
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Roll Button */}
        <Button
          onClick={rollDice}
          disabled={isRolling}
          className="w-full py-6 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600"
        >
          <Dices className={`w-5 h-5 mr-2 ${isRolling ? 'animate-spin' : ''}`} />
          {isRolling ? 'กำลังสุ่ม...' : currentItem ? 'สุ่มอีกครั้ง' : 'ทอยลูกเต๋า!'}
        </Button>

        {currentItem && !isRolling && (
          <div className="text-center text-sm text-muted-foreground">
            <p>ไม่พอใจ? ใช้ 5 เหรียญเพื่อสุ่มใหม่!</p>
          </div>
        )}
      </div>
    </div>
  );
}