import React, { useState } from 'react';
import { Settings, Play, MessageCircle, AlertTriangle, CheckCircle, Smartphone } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'react-hot-toast';

export default function TestControlPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [lastSimulatedNumber, setLastSimulatedNumber] = useState(null);

    const triggerSimulation = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/debug/simulate-tailgating', {
                method: 'POST'
            });
            const data = await res.json();
            if (data.status === 'success') {
                toast.success(data.message);
                setLastSimulatedNumber(data.resident_phone);
            } else {
                toast.error(data.message || 'Simulation failed');
            }
        } catch (err) {
            toast.error("Failed to connect to backend");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const simulateWhatsAppReply = async (reply) => {
        if (!lastSimulatedNumber) {
            toast.error("Trigger a simulation first to get a phone number!");
            return;
        }

        try {
            const res = await fetch('http://localhost:8000/api/whatsapp/webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    from: lastSimulatedNumber,
                    body: reply
                })
            });
            const data = await res.json();
            if (data.status === 'processed') {
                toast.success(`Simulated reply: ${reply}`);
            } else {
                toast.error('Reply ignored or error');
            }
        } catch (err) {
            toast.error("Failed to send webhook");
        }
    };

    return (
        <div className="fixed bottom-6 left-6 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-dark-800 border border-dark-700 hover:border-primary-500 text-gray-300 p-3 rounded-full shadow-lg transition-all hover:rotate-90"
            >
                <Settings className="w-6 h-6" />
            </button>

            {isOpen && (
                <div className="absolute bottom-16 left-0 w-80 bg-dark-800/95 backdrop-blur-md border border-dark-700 rounded-xl shadow-2xl p-4 animate-slide-up">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-primary-400" />
                        Testing Controls
                    </h3>

                    <div className="space-y-4">
                        <button
                            onClick={triggerSimulation}
                            disabled={loading}
                            className="w-full btn-primary flex items-center justify-center gap-2 py-3"
                        >
                            {loading ? (
                                <span className="animate-spin">⌛</span>
                            ) : (
                                <Play className="w-4 h-4" />
                            )}
                            Simulate Tailgating Event
                        </button>

                        {lastSimulatedNumber && (
                            <div className="bg-dark-900/50 p-3 rounded-lg border border-white/5 space-y-3">
                                <p className="text-xs text-gray-400">
                                    Simulate WhatsApp Reply from <span className="text-primary-400 font-mono">{lastSimulatedNumber}</span>:
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => simulateWhatsAppReply('YES')}
                                        className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 rounded px-2 py-2 text-sm flex items-center justify-center gap-1 transition-colors"
                                    >
                                        <CheckCircle className="w-3 h-3" /> YES (Verify)
                                    </button>
                                    <button
                                        onClick={() => simulateWhatsAppReply('NO')}
                                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded px-2 py-2 text-sm flex items-center justify-center gap-1 transition-colors"
                                    >
                                        <AlertTriangle className="w-3 h-3" /> NO (Deny)
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="text-[10px] text-gray-500 text-center pt-2 border-t border-white/5">
                            Use this to test the verification flow without physical setup.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
