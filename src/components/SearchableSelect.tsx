'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

interface SearchableSelectProps {
  label?: string;
  placeholder?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function SearchableSelect({
  label,
  placeholder = 'Type or select...',
  options,
  value,
  onChange,
  required = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options dynamically based on current typed value
  const q = (value || '').toLowerCase().trim();
  const filteredOptions = options.filter((opt) => {
    if (!q) return true;
    const optLower = opt.toLowerCase();
    if (optLower.includes(q)) return true;
    const words = q.split(/\s+/).filter(Boolean);
    if (words.length > 1 && words.every((w) => optLower.includes(w))) return true;
    if ((q === 'bord' || q === 'brd') && optLower.includes('board')) return true;
    if ((q === 'math' || q === 'maths') && optLower.includes('mathematics')) return true;
    if (q === 'sci' && optLower.includes('science')) return true;
    if (q === 'phy' && optLower.includes('physics')) return true;
    if (q === 'chem' && optLower.includes('chemistry')) return true;
    if (q === 'bio' && optLower.includes('biology')) return true;
    if (q === 'eco' && optLower.includes('economics')) return true;
    if (q === 'eng' && optLower.includes('english')) return true;
    if (q === 'comp' && optLower.includes('computer')) return true;
    return false;
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions.length > 0 && isOpen) {
        handleSelect(filteredOptions[0]);
      } else {
        setIsOpen(false);
      }
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {label && (
        <label className="form-label" style={{ fontWeight: 700, marginBottom: '0.45rem', display: 'block', fontSize: '0.78rem', color: '#515154', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label} {required && <span style={{ color: '#DC2626' }}>*</span>}
        </label>
      )}

      {/* Main Input Box */}
      <div
        style={{
          border: isOpen ? '2px solid #0F6E56' : '1.5px solid var(--border-hairline, #CBD5E1)',
          borderRadius: '12px',
          padding: '0.65rem 0.85rem',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          minHeight: '48px',
          transition: 'all 0.18s ease',
          boxShadow: isOpen ? '0 0 0 3px rgba(15, 110, 86, 0.12)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
          <Search size={16} color={value ? '#0F6E56' : '#94A3B8'} style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '0.92rem',
              fontWeight: 600,
              color: '#0F172A',
              padding: 0,
              backgroundColor: 'transparent',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
          {value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
                setIsOpen(true);
                inputRef.current?.focus();
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '2px', display: 'flex', alignItems: 'center' }}
            >
              <X size={14} />
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '2px', display: 'flex', alignItems: 'center' }}
          >
            <ChevronDown
              size={16}
              color={isOpen ? '#0F6E56' : '#94A3B8'}
              style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            />
          </button>
        </div>
      </div>

      {/* Dropdown Suggestions (Only shown when suggestions exist) */}
      {isOpen && filteredOptions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.14)',
            border: '1.5px solid #E2E8F0',
            zIndex: 1000,
            maxHeight: '220px',
            overflowY: 'auto',
            padding: '0.35rem',
          }}
        >
          {filteredOptions.map((option, idx) => {
            const isSelected = option.toLowerCase() === (value || '').toLowerCase();
            return (
              <div
                key={idx}
                onClick={() => handleSelect(option)}
                style={{
                  padding: '0.6rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.86rem',
                  fontWeight: isSelected ? 800 : 600,
                  color: isSelected ? '#0F6E56' : '#334155',
                  backgroundColor: isSelected ? '#F0FDF4' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'background 0.12s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>{option}</span>
                {isSelected && <Check size={14} color="#0F6E56" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
