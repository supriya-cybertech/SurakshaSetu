import React, { useEffect } from 'react';
import { AlertTriangle, X, Shield } from 'lucide-react';
import clsx from 'clsx';

export default function AlertToast({ alert, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!alert) return null;

    // Determine styles based on severity/type
    let colorClass, bgClass, borderClass, shadowClass, Icon;

    if (alert.incident_type === 'GUEST_VERIFIED') {
        colorClass = "text-green-500";
        bgClass = "bg-green-500/10";
        borderClass = "border-green-500/50";
        shadowClass = "shadow-neon-green"; // ensure this shadow exists or use standard shadow
        Icon = Shield; // Need to import Shield
    } else if (alert.incident_type === 'VERIFICATION_PENDING') {
        colorClass = "text-yellow-500";
        bgClass = "bg-yellow-500/10";
        borderClass = "border-yellow-500/50";
        shadowClass = "shadow-lg"; // Yellow neon might not be defined
        Icon = AlertTriangle;
    } else {
        // Default RED (High Severity / Tailgating)
        colorClass = "text-red-500";
        bgClass = "bg-red-500/10";
        borderClass = "border-red-500/50";
        shadowClass = "shadow-neon-red";
        Icon = AlertTriangle;
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
            <div className={clsx(
                "backdrop-blur-md border rounded-lg p-4 flex items-start gap-3 w-80 bg-dark-800/90",
                borderClass, shadowClass
            )}>
                <div className={clsx("p-2 rounded-full shrink-0", bgClass)}>
                    <Icon className={clsx("w-5 h-5", colorClass)} />
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
