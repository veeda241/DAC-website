import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stage, Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { MASCOT_URL } from '../constants';
import ModelViewer from './ModelViewer';
import { useTheme } from '../contexts/ThemeContext';

// Toggle this to switch between implementations
const USE_MODEL_VIEWER = true;

const Model = ({ url }: { url: string }) => {
    const { scene } = useGLTF(url);
    const modelRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (modelRef.current) {
            // Mouse-following behavior - the owl tracks your cursor!
            const targetX = (state.mouse.x * Math.PI) / 6;
            const targetY = (state.mouse.y * Math.PI) / 6;

            // Smooth damping for natural movement
            modelRef.current.rotation.y += (targetX - modelRef.current.rotation.y) * 0.05;
            modelRef.current.rotation.x += (targetY - modelRef.current.rotation.x) * 0.05;

            // Gentle floating animation
            modelRef.current.position.y = -0.5 + Math.sin(state.clock.elapsedTime) * 0.05;
        }
    });

    return <primitive object={scene} ref={modelRef} scale={1.8} position={[0, -0.5, 0]} />;
};

const ThreeDMascot = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [hasError, setHasError] = useState(false);
    const { isDark } = useTheme();

    // Fallback to 2D image if 3D fails
    if (hasError) {
        return (
            <div className="relative w-full h-[500px] md:h-[700px] flex items-center justify-center group">
                <div className={`absolute inset-0 rounded-full blur-[100px] animate-pulse-slow ${isDark ? 'bg-gradient-to-tr from-purple-600/20 via-slate-500/10 to-indigo-900/20' : 'bg-gradient-to-tr from-purple-500/10 via-slate-500/5 to-indigo-500/10'}`}></div>
                <div className="relative z-10 animate-mascot-float">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-6 py-3 rounded-2xl text-sm font-black shadow-2xl border-2 border-purple-50 whitespace-nowrap">
                        Hi! I'm your Data Assistant 🤖
                        <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r-2 border-b-2 border-purple-50/10"></div>
                    </div>
                    <img src={MASCOT_URL} alt="DAC Mascot" className="w-80 h-80 md:w-[450px] md:h-[450px] object-contain drop-shadow-[0_20px_50px_rgba(168,85,247,0.4)]" />
                </div>
            </div>
        );
    }

    // New ModelViewer Implementation
    if (USE_MODEL_VIEWER) {
        return (
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative w-full aspect-square md:aspect-auto md:h-[650px] flex items-center justify-center group pointer-events-none"
            >
                {/* Animated background glow */}
                <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-[120px] transition-all duration-1000 pointer-events-none ${isHovered ? 'scale-110' : ''} ${isHovered ? (isDark ? 'opacity-40' : 'opacity-30') : (isDark ? 'opacity-20' : 'opacity-15')} ${isDark ? 'bg-gradient-to-tr from-purple-500/20 via-slate-500/10 to-indigo-900/20' : 'bg-gradient-to-tr from-purple-300/20 via-slate-400/10 to-indigo-300/20'}`}></div>

                {/* ModelViewer Component - Fixed size configuration */}
                <div className="relative z-10 w-full h-full max-w-[500px] max-h-[550px] pointer-events-auto">
                    <ModelViewer
                        url="/owl.glb"
                        width={undefined as any}
                        height={undefined as any}
                        defaultRotationX={0}
                        defaultRotationY={0}
                        defaultZoom={1.45}
                        minZoomDistance={1.45}
                        maxZoomDistance={1.45}
                        enableMouseParallax={true}
                        enableManualRotation={true}
                        enableHoverRotation={false}
                        enableManualZoom={false}
                        ambientIntensity={0.6}
                        keyLightIntensity={1.5}
                        fillLightIntensity={0.8}
                        rimLightIntensity={1.0}
                        environmentPreset="city"
                        autoFrame={false}
                        showScreenshotButton={false}
                        fadeIn={true}
                        autoRotate={false}
                        autoRotateSpeed={0}
                    />
                </div>

                {/* Hover instruction */}
                <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <div className="glass-card px-6 py-3 rounded-2xl text-xs font-bold text-white flex items-center gap-3 border-purple-500/30 backdrop-blur-md bg-slate-900/50 border">
                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>
                        Drag to interact
                    </div>
                </div>
            </div>
        );
    }

    // Original Canvas Implementation
    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative w-full h-[500px] md:h-[700px] cursor-grab active:cursor-grabbing group"
        >
            <div className={`absolute inset-0 rounded-full blur-[100px] transition-all duration-1000 ${isHovered ? 'scale-110' : ''} ${isHovered ? (isDark ? 'opacity-60' : 'opacity-40') : (isDark ? 'opacity-30' : 'opacity-20')} ${isDark ? 'bg-gradient-to-tr from-purple-500/10 via-slate-500/5 to-indigo-900/10' : 'bg-gradient-to-tr from-purple-500/10 via-slate-500/5 to-indigo-500/10'}`}></div>

            <Canvas
                shadows
                dpr={[1, 2]}
                camera={{ position: [0, 0, 4], fov: 45 }}
                className="w-full h-full"
                onError={(err) => {
                    console.error("3D Canvas Error:", err);
                    setHasError(true);
                }}
            >
                <React.Suspense fallback={
                    <mesh>
                        <sphereGeometry args={[1, 32, 32]} />
                        <meshStandardMaterial color="purple" wireframe />
                    </mesh>
                }>
                    <Stage environment="city" intensity={0.5} adjustCamera={false}>
                        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                            <Model url="/owl.glb" />
                        </Float>
                    </Stage>
                    <ContactShadows opacity={0.4} scale={10} blur={2.4} far={1.5} resolution={256} color="#000000" />
                    <Environment preset="night" />
                </React.Suspense>
                <OrbitControls
                    enableZoom={false}
                    autoRotate={!isHovered}
                    autoRotateSpeed={2}
                    makeDefault
                    minPolarAngle={Math.PI / 2.5}
                    maxPolarAngle={Math.PI / 1.5}
                />
            </Canvas>

            <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <div className="glass-card px-6 py-3 rounded-2xl text-xs font-bold text-white flex items-center gap-3 border-purple-500/30 backdrop-blur-md bg-slate-900/50 border">
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></span>
                    Drag to rotate
                </div>
            </div>
        </div>
    );
};

export default ThreeDMascot;

