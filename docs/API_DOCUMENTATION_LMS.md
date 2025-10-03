# Documentación API - Módulo LMS (Learning Management System)

## Información General

**Base URL:** `https://lms-service-XXXXXX.run.app`
**Región GCP:** us-central1 (recomendado)
**Autenticación:** Bearer Token (JWT)
**Content-Type:** application/json
**Timeout:** 30 segundos

---

## Autenticación

Todas las peticiones (excepto login/registro) requieren un token JWT en el header:

```http
Authorization: Bearer <token>
```

### Obtener Token

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "role": "instructor"
    },
    "expires_in": 3600
  }
}
```

---

## Microservicios Requeridos

### 1. **lms-service** (Principal)
- Gestión de cursos, estudiantes, instructores
- Dashboard y estadísticas
- Inscripciones

### 2. **auth-service** (Autenticación)
- Login/Logout
- Generación y validación de tokens
- Gestión de sesiones

### 3. **storage-service** (Archivos)
- Upload de imágenes de perfil
- Archivos de curso (PDFs, videos)
- Cloud Storage integration

---

## Endpoints - Dashboard

### 1. Obtener Estadísticas del Dashboard

```http
GET /api/lms/stats
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "total_courses": 45,
    "published_courses": 38,
    "draft_courses": 7,
    "total_students": 1250,
    "active_enrollments": 3420,
    "total_instructors": 28
  }
}
```

### 2. Obtener Cursos Recientes

```http
GET /api/lms/courses/recent
```

**Query Parameters:**
- `limit` (opcional): Número de resultados (default: 10, max: 50)

**Headers:**
```http
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "course-123",
      "title": "Desarrollo Web Full Stack",
      "code": "WEB-101",
      "instructor_name": "Juan Pérez",
      "status": "publicado",
      "created_at": "2024-03-15T10:30:00Z"
    }
  ]
}
```

### 3. Obtener Inscripciones Recientes

```http
GET /api/lms/enrollments/recent
```

**Query Parameters:**
- `limit` (opcional): Número de resultados (default: 10, max: 50)

**Headers:**
```http
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "enrollment-123",
      "student_name": "Ana Torres",
      "student_email": "ana.torres@email.com",
      "course_title": "Desarrollo Web Full Stack",
      "enrolled_at": "2024-03-15T10:30:00Z"
    }
  ]
}
```

---

## Endpoints - Cursos

### 1. Listar Todos los Cursos

```http
GET /api/lms/courses
```

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Resultados por página (default: 20, max: 100)
- `status` (opcional): Filtrar por estado (`publicado`, `borrador`, `archivado`)
- `instructor_id` (opcional): Filtrar por instructor
- `search` (opcional): Búsqueda en título y código

**Headers:**
```http
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "course-123",
        "title": "Desarrollo Web Full Stack",
        "code": "WEB-101",
        "description": "Aprende a desarrollar aplicaciones web...",
        "instructor_id": "instructor-456",
        "instructor": {
          "id": "instructor-456",
          "first_name": "Juan",
          "last_name": "Pérez",
          "email": "juan.perez@email.com"
        },
        "duration_weeks": 12,
        "price": 1500.00,
        "status": "publicado",
        "created_at": "2024-01-15T08:00:00Z",
        "updated_at": "2024-03-10T14:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 100,
      "items_per_page": 20
    }
  }
}
```

### 2. Obtener Curso por ID

```http
GET /api/lms/courses/{course_id}
```

**Path Parameters:**
- `course_id` (requerido): ID del curso

**Headers:**
```http
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "course-123",
    "title": "Desarrollo Web Full Stack",
    "code": "WEB-101",
    "description": "Aprende a desarrollar aplicaciones web...",
    "instructor_id": "instructor-456",
    "instructor": {
      "id": "instructor-456",
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan.perez@email.com",
      "bio": "Desarrollador Full Stack con 10 años...",
      "expertise_area": "Desarrollo Web, JavaScript, React"
    },
    "duration_weeks": 12,
    "price": 1500.00,
    "status": "publicado",
    "created_at": "2024-01-15T08:00:00Z",
    "updated_at": "2024-03-10T14:30:00Z"
  }
}
```

**Response 404:**
```json
{
  "success": false,
  "error": {
    "code": "COURSE_NOT_FOUND",
    "message": "Curso no encontrado"
  }
}
```

### 3. Crear Nuevo Curso

```http
POST /api/lms/courses
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Desarrollo Web Full Stack",
  "code": "WEB-101",
  "description": "Aprende a desarrollar aplicaciones web desde cero...",
  "instructor_id": "instructor-456",
  "duration_weeks": 12,
  "price": 1500.00,
  "status": "borrador"
}
```

**Validaciones:**
- `title`: requerido, string, min: 5, max: 200
- `code`: requerido, string, único, pattern: /^[A-Z]+-\d+$/
- `description`: requerido, string, min: 20, max: 2000
- `instructor_id`: requerido, string, debe existir
- `duration_weeks`: requerido, integer, min: 1, max: 52
- `price`: requerido, number, min: 0
- `status`: requerido, enum: ['publicado', 'borrador', 'archivado']

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "course-789",
    "title": "Desarrollo Web Full Stack",
    "code": "WEB-101",
    "description": "Aprende a desarrollar aplicaciones web...",
    "instructor_id": "instructor-456",
    "duration_weeks": 12,
    "price": 1500.00,
    "status": "borrador",
    "created_at": "2024-03-15T10:30:00Z",
    "updated_at": "2024-03-15T10:30:00Z"
  }
}
```

