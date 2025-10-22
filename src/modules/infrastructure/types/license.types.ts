// src/modules/infrastructure/types/license.types.ts

/**
 * 📦 Estructura que devuelve la API (según modelo de Laravel)
 */
export interface ApiLicense {
  id: number;
  software_name: string;
  license_key: string;
  license_type: string;
  provider: string;
  purchase_date: string; // formato ISO 'YYYY-MM-DD'
  expiration_date?: string | null;
  seats_total: number;
  seats_used: number;
  cost_annual: number;
  status: string;
  responsible_id?: number | null; // id del empleado responsable
  notes: string;
  created_at?: string;
  //updated_at?: string;
}

/**
 * 🧠 Modelo usado en el frontend
 */
export interface License {
  id: number;
  software_name: string;
  license_key: string;
  license_type?: string;
  provider?: string;
  purchase_date?: string;
  expiration_date?: string;
  seats_total?: number;
  seats_used?: number;
  cost_annual?: number;
  status?: string;
  responsible_id?: number | null;
  notes?: string;
  //created_At?: string;
  //updated_At?: string;
}

/**
 * ✏️ Datos requeridos para crear una licencia
 * Todos los campos son obligatorios excepto los opcionales definidos por el backend
 */
export interface CreateLicenseData {
  software_name: string;
  license_key: string;
  license_type: string;
  provider: string;
  purchase_date: string;
  expiration_date?: string | null;
  seats_total: number;
  seats_used: number;
  cost_annual: number;
  status: string;
  responsible_id?: number | null;
  notes?: string | null;
}

/**
 * 🧩 Datos para actualizar una licencia existente
 * Todos los campos opcionales para poder actualizar solo los que cambian
 */
export type UpdateLicenseData = Partial<CreateLicenseData>;
