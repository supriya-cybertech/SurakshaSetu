import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import clsx from 'clsx';

export default function AlertToast({ alert, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!alert) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
            <div className="bg-dark-800/90 backdrop-blur-md border border-red-500/50 rounded-lg shadow-neon-red p-4 flex items-start gap-3 w-80">
                <div className="bg-red-500/10 p-2 rounded-full shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-white">Security Alert</h4>
                    <p className="text-xs text-gray-300 mt-1">{alert.message}</p>
                    <span className="text-[10px] text-gray-500 mt-2 block">
                        {new Date(alert.timestamp).toLocaleTimeString()} • Camera {alert.camera_id}
                    </span>
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
