import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Star, Clock, Users, Coins, MessageSquare, Send, Zap } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Order } from '../../types';

interface OrderQueueProps {
  order: Order;
  onComplete: () => void;
}

export function OrderQueue({ order, onComplete }: OrderQueueProps) {
  const { user, orders, skipQueueForOrder } = useAppContext();
  const [status, setStatus] = useState(order.status);
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(15);
  const [skipAmount, setSkipAmount] = useState(1);

  // This ensures we are always looking at the latest order data from the context
  const liveOrder = orders.find(o => o.id === order.id) || order;

  useEffect(() => {
    // Simulate order status changes
    const timer = setTimeout(() => {
      if (status === 'pending') {
        setStatus('cooking');
        setEstimatedTime(10);
      } else if (status === 'cooking') {
        setStatus('ready');
        setShowReviewDialog(true);
      }
    }, 10000); // Change status every 10 seconds for demo

    return () => clearTimeout(timer);
  }, [status]);

  const pendingQueues = orders.filter(
    o => (o.status === 'pending' || o.status === 'cooking') && o.queueNumber < liveOrder.queueNumber
  ).length;

  const handleSkipQueue = () => {
    if (skipQueueForOrder(liveOrder.id, skipAmount)) {
      // The queue number will update automatically from the context re-render.
      // We can also optimistically update local state or just rely on the re-render.
      // Let's also update the status to cooking as a sign of progress
      setStatus('cooking');
      setEstimatedTime(Math.max(2, estimatedTime - skipAmount * 2)); // Simulate time reduction
      setShowSkipDialog(false);
    } else {
      alert(
        `ไม่สามารถข้ามคิวได้ อาจจะมีเหรียญไม่พอ หรือมีคิวข้างหน้าน้อยกว่าที่เลือก`
      );
    }
  };

  const handleSubmitReview = () => {
    // In real app, would save review
    setShowReviewDialog(false);
    setTimeout(onComplete, 1000);
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'cooking': return 'bg-orange-500';
      case 'ready': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending': return 'กำลังรอคิว';
      case 'cooking': return 'กำลังทำ! 🍳';
      case 'ready': return 'พร้อมเสิร์ฟ! 😋';
      default: return 'กำลังดำเนินการ';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 p-6 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getStatusColor()} text-white mb-4 animate-pulse`}>
            <div className="text-center">
              <div className="text-4xl">#{liveOrder.queueNumber}</div>
              <div className="text-sm">คิว</div>
            </div>
          </div>
          <h2>{getStatusText()}</h2>
          <p className="text-muted-foreground">
            เวลาที่คาดว่าจะได้รับ: ~{estimatedTime} นาที
          </p>
        </div>

        <Card className="p-6 bg-white space-y-4">
          <div className="flex items-center justify-between pb-4 border-b">
            <span className="text-muted-foreground">ออเดอร์ #{order.id.slice(-4)}</span>
            <Badge variant="secondary">
              {order.orderType === 'game' ? '🎮 เกม' : '😴 คนขี้เกียจ'}
            </Badge>
          </div>

          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.menuItem.name}</span>
                <span>฿{item.menuItem.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t flex justify-between">
            <span>รวม</span>
            <span>฿{order.totalPrice}</span>
          </div>
        </Card>

        {user && status === 'pending' && (
          <Card className="p-6 bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300">
            <div className="flex items-start gap-3">
              <Coins className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="flex-1 space-y-2">
                <h3>ข้ามคิว!</h3>
                <p className="text-sm text-muted-foreground">
                  ใช้ 50 เหรียญ หิว หิว หิว เพื่อเลื่อนออเดอร์ของคุณไปหน้าสุด
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm">ยอดคงเหลือของคุณ: {user.coins} เหรียญ</span>
                  <Button
                    onClick={() => setShowSkipDialog(true)}
                    disabled={user.coins < 50}
                    size="sm"
                    className="bg-yellow-500 hover:bg-yellow-600"
                  >
                    ข้ามคิว
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-3 text-center text-sm">
          <Card className="p-4">
            <Users className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-muted-foreground">คิวก่อนหน้า</p>
            <p>{pendingQueues}</p>
          </Card>
          <Card className="p-4">
            <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-muted-foreground">เวลารอ</p>
            <p>~{estimatedTime}m</p>
          </Card>
        </div>

        {status === 'ready' && (
          <Button onClick={() => setShowReviewDialog(true)} className="w-full" size="lg">
            <MessageSquare className="w-5 h-5 mr-2" />
            เขียนรีวิว
          </Button>
        )}
      </div>

      {/* Skip Queue Dialog */}
      <Dialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              ข้ามคิว
            </DialogTitle>
            <DialogDescription>
              ใช้เหรียญ หิว หิว หิว ของคุณเพื่อข้ามคิว!
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">เหรียญของคุณ:</span>
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-yellow-600" />
                  <span>{user?.coins || 0}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">คิวก่อนหน้า:</span>
                <span>{pendingQueues}</span>
              </div>
            </div>

            {pendingQueues > 0 && (
              <div>
                <label className="text-sm mb-2 block">ข้ามกี่คิว?</label>
                <input
                  type="range"
                  min="1"
                  max={Math.min(pendingQueues, Math.floor((user?.coins || 0) / 50))}
                  value={skipAmount}
                  onChange={(e) => setSkipAmount(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm">ข้าม: {skipAmount} คิว</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">ราคา:</span>
                    <Coins className="w-4 h-4 text-yellow-600" />
                    <span>{skipAmount * 50}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSkipDialog(false)}>
              ยกเลิก
            </Button>
            <Button
              onClick={handleSkipQueue}
              disabled={pendingQueues === 0}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              <Zap className="w-4 h-4 mr-2" />
              ยืนยันการข้าม
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🍲 ออเดอร์ของคุณพร้อมแล้ว!</DialogTitle>
            <DialogDescription>
              ประสบการณ์ของคุณเป็นอย่างไร? แบ่งปันความคิดเห็นของคุณกับเรา!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm">ให้คะแนนมื้ออาหารของคุณ</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              placeholder="แบ่งปันสูตรของคุณหรือเขียนรีวิว... (ไม่บังคับ)"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
              ข้าม
            </Button>
            <Button onClick={handleSubmitReview}>
              <Send className="w-4 h-4 mr-2" />
              ส่ง
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}