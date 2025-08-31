const express = require('express');
const router = express.Router();
const pool = require('../conexionDB');

// Listar todo
router.get('/', async (_req, res) => {
  try { const { rows } = await pool.query('SELECT * FROM detalle_servicios ORDER BY usuarios_id, servicios_id'); res.json(rows); }
  catch { res.status(500).json({ error: 'Error al listar' }); }
});

// Obtener uno por PK compuesta
router.get('/:usuarios_id/:servicios_id', async (req, res) => {
  const { usuarios_id, servicios_id } = req.params;
  try { const { rows } = await pool.query('SELECT * FROM detalle_servicios WHERE usuarios_id=$1 AND servicios_id=$2',[usuarios_id, servicios_id]);
        rows[0]?res.json(rows[0]):res.status(404).json({ error:'No encontrado' }); }
  catch { res.status(500).json({ error: 'Error al obtener' }); }
});

// Crear
router.post('/', async (req, res) => {
  const { usuarios_id, servicios_id, descripcion } = req.body;
  try { const { rows } = await pool.query('INSERT INTO detalle_servicios (usuarios_id, servicios_id, descripcion) VALUES ($1,$2,$3) RETURNING *',[usuarios_id, servicios_id, descripcion]);
        res.status(201).json(rows[0]); }
  catch { res.status(500).json({ error: 'Error al crear' }); }
});

// Actualizar
router.put('/:usuarios_id/:servicios_id', async (req, res) => {
  const { usuarios_id, servicios_id } = req.params;
  const { descripcion } = req.body;
  try { const { rows } = await pool.query('UPDATE detalle_servicios SET descripcion=$1 WHERE usuarios_id=$2 AND servicios_id=$3 RETURNING *',[descripcion, usuarios_id, servicios_id]);
        rows[0]?res.json(rows[0]):res.status(404).json({ error:'No encontrado' }); }
  catch { res.status(500).json({ error: 'Error al actualizar' }); }
});

// Eliminar
router.delete('/:usuarios_id/:servicios_id', async (req, res) => {
  const { usuarios_id, servicios_id } = req.params;
  try { const { rows } = await pool.query('DELETE FROM detalle_servicios WHERE usuarios_id=$1 AND servicios_id=$2 RETURNING *',[usuarios_id, servicios_id]);
        rows[0]?res.json({ mensaje:'Eliminado', data: rows[0] }):res.status(404).json({ error:'No encontrado' }); }
  catch { res.status(500).json({ error: 'Error al eliminar' }); }
});

module.exports = router;
