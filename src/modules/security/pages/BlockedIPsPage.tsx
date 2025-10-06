import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { BlockedIPCard } from '../components';
import { blockedIPsService } from '../services';

export const BlockedIPsPage = () => {
  const [blockedIPs, setBlockedIPs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
          <p className="mt-4 text-secondary-600">Cargando IPs bloqueadas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold text-secondary-900">
          security/blocked-ips
        </h1>
        <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} />
          Bloquear IP
        </button>
      </div>

      <h2 className="text-xl font-heading text-secondary-700">
        Gestión de IPs Bloqueadas
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {blockedIPs.map((ip) => (
          <BlockedIPCard key={ip.id_blocked_ip} blockedIP={ip} formatDate={formatDate} />
        ))}
      </div>
    </div>
  );
};
