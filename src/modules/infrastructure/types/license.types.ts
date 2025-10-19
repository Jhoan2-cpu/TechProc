// src/modules/infrastructure/types/license.types.ts

/**
 * 📦 Estructura que devuelve la API (según modelo de Laravel)
 */
export interface ApiLicense {
  id: number;
  id_license: number;
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
  updated_at?: string;
}

/**
 * 🧠 Modelo usado en el frontend
 */
export interface License {
  id: number;
  code: number; // alias más semántico para id_license
  softwareName: string;
  licenseKey: string;
  licenseType: string;
  provider: string;
  purchaseDate: string;
  expirationDate?: string | null;
  seatsTotal: number;
  seatsUsed: number;
  costAnnual: number;
  status: string;
  responsibleId?: number | null;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * ✏️ Datos requeridos para crear una licencia
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
  notes: string;
}

/**
 * 🧩 Datos para actualizar una licencia existente
 * (todos los campos opcionales)
 */
export interface UpdateLicenseData extends Partial<CreateLicenseData> {}
