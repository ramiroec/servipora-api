const express = require('express');
const router = express.Router();
const pool = require('../conexionDB');

router.get('/', async (req, res) => {
  const { departamento_id } = req.query;
  try {
    let query = 'SELECT * FROM ciudades';
    let params = [];
    if (departamento_id) {
      query += ' WHERE iddepartamento=$1';
      params.push(departamento_id);
    }
    query += ' ORDER BY nombre_ciudad';
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Error al listar' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM ciudades WHERE id=$1', [req.params.id]);
    rows[0] ? res.json(rows[0]) : res.status(404).json({ error: 'No encontrado' });
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener' });
  }
});

module.exports = router;
