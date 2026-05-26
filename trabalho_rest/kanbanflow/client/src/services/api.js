const BASE_URL = 'http://localhost:3001/api';

export const api = {
  // Boards
  getBoards: () => fetch(`${BASE_URL}/boards`).then(r => r.json()),
  createBoard: (title) => fetch(`${BASE_URL}/boards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  }).then(r => r.json()),
  getBoard: (id) => fetch(`${BASE_URL}/boards/${id}`).then(r => r.json()),
  deleteBoard: (id) => fetch(`${BASE_URL}/boards/${id}`, { method: 'DELETE' }),
  updateBoard: (id, title) => fetch(`${BASE_URL}/boards/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  }).then(r => r.json()),

  // Lists
  createList: (boardId, title, position) => fetch(`${BASE_URL}/boards/${boardId}/lists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, position })
  }).then(r => r.json()),
  deleteList: (id) => fetch(`${BASE_URL}/lists/${id}`, { method: 'DELETE' }),

  // Cards
  createCard: (listId, title) => fetch(`${BASE_URL}/lists/${listId}/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  }).then(r => r.json()),
  moveCard: (cardId, listId, position) => fetch(`${BASE_URL}/cards/${cardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ listId, position })
  }).then(r => r.json()),
  deleteCard: (cardId) => fetch(`${BASE_URL}/cards/${cardId}`, { method: 'DELETE' }),
};