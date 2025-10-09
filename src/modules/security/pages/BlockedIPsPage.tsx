import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { BlockedIPCard, BlockIPModal, UnblockIPModal } from '../components';
import { blockedIPsService } from '../services';

export const BlockedIPsPage = () => {
  const [blockedIPs, setBlockedIPs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [ipToUnblock, setIpToUnblock] = useState<{ id: number; address: string } | null>(null);

  useEffect(() => {
    const fetchBlockedIPs = async () => {
      try {
        const data = await blockedIPsService.getAll();
        setBlockedIPs(data);
      } catch (error) {
        console.error('Error fetching blocked IPs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlockedIPs();
  }, []);

  const handleBlockIP = (ipAddress: string, reason: string) => {
    const now = new Date().toISOString();
    const newBlockedIP = {
      id_blocked_ip: blockedIPs.length + 1,
      ip_address: ipAddress,
      reason: reason,
      block_date: now,
      active: true,
    };
    setBlockedIPs([newBlockedIP, ...blockedIPs]);
    setShowBlockModal(false);
  };

  const handleUnblockIP = (id: number) => {
    const ip = blockedIPs.find(ip => ip.id_blocked_ip === id);
    if (ip) {
      setIpToUnblock({ id, address: ip.ip_address });
    }
  };

  const handleConfirmUnblock = () => {
    if (ipToUnblock) {
      const now = new Date().toISOString();
      setBlockedIPs(blockedIPs.map(ip =>
        ip.id_blocked_ip === ipToUnblock.id
          ? { ...ip, active: false, unblock_date: now }
          : ip
      ));
      setIpToUnblock(null);
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

  // Filtrar IPs bloqueadas por búsqueda
  const filteredIPs = blockedIPs.filter((ip) =>
    ip.ip_address.includes(searchTerm) ||
    ip.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando IPs bloqueadas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold text-white">
          security/blocked-ips
        </h1>
        <button
          onClick={() => setShowBlockModal(true)}
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Bloquear IP
        </button>
      </div>

      <h2 className="text-xl font-heading text-gray-300">
        Gestión de IPs Bloqueadas
      </h2>

      {/* Buscador */}
      <div className="max-w-md">
        <div className="relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Buscar por IP o razón..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
      </div>

      {/* Lista de IPs bloqueadas */}
      <div className="grid grid-cols-1 gap-4">
        {filteredIPs.length > 0 ? (
          filteredIPs.map((ip) => (
            <BlockedIPCard
              key={ip.id_blocked_ip}
              blockedIP={ip}
              formatDate={formatDate}
              onUnblock={handleUnblockIP}
            />
          ))
        ) : (
          <div className="card p-12 text-center">
            <p className="text-xl text-gray-300">No se encontraron IPs bloqueadas</p>
            <p className="text-sm text-gray-400 mt-2">
              {searchTerm ? 'Intenta ajustar la búsqueda' : 'No hay IPs bloqueadas en este momento'}
            </p>
          </div>
        )}
      </div>

      {/* Modales */}
      <BlockIPModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        onBlock={handleBlockIP}
      />

      <UnblockIPModal
        isOpen={!!ipToUnblock}
        ipAddress={ipToUnblock?.address || null}
        onConfirm={handleConfirmUnblock}
        onCancel={() => setIpToUnblock(null)}
      />
    </div>
  );
};
