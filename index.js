require('dotenv').config();
const express = require('express');
const cors = require('cors');
const clienteRoutes = require('./routes/clienteRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Registro de rutas
app.use('/api/clientes', clienteRoutes);

// Ruta de diagnóstico (Health Check)
app.get('/', (req, res) => {
    res.status(200).json({
        mensaje: 'API REST de Gestión de Clientes - Actividad Sumativa',
        estado: 'Servidor operativo'
    });
});

// Manejo de rutas inexistentes (404)
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});