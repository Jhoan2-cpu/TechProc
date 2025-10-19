// src/modules/infrastructure/types/software.types.ts

// 💾 Estructura que devuelve la API
export interface ApiSoftware {
  id: number;
  name: string;
  version: string;
  license_type: string;
  vendor: string;
  install_date: string;
  expiration_date?: string | null;
  status: 'activo' | 'inactivo';
}

// 💡 Modelo usado en el frontend (más limpio)
export interface Software {
  id: number;
  name: string;
  version: string;
  license_type: string;
  vendor: string;
  install_date: string;
  expiration_date?: string | null;
  status: string;
}

// ✏️ Datos para crear software
export interface CreateSoftwareData {
  name: string;
  version: string;
  license_type: string;
  vendor: string;
  install_date: string;
  expiration_date?: string | null;
  status: 'activo' | 'inactivo';
}

// 🧩 Datos para actualizar software
export interface UpdateSoftwareData extends Partial<CreateSoftwareData> {}
