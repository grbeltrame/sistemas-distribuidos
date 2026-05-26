import { useDroppable } from '@dnd-kit/core';
import Card from './Card';
import { useState } from 'react';
import { api } from '../services/api';

function List({ list, onCardAdded, onCardDeleted, onDeleteList }) {
  const [newCardTitle, setNewCardTitle] = useState('');
  const [adding, setAdding] = useState(false);

  const { setNodeRef, isOver } = useDroppable({ id: list.id });

  const handleAddCard = async () => {
    if (!newCardTitle.trim()) return;
    const card = await api.createCard(list.id, newCardTitle);
    onCardAdded(list.id, card);
    setNewCardTitle('');
    setAdding(false);
  };

  return (
    <div style={{
      backgroundColor: '#ebecf0',
      borderRadius: '8px',
      padding: '12px',
      width: '280px',
      minHeight: '100px',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <strong>{list.title}</strong>
        <button
          onClick={() => onDeleteList(list.id)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}
        >
          ✕
        </button>
      </div>

      <div ref={setNodeRef} style={{
        minHeight: '40px',
        backgroundColor: isOver ? '#dae0e8' : 'transparent',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
      }}>
        {list.cards.map(card => (
          <Card key={card.id} card={card} onDelete={onCardDeleted} />
        ))}
      </div>

      {adding ? (
        <div style={{ marginTop: '8px' }}>
          <input
            autoFocus
            value={newCardTitle}
            onChange={e => setNewCardTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAddCard(); if (e.key === 'Escape') setAdding(false); }}
            placeholder="Título do card"
            style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <button onClick={handleAddCard} style={{ backgroundColor: '#0052cc', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer' }}>
              Adicionar
            </button>
            <button onClick={() => setAdding(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          style={{ marginTop: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#5e6c84', width: '100%', textAlign: 'left', padding: '4px' }}
        >
          + Adicionar card
        </button>
      )}
    </div>
  );
}

export default List;