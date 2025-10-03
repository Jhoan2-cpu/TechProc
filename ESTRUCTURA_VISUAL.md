# 🏗️ Estructura Visual del Proyecto TechProc

## 📊 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                         App.tsx                              │
│                   (Router Principal)                         │
│                                                              │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ LoginPage  │  │ RegisterPage │  │  Authenticated   │   │
│  │            │  │              │  │      Layout      │   │
│  └────────────┘  └──────────────┘  └──────────────────┘   │
│                                               │             │
└───────────────────────────────────────────────┼─────────────┘
                                                │
                        ┌───────────────────────┴────────────────────────┐
                        │                                                │
              ┌─────────▼────────┐                            ┌─────────▼────────┐
              │     Sidebar      │                            │   Main Content   │
              │                  │                            │                  │
              │  • Logo          │                            │  • Profile Page  │
              │  • User Info     │                            │  • Module Pages  │
              │  • Modules Menu  │                            │                  │
              │  • Profile Btn   │                            │                  │
              │  • Logout Btn    │                            │                  │
              └──────────────────┘                            └──────────────────┘
```

## 🎯 Flujo de Navegación

```
┌──────────────┐
│  Login Page  │
│              │
│ Seleccionar  │
│     Rol      │
└──────┬───────┘
       │
       ├─── [Registrarse] ──────┐
       │                         │
       ▼                         ▼
