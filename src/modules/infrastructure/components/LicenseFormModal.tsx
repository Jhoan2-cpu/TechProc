import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faKey } from '@fortawesome/free-solid-svg-icons';
import type { License, LicenseType, LicenseStatus } from '../types';

interface LicenseFormModalProps {
  isOpen: boolean;
  license: License | null;
  onSave: (licenseData: Partial<License>) => void;
  onCancel: () => void;
}

export const LicenseFormModal = ({ isOpen, license, onSave, onCancel }: LicenseFormModalProps) => {
  const [formData, setFormData] = useState({
    softwareName: '',
    licenseKey: '',
    license_type: 'suscripcion' as LicenseType,
    provider: '',
    purchase_date: new Date().toISOString().split('T')[0],
    expiration_date: '',
    seats_total: 1,
    seats_used: 0,
    costAnnual: 0,
    status: 'active' as LicenseStatus,
    notes: '',
  });

  useEffect(() => {
    if(!isOpen) return;
    if (license) {
      setFormData({
        softwareName: license.softwareName,
        licenseKey: license.licenseKey,
        license_type: license.licenseType,
        provider: license.provider,
        purchase_date: license.purchaseDate.split('T')[0],
        expiration_date: license.expirationDate ? license.expirationDate.split('T')[0] : '',
        seats_total: license.seatsTotal,
        seats_used: license.seatsUsed,
        costAnnual: license.costAnnual,
        status: license.status,
        notes: license.notes || '',
      });
    }
  }, [license, isOpen]);

  useEffect(() => {
    console.log('Qué estoy enviando', formData);
  }, [formData])

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const licenseData: Partial<License> = {
      softwareName: formData.softwareName,
      licenseKey: formData.licenseKey,
      licenseType: formData.license_type,
      provider: formData.provider,
      purchaseDate: new Date(formData.purchase_date).toISOString(),
      expirationDate: formData.expiration_date ? new Date(formData.expiration_date).toISOString() : null,
      seatsTotal: formData.seats_total,
      seatsUsed: formData.seats_used,
      costAnnual: formData.costAnnual,
      status: formData.status,
      notes: formData.notes || null,
    };

    if (license) {
      licenseData.id = license.id;
    }

    onSave(licenseData);
  };

  const generateLicenseKey = () => {
    const segments = Array.from({ length: 5 }, () =>
      Math.random().toString(36).substring(2, 7).toUpperCase()
    );
    setFormData({ ...formData, licenseKey: segments.join('-') });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-gradient-to-br from-secondary-600 to-secondary-700 border-b border-secondary-200 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-900/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faKey} className="text-primary-600 text-xl" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-white">
              {license ? 'Editar Licencia' : 'Nueva Licencia'}
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
                  Nombre del Software *
                </label>
                <input
                  type="text"
                  value={formData.softwareName}
                  onChange={(e) => setFormData({ ...formData, softwareName: e.target.value })}
                  className="input w-full"
                  required
                  placeholder="ej: Microsoft Office 365"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Proveedor *
                </label>
                <input
                  type="text"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  className="input w-full"
                  required
                  placeholder="ej: Microsoft"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de Licencia *
                </label>
                <select
                  value={formData.license_type}
                  onChange={(e) => setFormData({ ...formData, license_type: e.target.value as LicenseType })}
                  className="select w-full"
                  required
                >
                  <option value="perpetua">Perpetua</option>
                  <option value="suscripcion">Suscripción</option>
                  <option value="trial">Prueba</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estado *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as LicenseStatus })}
                  className="select w-full"
                  required
                >
                  <option value="active">Activa</option>
                  <option value="expiring_soon">Por Vencer</option>
                  <option value="expired">Vencida</option>
                  <option value="suspended">Suspendida</option>
                </select>
              </div>
            </div>
          </div>

          {/* Clave de Licencia */}
          <div className="card p-6 bg-primary-900/20 border-blue-200">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Clave de Licencia
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.licenseKey}
                onChange={(e) => setFormData({ ...formData, licenseKey: e.target.value })}
                className="input flex-1 font-mono"
                required
                placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
              />
              <button
                type="button"
                onClick={generateLicenseKey}
                className="btn bg-primary-600 hover:bg-primary-700 text-white whitespace-nowrap"
              >
                Generar Clave
              </button>
            </div>
          </div>

          {/* Fechas */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Fechas
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fecha de Compra *
                </label>
                <input
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                  className="input w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fecha de Vencimiento {formData.license_type !== 'perpetua' && '*'}
                </label>
                <input
                  type="date"
                  value={formData.expiration_date}
                  onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
                  className="input w-full"
                  required={formData.license_type !== 'perpetua'}
                  disabled={formData.license_type === 'perpetua'}
                />
                {formData.license_type === 'perpetua' && (
                  <p className="text-xs text-gray-300 mt-1">Las licencias perpetuas no vencen</p>
                )}
              </div>
            </div>
          </div>

          {/* Licencias y Costo */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Licencias y Costos
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Licencias Totales *
                </label>
                <input
                  type="number"
                  value={formData.seats_total}
                  onChange={(e) => setFormData({ ...formData, seats_total: parseInt(e.target.value) })}
                  className="input w-full"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Licencias en Uso *
                </label>
                <input
                  type="number"
                  value={formData.seats_used}
                  onChange={(e) => setFormData({ ...formData, seats_used: parseInt(e.target.value) })}
                  className="input w-full"
                  required
                  min="0"
                  max={formData.seats_total}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Costo Anual (S/) *
                </label>
                <input
                  type="number"
                  value={formData.costAnnual}
                  onChange={(e) => setFormData({ ...formData, costAnnual: parseFloat(e.target.value) })}
                  className="input w-full"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Notas */}
          <div className="card p-6">
            <h4 className="text-lg font-heading font-bold text-white mb-4">
              Notas Adicionales
            </h4>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input w-full min-h-[100px] resize-none"
              placeholder="Información adicional sobre la licencia..."
            />
          </div>

          {/* Nota de GCP */}
          <div className="bg-primary-900/20 border-l-4 border-blue-400 p-4">
            <p className="text-sm text-primary-400">
              <span className="font-semibold">Nota:</span> Las licencias se integrarán con Google Cloud Platform para monitoreo de costos y gestión centralizada.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 btn bg-secondary-200 hover:bg-secondary-300 text-white-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 btn bg-primary-600 hover:bg-primary-700 text-white"
            >
              {license ? 'Guardar Cambios' : 'Crear Licencia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
