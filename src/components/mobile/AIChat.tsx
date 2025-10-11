import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Avatar } from '../ui/avatar';
import { Bot, Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIChatProps {
  onBack: () => void;
}

export function AIChat({ onBack }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "สวัสดี! 👋 ฉันคือเพื่อนกินข้าวของคุณ ฉันสามารถแนะนำอาหาร พูดคุยเรื่องอาหาร หรือเป็นเพื่อนคุณระหว่างทานอาหารได้!",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const aiResponses = [
    "ฟังดูน่าอร่อย! คุณเคยลองผัดไทยของเราหรือยัง? เป็นเมนูโปรดของลูกค้าเลยนะ! 🍜",
    "ฉันอยากฟังเรื่องนั้นอีก! อาหารทำให้คนใกล้ชิดกันมากขึ้นใช่ไหม? 😊",
    "เป็นตัวเลือกที่ดี! คุณอยากได้รสเผ็ดหรือรสอ่อน?",
    "เกร็ดน่ารู้: อาหารไทยมีความสมดุลของ 5 รสชาติพื้นฐาน - หวาน, เค็ม, เปรี้ยว, ขม และเผ็ด!",
    "ถ้าคุณรู้สึกอยากผจญภัย ฉันขอแนะนำให้ลองต้มยำของเรา มันมีรสชาติที่จัดจ้านมาก! 🌶️",
    "นั่นทำให้ฉันนึกถึงคำพูดไทยยอดนิยม: 'กินข้าวแล้วยัง?' - เป็นวิธีที่เราถามว่า 'เป็นอย่างไรบ้าง?' 🍚",
    "การทานอาหารคนเดียวก็ดีเหมือนกันนะ! เป็นโอกาสที่จะได้ลิ้มรสอาหารและผ่อนคลายอย่างเต็มที่",
    "เมนูพิเศษของเชฟวันนี้สุดยอดมาก! อยากรู้ไหมว่ามีอะไรบ้าง?",
  ];

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const quickReplies = [
    "แนะนำอะไรหน่อย",
    "เล่าเรื่องอาหารไทยให้ฟังหน่อย",
    "อะไรเป็นที่นิยม?",
    "ฉันอยากลองอะไรใหม่ๆ",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 flex flex-col">
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 max-w-md mx-auto w-full space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.sender === 'ai'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600'
                : 'bg-gradient-to-r from-green-600 to-emerald-600'
            }`}>
              {message.sender === 'ai' ? (
                <Bot className="w-5 h-5 text-white" />
              ) : (
                <span className="text-white">👤</span>
              )}
            </div>
            <div className={`flex-1 ${message.sender === 'user' ? 'text-right' : ''}`}>
              <Card className={`inline-block p-3 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                  : 'bg-white'
              }`}>
                <p className={message.sender === 'user' ? 'text-white' : ''}>
                  {message.text}
                </p>
              </Card>
              <p className="text-xs text-muted-foreground mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <Card className="p-3 bg-white">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2 max-w-md mx-auto w-full">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickReplies.map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput(reply);
                  setTimeout(() => sendMessage(), 100);
                }}
                className="whitespace-nowrap"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                {reply}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="sticky bottom-0 bg-white border-t p-4">
        <div className="max-w-md mx-auto flex gap-2">
          <Input
            placeholder="พิมพ์ข้อความ..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage} disabled={!input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}