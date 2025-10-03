# 🎯 Ejemplo Paso a Paso: Crear Módulo "Inventario"

Esta guía te llevará de la mano para crear un nuevo módulo completo desde cero, usando como ejemplo un módulo de "Inventario de Equipos".

---

## 📋 Objetivo del Módulo

Crear un módulo de inventario que permita:
- Ver listado de equipos
- Agregar nuevos equipos
- Editar equipos existentes
- Ver estadísticas del inventario

---

## 🛠️ Paso 1: Preparar el Entorno

### 1.1 Crear Branch

```bash
# Asegúrate de estar en develop actualizado
git checkout develop
git pull origin develop

# Crear nuevo branch
git checkout -b feature/modulo-inventario
```

### 1.2 Crear Estructura de Carpetas

```bash
# Desde la raíz del proyecto
mkdir -p src/modules/inventory/{components,pages,types,utils}
```

Tu estructura debería verse así:
```
src/modules/inventory/
├── components/
├── pages/
├── types/
└── utils/
```

---

## 📝 Paso 2: Definir los Types

### 2.1 Crear `src/modules/inventory/types/index.ts`

```typescript
// types/index.ts

/**
 * Interface principal para un equipo del inventario
 */
export interface Equipment {
  id: number;
  name: string;
  type: EquipmentType;
  brand: string;
  model: string;
  serialNumber: string;
  status: EquipmentStatus;
  assignedTo: string | null;
  location: string;
  purchaseDate: string;
  warrantyExpires: string | null;
  price: number;
  notes?: string;
}

/**
 * Tipos de equipo disponibles
 */
export type EquipmentType = 'laptop' | 'desktop' | 'monitor' | 'server' | 'network' | 'other';

/**
 * Estados posibles de un equipo
 */
export type EquipmentStatus = 'available' | 'assigned' | 'maintenance' | 'retired';

/**
 * Interface para estadísticas del inventario
 */
export interface InventoryStats {
  totalEquipment: number;
  availableEquipment: number;
  assignedEquipment: number;
  maintenanceEquipment: number;
  totalValue: number;
}

/**
 * Interface para formulario de nuevo equipo
 */
export interface EquipmentFormData {
  name: string;
  type: EquipmentType;
  brand: string;
  model: string;
  serialNumber: string;
  status: EquipmentStatus;
  assignedTo: string;
  location: string;
  purchaseDate: string;
  warrantyExpires: string;
  price: number;
  notes: string;
}
```

**💡 Por qué este paso es importante:**
- Define la estructura de datos del módulo
- Facilita el autocompletado en el IDE
- Previene errores de tipos en tiempo de desarrollo

---

## 🎨 Paso 3: Crear Componentes Reutilizables

### 3.1 Crear `components/EquipmentCard.tsx`

```typescript
// components/EquipmentCard.tsx

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptop, faDesktop, faTv, faServer, faNetworkWired, faCog, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { Equipment } from '../types';

interface EquipmentCardProps {
  equipment: Equipment;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const EquipmentCard = ({ equipment, onEdit, onDelete }: EquipmentCardProps) => {
  // Mapeo de iconos según tipo de equipo
  const getEquipmentIcon = (type: string) => {
    const icons = {
      laptop: faLaptop,
      desktop: faDesktop,
      monitor: faTv,
      server: faServer,
      network: faNetworkWired,
      other: faCog,
    };
    return icons[type as keyof typeof icons] || faCog;
  };

  // Colores según estado
  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-100 text-green-900',
      assigned: 'bg-blue-100 text-blue-900',
      maintenance: 'bg-yellow-100 text-yellow-900',
      retired: 'bg-red-100 text-red-900',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-900';
  };

  // Texto en español del estado
  const getStatusText = (status: string) => {
    const texts = {
      available: 'Disponible',
      assigned: 'Asignado',
      maintenance: 'Mantenimiento',
      retired: 'Retirado',
    };
    return texts[status as keyof typeof texts] || status;
  };

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      {/* Header con icono y estado */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-primary-100 flex items-center justify-center">
            <FontAwesomeIcon
              icon={getEquipmentIcon(equipment.type)}
              className="text-2xl text-primary-600"
            />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-secondary-900">
              {equipment.name}
            </h3>
            <p className="text-sm text-secondary-600">
              {equipment.brand} {equipment.model}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(equipment.status)}`}>
          {getStatusText(equipment.status)}
        </span>
      </div>

      {/* Detalles */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div>
          <p className="text-secondary-500 text-xs">Serial</p>
          <p className="text-secondary-900 font-medium">{equipment.serialNumber}</p>
        </div>
        <div>
          <p className="text-secondary-500 text-xs">Ubicación</p>
          <p className="text-secondary-900 font-medium">{equipment.location}</p>
        </div>
        {equipment.assignedTo && (
          <div>
            <p className="text-secondary-500 text-xs">Asignado a</p>
            <p className="text-secondary-900 font-medium">{equipment.assignedTo}</p>
          </div>
        )}
        <div>
          <p className="text-secondary-500 text-xs">Precio</p>
          <p className="text-secondary-900 font-medium">${equipment.price.toLocaleString()}</p>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2 pt-4 border-t border-secondary-200">
        <button
          onClick={() => onEdit(equipment.id)}
          className="btn btn-outline px-4 py-2 text-sm flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faEdit} />
          Editar
        </button>
        <button
          onClick={() => onDelete(equipment.id)}
          className="btn bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faTrash} />
          Eliminar
        </button>
      </div>
    </div>
  );
};
```

### 3.2 Crear `components/InventoryStats.tsx`

```typescript
// components/InventoryStats.tsx

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faCheckCircle, faUserCheck, faTools } from '@fortawesome/free-solid-svg-icons';
import type { InventoryStats } from '../types';