┌──────────────┐        ┌────────────────┐
│   Sistema    │        │ Register Page  │
│  Principal   │        │                │
│              │        │ • Formulario   │
│ ┌──────────┐ │        │ • Validación   │
│ │ Sidebar  │ │        └───────┬────────┘
│ │          │ │                │
│ │ Módulos: │ │                ▼
│ │          │ │        ┌────────────────┐
│ │ • Users  │ │        │   Solicitud    │
│ │ • LMS    │ │        │   Pendiente    │
│ │ • Ticket │ │        │                │
│ │ • Sec    │ │        │  (Admin debe   │
│ │ • Infra  │ │        │   aprobar)     │
│ │ • Web    │ │        └────────────────┘
│ │ • Analyt │ │
│ └──────────┘ │
│              │
│ ┌──────────┐ │
│ │          │ │
│ │ Content  │ │
│ │   Area   │ │
│ │          │ │
│ └──────────┘ │
└──────────────┘
```

## 📁 Estructura de Archivos Detallada

```
TechProc/
│
├── 📄 Configuration Files
│   ├── package.json                    # Dependencias del proyecto
│   ├── vite.config.ts                  # Configuración de Vite
│   ├── tsconfig.json                   # Configuración TypeScript
│   ├── tailwind.config.js              # Configuración Tailwind
│   ├── postcss.config.js               # Configuración PostCSS
│   └── .gitignore                      # Archivos ignorados por Git
│
├── 📁 public/                          # Archivos estáticos
│   └── assets/
│
├── 📁 src/                             # Código fuente
│   │
│   ├── 📄 main.tsx                     # Entry point de la aplicación
│   ├── 📄 App.tsx                      # Componente raíz + Router
│   ├── 📄 index.css                    # Estilos globales + Tailwind
│   │
│   ├── 📁 pages/                       # Páginas globales
│   │   ├── LoginPage.tsx               # ✅ Login con selección de rol
│   │   ├── RegisterPage.tsx            # ✅ Formulario de registro
│   │   └── ProfilePage.tsx             # ✅ Perfil de usuario
│   │
│   ├── 📁 modules/                     # Módulos del sistema
│   │   │
│   │   ├── 📁 analytics/               # 📊 Módulo Analítica
│   │   │   ├── components/
│   │   │   │   ├── StatCard.tsx        # Card de estadística
│   │   │   │   ├── ProgressChart.tsx   # Gráfico de barras
│   │   │   │   ├── PieChart.tsx        # Gráfico circular
│   │   │   │   └── index.ts            # Exports
│   │   │   ├── pages/
│   │   │   │   └── AnalyticsPage.tsx   # Página principal
│   │   │   └── types/
│   │   │       └── index.ts            # Tipos específicos
│   │   │
│   │   ├── 📁 lms/                     # 🎓 Módulo LMS
│   │   │   ├── components/
│   │   │   │   ├── CreateCourseModal.tsx
│   │   │   │   ├── LMSLayout.tsx
│   │   │   │   └── index.ts
│   │   │   ├── pages/
│   │   │   │   ├── LMSMainPage.tsx     # Dashboard LMS
│   │   │   │   ├── LMSPage.tsx         # Vista general
│   │   │   │   ├── CoursesPage.tsx     # Gestión de cursos
│   │   │   │   ├── StudentsPage.tsx    # Gestión de estudiantes
│   │   │   │   └── InstructorsPage.tsx # Gestión de instructores
│   │   │   └── types/
│   │   │       └── index.ts
│   │   │
│   │   ├── 📁 tickets/                 # 🎫 Módulo Tickets
│   │   │   ├── pages/
│   │   │   │   ├── TicketsPage.tsx
│   │   │   │   ├── TicketsManagementPage.tsx
│   │   │   │   └── EscalationsPage.tsx
│   │   │   └── types/
│   │   │
│   │   ├── 📁 security/                # 🔒 Módulo Seguridad
│   │   │   ├── pages/
│   │   │   │   └── SecurityPage.tsx
│   │   │   └── types/
│   │   │
│   │   ├── 📁 infrastructure/          # 🖥️ Módulo Infraestructura
│   │   │   ├── pages/
│   │   │   │   └── InfrastructurePage.tsx
│   │   │   └── types/
│   │   │
│   │   ├── 📁 web/                     # 🌐 Módulo Web
│   │   │   ├── pages/
│   │   │   │   └── WebPage.tsx
│   │   │   └── types/
│   │   │
│   │   └── 📁 users/                   # 👥 Módulo Gestión de Usuarios
│   │       ├── pages/
│   │       │   ├── UsersPage.tsx
│   │       │   └── PendingRegistrationsPage.tsx  # Aprobar registros
│   │       └── types/
│   │
│   ├── 📁 shared/                      # Código compartido
│   │   ├── components/
│   │   │   └── Preloader.tsx           # Loading screen
│   │   ├── types/
│   │   │   └── auth.ts                 # Tipos de autenticación
│   │   └── utils/
│   │       └── auth.ts                 # Utilidades de autenticación
│   │
│   └── 📁 styles/                      # Estilos adicionales
│       └── modules.css                 # Estilos legacy
│
└── 📁 docs/                            # Documentación
    ├── GUIA_DESARROLLO.md              # Esta guía
    ├── ESTRUCTURA_VISUAL.md            # Diagramas y estructura
    ├── PALETA_COLORES.md               # Guía de colores
    ├── MODULO_LMS_COMPLETO.md          # Especificaciones LMS
    └── ...
