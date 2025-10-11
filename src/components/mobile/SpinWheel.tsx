import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { CircleDollarSign, Plus, Trash2, Play } from 'lucide-react';
import { motion } from 'motion/react';

interface SpinWheelProps {
  onBack: () => void;
}

export function SpinWheel({ onBack }: SpinWheelProps) {
  const [names, setNames] = useState<string[]>(['อเล็กซ์', 'แซม']);
  const [newName, setNewName] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const addName = () => {
    if (newName.trim() && names.length < 8) {
      setNames([...names, newName.trim()]);
      setNewName('');
    }
  };

  const removeName = (index: number) => {
    setNames(names.filter((_, i) => i !== index));
  };

  const spin = () => {
    if (names.length < 2) return;
    
    setIsSpinning(true);
    setWinner(null);
    
    // Random spins between 5-8 full rotations plus random offset
    const spins = 5 + Math.floor(Math.random() * 3);
    const randomDegree = Math.random() * 360;
    const totalRotation = spins * 360 + randomDegree;
    
    setRotation(totalRotation);
    
    setTimeout(() => {
      const segmentAngle = 360 / names.length;
      const normalizedRotation = randomDegree % 360;
      const winnerIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % names.length;
      setWinner(names[winnerIndex]);
      setIsSpinning(false);
    }, 4000);
  };

  const colors = [
    'bg-red-400',
    'bg-blue-400',
    'bg-green-400',
    'bg-yellow-400',
    'bg-purple-400',
    'bg-pink-400',
    'bg-orange-400',
    'bg-cyan-400',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>← กลับ</Button>
          <div className="flex items-center gap-2">
            <CircleDollarSign className="w-5 h-5" />
            <span>ใครจ่าย?</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-4xl">🎡</div>
          <h2>สุ่มคนจ่าย</h2>
          <p className="text-muted-foreground">
            เพิ่มชื่อแล้วหมุนวงล้อเพื่อหาคนจ่าย!
          </p>
        </div>

        {/* Spin Wheel Visual */}
        <div className="relative">
          <Card className="p-8 bg-white flex items-center justify-center overflow-hidden">
            <div className="relative w-64 h-64">
              {/* Arrow Pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
                <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-red-500"></div>
              </div>

              {/* Wheel */}
              <motion.div
                className="w-full h-full rounded-full relative overflow-hidden border-4 border-gray-200 shadow-lg"
                animate={{ rotate: rotation }}
                transition={{ duration: 4, ease: 'easeOut' }}
              >
                {names.map((name, index) => {
                  const angle = (360 / names.length) * index;
                  return (
                    <div
                      key={index}
                      className={`absolute top-0 left-1/2 origin-bottom ${colors[index % colors.length]} w-1 h-32`}
                      style={{
                        transform: `rotate(${angle}deg)`,
                        transformOrigin: '0 128px',
                      }}
                    >
                      <div
                        className="absolute top-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm text-white"
                        style={{
                          transform: `rotate(${90}deg)`,
                        }}
                      >
                        {name}
                      </div>
                    </div>
                  );
                })}
                
                {/* Center Circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full border-4 border-gray-300 shadow-inner"></div>
              </motion.div>
            </div>
          </Card>

          {/* Winner Display */}
          {winner && !isSpinning && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-4"
            >
              <Card className="p-6 bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300 text-center">
                <div className="space-y-2">
                  <div className="text-4xl">🎉</div>
                  <h3>{winner} จ่าย!</h3>
                  <p className="text-sm text-muted-foreground">
                    ไว้โอกาสหน้านะ! 😄
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Names List */}
        <Card className="p-4 bg-white space-y-4">
          <h3>ผู้เข้าร่วม ({names.length})</h3>
          
          <div className="flex gap-2">
            <Input
              placeholder="ใส่ชื่อ..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addName()}
            />
            <Button onClick={addName} disabled={!newName.trim() || names.length >= 8}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {names.map((name, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="pr-1 text-sm"
              >
                {name}
                <button
                  onClick={() => removeName(index)}
                  className="ml-1 hover:bg-destructive/20 rounded p-0.5"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>

          {names.length < 2 && (
            <p className="text-sm text-muted-foreground">
              เพิ่มอย่างน้อย 2 คนเพื่อหมุน!
            </p>
          )}
        </Card>

        {/* Spin Button */}
        <Button
          onClick={spin}
          disabled={isSpinning || names.length < 2}
          className="w-full py-6 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600"
        >
          <Play className={`w-5 h-5 mr-2 ${isSpinning ? 'animate-spin' : ''}`} />
          {isSpinning ? 'กำลังหมุน...' : 'หมุนวงล้อ!'}
        </Button>
      </div>
    </div>
  );
}