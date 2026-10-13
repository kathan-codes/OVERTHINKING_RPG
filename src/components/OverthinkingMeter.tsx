import React from 'react';
import type { StatBlock } from '../types/game';
import { AlertTriangle, Zap, Shield, Flame, Clock } from 'lucide-react';

interface OverthinkingMeterProps {
  percentage: number;
  stats?: StatBlock;
}

export const OverthinkingMeter: React.FC<OverthinkingMeterProps> = ({ percentage, stats }) => {
  const overthinking = stats ? stats.overthinking : percentage;
  const doom = stats ? stats.doom : Math.min(100, Math.round(percentage * 0.7));
  const resolve = stats ? stats.resolve : Math.max(5, 50 - Math.round(percentage * 0.3));
  const timeLost = stats ? stats.timeLostMinutes : Math.round(percentage * 0.4);

  const isCritical = overthinking >= 100;
  const isHighDoom = doom >= 60;

  // Determine progress bar gradient based on percentage
  const getBarGradient = () => {
    if (overthinking < 35) {
      return 'linear-gradient(90deg, #10b981, #34d399)';
    }
    if (overthinking < 70) {
      return 'linear-gradient(90deg, #10b981, #f59e0b)';
    }
    if (overthinking < 100) {
      return 'linear-gradient(90deg, #f59e0b, #ef4444)';
    }
    return 'linear-gradient(90deg, #ef4444, #ec4899, #a855f7)';
  };

  return (
    <div
      className={`rpg-card ${isCritical ? 'pulse-critical rpg-card-danger' : ''}`}
      style={{
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        transition: 'all 0.3s ease',
        borderColor: isCritical ? 'rgba(239, 68, 68, 0.7)' : isHighDoom ? 'rgba(244, 63, 94, 0.5)' : undefined,
      }}
    >
      {/* Primary Overthinking Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.6rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.35rem' }}>🧠</span>
          <div>
            <span className="font-rpg" style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              color: isCritical ? '#f87171' : 'var(--text-gold)',
            }}>
              OVERTHINKING METER
            </span>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1 }}>
              {overthinking >= 100
                ? 'Astral plane detachment reached'
                : overthinking >= 60
                ? 'Hypothetical disaster cascade active'
                : 'Manageable academic reluctance'}
            </div>
          </div>
        </div>

        <div className="font-mono" style={{
          fontSize: '1.4rem',
          fontWeight: 800,
          color: isCritical ? '#f43f5e' : overthinking > 65 ? '#fbbf24' : '#34d399',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
        }}>
          {isCritical && <Zap size={18} className="animate-bounce" color="#f43f5e" />}
          <span>{Math.round(overthinking)}%</span>
        </div>
      </div>

      {/* Main Meter Bar Container */}
      <div style={{
        width: '100%',
        height: '14px',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderRadius: '9999px',
        border: isCritical ? '1px solid rgba(239, 68, 68, 0.8)' : '1px solid rgba(148, 163, 184, 0.25)',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.6)',
        marginBottom: '1rem',
      }}>
        <div
          style={{
            height: '100%',
            width: `${Math.min(100, overthinking)}%`,
            background: getBarGradient(),
            borderRadius: '9999px',
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease',
            boxShadow: isCritical ? '0 0 14px rgba(244, 63, 94, 0.8)' : 'none',
          }}
        />
      </div>

      {/* Secondary RPG Stats Ticker: Doom, Resolve, Time Lost */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '0.75rem',
        paddingTop: '0.65rem',
        borderTop: '1px solid rgba(148, 163, 184, 0.15)',
      }}>
        {/* Doom Stat */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '8px',
          padding: '0.5rem 0.75rem',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Flame size={15} color="#ef4444" />
            <span style={{ fontSize: '0.78rem', color: '#fca5a5', fontWeight: 700 }}>DOOM</span>
          </div>
          <span className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f87171' }}>
            {Math.round(doom)}%
          </span>
        </div>

        {/* Resolve Stat */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '8px',
          padding: '0.5rem 0.75rem',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Shield size={15} color="#38bdf8" />
            <span style={{ fontSize: '0.78rem', color: '#bae6fd', fontWeight: 700 }}>RESOLVE</span>
          </div>
          <span className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38bdf8' }}>
            {Math.round(resolve)}%
          </span>
        </div>

        {/* Time Lost Stat */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '8px',
          padding: '0.5rem 0.75rem',
          border: '1px solid rgba(234, 179, 8, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={15} color="#facc15" />
            <span style={{ fontSize: '0.78rem', color: '#fef08a', fontWeight: 700 }}>TIME LOST</span>
          </div>
          <span className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#facc15' }}>
            {Math.round(timeLost)}m
          </span>
        </div>
      </div>

      {/* Critical State Banner */}
      {isCritical && (
        <div style={{
          marginTop: '0.85rem',
          padding: '0.65rem 0.9rem',
          borderRadius: '8px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.6rem',
        }}>
          <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div className="font-rpg" style={{
              color: '#fca5a5',
              fontWeight: 800,
              fontSize: '0.9rem',
              letterSpacing: '0.04em',
            }}>
              🚨 CRITICAL OVERTHINKING CASCADE 🚨
            </div>
            <div style={{
              color: '#fecaca',
              fontSize: '0.82rem',
              marginTop: '0.15rem',
            }}>
              You have transformed a mundane academic chapter into a multi-generational spiritual trial.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
