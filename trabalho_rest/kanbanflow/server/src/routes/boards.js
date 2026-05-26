const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/boards — lista todos
router.get('/', (req, res) => {
  const boards = db.prepare('SELECT * FROM boards ORDER BY id').all();
  res.json(boards);
});

// POST /api/boards — cria novo
router.post('/', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Título obrigatório' });
  const result = db.prepare('INSERT INTO boards (title) VALUES (?)').run(title);
  const board = db.prepare('SELECT * FROM boards WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(board);
});

// GET /api/boards/:id — busca board com listas e cards
router.get('/:id', (req, res) => {
  const board = db.prepare('SELECT * FROM boards WHERE id = ?').get(req.params.id);
  if (!board) return res.status(404).json({ error: 'Board não encontrado' });
  const lists = db.prepare('SELECT * FROM lists WHERE board_id = ? ORDER BY position').all(board.id);
  lists.forEach(list => {
    list.cards = db.prepare('SELECT * FROM cards WHERE list_id = ? ORDER BY position').all(list.id);
  });
  board.lists = lists;
  res.json(board);
});

// PUT /api/boards/:id — atualiza título
router.put('/:id', (req, res) => {
  const { title } = req.body;
  db.prepare('UPDATE boards SET title = ? WHERE id = ?').run(title, req.params.id);
  const board = db.prepare('SELECT * FROM boards WHERE id = ?').get(req.params.id);
  res.json(board);
});

// DELETE /api/boards/:id
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM boards WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

module.exports = router;