```

## 🔐 Matriz de Permisos

| Módulo                    | Admin | LMS | Seg | Infra | Web | Data |
|--------------------------|:-----:|:---:|:---:|:-----:|:---:|:----:|
| Gestión de Usuarios      |   ✅   |  ❌  |  ❌  |   ❌   |  ❌  |  ❌   |
| Solicitudes de Registro  |   ✅   |  ❌  |  ❌  |   ❌   |  ❌  |  ❌   |
| LMS                      |   ✅   |  ✅  |  ❌  |   ❌   |  ❌  |  ❌   |
| Tickets                  |   ✅   |  ❌  |  ✅  |   ✅   |  ✅  |  ❌   |
| Seguridad                |   ✅   |  ❌  |  ✅  |   ❌   |  ❌  |  ❌   |
| Infraestructura          |   ✅   |  ❌  |  ❌  |   ✅   |  ❌  |  ❌   |
| Web                      |   ✅   |  ❌  |  ❌  |   ❌   |  ✅  |  ❌   |
| Analítica                |   ✅   |  ✅  |  ❌  |   ❌   |  ❌  |  ✅   |
| Perfil                   |   ✅   |  ✅  |  ✅  |   ✅   |  ✅  |  ✅   |

## 🎨 Sistema de Diseño

### Jerarquía Visual

```
┌─────────────────────────────────────────┐
│ Nivel 1: Headers y Títulos Principales │
│ • text-3xl font-heading font-bold      │
│ • text-secondary-900                    │
│ • Iconos: text-primary-600              │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ Nivel 2: Subtítulos y Secciones        │
│ • text-xl font-heading font-bold       │
│ • text-secondary-900                    │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ Nivel 3: Títulos de Cards               │
│ • text-lg font-heading font-bold        │
│ • text-secondary-900                    │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ Nivel 4: Texto Normal                   │
│ • text-base                             │
│ • text-secondary-600                    │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ Nivel 5: Texto Pequeño                  │
│ • text-sm                               │
│ • text-secondary-500                    │
└─────────────────────────────────────────┘
```

### Espaciado Estándar

```css
/* Padding de Cards */
.card → p-6              /* Padding general */

/* Gaps entre elementos */
gap-2                    /* Elementos pequeños (tabs) */
gap-4                    /* Elementos medianos (forms) */
gap-6                    /* Elementos grandes (grids) */

/* Margins */
mb-2, mb-4, mb-6        /* Margin bottom progresivo */
mt-2, mt-4, mt-6        /* Margin top progresivo */

/* Responsive Grids */
grid-cols-1             /* Mobile */
md:grid-cols-2          /* Tablet */
lg:grid-cols-3          /* Desktop */
xl:grid-cols-4          /* Large Desktop */
```

## 📦 Componentes Globales vs Locales

### ✅ Componentes Globales (`/shared/components`)

```
Preloader.tsx           # Loading screen inicial
```

**Cuándo crear componente global:**
- Se usa en 3+ módulos diferentes
- Es genérico y reutilizable
- No tiene lógica específica de negocio

### 📍 Componentes Locales (`/modules/[modulo]/components`)

```
StatCard.tsx           # Solo en Analytics
CreateCourseModal.tsx  # Solo en LMS
```

**Cuándo crear componente local:**
- Solo se usa en un módulo
- Tiene lógica específica del módulo
- Depende de types específicos del módulo

## 🔄 Flujo de Datos

```
┌─────────────┐
│  Mock Data  │ ← Actualmente (desarrollo)
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│   useState/Props     │ ← Gestión de estado
└──────────┬───────────┘
           │
           ▼
┌───────────────────────┐
│  Componentes (UI)     │ ← Renderizado
└───────────────────────┘

Futuro (producción):
┌─────────────┐
│  Backend    │
│  API REST   │
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│  fetch/axios         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  useState/Context    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Componentes (UI)    │
└──────────────────────┘
```

## 🎯 Patrones de Código

### Pattern 1: Página con Tabs

```typescript
// 1. Definir tipo de tabs
type MiTab = 'tab1' | 'tab2' | 'tab3';

// 2. Estado para tab activo
const [activeTab, setActiveTab] = useState<MiTab>('tab1');

// 3. Array de configuración de tabs
const tabs = [
  { id: 'tab1' as const, name: 'Tab 1', icon: faIcon1 },
  { id: 'tab2' as const, name: 'Tab 2', icon: faIcon2 },
];

// 4. Funciones render por tab
const renderTab1 = () => <div>Contenido 1</div>;
const renderTab2 = () => <div>Contenido 2</div>;

// 5. Render condicional
{activeTab === 'tab1' && renderTab1()}
{activeTab === 'tab2' && renderTab2()}
```

### Pattern 2: Lista de Items con Acciones

```typescript
// 1. Array de items
const [items, setItems] = useState<Item[]>(mockItems);

