import React, { useState } from 'react';
import type { Stage, Choice, Scene, SceneChoice, GameEvent } from '../types/game';
import type { DeepQuestState } from '../engine/questEngine';
import { isChoiceAvailable } from '../engine/questEngine';
import { Flame, Sparkles, Lock, MapPin, Compass, AlertTriangle } from 'lucide-react';
import { sound } from '../engine/sound';

interface StageEncounterProps {
  stage?: Stage;
  scene?: Scene;
  questState?: DeepQuestState;
  totalStages?: number;
  onSelectChoice: (choice: Choice | SceneChoice) => void;
  onMakeItWorse: () => void;
  activeComplications: string[];
  randomEvent: GameEvent | null;
  onDismissEvent: () => void;
}

export const StageEncounter: React.FC<StageEncounterProps> = ({
  stage,
  scene,
  questState,
  totalStages = 3,
  onSelectChoice,
  onMakeItWorse,
  activeComplications,
  randomEvent,
  onDismissEvent,
}) => {
  const [blockedReason, setBlockedReason] = useState<string | null>(null);

  // If scene is provided, use scene; otherwise fallback to stage
  const title = scene?.title || stage?.title || 'Unknown Encounter';
  const scenario = scene?.scenario || stage?.scenario || '';
  const dilemma = scene?.dilemma || stage?.dilemma || '';
  const actTitle = scene?.actTitle || `STAGE ${stage?.stageNumber || 1} OF ${totalStages}`;
  const location = scene?.location || 'The Psychological Battleground';
  const narratorObservation = scene?.narratorObservation;
  const choices = scene?.choices || stage?.choices || [];

  const handleChoiceClick = (choice: Choice | SceneChoice) => {
    // If scene choice with conditions, validate availability
    if (scene && questState) {
      const check = isChoiceAvailable(choice as SceneChoice, questState);
      if (!check.available) {
        sound.playDoomAlarm();
        setBlockedReason(check.reason || 'This action is locked by unmet conditions.');
        return;
      }
    }

    sound.playChoice();
    setBlockedReason(null);

    // Execute state update immediately
    onSelectChoice(choice);
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
        return <span className="rpg-badge badge-danger font-mono">💀 ULTIMATE</span>;
      case 'CHAOTIC':
        return <span className="rpg-badge badge-danger font-mono">🌀 CHAOTIC</span>;
      case 'DECISIVE':
        return <span className="rpg-badge badge-gold font-mono">⚡ DECISIVE</span>;
      case 'PREPARE':
        return <span className="rpg-badge badge-purple font-mono">📜 PREPARE</span>;
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

      {/* Stage Header with Act Banner and Location */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '0.85rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div className="rpg-badge badge-gold font-mono">
            <Compass size={13} />
            <span>{actTitle}</span>
          </div>
          {scene && (
            <div className="rpg-badge font-mono" style={{
              background: 'rgba(148, 163, 184, 0.15)',
              color: '#cbd5e1',
              border: '1px solid rgba(148, 163, 184, 0.25)',
              fontSize: '0.75rem',
            }}>
              <MapPin size={12} color="#38bdf8" />
              <span>{location}</span>
            </div>
          )}
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

      {/* Stage Title */}
      <h3 className="font-rpg" style={{
        fontSize: 'clamp(1.4rem, 4vw, 1.85rem)',
        fontWeight: 800,
        color: '#ffffff',
        marginBottom: '0.65rem',
        lineHeight: 1.25,
      }}>
        {title}
      </h3>

      {/* Scenario Narrative */}
      <p style={{
        fontSize: '1rem',
        color: '#e2e8f0',
        marginBottom: '0.85rem',
        lineHeight: 1.55,
      }}>
        {scenario}
      </p>

      {/* Dilemma Box */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        borderLeft: '4px solid #facc15',
        padding: '0.75rem 1rem',
        borderRadius: '0 8px 8px 0',
        marginBottom: narratorObservation ? '0.75rem' : '1.25rem',
      }}>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--text-gold)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '0.2rem',
        }}>
          Psychological Dilemma
        </div>
        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
          {dilemma}
        </div>
      </div>

      {/* Cynical Narrator Observation if present */}
      {narratorObservation && (
        <div style={{
          fontSize: '0.86rem',
          color: '#94a3b8',
          fontStyle: 'italic',
          marginBottom: '1.25rem',
          padding: '0.4rem 0.75rem',
          borderLeft: '2px solid rgba(168, 85, 247, 0.4)',
          background: 'rgba(168, 85, 247, 0.05)',
          borderRadius: '0 6px 6px 0',
        }}>
          💬 <strong>Narrator:</strong> "{narratorObservation}"
        </div>
      )}

      {/* Active Escalated Complications list */}
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

      {/* Locked Action Notification Banner if user clicked a blocked choice */}
      {blockedReason && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          textAlign: 'left',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fca5a5', fontSize: '0.85rem' }}>
            <AlertTriangle size={18} color="#ef4444" />
            <span><strong>Choice Locked:</strong> {blockedReason}</span>
          </div>
          <button
            onClick={() => setBlockedReason(null)}
            className="btn-secondary"
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Choices Header */}
      <div style={{
        fontSize: '0.88rem',
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

      {/* Choices Grid or Diagnostic Empty State */}
      {choices.length === 0 ? (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '1.25rem',
          color: '#fecaca',
          textAlign: 'center',
          marginBottom: '1rem',
        }}>
          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f87171', marginBottom: '0.35rem' }}>
            ⚠️ ENCOUNTER DATA DIAGNOSTIC: NO CHOICES AVAILABLE
          </div>
          <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
            Encounter: <strong>{title}</strong> &bull; Location: {location} &bull; Scene ID: {scene?.id || 'none'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.35rem' }}>
            The current encounter data is missing choice definitions.
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '0.85rem',
        }}>
        {choices.map((choice) => {
          // Check condition if scene choice
          let isAvailable = true;
          let lockReason = '';
          if (scene && questState) {
            const availCheck = isChoiceAvailable(choice as SceneChoice, questState);
            isAvailable = availCheck.available;
            lockReason = availCheck.reason || '';
          }

          const deltas = choice.statDeltas;

          return (
            <div
              key={choice.id}
              onClick={() => handleChoiceClick(choice)}
              className="choice-card"
              style={{
                borderColor: !isAvailable ? 'rgba(148, 163, 184, 0.15)' : undefined,
                background: !isAvailable ? 'rgba(15, 23, 42, 0.5)' : undefined,
                cursor: !isAvailable ? 'not-allowed' : 'pointer',
                opacity: !isAvailable ? 0.6 : 1,
              }}
            >
              {/* Card Header */}
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

                {/* Stat Deltas / Lock Badge */}
                {!isAvailable ? (
                  <span
                    className="rpg-badge font-mono"
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: '#f87171',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      fontSize: '0.72rem',
                    }}
                  >
                    <Lock size={11} />
                    <span>LOCKED</span>
                  </span>
                ) : (
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {deltas?.resolve && (
                      <span className="font-mono" style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700 }}>
                        {deltas.resolve > 0 ? `+${deltas.resolve}` : deltas.resolve}% Res
                      </span>
                    )}
                    {deltas?.doom && (
                      <span className="font-mono" style={{ fontSize: '0.74rem', color: '#f87171', fontWeight: 700 }}>
                        {deltas.doom > 0 ? `+${deltas.doom}` : deltas.doom}% Doom
                      </span>
                    )}
                    {deltas?.timeLostMinutes && (
                      <span className="font-mono" style={{ fontSize: '0.74rem', color: '#facc15', fontWeight: 700 }}>
                        +{deltas.timeLostMinutes}m
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Title & Subtitle */}
              <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#ffffff', marginBottom: '0.25rem' }}>
                {choice.title}
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                {choice.subtitle}
              </div>

              <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                {choice.description}
              </div>

              {/* Lock Reason if disabled */}
              {!isAvailable && lockReason && (
                <div style={{
                  marginTop: '0.65rem',
                  fontSize: '0.76rem',
                  color: '#fca5a5',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}>
                  <Lock size={12} />
                  <span>{lockReason}</span>
                </div>
              )}
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};
