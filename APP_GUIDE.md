# Guía Completa de App.tsx - TechProc

## 📋 Índice

1. [Introducción](#introducción)
2. [Estructura General](#estructura-general)
3. [Componentes Principales](#componentes-principales)
4. [Flujo de Autenticación](#flujo-de-autenticación)
5. [Sistema de Rutas](#sistema-de-rutas)
6. [Sistema de Permisos](#sistema-de-permisos)
7. [Navegación y Sidebar](#navegación-y-sidebar)
8. [Estados y Hooks](#estados-y-hooks)
9. [Ejemplos Prácticos](#ejemplos-prácticos)

---

## 🎯 Introducción

**App.tsx** es el componente principal y el corazón de la aplicación TechProc. Es el archivo más importante porque:

- **Controla toda la navegación** de la aplicación
- **Gestiona la autenticación** de usuarios
- **Define qué puede ver cada usuario** según su rol
- **Estructura el layout** (sidebar, contenido principal, etc.)
- **Maneja el estado global** de la sesión

Si App.tsx fuera una casa, sería la estructura principal: las paredes, el techo y las puertas. Todo lo demás (páginas, módulos) son las habitaciones dentro de esa casa.

---

## 🏗️ Estructura General

App.tsx está dividido en **3 componentes principales**:

```
┌─────────────────────────────────────────┐
│           App (Componente Raíz)         │
│  - Maneja autenticación                 │
│  - Muestra Preloader inicial            │
│  - Define rutas públicas y protegidas   │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼──────────┐   ┌────────▼────────┐
│  ProtectedRoute  │   │     Layout      │
│  - Verifica si   │   │  - Sidebar      │
│    está logueado │   │  - Navegación   │
│  - Verifica      │   │  - Contenido    │
│    permisos      │   │  - Logout Modal │
└──────────────────┘   └─────────────────┘
```

---

## 🧩 Componentes Principales

### 1. **ProtectedRoute** (Líneas 70-80)

**¿Qué hace?**
Es un "guardia de seguridad" que protege las rutas. Antes de mostrar una página, verifica:
1. ¿El usuario está logueado?
2. ¿Tiene permisos para ver esta página?

**Código simplificado:**
```typescript
function ProtectedRoute({ children, currentUser, requiredModule }) {
  // Si no hay usuario, redirigir a login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere un módulo específico y no tiene acceso, redirigir a inicio
  if (requiredModule && !hasAccess(currentUser, requiredModule)) {
    return <Navigate to="/" replace />;
  }

  // Si pasa ambas validaciones, mostrar el contenido
  return <>{children}</>;
}
```

**Ejemplo de uso:**
```
Usuario intenta ir a /security-dashboard
  ↓
ProtectedRoute verifica:
  ✅ ¿Está logueado? Sí
  ✅ ¿Tiene acceso a 'security'? Sí (es soporte_seguridad)
  ✅ Mostrar página

Usuario intenta ir a /users
  ↓
ProtectedRoute verifica:
  ✅ ¿Está logueado? Sí
  ❌ ¿Tiene acceso a 'users'? No (solo administrador puede)
  ❌ Redirigir a /
```

---

### 2. **Layout** (Líneas 83-436)

**¿Qué hace?**
Es el "marco" de la aplicación que contiene:
- **Sidebar** (barra lateral izquierda)
- **Contenido principal** (área de trabajo)
- **Modal de confirmación** de logout

#### 2.1. Estados del Layout

```typescript
const [expandedModules, setExpandedModules] = useState<string[]>([...]);
// Controla qué módulos están expandidos en el sidebar

const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
// Controla si el sidebar está visible o colapsado

const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
// Controla si se muestra el modal de confirmación de logout
```

#### 2.2. Redirección Automática (Líneas 91-111)

Cuando el usuario está en la raíz `/`, el sistema lo redirige automáticamente al primer módulo al que tiene acceso:

```typescript
useEffect(() => {
  if (location.pathname === '/') {
    if (hasAccess(currentUser, 'users')) {
      navigate('/users');  // Administrador → Gestión de Usuarios
    } else if (hasAccess(currentUser, 'lms')) {
      navigate('/lms-dashboard');  // Gestor LMS → Dashboard LMS
    } else if (hasAccess(currentUser, 'support')) {
      navigate('/tickets-dashboard');  // Soporte → Dashboard Tickets
    }
    // ... y así sucesivamente
  }
}, [location.pathname, currentUser, navigate]);
```

**Ejemplo:**
```
Usuario: gestor_lms
Entra a: http://localhost/
Sistema detecta: "Está en raíz, tiene acceso a LMS"
Redirige a: http://localhost/lms-dashboard
```

#### 2.3. Estructura del Sidebar (Líneas 210-337)

El sidebar tiene 4 secciones principales:

```
┌──────────────────────────────┐
│         LOGO                 │  ← Logo INCADEV
├──────────────────────────────┤
│      INFO DE USUARIO         │  ← Nombre y rol del usuario
├──────────────────────────────┤
│                              │
│      MÓDULOS                 │  ← Lista de módulos con permisos
│      - Gestión Usuarios      │
│      - LMS                   │
│        ├ Dashboard           │
│        ├ Cursos              │
│        └ Estudiantes         │
│      - Soporte               │
│      ...                     │
│                              │
├──────────────────────────────┤
│      Mi Perfil               │  ← Botón de perfil
│      Cerrar Sesión           │  ← Botón de logout
└──────────────────────────────┘
```

#### 2.4. Sistema de Módulos (Líneas 117-193)

Los módulos están definidos en un array con esta estructura:

```typescript
{
  id: 'lms',                    // Identificador único
  name: 'LMS',                  // Nombre visible
  icon: faGraduationCap,        // Icono de FontAwesome
  submodules: [                 // Submódulos opcionales
    {
      id: 'lms-dashboard',
      name: 'Dashboard',
      icon: faTachometerAlt
    },
    {
      id: 'lms-courses',
      name: 'Cursos',
      icon: faBookOpen
    },
  ]
}
```

**Tipos de módulos:**

1. **Módulos simples** (sin submodules):
   - `users` → Gestión de Usuarios
   - `pending-registrations` → Solicitudes de Registro

2. **Módulos con submodules**:
   - `lms` → LMS (con Dashboard, Cursos, Estudiantes, Instructores)
   - `support` → Soporte (con Dashboard, Mis Tickets, Disponibles, Escalaciones)
   - `security` → Seguridad (con Dashboard, Sesiones, IPs Bloqueadas, etc.)

#### 2.5. Navegación por Módulos (Líneas 246-308)

**Lógica de navegación:**

```typescript
{modules.map((module) => {
  // 1. Verificar permisos
  if (!hasAccess(currentUser, module.id)) return null;

  // 2. Determinar estado
  const isActive = currentPath === module.id;
  const isExpanded = expandedModules.includes(module.id);
  const hasSubmodules = module.submodules && module.submodules.length > 0;

  // 3. Renderizar botón
  return (
    <button onClick={() => {
      if (hasSubmodules) {
        // Expandir/contraer
        setExpandedModules(prev =>
          prev.includes(module.id)
            ? prev.filter(id => id !== module.id)  // Contraer
            : [...prev, module.id]                  // Expandir
        );
      } else {
        // Navegar directamente
        navigate(`/${module.id}`);
      }
    }}>
      {module.name}
    </button>
  );
})}
```

**Flujo visual:**

```
Usuario hace click en "LMS"
  ↓
¿Tiene submodules? Sí
  ↓
Expandir/Contraer lista de submodules
  ↓
Mostrar:
  ├ Dashboard
  ├ Cursos
  ├ Estudiantes
  └ Instructores

Usuario hace click en "Dashboard"
  ↓
Navegar a /lms-dashboard
```

#### 2.6. Modal de Logout (Líneas 340-378)

**¿Por qué existe?**
Para evitar cierres de sesión accidentales.

**Funcionamiento:**

```
Usuario click en "Cerrar Sesión"
  ↓
setShowLogoutModal(true)
  ↓
Mostrar modal con:
  - Título: "¿Estás seguro?"
  - Mensaje de advertencia
  - Botón "Cancelar"
  - Botón "Sí, cerrar sesión"
  ↓
Si hace click en "Cancelar":
  → setShowLogoutModal(false)
  → Volver a la página

Si hace click en "Sí, cerrar sesión":
  → setShowLogoutModal(false)
  → onLogout() (limpia sesión y redirige a /login)
```

#### 2.7. Área de Contenido (Líneas 381-433)

**Estructura:**

```typescript
<main>
  <div className="p-12">
    {/* Breadcrumb (migas de pan) */}
    <Breadcrumb />

    {/* Rutas de la aplicación */}
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/lms-dashboard" element={<LMSMainPage />} />
      {/* ... más rutas */}
    </Routes>
  </div>
</main>
```

**¿Qué hace el Breadcrumb?**
Muestra la ruta actual como "migas de pan":

```
Inicio > LMS > Cursos
```

---

### 3. **App (Componente Principal)** (Líneas 439-510)

**¿Qué hace?**
Es el componente raíz que:
1. Verifica si hay sesión guardada al cargar
2. Maneja el login/logout
3. Define las rutas principales
4. Muestra el preloader mientras carga

#### 3.1. Estados Principales

```typescript
const [isLoading, setIsLoading] = useState(true);
// Controla si muestra el preloader

const [currentUser, setCurrentUser] = useState<User | null>(null);
// Guarda la información del usuario logueado
```

#### 3.2. Verificación de Sesión (Líneas 443-470)

**Al iniciar la aplicación:**

```typescript
useEffect(() => {
  const checkSession = async () => {
    const startTime = Date.now();

    try {
      // 1. Verificar si hay token guardado
      if (authService.isAuthenticated()) {
        // 2. Obtener datos del usuario
        const user = authService.getCurrentUser();
        if (user) {
          // 3. Establecer usuario actual
          setCurrentUser(user);
        }
      }
    } catch (error) {
      // Si hay error, limpiar sesión
      authService.clearSession();
    } finally {
      // 4. Asegurar mínimo 500ms de preloader
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(500 - elapsedTime, 0);

      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    }
  };

  checkSession();
}, []);
```

**Flujo visual:**

```
Usuario abre la aplicación
  ↓
Mostrar Preloader (logo animado)
  ↓
Verificar localStorage
  ↓
¿Existe token?
  │
  ├─ SÍ → ¿Es válido?
  │         │
  │         ├─ SÍ → Cargar datos usuario → Mostrar dashboard
  │         └─ NO → Limpiar sesión → Mostrar login
  │
  └─ NO → Mostrar login
```

**¿Por qué mínimo 500ms?**
Para evitar un "flash" visual si la carga es muy rápida. Da una sensación más profesional.

#### 3.3. Funciones de Autenticación (Líneas 472-479)

**handleLogin:**
```typescript
const handleLogin = (user: User) => {
  setCurrentUser(user);  // Guardar usuario en estado
};
```

Se llama desde LoginPage cuando el login es exitoso.

**handleLogout:**
```typescript
const handleLogout = () => {
  authService.clearSession();  // Limpiar localStorage
  setCurrentUser(null);         // Limpiar estado
};
```

Se llama cuando el usuario confirma cerrar sesión.

#### 3.4. Sistema de Rutas (Líneas 486-506)

**Estructura de rutas:**

```typescript
<BrowserRouter>
  <Routes>
    {/* 1. RUTA PÚBLICA - Website institucional */}
    <Route path="/website" element={<WebsitePage />} />

    {/* 2. RUTAS DE AUTENTICACIÓN */}
    <Route path="/login" element={
      currentUser ?
        <Navigate to="/" replace /> :  // Si ya está logueado, redirigir
        <LoginPage onLogin={handleLogin} />
    } />

    <Route path="/register" element={
      currentUser ?
        <Navigate to="/" replace /> :  // Si ya está logueado, redirigir
        <RegisterPage onBackToLogin={() => {}} />
    } />

    {/* 3. RUTAS PROTEGIDAS - Todo lo demás */}
    <Route path="/*" element={
      <ProtectedRoute currentUser={currentUser}>
        <Layout currentUser={currentUser!} onLogout={handleLogout} />
      </ProtectedRoute>
    } />
  </Routes>
</BrowserRouter>
```

**Tipos de rutas:**

| Ruta | Tipo | Descripción |
|------|------|-------------|
| `/website` | Pública | Página web institucional (sin login) |
| `/login` | Semi-pública | Login (solo si no está logueado) |
| `/register` | Semi-pública | Registro (solo si no está logueado) |
| `/*` | Protegida | Todo el sistema interno (requiere login) |

---

## 🔐 Flujo de Autenticación

### Caso 1: Usuario NO logueado

```
1. Usuario abre http://localhost/
   ↓
2. App.tsx verifica sesión → No hay token
   ↓
3. currentUser = null
   ↓
4. Intenta entrar a ruta protegida /*
   ↓
5. ProtectedRoute verifica → currentUser es null
   ↓
6. Redirige a /login
   ↓
7. Usuario ve LoginPage
```

### Caso 2: Usuario logueado correctamente

```
1. Usuario ingresa credenciales en LoginPage
   ↓
2. LoginPage llama authService.login()
   ↓
3. authService guarda token en localStorage
   ↓
4. LoginPage llama handleLogin(user)
   ↓
5. App.tsx establece currentUser = user
   ↓
6. Redirige a página según rol
   ↓
7. ProtectedRoute verifica → currentUser existe
   ↓
8. Permite acceso a Layout
   ↓
9. Layout redirige automáticamente al primer módulo disponible
   ↓
10. Usuario ve su dashboard
```

### Caso 3: Usuario intenta acceder sin permisos

```
1. Usuario (soporte_tecnico) está en /tickets-dashboard
   ↓
2. Usuario escribe manualmente /users en URL
   ↓
3. Router intenta cargar /users
   ↓
4. ProtectedRoute verifica permisos
   ↓
5. hasAccess(currentUser, 'users') → false
   ↓
6. Redirige a /
   ↓
7. useEffect del Layout detecta estar en /
   ↓
8. Redirige a /tickets-dashboard (su módulo por defecto)
```

---

## 🛣️ Sistema de Rutas

### Rutas Públicas

```typescript
// Accesible sin login
/website → Página institucional
```

### Rutas de Autenticación

```typescript
// Accesible solo si NO está logueado
/login    → LoginPage
/register → RegisterPage
```

### Rutas Protegidas (requieren login)

```typescript
// Raíz
/ → Redirige automáticamente al primer módulo disponible

// Perfil
/profile → ProfilePage (todos los usuarios)

// Gestión de Usuarios (solo administrador)
/users                  → UsersPage
/pending-registrations  → PendingRegistrationsPage

// LMS (gestor_lms, administrador)
/lms-dashboard    → LMSMainPage
/lms-courses      → LMSMainPage
/lms-students     → LMSMainPage
/lms-instructors  → LMSMainPage

// Soporte (todos los roles de soporte)
/tickets-dashboard     → TicketsMainPage
/tickets-my-tickets    → TicketsMainPage
/tickets-available     → TicketsMainPage
/tickets-escalations   → TicketsMainPage

// Seguridad (soporte_seguridad, administrador)
/security-dashboard      → SecurityDashboardPage
/security-sessions       → SessionsPage
/security-blocked-ips    → BlockedIPsPage
/security-blocked-users  → BlockedUsersPage
/security-incidents      → IncidentsPage
/security-backups        → BackupsPage

// Infraestructura (soporte_infraestructura, administrador)
/infrastructure-dashboard  → InfrastructureMainPage
/infrastructure-servers    → InfrastructureMainPage
/infrastructure-licenses   → InfrastructureMainPage
/infrastructure-storage    → InfrastructureMainPage
/infrastructure-software   → InfrastructureMainPage

// Web (developer_web, administrador)
/web-dashboard        → WebPage
/web-news             → WebPage
/web-alerts           → WebPage
/web-announcements    → WebPage
/web-contacts         → WebPage
/web-chatbot          → WebPage

// Analytics (analista_datos, administrador)
/analytics-dashboard     → AnalyticsMainPage
/analytics-attendance    → AnalyticsMainPage
/analytics-progress      → AnalyticsMainPage
/analytics-performance   → AnalyticsMainPage
/analytics-dropout       → AnalyticsMainPage
/analytics-reports       → AnalyticsMainPage
```

---

## 🔑 Sistema de Permisos

Los permisos están definidos en `src/shared/utils/auth.ts` y se verifican con la función `hasAccess()`.

### Matriz de Permisos por Rol

| Módulo | administrador | gestor_lms | soporte_tecnico | soporte_seguridad | soporte_infraestructura | developer_web | analista_datos |
|--------|---------------|------------|-----------------|-------------------|-------------------------|---------------|----------------|
| **users** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **pending-registrations** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **lms** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **support** | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **security** | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **infrastructure** | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **web** | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **analytics** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **profile** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🎨 Navegación y Sidebar

### Estados del Sidebar

```typescript
// Expandido (por defecto)
isSidebarOpen = true
→ Sidebar visible con ancho 288px (72 en Tailwind)
→ Botón toggle en left-[276px]

// Colapsado
isSidebarOpen = false
→ Sidebar oculto (-translate-x-full)
→ Botón toggle en left-4
```

### Expandir/Contraer Módulos

```typescript
// Estado inicial - todos expandidos
expandedModules = ['lms', 'support', 'security', 'infrastructure', 'web', 'analytics']

// Usuario hace click en módulo con submodules
onClick={() => {
  setExpandedModules(prev =>
    prev.includes(module.id)
      ? prev.filter(id => id !== module.id)  // Quitar de la lista
      : [...prev, module.id]                 // Agregar a la lista
  );
}}

// Ejemplo: Contraer LMS
expandedModules = ['support', 'security', 'infrastructure', 'web', 'analytics']
→ Los submodules de LMS se ocultan
```

### Estilos de Navegación

**Botón activo:**
```css
bg-gradient-to-r from-primary-500 to-primary-600 text-white
shadow-lg shadow-primary-500/20
```

**Botón inactivo:**
```css
text-gray-300 hover:bg-gradient-to-r hover:from-secondary-600
border border-gray-700/30 hover:border-primary-500/50
```

---

## ⚙️ Estados y Hooks

### Estados Globales (App.tsx)

```typescript
// 1. Estado de carga inicial
const [isLoading, setIsLoading] = useState(true);

// 2. Usuario actual
const [currentUser, setCurrentUser] = useState<User | null>(null);
```

### Estados del Layout

```typescript
// 1. Módulos expandidos en sidebar
const [expandedModules, setExpandedModules] = useState<string[]>([...]);

// 2. Visibilidad del sidebar
const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

// 3. Modal de logout
const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
```

### Hooks Utilizados

**1. useEffect (App.tsx - Línea 443)**
```typescript
useEffect(() => {
  checkSession();  // Verificar sesión al montar
}, []);  // Array vacío = solo al montar
```

**2. useEffect (Layout - Línea 91)**
```typescript
useEffect(() => {
  // Redirigir si está en raíz
}, [location.pathname, currentUser, navigate]);
// Re-ejecuta si cambia la ruta o el usuario
```

**3. useNavigate**
```typescript
const navigate = useNavigate();
navigate('/users');  // Navegar programáticamente
```

**4. useLocation**
```typescript
const location = useLocation();
location.pathname;  // Obtener ruta actual
```

---

## 📚 Ejemplos Prácticos

### Ejemplo 1: Agregar un nuevo módulo

**Paso 1: Agregar a la lista de módulos (Línea 117)**
```typescript
const modules = [
  // ... módulos existentes
  {
    id: 'mi-nuevo-modulo',
    name: 'Mi Nuevo Módulo',
    icon: faRocket,
    submodules: [
      { id: 'nuevo-dashboard', name: 'Dashboard', icon: faTachometerAlt },
      { id: 'nuevo-lista', name: 'Lista', icon: faList },
    ]
  }
];
```

**Paso 2: Agregar rutas (Línea 388)**
```typescript
<Routes>
  {/* ... rutas existentes */}
  <Route path="/nuevo-dashboard" element={<NuevoDashboardPage />} />
  <Route path="/nuevo-lista" element={<NuevaListaPage />} />
</Routes>
```

**Paso 3: Configurar permisos en `src/shared/utils/auth.ts`**
```typescript
export const MODULE_ACCESS: Record<UserRole, string[]> = {
  administrador: ['users', 'lms', 'support', 'mi-nuevo-modulo', ...],
  analista_datos: ['mi-nuevo-modulo'],  // Si necesita acceso
  // ...
};
```

### Ejemplo 2: Cambiar redirección por defecto

**Modificar el useEffect en Layout (Línea 91)**
```typescript
useEffect(() => {
  if (location.pathname === '/') {
    // Cambiar orden de prioridad
    if (hasAccess(currentUser, 'analytics')) {
      navigate('/analytics-dashboard', { replace: true });  // Ahora primero analytics
    } else if (hasAccess(currentUser, 'users')) {
      navigate('/users', { replace: true });
    }
    // ...
  }
}, [location.pathname, currentUser, navigate]);
```

### Ejemplo 3: Agregar nuevo tipo de usuario

**Paso 1: Actualizar tipos en `src/shared/types/auth.ts`**
```typescript
export type UserRole =
  | 'administrador'
  | 'nuevo_rol_supervisor'  // Nuevo rol
  | ...;
```

**Paso 2: Configurar permisos**
```typescript
export const MODULE_ACCESS: Record<UserRole, string[]> = {
  // ...
  nuevo_rol_supervisor: ['lms', 'analytics', 'support'],
};
```

**Paso 3: Agregar a LoginPage.tsx (mock credentials)**
```typescript
const MOCK_CREDENTIALS = [
  // ...
  {
    email: 'supervisor@techproc.com',
    password: 'super123',
    user: {
      id: '8',
      username: 'supervisor',
      email: 'supervisor@techproc.com',
      role: 'nuevo_rol_supervisor' as const,
      name: 'Supervisor',
      first_name: 'Super',
      last_name: 'Visor',
    },
  },
];
```

---

## 🔍 Debugging y Troubleshooting

### Problema: Usuario no puede ver un módulo

**Verificar:**
1. ¿El rol tiene acceso? → Revisar `MODULE_ACCESS` en `auth.ts`
2. ¿El módulo está en la lista? → Revisar array `modules` en App.tsx línea 117
3. ¿La ruta existe? → Revisar `<Routes>` en Layout línea 388

### Problema: Redirección infinita

**Causa común:**
```typescript
// ❌ MAL - useEffect sin dependencias correctas
useEffect(() => {
  navigate('/somewhere');
}, []); // Falta agregar navigate a dependencies

// ✅ BIEN
useEffect(() => {
  navigate('/somewhere');
}, [navigate]);
```

### Problema: Modal de logout no se muestra

**Verificar:**
1. Estado: `showLogoutModal` debe ser `true`
2. CSS: Verificar z-index (`z-50`)
3. Backdrop: Verificar que `fixed inset-0` esté aplicado

---

## 📝 Resumen

**App.tsx es responsable de:**

1. ✅ **Autenticación**: Verificar si hay sesión, login/logout
2. ✅ **Navegación**: Definir todas las rutas de la aplicación
3. ✅ **Permisos**: Controlar qué puede ver cada usuario
4. ✅ **Layout**: Estructura sidebar + contenido
5. ✅ **Preloader**: Mostrar animación de carga
6. ✅ **Redirección**: Enviar usuarios a la página correcta según su rol

**Componentes clave:**

- `App`: Componente raíz, maneja autenticación global
- `ProtectedRoute`: Verifica login y permisos antes de mostrar rutas
- `Layout`: Estructura visual (sidebar + contenido)

**Flujo general:**

```
Iniciar app
  ↓
Verificar sesión (localStorage)
  ↓
¿Hay token válido?
  │
  ├─ SÍ → Cargar usuario → Mostrar Layout → Redirigir a módulo
  │
  └─ NO → Mostrar Login
```

---

## 🎓 Para Desarrolladores Nuevos

**Si eres nuevo en el proyecto, debes entender:**

1. **App.tsx controla TODO** - Es el cerebro de la aplicación
2. **Cada módulo necesita**:
   - Definición en array `modules`
   - Rutas en `<Routes>`
   - Permisos en `MODULE_ACCESS`
3. **ProtectedRoute es tu amigo** - Usa siempre para proteger rutas
4. **currentUser es el estado global** - Contiene info del usuario logueado
5. **hasAccess() verifica permisos** - Úsalo antes de mostrar contenido

**Archivos relacionados importantes:**
- `src/shared/types/auth.ts` → Tipos de usuarios y permisos
- `src/shared/utils/auth.ts` → Función hasAccess()
- `src/services/authService.ts` → Login, logout, verificación
- `src/pages/LoginPage.tsx` → Página de login

---

**Versión:** 1.0.0
**Última actualización:** 2025-01-11
**Autor:** Equipo TechProc
