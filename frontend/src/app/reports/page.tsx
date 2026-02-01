'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Header } from '@/components/dashboard/Header';
import { Card } from '@/components/ui/Card';
import {
    FileText,
    Calendar,
    DownloadSimple,
    ArrowClockwise,
    CircleNotch,
    SealCheck,
    ArrowUpRight,
    ArrowDownLeft,
    HandCoins
} from '@phosphor-icons/react';
import api from '@/lib/api';

interface TT88Summary {
    doanh_thu: number;
    cong_no_phai_thu: number;
    da_thu_cong_no: number;
    cong_no_con_lai: number;
    nhap_kho: number;
    xuat_kho: number;
}

interface ReportEntry {
    id: number;
    entry_date: string;
    description: string;
    entry_type: string;
    amount: number;
}

export default function ReportsPage() {
    const [reportData, setReportData] = useState<{
        summary: TT88Summary;
        entries: ReportEntry[];
        period: { from: string; to: string };
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchReport = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/reports/operations?store_id=1');
            if (res.data?.data) {
                setReportData(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch reports", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReport();
    }, [fetchReport, refreshKey]);

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
                            <FileText size={28} className="text-primary" weight="duotone" />
                            Báo cáo Kế toán (TT 88/2021)
                        </h1>
                        <p className="text-slate-500">Sổ sách kế toán chính thức cho hộ kinh doanh</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                            onClick={() => setRefreshKey(prev => prev + 1)}
                        >
                            <Calendar size={20} />
                            <span>Chọn kỳ báo cáo</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                            <DownloadSimple size={20} weight="bold" />
                            <span>Xuất File Báo Cáo</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 text-center">
                        <CircleNotch size={40} className="animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-slate-500">Đang tổng hợp dữ liệu kế toán...</p>
                    </div>
                ) : !reportData ? (
                    <div className="py-20 text-center text-slate-400">Không có dữ liệu cho kỳ này</div>
                ) : (
                    <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="!p-6 border-l-4 border-l-emerald-500">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                        <HandCoins size={24} weight="duotone" />
                                    </div>
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">DOANH THU</span>
                                </div>
                                <div className="text-3xl font-black text-slate-900">{formatPrice(reportData.summary.doanh_thu)}</div>
                                <p className="text-sm text-slate-400 mt-1">Tổng cộng tiền mặt & nợ</p>
                            </Card>

                            <Card className="!p-6 border-l-4 border-l-orange-500">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                        <ArrowUpRight size={24} weight="duotone" />
                                    </div>
                                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">PHẢI THU</span>
                                </div>
                                <div className="text-3xl font-black text-slate-900">{formatPrice(reportData.summary.cong_no_con_lai)}</div>
                                <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                                    <span>Đã thu: {formatPrice(reportData.summary.da_thu_cong_no)}</span>
                                </div>
                            </Card>

                            <Card className="!p-6 border-l-4 border-l-primary">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-primary/5 text-primary rounded-lg">
                                        <ArrowDownLeft size={24} weight="duotone" />
                                    </div>
                                    <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded">NHẬP KHO</span>
                                </div>
                                <div className="text-3xl font-black text-slate-900">{formatPrice(reportData.summary.nhap_kho)}</div>
                                <p className="text-sm text-slate-400 mt-1">Giá trị hàng hóa nhập vào</p>
                            </Card>
                        </div>

                        {/* Detail Table */}
                        <Card className="!p-0 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <SealCheck size={24} className="text-primary" weight="fill" />
                                    <h2 className="font-bold text-slate-900 text-lg">Sổ Chi Tiết Nghiệp Vụ Kinh Doanh</h2>
                                </div>
                                <div className="text-sm text-slate-500 font-mono">
                                    {new Date(reportData.period.from).toLocaleDateString()} - {new Date(reportData.period.to).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Ngày</th>
                                            <th className="px-6 py-4">Mô tả nghiệp vụ</th>
                                            <th className="px-6 py-4">Loại</th>
                                            <th className="px-6 py-4 text-right">Số tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 italic text-slate-700">
                                        {reportData.entries.map((entry) => (
                                            <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {new Date(entry.entry_date).toLocaleDateString('vi-VN')}
                                                </td>
                                                <td className="px-6 py-4 font-medium">
                                                    {entry.description}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${entry.entry_type === 'revenue' ? 'bg-emerald-50 text-emerald-600' :
                                                            entry.entry_type.includes('debt') ? 'bg-orange-50 text-orange-600' :
                                                                'bg-slate-100 text-slate-600'
                                                        }`}>
                                                        {entry.entry_type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-slate-900">
                                                    {entry.amount > 0 ? '+' : ''}{formatPrice(entry.amount)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </main>
    );
}
