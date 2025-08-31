const express = require('express');
const router = express.Router();
const pool = require('../conexionDB');

router.get('/', async (_req, res) => {
  try { const { rows } = await pool.query('SELECT * FROM departamentos ORDER BY id');
        res.json(rows); } 
  catch (e) { res.status(500).json({ error: 'Error al listar' }); }
});

router.get('/:id', async (req, res) => {
  try { const { rows } = await pool.query('SELECT * FROM departamentos WHERE id=$1', [req.params.id]);
        rows[0] ? res.json(rows[0]) : res.status(404).json({ error: 'No encontrado' }); }
  catch (e) { res.status(500).json({ error: 'Error al obtener' }); }
});

router.post('/', async (req, res) => {
  const { nombre } = req.body;
  try { const { rows } = await pool.query('INSERT INTO departamentos (nombre) VALUES ($1) RETURNING *',[nombre]);
        res.status(201).json(rows[0]); }
  catch (e) { res.status(500).json({ error: 'Error al crear' }); }
});

router.put('/:id', async (req, res) => {
  const { nombre } = req.body;
  try { const { rows } = await pool.query('UPDATE departamentos SET nombre=$1 WHERE id=$2 RETURNING *',[nombre, req.params.id]);
        rows[0] ? res.json(rows[0]) : res.status(404).json({ error: 'No encontrado' }); }
  catch (e) { res.status(500).json({ error: 'Error al actualizar' }); }
});

router.delete('/:id', async (req, res) => {
  try { const { rows } = await pool.query('DELETE FROM departamentos WHERE id=$1 RETURNING *',[req.params.id]);
        rows[0] ? res.json({ mensaje: 'Eliminado', data: rows[0] }) : res.status(404).json({ error: 'No encontrado' }); }
  catch (e) { res.status(500).json({ error: 'Error al eliminar' }); }
});

module.exports = router;
