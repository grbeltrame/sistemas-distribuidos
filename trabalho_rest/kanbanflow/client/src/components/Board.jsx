import { useState } from 'react';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import List from './List';
import { api } from '../services/api';

function Board({ board, onBack }) {
  const [lists, setLists] = useState(board.lists || []);
  const [newListTitle, setNewListTitle] = useState('');
  const [addingList, setAddingList] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  const handleDragStart = (event) => {
    const card = lists.flatMap(l => l.cards).find(c => c.id === event.active.id);
    setActiveCard(card);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveCard(null);
    if (!over) return;

    const cardId = active.id;
    const targetListId = over.id;

    const sourceList = lists.find(l => l.cards.some(c => c.id === cardId));
    if (sourceList?.id === targetListId) return;

    await api.moveCard(cardId, targetListId, 0);

    setLists(prev => {
      const card = prev.flatMap(l => l.cards).find(c => c.id === cardId);
      return prev.map(l => {
        if (l.id === sourceList.id) return { ...l, cards: l.cards.filter(c => c.id !== cardId) };
        if (l.id === targetListId) return { ...l, cards: [...l.cards, { ...card, list_id: targetListId }] };
        return l;
      });
    });
  };

  const handleAddList = async () => {
    if (!newListTitle.trim()) return;
    const list = await api.createList(board.id, newListTitle, lists.length);
    setLists([...lists, { ...list, cards: [] }]);
    setNewListTitle('');
    setAddingList(false);
  };

  const handleCardAdded = (listId, card) => {
    setLists(prev => prev.map(l =>
      l.id === listId ? { ...l, cards: [...l.cards, card] } : l
    ));
  };

  const handleCardDeleted = async (cardId) => {
    await api.deleteCard(cardId);
    setLists(prev => prev.map(l => ({ ...l, cards: l.cards.filter(c => c.id !== cardId) })));
  };

  const handleDeleteList = async (listId) => {
    await api.deleteList(listId);
    setLists(prev => prev.filter(l => l.id !== listId));
  };

  return (
    <div style={{ padding: '24px', minHeight: '100vh', backgroundColor: '#0052cc' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button
          onClick={onBack}
          style={{ background: 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', color: '#fff' }}
        >
          ← Voltar
        </button>
        <h2 style={{ color: '#fff', margin: 0 }}>{board.title}</h2>
      </div>

      <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', overflowX: 'auto', paddingBottom: '16px' }}>
          {lists.map(list => (
            <List
              key={list.id}
              list={list}
              onCardAdded={handleCardAdded}
              onCardDeleted={handleCardDeleted}
              onDeleteList={handleDeleteList}
            />
          ))}

          {addingList ? (
            <div style={{ backgroundColor: '#ebecf0', borderRadius: '8px', padding: '12px', width: '280px', flexShrink: 0 }}>
              <input
                autoFocus
                value={newListTitle}
                onChange={e => setNewListTitle(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddList(); if (e.key === 'Escape') setAddingList(false); }}
                placeholder="Título da lista"
                style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button onClick={handleAddList} style={{ backgroundColor: '#0052cc', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer' }}>
                  Adicionar
                </button>
                <button onClick={() => setAddingList(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingList(true)}
              style={{ backgroundColor: 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '8px', padding: '12px 16px', cursor: 'pointer', color: '#fff', width: '280px', flexShrink: 0, textAlign: 'left' }}
            >
              + Adicionar lista
            </button>
          )}
        </div>

        <DragOverlay>
          {activeCard && (
            <div style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              {activeCard.title}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default Board;