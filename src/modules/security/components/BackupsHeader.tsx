import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faSpinner } from '@fortawesome/free-solid-svg-icons';

interface BackupsHeaderProps {
  onStartBackup: () => void;
  isStarting: boolean;
}

export const BackupsHeader = ({ onStartBackup, isStarting }: BackupsHeaderProps) => {
  return (
    <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white mb-2">
            Gestión de Backups
          </h2>
          <p className="text-gray-400 text-sm">
            Administra y monitorea los backups de seguridad del sistema
          </p>
        </div>
        <button
          onClick={onStartBackup}
          disabled={isStarting}
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          <FontAwesomeIcon
            icon={isStarting ? faSpinner : faPlay}
            className={isStarting ? 'animate-spin' : ''}
          />
          {isStarting ? 'Iniciando...' : 'Iniciar Backup Manual'}
        </button>
      </div>
    </div>
  );
};
