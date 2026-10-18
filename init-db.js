const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const schemaPath = path.join(__dirname, 'schema.sql');

// Conectar o crear el archivo de base de datos
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
        process.exit(1);
    }
    console.log('Conectado a la base de datos SQLite.');
});

// Leer y ejecutar el archivo schema.sql
const sqlSchema = fs.readFileSync(schemaPath, 'utf8');

db.exec(sqlSchema, (err) => {
    if (err) {
        console.error('Error al ejecutar el esquema SQL:', err.message);
    } else {
        console.log('Base de datos inicializada correctamente con la tabla "cliente" y registros iniciales.');
    }
    db.close();
});