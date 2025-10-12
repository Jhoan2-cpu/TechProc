# Métodos de Autenticación - TechProc

## 📋 Resumen de Implementación

Todos los métodos de autenticación están **100% implementados** y listos para usar tanto en modo **MOCK** como con **API REAL**.

---

## 🔐 Métodos Disponibles

### 1. `authService.login(credentials)`

**Propósito:** Autenticar usuario con email y password

**Endpoint:** `POST /auth/login`

**Parámetros:**
```typescript
{
  email: string;
  password: string;
}
```

**Retorna:**
```typescript
{
  user: User;
  token: string;
  refreshToken: string;
}
```

**Ejemplo de uso:**
```typescript
const response = await authService.login({
  email: 'admin@techproc.com',
  password: 'admin123'
});

// Guardar sesión
authService.saveSession(response.token, response.refreshToken);
```

**Errores posibles:**
- `"Credenciales inválidas"` - Email o password incorrectos
- Errores de validación de campos

---

### 2. `authService.register(data)`

**Propósito:** Registrar un nuevo usuario

**Endpoint:** `POST /auth/register`

**Parámetros:**
```typescript
{
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: UserRole; // Opcional
}
```

**Retorna:**
```typescript
{
  user: User;
  token: string;
  refreshToken: string;
}
```

**Ejemplo de uso:**
```typescript
const response = await authService.register({
  email: 'nuevo@techproc.com',
  password: 'password123',
  first_name: 'Nuevo',
  last_name: 'Usuario',
  role: 'analista_datos'
});

// Guardar sesión automáticamente
authService.saveSession(response.token, response.refreshToken);
```

**Validaciones:**
- Email: Formato válido, único
- Password: Mínimo 6 caracteres
- First name: 2-50 caracteres
- Last name: 2-50 caracteres
- Role: Valores válidos de UserRole

**Errores posibles:**
- `"El email ya está registrado"` - Email duplicado (409 Conflict)
- Errores de validación de campos

---

### 3. `authService.logout()`

**Propósito:** Cerrar sesión del usuario actual

**Endpoint:** `POST /auth/logout`

**Parámetros:** Ninguno (usa token en headers)

**Retorna:** `void`

**Ejemplo de uso:**
```typescript
await authService.logout();
// El backend invalida el token
```

**Nota:** También debes llamar a `authService.clearSession()` en el frontend

---

### 4. `authService.refreshToken(refreshToken)`

**Propósito:** Obtener nuevo access token usando refresh token

**Endpoint:** `POST /auth/refresh`

**Parámetros:**
```typescript
refreshToken: string
```

**Retorna:**
```typescript
{
  token: string;
}
```

**Ejemplo de uso:**
```typescript
const refreshToken = localStorage.getItem('refresh_token');
const response = await authService.refreshToken(refreshToken);

// Actualizar token
authService.saveSession(response.token);
```

**Nota:** El frontend tiene **auto-refresh automático** implementado en `api.config.ts`

---

### 5. `authService.verifyToken(token)`

**Propósito:** Verificar si un token es válido

**Endpoint:** `POST /auth/verify`

**Parámetros:**
```typescript
token: string
```

**Retorna:**
```typescript
User // Datos del usuario
```

**Ejemplo de uso:**
```typescript
const token = localStorage.getItem('auth_token');
const user = await authService.verifyToken(token);
console.log(user);
```

---

### 6. `authService.getCurrentUser()`

**Propósito:** Obtener usuario actual desde localStorage (sin API call)

**Parámetros:** Ninguno

**Retorna:** `User | null`

**Ejemplo de uso:**
```typescript
const user = authService.getCurrentUser();
if (user) {
  console.log('Usuario actual:', user.name);
}
```

**Nota:** Solo funciona en modo MOCK, decodifica JWT localmente

---

### 7. `authService.saveSession(token, refreshToken?)`

**Propósito:** Guardar tokens en localStorage

**Parámetros:**
```typescript
token: string;
refreshToken?: string;
```

**Retorna:** `void`

**Ejemplo de uso:**
```typescript
authService.saveSession(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
);
```

