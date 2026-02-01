'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Header } from '@/components/dashboard/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    Users,
    Plus,
    MagnifyingGlass,
    Funnel,
    ArrowClockwise,
    DotsThreeVertical,
    Phone,
    MapPin,
    CurrencyCircleDollar,
    CircleNotch,
    CheckCircle
} from '@phosphor-icons/react';
import api from '@/lib/api';

interface Customer {
    id: number;
    name: string;
    phone: string;
    address: string;
    debt_balance: number;
    debt_limit: number;
}

import { Modal } from '@/components/ui/Modal';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [onlyDebt, setOnlyDebt] = useState(false);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form states
    const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', address: '' });
    const [paymentData, setPaymentData] = useState({ customer_id: 0, customer_name: '', amount: '', notes: 'Thu nợ khách hàng' });

    const fetchCustomers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(`/customers?store_id=1${onlyDebt ? '&has_debt=true' : ''}`);
            if (res.data?.data) {
                setCustomers(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch customers", error);
        } finally {
            setLoading(false);
        }
    }, [onlyDebt]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers, refreshKey]);

    const handleAddCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await api.post('/customers', {
                store_id: 1,
                ...newCustomer
            });
            setIsAddModalOpen(false);
            setNewCustomer({ name: '', phone: '', address: '' });
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            alert("Lỗi khi thêm khách hàng");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRecordPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await api.post(`/customers/${paymentData.customer_id}/payments`, {
                amount: Number(paymentData.amount),
                notes: paymentData.notes,
                payment_method: 'cash'
            });
            setIsPaymentModalOpen(false);
            setPaymentData({ customer_id: 0, customer_name: '', amount: '', notes: 'Thu nợ khách hàng' });
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            alert("Lỗi khi thu tiền");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone?.includes(searchQuery)
    );

    const formatPrice = (val: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
    };

    return (
        <main className="min-h-screen pb-20 bg-slate-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Users size={28} className="text-primary" weight="duotone" />
                            Quản lý Khách hàng
                        </h1>
                        <p className="text-slate-500">Thông tin liên lạc và theo dõi công nợ khách hàng</p>
                    </div>
                    <Button
                        variant="primary"
                        leftIcon={<Plus size={20} />}
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Thêm khách hàng
                    </Button>
                </div>

                {/* Filters & Search */}
                <Card className="mb-6 !p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm tên hoặc số điện thoại..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary transition-colors"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
                                <input
                                    type="checkbox"
                                    className="accent-primary w-4 h-4"
                                    checked={onlyDebt}
                                    onChange={(e) => setOnlyDebt(e.target.checked)}
                                />
                                <span className="text-sm font-medium">Chỉ hiện nợ</span>
                            </label>
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

                {/* Customers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full py-20 text-center">
                            <CircleNotch size={40} className="animate-spin mx-auto mb-4 text-primary" />
                            <p className="text-slate-500">Đang tải danh sách khách hàng...</p>
                        </div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="col-span-full py-20 text-center">
                            <Users size={64} className="mx-auto mb-4 text-slate-200" />
                            <p className="text-slate-500 text-lg">Không tìm thấy khách hàng nào</p>
                        </div>
                    ) : (
                        filteredCustomers.map((customer) => (
                            <Card key={customer.id} className="relative group border-slate-200 hover:border-primary/30 hover:shadow-lg transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <Users size={24} weight="fill" />
                                    </div>
                                    <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                                        <DotsThreeVertical size={24} weight="bold" />
                                    </button>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 mb-1">{customer.name}</h3>

                                <div className="space-y-2 mb-6 text-sm">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Phone size={16} />
                                        <span>{customer.phone || 'Không có số'}</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-slate-500">
                                        <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                                        <span className="line-clamp-1">{customer.address || 'Chưa cập nhật địa chỉ'}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex items-end justify-between">
                                    <div>
                                        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Công nợ hiện tại</span>
                                        <div className={`text-xl font-black mt-1 ${customer.debt_balance > 0 ? 'text-orange-600' : 'text-emerald-600'}`}>
                                            {formatPrice(customer.debt_balance)}
                                        </div>
                                    </div>
                                    {customer.debt_balance > 0 ? (
                                        <Button
                                            variant="outline"
                                            className="text-xs py-1.5 h-auto text-orange-600 border-orange-200 hover:bg-orange-50"
                                            onClick={() => {
                                                setPaymentData({ ...paymentData, customer_id: customer.id, customer_name: customer.name });
                                                setIsPaymentModalOpen(true);
                                            }}
                                        >
                                            Thu tiền
                                        </Button>
                                    ) : (
                                        <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded">
                                            <CheckCircle size={14} weight="fill" />
                                            Đã trả hết
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Add Customer Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Thêm Khách Hàng Mới">
                <form onSubmit={handleAddCustomer} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Tên khách hàng *</label>
                        <input
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary"
                            placeholder="Vd: Chú Ba Tiền Giang"
                            value={newCustomer.name}
                            onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Số điện thoại</label>
                        <input
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary"
                            placeholder="Vd: 090xxxxxxx"
                            value={newCustomer.phone}
                            onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Địa chỉ</label>
                        <textarea
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary"
                            rows={2}
                            placeholder="Vd: 123 Đường ABC..."
                            value={newCustomer.address}
                            onChange={e => setNewCustomer({ ...newCustomer, address: e.target.value })}
                        />
                    </div>
                    <div className="pt-4 flex gap-3">
                        <Button variant="outline" className="flex-1" type="button" onClick={() => setIsAddModalOpen(false)}>Hủy</Button>
                        <Button variant="primary" className="flex-1" type="submit" isLoading={isSubmitting}>Lưu Khách Hàng</Button>
                    </div>
                </form>
            </Modal>

            {/* Record Payment Modal */}
            <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title={`Thu Tiền Nợ: ${paymentData.customer_name}`}>
                <form onSubmit={handleRecordPayment} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Số tiền thu (VNĐ) *</label>
                        <input
                            type="number"
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary text-xl font-black text-primary"
                            placeholder="0"
                            value={paymentData.amount}
                            onChange={e => setPaymentData({ ...paymentData, amount: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Ghi chú</label>
                        <textarea
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary"
                            rows={3}
                            value={paymentData.notes}
                            onChange={e => setPaymentData({ ...paymentData, notes: e.target.value })}
                        />
                    </div>
                    <div className="pt-4 flex gap-3">
                        <Button variant="outline" className="flex-1" type="button" onClick={() => setIsPaymentModalOpen(false)}>Hủy</Button>
                        <Button variant="primary" className="flex-1" type="submit" isLoading={isSubmitting}>Xác Nhận Thu</Button>
                    </div>
                </form>
            </Modal>
        </main>
    );
}
