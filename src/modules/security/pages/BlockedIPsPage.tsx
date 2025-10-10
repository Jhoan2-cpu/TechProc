import { useState, useEffect } from 'react';
import { BlockedIPCard, BlockIPModal, UnblockIPModal, BlockedIPsStats, BlockedIPsFilters } from '../components';
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

  // Estadísticas
  const activeBlocked = blockedIPs.filter(ip => ip.active).length;
  const today = new Date().toDateString();
  const unblockedToday = blockedIPs.filter(ip =>
    !ip.active && ip.unblock_date && new Date(ip.unblock_date).toDateString() === today
  ).length;

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
      <h1 className="text-3xl font-heading font-bold text-white mb-6">
        Blocked IPs
      </h1>

      {/* Estadísticas */}
      <BlockedIPsStats
        totalBlocked={blockedIPs.length}
        activeBlocked={activeBlocked}
        unblockedToday={unblockedToday}
      />

      {/* Filtros */}
      <BlockedIPsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onBlockClick={() => setShowBlockModal(true)}
      />

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
          <div className="bg-gradient-to-br from-secondary-500/60 to-secondary-600/60 backdrop-blur-sm rounded-xl p-12 border border-gray-700/30 text-center">
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
