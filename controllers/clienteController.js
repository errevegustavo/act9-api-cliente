const db = require('../config/database');

// GET /api/clientes - Obtener todos los clientes
exports.obtenerClientes = (req, res) => {
  const sql = 'SELECT * FROM cliente ORDER BY id_cliente DESC';

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al consultar los clientes', detalle: err.message });
    }
    res.status(200).json(rows);
  });
};

// GET /api/clientes/:id - Obtener un cliente por su ID
exports.obtenerClientePorId = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM cliente WHERE id_cliente = ?';

  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error al consultar el cliente', detalle: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: `El cliente con ID ${id} no existe` });
    }
    res.status(200).json(row);
  });
};

// POST /api/clientes - Crear un cliente (Con manejo explícito de 409 Conflict)
exports.crearCliente = (req, res) => {
  const { nombre, email, telefono } = req.body;

  // Validaciones del servidor
  if (!nombre || !email || !telefono) {
    return res.status(400).json({ error: 'Los campos nombre, email y telefono son obligatorios' });
  }

  const sql = 'INSERT INTO cliente (nombre, email, telefono) VALUES (?, ?, ?)';
  const params = [nombre, email, telefono];

  db.run(sql, params, function (err) {
    if (err) {
      // Captura del error de duplicidad UNIQUE en la columna email -> Retorna 409 Conflict
      if (err.message.includes('UNIQUE')) {
        return res.status(409).json({
          error: 'Conflict: El correo electrónico ya se encuentra registrado en el sistema'
        });
      }
      return res.status(500).json({ error: 'Error al registrar el cliente', detalle: err.message });
    }

    res.status(201).json({
      mensaje: 'Cliente creado exitosamente',
      cliente: {
        id_cliente: this.lastID,
        nombre,
        email,
        telefono,
        created_at: new Date().toISOString()
      }
    });
  });
};

// PUT /api/clientes/:id - Actualizar un cliente existente
exports.actualizarCliente = (req, res) => {
  const { id } = req.params;
  const { nombre, email, telefono } = req.body;

  // Verificar primero si el cliente existe
  db.get('SELECT * FROM cliente WHERE id_cliente = ?', [id], (err, cliente) => {
    if (err) {
      return res.status(500).json({ error: 'Error al consultar el cliente', detalle: err.message });
    }
    if (!cliente) {
      return res.status(404).json({ error: `El cliente con ID ${id} no existe` });
    }

    const nuevoNombre = nombre !== undefined ? nombre : cliente.nombre;
    const nuevoEmail = email !== undefined ? email : cliente.email;
    const nuevoTelefono = telefono !== undefined ? telefono : cliente.telefono;

    const sql = 'UPDATE cliente SET nombre = ?, email = ?, telefono = ? WHERE id_cliente = ?';

    db.run(sql, [nuevoNombre, nuevoEmail, nuevoTelefono, id], function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(409).json({ error: 'Conflict: El email ingresado pertenece a otro cliente' });
        }
        return res.status(500).json({ error: 'Error al actualizar el cliente', detalle: err.message });
      }

      res.status(200).json({
        mensaje: 'Cliente actualizado correctamente',
        cliente: {
          id_cliente: Number(id),
          nombre: nuevoNombre,
          email: nuevoEmail,
          telefono: nuevoTelefono
        }
      });
    });
  });
};

// DELETE /api/clientes/:id - Eliminar un cliente por ID
exports.eliminarCliente = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM cliente WHERE id_cliente = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar el cliente', detalle: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: `El cliente con ID ${id} no existe` });
    }

    res.status(200).json({ mensaje: `Cliente con ID ${id} eliminado exitosamente` });
  });
};