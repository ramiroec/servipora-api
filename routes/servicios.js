const express = require('express');
const router = express.Router();
const pool = require('../conexionDB');

router.get('/', async (_req, res)=>{try{const{rows}=await pool.query('SELECT * FROM servicios ORDER BY id');res.json(rows);}catch{res.status(500).json({error:'Error al listar'});}});

router.get('/:id', async (req,res)=>{try{const{rows}=await pool.query('SELECT * FROM servicios WHERE id=$1',[req.params.id]);rows[0]?res.json(rows[0]):res.status(404).json({error:'No encontrado'});}catch{res.status(500).json({error:'Error al obtener'});}});

router.post('/', async (req,res)=>{const{categoria_id,titulo,descripcion,estado,fecha_publicacion}=req.body;try{const{rows}=await pool.query('INSERT INTO servicios (categoria_id,titulo,descripcion,estado,fecha_publicacion) VALUES ($1,$2,$3,$4,$5) RETURNING *',[categoria_id,titulo,descripcion,estado,fecha_publicacion]);res.status(201).json(rows[0]);}catch{res.status(500).json({error:'Error al crear'});}});

router.put('/:id', async (req,res)=>{const{categoria_id,titulo,descripcion,estado,fecha_publicacion}=req.body;try{const{rows}=await pool.query('UPDATE servicios SET categoria_id=$1,titulo=$2,descripcion=$3,estado=$4,fecha_publicacion=$5 WHERE id=$6 RETURNING *',[categoria_id,titulo,descripcion,estado,fecha_publicacion,req.params.id]);rows[0]?res.json(rows[0]):res.status(404).json({error:'No encontrado'});}catch{res.status(500).json({error:'Error al actualizar'});}});

router.delete('/:id', async (req,res)=>{try{const{rows}=await pool.query('DELETE FROM servicios WHERE id=$1 RETURNING *',[req.params.id]);rows[0]?res.json({mensaje:'Eliminado',data:rows[0]}):res.status(404).json({error:'No encontrado'});}catch{res.status(500).json({error:'Error al eliminar'});}});

module.exports = router;
