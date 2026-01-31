import React from 'react';
import clsx from 'clsx';

export default function StatusBadge({ status }) {
    const styles = {
        active: "bg-green-500/10 text-green-400 border-green-500/20",
        inactive: "bg-gray-500/10 text-gray-400 border-gray-500/20",
        warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        danger: "bg-red-500/10 text-red-400 border-red-500/20",
        high: "bg-red-500/10 text-red-400 border-red-500/20",
        medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    };

    const key = status?.toLowerCase() || 'inactive';
    const style = styles[key] || styles.inactive;

    return (
        <span className={clsx("px-2.5 py-1 rounded-full text-xs font-semibold border", style)}>
            {status}
        </span>
    );
}
