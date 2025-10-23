# Módulo de Análisis de Asistencia (Attendance Analytics)

## Descripción

Módulo completo de análisis de asistencia integrado con el backend Laravel. Proporciona visualizaciones detalladas, estadísticas y análisis predictivo de la asistencia de estudiantes.

## Estructura de Archivos

### Servicios (`services/`)

#### `attendanceService.ts`
Servicio completo que conecta con todos los endpoints del backend:

- `getAttendanceRecords(filters?)` - Obtiene registros de asistencia con paginación
- `getAttendanceSummary(filters?)` - Estadísticas generales de asistencia
- `getStatsByStudent(filters?)` - Estadísticas por estudiante
- `getStatsByGroup(filters?)` - Estadísticas por grupo
- `getAttendanceTrend(filters?)` - Análisis de tendencias temporales
- `getRiskAnalysis(threshold, filters?)` - Identificación de estudiantes en riesgo
- `getFilterOptions()` - Opciones disponibles para filtros

### Tipos (`types/index.ts`)

Tipos TypeScript completos que mapean las respuestas de la API:

#### Tipos Base
- `AttendedStatus` - 'YES' | 'NO'
- `ConnectionQuality` - 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | null
- `PerformanceLevel` - 'excellent' | 'good' | 'regular' | 'poor' | 'very_poor'
- `AttendanceRiskLevel` - 'low' | 'medium' | 'high' | 'critical'

#### Interfaces de Datos
- `AttendanceRecord` - Registro individual de asistencia
- `AttendanceSummary` - Resumen estadístico general
- `StudentAttendanceStats` - Estadísticas por estudiante
- `GroupAttendanceStats` - Estadísticas por grupo
- `TrendPeriod` - Datos de tendencia por periodo
- `RiskStudent` - Estudiante en riesgo con recomendaciones
- `FilterOptions` - Opciones para filtros

### Componentes (`components/`)

#### Filtros
**`AttendanceFilters.tsx`**
- Componente de filtros completo con todos los criterios
- Filtros por: grupo, curso, asistencia, calidad de conexión, rango de fechas
- Manejo de estado local y sincronización con padre
- Indicador visual de filtros activos

#### Visualización de Datos

**`AttendanceSummaryCards.tsx`**
- Tarjetas de resumen con métricas clave
- 6 tarjetas principales: Total, Asistencias, Faltas, Tasa, Tiempo Promedio, Salud
- 2 paneles informativos: Estado del Sistema y Calidad de Conexión
- Colores dinámicos según rendimiento

**`AttendanceRecordCard.tsx`**
- Tarjeta para mostrar un registro individual de asistencia
- Layout en grid responsive (4 columnas en desktop)
- Información de estudiante, clase, grupo, curso
- Estado de asistencia con íconos y colores
- Métricas de tiempo y calidad de conexión

**`StudentStatsCard.tsx`**
- Tarjeta de estadísticas por estudiante
- Badge de nivel de rendimiento con colores
- Grid de estadísticas: Total, Asistidas, Faltas, Tasa
- Barra de progreso visual
- Indicadores de riesgo y tiempo promedio

**`GroupStatsCard.tsx`**
- Tarjeta de estadísticas por grupo
- Información del curso y código de grupo
- Grid de métricas: Estudiantes, Registros, Asistencias
- Barra de progreso de tasa de asistencia
- Promedio de asistencia por estudiante

**`TrendChart.tsx`**
- Gráfico de tendencias con barras horizontales
- Análisis de tendencia: dirección, cambio porcentual
- Métricas: promedio general, primer periodo, periodo reciente
- Últimos 10 periodos visualizados
- Leyenda con código de colores

**`RiskStudentCard.tsx`**
- Tarjeta de estudiante en riesgo
- Badge de nivel de riesgo con colores
- Estadísticas completas de asistencia
- Advertencia de días sin asistir
- Lista de recomendaciones personalizadas

### Páginas (`pages/`)

**`AttendanceAnalyticsPage.tsx`**
Página principal con funcionalidad completa:

#### Características
- **5 Modos de Vista**: Registros, Por Estudiante, Por Grupo, Tendencias, En Riesgo
- **Sistema de Filtros**: Integrado con todas las vistas
- **Paginación**: Para vista de registros
- **Carga Dinámica**: Datos se actualizan según vista y filtros
- **Manejo de Estados**: Loading, error y vacío
- **Resumen Siempre Visible**: Estadísticas generales en todas las vistas

#### Estados Manejados
- `loading` - Estado de carga
- `error` - Mensajes de error
- `viewMode` - Vista actual activa
- `summary` - Resumen estadístico
- `records`, `studentStats`, `groupStats`, `trendData`, `riskStudents` - Datos por vista
- `filterOptions` - Opciones de filtros
- `filters` - Filtros activos
- `currentPage`, `totalPages` - Paginación

## Uso

### Importación en Routing

```tsx
import { AttendanceAnalyticsPage } from '@/modules/analytics/pages';

// En tu router
<Route path="/analytics/attendance" element={<AttendanceAnalyticsPage />} />
```

