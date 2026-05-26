const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/boards/:boardId/lists
router.get('/boards/:boardId/lists', (req, res) => {
  const lists = db.prepare('SELECT * FROM lists WHERE board_id = ? ORDER BY position').all(req.params.boardId);
  res.json(lists);
});

// POST /api/boards/:boardId/lists
router.post('/boards/:boardId/lists', (req, res) => {
  const { title, position = 0 } = req.body;
  if (!title) return res.status(400).json({ error: 'Título obrigatório' });
  const result = db.prepare(
    'INSERT INTO lists (board_id, title, position) VALUES (?, ?, ?)'
  ).run(req.params.boardId, title, position);
  const list = db.prepare('SELECT * FROM lists WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(list);
});

// PUT /api/lists/:id
router.put('/:id', (req, res) => {
  const { title, position } = req.body;
  const list = db.prepare('SELECT * FROM lists WHERE id = ?').get(req.params.id);
  if (!list) return res.status(404).json({ error: 'Lista não encontrada' });
  db.prepare('UPDATE lists SET title = ?, position = ? WHERE id = ?').run(
    title ?? list.title,
    position ?? list.position,
    req.params.id
  );
  const updated = db.prepare('SELECT * FROM lists WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE /api/lists/:id
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM lists WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

module.exports = router;