import { useState, useEffect } from 'react';
import { BackupCard, BackupConfigForm, BackupsStats, BackupsHeader } from '../components';
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

  // Estadísticas
  const completedBackups = backups.filter(b => b.status === 'completed').length;
  const failedBackups = backups.filter(b => b.status === 'failed').length;
  const inProgressBackups = backups.filter(b => b.status === 'in_progress').length;

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
      <h1 className="text-3xl font-heading font-bold text-white mb-6">
        Backups
      </h1>

      {/* Estadísticas */}
      <BackupsStats
        totalBackups={backups.length}
        completedBackups={completedBackups}
        failedBackups={failedBackups}
        inProgressBackups={inProgressBackups}
      />

      {/* Header con botón de backup manual */}
      <BackupsHeader
        onStartBackup={handleStartManualBackup}
        isStarting={startingBackup}
      />

      {/* Configuración */}
      <BackupConfigForm />

      {/* Historial de Backups */}
      <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl">
        <h3 className="text-lg font-heading font-bold text-white mb-4">
          Historial de Backups
        </h3>
        <div className="space-y-3">
          {backups.length > 0 ? (
            backups.map((backup) => (
              <BackupCard key={backup.id_backup} backup={backup} formatDate={formatDate} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              No hay backups registrados aún
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
