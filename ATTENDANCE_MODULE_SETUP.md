# Módulo de Attendance Analytics - Configuración y Prueba

## ✅ Cambios Implementados

He reemplazado completamente la página de Asistencia en el módulo Analytics para que ahora **cargue datos reales del backend** en lugar de datos mock.

### Archivo Modificado Principal

**`src/modules/analytics/pages/AnalyticsMainPage.tsx`**
- Línea 12: Ahora importa `AttendanceAnalyticsPage` en lugar de `AttendancePage`
- Línea 435: Ahora renderiza `<AttendanceAnalyticsPage />` que carga datos reales del API

## 🔧 Requisitos Previos

### 1. Backend Laravel debe estar ejecutándose

```bash
# El backend debe estar corriendo en:
http://127.0.0.1:8000
```

### 2. Endpoints del Backend Requeridos

Asegúrate de que estos endpoints estén disponibles:

```
GET http://127.0.0.1:8000/api/data-analyst/attendance
GET http://127.0.0.1:8000/api/data-analyst/attendance/stats/summary
GET http://127.0.0.1:8000/api/data-analyst/attendance/stats/by-student
GET http://127.0.0.1:8000/api/data-analyst/attendance/stats/by-group
GET http://127.0.0.1:8000/api/data-analyst/attendance/trend
GET http://127.0.0.1:8000/api/data-analyst/attendance/risk-analysis
GET http://127.0.0.1:8000/api/data-analyst/attendance/filters/options
```

### 3. Autenticación

La página requiere que el usuario esté autenticado. El token se toma automáticamente de `sessionStorage.getItem('auth_token')`.

## 🧪 Cómo Probar

### 1. Verificar que el Backend esté corriendo

```bash
# Desde la terminal, verifica que el backend responda:
curl http://127.0.0.1:8000/api/data-analyst/attendance/filters/options

# Debería devolver un JSON con grupos, cursos, etc.
```

### 2. Iniciar el Frontend

```bash
cd "/mnt/c/Users/anton/Desktop/PRODUCTO MIRKO/TechProc"
npm run dev
```

### 3. Navegar a la Página de Asistencia

1. Abrir el navegador en `http://localhost:5173` (o el puerto que use Vite)
2. Iniciar sesión en la aplicación
3. Ir a **Analytics → Asistencia**
4. La página debería:
   - Mostrar un spinner de carga
   - Cargar las tarjetas de resumen con datos reales
   - Mostrar tabs: Registros, Por Estudiante, Por Grupo, Tendencias, En Riesgo
   - Mostrar filtros funcionales

### 4. Verificar en Consola del Navegador

Abre DevTools (F12) y ve a la pestaña **Network**:
- Deberías ver peticiones a `/api/data-analyst/attendance/...`
- El status code debe ser `200 OK`
- Las respuestas deben contener datos JSON

## 🐛 Problemas Comunes y Soluciones

### Error: "Failed to fetch" o "Network Error"

**Causa:** El backend no está corriendo o hay un problema de CORS.

**Solución:**
```bash
# Verifica que el backend esté corriendo:
php artisan serve --host=127.0.0.1 --port=8000

# Verifica configuración de CORS en Laravel
```

### Error: 404 Not Found

**Causa:** Los endpoints no están registrados en el backend.

**Solución:**
- Verifica que el archivo `MODULO1_ATTENDANCE_IMPLEMENTATION.md` se haya implementado en el backend
- Verifica las rutas en `app/Domains/DataAnalyst/api.php`

### Error: 401 Unauthorized

**Causa:** Token de autenticación inválido o expirado.

**Solución:**
- Cierra sesión y vuelve a iniciar sesión
- Verifica que el middleware `DataAnalystMiddleware` esté configurado correctamente

### Error: La página muestra "Loading..." infinitamente

**Causa:** Error en la petición al backend que no se está manejando correctamente.

**Solución:**
- Abre la consola del navegador (F12)
- Busca errores en rojo
- Verifica las peticiones en la pestaña Network
- Revisa que la URL base sea correcta en `src/services/api.config.ts`

### No se muestran datos (página vacía)

**Causa:** El backend devuelve un array vacío porque no hay datos de asistencia.

**Solución:**
- Verifica que haya datos de asistencia en la base de datos
- Prueba con diferentes filtros
- Usa Postman o curl para verificar la respuesta del backend:
  ```bash
  curl -H "Authorization: Bearer YOUR_TOKEN" \
    http://127.0.0.1:8000/api/data-analyst/attendance
  ```

## 📊 Vistas Disponibles

### 1. **Registros** (Por defecto)
- Muestra cada registro individual de asistencia
- Incluye: estudiante, clase, grupo, curso, hora de entrada/salida, etc.
- Paginación de 20 registros por página

### 2. **Por Estudiante**
- Estadísticas agrupadas por estudiante
- Métricas: total de clases, asistidas, faltas, tasa de asistencia
- Clasificación por nivel de rendimiento y riesgo

### 3. **Por Grupo**
- Estadísticas agrupadas por grupo
- Métricas: total de estudiantes, registros, tasa de asistencia
- Clasificación por nivel de rendimiento

### 4. **Tendencias**
- Gráfico de tendencias temporales
- Análisis de dirección (mejorando/declinando/estable)
- Últimos 10 periodos visualizados

### 5. **En Riesgo**
- Estudiantes con baja asistencia
- Clasificación por nivel de riesgo (crítico/alto/medio)
- Recomendaciones personalizadas

## 🔄 Flujo de Datos

```
Usuario → AttendanceAnalyticsPage (React)
    ↓
attendanceService.ts
    ↓
apiRequest (con token de auth)
    ↓
http://127.0.0.1:8000/api/data-analyst/attendance/*
    ↓
Backend Laravel (AttendanceReportApiController)
    ↓
AttendanceAnalyticsRepository
    ↓
Base de Datos
    ↓
Respuesta JSON
    ↓
React actualiza estado y renderiza componentes
```

## 📝 Verificación Rápida

Para verificar que todo está funcionando, ejecuta estos comandos:

```bash
# 1. Verifica que el backend esté corriendo
curl http://127.0.0.1:8000/api/health

# 2. Verifica las opciones de filtros (no requiere auth en algunos casos)
curl http://127.0.0.1:8000/api/data-analyst/attendance/filters/options

# 3. Verifica el resumen (requiere token)
curl -H "Authorization: Bearer TU_TOKEN_AQUI" \
  http://127.0.0.1:8000/api/data-analyst/attendance/stats/summary
```

## 💡 Próximos Pasos

Si todo funciona correctamente:

1. ✅ Los datos se cargan del backend
2. ✅ Los filtros funcionan
3. ✅ Las diferentes vistas muestran información
4. ✅ La paginación funciona

Puedes entonces:
- Agregar más filtros personalizados
- Exportar datos a CSV/Excel
- Crear gráficos más avanzados
- Integrar con otros módulos

## 📞 Soporte

Si sigues teniendo problemas:

1. Revisa el archivo `README_ATTENDANCE.md` en `src/modules/analytics/`
2. Verifica el archivo `MODULO1_ATTENDANCE_IMPLEMENTATION.md` del backend
3. Revisa los logs del backend Laravel
4. Revisa la consola del navegador (F12)

---

**Última actualización:** 22 de Octubre, 2025
