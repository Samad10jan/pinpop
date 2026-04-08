"use client";

import { ToastItem, ToastType } from "@/src/types/types";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { useState } from "react";

const config = {
    success: { icon: CheckCircle, bg: "bg-green-500" },
    error: { icon: AlertCircle, bg: "bg-red-500" },
    info: { icon: Info, bg: "bg-blue-500" },
};

let _id = 0;

// Custom Hook of Toast
// Its work is to change the state of toasts and provide functions to add/remove toasts, 
// and also provide some helper functions for different types of toasts (success, error, info)
// By changing the state of toasts, it will trigger re-render of ToastContainer which will show/hide toasts accordingly
export function useToast() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    // adds a new toast to the state with a unique id, and also sets a timeout to auto-remove the toast after 3 seconds
    const add = (message: string, type: ToastType) => {
        const id = ++_id;
        setToasts(prev => [...prev, { id, message, type }]);
        // auto remove after 3 seconds
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    // returned functions
    return {
        toasts,
        remove: (id: number) => setToasts(prev => prev.filter(t => t.id !== id)), // remove from array by id
        success: (msg: string) => add(msg, "success"),
        error: (msg: string) => add(msg, "error"),
        info: (msg: string) => add(msg, "info"),
    };
}
// we are always passing toast.remove in onClose where ever we using  
export function ToastContainer({ toasts, onClose }: { toasts: ToastItem[]; onClose: (id: number) => void }) {
    return (
        <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">

            {/*always rendered,shows which are in array and it get removed after 3 sec  */}
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

{/* Render the ToastContainer at first in return of page component
     
    At first there will be nothing in Array , so no toast 
    but when we call toast.error or toast.success 
    it will add a toast to the array and 
    that will trigger re-render of ToastContainer and show the toast.
    also Auto close after 3 sec.
    Manual close by passing toast.remove to onClose, so when we click on close button of toast
    it will remove that toast from array and hide it.
    
 */}