const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/lists/:listId/cards
router.get('/lists/:listId/cards', (req, res) => {
  const cards = db.prepare('SELECT * FROM cards WHERE list_id = ? ORDER BY position').all(req.params.listId);
  res.json(cards);
});

// POST /api/lists/:listId/cards
router.post('/lists/:listId/cards', (req, res) => {
  const { title, description = '' } = req.body;
  if (!title) return res.status(400).json({ error: 'Título obrigatório' });
  const count = db.prepare('SELECT COUNT(*) as c FROM cards WHERE list_id = ?').get(req.params.listId).c;
  const result = db.prepare(
    'INSERT INTO cards (list_id, title, description, position) VALUES (?, ?, ?, ?)'
  ).run(req.params.listId, title, description, count);
  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(card);
});

// GET /api/cards/:id
router.get('/cards/:id', (req, res) => {
  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(req.params.id);
  if (!card) return res.status(404).json({ error: 'Card não encontrado' });
  res.json(card);
});

// PUT /api/cards/:id — atualiza e/ou move entre listas
router.put('/cards/:id', (req, res) => {
  const { title, description, listId, position } = req.body;
  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(req.params.id);
  if (!card) return res.status(404).json({ error: 'Card não encontrado' });
  db.prepare(
    'UPDATE cards SET title = ?, description = ?, list_id = ?, position = ? WHERE id = ?'
  ).run(
    title ?? card.title,
    description ?? card.description,
    listId ?? card.list_id,
    position ?? card.position,
    req.params.id
  );
  const updated = db.prepare('SELECT * FROM cards WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE /api/cards/:id
router.delete('/cards/:id', (req, res) => {
  db.prepare('DELETE FROM cards WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

module.exports = router;