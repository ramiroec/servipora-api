const express = require('express');
const router = express.Router();
const pool = require('../conexionDB');

router.get('/', async (_req,res)=>{try{const{rows}=await pool.query('SELECT * FROM pedidos ORDER BY id');res.json(rows);}catch{res.status(500).json({error:'Error al listar'});}});

router.get('/:id', async (req,res)=>{try{const{rows}=await pool.query('SELECT * FROM pedidos WHERE id=$1',[req.params.id]);rows[0]?res.json(rows[0]):res.status(404).json({error:'No encontrado'});}catch{res.status(500).json({error:'Error al obtener'});}});

router.post('/', async (req,res)=>{
  const { cliente_id, servicio_id, proveedor_id, fecha_pedido, estado, direccion_servicio, observacion } = req.body;
  try { const { rows } = await pool.query(
    `INSERT INTO pedidos (cliente_id, servicio_id, proveedor_id, fecha_pedido, estado, direccion_servicio, observacion)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [cliente_id, servicio_id, proveedor_id, fecha_pedido, estado, direccion_servicio, observacion]
  ); res.status(201).json(rows[0]); }
  catch { res.status(500).json({ error: 'Error al crear' }); }
});

router.put('/:id', async (req,res)=>{
  const { cliente_id, servicio_id, proveedor_id, fecha_pedido, estado, direccion_servicio, observacion } = req.body;
  try { const { rows } = await pool.query(
    `UPDATE pedidos SET cliente_id=$1, servicio_id=$2, proveedor_id=$3, fecha_pedido=$4, estado=$5, direccion_servicio=$6, observacion=$7
     WHERE id=$8 RETURNING *`,
    [cliente_id, servicio_id, proveedor_id, fecha_pedido, estado, direccion_servicio, observacion, req.params.id]
  ); rows[0]?res.json(rows[0]):res.status(404).json({error:'No encontrado'}); }
  catch { res.status(500).json({ error: 'Error al actualizar' }); }
});

router.delete('/:id', async (req,res)=>{try{const{rows}=await pool.query('DELETE FROM pedidos WHERE id=$1 RETURNING *',[req.params.id]);rows[0]?res.json({mensaje:'Eliminado',data:rows[0]}):res.status(404).json({error:'No encontrado'});}catch{res.status(500).json({error:'Error al eliminar'});}});

module.exports = router;
