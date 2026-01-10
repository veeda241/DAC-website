import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stage, Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { MASCOT_URL } from '../constants';

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

    // Fallback to 2D image if 3D fails
    if (hasError) {
        return (
            <div className="relative w-full h-[500px] md:h-[700px] flex items-center justify-center group">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-purple-500/10 to-cyan-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="relative z-10 animate-mascot-float">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-6 py-3 rounded-2xl text-sm font-black shadow-2xl border-2 border-indigo-50 whitespace-nowrap">
                        Hi! I'm your Data Assistant 🤖
                        <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r-2 border-b-2 border-indigo-50/10"></div>
                    </div>
                    <img src={MASCOT_URL} alt="DAC Mascot" className="w-80 h-80 md:w-[450px] md:h-[450px] object-contain drop-shadow-[0_20px_50px_rgba(79,70,229,0.4)]" />
                </div>
            </div>
        );
    }

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative w-full h-[500px] md:h-[700px] cursor-grab active:cursor-grabbing group"
        >
            <div className={`absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-cyan-500/10 rounded-full blur-[100px] transition-all duration-1000 ${isHovered ? 'opacity-60 scale-110' : 'opacity-30'}`}></div>

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
                        <meshStandardMaterial color="indigo" wireframe />
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
                <div className="glass-card px-6 py-3 rounded-2xl text-xs font-bold text-white flex items-center gap-3 border-indigo-500/30 backdrop-blur-md">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-ping"></span>
                    Drag to rotate
                </div>
            </div>
        </div>
    );
};

export default ThreeDMascot;
