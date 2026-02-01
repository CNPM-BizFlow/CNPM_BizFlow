'use client';
import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/dashboard/Header';
import { AICommandInput } from '@/components/dashboard/AICommandInput';
import { DraftOrderList } from '@/components/dashboard/DraftOrderList';
import { Card } from '@/components/ui/Card';
import {
  TrendUp,
  Warning,
  Money,
  Package,
  CircleNotch,
  Users,
  ShoppingCart,
  ClockCounterClockwise,
  Robot,
  List,
  ChartLine
} from '@phosphor-icons/react';
import Link from 'next/link';
import api from '@/lib/api';

interface DashboardStats {
  today_revenue: number;
  month_revenue: number;
  today_orders: number;
  pending_drafts: number;
  total_debt: number;
}

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, topRes] = await Promise.all([
        api.get('/reports/dashboard?store_id=1'),
        api.get('/reports/top-products?store_id=1')
      ]);
      if (statsRes.data?.data) setStats(statsRes.data.data);
      if (topRes.data?.data) setTopProducts(topRes.data.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, refreshKey]);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  return (
    <main className="min-h-screen pb-24 bg-slate-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="!p-6 border-l-4 border-l-emerald-500 hover:shadow-lg transition-all animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-start mb-2">
              <span className="text-slate-500 font-medium text-sm">Doanh thu hôm nay</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Money size={20} weight="duotone" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {loading ? <div className="h-8 w-32 bg-slate-100 animate-pulse rounded" /> : formatPrice(stats?.today_revenue || 0)}
            </div>
          </Card>

          <Card className="!p-6 border-l-4 border-l-orange-500 hover:shadow-lg transition-all animate-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-start mb-2">
              <span className="text-slate-500 font-medium text-sm">Tổng công nợ</span>
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                <Users size={20} weight="duotone" />
              </div>
            </div>
            <div className="text-2xl font-black text-orange-600">
              {loading ? <div className="h-8 w-32 bg-slate-100 animate-pulse rounded" /> : formatPrice(stats?.total_debt || 0)}
            </div>
          </Card>

          <Card className="!p-6 border-l-4 border-l-primary hover:shadow-lg transition-all animate-in slide-in-from-bottom-2 duration-700">
            <div className="flex justify-between items-start mb-2">
              <span className="text-slate-500 font-medium text-sm">Đơn hàng mới</span>
              <div className="p-2 bg-primary/5 text-primary rounded-lg">
                <ShoppingCart size={20} weight="duotone" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {loading ? <div className="h-8 w-20 bg-slate-100 animate-pulse rounded" /> : stats?.today_orders}
            </div>
          </Card>

          <Card className="!p-6 border-l-4 border-l-indigo-500 hover:shadow-lg transition-all animate-in slide-in-from-bottom-2 duration-1000">
            <div className="flex justify-between items-start mb-2">
              <span className="text-slate-500 font-medium text-sm">AI đơn nháp</span>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <ClockCounterClockwise size={20} weight="duotone" />
              </div>
            </div>
            <div className="text-3xl font-black text-indigo-600">
              {loading ? <div className="h-8 w-20 bg-slate-100 animate-pulse rounded" /> : stats?.pending_drafts}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Area (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Input */}
            <section className="animate-in fade-in duration-500">
              <div className="flex items-center gap-2 mb-4">
                <Robot size={24} className="text-primary" weight="duotone" />
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Trợ lý AI BizFlow</h2>
              </div>
              <AICommandInput onSuccess={() => setRefreshKey(prev => prev + 1)} />
            </section>

            {/* Draft List */}
            <section className="animate-in fade-in duration-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <List size={24} className="text-primary" weight="duotone" />
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Cần Duyệt Ngay</h2>
                </div>
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-100 px-3 py-1 rounded">Real-time</div>
              </div>
              <DraftOrderList refreshTrigger={refreshKey} onProcessed={() => setRefreshKey(prev => prev + 1)} />
            </section>
          </div>

          {/* Sidebar (1/3) */}
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <section>
              <div className="flex items-center gap-2 mb-4">
                <ChartLine size={24} className="text-primary" weight="duotone" />
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sản phẩm bán chạy</h2>
              </div>
              <Card className="!p-0 overflow-hidden border-slate-200">
                {loading ? (
                  <div className="p-10 text-center text-slate-300">
                    <CircleNotch size={24} className="animate-spin mx-auto" />
                  </div>
                ) : topProducts.length === 0 ? (
                  <div className="p-10 text-center text-slate-400 italic text-sm">Chưa có dữ liệu giao dịch</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {topProducts.map((p, i) => (
                      <div key={p.name} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-800 text-sm truncate flex-1">#{i + 1} {p.name}</span>
                          <span className="text-xs font-bold text-primary ml-2">{p.quantity} sp</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-1000"
                            style={{ width: `${(p.quantity / topProducts[0].quantity) * 100}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">Doanh thu: {formatPrice(p.revenue)}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                  <Link href="/reports" className="text-xs font-bold text-primary hover:underline flex items-center justify-center gap-1">
                    XEM BÁO CÁO CHI TIẾT
                  </Link>
                </div>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
