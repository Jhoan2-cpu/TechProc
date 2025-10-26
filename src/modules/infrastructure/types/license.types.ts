// src/modules/infrastructure/types/license.types.ts

/**
 * 📦 Estructura que devuelve la API (según modelo de Laravel)
 */
export interface ApiLicense {
  id: number;
  id_license: number | null;
  software_name: string;
  license_key: string;
  license_type: string;
  provider: string;
  purchase_date: string; // formato ISO 'YYYY-MM-DD'
  expiration_date?: string | null;
  seats_total: number;
  seats_used: number;
  cost_annual: string; // El backend devuelve como string
  status: string;
  responsible_id?: number | null; // id del empleado responsable
  notes: string | null;
  created_at?: string;
  software: any | null; // Objeto de software relacionado (puede ser null)
  responsible: {
    id: number;
    employee_id: string | null;
    hire_date: string;
    position_id: number;
    department_id: number;
    user_id: number;
    employment_status: string;
    schedule: string;
    speciality: string;
    salary: string;
    created_at: string;
    updated_at: string | null;
  } | null;
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
  responsible?: {
    id: number;
    employee_id: string | null;
    hire_date: string;
    position_id: number;
    department_id: number;
    user_id: number;
    employment_status: string;
    schedule: string;
    speciality: string;
    salary: string;
    created_at: string;
    updated_at: string | null;
  };
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
