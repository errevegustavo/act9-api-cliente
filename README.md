# Actividad Sumativa: API REST Segura con BD Relacional

**Taller de Plataformas Web**
**Tema:** Implementación y validación CRUD API REST hacia BD SQL
**Integrante:** Gustavo Rojas V.

---

## 1. Enlace al repositorio en GitHub

**Repositorio público del proyecto:**

- **URL del repositorio:** 
https://github.com/errevegustavo/act9-api-cliente

---

## 2. Descripción del entorno de laboratorio

- Se generó repositorio público en GitHub.
- Para el entorno de desarrollo y pruebas se preparó un proyecto Node.js en entorno Linux Fedora.
- Para la BD se optó por SQLite y se creó la tabla `clientes` a partir de un esquema predefinido (`schema.sql`).
- Se levantó servidor web con Express (`app.js`) y se estableció conexión hacia la BD con el módulo `sqlite3` (`config/database.js`).

---

## 3. Modelo de datos relacional

El sistema está compuesto por una entidad principal relacional denominada `clientes`, diseñada para prevenir la duplicidad de registros mediante restricciones a nivel de base de datos.

### 3.1. Tabla Clientes

| Campo | Tipo de dato | Descripción |
| :--- | :--- | :--- |
| `id_cliente` | `INTEGER` | Clave primaria autoincremental. |
| `nombre` | `TEXT` | Nombre completo del cliente. Campo obligatorio (`NOT NULL`). |
| `email` | `TEXT` | Correo electrónico del cliente. Campo obligatorio y único (`NOT NULL UNIQUE`). |
| `telefono` | `TEXT` | Número de contacto telefónico. Campo obligatorio (`NOT NULL`). |
| `created_at` | `DATETIME` | Fecha y hora de creación. Por defecto, utiliza `CURRENT_TIMESTAMP`. |

---

## 4. Descripción de las pruebas de funcionamiento CRUD (API REST)

Se realizaron pruebas a los 4 endpoints requeridos utilizando cURL desde la CLI confirmando la correcta comunicación con la base de datos SQLite local:

### 4.1. READ — Consultar clientes

**Endpoint:** `GET /api/clientes`
**Descripción:** Recupera la lista completa de todos los clientes registrados en la base de datos, ordenados de forma descendente por su ID.

**Comando cURL:**

```bash
curl -i http://localhost:3000/api/clientes
```

**Respuesta esperada (200 OK):**

```json
[
  {
    "id_cliente": 1,
    "nombre": "Carlos Mendoza",
    "email": "carlos.mendoza@example.com",
    "telefono": "+56912345678",
    "created_at": "2026-10-18 16:30:00"
  }
]
```

### 4.2. CREATE — Crear un cliente

**Endpoint:** `POST /api/clientes`
**Descripción:** Registra un nuevo cliente en el sistema. Valida que se envíen todos los campos obligatorios y gestiona el error si el correo electrónico ya existe.

**Comando cURL (inserción exitosa):**

```bash
curl -i -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Roberto Gómez", "email": "roberto.gomez@example.com", "telefono": "+56911223344"}'
```

**Respuesta esperada (201 Created):**

```json
{
  "mensaje": "Cliente creado exitosamente",
  "cliente": {
    "id_cliente": 3,
    "nombre": "Roberto Gómez",
    "email": "roberto.gomez@example.com",
    "telefono": "+56911223344",
    "created_at": "2026-10-18T17:00:00.000Z"
  }
}
```

**Validaciones y manejo de errores:**

- **Campos faltantes:** si no se envía `nombre`, `email` o `telefono`, se devuelve `400 Bad Request`.
- **Correo duplicado:** si el `email` ya existe en la base de datos, SQLite emite un error `UNIQUE` y la API devuelve explícitamente `409 Conflict`, con el mensaje `"Conflict: El correo electrónico ya se encuentra registrado en el sistema"`.

### 4.3. UPDATE — Actualizar un cliente

**Endpoint:** `PUT /api/clientes/:id`
**Descripción:** Actualiza de forma parcial o total los datos de un cliente específico, identificado mediante su `id_cliente`.

