import {apiRequest} from '../../../services/api.config';

import type{
    Software,
    CreateSoftwareData,
    UpdateSoftwareData,
    ApiSoftware
} from '../types/software.types';

// Tipos de respuesta según la API Laravel
interface SoftwareListResponse{
    success: boolean;
    data:ApiSoftware[];
}

interface SoftwareDetailResponse{
    success: boolean;
    data:ApiSoftware;
}

interface SoftwareCreateResponse{
    success: boolean;
    message: string;
    data: ApiSoftware;
}

interface SoftwareUpdateResponse{
    success: boolean;
    data:ApiSoftware;
}

interface SoftwareDeleteResponse{
    success: boolean;
    message: string;
}

// Mapeo de API -> modelo de frontend
const mapApiSoftwareToSoftware = (apiSoftware: ApiSoftware): Software => ({
    id: apiSoftware.id,
    name: apiSoftware.name,
    version: apiSoftware.version,
    license_type: apiSoftware.license_type,
    vendor: apiSoftware.vendor,
    install_date: apiSoftware.install_date,
    expiration_date: apiSoftware.expiration_date,
    status: apiSoftware.status,
});


const BASE_ENDPOINT = '/infraestructura/softwares'

export const SoftwareServices = {
    async getAll(): Promise<Software[]> {
        const res = await apiRequest<SoftwareListResponse>(BASE_ENDPOINT, {
            method: 'GET',
        });
        console.log('Cómo estamos traendo los softwares', res);
        return res.map(mapApiSoftwareToSoftware);
    },

    async getById(id: number): Promise<Software>{
        const res = await apiRequest<SoftwareDetailResponse>(`${BASE_ENDPOINT}/${id}`,{
            method: 'GET',
        });
        return mapApiSoftwareToSoftware(res.data);
    },

    async create(data: CreateSoftwareData): Promise<Software>{
        const res = await apiRequest<SoftwareCreateResponse>(BASE_ENDPOINT,{
            method: 'POST',
            body: JSON.stringify(data),
        });
        return mapApiSoftwareToSoftware(res.data);
    },

    async update(id: number, data: UpdateSoftwareData): Promise<Software> {
        const res = await apiRequest<SoftwareUpdateResponse>(`${BASE_ENDPOINT}/${id}`, {
            method : 'PUT',
            body: JSON.stringify(data),
        });
        return mapApiSoftwareToSoftware(res.data);
    },

    async delete(id: number): Promise<boolean>{
        const res = await apiRequest<SoftwareDeleteResponse>(`${BASE_ENDPOINT}/${id}`, {
            method: 'DELETE',
        });
        return res.success;
    },
};