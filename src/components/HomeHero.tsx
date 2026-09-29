import React, { useState, useEffect } from 'react';
import { Sword, AlertCircle, Sparkles } from 'lucide-react';
import { sound } from '../engine/sound';

interface HomeHeroProps {
  onStartQuest: (problem: string) => void;
  initialValue?: string;
}

const PLACEHOLDERS = [
  'I need to email my professor...',
  'I should start studying...',
  'I need to reply to someone...',
  'I have to clean my room...',
  'I need to call someone...',
  'I should probably go to sleep...',
  'I have an assignment due tomorrow...',
];

const PRESET_EXAMPLES = [
  'I need to email my professor.',
  'I should start studying.',
  'I need to reply to a message.',
  'I have an assignment due tomorrow.',
  'I need to clean my room.',
];

export const HomeHero: React.FC<HomeHeroProps> = ({ onStartQuest, initialValue = '' }) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [errorMsg, setErrorMsg] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Rotate placeholder every 3 seconds if input is empty
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (initialValue) {
      setInputValue(initialValue);
    }
  }, [initialValue]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setErrorMsg('Your quest cannot begin without a problem.');
      sound.playMeterUp();
      return;
    }
    setErrorMsg('');
    sound.playQuestStart();
    onStartQuest(trimmed);
  };

  const handleSelectExample = (text: string) => {
    sound.playClick();
    setInputValue(text);
    setErrorMsg('');
  };

  return (
    <div style={{
      padding: '3rem 0 4rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    }}>
      {/* Small top banner */}
      <div className="rpg-badge badge-gold" style={{ marginBottom: '1.25rem' }}>
        <Sparkles size={13} />
        <span>CONTEST PROTOTYPE EDITION</span>
      </div>

      {/* Main Title */}
      <h1 className="font-rpg" style={{
        fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
        fontWeight: 900,
        lineHeight: 1.1,
        marginBottom: '0.85rem',
        textShadow: '0 2px 20px rgba(245, 158, 11, 0.3)',
      }}>
        🧠 OVERTHINKING RPG
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: 'clamp(1.15rem, 2.5vw, 1.45rem)',
        color: '#f8fafc',
        fontWeight: 600,
        maxWidth: '650px',
        margin: '0 auto 0.6rem',
        letterSpacing: '0.01em',
      }}>
        Turn a tiny problem into an unnecessarily epic quest.
      </p>

      {/* Supporting text */}
      <p style={{
        fontSize: '1rem',
        color: 'var(--text-muted)',
        marginBottom: '2rem',
      }}>
        Tell us what's bothering you.
      </p>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '680px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div style={{
          width: '100%',
          position: 'relative',
        }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder={PLACEHOLDERS[placeholderIndex]}
            maxLength={160}
            style={{
              width: '100%',
              padding: '1.2rem 1.4rem',
              fontSize: '1.15rem',
              color: '#ffffff',
              background: 'rgba(18, 22, 34, 0.9)',
              border: errorMsg ? '2px solid #ef4444' : '2px solid rgba(212, 175, 55, 0.45)',
              borderRadius: '12px',
              outline: 'none',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6), inset 0 2px 4px rgba(0, 0, 0, 0.4)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#facc15';
              e.target.style.boxShadow = '0 0 20px rgba(250, 204, 21, 0.35)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errorMsg ? '#ef4444' : 'rgba(212, 175, 55, 0.45)';
              e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.6)';
            }}
          />

          {errorMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              color: '#f87171',
              fontSize: '0.9rem',
              marginTop: '0.5rem',
              fontWeight: 500,
            }}>
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Big Quest CTA Button */}
        <button
          type="submit"
          className="btn-primary"
          style={{
            width: '100%',
            maxWidth: '380px',
            padding: '1.1rem 2rem',
            fontSize: '1.25rem',
            letterSpacing: '0.03em',
            marginTop: '0.25rem',
          }}
        >
          <Sword size={22} />
          <span>⚔️ TURN IT INTO A QUEST</span>
        </button>
      </form>

      {/* Preset Examples Section */}
      <div style={{
        marginTop: '2.5rem',
        width: '100%',
        maxWidth: '700px',
      }}>
        <div style={{
          fontSize: '0.88rem',
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '0.85rem',
        }}>
          Too lazy to think of a problem?
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.6rem',
          justifyContent: 'center',
        }}>
          {PRESET_EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => handleSelectExample(example)}
              className="btn-secondary"
              style={{
                fontSize: '0.88rem',
                borderRadius: '20px',
                padding: '0.45rem 0.95rem',
                border: inputValue === example ? '1px solid #facc15' : undefined,
                background: inputValue === example ? 'rgba(234, 179, 8, 0.15)' : undefined,
                color: inputValue === example ? '#facc15' : undefined,
              }}
            >
              <span>{example}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
