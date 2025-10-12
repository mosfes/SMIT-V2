import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Dices, CircleDollarSign, Bot, Users, Wallet, User as UserIcon, Clock, MapPin } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface MobileHomeProps {
  onNavigate: (screen: string) => void;
}

export function MobileHome({ onNavigate }: MobileHomeProps) {
  const { user } = useAppContext();

  const features = [
    {
      id: 'random-menu',
      icon: Dices,
      title: 'สุ่มเมนู',
      description: 'ให้เราเลือกอาหารให้คุณ',
      gradient: 'from-red-600 to-orange-500',
    },
    {
      id: 'spin-wheel',
      icon: CircleDollarSign,
      title: 'ใครจ่าย?',
      description: 'หมุนวงล้อตัดสิน',
      gradient: 'from-yellow-500 to-amber-500',
    },
    {
      id: 'ai-chat',
      icon: Bot,
      title: 'เพื่อน AI',
      description: 'คุยกับเพื่อนกินข้าวของคุณ',
      gradient: 'from-amber-600 to-orange-600',
    },
    {
      id: 'community',
      icon: Users,
      title: 'ชุมชน',
      description: 'แบ่งปันช่วงเวลาแห่งอาหาร',
      gradient: 'from-green-600 to-emerald-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white p-6 pb-20">
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white">🍜 หิว หิว หิว</h1>
              <p className="text-white/90 text-sm">การผจญภัยอาหารไทยของคุณ</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => onNavigate('profile')}
            >
              <UserIcon className="w-6 h-6" />
            </Button>
          </div>

          {user && (
            <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div>
                    <p className="text-white">{user.name}</p>
                    <p className="text-white/80 text-sm">สมาชิกตั้งแต่ปี 2024</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={() => onNavigate('wallet')}
                >
                  <Wallet className="w-4 h-4 mr-1" />
                  {user.coins}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Restaurant Info Card */}
      <div className="max-w-md mx-auto -mt-12 px-6 space-y-6">
        <Card className="p-6 bg-white shadow-lg">
          <div className="space-y-4">
            <div>
              <h2>ข้อมูลร้านอาหาร</h2>
              <p className="text-muted-foreground text-sm">คาเฟ่เห็ด</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">เวลาทำการ</p>
                  <p>16:00 - 02:00</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">ที่ตั้ง</p>
                  <p>ขอนแก่น, หลัง มข.</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm">🎉 พิเศษ: สั่งผ่านเกมทำอาหารและรับเหรียญพิเศษ!</p>
            </div>
          </div>
        </Card>

        {/* Features Grid */}
        <div>
          <h3 className="mb-4">ฟีเจอร์สนุกๆ</h3>
          <div className="grid grid-cols-2 gap-4">
            {features.map(feature => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.id}
                  className={`p-6 cursor-pointer hover:scale-105 transition-transform bg-gradient-to-br ${feature.gradient} text-white border-0`}
                  onClick={() => onNavigate(feature.id)}
                >
                  <div className="space-y-3">
                    <div className="p-3 bg-white/20 rounded-lg w-fit">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-white">{feature.title}</h4>
                      <p className="text-white/90 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        {user && (
          <Card className="p-6 bg-white">
            <h3 className="mb-4">สถิติของคุณ</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl">💰</p>
                <p className="text-muted-foreground text-sm">เหรียญ</p>
                <p>{user.coins}</p>
              </div>
              <div>
                <p className="text-2xl">🍽️</p>
                <p className="text-muted-foreground text-sm">ออเดอร์</p>
                <p>{user.totalOrders}</p>
              </div>
              <div>
                <p className="text-2xl">❤️</p>
                <p className="text-muted-foreground text-sm">รายการโปรด</p>
                <p>{user.favoriteItems.length}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}