import { useState } from 'react';
import type { Server } from '../types';
import { ServerCard, ServerDetailsModal, ServerFormModal, DeleteServerModal, ServersStats, ServersHeader } from '../components';

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

  // Estadísticas
  const onlineServers = servers.filter(s => s.status === 'online').length;
  const offlineServers = servers.filter(s => s.status === 'offline').length;
  const maintenanceServers = servers.filter(s => s.status === 'maintenance').length;

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <ServersStats
        totalServers={servers.length}
        onlineServers={onlineServers}
        offlineServers={offlineServers}
        maintenanceServers={maintenanceServers}
      />

      {/* Header */}
      <ServersHeader onNewServer={handleNewServer} />

      {/* Lista de servidores */}
      <div className="grid grid-cols-1 gap-4">
        {servers.length > 0 ? (
          servers.map((server, index) => (
            <ServerCard
              key={server.id_server}
              server={server}
              formatDate={formatDate}
              index={index}
              onDetails={handleDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-12 border border-gray-700/30 text-center">
            <p className="text-xl text-gray-300">No hay servidores registrados</p>
            <p className="text-sm text-gray-400 mt-2">
              Comienza agregando un nuevo servidor usando el botón "Nuevo Servidor"
            </p>
          </div>
        )}
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
