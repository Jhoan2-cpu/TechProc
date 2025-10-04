# TechProc - Especificación de API Backend

**Versión:** 1.0.0
**Fecha:** 2025-01-10
**Estado:** Desarrollo

---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Información General](#información-general)
3. [Autenticación y Seguridad](#autenticación-y-seguridad)
4. [Headers Comunes](#headers-comunes)
5. [Códigos de Respuesta HTTP](#códigos-de-respuesta-http)
6. [Manejo de Errores](#manejo-de-errores)
7. [Endpoints - Autenticación](#endpoints---autenticación)
8. [Endpoints - LMS](#endpoints---lms)
9. [Schemas de Datos](#schemas-de-datos)
10. [Notas de Implementación](#notas-de-implementación)

---

## Introducción

Este documento especifica la API REST que debe implementar el backend para dar soporte al frontend de TechProc. El frontend está completamente desarrollado y configurado para consumir estos endpoints.

### Alcance

El sistema TechProc es una plataforma modular de gestión empresarial con los siguientes módulos:

- **Autenticación**: Sistema de login/registro con JWT
- **LMS (Learning Management System)**: Gestión de cursos, estudiantes, instructores y matrículas
- **Users**: Gestión de usuarios del sistema
- **Tickets**: Sistema de tickets de soporte
- **Security**: Módulo de seguridad
- **Infrastructure**: Gestión de infraestructura
- **Web**: Gestión de contenido web
- **Analytics**: Analítica y reportes

**Nota:** Este documento cubre los módulos de Autenticación y LMS, que están completamente implementados en el frontend.

---

## Información General

### Base URL

```
https://api.techproc.com/v1
```

**Ambiente de Desarrollo:**
```
http://localhost:3000/api/v1
```

### Formato de Datos

- **Content-Type**: `application/json`
- **Charset**: UTF-8
- **Fecha/Hora**: ISO 8601 (Ejemplo: `2024-03-15T10:30:00Z`)

### Paginación

Para endpoints que retornan listas, se recomienda implementar paginación:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

---

## Autenticación y Seguridad

### Método de Autenticación

El sistema utiliza **JWT (JSON Web Tokens)** para autenticación.

### Flujo de Autenticación

1. Usuario envía credenciales a `/auth/login`
2. Backend valida y retorna JWT + Refresh Token
3. Frontend almacena tokens en localStorage
4. Frontend envía JWT en header `Authorization` en cada request
5. Cuando el JWT expira, frontend usa el refresh token

### Tokens

**Access Token (JWT):**
- Duración recomendada: 1-2 horas
- Incluir claims: `userId`, `role`, `exp`, `iat`

**Refresh Token:**
- Duración recomendada: 7-30 días
- Debe ser rotado al usarse

### Roles de Usuario

```typescript
type UserRole =
  | 'administrador'           // Acceso total
  | 'gestor_lms'             // Solo LMS
  | 'soporte_seguridad'      // Tickets + Security
  | 'soporte_infraestructura'// Tickets + Infrastructure
  | 'developer_web'          // Web + Tickets
  | 'analista_datos'         // Solo Analytics
```

### Permisos por Módulo

| Rol | Users | LMS | Tickets | Security | Infrastructure | Web | Analytics |
|-----|-------|-----|---------|----------|----------------|-----|-----------|
| administrador | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| gestor_lms | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| soporte_seguridad | ✗ | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ |
| soporte_infraestructura | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ | ✗ |
| developer_web | ✗ | ✗ | ✓ | ✗ | ✗ | ✓ | ✗ |
| analista_datos | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

---

## Headers Comunes

### Request Headers

```http
Content-Type: application/json
Authorization: Bearer {access_token}
Accept: application/json
```

### Response Headers

```http
Content-Type: application/json; charset=utf-8
X-Request-ID: {unique_request_id}
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
```

---

## Códigos de Respuesta HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Request exitoso |
| 201 | Created | Recurso creado exitosamente |
| 204 | No Content | Request exitoso sin contenido (DELETE) |
| 400 | Bad Request | Error en formato/validación |
| 401 | Unauthorized | Token inválido o expirado |
| 403 | Forbidden | Sin permisos para el recurso |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Conflicto (ej: email duplicado) |
| 422 | Unprocessable Entity | Error de validación de datos |
| 429 | Too Many Requests | Rate limit excedido |
| 500 | Internal Server Error | Error del servidor |
| 503 | Service Unavailable | Servicio temporalmente no disponible |

---

## Manejo de Errores

### Formato de Respuesta de Error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Error de validación en los datos enviados",
    "details": [
      {
        "field": "email",
        "message": "Email inválido"
      },
      {
        "field": "password",
        "message": "La contraseña debe tener al menos 6 caracteres"
      }
    ],
    "timestamp": "2024-03-15T10:30:00Z",
    "request_id": "req_abc123"
  }
}
```

### Códigos de Error Comunes

| Código | Descripción |
|--------|-------------|
| `VALIDATION_ERROR` | Error de validación de datos |
| `AUTHENTICATION_FAILED` | Credenciales inválidas |
| `TOKEN_EXPIRED` | Token JWT expirado |
| `TOKEN_INVALID` | Token JWT inválido |
| `UNAUTHORIZED` | No autenticado |
| `FORBIDDEN` | Sin permisos |
| `NOT_FOUND` | Recurso no encontrado |
| `CONFLICT` | Conflicto (duplicado) |
| `RATE_LIMIT_EXCEEDED` | Límite de requests excedido |
| `INTERNAL_ERROR` | Error interno del servidor |

---
##########################################################
##########################################################
##########################################################
##########################################################
## Endpoints - Autenticación

### 1. Login

Autentica un usuario y retorna tokens de acceso.

**Endpoint:** `POST /auth/login`

**Headers:**
```http
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@techproc.com",
  "password": "admin123"
}
```

**Validaciones:**
- `email`: Requerido, formato email válido
- `password`: Requerido, mínimo 6 caracteres

**Response 200 - Success:**
```json
{
  "user": {
    "id": "1",
    "username": "admin",
    "email": "admin@techproc.com",
    "role": "administrador",
    "name": "Administrador",
    "first_name": "Super",
    "last_name": "Admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 401 - Credenciales Inválidas:**
```json
{
  "error": {
    "code": "AUTHENTICATION_FAILED",
    "message": "Credenciales inválidas"
  }
}
```

**Response 422 - Validación:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Error de validación",
    "details": [
      {
        "field": "email",
        "message": "Email inválido"
      }
    ]
  }
}
```

---

### 2. Register

Registra un nuevo usuario en el sistema.

**Endpoint:** `POST /auth/register`

**Headers:**
```http
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "nuevo@techproc.com",
  "password": "password123",
  "first_name": "Nuevo",
  "last_name": "Usuario",
  "role": "analista_datos"
}
```

**Validaciones:**
- `email`: Requerido, formato email válido, único
- `password`: Requerido, mínimo 6 caracteres
- `first_name`: Requerido, 2-50 caracteres
- `last_name`: Requerido, 2-50 caracteres
- `role`: Opcional, valores válidos de UserRole

**Response 201 - Success:**
```json
{
  "user": {
    "id": "7",
    "username": "nuevo",
    "email": "nuevo@techproc.com",
    "role": "analista_datos",
    "name": "Nuevo Usuario",
    "first_name": "Nuevo",
    "last_name": "Usuario"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 409 - Email Duplicado:**
```json
{
  "error": {
    "code": "CONFLICT",
    "message": "El email ya está registrado"
  }
}
```

---

### 3. Logout

Invalida el token actual del usuario.

**Endpoint:** `POST /auth/logout`

**Headers:**
```http
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{}
```

**Response 204 - Success:**
```
(Sin contenido)
```

**Nota:** El backend debe invalidar/blacklist el token recibido.

---

### 4. Refresh Token

Obtiene un nuevo access token usando el refresh token.

**Endpoint:** `POST /auth/refresh`

**Headers:**
```http
Content-Type: application/json
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200 - Success:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 401 - Token Inválido:**
```json
{
  "error": {
    "code": "TOKEN_INVALID",
    "message": "Refresh token inválido o expirado"
  }
}
```

---

### 5. Verify Token

Verifica si un token es válido y retorna el usuario.

**Endpoint:** `POST /auth/verify`

**Headers:**
```http
Content-Type: application/json
```

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200 - Success:**
```json
{
  "id": "1",
  "username": "admin",
  "email": "admin@techproc.com",
  "role": "administrador",
  "name": "Administrador",
  "first_name": "Super",
  "last_name": "Admin"
}
```

**Response 401 - Token Inválido:**
```json
{
  "error": {
    "code": "TOKEN_INVALID",
    "message": "Token inválido o expirado"
  }
}
```

---

## Endpoints - LMS

### Dashboard

#### 1. Obtener Estadísticas LMS
GET http://127.0.0.1/lms/stats

**Endpoint:** `GET /lms/stats`

**Headers:**
```http
Authorization: Bearer {access_token}
```

**Permisos:** `administrador`, `gestor_lms`

**Response 200:**
```json
{
  "total_courses": 477,
  "published_courses": 38,
  "draft_courses": 7,
  "total_students": 1250,
  "active_enrollments": 3420,
  "total_instructors": 28
}
```

---

#### 2. Obtener Cursos Recientes

**Endpoint:** `GET /lms/courses/recent`

**Headers:**
```http
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `limit`: Opcional, número de resultados (default: 5)

**Permisos:** `administrador`, `gestor_lms`

**Response 200:**
```json
[
  {
    "id": "1",
    "title": "Desarrollo Web Full Stack",
    "code": "WEB-101",
    "instructor_name": "Juan Pérez",
    "status": "publicado",
    "created_at": "2024-03-15T00:00:00Z"
  },
  {
    "id": "2",
    "title": "Inteligencia Artificial",
    "code": "IA-201",
    "instructor_name": "María González",
    "status": "publicado",
    "created_at": "2024-03-14T00:00:00Z"
  }
]
```

---

#### 3. Obtener Inscripciones Recientes

**Endpoint:** `GET /lms/enrollments/recent`

**Headers:**
```http
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `limit`: Opcional, número de resultados (default: 5)

**Permisos:** `administrador`, `gestor_lms`

**Response 200:**
```json
[
  {
    "id": "1",
    "student_name": "Ana Torres",
    "student_email": "ana.torres@email.com",
    "course_title": "Desarrollo Web Full Stack",
    "enrolled_at": "2024-03-15T10:30:00Z"
  }
]
```

---

### Cursos

#### 1. Listar Todos los Cursos

**Endpoint:** `GET /lms/courses`

**Headers:**
```http
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `status`: Opcional, filtrar por estado (`publicado`, `borrador`, `archivado`)
- `instructor_id`: Opcional, filtrar por instructor
- `page`: Opcional, número de página
- `per_page`: Opcional, resultados por página

**Permisos:** `administrador`, `gestor_lms`

**Response 200:**
```json
[
  {
    "id": "1",
    "title": "Desarrollo Web Full Stack",
    "code": "WEB-101",
    "description": "Aprende a desarrollar aplicaciones web desde cero con las últimas tecnologías.",
    "instructor_id": "1",
    "instructor": {
      "id": "1",
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan.perez@email.com",
      "bio": "Desarrollador Full Stack con más de 10 años de experiencia.",
      "expertise_area": "Desarrollo Web, JavaScript, React, Node.js",
      "status": "activo"
    },
    "duration_weeks": 12,
    "price": 1500.00,
    "status": "publicado",
    "created_at": "2024-01-15T00:00:00Z",
    "updated_at": "2024-03-10T00:00:00Z"
  }
]
```

---

#### 2. Obtener Curso por ID

**Endpoint:** `GET /lms/courses/{id}`

**Headers:**
```http
Authorization: Bearer {access_token}
```

**Permisos:** `administrador`, `gestor_lms`

**Response 200:**
```json
{
  "id": "1",
  "title": "Desarrollo Web Full Stack",
  "code": "WEB-101",
  "description": "Aprende a desarrollar aplicaciones web desde cero.",
  "instructor_id": "1",
  "instructor": {
    "id": "1",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan.perez@email.com",
    "bio": "Desarrollador Full Stack",
    "expertise_area": "Desarrollo Web",
    "status": "activo"
  },
  "duration_weeks": 12,
  "price": 1500.00,
  "status": "publicado",
  "created_at": "2024-01-15T00:00:00Z",
  "updated_at": "2024-03-10T00:00:00Z"
}
```

**Response 404:**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Curso no encontrado"
  }
}
```

---

#### 3. Crear Curso

**Endpoint:** `POST /lms/courses`

**Headers:**
```http
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Permisos:** `administrador`, `gestor_lms`

**Request Body:**
```json
{
  "title": "Nuevo Curso",
  "code": "NVO-001",
  "description": "Descripción del curso",
  "instructor_id": "1",
  "duration_weeks": 8,
  "price": 1200.00,
  "status": "borrador"
}
```

**Validaciones:**
- `title`: Requerido, 3-200 caracteres
- `code`: Requerido, único, 3-20 caracteres
- `description`: Requerido, 10-1000 caracteres
- `instructor_id`: Requerido, debe existir
- `duration_weeks`: Requerido, número positivo
- `price`: Requerido, número >= 0
- `status`: Requerido, valores: `publicado`, `borrador`, `archivado`

**Response 201:**
```json
{
  "id": "5",
  "title": "Nuevo Curso",
  "code": "NVO-001",
  "description": "Descripción del curso",
  "instructor_id": "1",
  "duration_weeks": 8,
  "price": 1200.00,
  "status": "borrador",
  "created_at": "2024-03-15T10:30:00Z",
  "updated_at": "2024-03-15T10:30:00Z"
}
```

---

#### 4. Actualizar Curso

**Endpoint:** `PUT /lms/courses/{id}`

**Headers:**
```http
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Permisos:** `administrador`, `gestor_lms`

**Request Body:**
```json
{
  "title": "Título Actualizado",
  "price": 1800.00,
  "status": "publicado"
}
```

**Response 200:**
```json
{
  "id": "1",
  "title": "Título Actualizado",
  "code": "WEB-101",
  "description": "Descripción original",
  "instructor_id": "1",
  "duration_weeks": 12,
  "price": 1800.00,
  "status": "publicado",
  "created_at": "2024-01-15T00:00:00Z",
  "updated_at": "2024-03-15T10:30:00Z"
}
```

---

#### 5. Eliminar Curso

**Endpoint:** `DELETE /lms/courses/{id}`

**Headers:**
```http
Authorization: Bearer {access_token}
```

**Permisos:** `administrador`, `gestor_lms`

**Response 204:**
```
(Sin contenido)
```

**Nota:** Considerar soft-delete o validar que no tenga inscripciones activas.

---

### Estudiantes

#### 1. Listar Estudiantes

**Endpoint:** `GET /lms/students`

**Headers:**
```http
Authorization: Bearer {access_token}
```

**Permisos:** `administrador`, `gestor_lms`

**Response 200:**
```json
[
  {
    "id": "1",
    "first_name": "Ana",
    "last_name": "Torres",
    "email": "ana.torres@email.com",
    "email_verified_at": "2024-01-15T00:00:00Z",
    "address": "Av. Arequipa 1234, Lima",
    "birth_date": "2000-05-15",
    "gender": "F",
    "country_location": "PE",
    "profile_photo": null,
    "role": "student",
    "state": "activo",
    "last_access_ip": "192.168.1.1",
    "last_access": "2024-03-15T10:30:00Z",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-03-15T00:00:00Z"
  }
]
```

---

#### 2. Obtener Estudiante por ID

**Endpoint:** `GET /lms/students/{id}`

**Response:** Similar al formato de lista

---

#### 3. Crear Estudiante

**Endpoint:** `POST /lms/students`

**Request Body:**
```json
{
  "first_name": "Nuevo",
  "last_name": "Estudiante",
  "email": "nuevo.estudiante@email.com",
  "address": "Dirección completa",
  "birth_date": "2000-01-01",
  "gender": "M",
  "country_location": "PE",
  "state": "activo"
}
```

---

#### 4. Actualizar Estudiante

**Endpoint:** `PUT /lms/students/{id}`

---

#### 5. Eliminar Estudiante

**Endpoint:** `DELETE /lms/students/{id}`

---

### Instructores

#### 1. Listar Instructores

**Endpoint:** `GET /lms/instructors`

**Response 200:**
```json
[
  {
    "id": "1",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan.perez@email.com",
    "bio": "Desarrollador Full Stack con más de 10 años de experiencia.",
    "expertise_area": "Desarrollo Web, JavaScript, React, Node.js",
    "status": "activo",
    "profile_photo": null,
    "created_at": "2023-12-01T00:00:00Z",
    "updated_at": "2024-03-15T00:00:00Z"
  }
]
```

---

#### 2. Obtener Instructor por ID

**Endpoint:** `GET /lms/instructors/{id}`

---

#### 3. Crear Instructor

**Endpoint:** `POST /lms/instructors`

**Request Body:**
```json
{
  "first_name": "Nuevo",
  "last_name": "Instructor",
  "email": "instructor@email.com",
  "bio": "Biografía del instructor",
  "expertise_area": "Área de especialización",
  "status": "activo"
}
```

---

#### 4. Actualizar Instructor

**Endpoint:** `PUT /lms/instructors/{id}`

---

#### 5. Eliminar Instructor

**Endpoint:** `DELETE /lms/instructors/{id}`

---

### Inscripciones (Enrollments)

#### 1. Listar Inscripciones

**Endpoint:** `GET /lms/enrollments`

**Response 200:**
```json
[
  {
    "id": "1",
    "student_id": "1",
    "student": {
      "id": "1",
      "first_name": "Ana",
      "last_name": "Torres",
      "email": "ana.torres@email.com"
    },
    "course_id": "1",
    "course": {
      "id": "1",
      "title": "Desarrollo Web Full Stack",
      "code": "WEB-101"
    },
    "enrolled_at": "2024-03-15T10:30:00Z",
    "status": "activo",
    "progress": 45
  }
]
```

---

#### 2. Obtener Inscripciones por Estudiante

**Endpoint:** `GET /lms/enrollments/student/{studentId}`

**Nota:** Debe incluir información poblada de `course`.

---

#### 3. Obtener Inscripciones por Curso

**Endpoint:** `GET /lms/enrollments/course/{courseId}`

**Nota:** Debe incluir información poblada de `student`. Este endpoint es **crítico** para el modal de visualización de curso.

---

#### 4. Crear Inscripción

**Endpoint:** `POST /lms/enrollments`

**Request Body:**
```json
{
  "student_id": "1",
  "course_id": "1",
  "status": "activo",
  "progress": 0
}
```

**Validaciones:**
- Validar que no exista inscripción duplicada
- Validar que el curso esté publicado
- Validar que el estudiante exista

---

#### 5. Actualizar Progreso de Inscripción

**Endpoint:** `PATCH /lms/enrollments/{id}/progress`

**Request Body:**
```json
{
  "progress": 75
}
```

**Validaciones:**
- `progress`: Número entre 0 y 100

---

#### 6. Eliminar Inscripción

**Endpoint:** `DELETE /lms/enrollments/{id}`

---

## Schemas de Datos

### User

```typescript
{
  id: string;
  username: string;
  email: string;
  role: 'administrador' | 'gestor_lms' | 'soporte_seguridad' |
        'soporte_infraestructura' | 'developer_web' | 'analista_datos';
  name: string;
  first_name: string;
  last_name: string;
}
```

### Course

```typescript
{
  id: string;
  title: string;
  code: string;
  description: string;
  instructor_id: string;
  instructor?: Instructor;  // Poblado en algunos endpoints
  duration_weeks: number;
  price: number;
  status: 'publicado' | 'borrador' | 'archivado';
  created_at: string;       // ISO 8601
  updated_at: string;       // ISO 8601
}
```

### Student

```typescript
{
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at: string | null;
  address: string;
  birth_date: string;       // YYYY-MM-DD
  gender: 'M' | 'F' | 'Otro';
  country_location: string; // Código ISO país
  profile_photo: string | null;
  role: 'student';
  state: string;            // 'activo', 'inactivo', etc.
  last_access_ip: string | null;
  last_access: string | null;
  created_at: string;
  updated_at: string;
}
```

### Instructor

```typescript
{
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at: string | null;
  address: string;
  birth_date: string;
  gender: 'M' | 'F' | 'Otro';
  country_location: string;
  profile_photo: string | null;
  role: 'instructor';
  state: string;
  bio: string;
  expertise_area: string;
  status: 'activo' | 'inactivo' | 'suspendido';
  last_access_ip: string | null;
  last_access: string | null;
  created_at: string;
  updated_at: string;
}
```

### Enrollment

```typescript
{
  id: string;
  student_id: string;
  student?: Student;        // Poblado en algunos endpoints
  course_id: string;
  course?: Course;          // Poblado en algunos endpoints
  enrolled_at: string;      // ISO 8601
  status: 'activo' | 'completado' | 'abandonado';
  progress: number;         // 0-100
}
```

### LMSStats

```typescript
{
  total_courses: number;
  published_courses: number;
  draft_courses: number;
  total_students: number;
  active_enrollments: number;
  total_instructors: number;
}
```

---

## Notas de Implementación

### 1. Seguridad

- **CORS**: Configurar adecuadamente para permitir requests del frontend
- **Rate Limiting**: Implementar límite de requests por IP/usuario
- **SQL Injection**: Usar queries parametrizadas o ORM
- **XSS**: Sanitizar inputs
- **Password Hashing**: Usar bcrypt o argon2
- **HTTPS**: Obligatorio en producción

### 2. Base de Datos

**Recomendaciones:**
- Usar PostgreSQL o MySQL
- Implementar índices en campos de búsqueda frecuente
- Usar transacciones para operaciones críticas
- Implementar soft-delete para auditabilidad

**Relaciones Importantes:**
- `Course.instructor_id` → `Instructor.id` (Foreign Key)
- `Enrollment.student_id` → `Student.id` (Foreign Key)
- `Enrollment.course_id` → `Course.id` (Foreign Key)

### 3. Autenticación con GCP

Si decides usar **Google Cloud IAM** o servicios similares:

- El frontend **no necesita conocer** los detalles de implementación
- Solo asegúrate de que los endpoints retornen el formato esperado
- El JWT puede ser generado por cualquier servicio (Firebase Auth, Auth0, etc.)
- Mantén el formato de response consistente con esta especificación

### 4. Población de Relaciones

**Crítico:** Algunos endpoints requieren datos poblados:

- `GET /lms/courses` debe incluir `instructor` completo
- `GET /lms/enrollments/course/{id}` debe incluir `student` completo
- `GET /lms/enrollments/student/{id}` debe incluir `course` completo

### 5. Validaciones Importantes

**Email Único:**
- Validar en registro y actualización
- Retornar error 409 si existe duplicado

**Códigos de Curso Únicos:**
- El campo `code` debe ser único
- Validar en creación y actualización

**Inscripciones Duplicadas:**
- No permitir inscribir un estudiante dos veces al mismo curso
- Retornar error 409 con mensaje descriptivo

### 6. Manejo de Fechas

- Todas las fechas deben estar en **UTC**
- Formato: **ISO 8601** (`2024-03-15T10:30:00Z`)
- El frontend manejará la conversión a zona horaria local

### 7. Testing

**Datos de Prueba Recomendados:**
- 6 usuarios (uno por rol) con las credenciales documentadas
- Mínimo 10 cursos de ejemplo
- Mínimo 10 estudiantes
- Mínimo 5 instructores
- Múltiples inscripciones para testing

### 8. Documentación Adicional

**Considerar implementar:**
- Swagger/OpenAPI para documentación interactiva
- Postman Collection para testing
- Changelog de versiones de API

### 9. Logging y Monitoring

**Eventos a loggear:**
- Intentos de login (exitosos y fallidos)
- Creación/modificación de recursos
- Errores de servidor
- Requests lentos (> 1s)

### 10. Backup y Recuperación

- Implementar backups automáticos diarios
- Estrategia de recuperación ante desastres
- Logs de auditoría para cambios críticos

---

## Contacto y Soporte

Para dudas sobre esta especificación o el frontend:

**Equipo Frontend:** [Especificar contacto]
**Versión del Frontend:** 1.0.0
**Repositorio:** [URL del repositorio]

---

## Historial de Cambios

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0.0 | 2025-01-10 | Versión inicial - Módulos Auth y LMS |

---

**Documento generado automáticamente por el análisis del código frontend de TechProc**
