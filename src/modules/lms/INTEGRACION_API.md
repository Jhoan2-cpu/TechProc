# Integración con API Backend - Módulo LMS

## Resumen de Cambios

Se ha actualizado el módulo LMS para integrar todos los servicios con la API backend documentada en `DOCUMENTACION_BACKEND_API.md`.

## Servicios Actualizados

### 1. Cursos (coursesService.ts) ✅
- **GET /lms/courses** - Listar cursos con filtros
- **GET /lms/courses/{course_id}** - Obtener detalles de curso
- **POST /lms/courses** - Crear curso
- **PUT /lms/courses/{course_id}** - Actualizar curso
- **DELETE /lms/courses/{course_id}** - Eliminar curso

### 2. Estudiantes (studentsService.ts) ✅
- **GET /lms/students** - Listar estudiantes con filtros
- **GET /lms/students/{student_id}** - Obtener detalles de estudiante
- **POST /lms/students** - Crear estudiante
- **PUT /lms/students/{student_id}** - Actualizar estudiante
- **DELETE /lms/students/{student_id}** - Eliminar estudiante

### 3. Instructores (instructorsService.ts) ✅
- **GET /lms/instructors** - Listar instructores con filtros
- **POST /lms/instructors** - Crear instructor
- **PUT /lms/instructors/{instructor_id}** - Actualizar instructor
- ⚠️ **DELETE** - No soportado por la API

### 4. Matrículas (enrollmentsService.ts) ✅
- **GET /lms/enrollments** - Listar matrículas con filtros
- **POST /lms/enrollments** - Crear matrícula
- ⚠️ **Actualizar progreso** - No soportado por la API
- ⚠️ **DELETE** - No soportado por la API

### 5. Categorías (categoriesService.ts) ✅ NUEVO
- **GET /lms/categories** - Listar categorías de cursos

### 6. Dashboard LMS (lmsService.ts) ✅
- **GET /analytics/students/stats** - Estadísticas de estudiantes
- **GET /analytics/courses/stats** - Estadísticas de cursos
- Combina múltiples endpoints para obtener datos del dashboard

## Características Implementadas

### Mapeo de Datos
Todos los servicios incluyen funciones de mapeo para convertir datos de la API al formato del frontend:
- `mapApiCourseToCourse()` - Convierte cursos de la API
- `mapApiStudentToStudent()` - Convierte estudiantes de la API
- `mapApiInstructorToInstructor()` - Convierte instructores de la API
- `mapApiEnrollmentToEnrollment()` - Convierte matrículas de la API
- `mapApiCategoryToCategory()` - Convierte categorías de la API

### Filtros y Paginación
Todos los endpoints soportan:
- Paginación (page, limit)
- Búsqueda (search)
- Filtros específicos por módulo
- Query parameters dinámicos

### Manejo de Errores
- Try-catch en todas las operaciones
- Logs de errores en consola
- Mensajes informativos al usuario

## Componentes Actualizados

### Páginas
- ✅ **CoursesPage.tsx** - Usa coursesService con API
- ✅ **StudentsPage.tsx** - Usa studentsService con API
- ✅ **InstructorsPage.tsx** - Usa instructorsService con API
- ✅ **LMSPage.tsx** - Usa lmsService con API para dashboard

### Handlers Async
Todos los handlers ahora son asíncronos y llaman a la API:
- `handleCreateCourse()` / `handleCreateStudent()` / `handleCreateInstructor()`
- `handleEditCourse()` / `handleEditStudent()` / `handleEditInstructor()`
- `handleDeleteCourse()` / `handleDeleteStudent()` / `handleDeleteInstructor()`

## Tipos TypeScript Actualizados

Se actualizó `src/modules/lms/types/index.ts` para incluir:
- Tipos de la API (ApiCategory, ApiInstructor, ApiContent)
- Tipos de detalles de curso (CourseDetail)
- Compatibilidad con versiones anteriores

## Pendientes (TODOs)

Los siguientes elementos están marcados con TODO en el código:

### 1. Adaptación de Datos en Crear/Editar
Los modales de creación y edición envían datos en formato del frontend. Se necesita:
- Adaptar formato de Course al formato CreateCourseData de la API
- Adaptar formato de Student al formato CreateStudentData de la API
- Adaptar formato de Instructor al formato CreateInstructorData de la API

**Ubicación:**
- `src/modules/lms/pages/CoursesPage.tsx:35-36`
- `src/modules/lms/pages/CoursesPage.tsx:48-49`
- `src/modules/lms/pages/StudentsPage.tsx:78-79`
- `src/modules/lms/pages/StudentsPage.tsx:90-91`
- `src/modules/lms/pages/InstructorsPage.tsx:70-71`
- `src/modules/lms/pages/InstructorsPage.tsx:82-83`

### 2. Modales de Creación/Edición
Los modales necesitan ajustes para:
- Enviar datos en el formato correcto de la API
- Incluir todos los campos requeridos por la API
- Manejar campos opcionales

**Archivos a revisar:**
- `src/modules/lms/components/CreateCourseModal.tsx`
- `src/modules/lms/components/CreateStudentModal.tsx`
- `src/modules/lms/components/CreateInstructorModal.tsx`
- `src/modules/lms/components/EditStudentModal.tsx`
- `src/modules/lms/components/EditInstructorModal.tsx`

### 3. Obtener Lista de Instructores para Select
En CreateCourseModal, el select de instructores tiene opciones hardcodeadas:
```tsx
<option value="1">Juan Pérez - Desarrollo Web</option>
```

**Solución:**
- Obtener lista de instructores desde `instructorsService.getAll()`
- Poblar dinámicamente las opciones del select

## Ejemplos de Uso

### Listar Cursos con Filtros
```typescript
const { courses, pagination } = await coursesService.getAll({
  page: 1,
  limit: 20,
  level: 'basic',
  status: true,
  search: 'Python'
});
```

### Crear Estudiante
```typescript
const newStudent = await studentsService.create({
  user_id: 123,
  company_id: 5,
  document_number: '12345678',
  first_name: 'Juan',
  last_name: 'Pérez',
  email: 'juan@ejemplo.com',
  phone: '+51 987654321',
  status: 'active'
});
```

### Obtener Estadísticas del Dashboard
```typescript
const stats = await lmsService.getStats();
// Devuelve: { total_courses, published_courses, draft_courses,
//             total_students, active_enrollments, total_instructors }
```

## Configuración

La URL base de la API se configura en `src/services/api.config.ts`:
```typescript
BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
```

Asegúrate de configurar la variable de entorno `VITE_API_BASE_URL` en tu archivo `.env`.

## Testing

Para probar la integración:

1. Asegúrate de que el backend esté corriendo
2. Configura la URL del backend en `.env`
3. Navega a las secciones del módulo LMS:
   - Dashboard: `/lms`
   - Cursos: `/lms/courses`
   - Estudiantes: `/lms/students`
   - Instructores: `/lms/instructors`

## Notas Importantes

1. **Eliminación de Instructores:** La API no soporta la eliminación de instructores. El botón de eliminar muestra un mensaje de error.

2. **Progreso de Matrículas:** La API no proporciona información de progreso. Se inicializa en 0 localmente.

3. **Instructor en Cursos:** El campo `instructor_id` en Course se mantiene para compatibilidad, pero la API usa un array de instructores.

4. **Status de Cursos:** La API usa `status: boolean`, el frontend usa `status: 'publicado' | 'borrador' | 'archivado'`. El mapeo se hace automáticamente.

5. **Duración de Cursos:** La API maneja duración en días, el frontend en semanas. Se convierte automáticamente.
