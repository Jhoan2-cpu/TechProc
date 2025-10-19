// src/modules/infrastructure/types/employee.types.ts

// 💾 Estructura que devuelve la API
export interface ApiEmployee {
  id: number;
  employee_id: number;
  hire_date: string;
  position_id: number;
  department_id: number;
  user_id: number;
  employment_status: string;
  schedule: string;
  speciality: string;
  salary: number;
  create_at?: string;
  updated_at?: string;
}

// 🧠 Modelo del frontend
export interface Employee {
  id: number;
  code: number;
  hireDate: string;
  positionId: number;
  departmentId: number;
  userId: number;
  status: string;
  schedule: string;
  speciality: string;
  salary: number;
  createdAt?: string;
  updatedAt?: string;
}

// ✏️ Datos para crear empleado
export interface CreateEmployeeData {
    code: number;
    hireDate: string;
    positionId: number;
    departmentId: number;
    userId: number;
    status: string;
    schedule: string;
    speciality: string;
    salary: number;
}

// 🧩 Datos para actualizar empleado
export interface UpdateEmployeeData extends Partial<CreateEmployeeData> {}
