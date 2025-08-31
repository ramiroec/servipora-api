const express = require('express');
const router = express.Router();
const pool = require('../conexionDB');

router.get('/', async (_req, res)=>{try{const{rows}=await pool.query('SELECT * FROM categorias ORDER BY id');res.json(rows);}catch{res.status(500).json({error:'Error al listar'});}});

router.get('/:id', async (req,res)=>{try{const{rows}=await pool.query('SELECT * FROM categorias WHERE id=$1',[req.params.id]);rows[0]?res.json(rows[0]):res.status(404).json({error:'No encontrado'});}catch{res.status(500).json({error:'Error al obtener'});}});

router.post('/', async (req,res)=>{const{nombre,descripcion,foto,estado}=req.body;try{const{rows}=await pool.query('INSERT INTO categorias (nombre,descripcion,foto,estado) VALUES ($1,$2,$3,$4) RETURNING *',[nombre,descripcion,foto,estado]);res.status(201).json(rows[0]);}catch{res.status(500).json({error:'Error al crear'});}});

router.put('/:id', async (req,res)=>{const{nombre,descripcion,foto,estado}=req.body;try{const{rows}=await pool.query('UPDATE categorias SET nombre=$1, descripcion=$2, foto=$3, estado=$4 WHERE id=$5 RETURNING *',[nombre,descripcion,foto,estado,req.params.id]);rows[0]?res.json(rows[0]):res.status(404).json({error:'No encontrado'});}catch{res.status(500).json({error:'Error al actualizar'});}});

router.delete('/:id', async (req,res)=>{try{const{rows}=await pool.query('DELETE FROM categorias WHERE id=$1 RETURNING *',[req.params.id]);rows[0]?res.json({mensaje:'Eliminado',data:rows[0]}):res.status(404).json({error:'No encontrado'});}catch{res.status(500).json({error:'Error al eliminar'});}});

module.exports = router;