// 2. Funciones de acción
const handleEdit = (id: number) => {
  const item = items.find(i => i.id === id);
  // ...
};

const handleDelete = (id: number) => {
  if (confirm('¿Eliminar?')) {
    setItems(prev => prev.filter(i => i.id !== id));
  }
};

// 3. Render con map
{items.map(item => (
  <div key={item.id} className="card p-6">
    <h3>{item.name}</h3>
    <button onClick={() => handleEdit(item.id)}>Editar</button>
    <button onClick={() => handleDelete(item.id)}>Eliminar</button>
  </div>
))}
```

### Pattern 3: Formulario con Validación

```typescript
// 1. Interface del formulario
interface FormData {
  nombre: string;
  email: string;
}

// 2. Estados
const [formData, setFormData] = useState<FormData>({
  nombre: '',
  email: '',
});
const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

// 3. Función de validación
const validateForm = (): boolean => {
  const newErrors: Partial<Record<keyof FormData, string>> = {};

  if (!formData.nombre.trim()) {
    newErrors.nombre = 'El nombre es requerido';
  }

  if (!formData.email.includes('@')) {
    newErrors.email = 'Email inválido';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

// 4. Handler de cambios
const handleChange = (field: keyof FormData, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }));
  if (errors[field]) {
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }
};

// 5. Submit
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (validateForm()) {
    // Enviar datos
  }
};
```

## 📊 Métricas del Proyecto

```
Total de Módulos: 8
├── Analytics       ✅
├── LMS            ✅
├── Tickets        ✅
├── Security       ✅
├── Infrastructure ✅
├── Web            ✅
├── Users          ✅
└── Registrations  ✅

Total de Páginas: 15+
Total de Componentes: 25+
Líneas de Código: ~8,000+
```

## 🚦 Estado del Proyecto

| Componente | Estado | Notas |
|-----------|--------|-------|
| **Core**  |
| App.tsx | ✅ Completo | Router y layout principal |
| LoginPage | ✅ Completo | Con enlace a registro |
| RegisterPage | ✅ Completo | Formulario completo con validación |
| ProfilePage | ✅ Completo | Edición de perfil |
| **Módulos** |
| Analytics | ✅ Completo | 6 tabs con gráficos |
| LMS | ✅ Completo | CRUD completo |
| Tickets | ✅ Completo | Gestión y escalaciones |
| Security | ✅ Completo | Monitoreo y logs |
| Infrastructure | ✅ Completo | Gestión de servidores |
| Web | ✅ Completo | Gestión de proyectos web |
| Users | ✅ Completo | CRUD de usuarios |
| Registrations | ✅ Completo | Aprobación de solicitudes |
| **Estilos** |
| Paleta de colores | ✅ Definida | Ver PALETA_COLORES.md |
| Componentes CSS | ✅ Completo | Tailwind + clases custom |
| Responsive | ✅ Completo | Mobile first |

## 📝 Próximos Pasos (Roadmap)

### Fase 1: Backend Integration
- [ ] Conectar con API REST
- [ ] Implementar autenticación JWT
- [ ] Manejar estados de loading
- [ ] Implementar manejo de errores

### Fase 2: Mejoras UX
- [ ] Agregar notificaciones toast
- [ ] Implementar búsqueda global
- [ ] Agregar filtros avanzados
- [ ] Modo oscuro (dark mode)

### Fase 3: Optimización
- [ ] Code splitting
- [ ] Lazy loading de módulos
- [ ] Optimización de imágenes
- [ ] PWA capabilities

### Fase 4: Testing
- [ ] Unit tests (Vitest)
- [ ] Integration tests
- [ ] E2E tests (Cypress)
- [ ] Performance testing

---

**Última actualización**: 2024
**Versión**: 1.0.0
