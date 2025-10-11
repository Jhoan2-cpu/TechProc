import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface LicensesHeaderProps {
  onNewLicense: () => void;
}

export const LicensesHeader = ({ onNewLicense }: LicensesHeaderProps) => {
  return (
    <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white mb-2">
            Gestión de Licencias
          </h2>
          <p className="text-gray-400 text-sm">
            Administra y monitorea las licencias de software de la organización
          </p>
        </div>
        <button
          onClick={onNewLicense}
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <FontAwesomeIcon icon={faPlus} />
          Nueva Licencia
        </button>
      </div>
    </div>
  );
};
