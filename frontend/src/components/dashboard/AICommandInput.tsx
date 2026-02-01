'use client';
import React, { useState, useEffect } from 'react';
import { PaperPlaneRight, Sparkle, Microphone, StopCircle } from '@phosphor-icons/react';
import api from '../../lib/api';

interface AICommandInputProps {
    onSuccess?: () => void;
}

export const AICommandInput: React.FC<AICommandInputProps> = ({ onSuccess }) => {
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Speech Recognition Setup
    const startListening = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'vi-VN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(prev => prev + (prev ? ' ' : '') + transcript);
            setIsListening(false);
        };

        recognition.onerror = () => {
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setIsProcessing(true);
        setStatus('idle');

        try {
            await api.post('/ai/draft-orders', {
                store_id: 1,
                text: input
            });

            setStatus('success');
            setInput('');
            if (onSuccess) onSuccess();

            setTimeout(() => setStatus('idle'), 3000);

        } catch (error) {
            console.error("AI Order Error:", error);
            setStatus('error');
            alert("Lỗi: Không thể xử lý đơn hàng. Vui lòng thử lại.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto my-8 relative z-20 animate-in fade-in zoom-in-95 duration-500">
            <div className={`relative transition-all duration-300 ${isProcessing ? 'scale-[0.98] opacity-80' : ''}`}>
                <div className={`absolute -inset-1 rounded-2xl blur opacity-25 animate-pulse ${status === 'error' ? 'bg-red-500' :
                        status === 'success' ? 'bg-green-500' :
                            isListening ? 'bg-indigo-500' :
                                'bg-gradient-to-r from-primary to-accent'
                    }`}></div>

                <form onSubmit={handleSubmit} className="relative bg-white rounded-2xl shadow-xl shadow-teal-900/5 border border-slate-100 flex items-center p-2">
                    <div className="pl-4 pr-3 text-primary">
                        <Sparkle size={24} weight="fill" className={isProcessing ? "animate-spin" : isListening ? "animate-pulse" : ""} />
                    </div>

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isListening ? "Đang lắng nghe..." : 'Ví dụ: "Lấy 5 bao xi măng cho chú Ba, ghi nợ"'}
                        className={`flex-1 bg-transparent border-none outline-none text-lg text-slate-800 placeholder:text-slate-400 py-4 ${isListening ? 'italic text-primary' : ''}`}
                        disabled={isProcessing}
                        autoFocus
                    />

                    <div className="flex items-center gap-2 pr-2">
                        <button
                            type="button"
                            onClick={startListening}
                            className={`p-3 rounded-xl transition-all ${isListening ? 'bg-indigo-50 text-indigo-600 animate-pulse' : 'text-slate-400 hover:text-primary hover:bg-slate-50'
                                }`}
                        >
                            {isListening ? <StopCircle size={28} weight="fill" /> : <Microphone size={24} />}
                        </button>
                        <button
                            type="submit"
                            className={`p-3 rounded-xl transition-all ${isProcessing ? 'bg-slate-100 text-slate-400 cursor-wait' :
                                    status === 'success' ? 'bg-green-500 text-white shadow-lg shadow-green-200' :
                                        input.trim() ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-300'
                                }`}
                            disabled={!input.trim() || isProcessing}
                        >
                            <PaperPlaneRight size={24} weight="fill" />
                        </button>
                    </div>
                </form>
            </div>

            {/* Suggestions / Hints */}
            {!input && !isProcessing && !isListening && status === 'idle' && (
                <div className="flex justify-center gap-3 mt-4 text-xs font-bold uppercase tracking-tighter text-slate-400 overflow-x-auto pb-2">
                    <span
                        onClick={() => setInput("5 bao xi măng Hà Tiên")}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-full cursor-pointer hover:border-primary hover:text-primary transition-all whitespace-nowrap"
                    >
                        &quot;5 bao xi măng Hà Tiên&quot;
                    </span>
                    <span
                        onClick={() => setInput("Ghi nợ chú Hùng 2tr")}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-full cursor-pointer hover:border-primary hover:text-primary transition-all whitespace-nowrap"
                    >
                        &quot;Ghi nợ chú Hùng 2tr&quot;
                    </span>
                    <span
                        onClick={() => setInput("Nhập thêm 10 bao xi măng")}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-full cursor-pointer hover:border-primary hover:text-primary transition-all whitespace-nowrap"
                    >
                        &quot;Nhập thêm 10 bao xi măng&quot;
                    </span>
                </div>
            )}
        </div>
    );
};
