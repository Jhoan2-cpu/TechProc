import {apiRequest} from '../../../services/api.config';

import type {
    Software,
    CreateSoftwareData,
    UpdateSoftwareData
} from '../types';

import type { ApiSoftware } from '../types';

// Mapeo de API -> modelo de frontend
const mapApiSoftwareToSoftware = (apiSoftware: ApiSoftware): Software => ({
    id_software: apiSoftware.id,
    software_name: apiSoftware.software_name,
    version: apiSoftware.version,
    category: apiSoftware.category,
    vendor: apiSoftware.vendor,
    license_id: apiSoftware.license_id,
    installation_date: apiSoftware.installation_date,
    last_update: apiSoftware.last_update,
});


const BASE_ENDPOINT = '/infraestructura/softwares'

export const SoftwareServices = {
    async getAll(): Promise<Software[]> {
        // El backend devuelve directamente un array de softwares, no un objeto con success/data
        const res = await apiRequest<ApiSoftware[]>(BASE_ENDPOINT, {
            method: 'GET',
        });
        console.log('Softwares obtenidos:', res);
        return res.map(mapApiSoftwareToSoftware);
    },

    async getById(id: number): Promise<Software>{
        const res = await apiRequest<ApiSoftware>(`${BASE_ENDPOINT}/${id}`,{
            method: 'GET',
        });
        return mapApiSoftwareToSoftware(res);
    },

    async create(data: CreateSoftwareData): Promise<Software>{
        const res = await apiRequest<ApiSoftware>(BASE_ENDPOINT,{
            method: 'POST',
            body: JSON.stringify(data),
        });
        console.log('Software creado:', res);
        return mapApiSoftwareToSoftware(res);
    },

    async update(id: number, data: UpdateSoftwareData): Promise<Software> {
        const res = await apiRequest<ApiSoftware>(`${BASE_ENDPOINT}/${id}`, {
            method : 'PUT',
            body: JSON.stringify(data),
        });
        console.log('Software actualizado:', res);
        return mapApiSoftwareToSoftware(res);
    },

    async delete(id: number): Promise<boolean>{
        await apiRequest<void>(`${BASE_ENDPOINT}/${id}`, {
            method: 'DELETE',
        });
        return true;
    },
};