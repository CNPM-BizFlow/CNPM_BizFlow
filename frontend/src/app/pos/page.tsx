'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Header } from '@/components/dashboard/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    ShoppingCart,
    MagnifyingGlass,
    Trash,
    User,
    CreditCard,
    Money,
    Receipt,
    Plus,
    Minus,
    CircleNotch,
    CheckCircle,
    UserCirclePlus
} from '@phosphor-icons/react';
import api from '@/lib/api';

interface ProductUnit {
    id: number;
    unit_name: string;
    price: number;
    is_default: boolean;
}

interface Product {
    id: number;
    name: string;
    category: string;
    sku: string;
    units: ProductUnit[];
}

interface CartItem {
    product_id: number;
    product_name: string;
    unit_id: number;
    unit_name: string;
    quantity: number;
    price: number;
}

interface Customer {
    id: number;
    name: string;
    phone: string;
}

export default function POSPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
    const [isCredit, setIsCredit] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const fetchInitialData = useCallback(async () => {
        try {
            setLoadingProducts(true);
            const [prodRes, custRes] = await Promise.all([
                api.get('/products?store_id=1&per_page=100'),
                api.get('/customers?store_id=1&per_page=100')
            ]);
            if (prodRes.data?.data) setProducts(prodRes.data.data);
            if (custRes.data?.data) setCustomers(custRes.data.data);
        } catch (error) {
            console.error("Failed to fetch POS data", error);
        } finally {
            setLoadingProducts(false);
        }
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const filteredProducts = useMemo(() =>
        products.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
        ), [products, searchQuery]);

    const addToCart = (product: Product) => {
        const defaultUnit = product.units.find(u => u.is_default) || product.units[0];
        if (!defaultUnit) return;

        setCart(prev => {
            const existing = prev.find(item => item.product_id === product.id && item.unit_id === defaultUnit.id);
            if (existing) {
                return prev.map(item =>
                    (item.product_id === product.id && item.unit_id === defaultUnit.id)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, {
                product_id: product.id,
                product_name: product.name,
                unit_id: defaultUnit.id,
                unit_name: defaultUnit.unit_name,
                quantity: 1,
                price: defaultUnit.price
            }];
        });
    };

    const updateQuantity = (productId: number, unitId: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product_id === productId && item.unit_id === unitId) {
                const newQty = Math.max(0.1, item.quantity + delta);
                return { ...item, quantity: Number(newQty.toFixed(2)) };
            }
            return item;
        }));
    };

    const removeFromCart = (productId: number, unitId: number) => {
        setCart(prev => prev.filter(item => !(item.product_id === productId && item.unit_id === unitId)));
    };

    const totalAmount = useMemo(() =>
        cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        [cart]);

    const handleSubmitOrder = async () => {
        if (cart.length === 0) return;
        if (isCredit && !selectedCustomerId) {
            alert("Vui lòng chọn khách hàng khi bán nợ!");
            return;
        }

        try {
            setIsSubmitting(true);
            const payload = {
                store_id: 1,
                customer_id: selectedCustomerId,
                is_credit: isCredit,
                items: cart.map(item => ({
                    product_unit_id: item.unit_id,
                    quantity: item.quantity,
                    unit_price: item.price
                }))
            };

            await api.post('/orders', payload);

            setSuccessMessage("Tạo đơn hàng thành công!");
            setCart([]);
            setSelectedCustomerId(null);
            setIsCredit(false);

            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error("Order submission failed", error);
            alert("Lỗi khi tạo đơn hàng. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatPrice = (val: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    };

    return (
        <main className="h-screen flex flex-col bg-slate-100 overflow-hidden">
            <Header />

            <div className="flex-1 flex overflow-hidden">
                {/* Left Side: Product Selection */}
                <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
                    <div className="mb-6 flex gap-4">
                        <div className="relative flex-1">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm nhanh sản phẩm (Tên, SKU)..."
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none shadow-sm focus:border-primary transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {loadingProducts ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <CircleNotch size={40} className="animate-spin mb-4 text-primary" />
                                <p>Đang tải danh sách sản phẩm...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
                                {filteredProducts.map(product => (
                                    <button
                                        key={product.id}
                                        onClick={() => addToCart(product)}
                                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-primary active:scale-95 transition-all text-left flex flex-col justify-between h-40 group"
                                    >
                                        <div>
                                            <div className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">{product.category}</div>
                                            <div className="font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{product.name}</div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <div className="text-xs text-slate-400 font-mono">{product.sku || 'N/A'}</div>
                                            <div className="text-lg font-black text-slate-900">
                                                {formatPrice(product.units.find(u => u.is_default)?.price || 0)}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Cart & Checkout */}
                <div className="w-[380px] lg:w-[450px] bg-white border-l border-slate-200 flex flex-col shadow-2xl relative z-10">
                    {/* Cart Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <ShoppingCart size={28} className="text-slate-900" />
                                {cart.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {cart.length}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Giỏ hàng</h2>
                        </div>
                        <button
                            onClick={() => setCart([])}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                            title="Xóa giỏ hàng"
                        >
                            <Trash size={20} />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-60">
                                <ShoppingCart size={64} weight="thin" className="mb-4" />
                                <p className="font-medium">Chưa có sản phẩm nào</p>
                                <p className="text-xs mt-1">Chọn sản phẩm bên trái để bắt đầu</p>
                            </div>
                        ) : (
                            cart.map((item, idx) => (
                                <div key={`${item.product_id}-${item.unit_id}`} className="bg-slate-50 p-3 rounded-lg border border-slate-100 animate-in fade-in slide-in-from-right-4 duration-200">
                                    <div className="flex justify-between gap-2 mb-2">
                                        <span className="font-bold text-slate-800 line-clamp-1 flex-1">{item.product_name}</span>
                                        <span className="font-black text-slate-900">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium bg-white px-2 py-0.5 rounded border border-slate-100">
                                            {item.unit_name}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateQuantity(item.product_id, item.unit_id, -1)}
                                                className="w-7 h-7 bg-white rounded-full flex items-center justify-center border border-slate-200 text-slate-500 hover:text-primary hover:border-primary transition-all shadow-sm"
                                            >
                                                <Minus size={14} weight="bold" />
                                            </button>
                                            <span className="font-bold w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product_id, item.unit_id, 1)}
                                                className="w-7 h-7 bg-white rounded-full flex items-center justify-center border border-slate-200 text-slate-500 hover:text-primary hover:border-primary transition-all shadow-sm"
                                            >
                                                <Plus size={14} weight="bold" />
                                            </button>
                                            <button
                                                onClick={() => removeFromCart(item.product_id, item.unit_id)}
                                                className="ml-2 text-slate-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Cart Footer / Checkout */}
                    <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
                        {/* Customer & Payment Setup */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <select
                                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-primary transition-all appearance-none"
                                        value={selectedCustomerId || ''}
                                        onChange={(e) => setSelectedCustomerId(Number(e.target.value) || null)}
                                    >
                                        <option value="">Khách lẻ</option>
                                        {customers.map(c => (
                                            <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>
                                        ))}
                                    </select>
                                </div>
                                <button className="p-2 bg-white border border-slate-200 rounded-lg text-primary hover:bg-primary/5 shadow-sm" title="Thêm khách hàng">
                                    <UserCirclePlus size={20} />
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsCredit(false)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border font-medium transition-all ${!isCredit ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <Money size={18} />
                                    Tiền mặt
                                </button>
                                <button
                                    onClick={() => setIsCredit(true)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border font-medium transition-all ${isCredit ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <CreditCard size={18} />
                                    Bán nợ
                                </button>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="py-4 border-t border-slate-200/60 space-y-2">
                            <div className="flex justify-between text-slate-500 text-sm">
                                <span>Tạm tính</span>
                                <span>{formatPrice(totalAmount)}</span>
                            </div>
                            <div className="flex justify-between text-slate-500 text-sm">
                                <span>Giảm giá</span>
                                <span>0đ</span>
                            </div>
                            <div className="flex justify-between items-end pt-2">
                                <span className="text-slate-900 font-bold">TỔNG CỘNG</span>
                                <span className="text-3xl font-black text-primary">{formatPrice(totalAmount)}</span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            disabled={cart.length === 0 || isSubmitting}
                            onClick={handleSubmitOrder}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${cart.length === 0 || isSubmitting ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-primary hover:bg-primary-dark hover:-translate-y-0.5'}`}
                        >
                            {isSubmitting ? <CircleNotch size={24} className="animate-spin" /> : <Receipt size={24} />}
                            THANH TOÁN & IN HÓA ĐƠN
                        </button>

                        {successMessage && (
                            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center transition-all animate-in fade-in duration-300">
                                <CheckCircle size={80} weight="fill" className="text-emerald-500 mb-4 animate-bounce" />
                                <div className="text-2xl font-black text-slate-900">{successMessage}</div>
                                <p className="text-slate-500 mt-2">Hệ thống đang in hóa đơn...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
