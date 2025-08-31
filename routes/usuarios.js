const express = require('express');
const router = express.Router();
const pool = require('../conexionDB');

router.get('/', async (_req, res) => {
  try { const { rows } = await pool.query('SELECT * FROM usuarios ORDER BY id'); res.json(rows); }
  catch { res.status(500).json({ error: 'Error al listar' }); }
});

router.get('/:id', async (req, res) => {
  try { const { rows } = await pool.query('SELECT * FROM usuarios WHERE id=$1',[req.params.id]);
        rows[0]?res.json(rows[0]):res.status(404).json({ error:'No encontrado' }); }
  catch { res.status(500).json({ error: 'Error al obtener' }); }
});

router.post('/registro-cliente', async (req, res) => {
  const { nombre, email, password, telefono, direccion, ciudad_id } = req.body;
  try {
    // Verificar si el email ya existe
    const existe = await pool.query('SELECT id FROM usuarios WHERE email=$1', [email]);
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }
    const { rows } = await pool.query(
      `INSERT INTO usuarios (nombre, email, password, telefono, direccion, ciudad_id, rol, estado, fecha_registro)
       VALUES ($1,$2,$3,$4,$5,$6,'cliente','activo',NOW())
       RETURNING *`,
      [nombre, email, password, telefono, direccion, ciudad_id]
    );
    res.status(201).json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Error al registrar cliente' });
  }
});

router.put('/:id', async (req, res) => {
  const { nombre, email, password, telefono, direccion, ciudad_id, rol, estado, fecha_registro, foto, cedula, descripcion } = req.body;
  try { const { rows } = await pool.query(
    `UPDATE usuarios SET nombre=$1, email=$2, password=$3, telefono=$4, direccion=$5, ciudad_id=$6,
      rol=$7, estado=$8, fecha_registro=$9, foto=$10, cedula=$11, descripcion=$12
     WHERE id=$13 RETURNING *`,
     [nombre,email,password,telefono,direccion,ciudad_id,rol,estado,fecha_registro,foto,cedula,descripcion, req.params.id]
  ); rows[0]?res.json(rows[0]):res.status(404).json({ error:'No encontrado' }); }
  catch { res.status(500).json({ error: 'Error al actualizar' }); }
});

router.delete('/:id', async (req, res) => {
  try { const { rows } = await pool.query('DELETE FROM usuarios WHERE id=$1 RETURNING *',[req.params.id]);
        rows[0]?res.json({ mensaje:'Eliminado', data: rows[0] }):res.status(404).json({ error:'No encontrado' }); }
  catch { res.status(500).json({ error: 'Error al eliminar' }); }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE email=$1', [email]);
    const usuario = rows[0];
    if (!usuario || usuario.password !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    res.json(usuario);
  } catch {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

module.exports = router;
