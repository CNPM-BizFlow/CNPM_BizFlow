'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Header } from '@/components/dashboard/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    Package,
    Plus,
    MagnifyingGlass,
    Funnel,
    ArrowClockwise,
    DotsThreeVertical,
    Warning,
    CircleNotch
} from '@phosphor-icons/react';
import api from '@/lib/api';

interface ProductInventory {
    product_id: number;
    product_name: string;
    sku: string;
    category: string;
    current_stock: number;
}

import { Modal } from '@/components/ui/Modal';

export default function InventoryPage() {
    const [inventory, setInventory] = useState<ProductInventory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form states
    const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', sku: '' });
    const [importData, setImportData] = useState({ product_id: '', quantity: '', notes: 'Nhập kho bổ sung' });

    const fetchInventory = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/inventory/levels?store_id=1');
            if (res.data?.data) {
                setInventory(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch inventory", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory, refreshKey]);

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await api.post('/products', {
                store_id: 1,
                name: newProduct.name,
                category: newProduct.category,
                sku: newProduct.sku,
                units: [{ unit_name: 'bao', price: Number(newProduct.price), is_default: true }]
            });
            setIsAddModalOpen(false);
            setNewProduct({ name: '', category: '', price: '', sku: '' });
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            alert("Lỗi khi thêm sản phẩm");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImportStock = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await api.post('/inventory/imports', {
                store_id: 1,
                items: [{
                    product_id: Number(importData.product_id),
                    quantity: Number(importData.quantity),
                    notes: importData.notes
                }]
            });
            setIsImportModalOpen(false);
            setImportData({ product_id: '', quantity: '', notes: 'Nhập kho bổ sung' });
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            alert("Lỗi khi nhập kho");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredInventory = inventory.filter(item =>
        item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="min-h-screen pb-20 bg-slate-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Package size={28} className="text-primary" weight="duotone" />
                            Quản lý Kho hàng
                        </h1>
                        <p className="text-slate-500">Xem và quản lý tồn kho sản phẩm của bạn</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            leftIcon={<Plus size={20} />}
                            className="bg-white"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            Thêm sản phẩm
                        </Button>
                        <Button
                            variant="primary"
                            leftIcon={<Plus size={20} />}
                            onClick={() => setIsImportModalOpen(true)}
                        >
                            Nhập kho
                        </Button>
                    </div>
                </div>

                {/* Filters & Search */}
                <Card className="mb-6 !p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm tên sản phẩm, SKU..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary transition-colors"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                                <Funnel size={20} />
                                <span>Bộ lọc</span>
                            </button>
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

                {/* Inventory Table */}
                <Card className="overflow-hidden !p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Sản phẩm</th>
                                    <th className="px-6 py-4">SKU</th>
                                    <th className="px-6 py-4">Phân loại</th>
                                    <th className="px-6 py-4">Tồn kho</th>
                                    <th className="px-6 py-4 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                            <CircleNotch size={32} className="animate-spin mx-auto mb-2 text-primary" />
                                            Đang tải dữ liệu...
                                        </td>
                                    </tr>
                                ) : filteredInventory.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                            Không tìm thấy sản phẩm nào
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInventory.map((item) => (
                                        <tr key={item.product_id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-slate-900">{item.product_name}</div>
                                                <div className="text-xs text-slate-400 uppercase">ID: {item.product_id}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 font-mono text-sm">
                                                {item.sku || '---'}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                <span className="px-2 py-1 bg-slate-100 rounded text-xs">
                                                    {item.category || 'Chưa phân loại'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-bold text-lg ${item.current_stock <= 5 ? 'text-red-500' : 'text-slate-900'}`}>
                                                        {item.current_stock}
                                                    </span>
                                                    {item.current_stock <= 5 && (
                                                        <Warning size={18} className="text-red-500" weight="fill" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setImportData({ ...importData, product_id: item.product_id.toString() });
                                                            setIsImportModalOpen(true);
                                                        }}
                                                        className="px-3 py-1 text-xs font-bold text-primary border border-primary/20 rounded hover:bg-primary/5 transition-colors"
                                                    >
                                                        + Nhập kho
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
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

            {/* Add Product Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Thêm Sản Phẩm Mới">
                <form onSubmit={handleAddProduct} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Tên sản phẩm *</label>
                        <input
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary"
                            placeholder="Vd: Xi măng Hà Tiên"
                            value={newProduct.name}
                            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Danh mục</label>
                            <input
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary"
                                placeholder="Vd: Vật liệu"
                                value={newProduct.category}
                                onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Mã SKU</label>
                            <input
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary"
                                placeholder="Vd: XM-001"
                                value={newProduct.sku}
                                onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Giá bán mặc định (VNĐ)</label>
                        <input
                            type="number"
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary"
                            placeholder="0"
                            value={newProduct.price}
                            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                        />
                    </div>
                    <div className="pt-4 flex gap-3">
                        <Button variant="outline" className="flex-1" type="button" onClick={() => setIsAddModalOpen(false)}>Hủy</Button>
                        <Button variant="primary" className="flex-1" type="submit" isLoading={isSubmitting}>Lưu Sản Phẩm</Button>
                    </div>
                </form>
            </Modal>

            {/* Stock Import Modal */}
            <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} title="Nhập Kho Hàng">
                <form onSubmit={handleImportStock} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Sản phẩm</label>
                        <select
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary bg-white"
                            value={importData.product_id}
                            onChange={e => setImportData({ ...importData, product_id: e.target.value })}
                        >
                            <option value="">Chọn sản phẩm...</option>
                            {inventory.map(item => (
                                <option key={item.product_id} value={item.product_id}>{item.product_name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Số lượng nhập thêm</label>
                        <input
                            type="number"
                            required
                            min="0.1"
                            step="0.1"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary"
                            placeholder="0"
                            value={importData.quantity}
                            onChange={e => setImportData({ ...importData, quantity: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Ghi chú</label>
                        <textarea
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary"
                            rows={3}
                            value={importData.notes}
                            onChange={e => setImportData({ ...importData, notes: e.target.value })}
                        />
                    </div>
                    <div className="pt-4 flex gap-3">
                        <Button variant="outline" className="flex-1" type="button" onClick={() => setIsImportModalOpen(false)}>Hủy</Button>
                        <Button variant="primary" className="flex-1" type="submit" isLoading={isSubmitting}>Xác Nhận Nhập</Button>
                    </div>
                </form>
            </Modal>
        </main>
    );
}
