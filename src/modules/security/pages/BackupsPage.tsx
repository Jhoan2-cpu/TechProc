import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { BackupCard, BackupConfigForm } from '../components';
import { backupsService } from '../services';
import type { Backup } from '../types';

export const BackupsPage = () => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingBackup, setStartingBackup] = useState(false);

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

  const handleStartManualBackup = async () => {
    setStartingBackup(true);

    try {
      // Crear un nuevo backup manual
      const newBackup: Backup = {
        id_backup: Date.now(),
        user_id: 1, // Usuario actual
        type: 'complete',
        status: 'in_progress',
        backup_date: new Date().toISOString(),
        size_mb: 0, // Se actualizará cuando termine
      };

      // Agregar el backup en progreso a la lista
      setBackups([newBackup, ...backups]);

      // Simular el proceso de backup (en producción esto sería una llamada al servicio)
      setTimeout(() => {
        setBackups(prevBackups =>
          prevBackups.map(backup =>
            backup.id_backup === newBackup.id_backup
              ? { ...backup, status: 'completed' as const, size_mb: Math.floor(Math.random() * 500) + 100 }
              : backup
          )
        );
        setStartingBackup(false);
      }, 3000);

    } catch (error) {
      console.error('Error al iniciar backup:', error);
      setStartingBackup(false);
    }
  };

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
          <p className="mt-4 text-gray-400">Cargando backups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold text-white">
          security/backups
        </h1>
        <button
          onClick={handleStartManualBackup}
          disabled={startingBackup}
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FontAwesomeIcon icon={startingBackup ? faSpinner : faPlay} className={startingBackup ? 'animate-spin' : ''} />
          {startingBackup ? 'Iniciando...' : 'Iniciar Backup Manual'}
        </button>
      </div>

      <h2 className="text-xl font-heading text-gray-300">
        Gestión de Backups de Seguridad
      </h2>

      <BackupConfigForm />

      {/* Historial de Backups */}
      <div className="card p-6">
        <h3 className="text-lg font-heading font-bold text-white mb-4">
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
