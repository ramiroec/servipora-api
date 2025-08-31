const express = require('express');
const router = express.Router();
const pool = require('../conexionDB');

router.get('/', async (_req,res)=>{try{const{rows}=await pool.query('SELECT * FROM calificaciones ORDER BY id');res.json(rows);}catch{res.status(500).json({error:'Error al listar'});}});

router.get('/:id', async (req,res)=>{try{const{rows}=await pool.query('SELECT * FROM calificaciones WHERE id=$1',[req.params.id]);rows[0]?res.json(rows[0]):res.status(404).json({error:'No encontrado'});}catch{res.status(500).json({error:'Error al obtener'});}});

router.post('/', async (req,res)=>{
  const { pedido_id, cliente_id, proveedor_id, puntuacion, comentario, fecha } = req.body;
  try { const { rows } = await pool.query(
    'INSERT INTO calificaciones (pedido_id, cliente_id, proveedor_id, puntuacion, comentario, fecha) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [pedido_id, cliente_id, proveedor_id, puntuacion, comentario, fecha]
  ); res.status(201).json(rows[0]); }
  catch { res.status(500).json({ error: 'Error al crear' }); }
});

router.put('/:id', async (req,res)=>{
  const { pedido_id, cliente_id, proveedor_id, puntuacion, comentario, fecha } = req.body;
  try { const { rows } = await pool.query(
    'UPDATE calificaciones SET pedido_id=$1, cliente_id=$2, proveedor_id=$3, puntuacion=$4, comentario=$5, fecha=$6 WHERE id=$7 RETURNING *',
    [pedido_id, cliente_id, proveedor_id, puntuacion, comentario, fecha, req.params.id]
  ); rows[0]?res.json(rows[0]):res.status(404).json({error:'No encontrado'}); }
  catch { res.status(500).json({ error: 'Error al actualizar' }); }
});

router.delete('/:id', async (req,res)=>{try{const{rows}=await pool.query('DELETE FROM calificaciones WHERE id=$1 RETURNING *',[req.params.id]);rows[0]?res.json({mensaje:'Eliminado',data:rows[0]}):res.status(404).json({error:'No encontrado'});}catch{res.status(500).json({error:'Error al eliminar'});}});

module.exports = router;
