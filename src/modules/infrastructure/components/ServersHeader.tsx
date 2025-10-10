import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface ServersHeaderProps {
  onNewServer: () => void;
}

export const ServersHeader = ({ onNewServer }: ServersHeaderProps) => {
  return (
    <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white mb-2">
            Control Digital de Servidores
          </h2>
          <p className="text-gray-400 text-sm">
            Administra y monitorea el estado de todos los servidores de la infraestructura
          </p>
        </div>
        <button
          onClick={onNewServer}
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <FontAwesomeIcon icon={faPlus} />
          Nuevo Servidor
        </button>
      </div>
    </div>
  );
};
