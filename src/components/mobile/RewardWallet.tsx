import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Coins, TrendingUp, Gift, Zap, Star, Trophy } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface RewardWalletProps {
  onBack: () => void;
}

export function RewardWallet({ onBack }: RewardWalletProps) {
  const { user } = useAppContext();

  const transactions = [
    { id: '1', type: 'earn', amount: 10, description: 'เล่นเกมทำอาหาร', date: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: '2', type: 'earn', amount: 20, description: 'เช็คอินรายวัน', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { id: '3', type: 'spend', amount: -50, description: 'ข้ามคิว', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: '4', type: 'earn', amount: 15, description: 'เขียนรีวิว', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { id: '5', type: 'earn', amount: 30, description: 'โบนัสสมาชิก', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
  ];

  const rewards = [
    { id: '1', name: 'ของหวานฟรี', cost: 100, icon: '🍰', available: user && user.coins >= 100 },
    { id: '2', name: 'ข้ามคิว', cost: 50, icon: '⚡', available: user && user.coins >= 50 },
    { id: '3', name: 'ส่วนลด 10%', cost: 80, icon: '💰', available: user && user.coins >= 80 },
    { id: '4', name: 'เครื่องดื่มฟรี', cost: 60, icon: '🥤', available: user && user.coins >= 60 },
    { id: '5', name: 'ที่นั่งพิเศษ', cost: 120, icon: '🪑', available: user && user.coins >= 120 },
    { id: '6', name: 'เมนูพิเศษจากเชฟ', cost: 200, icon: '👨‍🍳', available: user && user.coins >= 200 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>← กลับ</Button>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            <span>กระเป๋าเงิน หิว หิว หิว</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Balance Card */}
        <Card className="p-6 bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0">
          <div className="text-center space-y-3">
            <div className="text-5xl">💰</div>
            <div>
              <p className="text-white/80 text-sm">ยอดคงเหลือของคุณ</p>
              <h1 className="text-white text-4xl">{user?.coins || 0}</h1>
              <p className="text-white/80 text-sm">เหรียญ หิว หิว หิว</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm bg-white/20 px-4 py-2 rounded-full w-fit mx-auto">
              <TrendingUp className="w-4 h-4" />
              <span>+75 เดือนนี้</span>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">⭐</div>
            <p className="text-sm text-muted-foreground">ระดับ</p>
            <p>ทอง</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">🎯</div>
            <p className="text-sm text-muted-foreground">ได้รับ</p>
            <p>450</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">🏆</div>
            <p className="text-sm text-muted-foreground">อันดับ</p>
            <p>#124</p>
          </Card>
        </div>

        {/* Earn More Section */}
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3>รับเหรียญเพิ่ม</h3>
            <Gift className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
                  🎮
                </div>
                <div>
                  <p className="text-sm">เล่นเกมทำอาหาร</p>
                  <p className="text-xs text-muted-foreground">+10 เหรียญต่อเกม</p>
                </div>
              </div>
              <Badge variant="secondary">+10</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  ⭐
                </div>
                <div>
                  <p className="text-sm">เขียนรีวิว</p>
                  <p className="text-xs text-muted-foreground">+15 เหรียญต่อรีวิว</p>
                </div>
              </div>
              <Badge variant="secondary">+15</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                  📅
                </div>
                <div>
                  <p className="text-sm">เช็คอินรายวัน</p>
                  <p className="text-xs text-muted-foreground">+20 เหรียญทุกวัน</p>
                </div>
              </div>
              <Badge variant="secondary">+20</Badge>
            </div>
          </div>
        </Card>

        {/* Redeem Rewards */}
        <Card className="p-4 bg-white">
          <h3 className="mb-4">แลกรางวัล</h3>
          <div className="grid grid-cols-2 gap-3">
            {rewards.map(reward => (
              <Card
                key={reward.id}
                className={`p-4 text-center ${
                  reward.available
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200 cursor-pointer hover:scale-105 transition-transform'
                    : 'bg-gray-50 opacity-50'
                }`}
              >
                <div className="text-3xl mb-2">{reward.icon}</div>
                <p className="text-sm mb-1">{reward.name}</p>
                <div className="flex items-center justify-center gap-1 text-sm">
                  <Coins className="w-3 h-3" />
                  <span>{reward.cost}</span>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Transaction History */}
        <Card className="p-4 bg-white">
          <h3 className="mb-4">กิจกรรมล่าสุด</h3>
          <div className="space-y-3">
            {transactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between pb-3 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === 'earn' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'earn' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <Zap className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.date.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className={`${transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}