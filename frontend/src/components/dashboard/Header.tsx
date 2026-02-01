'use client';
import React from 'react';
import { UserCircle, List, Bell, House, Package, Users, ShoppingCart, Receipt, ChartBar } from '@phosphor-icons/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header = () => {
    const pathname = usePathname();

    const navLinks = [
        { name: 'Tổng quan', href: '/', icon: House },
        { name: 'Bán hàng', href: '/pos', icon: ShoppingCart },
        { name: 'Kho hàng', href: '/inventory', icon: Package },
        { name: 'Khách hàng', href: '/customers', icon: Users },
        { name: 'Lịch sử', href: '/orders', icon: Receipt },
        { name: 'Báo cáo', href: '/reports', icon: ChartBar },
    ];

    return (
        <header className="h-16 border-b border-slate-200 bg-white px-4 md:px-6 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                    <button className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg xl:hidden">
                        <List size={24} />
                    </button>
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="text-white font-bold text-lg">B</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">BizFlow</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden xl:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        const isPOS = link.href === '/pos';
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${isActive
                                    ? 'bg-teal-50 text-teal-700'
                                    : isPOS
                                        ? 'text-primary hover:bg-primary/5'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <link.icon size={20} weight={isActive ? 'fill' : 'regular'} />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                    <Bell size={24} />
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded-full pr-3 border border-transparent hover:border-slate-200 transition-all">
                    <UserCircle size={32} className="text-slate-400" weight="fill" />
                    <div className="hidden md:flex flex-col items-start leading-tight">
                        <span className="text-sm font-semibold text-slate-800">Nguyễn Văn Chủ</span>
                        <span className="text-xs text-slate-500">Chủ cửa hàng</span>
                    </div>
                </div>
            </div>
        </header>
    );
};
