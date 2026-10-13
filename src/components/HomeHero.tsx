import React, { useState, useEffect } from 'react';
import { Sword, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import { sound } from '../engine/sound';

interface HomeHeroProps {
  onStartQuest: (problem: string) => void;
  initialValue?: string;
}

const PLACEHOLDERS = [
  'I need to write an email to my professor...',
  'I need to reply to a message...',
  'I have an exam tomorrow...',
  'I need to make an important phone call...',
  'I need to clean my room...',
  'I need to choose between two options...',
  'I have been procrastinating on a project...',
  'I should probably go to sleep...',
];

const PRESET_EXAMPLES = [
  'I need to write an email to my professor.',
  'I need to reply to a message.',
  'I have an exam tomorrow.',
  'I need to make an important phone call.',
  'I need to clean my room.',
  'I need to choose between two options.',
  'I have been procrastinating on a project.',
];

export const HomeHero: React.FC<HomeHeroProps> = ({ onStartQuest, initialValue = '' }) => {
  const [inputValue, setInputValue] = useState(() => initialValue);
  const [errorMsg, setErrorMsg] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Rotate placeholder every 3 seconds if input is empty
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

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

  const handleLaunchSyllabusCampaign = () => {
    sound.playQuestStart();
    onStartQuest('The Unfinished Syllabus');
  };

  const handleSelectExample = (text: string) => {
    sound.playClick();
    setInputValue(text);
    setErrorMsg('');
  };

  return (
    <div style={{
      padding: '2rem 0 3.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    }}>
      {/* Top Tagline Badge */}
      <div className="rpg-badge badge-gold" style={{ marginBottom: '1.25rem' }}>
        <Sparkles size={13} />
        <span>SATIRICAL PSYCHOLOGICAL RPG &bull; CLIENT-SIDE &bull; FREEFORM QUESTS</span>
      </div>

      {/* Main Title */}
      <h1 className="font-rpg" style={{
        fontSize: 'clamp(2.4rem, 5.5vw, 3.8rem)',
        fontWeight: 900,
        lineHeight: 1.1,
        marginBottom: '0.5rem',
        textShadow: '0 2px 25px rgba(245, 158, 11, 0.35)',
      }}>
        🧠 OVERTHINKING RPG
      </h1>

      {/* Brand Subtitle */}
      <p style={{
        fontSize: 'clamp(1.1rem, 2.2vw, 1.35rem)',
        color: '#f8fafc',
        fontWeight: 600,
        maxWidth: '680px',
        margin: '0 auto 1.5rem',
        letterSpacing: '0.01em',
      }}>
        Turn your tiniest problems into unnecessarily epic quests.
      </p>

      {/* THE CORE QUESTION */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(22, 28, 44, 0.9), rgba(15, 23, 42, 0.95))',
        border: '1px solid rgba(212, 175, 55, 0.4)',
        borderRadius: '16px',
        padding: '2rem 1.75rem',
        maxWidth: '720px',
        width: '100%',
        boxShadow: '0 12px 35px -10px rgba(0, 0, 0, 0.7), 0 0 25px rgba(234, 179, 8, 0.12)',
        marginBottom: '2.5rem',
      }}>
        <h2 className="font-rpg" style={{
          fontSize: 'clamp(1.35rem, 3.2vw, 1.85rem)',
          fontWeight: 800,
          color: '#fef08a',
          margin: '0 0 0.5rem',
          lineHeight: 1.25,
        }}>
          What tiny problem is currently ruining your entire existence?
        </h2>

        <p style={{
          fontSize: '0.92rem',
          color: 'var(--text-muted)',
          marginBottom: '1.5rem',
          maxWidth: '560px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Describe any everyday dilemma—from writing a short email to washing a dish—and embark on an over-analyzed multi-stage psychological adventure.
        </p>

        {/* Custom Input Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div style={{ width: '100%', position: 'relative' }}>
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
                padding: '1.15rem 1.35rem',
                fontSize: '1.1rem',
                color: '#ffffff',
                background: 'rgba(10, 14, 24, 0.95)',
                border: errorMsg ? '2px solid #ef4444' : '2px solid rgba(212, 175, 55, 0.45)',
                borderRadius: '10px',
                outline: 'none',
                boxShadow: '0 6px 25px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(0, 0, 0, 0.4)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#facc15';
                e.target.style.boxShadow = '0 0 20px rgba(234, 179, 8, 0.35)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errorMsg ? '#ef4444' : 'rgba(212, 175, 55, 0.45)';
                e.target.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.5)';
              }}
            />

            {errorMsg && (
              <div style={{
                position: 'absolute',
                bottom: '-1.5rem',
                left: '0.5rem',
                fontSize: '0.8rem',
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}>
                <AlertCircle size={13} />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{
              width: '100%',
              maxWidth: '360px',
              padding: '0.95rem 1.8rem',
              fontSize: '1.1rem',
              marginTop: '0.25rem',
            }}
          >
            <Sword size={20} />
            <span>START QUEST</span>
          </button>
        </form>

        {/* Preset scenario chips */}
        <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
          <div style={{
            fontSize: '0.78rem',
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '0.65rem',
            fontWeight: 700,
          }}>
            Or select an everyday dilemma preset:
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.45rem',
            justifyContent: 'center',
          }}>
            {PRESET_EXAMPLES.map((example, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectExample(example)}
                className="btn-secondary"
                style={{
                  fontSize: '0.82rem',
                  padding: '0.4rem 0.8rem',
                }}
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DISCOVER AUTHORED CAMPAIGNS SHELF */}
      <div style={{
        maxWidth: '720px',
        width: '100%',
        textAlign: 'left',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.85rem',
          color: '#cbd5e1',
          fontSize: '0.88rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          <BookOpen size={16} color="#facc15" />
          <span>Authored Campaign Vault</span>
        </div>

        <div
          className="rpg-card"
          style={{
            background: 'rgba(18, 22, 34, 0.75)',
            border: '1px solid rgba(234, 179, 8, 0.35)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ flex: '1 1 340px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.4rem' }}>📚</span>
              <h3 className="font-rpg" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                The Unfinished Syllabus
              </h3>
              <span className="rpg-badge badge-gold font-mono" style={{ fontSize: '0.7rem' }}>
                3 Acts
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#cbd5e1', margin: 0, lineHeight: 1.45 }}>
              Handcrafted 3-act academic campaign with 10–12 branching decisions, custom items, and a 3-phase confrontation against The Guardian of the Unfinished Syllabus.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLaunchSyllabusCampaign}
            className="btn-secondary"
            style={{
              padding: '0.65rem 1.2rem',
              fontSize: '0.88rem',
              fontWeight: 700,
              borderColor: 'rgba(234, 179, 8, 0.5)',
              color: '#fef08a',
              background: 'rgba(234, 179, 8, 0.12)',
              whiteSpace: 'nowrap',
            }}
          >
            <span>Play Authored Campaign &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
