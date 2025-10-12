# Implementación de Autenticación - TechProc Frontend

## Estado: ✅ Listo para API Real

El sistema de autenticación del frontend está **completamente preparado** para conectarse con la API real según la especificación en `BACKEND_API_SPECIFICATION.md`.

---

## 📋 Índice

1. [Configuración Rápida](#configuración-rápida)
2. [Cambiar de Mock a API Real](#cambiar-de-mock-a-api-real)
3. [Endpoints Implementados](#endpoints-implementados)
4. [Flujo de Autenticación](#flujo-de-autenticación)
5. [Manejo de Errores](#manejo-de-errores)
6. [Credenciales de Prueba](#credenciales-de-prueba)
7. [Estructura de Archivos](#estructura-de-archivos)

---

## 🚀 Configuración Rápida

### 1. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env
```

### 2. Editar `.env`

```env
# Para desarrollo con mocks
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_USE_MOCK=true

# Para producción con API real
VITE_API_BASE_URL=https://api.techproc.com/v1
VITE_USE_MOCK=false
```

### 3. Iniciar aplicación

```bash
npm run dev
```

---

## 🔄 Cambiar de Mock a API Real

### Opción 1: Variable de Entorno (Recomendado)

Editar `.env`:
```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Opción 2: Código Directo

Editar `src/services/authService.ts`:
```typescript
const USE_MOCK = false; // Cambiar a false
```

**Importante:** Asegúrate de que tu backend esté corriendo en la URL configurada.

---

## 🔗 Endpoints Implementados

✅ Todos los endpoints de autenticación están **completamente implementados** según `BACKEND_API_SPECIFICATION.md`:

### 1. POST /auth/login

**Request:**
```json
{
  "email": "admin@techproc.com",
  "password": "admin123"
}
```

**Response 200:**
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

**Response 401:**
```json
{
  "error": {
    "code": "AUTHENTICATION_FAILED",
    "message": "Credenciales inválidas"
  }
}
```

### 2. POST /auth/register

**Request:**
```json
{
  "email": "nuevo@techproc.com",
  "password": "password123",
  "first_name": "Nuevo",
  "last_name": "Usuario",
  "role": "analista_datos"
}
```

**Response 201:** Igual que login

**Response 409:**
```json
{
  "error": {
    "code": "CONFLICT",
    "message": "El email ya está registrado"
  }
}
```

### 3. POST /auth/logout

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response 204:** Sin contenido

### 4. POST /auth/refresh

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 5. POST /auth/verify

**Request:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**
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

---

## 🔐 Flujo de Autenticación

```
1. Usuario ingresa credenciales
   ↓
2. POST /auth/login
   ↓
3. Backend valida y retorna JWT + Refresh Token
   ↓
4. Frontend guarda tokens en localStorage
   ↓
5. Todas las peticiones incluyen: Authorization: Bearer {token}
   ↓
6. Si token expira → Auto-refresh con refresh token
   ↓
7. Si refresh falla → Redirect a /login
```

### Auto-Refresh de Token

El frontend **automáticamente** refresca el token cuando expira:

```typescript
// En api.config.ts - líneas 98-130
if (error.code === 'TOKEN_EXPIRED') {
  // Intentar refrescar automáticamente
  const newToken = await refreshToken();
  // Reintentar petición original
}
```

---

## ⚠️ Manejo de Errores

Todos los errores siguen el formato de la especificación:

```typescript
interface ApiError {
  error: {
    code: string;           // Ej: "VALIDATION_ERROR"
    message: string;        // Mensaje legible
    details?: Array<{      // Opcional: detalles de campos
      field: string;
      message: string;
    }>;
    timestamp?: string;
    request_id?: string;
  }
}
```

### Códigos de Error Soportados

| Código | HTTP | Descripción |
|--------|------|-------------|
| `VALIDATION_ERROR` | 422 | Error de validación |
| `AUTHENTICATION_FAILED` | 401 | Credenciales inválidas |
| `TOKEN_EXPIRED` | 401 | Token expirado |
| `TOKEN_INVALID` | 401 | Token inválido |
| `UNAUTHORIZED` | 401 | No autenticado |
| `FORBIDDEN` | 403 | Sin permisos |
| `NOT_FOUND` | 404 | Recurso no encontrado |
| `CONFLICT` | 409 | Email duplicado |
| `RATE_LIMIT_EXCEEDED` | 429 | Demasiadas peticiones |
| `INTERNAL_ERROR` | 500 | Error interno |

---

## 👥 Credenciales de Prueba

El backend debe tener estos usuarios pre-cargados:

| Rol | Email | Password | Permisos |
|-----|-------|----------|----------|
| Administrador | admin@techproc.com | admin123 | Todos los módulos |
| Gestor LMS | lms@techproc.com | lms123 | Solo LMS |
| Soporte Técnico | soporte@techproc.com | soporte123 | Solo Tickets |
| Soporte Seguridad | security@techproc.com | security123 | Tickets + Security |
| Soporte Infraestructura | infra@techproc.com | infra123 | Tickets + Infrastructure |
| Developer Web | web@techproc.com | web123 | Tickets + Web |
| Analista de Datos | data@techproc.com | data123 | Solo Analytics |

---

## 📁 Estructura de Archivos

```
src/
├── services/
│   ├── api.config.ts           # Configuración de API + auto-refresh
│   ├── authService.ts          # Servicio de autenticación
│   └── mockService.ts          # Helper para mocks
├── shared/
│   └── types/
│       └── auth.ts             # Tipos TypeScript
└── pages/
    └── LoginPage.tsx           # Página de login
```

### Archivos Modificados

1. **`src/services/api.config.ts`**
   - ✅ URL base: `/api/v1`
   - ✅ Manejo de errores según spec
   - ✅ Auto-refresh de token
   - ✅ Headers correctos

2. **`src/services/authService.ts`**
   - ✅ Endpoints implementados
   - ✅ Mock/Real toggle
   - ✅ Credenciales de prueba actualizadas

3. **`src/shared/types/auth.ts`**
   - ✅ Tipos según spec
   - ✅ Permisos por rol
   - ✅ Interfaces completas

4. **`.env.example`**
   - ✅ Variables documentadas
   - ✅ Credenciales listadas

---

## ✅ Checklist para el Backend

Para que el frontend funcione correctamente, el backend debe:

- [ ] Implementar endpoints en `/api/v1/auth/*`
- [ ] Retornar respuestas según formato de spec
- [ ] Generar JWT con claims: `userId`, `role`, `exp`, `iat`
- [ ] Implementar refresh token rotation
- [ ] Validar formato de email
- [ ] Validar password mínimo 6 caracteres
- [ ] Retornar error 409 para emails duplicados
- [ ] Configurar CORS para permitir frontend
- [ ] Implementar rate limiting
- [ ] Usar HTTPS en producción

---

## 🧪 Testing

### Probar con Mock

```bash
# En .env
VITE_USE_MOCK=true

# Iniciar app
npm run dev

# Usar cualquiera de las credenciales listadas arriba
```

### Probar con API Real

```bash
# En .env
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:3000/api/v1

# Asegurar que backend esté corriendo
# Iniciar app
npm run dev
```

---

## 🔧 Troubleshooting

### Error: "Network request failed"
- Verificar que el backend esté corriendo
- Verificar URL en `.env`
- Revisar CORS en backend

### Error: "TOKEN_EXPIRED" loop
- Verificar que `/auth/refresh` funcione
- Verificar que refresh token no haya expirado

### Error: "AUTHENTICATION_FAILED"
- Verificar credenciales
- Verificar que usuarios existan en BD
- Verificar hash de passwords en backend

---

## 📞 Soporte

Para dudas sobre la implementación:

- **Especificación completa:** `BACKEND_API_SPECIFICATION.md`
- **Código fuente:** `src/services/authService.ts`
- **Tipos:** `src/shared/types/auth.ts`

---

**Versión:** 1.0.0
**Última actualización:** 2025-01-11
**Estado:** ✅ Listo para producción