**Response 400:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Error de validación",
    "details": [
      {
        "field": "code",
        "message": "El código ya existe"
      }
    ]
  }
}
```

### 4. Actualizar Curso

```http
PUT /api/lms/courses/{course_id}
```

**Path Parameters:**
- `course_id` (requerido): ID del curso

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** (todos los campos son opcionales)
```json
{
  "title": "Desarrollo Web Full Stack - Actualizado",
  "description": "Nueva descripción...",
  "price": 1800.00,
  "status": "publicado"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "course-123",
    "title": "Desarrollo Web Full Stack - Actualizado",
    "code": "WEB-101",
    "description": "Nueva descripción...",
    "instructor_id": "instructor-456",
    "duration_weeks": 12,
    "price": 1800.00,
    "status": "publicado",
    "created_at": "2024-01-15T08:00:00Z",
    "updated_at": "2024-03-15T11:00:00Z"
  }
}
```

### 5. Eliminar Curso

```http
DELETE /api/lms/courses/{course_id}
```

**Path Parameters:**
- `course_id` (requerido): ID del curso

**Headers:**
```http
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "message": "Curso eliminado exitosamente"
}
```

**Response 409:**
```json
{
  "success": false,
  "error": {
    "code": "COURSE_HAS_ENROLLMENTS",
    "message": "No se puede eliminar el curso porque tiene inscripciones activas"
  }
}
```

---

## Endpoints - Estudiantes

### 1. Listar Todos los Estudiantes

```http
GET /api/lms/students
```

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Resultados por página (default: 20, max: 100)
- `state` (opcional): Filtrar por estado (`activo`, `inactivo`)
- `search` (opcional): Búsqueda en nombre y email

**Headers:**
```http
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "students": [
      {
        "id": "student-123",
        "first_name": "Ana",
        "last_name": "Torres",
        "email": "ana.torres@email.com",
        "email_verified_at": "2024-01-15T10:00:00Z",
        "address": "Av. Arequipa 1234, Lima",
        "birth_date": "2000-05-15",
        "gender": "F",
        "country_location": "PE",
        "profile_photo": "https://storage.googleapis.com/...",
        "role": "student",
        "state": "activo",
        "last_access_ip": "192.168.1.1",
        "last_access": "2024-03-15T10:30:00Z",
        "created_at": "2024-01-01T08:00:00Z",
        "updated_at": "2024-03-15T10:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 63,
      "total_items": 1250,
      "items_per_page": 20
    }
  }
}
```

### 2. Obtener Estudiante por ID

```http
GET /api/lms/students/{student_id}
```

**Path Parameters:**
- `student_id` (requerido): ID del estudiante

**Headers:**
```http
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "student-123",
    "first_name": "Ana",
    "last_name": "Torres",
    "email": "ana.torres@email.com",
    "email_verified_at": "2024-01-15T10:00:00Z",
    "address": "Av. Arequipa 1234, Lima",
    "birth_date": "2000-05-15",
    "gender": "F",
    "country_location": "PE",
    "profile_photo": "https://storage.googleapis.com/...",
    "role": "student",
    "state": "activo",
    "last_access_ip": "192.168.1.1",
    "last_access": "2024-03-15T10:30:00Z",
    "created_at": "2024-01-01T08:00:00Z",
    "updated_at": "2024-03-15T10:30:00Z"
  }
}
```

### 3. Crear Nuevo Estudiante

```http
POST /api/lms/students
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "first_name": "Ana",
  "last_name": "Torres",
  "email": "ana.torres@email.com",
  "address": "Av. Arequipa 1234, Lima",
  "birth_date": "2000-05-15",
  "gender": "F",
  "country_location": "PE",
  "password": "SecurePassword123!",
  "state": "activo"
}
```

**Validaciones:**
- `first_name`: requerido, string, min: 2, max: 100
- `last_name`: requerido, string, min: 2, max: 100
- `email`: requerido, string, email válido, único
- `address`: requerido, string, max: 500
- `birth_date`: requerido, date, formato: YYYY-MM-DD
- `gender`: requerido, enum: ['M', 'F', 'Otro']
- `country_location`: requerido, string, código ISO (2 letras)
- `password`: requerido, string, min: 8, debe contener mayúsculas, minúsculas y números
- `state`: opcional, enum: ['activo', 'inactivo'], default: 'activo'

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "student-456",
    "first_name": "Ana",
    "last_name": "Torres",
    "email": "ana.torres@email.com",
    "email_verified_at": null,
    "address": "Av. Arequipa 1234, Lima",
    "birth_date": "2000-05-15",
    "gender": "F",
    "country_location": "PE",
    "profile_photo": null,
    "role": "student",
    "state": "activo",
    "created_at": "2024-03-15T11:00:00Z",
    "updated_at": "2024-03-15T11:00:00Z"
  }
}
```

