"use client";

import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useEffect, useState } from "react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
    id: number;
    message: string;
    type: ToastType;
}

const config = {
    success: { icon: CheckCircle, bg: "bg-green-500" },
    error:   { icon: AlertCircle, bg: "bg-red-500" },
    info:    { icon: Info,        bg: "bg-blue-500" },
};

let _id = 0;

export function useToast() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const add = (message: string, type: ToastType) => {
        const id = ++_id;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    return {
        toasts,
        remove: (id: number) => setToasts(prev => prev.filter(t => t.id !== id)),
        success: (msg: string) => add(msg, "success"),
        error:   (msg: string) => add(msg, "error"),
        info:    (msg: string) => add(msg, "info"),
    };
}

export function ToastContainer({ toasts, onClose }: { toasts: ToastItem[]; onClose: (id: number) => void }) {
    return (
        <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
            {toasts.map(({ id, message, type }) => {
                const { icon: Icon, bg } = config[type];
                return (
                    <div key={id} className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${bg}`}>
                        <Icon size={16} />
                        <span>{message}</span>
                        <button title="remove" onClick={() => onClose(id)} className="ml-2 hover:opacity-70">
                            <X size={14} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}