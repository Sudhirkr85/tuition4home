'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Check, Move } from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  onCropComplete: (croppedBase64: string) => void;
  onCancel: () => void;
  title?: string;
  circularMask?: boolean;
}

export default function ImageCropperModal({
  isOpen,
  imageSrc,
  onCropComplete,
  onCancel,
  title = 'Crop & Center Profile Photo',
  circularMask = true,
}: ImageCropperModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  // Transformations
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Drag state
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const lastOffsetRef = useRef({ x: 0, y: 0 });

  // Reset state on new image
  useEffect(() => {
    if (isOpen && imageSrc) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setImgElement(img);
        setZoom(1);
        setRotation(0);
        setOffset({ x: 0, y: 0 });
        lastOffsetRef.current = { x: 0, y: 0 };
      };
      img.src = imageSrc;
    }
  }, [isOpen, imageSrc]);

  // Handle Drag / Pan (Mouse)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    lastOffsetRef.current = { ...offset };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setOffset({
      x: lastOffsetRef.current.x + dx,
      y: lastOffsetRef.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Handle Drag / Pan (Touch for Mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      lastOffsetRef.current = { ...offset };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    setOffset({
      x: lastOffsetRef.current.x + dx,
      y: lastOffsetRef.current.y + dy,
    });
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Attach non-passive native wheel listener to allow smooth zoom while preventing page scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!isOpen || !container) return;

    const onWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * -0.002;
      setZoom((prev) => Math.min(Math.max(prev + delta, 0.8), 3.5));
    };

    container.addEventListener('wheel', onWheelNative, { passive: false });
    return () => {
      container.removeEventListener('wheel', onWheelNative);
    };
  }, [isOpen]);

  // Rotate by 90 degrees
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Generate Cropped Image on Canvas
  const handleSaveCrop = useCallback(() => {
    if (!imgElement || !containerRef.current) return;

    const CROP_SIZE = 500; // High-res 500x500 avatar export
    const canvas = document.createElement('canvas');
    canvas.width = CROP_SIZE;
    canvas.height = CROP_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cropBox = containerRef.current.getBoundingClientRect();
    const viewportSize = Math.min(cropBox.width, cropBox.height);

    ctx.save();
    // Center canvas coordinate system
    ctx.translate(CROP_SIZE / 2, CROP_SIZE / 2);

    // Scaling ratio from UI viewport size to export canvas size
    const scaleFactor = CROP_SIZE / viewportSize;

    // Apply User Offsets & Zoom
    ctx.translate(offset.x * scaleFactor, offset.y * scaleFactor);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom * scaleFactor, zoom * scaleFactor);

    // Compute base draw size keeping natural image aspect ratio
    const imgAspect = imgElement.width / imgElement.height;
    let baseW = viewportSize;
    let baseH = viewportSize;
    if (imgAspect > 1) {
      baseW = viewportSize * imgAspect;
      baseH = viewportSize;
    } else {
      baseW = viewportSize;
      baseH = viewportSize / imgAspect;
    }

    ctx.drawImage(imgElement, -baseW / 2, -baseH / 2, baseW, baseH);
    ctx.restore();

    const croppedBase64 = canvas.toDataURL('image/jpeg', 0.9);
    onCropComplete(croppedBase64);
  }, [imgElement, offset, rotation, zoom, onCropComplete]);

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(15, 23, 42, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '460px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.2s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.1rem 1.4rem',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
              {title}
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: '#64748B' }}>
              Drag to center your face inside the circle
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Interactive Crop Viewport */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: '#0F172A',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            userSelect: 'none',
            touchAction: 'none',
          }}
        >
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              width: '280px',
              height: '280px',
              position: 'relative',
              borderRadius: circularMask ? '50%' : '16px',
              overflow: 'hidden',
              boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.75), 0 0 0 3px #10B981',
              cursor: isDraggingRef.current ? 'grabbing' : 'grab',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#000000',
            }}
          >
            {imgElement && (
              <img
                src={imgElement.src}
                alt="Crop preview"
                draggable={false}
                style={{
                  position: 'absolute',
                  maxWidth: 'none',
                  maxHeight: 'none',
                  transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom})`,
                  transformOrigin: 'center center',
                  pointerEvents: 'none',
                  transition: isDraggingRef.current ? 'none' : 'transform 0.05s ease-out',
                }}
              />
            )}

            {/* Center Crosshair Hint */}
            <div
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                opacity: 0.3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Move size={32} color="#FFFFFF" />
            </div>
          </div>

          <div
            style={{
              marginTop: '0.9rem',
              color: '#94A3B8',
              fontSize: '0.74rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span>💡 Pinch/Scroll to zoom • Drag photo to align face</span>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div style={{ padding: '1.25rem 1.4rem', backgroundColor: '#F8FAFC' }}>
          {/* Zoom Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(z - 0.2, 0.8))}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#334155',
              }}
              title="Zoom out"
            >
              <ZoomOut size={16} />
            </button>

            <input
              type="range"
              min="0.8"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              style={{
                flex: 1,
                accentColor: '#0F6E56',
                cursor: 'pointer',
                height: '6px',
              }}
            />

            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(z + 0.2, 3.5))}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#334155',
              }}
              title="Zoom in"
            >
              <ZoomIn size={16} />
            </button>

            <button
              type="button"
              onClick={handleRotate}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '0 0.65rem',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#334155',
              }}
              title="Rotate 90 degrees"
            >
              <RotateCw size={14} />
              <span>Rotate</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 700,
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveCrop}
              className="btn btn-primary"
              style={{
                flex: 1.5,
                padding: '0.75rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 800,
                backgroundColor: '#0F6E56',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
              }}
            >
              <Check size={18} />
              <span>Crop & Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