### 4. Actualizar Estudiante

```http
PUT /api/lms/students/{student_id}
```

**Path Parameters:**
- `student_id` (requerido): ID del estudiante

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** (todos los campos son opcionales)
```json
{
  "first_name": "Ana María",
  "address": "Nueva dirección 456, Lima",
  "state": "inactivo"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "student-123",
    "first_name": "Ana María",
    "last_name": "Torres",
    "email": "ana.torres@email.com",
    "address": "Nueva dirección 456, Lima",
    "state": "inactivo",
    "updated_at": "2024-03-15T12:00:00Z"
  }
}
```

### 5. Eliminar Estudiante

```http
DELETE /api/lms/students/{student_id}
```

**Path Parameters:**
- `student_id` (requerido): ID del estudiante

**Headers:**
```http
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "message": "Estudiante eliminado exitosamente"
}
```

---

## Endpoints - Instructores

### 1. Listar Todos los Instructores

```http
GET /api/lms/instructors
```

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Resultados por página (default: 20, max: 100)
- `status` (opcional): Filtrar por estado (`activo`, `inactivo`, `suspendido`)
- `search` (opcional): Búsqueda en nombre, email y área de expertise

**Headers:**
```http
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "instructors": [
      {
        "id": "instructor-123",
        "first_name": "Juan",
        "last_name": "Pérez",
        "email": "juan.perez@email.com",
        "email_verified_at": "2024-01-10T08:00:00Z",
        "address": "Av. Universitaria 456, Lima",
        "birth_date": "1985-03-15",
        "gender": "M",
        "country_location": "PE",
        "profile_photo": "https://storage.googleapis.com/...",
        "role": "instructor",
        "state": "activo",
        "last_access_ip": "192.168.1.10",
        "last_access": "2024-03-15T14:20:00Z",
        "bio": "Desarrollador Full Stack con más de 10 años...",
        "expertise_area": "Desarrollo Web, JavaScript, React, Node.js",
        "status": "activo",
        "created_at": "2023-12-01T08:00:00Z",
        "updated_at": "2024-03-15T14:20:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 2,
      "total_items": 28,
      "items_per_page": 20
    }
  }
}
```