---

### 8. `authService.clearSession()`

**Propósito:** Limpiar tokens del localStorage

**Parámetros:** Ninguno

**Retorna:** `void`

**Ejemplo de uso:**
```typescript
authService.clearSession();
// Elimina auth_token y refresh_token
```

---

### 9. `authService.isAuthenticated()`

**Propósito:** Verificar si el usuario está autenticado

**Parámetros:** Ninguno

**Retorna:** `boolean`

**Ejemplo de uso:**
```typescript
if (authService.isAuthenticated()) {
  console.log('Usuario autenticado');
} else {
  console.log('Usuario no autenticado');
}
```

**Lógica:**
1. Verifica que exista token
2. Decodifica el JWT
3. Verifica que no haya expirado (exp > now)

---

### 10. `authService.getToken()`

**Propósito:** Obtener el token actual

**Parámetros:** Ninguno

**Retorna:** `string | null`

**Ejemplo de uso:**
```typescript
const token = authService.getToken();
if (token) {
  // Usar token en request manual
  fetch('/api/endpoint', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}
```

---

## 🔄 Flujo Completo de Autenticación

### Login Flow:
```typescript
// 1. Login
const response = await authService.login({
  email: 'admin@techproc.com',
  password: 'admin123'
});

// 2. Guardar sesión
authService.saveSession(response.token, response.refreshToken);

// 3. Verificar autenticación
if (authService.isAuthenticated()) {
  // Usuario autenticado
  const user = authService.getCurrentUser();
}
```

### Register Flow:
```typescript
// 1. Registro
const response = await authService.register({
  email: 'nuevo@techproc.com',
  password: 'password123',
  first_name: 'Nuevo',
  last_name: 'Usuario'
});

// 2. Automáticamente autenticado
authService.saveSession(response.token, response.refreshToken);
```

### Logout Flow:
```typescript
// 1. Logout API
await authService.logout();

// 2. Limpiar sesión local
authService.clearSession();

// 3. Redirigir a login
navigate('/login');
```

---

## ⚙️ Configuración

### Cambiar entre Mock y API Real

**Archivo:** `src/services/authService.ts`

```typescript
// Línea 16
const USE_MOCK = false; // true = mock, false = API real
```

### Configurar URL de la API

**Archivo:** `.env`

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## 🧪 Testing

### Probar Login (Mock):
```typescript
const response = await authService.login({
  email: 'admin@techproc.com',
  password: 'admin123'
});
console.log(response.user); // Usuario autenticado
```

### Probar Registro (Mock):
```typescript
const response = await authService.register({
  email: 'test@example.com',
  password: 'test123',
  first_name: 'Test',
  last_name: 'User'
});
console.log(response.user); // Nuevo usuario
```

### Probar Auto-Refresh:
```typescript
// El token expirará automáticamente
// El frontend lo refrescará sin intervención
// Ver: src/services/api.config.ts líneas 98-130
```

---

## 📝 Notas Importantes

1. **Auto-Refresh:** Los tokens se refrescan automáticamente cuando expiran
2. **Seguridad:** Los tokens se almacenan en localStorage (considera usar httpOnly cookies en producción)
3. **Validaciones:** Todas las validaciones están implementadas tanto en frontend como backend
4. **Errores:** Todos los errores siguen el formato de la especificación con códigos descriptivos
5. **Mock Mode:** Perfecto para desarrollo sin backend

---

## 🔧 Troubleshooting

### Error: "Credenciales inválidas"
- Verificar email y password
- En mock mode, usar credenciales de `MOCK_CREDENTIALS`
- En API mode, verificar que usuario exista en BD

### Error: "Token expirado"
- El auto-refresh debería manejarlo
- Verificar que refresh token sea válido
- Si falla, el usuario será redirigido a login

### Error: "El email ya está registrado"
- El email debe ser único
- Verificar que no exista en la BD
- En mock mode, reiniciar aplicación limpia el estado

---

**Versión:** 1.0.0
**Última actualización:** 2025-01-11
**Estado:** ✅ Completamente implementado
