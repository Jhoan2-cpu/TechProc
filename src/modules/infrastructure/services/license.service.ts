import {apiRequest} from '../../../services/api.config';

import type{
    License,
    CreateLicenseData,
    UpdateLicenseData,
    ApiLicense
} from '../types/license.types';

// Tipos de respuesta según la API Laravel
interface LicenseListResponse{
    success: boolean;
    data:ApiLicense[];
}

interface LicenseDetailResponse{
    success: boolean;
    data:ApiLicense;
}

interface LicenseCreateResponse{
    success: boolean;
    message: string;
    data: ApiLicense;
}

interface LicenseUpdateResponse{
    success: boolean;
    data:ApiLicense;
}

interface LicenseDeleteResponse{
    success: boolean;
    message: string;
}

// Mapeo de API -> modelo de frontend
const mapApiLicenseToLicense =(apiLicense: ApiLicense): License => ({
    id: apiLicense.id,
    code: apiLicense.id_license,
    softwareName: apiLicense.software_name,
    licenseKey: apiLicense.license_key,
    licenseType: apiLicense.license_type,
    provider: apiLicense.provider,
    purchaseDate: apiLicense.purchase_date,
    expirationDate: apiLicense.expiration_date || null,
    seatsTotal:apiLicense.seats_total,
    seatsUsed: apiLicense.seats_used,
    costAnnual: apiLicense.cost_annual,
    status: apiLicense.status,
    responsibleId: apiLicense.responsible_id || null,
    notes: apiLicense.notes,
    createdAt: apiLicense.created_at,
    updatedAt: apiLicense.updated_at,
});


const BASE_ENDPOINT = '/infraestructura/licenses'

export const LicenseServices = {
    async getAll(): Promise<License[]> {
        const res = await apiRequest<LicenseListResponse>(BASE_ENDPOINT, {
            method: 'GET',
        });
        return res.data.map(mapApiLicenseToLicense);
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
        return mapApiLicenseToLicense(res.data);
    },

    async update(id: number, data: UpdateLicenseData): Promise<License> {
        const res = await apiRequest<LicenseUpdateResponse>(`${BASE_ENDPOINT}/${id}`, {
            method : 'PUT',
            body: JSON.stringify(data),
        });
        return mapApiLicenseToLicense(res.data);
    },

    async delete(id: number): Promise<boolean>{
        const res = await apiRequest<LicenseDeleteResponse>(`${BASE_ENDPOINT}/${id}`, {
            method: 'DELETE',
        });
        return res.success;
    },
};