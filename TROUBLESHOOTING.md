# Troubleshooting - Módulos de Analytics

## ✅ Problema Resuelto: Error en Progress Page

### Problema Original
```
Uncaught TypeError: Cannot read properties of undefined (reading 'toFixed')
at ProgressCard (ProgressCard.tsx:32:43)
```

### Causa
El componente `ProgressCard` antiguo esperaba datos con estructura `StudentProgress` (datos mock), pero ahora recibe `StudentProgressData` (datos reales del API).

### Solución Implementada
1. ✅ Creado nuevo componente `StudentProgressCard.tsx` que maneja la estructura real del API
2. ✅ Actualizado `ProgressAnalyticsPage.tsx` para usar el nuevo componente
3. ✅ Corregida la key única para evitar warnings de React (ahora usa `student_id-course_id-group_id`)
4. ✅ Agregado manejo de estado vacío

---

## 🧪 Cómo Verificar que Funciona

### 1. Verificar Backend

```bash
# Prueba el endpoint de progress
curl http://127.0.0.1:8000/api/data-analyst/progress/students

# Deberías ver una respuesta JSON como:
# {
#   "success": true,
#   "data": [
#     {
#       "student_id": 24,
#       "student_name": "Juan Pérez",
#       ...
#     }
#   ]
# }
```

### 2. Verificar Frontend

```bash
# Inicia el frontend
npm run dev
```

### 3. Navegar y Probar

1. Abre el navegador en `http://localhost:5173`
2. Inicia sesión
3. Ve a **Analytics → Progreso**
4. Deberías ver:
   - ✅ Tarjetas de estadísticas generales (4 tarjetas arriba)
   - ✅ Sección de "Tasa de Completación por Grupo"
   - ✅ Filtros (Curso y Nivel de Progreso)
   - ✅ Lista de estudiantes con tarjetas detalladas

### 4. Verificar en DevTools

Abre DevTools (F12) → Pestaña **Network**:

**Deberías ver estas peticiones:**
- `GET /api/data-analyst/progress/students` → Status 200
- `GET /api/data-analyst/progress/completion-rate` → Status 200

**Si ves errores:**
- 401: Problema de autenticación (revisa el token)
- 404: Endpoints no implementados en backend
- 500: Error en el backend (revisa logs de Laravel)

---

## 🔍 Posibles Problemas y Soluciones

### Problema 1: "No se muestran datos"

**Síntomas:**
- La página carga correctamente
- No hay errores en consola
- Muestra "Mostrando 0 de 0 estudiantes"

**Causas Posibles:**
1. No hay datos en la base de datos
2. El backend devuelve un array vacío

**Solución:**
```bash
# Verifica la respuesta del backend directamente:
curl -H "Authorization: Bearer TU_TOKEN" \
  http://127.0.0.1:8000/api/data-analyst/progress/students

# Si devuelve data: [], entonces no hay datos en BD
# Necesitas agregar datos de prueba en el backend
```

---

### Problema 2: "Loading infinito"

**Síntomas:**
- La página muestra el spinner de carga indefinidamente
- No carga ningún dato

**Causas Posibles:**
1. Error en la petición al backend
2. Backend no responde
3. CORS bloqueando la petición

**Solución:**
1. Abre DevTools (F12) → Consola
2. Busca errores en rojo
3. Ve a Network → busca las peticiones fallidas
4. Verifica que el backend esté corriendo en `http://127.0.0.1:8000`

```bash
# Verifica que el backend esté corriendo:
curl http://127.0.0.1:8000/api/health

# Debería responder con 200 OK
```

---

### Problema 3: "401 Unauthorized"

**Síntomas:**
- Error en consola: "401 Unauthorized"
- Las peticiones fallan con status 401

**Causa:**
El token de autenticación no es válido o expiró

**Solución:**
1. Cierra sesión
2. Vuelve a iniciar sesión
3. Verifica que el token se guarde en `sessionStorage`:
   ```javascript
   // En consola del navegador:
   sessionStorage.getItem('auth_token')
   // Debería devolver un string largo (el token)
   ```

---

