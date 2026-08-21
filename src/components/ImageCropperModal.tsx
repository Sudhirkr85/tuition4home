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

  // Compute image base dimensions inside the viewport for 1:1 crop alignment
  const getImageDisplaySize = () => {
    if (!imgElement) return { width: 280, height: 280 };
    const naturalWidth = imgElement.naturalWidth || imgElement.width || 280;
    const naturalHeight = imgElement.naturalHeight || imgElement.height || 280;
    const aspect = naturalWidth / naturalHeight;
    const VIEWPORT_SIZE = 280;

    let width = VIEWPORT_SIZE;
    let height = VIEWPORT_SIZE;

    // Cover mode: fill viewport completely by default (like Instagram/WhatsApp avatar crop)
    if (aspect >= 1) {
      height = VIEWPORT_SIZE;
      width = VIEWPORT_SIZE * aspect;
    } else {
      width = VIEWPORT_SIZE;
      height = VIEWPORT_SIZE / aspect;
    }

    return { width, height };
  };

  // Generate Cropped Image on Canvas (100% 1:1 Match with Viewport)
  const handleSaveCrop = useCallback(() => {
    if (!imgElement || !containerRef.current) return;

    const CROP_SIZE = 500; // High-res 500x500 avatar export
    const VIEWPORT_SIZE = containerRef.current.clientWidth || 280;
    const scaleFactor = CROP_SIZE / VIEWPORT_SIZE;

    const canvas = document.createElement('canvas');
    canvas.width = CROP_SIZE;
    canvas.height = CROP_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const naturalWidth = imgElement.naturalWidth || imgElement.width || 280;
    const naturalHeight = imgElement.naturalHeight || imgElement.height || 280;
    const aspect = naturalWidth / naturalHeight;

    let baseW = VIEWPORT_SIZE;
    let baseH = VIEWPORT_SIZE;
    if (aspect >= 1) {
      baseH = VIEWPORT_SIZE;
      baseW = VIEWPORT_SIZE * aspect;
    } else {
      baseW = VIEWPORT_SIZE;
      baseH = VIEWPORT_SIZE / aspect;
    }

    const canvasDrawW = baseW * scaleFactor;
    const canvasDrawH = baseH * scaleFactor;

    // Clean white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, CROP_SIZE, CROP_SIZE);

    ctx.save();
    // Center canvas coordinate system
    ctx.translate(CROP_SIZE / 2, CROP_SIZE / 2);

    // Apply User Offsets (scaled) & Rotation & Zoom
    ctx.translate(offset.x * scaleFactor, offset.y * scaleFactor);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    ctx.drawImage(imgElement, -canvasDrawW / 2, -canvasDrawH / 2, canvasDrawW, canvasDrawH);
    ctx.restore();

    const croppedBase64 = canvas.toDataURL('image/jpeg', 0.92);
    onCropComplete(croppedBase64);
  }, [imgElement, offset, rotation, zoom, onCropComplete]);

  if (!isOpen || !imageSrc) return null;

  const { width: displayBaseW, height: displayBaseH } = getImageDisplaySize();

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
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.2s ease-out',
          position: 'relative',
          zIndex: 100000,
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
            backgroundColor: '#FFFFFF',
            position: 'relative',
            zIndex: 20,
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
            backgroundColor: '#0B1120',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 10,
            overflow: 'hidden', // PREVENTS 9999px SHADOW BLEEDING ON BUTTONS
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
              boxShadow: '0 0 0 9999px rgba(11, 17, 32, 0.82), 0 0 0 3px #10B981',
              cursor: isDraggingRef.current ? 'grabbing' : 'grab',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1E293B',
            }}
          >
            {imgElement && (
              <img
                src={imgElement.src}
                alt="Crop preview"
                draggable={false}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: `${displayBaseW}px`,
                  height: `${displayBaseH}px`,
                  maxWidth: 'none',
                  maxHeight: 'none',
                  transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom})`,
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
        <div
          style={{
            padding: '1.25rem 1.4rem',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E2E8F0',
            position: 'relative',
            zIndex: 20,
          }}
        >
          {/* Zoom Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(z - 0.2, 0.8))}
              style={{
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                width: '36px',
                height: '36px',
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
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                width: '36px',
                height: '36px',
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
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '0 0.75rem',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                fontSize: '0.8rem',
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
                padding: '0.8rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: '#F1F5F9',
                color: '#334155',
                border: '1px solid #CBD5E1',
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
                padding: '0.8rem',
                borderRadius: '12px',
                fontSize: '0.92rem',
                fontWeight: 800,
                backgroundColor: '#0F6E56',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(15, 110, 86, 0.28)',
              }}
            >
              <Check size={18} />
              <span>Crop &amp; Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
