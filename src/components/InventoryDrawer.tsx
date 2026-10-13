import React, { useState } from 'react';
import type { InventoryItem } from '../types/game';
import { Backpack, Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { sound } from '../engine/sound';

interface InventoryDrawerProps {
  items: InventoryItem[];
  onUseItem?: (item: InventoryItem) => void;
  isCombat?: boolean;
}

export const InventoryDrawer: React.FC<InventoryDrawerProps> = ({
  items,
  onUseItem,
  isCombat = false,
}) => {
  const [isOpen, setIsOpen] = useState(!isCombat);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const activeItem = items.find((i) => i.id === activeItemId);

  const handleUse = (item: InventoryItem) => {
    if (item.used || !item.usable) return;
    sound.playItemUse();
    if (onUseItem) {
      onUseItem(item);
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div
      className="rpg-card"
      style={{
        background: 'rgba(15, 20, 32, 0.85)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '10px',
        padding: '0.85rem 1.15rem',
        marginBottom: '1.25rem',
      }}
    >
      {/* Header with expand/collapse */}
      <div
        onClick={() => {
          sound.playClick();
          setIsOpen(!isOpen);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Backpack size={17} color="#facc15" />
          <span
            className="font-rpg"
            style={{
              fontSize: '0.95rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              color: 'var(--text-gold)',
            }}
          >
            INVENTORY SATCHEL ({items.filter((i) => !i.used).length} Available)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8' }}>
          <span style={{ fontSize: '0.78rem' }}>{isOpen ? 'Minimize' : 'Inspect'}</span>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* Expanded Grid */}
      {isOpen && (
        <div style={{ marginTop: '0.85rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '0.6rem',
            }}
          >
            {items.map((item) => {
              const isSelected = activeItemId === item.id;
              const isUsed = item.used;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveItemId(isSelected ? null : item.id);
                  }}
                  style={{
                    background: isSelected
                      ? 'rgba(234, 179, 8, 0.18)'
                      : isUsed
                      ? 'rgba(15, 23, 42, 0.4)'
                      : 'rgba(24, 32, 50, 0.75)',
                    border: isSelected
                      ? '1px solid #facc15'
                      : isUsed
                      ? '1px dashed rgba(148, 163, 184, 0.2)'
                      : '1px solid rgba(148, 163, 184, 0.25)',
                    borderRadius: '8px',
                    padding: '0.5rem 0.65rem',
                    cursor: 'pointer',
                    opacity: isUsed ? 0.6 : 1,
                    transition: 'all 0.18s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: isUsed ? '#94a3b8' : '#facc15',
                      }}
                    >
                      {isUsed ? 'USED' : item.count}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: isUsed ? '#94a3b8' : '#f8fafc',
                      marginTop: '0.25rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.name}
                  </div>

                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: isUsed ? '#64748b' : '#38bdf8',
                      marginTop: '2px',
                    }}
                  >
                    {item.statBuff}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Item Detail Panel */}
          {activeItem && (
            <div
              style={{
                marginTop: '0.85rem',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(234, 179, 8, 0.4)',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.4rem' }}>{activeItem.icon}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#facc15' }}>
                      {activeItem.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {activeItem.flavor}
                    </div>
                  </div>
                </div>

                {activeItem.usable && !activeItem.used && onUseItem && (
                  <button
                    onClick={() => handleUse(activeItem)}
                    className="btn-primary"
                    style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
                  >
                    <Sparkles size={13} />
                    <span>USE ITEM</span>
                  </button>
                )}

                {activeItem.used && (
                  <div
                    className="rpg-badge font-mono"
                    style={{
                      background: 'rgba(148, 163, 184, 0.15)',
                      color: '#94a3b8',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                    }}
                  >
                    <Check size={12} />
                    <span>CONSUMED</span>
                  </div>
                )}
              </div>

              {activeItem.effectDescription && (
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: '#e2e8f0',
                    background: 'rgba(56, 189, 248, 0.1)',
                    padding: '0.4rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                  }}
                >
                  ⚡ <strong>Effect:</strong> {activeItem.effectDescription}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