### Problema 4: "404 Not Found"

**Síntomas:**
- Error en consola: "The route api/data-analyst/progress/students could not be found"
- Status 404 en Network

**Causa:**
Los endpoints no están implementados en el backend

**Solución:**
Verifica que el backend tenga implementados los endpoints según `indi.txt`:
```
GET /api/data-analyst/progress/students
GET /api/data-analyst/progress/students/{id}
GET /api/data-analyst/progress/by-group/{id}
GET /api/data-analyst/progress/completion-rate
GET /api/data-analyst/progress/timeline/{id}
```

---

### Problema 5: "Error de CORS"

**Síntomas:**
- Error en consola: "CORS policy: No 'Access-Control-Allow-Origin' header"
- Las peticiones fallan antes de llegar al backend

**Causa:**
El backend no permite peticiones desde el frontend

**Solución Laravel:**
```php
// En config/cors.php o middleware CORS
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:5173'],
```

---

## 📊 Estructura de Datos Esperada

### Response de `/api/data-analyst/progress/students`

```json
{
  "success": true,
  "data": [
    {
      "student_id": 24,
      "student_name": "Juan Pérez",
      "student_email": "juan.perez@student.inca.edu",
      "group_id": 1,
      "group_name": "Fundamentos de Programación - Grupo 1",
      "course_id": 1,
      "course_title": "Nuevo curso de Laravel",
      "final_grade": 16.42,
      "average_grade": 16.42,
      "program_status": "Passed",
      "attendance": {
        "total_classes": 16,
        "attended": 14,
        "rate": 87.5
      },
      "evaluations": {
        "total": 7,
        "completed": 0,
        "rate": 0
      },
      "overall_progress": 35,
      "progress_level": "poor",
      "status_label": "Desconocido"
    }
  ]
}
```

### Response de `/api/data-analyst/progress/completion-rate`

```json
{
  "success": true,
  "data": [
    {
      "group_id": 1,
      "group_name": "Fundamentos de Programación - Grupo 1",
      "course_id": 1,
      "course_title": "Nuevo curso de Laravel",
      "total_students": 12,
      "completed_students": 0,
      "in_progress_students": 0,
      "dropped_students": 0,
      "completion_rate": 0,
      "dropout_rate": 0,
      "avg_final_grade": 0,
      "status": "needs_attention"
    }
  ],
  "overall": {
    "total_groups": 5,
    "avg_completion_rate": 0,
    "avg_dropout_rate": 0,
    "total_students": 71,
    "total_completed": 0,
    "total_dropped": 0
  }
}
```

---

## ✅ Checklist de Verificación

Usa este checklist para verificar que todo esté funcionando:

- [ ] Backend corriendo en `http://127.0.0.1:8000`
- [ ] Endpoints implementados en backend (verificar con curl)
- [ ] Frontend corriendo en `http://localhost:5173`
- [ ] Usuario autenticado con token válido
- [ ] Navegar a Analytics → Progreso
- [ ] Ver estadísticas generales (4 tarjetas)
- [ ] Ver sección de completación por grupo
- [ ] Ver filtros funcionales
- [ ] Ver lista de estudiantes
- [ ] Sin errores en consola del navegador
- [ ] Peticiones con status 200 en Network

---

## 🆘 Si Nada Funciona

Si después de revisar todo lo anterior aún no funciona:

1. **Limpia caché del navegador:**
   - Ctrl + Shift + Delete
   - Selecciona "Cached images and files"
   - Clear data

2. **Reinicia todo:**
   ```bash
   # Detén el backend
   # Detén el frontend (Ctrl + C)

   # Reinicia el backend
   php artisan serve

   # Reinicia el frontend
   npm run dev
   ```

3. **Verifica que estés en la rama correcta:**
   ```bash
   git branch
   # Deberías estar en la rama dev
   ```

4. **Verifica las variables de entorno:**
   ```bash
   cat .env | grep VITE_API_BASE_URL
   # Debería mostrar: VITE_API_BASE_URL=http://127.0.0.1:8000/api
   ```

---

**Última actualización:** 22 de Octubre, 2025
