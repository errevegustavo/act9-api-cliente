-- Eliminar la tabla si existe (para permitir reinicializaciones limpias durante pruebas)
DROP TABLE IF EXISTS cliente;

-- 1. Creación de la tabla cliente según la pauta
CREATE TABLE cliente (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    telefono TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Inserción de datos iniciales de prueba (DML)
INSERT INTO cliente (nombre, email, telefono) VALUES 
    ('Gustavo Vera', 'gvera@trabajo9.com', '+56955555555'),
    ('Dante Rojas', 'danterojas@trabajo9.com', '+56988888888');