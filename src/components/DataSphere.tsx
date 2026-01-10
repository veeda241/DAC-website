'use client';

import React, { useEffect, useRef, useMemo } from 'react';

const DataSphere: React.FC = () => {
    const sphereRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const sphere = sphereRef.current;
        if (!sphere) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = sphere.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const mouseX = (e.clientX - centerX) / 50;
            const mouseY = (e.clientY - centerY) / 50;

            sphere.style.transform = `rotateY(${mouseX}deg) rotateX(${-mouseY}deg)`;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Generate sphere particles with useMemo to prevent re-renders
    const particles = useMemo(() => {
        const count = 60;
        const result = [];
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;

            const x = Math.cos(theta) * Math.sin(phi);
            const y = Math.sin(theta) * Math.sin(phi);
            const z = Math.cos(phi);

            const scale = 130;
            const size = 2 + (i % 3);
            const colors = ['#818cf8', '#a78bfa', '#c084fc'];
            const color = colors[i % 3];

            result.push(
                <div
                    key={i}
                    className="absolute rounded-full animate-pulse"
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        left: '50%',
                        top: '50%',
                        transform: `translate3d(${x * scale}px, ${y * scale}px, ${z * scale}px)`,
                        background: `radial-gradient(circle, ${color}, transparent)`,
                        boxShadow: `0 0 ${size * 3}px ${color}`,
                        animationDelay: `${(i * 0.1) % 5}s`,
                        animationDuration: '3s',
                    }}
                />
            );
        }
        return result;
    }, []);

    // Generate orbital rings
    const rings = useMemo(() => {
        return [0, 60, 120].map((rotation, index) => (
            <div
                key={index}
                className="absolute inset-0 rounded-full border border-indigo-500/30"
                style={{
                    transform: `rotateX(70deg) rotateY(${rotation}deg)`,
                    animation: `spin ${20 + index * 5}s linear infinite ${index % 2 === 0 ? 'normal' : 'reverse'}`,
                }}
            >
                <div
                    className="absolute w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/60"
                    style={{
                        top: '0%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        animation: `orbit ${8 + index * 2}s linear infinite`,
                    }}
                />
            </div>
        ));
    }, []);

    // Data nodes
    const dataNodes = [
        { x: -100, y: -70, delay: 0, icon: '📊' },
        { x: 100, y: -50, delay: 1, icon: '📈' },
        { x: -75, y: 75, delay: 2, icon: '🔬' },
        { x: 85, y: 65, delay: 0.5, icon: '💡' },
        { x: 0, y: -110, delay: 1.5, icon: '🎯' },
    ];

    return (
        <div className="relative w-[350px] h-[350px] flex items-center justify-center">
            {/* Outer glow */}
            <div className="absolute inset-[-20px] rounded-full bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-pink-600/30 blur-3xl animate-pulse" />

            {/* Main sphere container */}
            <div
                ref={sphereRef}
                className="relative w-[300px] h-[300px] transition-transform duration-100 ease-out"
                style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1000px',
                }}
            >
                {/* Core glowing sphere */}
                <div
                    className="absolute inset-[70px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.5), rgba(139, 92, 246, 0.3), rgba(0, 0, 0, 0.9))',
                        boxShadow: 'inset 0 0 80px rgba(99, 102, 241, 0.6), 0 0 60px rgba(99, 102, 241, 0.4), 0 0 100px rgba(139, 92, 246, 0.2)',
                    }}
                >
                    <div className="absolute inset-3 rounded-full bg-gradient-to-br from-indigo-400/30 via-transparent to-transparent" />
                    <div className="absolute inset-6 rounded-full bg-gradient-to-tl from-purple-500/20 via-transparent to-transparent" />
                </div>

                {/* Rotating particle field */}
                <div
                    className="absolute inset-0 animate-rotateY"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {particles}
                </div>

                {/* Orbital rings */}
                <div
                    className="absolute inset-[-15px]"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {rings}
                </div>

                {/* Floating data nodes */}
                {dataNodes.map((node, i) => (
                    <div
                        key={i}
                        className="absolute flex items-center justify-center w-10 h-10 bg-slate-900/90 backdrop-blur-sm rounded-full border border-indigo-500/50 shadow-lg shadow-indigo-500/30 hover:scale-110 transition-transform cursor-pointer"
                        style={{
                            left: `calc(50% + ${node.x}px)`,
                            top: `calc(50% + ${node.y}px)`,
                            transform: 'translate(-50%, -50%)',
                            animation: `sphereFloat 3s ease-in-out infinite`,
                            animationDelay: `${node.delay}s`,
                        }}
                    >
                        <span className="text-lg">{node.icon}</span>
                    </div>
                ))}
            </div>

            {/* Connection lines SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(99, 102, 241, 0.6)" />
                        <stop offset="100%" stopColor="rgba(139, 92, 246, 0.1)" />
                    </linearGradient>
                </defs>
                <line x1="75" y1="105" x2="175" y2="175" stroke="url(#lineGrad)" strokeWidth="1" className="animate-pulse" />
                <line x1="275" y1="125" x2="225" y2="175" stroke="url(#lineGrad)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                <line x1="100" y1="250" x2="175" y2="175" stroke="url(#lineGrad)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '1s' }} />
                <line x1="260" y1="240" x2="225" y2="175" stroke="url(#lineGrad)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
                <line x1="175" y1="65" x2="175" y2="175" stroke="url(#lineGrad)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '2s' }} />
            </svg>

            {/* Ambient particles floating around */}
            <div className="absolute inset-[-30px] pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-indigo-400/60 rounded-full animate-float"
                        style={{
                            left: `${15 + (i * 12)}%`,
                            top: `${10 + ((i * 17) % 80)}%`,
                            animationDelay: `${i * 0.4}s`,
                            animationDuration: `${4 + (i % 3)}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default DataSphere;
