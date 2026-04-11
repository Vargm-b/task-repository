# Task Repository — Resumen de entregas

## T11.4 — Guardar clase y código en la base de datos (Valentina)

Descripción breve:
- Objetivo: Endpoint para crear una clase y guardar un código de acceso único en la base de datos.

Implementación actual (código usado por el servidor)
- Endpoint: `POST /api/classes`
- Flujo: `backend/src/modules/classes/class.controller.js` → `class.service.js` → inserción en la tabla `classes`.
- Campos esperados en el body (JSON):
	- `name` (string) — obligatorio
	- `teacher_id` (number) — obligatorio
	- `description` (string) — opcional
- Comportamiento: el backend genera un `access_code` único (6 caracteres alfanuméricos en mayúsculas) y lo guarda en la columna `access_code` de la tabla `classes`. La respuesta es el objeto de la fila creada (código HTTP `201`).

Demo rápido (pasos para compartir pantalla)
1. Iniciar el servidor:
```powershell
cd <ruta-del-repo>
node backend/src/server.js
```
2. Crear una clase (PowerShell):
```powershell
$body = @{name='ClaseDePrueba'; description='Demostración T11.4'; teacher_id=1} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3000/api/classes' -Method Post -ContentType 'application/json' -Body $body
```
o con `curl`:
```bash
curl -X POST http://localhost:3000/api/classes -H "Content-Type: application/json" -d '{"name":"ClaseDePrueba","description":"Demostración T11.4","teacher_id":1}'
```
3. Resultado esperado (ejemplo):
```json
{
	"id": 42,
	"name": "ClaseDePrueba",
	"description": "Demostración T11.4",
	"access_code": "A1B2C3",
	"teacher_id": 1,
	"created_at": "2026-04-11T12:34:56.000Z"
}
```
4. Verificar en la base de datos:
```sql
SELECT * FROM classes WHERE id = 42;
```

Tabla de ejemplo (Postgres):
```sql
CREATE TABLE classes (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	description TEXT,
	access_code VARCHAR(32) UNIQUE,
	teacher_id INTEGER,
	created_at TIMESTAMP DEFAULT NOW()
);
```

Notas importantes y recomendaciones
- Archivos clave: [backend/src/modules/classes/class.controller.js](backend/src/modules/classes/class.controller.js) y [backend/src/modules/classes/class.service.js](backend/src/modules/classes/class.service.js).
- Observación: existe también `backend/src/modules/classes/class.model.js` que contiene una función `createClass` alternativa y apunta a la tabla `virtual_class`; actualmente el controlador utiliza `class.service.js` (la implementación activa). Si quieres que la capa de datos esté aislada en `class.model.js`, puedo ayudarte a refactorizar `class.service.js` para usar `class.model.js`.
- Variables de entorno necesarias: `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_NAME`, `DB_PORT` (y `DB_SSL` si aplica). Asegúrate de no subir `.env`.
- Evidencia de avance (sprint): antes de limpiar ramas crea una rama de backup y haz `git push` para conservar los commits diarios (esto preserva las fechas/commits que necesitas para la bitácora).

Workflow Git recomendado (resumen)
- Crear rama por tarea desde `main`:
```bash
git checkout main
git pull origin main
git checkout -b valentina-T11.4
```
- Añadir solo los cambios relevantes y hacer `commit` / `push`.



