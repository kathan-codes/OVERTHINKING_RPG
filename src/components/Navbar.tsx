import React from 'react';
import { Volume2, VolumeX, Sparkles, RotateCcw, Eye } from 'lucide-react';
import { sound } from '../engine/sound';

interface NavbarProps {
  soundMuted: boolean;
  onToggleSound: () => void;
  onDemoMode: () => void;
  onReset: () => void;
  isGameActive: boolean;
  reducedMotion?: boolean;
  onToggleReducedMotion?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  soundMuted,
  onToggleSound,
  onDemoMode,
  onReset,
  isGameActive,
  reducedMotion = false,
  onToggleReducedMotion,
}) => {
  return (
    <header style={{
      borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
      background: 'rgba(10, 12, 18, 0.88)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1.25rem',
        flexWrap: 'wrap',
        gap: '0.65rem',
      }}>
        {/* Logo / Brand */}
        <div
          onClick={onReset}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>🧠</span>
          <div>
            <div className="font-rpg" style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              background: 'linear-gradient(to right, #fbbf24, #f59e0b, #ef4444)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              OVERTHINKING RPG
            </div>
            <div style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              Unnecessarily Epic Quests
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>


          {/* Quick Demo Mode */}
          <button
            onClick={() => {
              sound.playClick();
              onDemoMode();
            }}
            className="btn-secondary"
            title="Load legacy demo: Email My Professor"
            style={{
              padding: '0.45rem 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 600,
            }}
          >
            <Sparkles size={13} color="#38bdf8" />
            <span>DEMO</span>
          </button>

          {/* Reduced Motion Toggle */}
          {onToggleReducedMotion && (
            <button
              onClick={() => {
                sound.playClick();
                onToggleReducedMotion();
              }}
              className="btn-secondary"
              title={reducedMotion ? 'Enable UI Animations' : 'Reduce Motion (Accessibility)'}
              style={{
                padding: '0.45rem 0.65rem',
                fontSize: '0.78rem',
                color: reducedMotion ? '#a855f7' : undefined,
              }}
            >
              <Eye size={14} />
              <span>{reducedMotion ? 'Static' : 'Motion'}</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="btn-secondary"
            title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
            style={{
              padding: '0.45rem 0.65rem',
              color: soundMuted ? '#f87171' : '#34d399',
            }}
          >
            {soundMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Reset / Return to Home */}
          {isGameActive && (
            <button
              onClick={() => {
                sound.playClick();
                onReset();
              }}
              className="btn-secondary"
              title="Return to Home"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
            >
              <RotateCcw size={13} />
              <span>HOME</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
