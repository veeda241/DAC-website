
import React, { useEffect } from 'react';
import gsap from 'gsap';
// We import the video to ensure bundler picks it up. 
// If TypeScript complains, we can declare a module or use require, or just ignore.
// @ts-ignore
import loadingVideo from '../assets/video/loading-screen.mp4';

interface LoadingScreenProps {
    onFinished: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinished }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Safety timeout in case video doesn't load or play
    useEffect(() => {
        const timer = setTimeout(() => {
            handleVideoEnd();
        }, 11000); // Increased slightly to account for fade
        return () => clearTimeout(timer);
    }, []);

    const handleVideoEnd = () => {
        if (containerRef.current) {
            gsap.to(containerRef.current, {
                opacity: 0,
                duration: 1,
                ease: "power2.inOut",
                onComplete: () => {
                    onFinished();
                }
            });
        } else {
            onFinished();
        }
    };

    return (
        <div ref={containerRef} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
        }}>
            <video
                src={loadingVideo}
                autoPlay
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onEnded={handleVideoEnd}
                onError={(e) => {
                    console.error("Video failed to load", e);
                    handleVideoEnd();
                }}
            />
        </div>
    );
};

export default LoadingScreen;
