# 📚 Guía de Desarrollo - TechProc

## 📋 Tabla de Contenidos

1. [Visión General del Proyecto](#visión-general-del-proyecto)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Paleta de Colores y Estilos](#paleta-de-colores-y-estilos)
4. [Arquitectura de Módulos](#arquitectura-de-módulos)
5. [Ejemplo Detallado: Módulo Analytics](#ejemplo-detallado-módulo-analytics)
6. [Cómo Crear un Nuevo Módulo](#cómo-crear-un-nuevo-módulo)
7. [Convenciones y Buenas Prácticas](#convenciones-y-buenas-prácticas)
8. [Flujo de Trabajo Git](#flujo-de-trabajo-git)

---

## 🎯 Visión General del Proyecto

**TechProc** es un sistema de gestión modular construido con React + TypeScript + Vite. Cada módulo es independiente y se accede según el rol del usuario.

### Tecnologías Principales

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Estilos**: TailwindCSS
- **Iconos**: Font Awesome
- **Fuentes**: Inter (body), Poppins (headings)

### Roles y Permisos

| Rol | Username | Acceso a Módulos |
|-----|----------|------------------|
| **Administrador** | `admin` | Todos los módulos + Gestión de Usuarios + Solicitudes de Registro |
| **Gestor LMS** | `lms` | LMS + Analítica |
| **Soporte - Seguridad** | `seg` | Tickets + Seguridad |
| **Soporte - Infraestructura** | `infra` | Tickets + Infraestructura |
| **Developer Web** | `web` | Tickets + Web |
| **Analista de Datos** | `data` | Analítica |

---

## 📁 Estructura del Proyecto

```
TechProc/
├── public/                      # Archivos estáticos
├── src/
│   ├── App.tsx                 # Componente principal - Router y Layout
│   ├── main.tsx                # Entry point
│   ├── index.css               # Estilos globales y Tailwind
│   │
│   ├── pages/                  # Páginas globales
│   │   ├── LoginPage.tsx       # Página de login
│   │   ├── RegisterPage.tsx    # Página de registro
│   │   └── ProfilePage.tsx     # Página de perfil de usuario
│   │
│   ├── modules/                # Módulos del sistema
│   │   ├── analytics/          # Módulo de Analítica
│   │   │   ├── components/     # Componentes del módulo
│   │   │   │   ├── StatCard.tsx
│   │   │   │   ├── ProgressChart.tsx
│   │   │   │   ├── PieChart.tsx
│   │   │   │   └── index.ts    # Barrel export
│   │   │   ├── pages/          # Páginas del módulo
│   │   │   │   └── AnalyticsPage.tsx
│   │   │   ├── types/          # Types específicos
│   │   │   │   └── index.ts
│   │   │   └── utils/          # Utilidades específicas
│   │   │
│   │   ├── lms/                # Módulo LMS
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   │
│   │   ├── tickets/            # Módulo Tickets
│   │   ├── security/           # Módulo Seguridad
│   │   ├── infrastructure/     # Módulo Infraestructura
│   │   ├── web/                # Módulo Web
│   │   └── users/              # Módulo Gestión de Usuarios
│   │
│   ├── shared/                 # Código compartido
│   │   ├── components/         # Componentes globales
│   │   │   └── Preloader.tsx
│   │   ├── types/              # Types globales
│   │   │   └── auth.ts
│   │   └── utils/              # Utilidades globales
│   │       └── auth.ts
│   │
│   └── styles/                 # Estilos adicionales
│       └── modules.css
│
├── tailwind.config.js          # Configuración Tailwind
├── vite.config.ts              # Configuración Vite
├── tsconfig.json               # Configuración TypeScript
└── package.json                # Dependencias
```

---

## 🎨 Paleta de Colores y Estilos

### Colores Principales

```typescript
// Primary (Azul) - Color principal del sistema
primary-500: #0ea5e9
primary-600: #0284c7  // Hover, botones
primary-700: #0369a1  // Estados activos

// Secondary (Gris) - Textos y fondos
secondary-50:  #f8fafc  // Fondos claros
secondary-100: #f1f5f9  // Hover ligero
secondary-600: #475569  // Texto secundario
secondary-900: #0f172a  // Texto principal

// Accent (Púrpura) - Acentos
accent-500: #d946ef
accent-600: #c026d3

// Estados
Success: #10b981 (Verde)
Warning: #f59e0b (Naranja/Amarillo)
Danger:  #ef4444 (Rojo)
```

### Clases CSS Predefinidas

```css
/* Botones */
.btn              /* Base de botón */
.btn-primary      /* Botón principal (azul) */
.btn-secondary    /* Botón secundario (gris) */
.btn-outline      /* Botón con borde */

/* Inputs */
.input            /* Campo de texto estándar */
.select           /* Selector estándar */

/* Cards */
.card             /* Tarjeta con sombra y hover */

/* Utilidades */
.text-gradient    /* Gradiente de texto (primary a accent) */
.bg-gradient-primary    /* Gradiente de fondo primary */
.bg-gradient-secondary  /* Gradiente de fondo secondary */
```

### Animaciones Disponibles

```css
animate-fade-in       /* Aparición suave (0.5s) */
animate-slide-up      /* Deslizar hacia arriba (0.5s) */
animate-slide-down    /* Deslizar hacia abajo (0.5s) */
animate-scale-in      /* Escalar entrada (0.3s) */
animate-spin-slow     /* Rotación lenta (3s) */
```

---

## 🏗️ Arquitectura de Módulos

### Principios de Diseño

1. **Modularidad**: Cada módulo es independiente
2. **Reutilización**: Componentes compartidos en `/shared`
3. **Consistencia**: Misma paleta de colores y estructura
4. **Tipado**: TypeScript estricto en todo el código

### Estructura de un Módulo Estándar

```
modulo/
├── components/           # Componentes específicos del módulo
│   ├── ComponenteA.tsx
│   ├── ComponenteB.tsx
│   └── index.ts         # Barrel export
│
├── pages/               # Páginas principales del módulo
│   ├── ModuloMainPage.tsx
│   └── ModuloDetailPage.tsx
│
├── types/               # Tipos TypeScript específicos
│   └── index.ts
│
└── utils/               # Funciones auxiliares
    └── helpers.ts
```

---

## 📊 Ejemplo Detallado: Módulo Analytics

### 1. Estructura Completa

```
analytics/
├── components/
│   ├── StatCard.tsx          # Tarjeta de estadística
│   ├── ProgressChart.tsx     # Gráfico de barras de progreso
│   ├── PieChart.tsx          # Gráfico de pastel
│   └── index.ts              # Exportaciones
│
├── pages/
│   └── AnalyticsPage.tsx     # Página principal
│
└── types/
    └── index.ts              # Tipos del módulo
```

### 2. Types (`analytics/types/index.ts`)

```typescript
// Definición de tipos del módulo
export interface AnalyticsDashboard {
  total_students: number;
  active_students: number;
  at_risk_students: number;
  average_attendance: number;
  average_performance: number;
  average_progress: number;
  total_courses: number;
  completion_rate: number;
}

export interface StudentAttendance {
  student_id: number;
  student_name: string;
  course_id: number;
  course_name: string;
  total_sessions: number;
  attended_sessions: number;
  absences: number;
  tardiness: number;
  justified_absences: number;
  attendance_percentage: number;
  last_attendance_date: string;
}

export interface CourseAnalytics {
  course_id: number;
  course_name: string;
  total_students: number;
  active_students: number;
  average_attendance: number;
  average_performance: number;
  average_progress: number;
  completion_rate: number;
  dropout_rate: number;
  at_risk_count: number;
}

export type ReportType = 'asistencia' | 'rendimiento' | 'progreso' | 'desercion' | 'general';
export type ReportFormat = 'pdf' | 'excel' | 'csv';

export interface Report {
  id_report: number;
  report_name: string;
  report_type: ReportType;
  description: string;
  format: ReportFormat;
  generated_by: number;
  generated_by_name: string;
  generation_date: string;
  file_path: string;
  file_size_kb: number;
  parameters: Record<string, any>;
}
```

### 3. Componente Reutilizable (`components/StatCard.tsx`)

```typescript
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: IconDefinition;
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'orange';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard = ({ title, value, subtitle, icon, color, trend }: StatCardProps) => {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-600 text-blue-900 text-blue-600',
    green: 'from-green-50 to-green-100 border-green-600 text-green-900 text-green-600',
    purple: 'from-purple-50 to-purple-100 border-purple-600 text-purple-900 text-purple-600',
    red: 'from-red-50 to-red-100 border-red-600 text-red-900 text-red-600',
    yellow: 'from-yellow-50 to-yellow-100 border-yellow-600 text-yellow-900 text-yellow-600',
    orange: 'from-orange-50 to-orange-100 border-orange-600 text-orange-900 text-orange-600',
  };

  const [bgGradient, borderColor, textColor, iconColor] = colorClasses[color].split(' ');

  return (
    <div className={`card p-6 bg-gradient-to-br ${bgGradient} border-l-4 ${borderColor} hover:shadow-lg transition-shadow`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-secondary-600 mb-1">{title}</p>
          <p className={`text-3xl font-heading font-bold ${textColor}`}>
            {value}
          </p>
          {subtitle && <p className="text-xs text-secondary-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className={`mt-2 text-xs font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <FontAwesomeIcon icon={icon} className={`text-4xl ${iconColor} opacity-50`} />
      </div>
    </div>
  );
};
```

### 4. Página Principal (`pages/AnalyticsPage.tsx`)

```typescript
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faUserCheck, faTasks } from '@fortawesome/free-solid-svg-icons';
import { ProgressChart, PieChart } from '../components';
import type { AnalyticsDashboard } from '../types';

type AnalyticsTab = 'dashboard' | 'attendance' | 'progress' | 'performance';

export const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('dashboard');

  // Mock data
  const mockDashboard: AnalyticsDashboard = {
    total_students: 1250,
    active_students: 1180,
    at_risk_students: 45,
    average_attendance: 87.5,
    average_performance: 78.3,
    average_progress: 65.2,
    total_courses: 24,
    completion_rate: 72.8,
  };

  const tabs = [
    { id: 'dashboard' as const, name: 'Dashboard', icon: faChartLine },
    { id: 'attendance' as const, name: 'Asistencia', icon: faUserCheck },
    { id: 'progress' as const, name: 'Progreso', icon: faTasks },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 mb-1">Estudiantes Activos</p>
              <p className="text-3xl font-heading font-bold text-blue-900">
                {mockDashboard.active_students}
              </p>
              <p className="text-xs text-secondary-500 mt-1">
                de {mockDashboard.total_students} totales
              </p>
            </div>
            <FontAwesomeIcon icon={faUserCheck} className="text-4xl text-blue-600 opacity-50" />
          </div>
        </div>
        {/* Más tarjetas... */}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <ProgressChart
            title="Progreso Promedio por Curso"
            data={[
              { label: 'Python Avanzado', value: 78.5, color: 'bg-green-600' },
              { label: 'JavaScript Moderno', value: 68.2, color: 'bg-primary-500' },
            ]}
          />
        </div>
        {/* Más gráficos... */}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary-50 p-6">
      {/* Header */}
      <div className="mb-6 pb-6 border-b-2 border-secondary-200">
        <h1 className="text-3xl font-heading font-bold text-secondary-900 flex items-center">
          <FontAwesomeIcon icon={faChartLine} className="mr-3 text-primary-600" />
          Analítica y Monitoreo
        </h1>
        <p className="text-secondary-600 mt-2">
          Análisis de datos, asistencia, progreso y rendimiento
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-secondary-700 hover:bg-secondary-100'
            }`}
          >
            <FontAwesomeIcon icon={tab.icon} />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'dashboard' && renderDashboard()}
        {/* Otras tabs... */}
      </div>
    </div>
  );
};
```

### 5. Barrel Export (`components/index.ts`)

```typescript
// Exportar todos los componentes del módulo
export { StatCard } from './StatCard';
export { ProgressChart } from './ProgressChart';
export { PieChart } from './PieChart';
```

### 6. Integración en App.tsx

```typescript
// 1. Importar la página principal
import { AnalyticsPage } from './modules/analytics/pages/AnalyticsPage';

// 2. Agregar al renderModule
const renderModule = () => {
  // ...
  case 'analytics': return <AnalyticsPage />;
  // ...
};

// 3. Agregar al array de módulos
const modules = [
  // ...
  { id: 'analytics', name: 'Analítica', icon: faChartLine },
];

// 4. Verificar permisos en auth.ts
export const PERMISSIONS: Record<string, string[]> = {
  admin: ['users', 'lms', 'tickets', 'security', 'infrastructure', 'web', 'analytics'],
  data: ['analytics'],
  // ...
};
```

---

## 🆕 Cómo Crear un Nuevo Módulo

### Paso 1: Crear la Estructura de Carpetas

```bash
mkdir -p src/modules/mi-modulo/{components,pages,types,utils}
touch src/modules/mi-modulo/components/index.ts
touch src/modules/mi-modulo/types/index.ts
```

### Paso 2: Definir Types (`types/index.ts`)

```typescript
// Definir las interfaces necesarias
export interface MiEntidad {
  id: number;
  nombre: string;
  // ...
}

export interface MiConfiguracion {
  // ...
}
```

### Paso 3: Crear Componentes Reutilizables

```typescript
// components/MiComponente.tsx
interface MiComponenteProps {
  // Props del componente
}

export const MiComponente = ({ /* props */ }: MiComponenteProps) => {
  return (
    <div className="card p-6">
      {/* Contenido */}
    </div>
  );
};

// components/index.ts
export { MiComponente } from './MiComponente';
```

### Paso 4: Crear la Página Principal

```typescript
// pages/MiModuloPage.tsx
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMiIcono } from '@fortawesome/free-solid-svg-icons';
import { MiComponente } from '../components';
import type { MiEntidad } from '../types';

export const MiModuloPage = () => {
  const [activeTab, setActiveTab] = useState('principal');

  return (
    <div className="min-h-screen bg-secondary-50 p-6">
      {/* Header */}
      <div className="mb-6 pb-6 border-b-2 border-secondary-200">
        <h1 className="text-3xl font-heading font-bold text-secondary-900 flex items-center">
          <FontAwesomeIcon icon={faMiIcono} className="mr-3 text-primary-600" />
          Mi Módulo
        </h1>
        <p className="text-secondary-600 mt-2">
          Descripción del módulo
        </p>
      </div>

      {/* Tabs si es necesario */}
      <div className="flex gap-2 mb-6">
        {/* Tabs */}
      </div>

      {/* Contenido */}
      <div>
        <MiComponente />
      </div>
    </div>
  );
};
```

### Paso 5: Integrar en App.tsx

```typescript
// 1. Import
import { MiModuloPage } from './modules/mi-modulo/pages/MiModuloPage';

// 2. Agregar al switch
case 'mi-modulo': return <MiModuloPage />;

// 3. Agregar al array de módulos
{ id: 'mi-modulo', name: 'Mi Módulo', icon: faMiIcono }

// 4. Actualizar permisos en shared/utils/auth.ts
export const PERMISSIONS: Record<string, string[]> = {
  admin: [..., 'mi-modulo'],
  rol_especifico: ['mi-modulo'],
};
```

---

## ✅ Convenciones y Buenas Prácticas

### Nomenclatura

```typescript
// Componentes: PascalCase
export const MiComponente = () => {};

// Funciones/Variables: camelCase
const miFuncion = () => {};
const miVariable = 10;

// Tipos/Interfaces: PascalCase con "I" opcional
interface Usuario {} // ✅
type ReportType = 'pdf' | 'excel'; // ✅

// Constantes: UPPER_SNAKE_CASE
const MAX_ITEMS = 100;
const API_URL = 'https://...';

// Archivos:
// - Componentes: PascalCase.tsx
// - Utils: camelCase.ts
// - Types: index.ts
```

### Estructura de Componentes

```typescript
// 1. Imports
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIcon } from '@fortawesome/free-solid-svg-icons';
import type { MiTipo } from '../types';

// 2. Types/Interfaces
interface MiComponenteProps {
  titulo: string;
  onAction: () => void;
}

// 3. Componente
export const MiComponente = ({ titulo, onAction }: MiComponenteProps) => {
  // 3.1 Hooks
  const [estado, setEstado] = useState('');

  // 3.2 Funciones
  const handleClick = () => {
    // lógica
  };

  // 3.3 Render
  return (
    <div className="card p-6">
      <h2 className="text-xl font-heading font-bold text-secondary-900">
        {titulo}
      </h2>
      <button onClick={handleClick} className="btn btn-primary">
        Acción
      </button>
    </div>
  );
};
```

### Estilos

```typescript
// ✅ HACER: Usar clases de Tailwind y predefinidas
<div className="card p-6 bg-primary-50 border-l-4 border-primary-600">
  <button className="btn btn-primary">Click</button>
</div>

// ✅ HACER: Usar colores de la paleta
<p className="text-secondary-600">Texto</p>
<div className="bg-primary-500">Fondo</div>

// ❌ EVITAR: Colores arbitrarios
<div className="bg-[#123456]">Malo</div>

// ❌ EVITAR: Estilos inline
<div style={{ color: 'red' }}>Malo</div>
```

### Manejo de Estado

```typescript
// ✅ HACER: Estados simples con useState
const [nombre, setNombre] = useState('');
const [activo, setActivo] = useState(false);

// ✅ HACER: Estados complejos agrupados
interface FormData {
  nombre: string;
  email: string;
  rol: string;
}
const [formData, setFormData] = useState<FormData>({
  nombre: '',
  email: '',
  rol: '',
});

// Actualizar parcialmente
setFormData(prev => ({ ...prev, nombre: 'Nuevo' }));
```

### Datos Mock

```typescript
// Siempre comentar que son datos mock
// Mock Data - Dashboard
const mockDashboard: AnalyticsDashboard = {
  total_students: 1250,
  active_students: 1180,
  // ...
};

// Agregar comentario para backend
// TODO: Reemplazar con llamada a API
// const dashboard = await fetchDashboard();
```

---

## 🔄 Flujo de Trabajo Git

### Branches

```bash
main              # Producción - código estable
develop           # Desarrollo - integración
feature/xxx       # Nuevas características
fix/xxx           # Correcciones
hotfix/xxx        # Correcciones urgentes en producción
```

### Workflow

```bash
# 1. Crear branch desde develop
git checkout develop
git pull origin develop
git checkout -b feature/mi-nueva-funcionalidad

# 2. Hacer cambios y commits
git add .
git commit -m "feat: agregar módulo de reportes"

# 3. Push y Pull Request
git push origin feature/mi-nueva-funcionalidad
# Crear PR en GitHub hacia develop

# 4. Después del merge, actualizar local
git checkout develop
git pull origin develop
git branch -d feature/mi-nueva-funcionalidad
```

### Mensajes de Commit

```bash
# Formato: <tipo>: <descripción>

feat: agregar módulo de reportes
fix: corregir cálculo de asistencia
style: actualizar colores del dashboard
refactor: mejorar estructura de componentes
docs: actualizar documentación de API
test: agregar tests para validación de formularios
```

### Tipos de Commit

- **feat**: Nueva funcionalidad
- **fix**: Corrección de bugs
- **style**: Cambios de estilos/formato
- **refactor**: Refactorización de código
- **docs**: Documentación
- **test**: Tests
- **chore**: Tareas de mantenimiento

---

## 🚀 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo
npm run build            # Compilar para producción
npm run preview          # Previsualizar build de producción

# Linting y formato
npm run lint             # Verificar código

# Git
git status               # Ver estado
git log --oneline        # Ver historial
git branch              # Ver branches
```

---

## 📞 Contacto y Soporte

- **Documentación del Proyecto**: Ver carpeta `/docs`
- **Issues**: GitHub Issues
- **Code Review**: Obligatorio para merge a `develop`

---

## 📝 Checklist para Nuevos Desarrolladores

- [ ] Clonar repositorio
- [ ] Instalar dependencias: `npm install`
- [ ] Revisar esta guía completa
- [ ] Revisar paleta de colores en `PALETA_COLORES.md`
- [ ] Explorar un módulo existente (ej: Analytics)
- [ ] Crear branch de prueba
- [ ] Hacer un commit de prueba
- [ ] Pedir acceso al proyecto en GitHub
- [ ] Configurar git con tu usuario

---

**¡Bienvenido al equipo TechProc! 🎉**
