import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faServer } from '@fortawesome/free-solid-svg-icons';
import type { Server, ServerStatus } from '../types';

interface ServerFormModalProps {
  isOpen: boolean;
  server: Server | null; // null = nuevo servidor, Server = editar servidor
  onSave: (serverData: Partial<Server>) => void;
  onCancel: () => void;
}

export const ServerFormModal = ({ isOpen, server, onSave, onCancel }: ServerFormModalProps) => {
  const [formData, setFormData] = useState({
    server_name: '',
    ip_address: '',
    operating_system: '',
    cpu_cores: 4,
    ram_gb: 8,
    disk_gb: 100,
    status: 'online' as ServerStatus,
    location: '',
    installation_date: new Date().toISOString().split('T')[0],
    services_running: [] as string[],
    serviceInput: '',
  });

  useEffect(() => {
    if (server) {
      setFormData({
        server_name: server.server_name,
        ip_address: server.ip_address,
        operating_system: server.operating_system,
        cpu_cores: server.cpu_cores,
        ram_gb: server.ram_gb,
        disk_gb: server.disk_gb,
        status: server.status,
        location: server.location,
        installation_date: server.installation_date.split('T')[0],
        services_running: [...server.services_running],
        serviceInput: '',
      });
    } else {
      setFormData({
        server_name: '',
        ip_address: '',
        operating_system: '',
        cpu_cores: 4,
        ram_gb: 8,
        disk_gb: 100,
        status: 'online',
        location: '',
        installation_date: new Date().toISOString().split('T')[0],
        services_running: [],
        serviceInput: '',
      });
    }
  }, [server, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const serverData: Partial<Server> = {
      server_name: formData.server_name,
      ip_address: formData.ip_address,
      operating_system: formData.operating_system,
      cpu_cores: formData.cpu_cores,
      ram_gb: formData.ram_gb,
      disk_gb: formData.disk_gb,
      status: formData.status,
      location: formData.location,
      installation_date: new Date(formData.installation_date).toISOString(),
      services_running: formData.services_running,
    };

    if (server) {
      serverData.id_server = server.id_server;
    }

    onSave(serverData);
  };

  const handleAddService = () => {
    if (formData.serviceInput.trim()) {
      setFormData({
        ...formData,
        services_running: [...formData.services_running, formData.serviceInput.trim()],
        serviceInput: '',
      });
    }
  };

  const handleRemoveService = (index: number) => {
    setFormData({
      ...formData,
      services_running: formData.services_running.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-gradient-to-br from-secondary-600 to-secondary-700 border-b border-secondary-200 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-900/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faServer} className="text-primary-600 text-xl" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-white">
              {server ? 'Editar Servidor' : 'Nuevo Servidor'}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-400 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información Básica */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Información Básica
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre del Servidor *
                </label>
                <input
                  type="text"
                  value={formData.server_name}
                  onChange={(e) => setFormData({ ...formData, server_name: e.target.value })}
                  className="input w-full"
                  required
                  placeholder="ej: srv-prod-01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Dirección IP *
                </label>
                <input
                  type="text"
                  value={formData.ip_address}
                  onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                  className="input w-full"
                  required
                  placeholder="ej: 192.168.1.100"
                  pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sistema Operativo *
                </label>
                <input
                  type="text"
                  value={formData.operating_system}
                  onChange={(e) => setFormData({ ...formData, operating_system: e.target.value })}
                  className="input w-full"
                  required
                  placeholder="ej: Ubuntu Server 22.04 LTS"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estado *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as ServerStatus })}
                  className="select w-full"
                  required
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="maintenance">Mantenimiento</option>
                  <option value="error">Error</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ubicación *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input w-full"
                  required
                  placeholder="ej: GCP us-central1 / Lima - Datacenter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fecha de Instalación *
                </label>
                <input
                  type="date"
                  value={formData.installation_date}
                  onChange={(e) => setFormData({ ...formData, installation_date: e.target.value })}
                  className="input w-full"
                  required
                />
              </div>
            </div>
          </div>

          {/* Especificaciones Hardware */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Especificaciones de Hardware
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CPU Cores *
                </label>
                <input
                  type="number"
                  value={formData.cpu_cores}
                  onChange={(e) => setFormData({ ...formData, cpu_cores: parseInt(e.target.value) })}
                  className="input w-full"
                  required
                  min="1"
                  max="128"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  RAM (GB) *
                </label>
                <input
                  type="number"
                  value={formData.ram_gb}
                  onChange={(e) => setFormData({ ...formData, ram_gb: parseInt(e.target.value) })}
                  className="input w-full"
                  required
                  min="1"
                  max="1024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Disco (GB) *
                </label>
                <input
                  type="number"
                  value={formData.disk_gb}
                  onChange={(e) => setFormData({ ...formData, disk_gb: parseInt(e.target.value) })}
                  className="input w-full"
                  required
                  min="10"
                  max="10000"
                />
              </div>
            </div>
          </div>

          {/* Servicios */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Servicios en Ejecución
            </h4>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={formData.serviceInput}
                onChange={(e) => setFormData({ ...formData, serviceInput: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddService())}
                className="input flex-1"
                placeholder="Nombre del servicio (ej: nginx, postgresql)"
              />
              <button
                type="button"
                onClick={handleAddService}
                className="btn bg-primary-600 hover:bg-primary-700 text-white"
              >
                Agregar
              </button>
            </div>
            {formData.services_running.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.services_running.map((service, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-900/20 text-blue-700 text-sm rounded-full flex items-center gap-2"
                  >
                    {service}
                    <button
                      type="button"
                      onClick={() => handleRemoveService(index)}
                      className="text-primary-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Nota de GCP */}
          <div className="bg-primary-900/20 border-l-4 border-blue-400 p-4">
            <p className="text-sm text-primary-400">
              <span className="font-semibold">Nota:</span> Los servidores se integrarán con Google Cloud Platform para monitoreo y gestión avanzada.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 btn bg-secondary-200 hover:bg-secondary-300 text-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 btn bg-primary-600 hover:bg-primary-700 text-white"
            >
              {server ? 'Guardar Cambios' : 'Crear Servidor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
