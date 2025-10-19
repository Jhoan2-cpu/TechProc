import {apiRequest} from '../../../services/api.config';

import type{
    Employee,
    CreateEmployeeData,
    UpdateEmployeeData,
    ApiEmployee,
} from '../types/employee.types';

// Tipos de respuesta según la API Laravel
interface EmployeeListResponse{
    success: boolean;
    data:ApiEmployee[];
}

interface EmployeeDetailResponse{
    success: boolean;
    data:ApiEmployee;
}

interface EmployeeCreateResponse{
    success: boolean;
    message: string;
    data: ApiEmployee;
}

interface EmployeeUpdateResponse{
    success: boolean;
    data:ApiEmployee;
}

interface EmployeeDeleteResponse{
    success: boolean;
    message: string;
}

// Mapeo de API -> modelo de frontend
const mapApiEmployeeToEmployee =(apiEmployee: ApiEmployee): Employee=> ({
    id: apiEmployee.id,
    code: apiEmployee.employee_id,
    hireDate: apiEmployee.hire_date,
    positionId: apiEmployee.position_id,
    departmentId: apiEmployee.department_id,
    userId: apiEmployee.user_id,
    status: apiEmployee.employment_status,
    schedule: apiEmployee.schedule,
    speciality: apiEmployee.speciality,
    salary: apiEmployee.salary,
    createdAt: apiEmployee.create_at,
    updatedAt: apiEmployee.updated_at,
});


const BASE_ENDPOINT = '/infraestructura/employees'

export const LicenseServices = {
    async getAll(): Promise<Employee[]> {
        const res = await apiRequest<EmployeeListResponse>(BASE_ENDPOINT, {
            method: 'GET',
        });
        return res.data.map(mapApiEmployeeToEmployee);
    },

    async getById(id: number): Promise<Employee>{
        const res = await apiRequest<EmployeeDetailResponse>(`${BASE_ENDPOINT}/${id}`,{
            method: 'GET',
        });
        return mapApiEmployeeToEmployee(res.data);
    },

    async create(data: CreateEmployeeData): Promise<Employee>{
        const res = await apiRequest<EmployeeCreateResponse>(BASE_ENDPOINT,{
            method: 'POST',
            body: JSON.stringify(data),
        });
        return mapApiEmployeeToEmployee(res.data);
    },

    async update(id: number, data: UpdateEmployeeData): Promise<Employee> {
        const res = await apiRequest<EmployeeUpdateResponse>(`${BASE_ENDPOINT}/${id}`, {
            method : 'PUT',
            body: JSON.stringify(data),
        });
        return mapApiEmployeeToEmployee(res.data);
    },

    async delete(id: number): Promise<boolean>{
        const res = await apiRequest<EmployeeDeleteResponse>(`${BASE_ENDPOINT}/${id}`, {
            method: 'DELETE',
        });
        return res.success;
    },
};