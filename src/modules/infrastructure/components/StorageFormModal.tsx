import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faHdd } from '@fortawesome/free-solid-svg-icons';
import type { Storage, StorageType } from '../types';

interface StorageFormModalProps {
  isOpen: boolean;
  storage: Storage | null;
  onSave: (storageData: Partial<Storage>) => void;
  onCancel: () => void;
}

export const StorageFormModal = ({ isOpen, storage, onSave, onCancel }: StorageFormModalProps) => {
  const [formData, setFormData] = useState({
    storage_name: '',
    storage_type: 'local' as StorageType,
    capacity_gb: 100,
    used_gb: 0,
    location: '',
    server_id: null as number | null,
    mount_point: '/',
    backup_enabled: true,
    last_backup: null as string | null,
    status: 'healthy' as 'healthy' | 'warning' | 'critical',
  });

  useEffect(() => {
    if (storage) {
      setFormData({
        storage_name: storage.storage_name,
        storage_type: storage.storage_type,
        capacity_gb: storage.capacity_gb,
        used_gb: storage.used_gb,
        location: storage.location,
        server_id: storage.server_id,
        mount_point: storage.mount_point,
        backup_enabled: storage.backup_enabled,
        last_backup: storage.last_backup,
        status: storage.status,
      });
    } else {
      setFormData({
        storage_name: '',
        storage_type: 'local',
        capacity_gb: 100,
        used_gb: 0,
        location: '',
        server_id: null,
        mount_point: '/',
        backup_enabled: true,
        last_backup: null,
        status: 'healthy',
      });
    }
  }, [storage, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const storageData: Partial<Storage> = {
      storage_name: formData.storage_name,
      storage_type: formData.storage_type,
      capacity_gb: formData.capacity_gb,
      used_gb: formData.used_gb,
      location: formData.location,
      server_id: formData.server_id,
      mount_point: formData.mount_point,
      backup_enabled: formData.backup_enabled,
      last_backup: formData.last_backup,
      status: formData.status,
    };

    if (storage) {
      storageData.id_storage = storage.id_storage;
    }

    onSave(storageData);
  };

  const usagePercent = (formData.used_gb / formData.capacity_gb) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-gradient-to-br from-secondary-600 to-secondary-700 border-b border-secondary-200 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-900/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faHdd} className="text-primary-600 text-xl" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-white">
              {storage ? 'Editar Almacenamiento' : 'Nuevo Almacenamiento'}
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre del Almacenamiento *
                </label>
                <input
                  type="text"
                  value={formData.storage_name}
                  onChange={(e) => setFormData({ ...formData, storage_name: e.target.value })}
                  className="input w-full"
                  required
                  placeholder="ej: SAN Principal, Cloud Storage AWS"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de Almacenamiento *
                </label>
                <select
                  value={formData.storage_type}
                  onChange={(e) => setFormData({ ...formData, storage_type: e.target.value as StorageType })}
                  className="select w-full"
                  required
                >
                  <option value="local">Local</option>
                  <option value="cloud">Cloud</option>
                  <option value="nas">NAS</option>
                  <option value="san">SAN</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estado *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="select w-full"
                  required
                >
                  <option value="healthy">Saludable</option>
                  <option value="warning">Advertencia</option>
                  <option value="critical">Crítico</option>
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
                  placeholder="ej: GCP us-central1 / Datacenter Lima"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Punto de Montaje *
                </label>
                <input
                  type="text"
                  value={formData.mount_point}
                  onChange={(e) => setFormData({ ...formData, mount_point: e.target.value })}
                  className="input w-full font-mono text-sm"
                  required
                  placeholder="ej: /mnt/storage, s3://bucket-name"
                />
              </div>
            </div>
          </div>

          {/* Capacidad */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Capacidad de Almacenamiento
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Capacidad Total (GB) *
                </label>
                <input
                  type="number"
                  value={formData.capacity_gb}
                  onChange={(e) => setFormData({ ...formData, capacity_gb: parseInt(e.target.value) })}
                  className="input w-full"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Espacio Usado (GB) *
                </label>
                <input
                  type="number"
                  value={formData.used_gb}
                  onChange={(e) => setFormData({ ...formData, used_gb: parseInt(e.target.value) })}
                  className="input w-full"
                  required
                  min="0"
                  max={formData.capacity_gb}
                />
              </div>
            </div>

            {/* Visualización del Uso */}
            <div className="bg-secondary-600/50 rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">Uso de Almacenamiento</span>
                <span className="font-bold text-white">
                  {formData.used_gb} GB / {formData.capacity_gb} GB ({usagePercent.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${
                    usagePercent >= 90 ? 'bg-danger/20' :
                    usagePercent >= 75 ? 'bg-orange-500' :
                    usagePercent >= 50 ? 'bg-warning/20' :
                    'bg-success/20'
                  }`}
                  style={{ width: `${usagePercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {(formData.capacity_gb - formData.used_gb).toFixed(0)} GB disponibles
              </p>
            </div>
          </div>

          {/* Configuración de Servidor */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Servidor Asociado (Opcional)
            </h4>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ID del Servidor
              </label>
              <input
                type="number"
                value={formData.server_id || ''}
                onChange={(e) => setFormData({ ...formData, server_id: e.target.value ? parseInt(e.target.value) : null })}
                className="input w-full"
                placeholder="Deja en blanco si no está asociado a un servidor"
              />
              <p className="text-xs text-gray-300 mt-1">
                Si este almacenamiento pertenece a un servidor específico, ingresa su ID
              </p>
            </div>
          </div>

          {/* Configuración de Backup */}
          <div className="card p-6 bg-primary-900/20 border-blue-200">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Configuración de Backup
            </h4>
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="backup_enabled"
                checked={formData.backup_enabled}
                onChange={(e) => setFormData({ ...formData, backup_enabled: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded"
              />
              <label htmlFor="backup_enabled" className="text-sm font-medium text-white">
                Habilitar Backup Automático
              </label>
            </div>
            {!formData.backup_enabled && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-3">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Advertencia:</span> El backup está deshabilitado. Se recomienda habilitarlo para proteger los datos.
                </p>
              </div>
            )}
          </div>

          {/* Nota de GCP */}
          <div className="bg-primary-900/20 border-l-4 border-blue-400 p-4">
            <p className="text-sm text-primary-400">
              <span className="font-semibold">Integración GCP:</span> Este almacenamiento puede ser gestionado a través de Google Cloud Storage, Persistent Disks o Cloud Filestore según el tipo seleccionado.
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
              {storage ? 'Guardar Cambios' : 'Crear Almacenamiento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
