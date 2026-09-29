import React from 'react';
import { AlertTriangle, Zap } from 'lucide-react';

interface OverthinkingMeterProps {
  percentage: number;
}

export const OverthinkingMeter: React.FC<OverthinkingMeterProps> = ({ percentage }) => {
  const isCritical = percentage >= 100;
  const clampedDisplay = Math.max(0, percentage);

  // Determine progress bar gradient based on percentage
  const getBarGradient = () => {
    if (percentage < 35) {
      return 'linear-gradient(90deg, #10b981, #34d399)';
    }
    if (percentage < 70) {
      return 'linear-gradient(90deg, #10b981, #f59e0b)';
    }
    if (percentage < 100) {
      return 'linear-gradient(90deg, #f59e0b, #ef4444)';
    }
    return 'linear-gradient(90deg, #ef4444, #ec4899, #a855f7)';
  };

  return (
    <div
      className={`rpg-card ${isCritical ? 'pulse-critical rpg-card-danger' : ''}`}
      style={{
        padding: '1.1rem 1.5rem',
        marginBottom: '1.5rem',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.6rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.25rem' }}>🧠</span>
          <span className="font-rpg" style={{
            fontSize: '1.15rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            color: isCritical ? '#f87171' : 'var(--text-gold)',
          }}>
            OVERTHINKING METER
          </span>
        </div>

        <div className="font-mono" style={{
          fontSize: '1.35rem',
          fontWeight: 800,
          color: isCritical ? '#f43f5e' : percentage > 65 ? '#fbbf24' : '#34d399',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
        }}>
          {isCritical && <Zap size={18} className="animate-bounce" color="#f43f5e" />}
          <span>{clampedDisplay}%</span>
        </div>
      </div>

      {/* Meter Bar Container */}
      <div style={{
        width: '100%',
        height: '16px',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderRadius: '9999px',
        border: isCritical ? '1px solid rgba(239, 68, 68, 0.8)' : '1px solid rgba(148, 163, 184, 0.25)',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.6)',
      }}>
        <div
          style={{
            height: '100%',
            width: `${Math.min(100, clampedDisplay)}%`,
            background: getBarGradient(),
            borderRadius: '9999px',
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease',
            boxShadow: isCritical ? '0 0 14px rgba(244, 63, 94, 0.8)' : 'none',
          }}
        />
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
              🚨 CRITICAL OVERTHINKING DETECTED 🚨
            </div>
            <div style={{
              color: '#fecaca',
              fontSize: '0.85rem',
              marginTop: '0.15rem',
            }}>
              You have successfully transformed a 30-second task into a psychological saga.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
