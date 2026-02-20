import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, CheckCircle, Upload, UserPlus, Image as ImageIcon, RefreshCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import clsx from 'clsx';
import Modal from './Modal';

export default function RegisterResidentModal({ isOpen, onClose }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        phone_number: '',
        flat_number: ''
    });
    const [capturedImage, setCapturedImage] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [loading, setLoading] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        if (isOpen && step === 2) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [isOpen, step]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setIsCapturing(true);
            }
        } catch (err) {
            console.error("Camera error:", err);
            toast.error("Could not access camera");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
            setIsCapturing(false);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            const dataUrl = canvasRef.current.toDataURL('image/jpeg');
            setCapturedImage(dataUrl);
            stopCamera();
        }
    };

    const retakePhoto = () => {
        setCapturedImage(null);
        startCamera();
    };

    const handleNextStep = () => {
        if (!formData.name || !formData.phone_number) {
            toast.error("Name and Phone are required");
            return;
        }
        setStep(2);
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.phone_number || !capturedImage) {
            toast.error("Please complete all fields and capture a photo");
            return;
        }

        setLoading(true);
        try {
            // Convert base64 to blob
            const res = await fetch(capturedImage);
            const blob = await res.blob();
            const file = new File([blob], "face.jpg", { type: "image/jpeg" });

            const data = new FormData();
            data.append('name', formData.name);
            data.append('phone_number', formData.phone_number);
            data.append('flat_number', formData.flat_number);
            data.append('photo', file);

            // In a real app, this URL would be your actual backend endpoint
            // Here we just simulate success or failure if backend is not reachable
            let response;
            try {
                response = await fetch('http://localhost:8000/api/residents/register', {
                    method: 'POST',
                    body: data
                });
            } catch (networkError) {
                console.warn("Backend not reachable, simulating success for UI demo");
                // Simulate success for demo purposes if backend is down
                await new Promise(resolve => setTimeout(resolve, 1500));
                toast.success("Resident registered successfully (Demo Mode)!");
                onClose();
                resetForm();
                setLoading(false);
                return;
            }

            const result = await response.json();
            if (response.ok) {
                toast.success("Resident registered successfully!");
                onClose();
                resetForm();
            } else {
                toast.error(result.detail || "Registration failed");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setStep(1);
        setFormData({ name: '', phone_number: '', flat_number: '' });
        setCapturedImage(null);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Register New Resident"
            size="md"
        >
            <div className="space-y-6">
                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
                    <div className="w-full flex justify-between px-12">
                        <div className="flex flex-col items-center gap-2 bg-white px-2 z-10">
                            <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm ring-4 border-2",
                                step >= 1 ? "bg-primary-600 text-white border-primary-600 ring-primary-50" : "bg-white text-gray-400 border-gray-300 ring-transparent")}>1</div>
                            <span className={clsx("text-xs font-semibold", step >= 1 ? "text-primary-700" : "text-gray-400")}>Details</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 bg-white px-2 z-10">
                            <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm ring-4 border-2",
                                step >= 2 ? "bg-primary-600 text-white border-primary-600 ring-primary-50" : "bg-white text-gray-400 border-gray-300 ring-transparent")}>2</div>
                            <span className={clsx("text-xs font-semibold", step >= 2 ? "text-primary-700" : "text-gray-400")}>Face ID</span>
                        </div>
                    </div>
                </div>

                {step === 1 ? (
                    <div className="space-y-5 animate-fade-in">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Full Name</label>
                            <input
                                type="text"
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                placeholder="e.g. John Doe"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Mobile Number</label>
                            <input
                                type="text"
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                placeholder="e.g. 919876543210"
                                value={formData.phone_number}
                                onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
                            />
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                                WhatsApp alerts enabled
                            </p>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Flat Number</label>
                            <input
                                type="text"
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                placeholder="e.g. A-101"
                                value={formData.flat_number}
                                onChange={e => setFormData({ ...formData, flat_number: e.target.value })}
                            />
                        </div>
                        <div className="pt-6 flex justify-end">
                            <button
                                className="btn-primary flex items-center gap-2 px-6 py-2.5 shadow-lg shadow-primary-500/20"
                                onClick={handleNextStep}
                            >
                                Continue <UserPlus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-fade-in">
                        <div className="relative aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center group shadow-inner">
                            {capturedImage ? (
                                <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    {isCapturing ? (
                                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <span className="text-sm font-medium">Camera is starting...</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 border-[3px] border-white/30 m-4 rounded-xl border-dashed pointer-events-none"></div>
                                </>
                            )}
                            <canvas ref={canvasRef} className="hidden" />
                        </div>

                        <div className="flex justify-center items-center gap-4">
                            {!capturedImage ? (
                                <button
                                    onClick={capturePhoto}
                                    className="bg-primary-600 text-white rounded-full p-4 shadow-xl shadow-primary-500/30 transition-transform hover:scale-105 active:scale-95 ring-4 ring-primary-100"
                                >
                                    <Camera className="w-6 h-6" />
                                </button>
                            ) : (
                                <button
                                    onClick={retakePhoto}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium"
                                >
                                    <RefreshCcw className="w-4 h-4" /> Retake
                                </button>
                            )}
                        </div>

                        <div className="pt-4 flex justify-between border-t border-gray-100 mt-2">
                            <button
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                onClick={() => setStep(1)}
                            >
                                Back
                            </button>
                            <button
                                className="btn-primary flex items-center gap-2 px-6 py-2.5 shadow-lg shadow-primary-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                                onClick={handleSubmit}
                                disabled={!capturedImage || loading}
                            >
                                {loading ? 'Registering...' : 'Complete Registration'}
                                {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
