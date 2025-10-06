import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { BackupCard, BackupConfigForm } from '../components';
import { backupsService } from '../services';

export const BackupsPage = () => {
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBackups = async () => {
      try {
        const data = await backupsService.getAll();
        setBackups(data);
      } catch (error) {
        console.error('Error fetching backups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBackups();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Cargando backups...</p>
        </div>
      </div>
    );
  }

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

      <BackupConfigForm />

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
