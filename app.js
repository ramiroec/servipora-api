// app.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

function getDurationInMilliseconds(start) {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
}
app.use((req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const ms = getDurationInMilliseconds(start);
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toLocaleString()} ms`);
  });
  next();
});

app.use(express.json());
app.use(cors());

// Rutas
app.use('/api/departamentos', require('./routes/departamentos'));
app.use('/api/ciudades', require('./routes/ciudades'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/servicios', require('./routes/servicios'));
app.use('/api/detalle-servicios', require('./routes/detalle_servicios'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/pagos', require('./routes/pagos'));
app.use('/api/calificaciones', require('./routes/calificaciones'));
app.use('/api/publicaciones', require('./routes/publicaciones'));

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
