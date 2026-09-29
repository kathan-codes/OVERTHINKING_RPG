import React from 'react';
import type { Quest } from '../types/game';
import { Shield, Sparkles, Skull, Clock, Backpack } from 'lucide-react';
import { sound } from '../engine/sound';

interface QuestOverviewProps {
  quest: Quest;
  onBeginQuest?: () => void;
  isCollapsible?: boolean;
}

export const QuestOverview: React.FC<QuestOverviewProps> = ({
  quest,
  onBeginQuest,
  isCollapsible = false,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(!isCollapsible);

  return (
    <div className="rpg-card rpg-card-gold" style={{ marginBottom: '1.5rem' }}>
      {/* Top Banner / Quest Label */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
        paddingBottom: '0.85rem',
        marginBottom: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.4rem' }}>⚔️</span>
          <span className="font-rpg" style={{
            fontSize: '1.05rem',
            color: 'var(--text-gold)',
            fontWeight: 800,
            letterSpacing: '0.08em',
          }}>
            QUEST ACTIVE
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="rpg-badge badge-gold font-mono">
            {'⭐'.repeat(quest.difficultyStars)}
          </div>
          <div className="rpg-badge badge-purple font-mono">
            LVL {quest.recommendedLevel}
          </div>
          {isCollapsible && (
            <button
              onClick={() => {
                sound.playClick();
                setIsExpanded(!isExpanded);
              }}
              className="btn-secondary"
              style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem' }}
            >
              {isExpanded ? 'Collapse ▲' : 'Inspect ▼'}
            </button>
          )}
        </div>
      </div>

      {/* Quest Title & Subtitle */}
      <div>
        <h2 className="font-rpg" style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
          fontWeight: 900,
          color: '#ffffff',
          lineHeight: 1.2,
          marginBottom: '0.35rem',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
        }}>
          {quest.title}
        </h2>
        <p style={{
          fontSize: '0.95rem',
          color: 'var(--text-muted)',
          fontStyle: 'italic',
          marginBottom: '1rem',
        }}>
          "{quest.subtitle}"
        </p>
      </div>

      {/* Objective & Survival Meta */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.75)',
        borderRadius: '8px',
        padding: '0.85rem 1rem',
        marginBottom: '1.25rem',
        border: '1px solid rgba(148, 163, 184, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={16} color="#38bdf8" />
          <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.95rem' }}>
            Objective:
          </span>
          <span style={{ color: '#38bdf8', fontWeight: 500, fontSize: '0.95rem' }}>
            {quest.objective}
          </span>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.25rem',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
          paddingTop: '0.35rem',
          borderTop: '1px dashed rgba(148, 163, 184, 0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={13} color="#f59e0b" />
            <span>Survival Window: <strong style={{ color: '#f8fafc' }}>{quest.estimatedSurvivalTime}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={13} color="#a855f7" />
            <span>Problem Origin: <strong style={{ color: '#f8fafc' }}>"{quest.originalProblem}"</strong></span>
          </div>
        </div>
      </div>

      {/* Collapsible Details: Bosses and Inventory */}
      {isExpanded && (
        <>
          {/* Bosses Lineup */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              marginBottom: '0.65rem',
            }}>
              <Skull size={16} color="#ef4444" />
              <span className="font-rpg" style={{
                fontSize: '0.95rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                color: '#fca5a5',
              }}>
                THREAT REGISTRY (BOSS ROSTER)
              </span>
            </div>

            <div className="grid-2">
              {quest.bosses.map((boss) => (
                <div
                  key={boss.id}
                  style={{
                    background: 'rgba(30, 18, 25, 0.55)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    padding: '0.75rem 0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>{boss.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fecaca' }}>
                        {boss.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.2, marginTop: '2px' }}>
                        {boss.description}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono rpg-badge badge-danger" style={{ whiteSpace: 'nowrap' }}>
                    HP {boss.hp}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory bag */}
          <div style={{ marginBottom: onBeginQuest ? '1.5rem' : '0.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              marginBottom: '0.65rem',
            }}>
              <Backpack size={16} color="#facc15" />
              <span className="font-rpg" style={{
                fontSize: '0.95rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                color: 'var(--text-gold)',
              }}>
                CURRENT INVENTORY
              </span>
            </div>

            <div className="grid-4">
              {quest.inventory.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'rgba(20, 26, 42, 0.65)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                    <span className="font-mono" style={{ fontSize: '0.8rem', color: '#facc15', fontWeight: 700 }}>
                      {item.count}
                    </span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.82rem', marginTop: '0.25rem', color: '#f1f5f9' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginTop: '2px' }}>
                    {item.statBuff}
                  </div>
                  {item.statDebuff && (
                    <div style={{ fontSize: '0.7rem', color: '#f87171' }}>
                      {item.statDebuff}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Begin button if presented as intro step */}
          {onBeginQuest && (
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button
                onClick={() => {
                  sound.playChoice();
                  onBeginQuest();
                }}
                className="btn-primary"
                style={{ width: '100%', maxWidth: '340px' }}
              >
                <span>⚔️ ENTER STAGE 1</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
