import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { Software } from '../types';

interface SoftwareFormModalProps {
  isOpen: boolean;
  software: Software | null;
  onSave: (software: Partial<Software>) => void;
  onCancel: () => void;
}

export const SoftwareFormModal = ({ isOpen, software, onSave, onCancel }: SoftwareFormModalProps) => {
  const [formData, setFormData] = useState({
    software_name: '',
    version: '',
    category: '',
    vendor: '',
    license_id: null as number | null,
    installation_date: '',
    last_update: '',
    server_ids: [] as number[],
    auto_update: false,
    support_until: '',
  });

  const [serverIdInput, setServerIdInput] = useState('');

  useEffect(() => {
    if (software) {
      setFormData({
        software_name: software.software_name,
        version: software.version,
        category: software.category,
        vendor: software.vendor,
        license_id: software.license_id,
        installation_date: software.installation_date,
        last_update: software.last_update,
        server_ids: software.server_ids,
        auto_update: software.auto_update,
        support_until: software.support_until || '',
      });
    } else {
      setFormData({
        software_name: '',
        version: '',
        category: '',
        vendor: '',
        license_id: null,
        installation_date: '',
        last_update: '',
        server_ids: [],
        auto_update: false,
        support_until: '',
      });
    }
  }, [software, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddServer = () => {
    const serverId = parseInt(serverIdInput);
    if (serverId && !formData.server_ids.includes(serverId)) {
      setFormData({
        ...formData,
        server_ids: [...formData.server_ids, serverId],
      });
      setServerIdInput('');
    }
  };

  const handleRemoveServer = (serverId: number) => {
    setFormData({
      ...formData,
      server_ids: formData.server_ids.filter(id => id !== serverId),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-gradient-to-br from-secondary-600 to-secondary-700 border-b border-secondary-200 p-6 flex justify-between items-center">
          <h3 className="text-2xl font-heading font-bold text-white">
            {software ? 'Editar Software' : 'Nuevo Software'}
          </h3>
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
                  Nombre del Software *
                </label>
                <input
                  type="text"
                  required
                  value={formData.software_name}
                  onChange={(e) => setFormData({ ...formData, software_name: e.target.value })}
                  className="input w-full"
                  placeholder="Ej: Apache HTTP Server"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Versión *
                </label>
                <input
                  type="text"
                  required
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="input w-full"
                  placeholder="Ej: 2.4.57"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Categoría *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input w-full"
                  placeholder="Ej: Web Server, Database, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Proveedor *
                </label>
                <input
                  type="text"
                  required
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  className="input w-full"
                  placeholder="Ej: Apache Software Foundation"
                />
              </div>
            </div>
          </div>

          {/* Licencia y Fechas */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Licencia y Fechas
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ID de Licencia (opcional)
                </label>
                <input
                  type="number"
                  value={formData.license_id || ''}
                  onChange={(e) => setFormData({ ...formData, license_id: e.target.value ? parseInt(e.target.value) : null })}
                  className="input w-full"
                  placeholder="Dejar vacío si no aplica"
                />
                <p className="text-xs text-gray-300 mt-1">
                  Vincular con una licencia existente en el sistema
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fecha de Instalación *
                </label>
                <input
                  type="date"
                  required
                  value={formData.installation_date}
                  onChange={(e) => setFormData({ ...formData, installation_date: e.target.value })}
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Última Actualización *
                </label>
                <input
                  type="date"
                  required
                  value={formData.last_update}
                  onChange={(e) => setFormData({ ...formData, last_update: e.target.value })}
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Soporte Vigente Hasta
                </label>
                <input
                  type="date"
                  value={formData.support_until}
                  onChange={(e) => setFormData({ ...formData, support_until: e.target.value })}
                  className="input w-full"
                />
              </div>
            </div>
          </div>

          {/* Servidores */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Servidores con esta Instalación
            </h4>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Agregar Servidor
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={serverIdInput}
                  onChange={(e) => setServerIdInput(e.target.value)}
                  className="input flex-1"
                  placeholder="ID del servidor"
                />
                <button
                  type="button"
                  onClick={handleAddServer}
                  className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Agregar
                </button>
              </div>
              <p className="text-xs text-gray-300 mt-1">
                Ingresa el ID del servidor donde está instalado este software
              </p>
            </div>

            {formData.server_ids.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-400 mb-2">
                  Servidores asociados ({formData.server_ids.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.server_ids.map((serverId) => (
                    <div
                      key={serverId}
                      className="px-3 py-2 bg-primary-900/20 text-primary-700 font-medium rounded-lg flex items-center gap-2"
                    >
                      Servidor #{serverId}
                      <button
                        type="button"
                        onClick={() => handleRemoveServer(serverId)}
                        className="text-primary-700 hover:text-red-600 transition-colors"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Advertencia:</span> No hay servidores asociados a este software.
                </p>
              </div>
            )}
          </div>

          {/* Configuración de Actualizaciones */}
          <div className="card p-6 bg-success/20 border-green-200">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Configuración de Actualizaciones
            </h4>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="auto_update"
                checked={formData.auto_update}
                onChange={(e) => setFormData({ ...formData, auto_update: e.target.checked })}
                className="w-5 h-5 text-primary-600"
              />
              <label htmlFor="auto_update" className="text-sm font-medium text-gray-300">
                Habilitar actualizaciones automáticas
              </label>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Si está habilitado, el sistema verificará y aplicará actualizaciones automáticamente cuando estén disponibles.
            </p>
          </div>

          {/* Integración GCP */}
          <div className="card p-6 bg-primary-900/20 border-blue-200">
            <h4 className="text-lg font-heading font-bold text-white mb-2">
              Integración con Google Cloud Platform
            </h4>
            <p className="text-sm text-gray-400 mb-2">
              Este software podrá ser gestionado a través de servicios de GCP:
            </p>
            <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
              <li>VM Manager para gestión de software en instancias de Compute Engine</li>
              <li>Cloud Operations para monitoreo de rendimiento</li>
              <li>OS Config para gestión de parches y actualizaciones</li>
              <li>Binary Authorization para verificación de imágenes</li>
            </ul>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200">
            <button
              type="button"
              onClick={onCancel}
              className="btn bg-secondary-200 hover:bg-secondary-300 text-white-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn bg-primary-600 hover:bg-primary-700 text-white"
            >
              {software ? 'Guardar Cambios' : 'Crear Software'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
