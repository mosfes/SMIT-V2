import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  ChefHat,
  Flame,
  Clock,
  Sparkles,
  ArrowLeft,
  Coins,
  Zap,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { ingredients } from "../../data/mockData";
import { Ingredient } from "../../types";
import { useAppContext } from "../../context/AppContext";

const isUrl = (string: string) => {
  // Simple check to see if it's a URL or a path to an image file
  return string.startsWith('http') || string.startsWith('/') || string.includes('.');
};

interface CookingGameProps {
  onOrderComplete: (
    dishName: string,
    selectedIngredients: Ingredient[],
    spicyLevel: number
  ) => void;
  onBack: () => void;
}

export function CookingGame({ onOrderComplete, onBack }: CookingGameProps) {
  const { user, currentQueueNumber, skipQueue, addCoins } = useAppContext();
  const [gameStage, setGameStage] = useState<"select" | "cook" | "complete">(
    "select"
  );
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>(
    []
  );
  const [spicyLevel, setSpicyLevel] = useState(0);
  const [cookingProgress, setCookingProgress] = useState(0);
  const [dishName, setDishName] = useState("");
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const [skipAmount, setSkipAmount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const calculatePrice = (ingredients: Ingredient[]): number => {
      const hasMainComponent = ingredients.some(i => i.category === 'meat' || i.category === 'seafood');
      if (!hasMainComponent) {
        return 0;
      }

      let price = 50; // Base price

      const regularMeats = ingredients.filter(i => 
          (i.category === 'meat' || i.category === 'seafood') &&
          !['fried-egg', 'omelette', 'creamy-omelette', 'sil', 'upae'].includes(i.id)
      );

      const eggCount = ingredients.filter(i => ['fried-egg', 'omelette', 'creamy-omelette'].includes(i.id)).length;
      
      const specialOption = ingredients.find(i => i.id === 'sil' || i.id === 'upae');

      if (regularMeats.length > 0) {
        price += (regularMeats.length - 1) * 10;
      }
      
      price += eggCount * 10;

      if (specialOption) {
        price += specialOption.id === 'sil' ? 10 : 20;
      }
      
      if (regularMeats.length === 0) {
        if (eggCount > 0) {
          price -= 10;
        } else if (specialOption) {
          price -= specialOption.id === 'sil' ? 10 : 20;
        }
      }

      return price;
    }
    setTotalPrice(calculatePrice(selectedIngredients));
  }, [selectedIngredients]);


  const toggleIngredient = (ingredient: Ingredient) => {
    let updatedIngredients = [...selectedIngredients];
    const isCurrentlySelected = updatedIngredients.some(i => i.id === ingredient.id);

    if (isCurrentlySelected) {
      updatedIngredients = updatedIngredients.filter(i => i.id !== ingredient.id);
    } else {
      // Handle mutual exclusivity for "พิเศษ" and "พิเศษตะโกน"
      if (ingredient.id === 'sil') { // If selecting "พิเศษ"
        updatedIngredients = updatedIngredients.filter(i => i.id !== 'upae'); // Remove "พิเศษตะโกน"
      } else if (ingredient.id === 'upae') { // If selecting "พิเศษตะโกน"
        updatedIngredients = updatedIngredients.filter(i => i.id !== 'sil'); // Remove "พิเศษ"
      }
      updatedIngredients.push(ingredient);
    }

    setSelectedIngredients(updatedIngredients);
  };

  const startCooking = () => {
    setGameStage("cook");
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setCookingProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setGameStage("complete");
          generateDishName();
          // Award coins for playing
          addCoins(10);
        }, 500);
      }
    }, 300);
  };

  const generateDishName = () => {
    const meats = selectedIngredients.filter((i) => i.category === "meat");
    const seafoods = selectedIngredients.filter(
      (i) => i.category === "seafood"
    );
    const veggies = selectedIngredients.filter(
      (i) => i.category === "vegetable"
    );

    // const styles = ["ผัด", "เผ็ด", "หวาน", "กรอบ", "ไทย", "ย่าง", "นึ่ง"];
    const style = styles[Math.floor(Math.random() * styles.length)];

    let name = style;
    if (meats.length > 0) {
      name += ` ${meats[0].name}`;
    } else if (seafoods.length > 0) {
      name += ` ${seafoods[0].name}`;
    }
    if (veggies.length > 0) {
      name += ` กับ ${veggies[0].name}`;
    }

    if (spicyLevel > 0) {
      name = `${
        ["เผ็ดน้อย", "เผ็ดกลาง", "เผ็ดมาก", "เผ็ดสุดๆ"][spicyLevel - 1]
      } ${name}`;
    }

    setDishName(name || "อาหารลึกลับ");
  };

  const handleSkipQueue = () => {
    const cost = skipAmount * 100;
    if (skipQueue(skipAmount)) {
      setShowSkipDialog(false);
    } else {
      alert(
        `เหรียญไม่พอ! คุณต้องการ ${cost} เหรียญ แต่มีเพียง ${
          user?.coins || 0
        } เหรียญ`
      );
    }
  };

  const pendingQueues = currentQueueNumber - 1;

  if (gameStage === "select") {
    const meats = ingredients.filter((i) => i.category === "meat");
    const seafoods = ingredients.filter((i) => i.category === "seafood");
    const vegetables = ingredients.filter((i) => i.category === "vegetable");
    const sauces = ingredients.filter((i) => i.category === "sauce");
    const spices = ingredients.filter((i) => i.category === "spice");

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-50 pb-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-amber-500 px-4 py-3 shadow-lg">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white hover:bg-white/20 px-3 py-2 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>กลับ</span>
            </button>
            <div className="flex items-center gap-2 text-white">
              <ChefHat className="w-6 h-6" />
              <span>เกมทำอาหาร</span>
            </div>
            <div className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded-full">
              <Coins className="w-4 h-4" />
              <span>{user?.coins || 0}</span>
            </div>
          </div>
        </div>

        {/* Queue Info & Skip */}
        {pendingQueues > 0 && (
          <div className="px-4 py-3 bg-amber-100 border-b-2 border-amber-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-700" />
                <span className="text-sm">
                  คิวปัจจุบัน: {pendingQueues} คิวก่อนหน้า
                </span>
              </div>
              <Button
                onClick={() => setShowSkipDialog(true)}
                size="sm"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
              >
                <Zap className="w-4 h-4 mr-1" />
                ข้ามคิว
              </Button>
            </div>
          </div>
        )}

        {/* Spicy Level Selector */}
        <div className="px-4 py-3 bg-white/80 backdrop-blur-sm shadow-sm">
          <div className="mb-2">
            <span className="text-sm">เลือกระดับความเผ็ด</span>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((level) => (
              <button
                key={level}
                onClick={() => setSpicyLevel(level)}
                className={`flex-1 py-2 px-3 rounded-lg transition-all ${
                  spicyLevel === level
                    ? "bg-gradient-to-r from-red-600 to-orange-500 text-white scale-105 shadow-lg"
                    : "bg-white border-2 border-gray-200 hover:border-yellow-400"
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="text-lg">
                    {level === 0 ? "😊" : "🌶️".repeat(level)}
                  </div>
                  <span className="text-xs mt-1">
                    {["ไม่เผ็ด", "เผ็ดน้อย", "เผ็ดกลาง", "เผ็ดมาก"][level]}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Ingredient Count */}
        <div className="px-4 py-2 bg-white/60">
          <div className="flex items-center justify-between">
            <span className="text-sm">
              ที่เลือก: {selectedIngredients.length} วัตถุดิบ
            </span>
            {selectedIngredients.length > 0 && (
              <button
                onClick={() => setSelectedIngredients([])}
                className="text-xs text-red-500 hover:text-red-700"
              >
                ล้างทั้งหมด
              </button>
            )}
          </div>
        </div>

        <div className="px-3 py-4 max-w-4xl mx-auto">
          {/* Main Cooking Area */}
          <div className="flex gap-2 mb-4">
            {/* Left: Meat & Seafood */}
            <div className="flex-shrink-0 w-20 space-y-2 overflow-y-auto max-h-[500px]">
              <div className="bg-gradient-to-br from-red-600 to-red-500 text-white px-1 py-1 rounded-lg text-center shadow-md sticky top-0 z-10">
                <p className="text-[10px]">เนื้อ</p>
              </div>
              {[...meats, ...seafoods].map((ingredient) => {
                const isSelected = selectedIngredients.find(
                  (i) => i.id === ingredient.id
                );
                return (
                  <button
                    key={ingredient.id}
                    onClick={() => toggleIngredient(ingredient)}
                    className={`w-full aspect-square rounded-xl shadow-lg transition-all transform active:scale-95 ${
                      isSelected
                        ? "bg-gradient-to-br from-green-400 to-emerald-500 scale-95 ring-2 ring-green-300"
                        : "bg-white hover:scale-105"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center h-full p-1">
                      {isUrl(ingredient.icon) ? (
                        <img
                          src={ingredient.icon}
                          alt={ingredient.name}
                          className="w-12 h-12 object-contain"
                        />
                      ) : (
                        <span className="text-2xl">{ingredient.icon}</span>
                      )}
                      <span className="text-xs mt-1">{ingredient.name}</span>
                      {isSelected && (
                        <Sparkles className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Center: Frying Pan */}
            <div className="flex-1 flex flex-col items-center justify-center min-w-0">
              <div
                className="relative w-full max-w-[240px] mx-auto"
                style={{ aspectRatio: "1" }}
              >
                {/* Pan Shadow */}
                <div className="absolute inset-0 bg-black/20 rounded-full blur-xl transform translate-y-4" />

                {/* Frying Pan */}
                <div className="relative bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 rounded-full shadow-2xl border-4 border-gray-900 overflow-hidden h-full">
                  {/* Pan shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-full" />

                  {/* Inside of pan */}
                  <div className="absolute inset-4 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center overflow-hidden">
                    {selectedIngredients.length === 0 ? (
                      <div className="text-center text-gray-500">
                        <Flame className="w-8 h-8 mx-auto mb-1 opacity-30" />
                        <p className="text-xs">เพิ่มวัตถุดิบ!</p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1 items-center justify-center p-2 overflow-y-auto max-h-full">
                        {selectedIngredients.map((ing, idx) => (
                          <div
                            key={ing.id}
                            className="animate-bounce"
                            style={{
                              animationDelay: `${idx * 0.1}s`,
                              animationDuration: "2s",
                            }}
                          >
                            {isUrl(ing.icon) ? (
                              <img
                                src={ing.icon}
                                alt={ing.name}
                                className="w-8 h-8 object-contain"
                              />
                            ) : (
                              <span className="text-2xl">{ing.icon}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pan handle */}
                  <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-12 h-5 bg-gradient-to-r from-gray-800 to-gray-600 rounded-r-full shadow-lg border-t-2 border-b-2 border-gray-900" />
                </div>

                {/* Flames underneath */}
                {selectedIngredients.length > 0 && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <Flame
                        key={i}
                        className="w-6 h-6 text-orange-500 animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Vegetables, Sauces & Spices */}
            <div className="flex-shrink-0 w-20 space-y-2 overflow-y-auto max-h-[500px]">
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white px-1 py-1 rounded-lg text-center shadow-md sticky top-0 z-10">
                <p className="text-[10px]">เครื่องปรุง</p>
              </div>
              {[...vegetables, ...sauces, ...spices].map((ingredient) => {
                const isSelected = selectedIngredients.find(
                  (i) => i.id === ingredient.id
                );
                return (
                  <button
                    key={ingredient.id}
                    onClick={() => toggleIngredient(ingredient)}
                    className={`w-full aspect-square rounded-xl shadow-lg transition-all transform active:scale-95 ${
                      isSelected
                        ? "bg-gradient-to-br from-green-400 to-emerald-500 scale-95 ring-2 ring-green-300"
                        : "bg-white hover:scale-105"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center h-full p-1">
                      {isUrl(ingredient.icon) ? (
                        <img
                          src={ingredient.icon}
                          alt={ingredient.name}
                          className="w-12 h-12 object-contain"
                        />
                      ) : (
                        <span className="text-2xl">{ingredient.icon}</span>
                      )}
                      <span className="text-xs mt-1">{ingredient.name}</span>
                      {isSelected && (
                        <Sparkles className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected ingredients display */}
          {selectedIngredients.length > 0 && (
            <div className="mb-4 p-3 bg-white rounded-lg shadow-md">
              <p className="text-xs text-gray-600 mb-2">วัตถุดิบของคุณ:</p>
              <div className="flex flex-wrap gap-2">
                {selectedIngredients.map((ing) => (
                  <div
                    key={ing.id}
                    className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-full px-3 py-1 shadow-sm flex items-center gap-2"
                  >
                    <span className="text-sm">{ing.name}</span>
                    <button
                      onClick={() => toggleIngredient(ing)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cook Button */}
          <Button
            onClick={startCooking}
            disabled={selectedIngredients.length === 0}
            className="w-full py-6 rounded-2xl shadow-2xl transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white"
            style={{
              background:
                selectedIngredients.length > 0
                  ? "linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)"
                  : "linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)",
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <Flame className="w-6 h-6" />
              <div className="text-center">
                <span className="text-xl">ปรุง!</span>
                {totalPrice > 0 && <div className="text-xs font-semibold">ราคารวม: ฿{totalPrice}</div>}
              </div>
              <Flame className="w-6 h-6" />
            </div>
          </Button>
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

              <div>
                <label className="text-sm mb-2 block">ข้ามกี่คิว?</label>
                <input
                  type="range"
                  min="1"
                  max={Math.min(pendingQueues, 10)}
                  value={skipAmount}
                  onChange={(e) => setSkipAmount(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm">ข้าม: {skipAmount} คิว</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">ราคา:</span>
                    <Coins className="w-4 h-4 text-yellow-600" />
                    <span>{skipAmount * 100}</span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowSkipDialog(false)}
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleSkipQueue}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                ข้ามคิว
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (gameStage === "cook") {
    const cookingStage =
      cookingProgress < 25
        ? "กำลังเพิ่มวัตถุดิบ..."
        : cookingProgress < 50
        ? "เสียงฉ่า..."
        : cookingProgress < 75
        ? "กำลังผสมเครื่องปรุง..."
        : "เกือบเสร็จแล้ว...";

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center overflow-hidden relative">
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl opacity-50 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {["✨", "💫", "⭐", "🌟"][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>

        <div className="max-w-md w-full px-6 relative z-10">
          {/* Cooking Stage Label */}
          <div className="text-center mb-6 animate-pulse">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full">
              <p className="text-white">{cookingStage}</p>
            </div>
          </div>

          {/* Main Cooking Pan with Animation */}
          <div className="relative mb-8">
            {/* Steam effects */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 flex gap-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="text-4xl opacity-70"
                  style={{
                    animation: "float 2s ease-in-out infinite",
                    animationDelay: `${i * 0.3}s`,
                  }}
                >
                  💨
                </div>
              ))}
            </div>

            {/* Animated Pan */}
            <div
              className="relative mx-auto w-64 h-64 transition-transform"
              style={{
                animation: "shake 0.5s ease-in-out infinite",
              }}
            >
              {/* Pan shadow that grows */}
              <div
                className="absolute inset-0 bg-black/30 rounded-full blur-2xl transform translate-y-8"
                style={{
                  transform: `scale(${1 + cookingProgress / 200})`,
                }}
              />

              {/* Main pan */}
              <div className="relative bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 rounded-full shadow-2xl border-8 border-gray-900 overflow-hidden h-full">
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-full animate-pulse" />

                {/* Inside of pan with ingredients */}
                <div className="absolute inset-8 bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600 rounded-full flex items-center justify-center overflow-hidden">
                  {/* Sizzle effect */}
                  <div className="absolute inset-0 opacity-50">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-200 rounded-full animate-ping"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random()}s`,
                          animationDuration: `${0.5 + Math.random()}s`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Ingredients bouncing around */}
                  <div className="relative flex flex-wrap gap-2 items-center justify-center p-4">
                    {selectedIngredients.map((ing, idx) => (
                      <div
                        key={ing.id}
                        style={{
                          animation: `bounce 0.6s ease-in-out infinite, spin 3s linear infinite`,
                          animationDelay: `${idx * 0.15}s`,
                        }}
                      >
                        {isUrl(ing.icon) ? (
                          <img src={ing.icon} alt={ing.name} className="w-10 h-10 object-contain" />
                        ) : (
                          <span className="text-4xl">{ing.icon}</span>
                        )}
                      </div>
                    ))}
                    {/* Show chili peppers for spicy level */}
                    {spicyLevel > 0 && (
                      <div className="text-4xl animate-bounce">
                        {"🌶️".repeat(spicyLevel)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Pan handle */}
                <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-16 h-6 bg-gradient-to-r from-gray-800 to-gray-600 rounded-r-full shadow-lg border-t-2 border-b-2 border-gray-900" />
              </div>
            </div>

            {/* Flames underneath - animated */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
              {[...Array(5)].map((_, i) => (
                <Flame
                  key={i}
                  className="w-12 h-12 text-orange-400"
                  style={{
                    animation: "flame 0.4s ease-in-out infinite alternate",
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Progress Bar with Effects */}
          <div className="space-y-3 mt-16">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-1">
              <div
                className="h-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full transition-all duration-300 flex items-center justify-center overflow-hidden relative"
                style={{ width: `${cookingProgress}%` }}
              >
                {/* Shimmer effect */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  style={{
                    animation: "shimmer 1s linear infinite",
                  }}
                />
                <span className="text-white text-xs relative z-10">
                  {cookingProgress}%
                </span>
              </div>
            </div>
          </div>

          {/* Action text */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-white/90 text-lg animate-pulse">
              {selectedIngredients.map((ing) => (
                isUrl(ing.icon) ? (
                  <img key={ing.id} src={ing.icon} alt={ing.name} className="w-6 h-6 object-contain" />
                ) : (
                  <span key={ing.id}>{ing.icon}</span>
                )
              ))}
              <span>→</span>
              <span>🍽️</span>
            </div>
          </div>
        </div>

        {/* Add custom keyframes */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); opacity: 0; }
            50% { transform: translateY(-100px); opacity: 0.7; }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0) rotate(0deg); }
            25% { transform: translateX(-5px) rotate(-2deg); }
            75% { transform: translateX(5px) rotate(2deg); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes flame {
            0% { transform: scaleY(1) translateY(0); opacity: 1; }
            100% { transform: scaleY(1.3) translateY(-5px); opacity: 0.7; }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">✨</div>
          <h2>ปรุงอาหารเสร็จแล้ว!</h2>
          <Card className="p-6 bg-white">
            <div className="aspect-video bg-gradient-to-br from-orange-200 to-yellow-200 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                {selectedIngredients.map((ing, idx) => (
                  <div
                    key={ing.id}
                    className="absolute"
                    style={{
                      left: `${20 + idx * 15}%`,
                      top: `${30 + (idx % 3) * 20}%`,
                    }}
                  >
                    {isUrl(ing.icon) ? (
                      <img src={ing.icon} alt={ing.name} className="w-10 h-10 object-contain" />
                    ) : (
                      <span className="text-4xl">{ing.icon}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="z-10">
                <img src="/assets/จาน.png" alt="จานอาหาร" style={{ width: '200px', height: '200px', objectFit: 'contain' }} />
              </div>
            </div>
            <h3 className="mb-2">{dishName}</h3>
            {spicyLevel > 0 && (
              <div className="flex items-center justify-center gap-1 mb-3">
                <span className="text-sm">ระดับความเผ็ด:</span>
                <span className="text-xl">{"🌶️".repeat(spicyLevel)}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {selectedIngredients.map((ing) => (
                <Badge key={ing.id} variant="secondary" className="flex items-center gap-1">
                  {isUrl(ing.icon) ? (
                    <img src={ing.icon} alt={ing.name} className="w-4 h-4 object-contain" />
                  ) : (
                    <span>{ing.icon}</span>
                  )}
                  <span>{ing.name}</span>
                </Badge>
              ))}
            </div>
          </Card>
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
            <p className="text-sm">
              🎉 โบนัส: +10 เหรียญ หิว หิว หิว สำหรับการเล่น!
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Coins className="w-5 h-5 text-yellow-600" />
              <span>ยอดคงเหลือใหม่: {user?.coins || 0} เหรียญ</span>
            </div>
          </div>
        </div>

        <Button
          onClick={() =>
            onOrderComplete(dishName, selectedIngredients, spicyLevel)
          }
          className="w-full py-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
        >
          ยืนยันออเดอร์
        </Button>

        <Button variant="outline" onClick={onBack} className="w-full">
          เริ่มใหม่
        </Button>
      </div>
    </div>
  );
}