import { useState, useEffect } from 'react';
import { api } from './services/api';
import Board from './components/Board';

function App() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    api.getBoards().then(setBoards);
  }, []);

  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) return;
    const board = await api.createBoard(newBoardTitle);
    setBoards([...boards, board]);
    setNewBoardTitle('');
    setAdding(false);
  };

  const handleSelectBoard = async (id) => {
    const board = await api.getBoard(id);
    setSelectedBoard(board);
  };

  const handleDeleteBoard = async (e, id) => {
    e.stopPropagation();
    await api.deleteBoard(id);
    setBoards(boards.filter(b => b.id !== id));
  };

  if (selectedBoard) {
    return <Board board={selectedBoard} onBack={() => setSelectedBoard(null)} />;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0052cc', padding: '32px' }}>
      <h1 style={{ color: '#fff', marginBottom: '32px' }}>KanbanFlow</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-start' }}>
        {boards.map(board => (
          <div
            key={board.id}
            onClick={() => handleSelectBoard(board.id)}
            style={{
              backgroundColor: '#0747a6',
              borderRadius: '8px',
              padding: '16px',
              width: '200px',
              cursor: 'pointer',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
          >
            <strong>{board.title}</strong>
            <button
              onClick={(e) => handleDeleteBoard(e, board.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: '16px' }}
            >
              ✕
            </button>
          </div>
        ))}

        {adding ? (
          <div style={{ backgroundColor: '#ebecf0', borderRadius: '8px', padding: '12px', width: '200px' }}>
            <input
              autoFocus
              value={newBoardTitle}
              onChange={e => setNewBoardTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleCreateBoard(); if (e.key === 'Escape') setAdding(false); }}
              placeholder="Título do board"
              style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button onClick={handleCreateBoard} style={{ backgroundColor: '#0052cc', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer' }}>
                Criar
              </button>
              <button onClick={() => setAdding(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', padding: '16px', width: '200px', cursor: 'pointer', color: '#fff', textAlign: 'left' }}
          >
            + Criar board
          </button>
        )}
      </div>
    </div>
  );
}

export default App;