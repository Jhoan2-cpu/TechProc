import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { Server } from '../types';
import { ServerCard } from '../components';

interface ServersPageProps {
  servers: Server[];
}

export const ServersPage = ({ servers }: ServersPageProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-secondary-900">Control Digital de Servidores</h2>
        <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} />
          Nuevo Servidor
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {servers.map((server, index) => (
          <ServerCard
            key={server.id_server}
            server={server}
            formatDate={formatDate}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};
