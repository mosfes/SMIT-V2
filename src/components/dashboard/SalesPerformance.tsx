import { useState } from 'react';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { TrendingUp, DollarSign, ShoppingCart, Users, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { salesData, menuItems } from '../../data/mockData';

export function SalesPerformance() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Calculate stats
  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  const revenueGrowth = 15.5; // Mock growth percentage

  // Top selling items (mock data)
  const topItems = [
    { name: 'ผัดไทย', sales: 234, revenue: 28080 },
    { name: 'แกงเขียวหวาน', sales: 189, revenue: 24570 },
    { name: 'ต้มยำกุ้ง', sales: 156, revenue: 17160 },
    { name: 'ข้าวผัด', sales: 198, revenue: 17820 },
  ];

  // Category distribution
  const categoryData = [
    { name: 'อาหารจานหลัก', value: 65, color: '#f97316' },
    { name: 'ของทานเล่น', value: 20, color: '#3b82f6' },
    { name: 'ของหวาน', value: 10, color: '#8b5cf6' },
    { name: 'เครื่องดื่ม', value: 5, color: '#10b981' },
  ];

  // Recent sales data
  const recentData = salesData.slice(-7);

  return (
    <div className="h-screen bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b p-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <h1>ประสิทธิภาพการขาย</h1>
          <p className="text-muted-foreground">ติดตามตัวชี้วัดและแนวโน้มธุรกิจของคุณ</p>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Period Selector */}
          <Tabs value={period} onValueChange={(v) => setPeriod(v as any)}>
            <TabsList>
              <TabsTrigger value="week">สัปดาห์นี้</TabsTrigger>
              <TabsTrigger value="month">เดือนนี้</TabsTrigger>
              <TabsTrigger value="year">ปีนี้</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">รายได้รวม</p>
                  <h2 className="text-3xl">฿{totalRevenue.toLocaleString()}</h2>
                  <div className="flex items-center gap-1 text-sm text-green-600 mt-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>+{revenueGrowth}%</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ออเดอร์ทั้งหมด</p>
                  <h2 className="text-3xl">{totalOrders}</h2>
                  <div className="flex items-center gap-1 text-sm text-blue-600 mt-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>+12.3%</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">มูลค่าเฉลี่ยต่อออเดอร์</p>
                  <h2 className="text-3xl">฿{Math.round(avgOrderValue)}</h2>
                  <div className="flex items-center gap-1 text-sm text-purple-600 mt-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>+8.2%</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ลูกค้าทั้งหมด</p>
                  <h2 className="text-3xl">1,234</h2>
                  <div className="flex items-center gap-1 text-sm text-orange-600 mt-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>+18.4%</span>
                  </div>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Revenue Chart */}
            <Card className="p-6">
              <h3 className="mb-4">แนวโน้มรายได้</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={recentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(date) => new Date(date).getDate().toString()} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Orders Chart */}
            <Card className="p-6">
              <h3 className="mb-4">ออเดอร์รายวัน</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={recentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(date) => new Date(date).getDate().toString()} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Selling Items */}
            <Card className="p-6">
              <h3 className="mb-4">รายการที่ขายดีที่สุด</h3>
              <div className="space-y-4">
                {topItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span>{index + 1}</span>
                      </div>
                      <div>
                        <p>{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.sales} ออเดอร์</p>
                      </div>
                    </div>
                    <span>฿{item.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Category Distribution */}
            <Card className="p-6">
              <h3 className="mb-4">ยอดขายตามหมวดหมู่</h3>
              <div className="flex items-center justify-between">
                <ResponsiveContainer width="60%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                      <span className="text-sm">{category.name}</span>
                      <span className="text-sm text-muted-foreground">{category.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Peak Hours */}
          <Card className="p-6">
            <h3 className="mb-4">ชั่วโมงเร่งด่วน</h3>
            <div className="grid grid-cols-12 gap-2">
              {Array.from({ length: 12 }, (_, i) => {
                const hour = i + 11; // 11 AM to 10 PM
                const activity = Math.random() * 100;
                return (
                  <div key={i} className="text-center">
                    <div
                      className="bg-orange-500 rounded-t"
                      style={{
                        height: `${activity}px`,
                        minHeight: '20px',
                      }}
                    ></div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {hour > 12 ? hour - 12 : hour}{hour >= 12 ? 'PM' : 'AM'}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}