import {apiRequest} from '../../../services/api.config';

import type{
    License,
    CreateLicenseData,
    UpdateLicenseData,
    ApiLicense,
    LicenseStatus,
    LicenseType
} from '../types';


// Tipos de respuesta según la API Laravel
interface LicenseListResponse {
    success: boolean;
    data: ApiLicense[];
}

interface LicenseDetailResponse {
    success: boolean;
    data: ApiLicense;
}

interface LicenseCreateResponse {
    success: boolean;
    message: string;
    data: ApiLicense;
}

interface LicenseUpdateResponse {
    success: boolean;
    data: ApiLicense;
}

interface LicenseDeleteResponse {
    success: boolean;
    message: string;
}

// Mapeo de API -> modelo de frontend
const mapApiLicenseToLicense = (apiLicense: ApiLicense): License => ({
    id: apiLicense.id,
    software_name: apiLicense.software_name,
    license_key: apiLicense.license_key,
    license_type: apiLicense.license_type as LicenseType,
    provider: apiLicense.provider,
    purchase_date: apiLicense.purchase_date,
    expiration_date: apiLicense.expiration_date || undefined,
    seats_total: apiLicense.seats_total,
    seats_used: apiLicense.seats_used,
    cost_annual: apiLicense.cost_annual,
    status: apiLicense.status as LicenseStatus,
    responsible_id: apiLicense.responsible_id || undefined,
    notes: apiLicense.notes || undefined,
    //createdAt: apiLicense.created_at,
    //updatedAt: apiLicense.updated_at,
});


const BASE_ENDPOINT = '/infraestructura/licenses'

export const LicenseServices = {
    async getAll(): Promise<License[]> {
        const res = await apiRequest<LicenseListResponse>(BASE_ENDPOINT, {
            method: 'GET',
        });
        console.log("Lista de licencias: ", res);
        return res.map(mapApiLicenseToLicense);
    },

    async getById(id: number): Promise<License>{
        const res = await apiRequest<LicenseDetailResponse>(`${BASE_ENDPOINT}/${id}`,{
            method: 'GET',
        });
        return mapApiLicenseToLicense(res.data);
    },

    async create(data: CreateLicenseData): Promise<License>{
        const res = await apiRequest<LicenseCreateResponse>(BASE_ENDPOINT,{
            method: 'POST',
            body: JSON.stringify(data),
        });
        console.log('Cómo enviamos al hacer post', res);
        return mapApiLicenseToLicense(res);
    },

    async update(id: number, data: UpdateLicenseData): Promise<License> {
        const res = await apiRequest<LicenseUpdateResponse>(`${BASE_ENDPOINT}/${id}`, {
            method : 'PUT',
            body: JSON.stringify(data),

        });
        console.log('Cómo enviamos al actualizar', res);
        return mapApiLicenseToLicense(res);
    },

    async delete(id: number): Promise<boolean>{
        const res = await apiRequest<LicenseDeleteResponse>(`${BASE_ENDPOINT}/${id}`, {
            method: 'DELETE',
        });
        return res?.success ?? true;
    },
};