### Uso de Servicios

```typescript
import {
  getAttendanceRecords,
  getAttendanceSummary,
  getStatsByStudent,
} from '@/modules/analytics/services';

// Obtener resumen
const summary = await getAttendanceSummary({
  group_id: 3,
  date_from: '2025-01-01',
});

// Obtener estadísticas por estudiante
const studentStats = await getStatsByStudent({
  course_id: 2,
});

// Obtener estudiantes en riesgo
const riskAnalysis = await getRiskAnalysis(70, {
  group_id: 3,
});
```

### Uso de Componentes Individuales

```tsx
import {
  AttendanceFiltersComponent,
  StudentStatsCard,
  TrendChart,
} from '@/modules/analytics/components';

// Componente de filtros
<AttendanceFiltersComponent
  filters={filters}
  filterOptions={options}
  onFilterChange={handleFilterChange}
  onClear={handleClear}
/>

// Tarjeta de estadísticas
<StudentStatsCard student={studentData} />

// Gráfico de tendencias
<TrendChart data={trendData} analysis={analysis} />
```

## Endpoints Utilizados

Todos los endpoints están bajo el prefijo `/api/data-analyst/attendance`:

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/` | GET | Lista de registros con filtros y paginación |
| `/stats/summary` | GET | Estadísticas generales |
| `/stats/by-student` | GET | Estadísticas por estudiante |
| `/stats/by-group` | GET | Estadísticas por grupo |
| `/trend` | GET | Análisis de tendencias |
| `/risk-analysis` | GET | Estudiantes en riesgo |
| `/filters/options` | GET | Opciones para filtros |

## Filtros Disponibles

- `group_id` - ID del grupo
- `student_id` - ID del estudiante
- `course_id` - ID del curso
- `attended` - Estado de asistencia (YES/NO)
- `connection_quality` - Calidad de conexión (EXCELLENT/GOOD/FAIR/POOR)
- `date_from` - Fecha inicio
- `date_to` - Fecha fin
- `page` - Página actual (para paginación)
- `per_page` - Registros por página

## Características Técnicas

### Manejo de Autenticación
- Token de autenticación enviado automáticamente en headers
- Soporte para refresh token
- Redirección a login en caso de sesión expirada

### Optimizaciones
- Carga selectiva de datos según vista activa
- Paginación para grandes volúmenes de datos
- Filtros aplicados en backend
- Componentes reutilizables y modulares

### Responsive Design
- Diseño adaptable a móviles, tablets y desktop
- Grid layouts que se ajustan según pantalla
- Scroll horizontal para tabs en móviles

### UX/UI
- Estados de carga con spinner
- Mensajes de error informativos
- Indicadores visuales de rendimiento (colores)
- Badges y etiquetas para clasificaciones
- Barras de progreso animadas
- Iconos consistentes de FontAwesome

## Estilos

Todos los componentes utilizan:
- Tailwind CSS para estilos
- Gradientes consistentes: `from-secondary-500/60 to-secondary-600/60`
- Bordes: `border-gray-700/30`
- Hover states para interactividad
- Backdrop blur para efecto glassmorphism

## Colores de Rendimiento

### Tasa de Asistencia
- Verde (`green-500`): >= 80%
- Azul (`blue-500`): 70-80%
- Amarillo (`yellow-500`): 60-70%
- Rojo (`red-500`): < 60%

### Nivel de Riesgo
- Verde (`green-400`): Bajo
- Amarillo (`yellow-400`): Medio
- Naranja (`orange-400`): Alto
- Rojo (`red-400`): Crítico

### Calidad de Conexión
- Verde (`green-400`): EXCELLENT
- Azul (`blue-400`): GOOD
- Amarillo (`yellow-400`): FAIR
- Rojo (`red-400`): POOR

## Testing Recomendado

### Pruebas Funcionales
1. Verificar carga de datos en cada vista
2. Probar todos los filtros (individual y combinados)
3. Verificar paginación en vista de registros
4. Cambiar entre vistas y verificar persistencia de filtros
5. Probar con datos vacíos
6. Probar manejo de errores (desconectar backend)

### Pruebas de Integración
1. Verificar autenticación requerida
2. Probar con diferentes roles de usuario
3. Verificar tokens expirados
4. Probar límites de paginación
5. Verificar filtros con datos extremos

## Próximas Mejoras

- [ ] Exportación a CSV/Excel
- [ ] Gráficos más avanzados (Chart.js o Recharts)
- [ ] Comparación de periodos
- [ ] Alertas y notificaciones
- [ ] Descarga de reportes PDF
- [ ] Filtros guardados (favoritos)
- [ ] Vista de calendario
- [ ] Integración con módulo de notificaciones

## Dependencias

- React 19+
- TypeScript
- FontAwesome (iconos)
- Tailwind CSS
- API Backend Laravel

## Autor

Implementado siguiendo las especificaciones del documento `MODULO1_ATTENDANCE_IMPLEMENTATION.md`

---

**Última actualización:** 22 de Octubre, 2025
