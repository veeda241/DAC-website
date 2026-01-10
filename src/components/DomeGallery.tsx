import React, { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import './DomeGallery.css';

interface ImageItem {
    src: string;
    alt?: string;
}

interface DomeGalleryProps {
    images?: ImageItem[];
    overlayBlurColor?: string;
    segments?: number;
    grayscale?: boolean;
    imageBorderRadius?: string;
}

const DEFAULTS = {
    maxVerticalRotationDeg: 5,
    dragSensitivity: 20,
    segments: 35
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const wrapAngleSigned = (deg: number) => {
    const a = (((deg + 180) % 360) + 360) % 360;
    return a - 180;
};

function buildItems(pool: ImageItem[], seg: number) {
    const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
    const evenYs = [-4, -2, 0, 2, 4];
    const oddYs = [-3, -1, 1, 3, 5];

    const coords = xCols.flatMap((x, c) => {
        const ys = c % 2 === 0 ? evenYs : oddYs;
        return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
    });

    const totalSlots = coords.length;
    if (pool.length === 0) {
        return coords.map(c => ({ ...c, src: '', alt: '' }));
    }

    const normalizedImages = pool.map(image => ({
        src: image.src || '',
        alt: image.alt || ''
    }));

    const usedImages = Array.from({ length: totalSlots }, (_, i) =>
        normalizedImages[i % normalizedImages.length]
    );

    return coords.map((c, i) => ({
        ...c,
        src: usedImages[i].src,
        alt: usedImages[i].alt
    }));
}

export default function DomeGallery({
    images = [],
    overlayBlurColor = '#020617',
    segments = DEFAULTS.segments,
    grayscale = false,
    imageBorderRadius = '12px'
}: DomeGalleryProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLDivElement>(null);
    const sphereRef = useRef<HTMLDivElement>(null);

    const rotationRef = useRef({ x: 0, y: 0 });
    const draggingRef = useRef(false);
    const startPosRef = useRef<{ x: number; y: number } | null>(null);
    const startRotRef = useRef({ x: 0, y: 0 });
    const velocityRef = useRef({ x: 0, y: 0 });
    const animationRef = useRef<number | null>(null);

    const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

    const items = useMemo(() => buildItems(images, segments), [images, segments]);

    const applyTransform = useCallback((xDeg: number, yDeg: number) => {
        const el = sphereRef.current;
        if (el) {
            el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
        }
    }, []);

    // Auto-rotate animation
    useEffect(() => {
        let animId: number;
        const animate = () => {
            if (!draggingRef.current) {
                rotationRef.current.y = wrapAngleSigned(rotationRef.current.y + 0.1);
                applyTransform(rotationRef.current.x, rotationRef.current.y);
            }
            animId = requestAnimationFrame(animate);
        };
        animId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animId);
    }, [applyTransform]);

    // Resize observer
    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        const ro = new ResizeObserver(entries => {
            const cr = entries[0].contentRect;
            const w = Math.max(1, cr.width);
            const h = Math.max(1, cr.height);
            const minDim = Math.min(w, h);

            let radius = minDim * 0.8;
            radius = clamp(radius, 300, 800);

            root.style.setProperty('--radius', `${Math.round(radius)}px`);
            root.style.setProperty('--overlay-blur-color', overlayBlurColor);
            root.style.setProperty('--tile-radius', imageBorderRadius);
            root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none');
        });

        ro.observe(root);
        return () => ro.disconnect();
    }, [overlayBlurColor, grayscale, imageBorderRadius]);

    // Drag handlers
    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        draggingRef.current = true;
        startPosRef.current = { x: e.clientX, y: e.clientY };
        startRotRef.current = { ...rotationRef.current };
        velocityRef.current = { x: 0, y: 0 };
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
    }, []);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!draggingRef.current || !startPosRef.current) return;

        const dx = e.clientX - startPosRef.current.x;
        const dy = e.clientY - startPosRef.current.y;

        const nextX = clamp(
            startRotRef.current.x - dy / DEFAULTS.dragSensitivity,
            -DEFAULTS.maxVerticalRotationDeg,
            DEFAULTS.maxVerticalRotationDeg
        );
        const nextY = wrapAngleSigned(startRotRef.current.y + dx / DEFAULTS.dragSensitivity);

        velocityRef.current = {
            x: (nextY - rotationRef.current.y) * 0.5,
            y: (nextX - rotationRef.current.x) * 0.5
        };

        rotationRef.current = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);
    }, [applyTransform]);

    const handlePointerUp = useCallback(() => {
        draggingRef.current = false;
        startPosRef.current = null;

        // Apply inertia
        const inertia = () => {
            if (draggingRef.current) return;

            velocityRef.current.x *= 0.95;
            velocityRef.current.y *= 0.95;

            if (Math.abs(velocityRef.current.x) > 0.01 || Math.abs(velocityRef.current.y) > 0.01) {
                rotationRef.current.y = wrapAngleSigned(rotationRef.current.y + velocityRef.current.x);
                rotationRef.current.x = clamp(
                    rotationRef.current.x + velocityRef.current.y,
                    -DEFAULTS.maxVerticalRotationDeg,
                    DEFAULTS.maxVerticalRotationDeg
                );
                applyTransform(rotationRef.current.x, rotationRef.current.y);
                animationRef.current = requestAnimationFrame(inertia);
            }
        };
        animationRef.current = requestAnimationFrame(inertia);
    }, [applyTransform]);

    const handleImageClick = useCallback((item: { src: string; alt: string }) => {
        if (!draggingRef.current) {
            setSelectedImage(item);
        }
    }, []);

    return (
        <div
            ref={rootRef}
            className="dome-gallery-root"
            style={{
                '--segments-x': segments,
                '--segments-y': segments,
                '--overlay-blur-color': overlayBlurColor,
                '--tile-radius': imageBorderRadius,
                '--image-filter': grayscale ? 'grayscale(1)' : 'none'
            } as React.CSSProperties}
        >
            <main
                ref={mainRef}
                className="dome-gallery-main"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                <div className="dome-stage">
                    <div ref={sphereRef} className="dome-sphere">
                        {items.map((it, i) => (
                            <div
                                key={`${it.x},${it.y},${i}`}
                                className="dome-item"
                                style={{
                                    '--offset-x': it.x,
                                    '--offset-y': it.y,
                                    '--item-size-x': it.sizeX,
                                    '--item-size-y': it.sizeY
                                } as React.CSSProperties}
                            >
                                <div
                                    className="dome-item__image"
                                    onClick={() => handleImageClick(it)}
                                >
                                    {it.src && <img src={it.src} draggable={false} alt={it.alt} />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dome-overlay" />
                <div className="dome-overlay dome-overlay--blur" />
                <div className="dome-edge-fade dome-edge-fade--top" />
                <div className="dome-edge-fade dome-edge-fade--bottom" />
            </main>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div className="dome-lightbox" onClick={() => setSelectedImage(null)}>
                    <div className="dome-lightbox__content" onClick={e => e.stopPropagation()}>
                        <button className="dome-lightbox__close" onClick={() => setSelectedImage(null)}>×</button>
                        <img src={selectedImage.src} alt={selectedImage.alt} />
                        {selectedImage.alt && <p className="dome-lightbox__caption">{selectedImage.alt}</p>}
                    </div>
                </div>
            )}
        </div>
    );
}
