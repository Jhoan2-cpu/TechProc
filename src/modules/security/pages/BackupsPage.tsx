import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import type { Backup } from '../types';
import { BackupCard } from '../components';

const mockBackups: Backup[] = [
  {
    id_backup: 1,
    user_id: 1,
    type: 'complete',
    status: 'completed',
    backup_date: '2024-03-15 02:00:00',
    size_mb: 2048.5,
  },
  {
    id_backup: 2,
    user_id: 1,
    type: 'incremental',
    status: 'completed',
    backup_date: '2024-03-14 02:00:00',
    size_mb: 512.3,
  },
  {
    id_backup: 3,
    user_id: 1,
    type: 'differential',
    status: 'completed',
    backup_date: '2024-03-13 02:00:00',
    size_mb: 850.7,
  },
  {
    id_backup: 4,
    user_id: 1,
    type: 'incremental',
    status: 'failed',
    backup_date: '2024-03-12 02:00:00',
    size_mb: 0,
  },
];

export const BackupsPage = () => {
  const [backups] = useState(mockBackups);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold text-secondary-900">
          security/backups
        </h1>
        <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faPlay} />
          Iniciar Backup Manual
        </button>
      </div>

      <h2 className="text-xl font-heading text-secondary-700">
        Gestión de Backups de Seguridad
      </h2>

      {/* Configuración de Backup Automático */}
      <div className="card p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-heading font-bold text-secondary-900 mb-4">
          Configuración de Backup Automático
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <label className="block text-sm font-semibold text-secondary-700 mb-2">
              Tipo de Backup
            </label>
            <select className="select w-full">
              <option>Completo</option>
              <option>Incremental</option>
              <option>Diferencial</option>
            </select>
          </div>
          <div className="bg-white rounded-lg p-4">
            <label className="block text-sm font-semibold text-secondary-700 mb-2">
              Frecuencia
            </label>
            <select className="select w-full">
              <option>Diario</option>
              <option>Semanal</option>
              <option>Mensual</option>
            </select>
          </div>
          <div className="bg-white rounded-lg p-4">
            <label className="block text-sm font-semibold text-secondary-700 mb-2">
              Hora de Ejecución
            </label>
            <input type="time" className="input w-full" defaultValue="02:00" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button className="btn bg-secondary-200 hover:bg-secondary-300 text-secondary-700">
            Cancelar
          </button>
          <button className="btn bg-primary-600 hover:bg-primary-700 text-white">
            Guardar Configuración
          </button>
        </div>
      </div>

      {/* Historial de Backups */}
      <div className="card p-6">
        <h3 className="text-lg font-heading font-bold text-secondary-900 mb-4">
          Historial de Backups
        </h3>
        <div className="space-y-3">
          {backups.map((backup) => (
            <BackupCard key={backup.id_backup} backup={backup} formatDate={formatDate} />
          ))}
        </div>
      </div>
    </div>
  );
};
