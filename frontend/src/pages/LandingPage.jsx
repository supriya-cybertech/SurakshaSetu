import React, { useState, useEffect } from 'react';
import { Shield, Eye, Lock, ChevronRight, Activity, Users, Video, ArrowRight, CheckCircle, Play, Server, AlertTriangle } from 'lucide-react';

const LandingPage = ({ onEnterApp }) => {
    const [scrolled, setScrolled] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        onEnterApp();
    };

    const scrollToLogin = () => {
        document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-primary-500/20 selection:text-primary-900 overflow-x-hidden">

            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-200 py-3 shadow-sm' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 max-w-7xl flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-accent-teal rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className={`text-xl font-bold tracking-tight ${scrolled ? 'text-gray-900' : 'text-gray-900 lg:text-white'} transition-colors`}>
                            Suraksha<span className="text-primary-500">Setu</span>
                        </span>
                    </div>
                    <div className={`hidden md:flex items-center gap-8 text-sm font-medium ${scrolled ? 'text-gray-600' : 'text-gray-300'} transition-colors`}>
                        <a href="#features" className="hover:text-primary-500 transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-primary-500 transition-colors">How it Works</a>
                        <a href="#stats" className="hover:text-primary-500 transition-colors">Impact</a>
                    </div>
                    <button
                        onClick={onEnterApp}
                        className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:shadow-lg hover:-translate-y-0.5 ${scrolled ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-white text-gray-900 hover:bg-gray-100'}`}
                    >
                        Access Portal
                    </button>
                </div>
            </nav>

            {/* Hero Section with Video Background */}
            <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
                {/* 3D Animation Video Background */}
                <div className="absolute inset-0 z-0 bg-gray-900">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/80 to-primary-900/40 z-10"></div>
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-60"
                        src="https://cdn.pixabay.com/video/2023/10/22/186175-877209995_large.mp4"
                        poster="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070"
                    >
                        <source src="https://cdn.pixabay.com/video/2023/10/22/186175-877209995_large.mp4" type="video/mp4" />
                        {/* Fallback abstract tech video */}
                    </video>
                </div>

                <div className="container mx-auto px-6 max-w-7xl relative z-20">
                    <div className="flex flex-col lg:flex-row items-center gap-16">

                        {/* Hero Content */}
                        <div className="flex-1 text-center lg:text-left pt-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-sm mb-8 animate-fade-in mx-auto lg:mx-0">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-teal"></span>
                                </span>
                                <span className="text-xs font-bold text-accent-teal tracking-wide uppercase">Next-Gen Anti-Tailgating AI</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1] text-white drop-shadow-xl">
                                Secure Your Premises <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent-teal to-primary-400 animate-text-shimmer bg-[length:200%_auto]">
                                    Without Friction.
                                </span>
                            </h1>

                            <p className="text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 mb-12 leading-relaxed">
                                Automatically detect and prevent unauthorized entry with real-time computer vision. <span className="text-white font-semibold">99.9% Accuracy. Zero hardware upgrades.</span>
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button
                                    onClick={scrollToLogin}
                                    className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-primary-500/30 flex items-center justify-center gap-2 group hover:-translate-y-1"
                                >
                                    Get Started
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-lg border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2 group">
                                    <Play className="w-5 h-5 fill-current" />
                                    Watch Demo
                                </button>
                            </div>
                        </div>

                        {/* Login Card */}
                        <div id="login-section" className="flex-1 w-full max-w-md relative animate-slide-up bg-white/5 p-2 rounded-3xl border border-white/10 backdrop-blur-sm">
                            <div className="glass-card p-8 shadow-2xl border-t border-white/50 bg-white/95 relative overflow-hidden">
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary-500 via-accent-teal to-primary-500"></div>
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Access Dashboard</h3>
                                    <p className="text-gray-500 text-sm">Authorized personnel only.</p>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Work Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all font-medium text-gray-900"
                                            placeholder="security@company.com"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all font-medium text-gray-900"
                                            placeholder="••••••••••••"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full btn-primary py-3.5 text-base shadow-lg shadow-primary-500/25 mt-4 group"
                                    >
                                        <span className="group-hover:scale-105 inline-block transition-transform">Secure Login</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden lg:block">
                    <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    </div>
                </div>
            </section>

            {/* The Problem: Tailgating Visualization */}
            <section id="features" className="py-24 bg-white relative">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">The Invisible Threat</h2>
                        <p className="text-xl text-gray-500 max-w-3xl mx-auto">
                            Tailgating accounts for 70% of unauthorized access breaches in educational and corporate campuses. Standard keycards aren't enough.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Users className="w-7 h-7 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Unauthorized Entry</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Intruders slipping in behind authorized personnel without credentials, bypassing physical security layers.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <AlertTriangle className="w-7 h-7 text-amber-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Compliance Risks</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Failure to track actual occupancy versus badge swipes creates massive audit gaps and liability issues.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Eye className="w-7 h-7 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Security Blindspots</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Traditional CCTV is passive. It records incidents but doesn't prevent them in real-time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works with 3D-style cards */}
            <section id="how-it-works" className="py-24 bg-gray-900 relative overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                <div className="container mx-auto px-6 max-w-7xl relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1">
                            <h2 className="text-4xl font-bold text-white mb-6">Real-Time Computer Vision Pipeline</h2>
                            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                                Our proprietary AI works with your existing camera infrastructure to detect human forms, identify authorized badges, and flag discrepancies instantly.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center font-bold text-white mt-1">1</div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">Person Detection</h4>
                                        <p className="text-gray-400">YOLOv8 models track individual bounding boxes in the frame.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center font-bold text-white mt-1">2</div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">Entry Correlation</h4>
                                        <p className="text-gray-400">Matches visual entry events with access control log timestamps.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center font-bold text-white mt-1">3</div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">Instant Alerting</h4>
                                        <p className="text-gray-400">Triggers visual and audible alarms for security personnel intervention.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visual Representation */}
                        <div className="flex-1 relative">
                            <div className="aspect-square rounded-3xl bg-gradient-to-br from-gray-800 to-black border border-white/10 shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors"></div>
                                {/* Center Scanner Effect */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-primary-500 shadow-glow-teal animate-float opacity-50"></div>

                                <div className="grid grid-cols-2 gap-4 p-8 h-full">
                                    <div className="bg-white/5 rounded-2xl border border-white/5 p-4 animate-pulse-subtle">
                                        <div className="w-full h-32 bg-gray-700/50 rounded-lg mb-4"></div>
                                        <div className="h-2 w-20 bg-gray-700/50 rounded mb-2"></div>
                                        <div className="h-2 w-12 bg-primary-500/50 rounded"></div>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl border border-white/5 p-4 animate-pulse-subtle" style={{ animationDelay: '0.5s' }}>
                                        <div className="w-full h-32 bg-gray-700/50 rounded-lg mb-4"></div>
                                        <div className="h-2 w-20 bg-gray-700/50 rounded mb-2"></div>
                                        <div className="h-2 w-12 bg-status-danger/50 rounded"></div>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl border border-white/5 p-4 animate-pulse-subtle" style={{ animationDelay: '1s' }}>
                                        <div className="w-full h-32 bg-gray-700/50 rounded-lg mb-4"></div>
                                        <div className="h-2 w-20 bg-gray-700/50 rounded mb-2"></div>
                                        <div className="h-2 w-12 bg-status-success/50 rounded"></div>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl border border-white/5 p-4 animate-pulse-subtle" style={{ animationDelay: '1.5s' }}>
                                        <div className="w-full h-32 bg-gray-700/50 rounded-lg mb-4"></div>
                                        <div className="h-2 w-20 bg-gray-700/50 rounded mb-2"></div>
                                        <div className="h-2 w-12 bg-gray-700/50 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By Section (Social Proof) */}
            <section id="stats" className="py-20 bg-primary-50 border-t border-primary-100">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="p-6">
                            <h3 className="text-4xl font-bold text-primary-600 mb-2">99.9%</h3>
                            <p className="text-gray-600 font-medium">Detection Accuracy</p>
                        </div>
                        <div className="p-6">
                            <h3 className="text-4xl font-bold text-primary-600 mb-2">0.5s</h3>
                            <p className="text-gray-600 font-medium">Alert Latency</p>
                        </div>
                        <div className="p-6">
                            <h3 className="text-4xl font-bold text-primary-600 mb-2">24/7</h3>
                            <p className="text-gray-600 font-medium">Continuous Monitoring</p>
                        </div>
                        <div className="p-6">
                            <h3 className="text-4xl font-bold text-primary-600 mb-2">50+</h3>
                            <p className="text-gray-600 font-medium">Enterprise Deployments</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-white border-t border-gray-200">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-tr from-primary-600 to-accent-teal rounded-lg flex items-center justify-center">
                                <Shield className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-lg font-bold text-gray-900">SurakshaSetu</span>
                        </div>
                        <div className="text-gray-500 text-sm">
                            © 2024 SurakshaSetu AI. All rights reserved.
                        </div>
                        <div className="flex gap-6 text-sm font-medium text-gray-600">
                            <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-primary-600 transition-colors">Support</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
