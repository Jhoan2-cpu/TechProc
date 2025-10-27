// src/modules/infrastructure/types/software.types.ts

// 💾 Estructura que devuelve la API (según backend real)
export interface ApiSoftware {
  id: number;
  id_software: number | null;
  software_name: string;
  version: string;
  category: string;
  vendor: string;
  license_id: number | null;
  installation_date: string;
  last_update: string;
}

// 💡 Modelo usado en el frontend
export interface Software {
  id_software: number;
  software_name: string;
  version?: string;
  category?: string;
  vendor?: string;
  license_id?: number | null;
  installation_date?: string;
  last_update?: string | null;
  // Propiedades opcionales para compatibilidad con código legacy
  server_ids?: number[];
  auto_update?: boolean;
  support_until?: string | null;
}

// ✏️ Datos para crear software
export interface CreateSoftwareData {
  id_software?: number;
  software_name: string;
  version?: string;
  category?: string;
  vendor?: string;
  license_id?: number | null;
  installation_date?: string;
  last_update?: string | null;
}

// 🧩 Datos para actualizar software
export interface UpdateSoftwareData extends Partial<CreateSoftwareData> {}
