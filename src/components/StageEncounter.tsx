import React, { useState } from 'react';
import type { Stage, Choice, GameEvent } from '../types/game';
import { Flame, Sparkles, ArrowRight } from 'lucide-react';
import { sound } from '../engine/sound';

interface StageEncounterProps {
  stage: Stage;
  totalStages: number;
  onSelectChoice: (choice: Choice) => void;
  onMakeItWorse: () => void;
  activeComplications: string[];
  randomEvent: GameEvent | null;
  onDismissEvent: () => void;
}

export const StageEncounter: React.FC<StageEncounterProps> = ({
  stage,
  totalStages,
  onSelectChoice,
  onMakeItWorse,
  activeComplications,
  randomEvent,
  onDismissEvent,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);

  const handleChoiceClick = (choice: Choice) => {
    sound.playChoice();
    setSelectedChoice(choice);
    // Allow player to read the consequence briefly before advancing
    setTimeout(() => {
      onSelectChoice(choice);
      setSelectedChoice(null);
    }, 850);
  };

  const getChoiceBadge = (type: Choice['type']) => {
    switch (type) {
      case 'ATTACK':
        return <span className="rpg-badge badge-gold font-mono">⚔️ ATTACK</span>;
      case 'DEFEND':
        return <span className="rpg-badge badge-cyan font-mono">🛡️ DEFEND</span>;
      case 'ESCAPE':
        return <span className="rpg-badge badge-purple font-mono">🧙 ESCAPE</span>;
      case 'ULTIMATE':
        return <span className="rpg-badge badge-danger font-mono">💀 ULTIMATE MOVE</span>;
      case 'CHAOTIC':
        return <span className="rpg-badge badge-danger font-mono">🌀 CHAOTIC MOVE</span>;
      default:
        return <span className="rpg-badge badge-gold font-mono">ACTION</span>;
    }
  };

  return (
    <div className="rpg-card" style={{ marginBottom: '1.5rem' }}>
      {/* Random Event Alert Banner if active */}
      {randomEvent && (
        <div style={{
          background: 'rgba(56, 189, 248, 0.12)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '8px',
          padding: '0.85rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.4rem' }}>{randomEvent.icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#38bdf8' }}>
                RANDOM EVENT: {randomEvent.title}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#e2e8f0', marginTop: '2px' }}>
                {randomEvent.description}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onDismissEvent();
            }}
            className="btn-secondary"
            style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Stage Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '0.85rem',
      }}>
        <div className="rpg-badge badge-gold font-mono">
          STAGE {stage.stageNumber} OF {totalStages}
        </div>

        {/* MAKE IT WORSE BUTTON */}
        <button
          onClick={() => {
            sound.playMakeWorse();
            onMakeItWorse();
          }}
          className="btn-worse"
          title="Click to generate another absurd complication!"
        >
          <Flame size={16} />
          <span>🔥 MAKE IT WORSE</span>
        </button>
      </div>

      {/* Stage Title & Scenario */}
      <h3 className="font-rpg" style={{
        fontSize: '1.45rem',
        fontWeight: 800,
        color: '#ffffff',
        marginBottom: '0.5rem',
      }}>
        {stage.title}
      </h3>

      <p style={{
        fontSize: '1rem',
        color: '#e2e8f0',
        marginBottom: '0.75rem',
        lineHeight: 1.5,
      }}>
        {stage.scenario}
      </p>

      {/* Dilemma Box */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        borderLeft: '4px solid #facc15',
        padding: '0.75rem 1rem',
        borderRadius: '0 8px 8px 0',
        marginBottom: '1.25rem',
      }}>
        <div style={{
          fontSize: '0.78rem',
          fontWeight: 700,
          color: 'var(--text-gold)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '0.2rem',
        }}>
          Psychological Dilemma
        </div>
        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
          {stage.dilemma}
        </div>
      </div>

      {/* Active Escalated Complications list (from "MAKE IT WORSE") */}
      {activeComplications.length > 0 && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          borderRadius: '8px',
          padding: '0.85rem 1rem',
          marginBottom: '1.25rem',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#f87171',
            fontWeight: 700,
            fontSize: '0.85rem',
            marginBottom: '0.4rem',
          }}>
            <Flame size={15} color="#ef4444" />
            <span>UNNECESSARY COMPLICATIONS ACCUMULATING ({activeComplications.length}):</span>
          </div>
          <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.86rem', color: '#fecaca' }}>
            {activeComplications.map((comp, idx) => (
              <li key={idx} style={{ marginBottom: '0.25rem' }}>
                {comp}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Choices Header */}
      <div style={{
        fontSize: '0.9rem',
        fontWeight: 700,
        color: 'var(--text-gold)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
      }}>
        <Sparkles size={14} />
        <span>WHAT WILL YOU DO?</span>
      </div>

      {/* Choices Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '0.85rem',
      }}>
        {stage.choices.map((choice) => {
          const isSelected = selectedChoice?.id === choice.id;
          return (
            <div
              key={choice.id}
              onClick={() => handleChoiceClick(choice)}
              className="choice-card"
              style={{
                borderColor: isSelected ? '#facc15' : undefined,
                background: isSelected ? 'rgba(234, 179, 8, 0.2)' : undefined,
                cursor: selectedChoice ? 'default' : 'pointer',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>{choice.icon}</span>
                  {getChoiceBadge(choice.type)}
                </div>
                <span className="font-mono" style={{
                  fontSize: '0.78rem',
                  color: choice.overthinkingDelta > 30 ? '#f87171' : choice.overthinkingDelta > 15 ? '#fbbf24' : '#34d399',
                  fontWeight: 700,
                }}>
                  +{choice.overthinkingDelta}% Overthinking
                </span>
              </div>

              <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#ffffff', marginBottom: '0.25rem' }}>
                {choice.title}
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                {choice.subtitle}
              </div>

              <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                {choice.description}
              </div>

              {/* Consequence Flash on click */}
              {isSelected && (
                <div style={{
                  marginTop: '0.75rem',
                  padding: '0.5rem 0.65rem',
                  borderRadius: '6px',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid #facc15',
                  color: '#fef08a',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}>
                  <ArrowRight size={14} />
                  <span>{choice.consequence}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
