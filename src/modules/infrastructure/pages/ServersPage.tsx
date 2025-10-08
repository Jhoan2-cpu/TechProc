import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { Server } from '../types';
import { ServerCard, ServerDetailsModal, ServerFormModal, DeleteServerModal } from '../components';

interface ServersPageProps {
  servers: Server[];
  onUpdateServers: (servers: Server[]) => void;
}

export const ServersPage = ({ servers, onUpdateServers }: ServersPageProps) => {
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serverToEdit, setServerToEdit] = useState<Server | null>(null);
  const [serverToDelete, setServerToDelete] = useState<Server | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleDetails = (server: Server) => {
    setSelectedServer(server);
    setShowDetailsModal(true);
  };

  const handleEdit = (server: Server) => {
    setServerToEdit(server);
    setShowFormModal(true);
  };

  const handleDelete = (server: Server) => {
    setServerToDelete(server);
    setShowDeleteModal(true);
  };

  const handleNewServer = () => {
    setServerToEdit(null);
    setShowFormModal(true);
  };

  const handleSaveServer = (serverData: Partial<Server>) => {
    if (serverToEdit) {
      // Editar servidor existente
      const updatedServers = servers.map(server =>
        server.id_server === serverToEdit.id_server
          ? { ...server, ...serverData }
          : server
      );
      onUpdateServers(updatedServers);
    } else {
      // Crear nuevo servidor
      const newServer: Server = {
        id_server: Date.now(),
        ...serverData as Omit<Server, 'id_server'>,
        responsible_id: 1,
        last_maintenance: null,
        cpu_usage_percent: Math.floor(Math.random() * 100),
        ram_usage_percent: Math.floor(Math.random() * 100),
        disk_usage_percent: Math.floor(Math.random() * 100),
        uptime_hours: 0,
      };
      onUpdateServers([newServer, ...servers]);
    }
    setShowFormModal(false);
    setServerToEdit(null);
  };

  const handleConfirmDelete = () => {
    if (serverToDelete) {
      const updatedServers = servers.filter(
        server => server.id_server !== serverToDelete.id_server
      );
      onUpdateServers(updatedServers);
      setShowDeleteModal(false);
      setServerToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-secondary-900">Control Digital de Servidores</h2>
        <button
          onClick={handleNewServer}
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
        >
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
            onDetails={handleDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Modales */}
      <ServerDetailsModal
        isOpen={showDetailsModal}
        server={selectedServer}
        onClose={() => setShowDetailsModal(false)}
        formatDate={formatDate}
      />

      <ServerFormModal
        isOpen={showFormModal}
        server={serverToEdit}
        onSave={handleSaveServer}
        onCancel={() => {
          setShowFormModal(false);
          setServerToEdit(null);
        }}
      />

      <DeleteServerModal
        isOpen={showDeleteModal}
        server={serverToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setServerToDelete(null);
        }}
      />
    </div>
  );
};
