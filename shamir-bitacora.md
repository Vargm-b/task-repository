# Bitácora de Desarrollo
**Author:** Shamir

---

## Día 1 (09/04/2026):

- **Avance:** Inicio y finalización de la tarea T13.1. Diseñé el formulario de creación y publicación de tareas.

- **Detalles:** Implementé la vista `create-assignment.html` con los campos: clase, título, descripción, puntaje máximo, fecha/hora límite y archivo adjunto (opcional). También creé los estilos base del sistema en `styles.css`, definiendo las variables CSS de la paleta de colores, tipografía y espaciado según los estándares UI acordados por el equipo en el Sprint 0.

- **Estado:** Done. Commit subido al repositorio.

---

## Día 2 (10/04/2026):

- **Avance:** Implementación de las tareas T13.2 y T13.3. Creé el endpoint `POST /api/assignments` en el backend y la persistencia en base de datos.

- **Detalles:** Implementé el módulo de assignments siguiendo la estructura y estilo de código establecido por Brenda en el módulo de classes: `assignment.routes.js`, `assignment.controller.js` y `assignment.service.js`. El service incluye validaciones de campos obligatorios (título, descripción, puntaje, fecha límite) y persiste la tarea en la tabla `assignments` de Supabase. Probé el endpoint con múltiples casos (datos válidos, campos faltantes, fecha pasada, puntaje inválido) y todos respondieron correctamente. También registré la ruta de assignments en `core/routes.js`.

- **Estado:** Done. Ambas tareas completadas, commit subido y PR actualizada.

---

## Día 3 (11/04/2026):

- **Avance:** Revisión del estado de la tarea T13.6 (validar flujo completo).

- **Detalles:** Revisé las dependencias de T13.6 que requiere que las tareas T13.4 (carga de archivos adjuntos) y T13.5 (aviso interno de nueva tarea) de Andre estén implementadas para poder validar el flujo de publicación de tareas de extremo a extremo. Consulté el estado actual de la base de datos en Supabase para verificar las tablas existentes y sus relaciones.

- **Estado:** T13.6 bloqueada hasta integración del trabajo de Andre. En espera.

---

## Día 4 (12/04/2026):

- **Avance:** Validación del flujo completo de publicación de tareas (T13.6), una vez mergeado el trabajo de Andre en main (T13.4 carga de adjuntos y T13.5 notificaciones).

- **Detalles:** Hice `git pull origin main` para traer las PRs #29 y #30 de Andre. Diseñé 4 casos de prueba para validar el flujo end-to-end y los corrí contra el backend: (1) tarea sin adjunto en una clase con estudiantes inscritos, (2) tarea con adjunto de prueba en la misma clase, (3) tarea con fecha límite pasada para verificar el rechazo, y (4) tarea en una clase sin inscritos. En todos los casos el comportamiento fue el esperado: los registros se crearon correctamente en `assignment` y `notification` cuando correspondía, el archivo quedó almacenado como BYTEA con sus metadatos (`attachment_name`, `attachment_mime`), y la transacción hizo rollback correctamente en el caso de la fecha inválida. No se encontraron bugs en el flujo.

- **Estado:** Done. T13.6 completada.