interface InventoryStatsProps {
  stats: InventoryStats;
}

export const InventoryStatsComponent = ({ stats }: InventoryStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total de Equipos */}
      <div className="card p-6 bg-gradient-to-br from-primary-50 to-primary-100 border-l-4 border-primary-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-secondary-600 mb-1">Total Equipos</p>
            <p className="text-3xl font-heading font-bold text-primary-900">
              {stats.totalEquipment}
            </p>
          </div>
          <FontAwesomeIcon icon={faBox} className="text-4xl text-primary-600 opacity-50" />
        </div>
      </div>

      {/* Disponibles */}
      <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-secondary-600 mb-1">Disponibles</p>
            <p className="text-3xl font-heading font-bold text-green-900">
              {stats.availableEquipment}
            </p>
          </div>
          <FontAwesomeIcon icon={faCheckCircle} className="text-4xl text-green-600 opacity-50" />
        </div>
      </div>

      {/* Asignados */}
      <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-secondary-600 mb-1">Asignados</p>
            <p className="text-3xl font-heading font-bold text-blue-900">
              {stats.assignedEquipment}
            </p>
          </div>
          <FontAwesomeIcon icon={faUserCheck} className="text-4xl text-blue-600 opacity-50" />
        </div>
      </div>

      {/* En Mantenimiento */}
      <div className="card p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-secondary-600 mb-1">Mantenimiento</p>
            <p className="text-3xl font-heading font-bold text-yellow-900">
              {stats.maintenanceEquipment}
            </p>
          </div>
          <FontAwesomeIcon icon={faTools} className="text-4xl text-yellow-600 opacity-50" />
        </div>
      </div>
    </div>
  );
};
```

### 3.3 Crear `components/index.ts` (Barrel Export)

```typescript
// components/index.ts

export { EquipmentCard } from './EquipmentCard';
export { InventoryStatsComponent } from './InventoryStats';
```

**💡 Ventaja del Barrel Export:**
Permite importar múltiples componentes en una sola línea:
```typescript
import { EquipmentCard, InventoryStatsComponent } from '../components';
```

---

## 📄 Paso 4: Crear la Página Principal

### 4.1 Crear `pages/InventoryPage.tsx`

```typescript
// pages/InventoryPage.tsx

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox,
  faPlus,
  faFilter,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { EquipmentCard, InventoryStatsComponent } from '../components';
import type { Equipment, InventoryStats, EquipmentStatus } from '../types';

// Mock Data (temporal, luego vendrá del backend)
const mockEquipment: Equipment[] = [
  {
    id: 1,
    name: 'MacBook Pro 16"',
    type: 'laptop',
    brand: 'Apple',
    model: 'M2 Max',
    serialNumber: 'C02XY123456',
    status: 'assigned',
    assignedTo: 'Juan Pérez',
    location: 'Oficina 201',
    purchaseDate: '2023-05-15',
    warrantyExpires: '2026-05-15',
    price: 2499,
    notes: 'Equipo para desarrollo',
  },
  {
    id: 2,
    name: 'Dell Monitor 27"',
    type: 'monitor',
    brand: 'Dell',
    model: 'U2720Q',
    serialNumber: 'CN-0ABC123',
    status: 'available',
    assignedTo: null,
    location: 'Almacén',
    purchaseDate: '2023-03-10',
    warrantyExpires: '2026-03-10',
    price: 599,
  },
  {
    id: 3,
    name: 'Servidor HP ProLiant',
    type: 'server',
    brand: 'HP',
    model: 'DL380 Gen10',
    serialNumber: 'MX123ABC',
    status: 'maintenance',
    assignedTo: null,
    location: 'Data Center',
    purchaseDate: '2022-01-20',
    warrantyExpires: '2025-01-20',
    price: 3500,
    notes: 'Actualización de RAM programada',
  },
];