**Comando cURL:**

```bash
curl -i -X PUT http://localhost:3000/api/clientes/3 \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Roberto Gómez Valdés", "telefono": "+56999887766"}'
```

**Respuesta esperada (200 OK):**

```json
{
  "mensaje": "Cliente actualizado correctamente",
  "cliente": {
    "id_cliente": 3,
    "nombre": "Roberto Gómez Valdés",
    "email": "roberto.gomez@example.com",
    "telefono": "+56999887766"
  }
}
```

### 4.4. DELETE — Eliminar un cliente

**Endpoint:** `DELETE /api/clientes/:id`
**Descripción:** Elimina de la base de datos el registro del cliente identificado mediante su `id_cliente`.

**Comando cURL:**

```bash
curl -i -X DELETE http://localhost:3000/api/clientes/3
```

**Respuesta esperada (200 OK):**

```json
{
  "mensaje": "Cliente con ID 3 eliminado exitosamente"
}
```

**Verificación de la eliminación:**

Después de eliminar el cliente, se realiza una consulta para comprobar que el registro ya no existe.

```bash
curl -i http://localhost:3000/api/clientes/3
```

**Resultado esperado:** `404 Not Found`, con el mensaje `"El cliente con ID 3 no existe"`, lo que confirma su correcta eliminación.

---

## 5. Pasos para la ejecución local

Para ejecutar el proyecto en un entorno local, se deben seguir los siguientes pasos:

**Paso 1. Clonar el repositorio**

```bash
git clone https://github.com/errevegustavo/act9-api-cliente
cd act9-api-clientes
```

**Paso 2. Instalar las dependencias**

```bash
npm install
```

**Paso 3. Inicializar la base de datos**

```bash
node init-db.js
```

Este comando inicializa la base de datos SQLite y carga los datos semilla desde el archivo `schema.sql`.

**Paso 4. Iniciar el servidor**

```bash
npm start
```

Una vez iniciado el servidor, la API estará disponible localmente en: `http://localhost:3000`

---

## 6. Medidas de seguridad y buenas prácticas de backend

Durante el desarrollo se consideraron las siguientes medidas de seguridad y buenas prácticas:

- **Consultas parametrizadas** se utilizan marcadores de posición (`?`) en las consultas SQL a través del driver `sqlite3` para eliminar por completo el riesgo de ataques de Inyección SQL.
- **Validación en Backend:** captura del error de restricción de columna `UNIQUE` de SQLite, gestionado correctamente en el controlador para devolver el código HTTP correspondiente al conflicto.
- **Manejo de códigos de estado HTTP:** se emplean códigos de respuesta apropiados para comunicar el resultado de las operaciones:
  - `200 OK`: operación realizada correctamente.
  - `201 Created`: recurso (cliente) creado correctamente.
  - `400 Bad Request`: solicitud con datos inválidos o faltantes.
  - `404 Not Found`: recurso no encontrado en consultas, actualizaciones o eliminaciones.
  - `409 Conflict`: intento de registro o actualización con un email ya existente.
  - `500 Internal Server Error`: error interno del servidor o de base de datos.
- **Arquitectura por capas:** separación de responsabilidades en directorios lógicos (`config/`, `controllers/`, `routes/`) para facilitar la escalabilidad y mantenibilidad.
- **Protección de archivos sensibles:** se configuró `.gitignore` para evitar la subida de la carpeta `node_modules/`, la base de datos local `database.sqlite` y posibles archivos de entorno (`.env`) al repositorio público.

---

## 7. Conclusiones

El proyecto permitió implementar y probar una API REST utilizando Node.js, Express y SQLite3, permitiendo operaciones de CRUD de registros.

Además, se trabajó con un modelo de datos relacional, validaciones en el backend, integridad referencial, manejo de códigos de estado HTTP y consultas parametrizadas.

Las pruebas realizadas mediante cURL permiten verificar el comportamiento de los endpoints y comprobar las respuestas de la API ante operaciones exitosas y situaciones de error.