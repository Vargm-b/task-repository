# Task Repository — Resumen de entregas

## T11.4 — Guardar clase y código en la base de datos (Valentina)

Descripción:
- Objetivo: Implementar el endpoint que recibe una clase (nombre, descripción), genera un código de acceso único y guarda la fila en la tabla `clases_valentina` en Supabase/Postgres.

Archivos relevantes:
- `valentina/backend/crear_tabla.js` — script que crea la tabla `clases_valentina`.
- `valentina/backend/server.js` — servidor Express con los endpoints:
	- `GET /clases` — listar clases.
	- `POST /api/clases` — crear clase y generar `codigo_acceso`.
- `valentina/backend/delete_test.js` — helper para eliminar registros de prueba.
- `.env` (local) — contiene credenciales; NO subirlo al repositorio.

Demo (guion de 4 pasos para compartir pantalla):
1. Iniciar servidor:
```powershell
cd valentina/backend
node server.js
```
2. Enviar datos de prueba (simular frontend):
```powershell
$body = @{nombre='ClaseDePrueba'; descripcion='Demostración T11.4'} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3000/api/clases' -Method Post -ContentType 'application/json' -Body $body
```
3. Mostrar el resultado en la terminal: buscar `status: "success"`, `data.id` y `data.codigo_acceso`.
4. (Opcional) Abrir el panel de Supabase y mostrar la tabla `clases_valentina` para confirmar la inserción.

Comandos útiles:
- Listar clases (GET):
```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/clases' -Method Get | ConvertTo-Json -Depth 5
```
- Borrar registro de prueba (helper):
```bash
node valentina/backend/delete_test.js <id_o_codigo_acceso>
```

Notas para el repo / seguridad:
- Asegúrate de que `.env` está en `.gitignore`. No subir credenciales públicas.
- Si `.env` ya fue pusheado, rota las credenciales en Supabase de inmediato.

Workflow Git recomendado:
- Crear rama por tarea: `git checkout -b mi-rama-t11.4`
- Añadir solo los archivos de código/documentación (no `.env`):
```bash
git add valentina/backend/crear_tabla.js valentina/backend/server.js valentina/backend/delete_test.js README.md
git commit -m "T11.4: POST /api/clases + crear_tabla + helper de prueba"
git push -u origin mi-rama-t11.4
```

Próximas tareas:
- En este README se irán agregando secciones para cada task completada (por ejemplo: `T07.1`, etc.).

