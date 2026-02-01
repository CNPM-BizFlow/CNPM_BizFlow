'use client';
import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Clock, Check, Trash, User, Receipt, CircleNotch } from '@phosphor-icons/react';
import api from '../../lib/api';

interface DraftOrderListProps {
    refreshTrigger?: number;
    onProcessed?: () => void;
}

interface DraftOrder {
    id: number;
    text: string;
    parsed_data: {
        customer?: string;
        items?: Array<{ product: string; quantity: number; unit?: string }>;
        total_estimated?: number;
    };
    created_at: string;
    status: string;
}

export const DraftOrderList: React.FC<DraftOrderListProps> = ({ refreshTrigger = 0, onProcessed }) => {
    const [orders, setOrders] = useState<DraftOrder[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchDrafts = async () => {
        try {
            setLoading(true);
            const res = await api.get('/draft-orders?store_id=1');
            if (res.data?.data) {
                setOrders(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch drafts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (id: number) => {
        try {
            if (confirm("Xác nhận tạo đơn hàng này?")) {
                await api.patch(`/draft-orders/${id}/confirm`, {});
                await fetchDrafts();
                if (onProcessed) onProcessed();
            }
        } catch (error) {
            alert("Lỗi khi xác nhận đơn");
        }
    };

    const handleReject = async (id: number) => {
        try {
            if (confirm("Xóa đơn nháp này?")) {
                await api.patch(`/draft-orders/${id}/reject`, { reason: 'User cancelled' });
                await fetchDrafts();
                if (onProcessed) onProcessed();
            }
        } catch (error) {
            alert("Lỗi khi xóa đơn");
        }
    };

    useEffect(() => {
        fetchDrafts();
    }, [refreshTrigger]);

    if (loading && orders.length === 0) {
        return <div className="text-center py-10 opacity-50"><CircleNotch size={32} className="animate-spin mx-auto text-primary" /></div>;
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orders.map((order) => (
                    <Card key={order.id} className="relative group border-l-4 border-l-orange-400 hover:border-l-primary transition-all hover:shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                    <User weight="bold" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 line-clamp-1">{order.parsed_data?.customer || 'Khách vãng lai'}</h3>
                                    <span className="text-xs text-slate-500">
                                        {new Date(order.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                            <span className="bg-orange-50 text-orange-700 text-xs font-bold px-2 py-1 rounded border border-orange-100">
                                {order.status}
                            </span>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-3 mb-4 space-y-1 min-h-[80px]">
                            <p className="text-xs text-slate-500 italic mb-2">"{order.text}"</p>

                            {order.parsed_data?.items && order.parsed_data.items.length > 0 ? (
                                order.parsed_data.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center text-sm text-slate-700">
                                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mr-2"></span>
                                        <span className="font-semibold mr-1">{item.quantity} {item.unit}</span> {item.product}
                                    </div>
                                ))
                            ) : (
                                <span className="text-sm text-red-500">Chưa nhận diện được sản phẩm</span>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                            <span className="font-bold text-lg text-primary">
                                {order.parsed_data?.total_estimated ? order.parsed_data.total_estimated.toLocaleString() + 'đ' : '--'}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleReject(order.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    title="Hủy"
                                >
                                    <Trash size={20} />
                                </button>
                                <Button
                                    onClick={() => handleConfirm(order.id)}
                                    variant="primary"
                                    className="!py-1.5 !px-3 !text-sm"
                                >
                                    <Check weight="bold" /> Duyệt
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}

                {/* Placeholder for "Manual Create" */}
                {orders.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <Clock size={48} className="mx-auto mb-2 opacity-20" />
                        <p>Không có đơn nháp nào cần duyệt</p>
                    </div>
                )}
            </div>
        </div>
    );
};
