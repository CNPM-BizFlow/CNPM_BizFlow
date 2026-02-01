'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Header } from '@/components/dashboard/Header';
import { Card } from '@/components/ui/Card';
import {
    Receipt,
    MagnifyingGlass,
    ArrowClockwise,
    DotsThreeVertical,
    CircleNotch,
    HandCoins,
    CreditCard,
    FileText
} from '@phosphor-icons/react';
import api from '@/lib/api';

interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    total_amount: number;
    is_credit: boolean;
    status: string;
    created_at: string;
}

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/orders?store_id=1&per_page=50');
            if (res.data?.data) {
                setOrders(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders, refreshKey]);

    const filteredOrders = orders.filter(o =>
        o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatPrice = (val: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <main className="min-h-screen pb-20 bg-slate-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Receipt size={28} className="text-primary" weight="duotone" />
                            Lịch sử Đơn hàng
                        </h1>
                        <p className="text-slate-500">Xem và in lại các đơn hàng đã thực hiện</p>
                    </div>
                </div>

                {/* Filters & Search */}
                <Card className="mb-6 !p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm theo số đơn hoặc tên khách..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary transition-colors"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setRefreshKey(prev => prev + 1)}
                                className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                                title="Tải lại"
                            >
                                <ArrowClockwise size={20} className={loading ? "animate-spin" : ""} />
                            </button>
                        </div>
                    </div>
                </Card>

                {/* Orders Table */}
                <Card className="overflow-hidden !p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Số đơn</th>
                                    <th className="px-6 py-4">Thời gian</th>
                                    <th className="px-6 py-4">Khách hàng</th>
                                    <th className="px-6 py-4">Hình thức</th>
                                    <th className="px-6 py-4">Tổng tiền</th>
                                    <th className="px-6 py-4 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                            <CircleNotch size={32} className="animate-spin mx-auto mb-2 text-primary" />
                                            Đang tải dữ liệu...
                                        </td>
                                    </tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                            Chưa có đơn hàng nào
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">#{order.order_number}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 text-sm">
                                                {formatDate(order.created_at)}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {order.customer_name || 'Khách lẻ'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {order.is_credit ? (
                                                    <span className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-2 py-1 rounded-full text-xs font-bold w-fit">
                                                        <CreditCard size={14} />
                                                        Bán nợ
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-bold w-fit">
                                                        <HandCoins size={14} />
                                                        Tiền mặt
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-black text-slate-900">{formatPrice(order.total_amount)}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors" title="Xem chi tiết">
                                                        <FileText size={20} />
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                                                        <DotsThreeVertical size={24} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </main>
    );
}
