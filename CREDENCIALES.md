# TechProc - Credenciales de Prueba

## Sistema de Autenticación

El sistema de login está completamente implementado y listo para producción. Actualmente utiliza datos mock para desarrollo, pero está preparado para conectarse a un API real.

### Credenciales de Prueba

A continuación se listan todas las credenciales disponibles para testing:

#### 1. Administrador (Acceso Total)
- **Email:** `admin@techproc.com`
- **Contraseña:** `admin123`
- **Permisos:** Acceso a todos los módulos
- **Módulos:** Users, LMS, Tickets, Security, Infrastructure, Web, Analytics

#### 2. Gestor LMS
- **Email:** `lms@techproc.com`
- **Contraseña:** `lms123`
- **Permisos:** Solo módulo LMS
- **Módulos:** LMS

#### 3. Soporte - Seguridad
- **Email:** `security@techproc.com`
- **Contraseña:** `security123`
- **Permisos:** Tickets y Seguridad
- **Módulos:** Tickets, Security

#### 4. Soporte - Infraestructura
- **Email:** `infra@techproc.com`
- **Contraseña:** `infra123`
- **Permisos:** Tickets e Infraestructura
- **Módulos:** Tickets, Infrastructure

#### 5. Developer Web
- **Email:** `web@techproc.com`
- **Contraseña:** `web123`
- **Permisos:** Web y Tickets
- **Módulos:** Web, Tickets

#### 6. Analista de Datos
- **Email:** `data@techproc.com`
- **Contraseña:** `data123`
- **Permisos:** Solo Analítica
- **Módulos:** Analytics

---

## Características del Sistema de Login

### ✅ Implementado

1. **Flujo de autenticación en dos pasos**
   - **Paso 1:** Selección de perfil con tarjetas interactivas
   - **Paso 2:** Formulario de login con email y contraseña
   - Navegación fluida entre pasos
   - Botón "Cambiar perfil" para regresar

2. **Autenticación con email y contraseña**
   - Email pre-rellenado según perfil seleccionado
   - Validación de formato de email
   - Validación de longitud de contraseña (mínimo 6 caracteres)
   - Mensajes de error descriptivos

3. **Gestión de sesión**
   - Tokens JWT (simulados en desarrollo)
   - Almacenamiento en localStorage
   - Persistencia de sesión al recargar página
   - Auto-login si hay sesión válida

4. **Seguridad**
   - Contraseña enmascarada con opción de mostrar/ocultar
   - Validaciones en frontend
   - Rutas protegidas
   - Control de acceso por roles

5. **UX/UI**
   - Selección visual de perfiles con tarjetas coloridas
   - Indicador de perfil seleccionado en formulario
   - Diseño moderno y responsive
   - Animaciones fluidas
   - Estados de carga
   - Feedback visual de errores (animación shake)
   - Credenciales específicas por perfil (removible en producción)

### 🔄 Preparado para Producción

El archivo `src/services/authService.ts` está configurado con una variable `USE_MOCK`:

```typescript
const USE_MOCK = true; // Cambiar a false cuando la API esté lista
```

Cuando cambies esta variable a `false`, el sistema automáticamente usará los endpoints reales de tu API:

- `POST /auth/login` - Login
- `POST /auth/register` - Registro
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Refresh token
- `POST /auth/verify` - Verificar token

### 📋 Próximos Pasos para Despliegue

1. **Configurar API Backend:**
   - Implementar endpoints de autenticación
   - Generar tokens JWT reales
   - Configurar base de datos de usuarios

2. **Actualizar configuración:**
   - Cambiar `USE_MOCK = false` en `authService.ts`
   - Configurar URL base del API en `api.config.ts`
   - Configurar variables de entorno para producción

3. **Remover indicadores de desarrollo:**
   - Eliminar el bloque de "Credenciales de prueba" del LoginPage
   - Revisar y limpiar console.logs

4. **Testing:**
   - Probar todos los flujos de autenticación
   - Verificar manejo de errores
   - Probar refresh de tokens
   - Verificar cierre de sesión

---

## Estructura de Archivos

```
src/
├── services/
│   ├── authService.ts       # Servicio de autenticación
│   ├── api.config.ts        # Configuración del API
│   └── mockService.ts       # Utilidades para mocks
├── pages/
│   ├── LoginPage.tsx        # Página de login
│   └── RegisterPage.tsx     # Página de registro
├── shared/
│   └── types/
│       └── auth.ts          # Tipos y permisos de usuario
└── App.tsx                  # Configuración de rutas y sesión
```

---

## Notas de Desarrollo

- Todas las contraseñas mock tienen mínimo 6 caracteres
- Los tokens mock expiran en 24 horas
- La sesión se verifica al cargar la aplicación
- El logout limpia completamente la sesión del navegador
