'use client';

import { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <FiCheckCircle className="text-2xl" />,
        error: <FiAlertCircle className="text-2xl" />,
        info: <FiInfo className="text-2xl" />,
    };

    const colors = {
        success: 'bg-green-50 border-green-500 text-green-800',
        error: 'bg-red-50 border-red-500 text-red-800',
        info: 'bg-blue-50 border-blue-500 text-blue-800',
    };

    return (
        <div
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl border-2 shadow-2xl animate-slide-in max-w-md ${colors[type]}`}
        >
            {icons[type]}
            <p className="flex-1 font-bold">{message}</p>
            <button
                onClick={onClose}
                className="hover:opacity-70 transition"
            >
                <FiX className="text-xl" />
            </button>
        </div>
    );
}
