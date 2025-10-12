import { Button } from '../ui/button';
import { Bot } from 'lucide-react';

interface AIChatProps {
  onBack: () => void;
}

export function AIChat({ onBack }: AIChatProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>← กลับ</Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p>เพื่อน AI</p>
              <p className="text-xs text-muted-foreground">พร้อมคุยกับคุณเสมอ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md aspect-square bg-black rounded-lg overflow-hidden shadow-lg">
          <video 
            src="/assets/VDO1.mp4" // << ใส่ URL วิดีโอของคุณที่นี่
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          >
            วิดีโอไม่รองรับ
          </video>
        </div>
      </div>
    </div>
  );
}