### 2. Obtener Instructor por ID

```http
GET /api/lms/instructors/{instructor_id}
```

**Path Parameters:**
- `instructor_id` (requerido): ID del instructor

**Headers:**
```http
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "instructor-123",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan.perez@email.com",
    "email_verified_at": "2024-01-10T08:00:00Z",
    "address": "Av. Universitaria 456, Lima",
    "birth_date": "1985-03-15",
    "gender": "M",
    "country_location": "PE",
    "profile_photo": "https://storage.googleapis.com/...",
    "role": "instructor",
    "state": "activo",
    "bio": "Desarrollador Full Stack con más de 10 años...",
    "expertise_area": "Desarrollo Web, JavaScript, React, Node.js",
    "status": "activo",
    "courses_count": 5,
    "students_count": 120,
    "created_at": "2023-12-01T08:00:00Z",
    "updated_at": "2024-03-15T14:20:00Z"
  }
}
```

### 3. Crear Nuevo Instructor

```http
POST /api/lms/instructors
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "first_name": "María",
  "last_name": "González",
  "email": "maria.gonzalez@email.com",
  "address": "Jr. Cusco 789, Lima",
  "birth_date": "1990-07-20",
  "gender": "F",
  "country_location": "PE",
  "password": "SecurePassword123!",
  "bio": "Especialista en Inteligencia Artificial...",
  "expertise_area": "Inteligencia Artificial, Machine Learning, Python",
  "status": "activo"
}
```