const mockStats: InventoryStats = {
  totalEquipment: 45,
  availableEquipment: 12,
  assignedEquipment: 28,
  maintenanceEquipment: 5,
  totalValue: 125000,
};

export const InventoryPage = () => {
  // Estados
  const [equipment, setEquipment] = useState<Equipment[]>(mockEquipment);
  const [stats] = useState<InventoryStats>(mockStats);
  const [filterStatus, setFilterStatus] = useState<EquipmentStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Funciones
  const handleEdit = (id: number) => {
    const item = equipment.find(e => e.id === id);
    console.log('Editar:', item);
    // TODO: Abrir modal de edición
    alert(`Editar equipo ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este equipo?')) {
      setEquipment(prev => prev.filter(e => e.id !== id));
      alert('Equipo eliminado');
    }
  };

  const handleAddNew = () => {
    // TODO: Abrir modal de crear nuevo
    alert('Abrir formulario de nuevo equipo');
  };

  // Filtrado y búsqueda
  const filteredEquipment = equipment.filter(item => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-secondary-50 p-6">
      {/* Header */}
      <div className="mb-6 pb-6 border-b-2 border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-secondary-900 flex items-center">
              <FontAwesomeIcon icon={faBox} className="mr-3 text-primary-600" />
              Inventario de Equipos
            </h1>
            <p className="text-secondary-600 mt-2">
              Gestión y control del inventario tecnológico
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="btn btn-primary flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            Agregar Equipo
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="mb-6">
        <InventoryStatsComponent stats={stats} />
      </div>

      {/* Filtros y Búsqueda */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        {/* Búsqueda */}
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400"
            />
            <input
              type="text"
              placeholder="Buscar por nombre, marca o serial..."
              className="input pl-12 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filtro por estado */}
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faFilter} className="text-secondary-400" />
          <select
            className="select min-w-[200px]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
          >
            <option value="all">Todos los estados</option>
            <option value="available">Disponibles</option>
            <option value="assigned">Asignados</option>
            <option value="maintenance">En Mantenimiento</option>
            <option value="retired">Retirados</option>
          </select>
        </div>
      </div>

      {/* Listado de Equipos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEquipment.length === 0 ? (
          <div className="col-span-full card p-8 text-center">
            <p className="text-secondary-600">No se encontraron equipos</p>
          </div>
        ) : (
          filteredEquipment.map((item) => (
            <EquipmentCard
              key={item.id}
              equipment={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};
```

---

## 🔗 Paso 5: Integrar en el Sistema

### 5.1 Actualizar `App.tsx`

```typescript
// App.tsx

// 1. Agregar import
import { InventoryPage } from './modules/inventory/pages/InventoryPage';

// 2. Agregar al renderModule (línea ~80)
const renderModule = () => {
  if (!currentUser) return null;

  switch (currentModule) {
    // ... otros casos
    case 'inventory': return <InventoryPage />;  // ← AGREGAR ESTO
    // ...
  }
};

// 3. Agregar al array de módulos (línea ~107)
const modules = [
  { id: 'users', name: 'Gestión de Usuarios', icon: faUsers },
  { id: 'inventory', name: 'Inventario', icon: faBox },  // ← AGREGAR ESTO
  // ... resto de módulos
];
```

### 5.2 Agregar icono faltante

```typescript
// En los imports de App.tsx
import {
  faUsers,
  faGraduationCap,
  faTicket,
  faLock,
  faServer,
  faGlobe,
  faChartLine,
  faRightFromBracket,
  faUserCircle,
  faUserClock,
  faBox,  // ← AGREGAR ESTE IMPORT
} from '@fortawesome/free-solid-svg-icons';
```

### 5.3 Actualizar Permisos en `shared/utils/auth.ts`

```typescript
// shared/utils/auth.ts

export const PERMISSIONS: Record<string, string[]> = {
  admin: [
    'users',
    'pending-registrations',
    'inventory',  // ← AGREGAR
    'lms',
    'tickets',
    'security',
    'infrastructure',
    'web',
    'analytics',
  ],
  lms: ['lms', 'analytics'],
  seg: ['tickets', 'security'],
  infra: ['tickets', 'infrastructure', 'inventory'],  // ← AGREGAR (ejemplo)
  web: ['tickets', 'web'],
  data: ['analytics'],
};
```

---

## ✅ Paso 6: Probar el Módulo

### 6.1 Compilar el Proyecto

```bash
npm run build
```

Si hay errores, revisa:
- Imports correctos
- Tipos bien definidos
- Sintaxis TypeScript

### 6.2 Ejecutar en Desarrollo

```bash
npm run dev
```

### 6.3 Probar Funcionalidades

1. **Login**: Usa el usuario `admin`
2. **Navegar**: Haz clic en "Inventario" en el sidebar
3. **Verificar**:
   - ✅ Las estadísticas se muestran correctamente
   - ✅ La búsqueda funciona
   - ✅ Los filtros funcionan
   - ✅ Los botones de editar/eliminar responden
   - ✅ El diseño es responsive

---

## 🎨 Paso 7: Ajustar Estilos (Opcional)

### 7.1 Agregar Animaciones

```typescript
// En InventoryPage.tsx, en el map de equipos:

filteredEquipment.map((item, index) => (
  <div
    key={item.id}
    className="animate-fade-in"
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    <EquipmentCard
      equipment={item}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  </div>
))
```

### 7.2 Mejorar UX con Loading States

```typescript
const [isLoading, setIsLoading] = useState(false);

// En el render:
{isLoading ? (
  <div className="flex justify-center items-center h-64">
    <p className="text-secondary-600">Cargando...</p>
  </div>
) : (
  // ... renderizado normal
)}
```

---

## 📤 Paso 8: Commit y Push

### 8.1 Review de Cambios

```bash
git status
git diff
```

### 8.2 Commit

```bash
git add .
git commit -m "feat: agregar módulo de inventario

- Componente EquipmentCard para mostrar equipos
- Componente InventoryStats para estadísticas
- Página principal InventoryPage con filtros
- Integración en App.tsx
- Permisos configurados para admin e infra"
```

### 8.3 Push

```bash
git push origin feature/modulo-inventario
```

### 8.4 Crear Pull Request

1. Ve a GitHub
2. Crea PR desde `feature/modulo-inventario` hacia `develop`
3. Describe los cambios
4. Solicita code review

---

## 🚀 Paso 9: Extensiones Futuras

### Ideas para mejorar el módulo:

1. **Modal de Creación/Edición**
   - Formulario completo
   - Validación de campos
   - Upload de imágenes del equipo

2. **Exportación de Datos**
   - Exportar a Excel
   - Exportar a PDF
   - Generar códigos QR

3. **Historial de Cambios**
   - Registro de asignaciones
   - Historial de mantenimientos
   - Timeline de eventos

4. **Alertas**
   - Notificación de garantías por vencer
   - Alertas de mantenimiento programado
   - Equipos no asignados por mucho tiempo

5. **Dashboard Avanzado**
   - Gráficos de distribución por tipo
   - Evolución del inventario en el tiempo
   - Valor total por categoría

---

## 📚 Recursos Adicionales

### Documentación del Proyecto
- `GUIA_DESARROLLO.md` - Guía completa
- `ESTRUCTURA_VISUAL.md` - Diagramas y arquitectura
- `PALETA_COLORES.md` - Guía de estilos

### Librerías Útiles
- [React Icons](https://react-icons.github.io/react-icons/) - Más iconos
- [React Hook Form](https://react-hook-form.com/) - Formularios avanzados
- [React Query](https://tanstack.com/query) - Manejo de datos del servidor

### Herramientas de Desarrollo
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)

---

## ❓ FAQ - Preguntas Frecuentes

**P: ¿Dónde pongo las funciones de API?**
R: Créalas en `modules/inventory/utils/api.ts` y luego impórtalas en la página.

**P: ¿Cómo manejar estados globales?**
R: Para estados complejos, considera usar Context API o Zustand.

**P: ¿Puedo usar librerías de terceros?**
R: Sí, pero consulta primero con el equipo. Instala con `npm install [libreria]`

**P: ¿Los datos mock dónde van en producción?**
R: Reemplázalos con llamadas a API usando `fetch` o `axios`

**P: ¿Cómo hacer el módulo responsive?**
R: Usa las clases de Tailwind: `md:`, `lg:`, `xl:`. Ya están configuradas.

---

## ✅ Checklist Final

Antes de hacer el PR, verifica:

- [ ] TypeScript sin errores (`npm run build`)
- [ ] Código formateado correctamente
- [ ] Imports organizados (tipos, librerías, componentes)
- [ ] Comentarios en funciones complejas
- [ ] Componentes reutilizables en carpeta correcta
- [ ] Estilos usando la paleta del proyecto
- [ ] Responsive en mobile, tablet y desktop
- [ ] Funcionalidades básicas probadas
- [ ] Permisos configurados correctamente
- [ ] Documentación actualizada (si aplica)

---

**¡Felicidades! Has creado tu primer módulo completo en TechProc 🎉**

Si tienes dudas, consulta la documentación o pregunta al equipo.
