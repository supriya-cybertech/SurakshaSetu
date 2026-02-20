import React from 'react';
import clsx from 'clsx';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
    const styles = {
        active: "bg-status-success/10 text-status-success border-status-success/20",
        inactive: "bg-gray-100 text-gray-500 border-gray-200",
        warning: "bg-status-warning/10 text-status-warning border-status-warning/20",
        danger: "bg-status-danger/10 text-status-danger border-status-danger/20",
        high: "bg-status-danger/10 text-status-danger border-status-danger/20",
        medium: "bg-status-warning/10 text-status-warning border-status-warning/20",
        low: "bg-blue-50 text-blue-600 border-blue-200",
        resolved: "bg-status-success/10 text-status-success border-status-success/20",
    };

    const key = status?.toLowerCase() || 'inactive';
    const style = styles[key] || styles.inactive;

    const Icons = {
        active: CheckCircle,
        high: AlertTriangle,
        danger: XCircle,
        warning: AlertTriangle,
        resolved: CheckCircle,
    };

    // Default to plain circle if no icon
    const Icon = Icons[key] || Info;
    const showIcon = ['active', 'high', 'danger', 'warning', 'resolved'].includes(key);

    return (
        <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border uppercase tracking-wide", style)}>
            {showIcon && <Icon className="w-3.5 h-3.5" />}
            {status}
        </span>
    );
}