**Validaciones:**
- `first_name`: requerido, string, min: 2, max: 100
- `last_name`: requerido, string, min: 2, max: 100
- `email`: requerido, string, email válido, único
- `address`: requerido, string, max: 500
- `birth_date`: requerido, date, formato: YYYY-MM-DD
- `gender`: requerido, enum: ['M', 'F', 'Otro']
- `country_location`: requerido, string, código ISO (2 letras)
- `password`: requerido, string, min: 8
- `bio`: requerido, string, min: 50, max: 1000
- `expertise_area`: requerido, string, max: 500
- `status`: opcional, enum: ['activo', 'inactivo', 'suspendido'], default: 'activo'

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "instructor-456",
    "first_name": "María",
    "last_name": "González",
    "email": "maria.gonzalez@email.com",
    "bio": "Especialista en Inteligencia Artificial...",
    "expertise_area": "Inteligencia Artificial, Machine Learning, Python",
    "status": "activo",
    "created_at": "2024-03-15T12:00:00Z"
  }
}
```

### 4. Actualizar Instructor

```http
PUT /api/lms/instructors/{instructor_id}
```

**Path Parameters:**
- `instructor_id` (requerido): ID del instructor

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** (todos los campos son opcionales)
```json
{
  "bio": "Especialista en IA con PhD en Ciencias de la Computación",
  "expertise_area": "IA, ML, Deep Learning, Python, TensorFlow",
  "status": "activo"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "instructor-123",
    "first_name": "María",
    "last_name": "González",
    "bio": "Especialista en IA con PhD en Ciencias de la Computación",
    "expertise_area": "IA, ML, Deep Learning, Python, TensorFlow",
    "status": "activo",
    "updated_at": "2024-03-15T13:00:00Z"
  }
}
```

### 5. Eliminar Instructor

```http
DELETE /api/lms/instructors/{instructor_id}
```

**Path Parameters:**
- `instructor_id` (requerido): ID del instructor

**Headers:**
```http
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "message": "Instructor eliminado exitosamente"
}
```

**Response 409:**
```json
{
  "success": false,
  "error": {
    "code": "INSTRUCTOR_HAS_COURSES",
    "message": "No se puede eliminar el instructor porque tiene cursos asignados"
  }
}
```

---

## Endpoints - Inscripciones (Enrollments)

### 1. Listar Todas las Inscripciones

```http
GET /api/lms/enrollments
```

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Resultados por página (default: 20, max: 100)
- `status` (opcional): Filtrar por estado (`activo`, `completado`, `abandonado`)
- `student_id` (opcional): Filtrar por estudiante
- `course_id` (opcional): Filtrar por curso

**Headers:**
```http
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "id": "enrollment-123",
        "student_id": "student-456",
        "student": {
          "id": "student-456",
          "first_name": "Ana",
          "last_name": "Torres",
          "email": "ana.torres@email.com"
        },
        "course_id": "course-789",
        "course": {
          "id": "course-789",
          "title": "Desarrollo Web Full Stack",
          "code": "WEB-101"
        },
        "enrolled_at": "2024-03-15T10:30:00Z",
        "status": "activo",
        "progress": 45
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 171,
      "total_items": 3420,
      "items_per_page": 20
    }
  }
}
```

### 2. Obtener Inscripciones por Estudiante

```http
GET /api/lms/enrollments/student/{student_id}
```

**Path Parameters:**
- `student_id` (requerido): ID del estudiante

**Headers:**
```http
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "enrollment-123",
      "student_id": "student-456",
      "course_id": "course-789",
      "course": {
        "id": "course-789",
        "title": "Desarrollo Web Full Stack",
        "code": "WEB-101",
        "instructor_name": "Juan Pérez"
      },
      "enrolled_at": "2024-03-15T10:30:00Z",
      "status": "activo",
      "progress": 45
    }
  ]
}
```

### 3. Obtener Inscripciones por Curso

```http
GET /api/lms/enrollments/course/{course_id}
```

**Path Parameters:**
- `course_id` (requerido): ID del curso

**Headers:**
```http
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "enrollment-123",
      "student_id": "student-456",
      "student": {
        "id": "student-456",
        "first_name": "Ana",
        "last_name": "Torres",
        "email": "ana.torres@email.com",
        "profile_photo": "https://storage.googleapis.com/..."
      },
      "course_id": "course-789",
      "enrolled_at": "2024-03-15T10:30:00Z",
      "status": "activo",
      "progress": 45
    }
  ]
}
```

### 4. Crear Nueva Inscripción

```http
POST /api/lms/enrollments
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "student_id": "student-456",
  "course_id": "course-789",
  "status": "activo",
  "progress": 0
}
```

**Validaciones:**
- `student_id`: requerido, string, debe existir
- `course_id`: requerido, string, debe existir y estar publicado
- `status`: opcional, enum: ['activo', 'completado', 'abandonado'], default: 'activo'
- `progress`: opcional, integer, min: 0, max: 100, default: 0
- No puede existir una inscripción activa previa del mismo estudiante al mismo curso

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "enrollment-999",
    "student_id": "student-456",
    "course_id": "course-789",
    "enrolled_at": "2024-03-15T15:00:00Z",
    "status": "activo",
    "progress": 0
  }
}
```

**Response 409:**
```json
{
  "success": false,
  "error": {
    "code": "ENROLLMENT_ALREADY_EXISTS",
    "message": "El estudiante ya está inscrito en este curso"
  }
}
```

### 5. Actualizar Progreso de Inscripción

```http
PATCH /api/lms/enrollments/{enrollment_id}/progress
```

**Path Parameters:**
- `enrollment_id` (requerido): ID de la inscripción

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "progress": 65
}
```

**Validaciones:**
- `progress`: requerido, integer, min: 0, max: 100

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "enrollment-123",
    "student_id": "student-456",
    "course_id": "course-789",
    "enrolled_at": "2024-03-15T10:30:00Z",
    "status": "activo",
    "progress": 65
  }
}
```

### 6. Eliminar Inscripción

```http
DELETE /api/lms/enrollments/{enrollment_id}
```

**Path Parameters:**
- `enrollment_id` (requerido): ID de la inscripción

**Headers:**
```http
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "message": "Inscripción eliminada exitosamente"
}
```

---

## Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Petición exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Error en los datos enviados |
| 401 | Unauthorized - Token inválido o expirado |
| 403 | Forbidden - Sin permisos para realizar la acción |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Conflicto (ej: registro duplicado) |
| 422 | Unprocessable Entity - Error de validación |
| 500 | Internal Server Error - Error del servidor |
| 503 | Service Unavailable - Servicio temporalmente no disponible |

---

## Códigos de Error Personalizados

| Código | Descripción |
|--------|-------------|
| `VALIDATION_ERROR` | Error en la validación de datos |
| `AUTHENTICATION_FAILED` | Credenciales inválidas |
| `TOKEN_EXPIRED` | Token JWT expirado |
| `TOKEN_INVALID` | Token JWT inválido |
| `RESOURCE_NOT_FOUND` | Recurso no encontrado |
| `COURSE_NOT_FOUND` | Curso no encontrado |
| `STUDENT_NOT_FOUND` | Estudiante no encontrado |
| `INSTRUCTOR_NOT_FOUND` | Instructor no encontrado |
| `ENROLLMENT_NOT_FOUND` | Inscripción no encontrada |
| `DUPLICATE_ENTRY` | Registro duplicado |
| `ENROLLMENT_ALREADY_EXISTS` | Inscripción ya existe |
| `COURSE_HAS_ENROLLMENTS` | Curso tiene inscripciones activas |
| `INSTRUCTOR_HAS_COURSES` | Instructor tiene cursos asignados |
| `INSUFFICIENT_PERMISSIONS` | Permisos insuficientes |
| `RATE_LIMIT_EXCEEDED` | Límite de peticiones excedido |

---

## Rate Limiting

**Límites por tipo de usuario:**
- Usuario autenticado: 1000 peticiones / hora
- API Key de servicio: 10000 peticiones / hora

**Headers de respuesta:**
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1710504600
```

---

## Paginación

Todas las peticiones que retornen listas incluyen paginación:

**Parámetros de Query:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 20, max: 100)

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "current_page": 1,
      "total_pages": 10,
      "total_items": 200,
      "items_per_page": 20,
      "has_next": true,
      "has_previous": false
    }
  }
}
```

---

## Filtrado y Búsqueda

**Parámetros comunes:**
- `search`: Búsqueda por texto (busca en múltiples campos)
- `sort_by`: Campo por el cual ordenar (ej: `created_at`, `title`)
- `sort_order`: Orden (`asc` o `desc`)

**Ejemplo:**
```http
GET /api/lms/courses?search=web&sort_by=created_at&sort_order=desc&page=1&limit=20
```

---

## Variables de Entorno Requeridas

```env
# Frontend (.env)
VITE_API_BASE_URL=https://lms-service-XXXXXX.run.app

# Backend (Cloud Run)
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=3600
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_STORAGE_BUCKET=your-bucket-name
CORS_ORIGIN=https://yourfrontend.com
```

---

## Configuración Cloud Run

**Dockerfile ejemplo:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]
```

**deploy.yaml:**
```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: lms-service
spec:
  template:
    spec:
      containers:
      - image: gcr.io/PROJECT_ID/lms-service
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-url
              key: url
        resources:
          limits:
            memory: 512Mi
            cpu: 1000m
```

**Deployment:**
```bash
# Build
gcloud builds submit --tag gcr.io/PROJECT_ID/lms-service

# Deploy
gcloud run deploy lms-service \
  --image gcr.io/PROJECT_ID/lms-service \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1
```

---

## Notas de Implementación

1. **Base de Datos:** PostgreSQL en Cloud SQL con conexión via Unix Socket o Cloud SQL Proxy
2. **Autenticación:** JWT con RS256 (par de llaves pública/privada)
3. **Storage:** Google Cloud Storage para archivos (imágenes, PDFs, videos)
4. **Logs:** Cloud Logging integrado automáticamente
5. **Monitoring:** Cloud Monitoring para métricas y alertas
6. **Secrets:** Secret Manager para credenciales sensibles
7. **CORS:** Configurar dominios permitidos según entorno
8. **SSL/TLS:** Manejado automáticamente por Cloud Run

---

## Contacto y Soporte

Para dudas sobre la implementación del API:
- Documentación completa: Ver carpeta `/docs`
- Issues: Reportar en el repositorio del proyecto
- Ambiente de pruebas disponible en: `https://lms-service-dev-XXXXXX.run.app`

---

**Versión:** 1.0.0
**Última actualización:** Marzo 2024
**Mantenido por:** Equipo de Desarrollo TechProc
