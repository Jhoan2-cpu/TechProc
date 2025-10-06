import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { BlockedIP } from '../types';
import { BlockedIPCard } from '../components';

const mockBlockedIPs: BlockedIP[] = [
  {
    id_blocked_ip: 1,
    ip_address: '192.168.100.50',
    reason: 'Múltiples intentos de acceso fallidos (15 intentos en 5 minutos)',
    block_date: '2024-03-15 08:00:00',
    active: true,
  },
  {
    id_blocked_ip: 2,
    ip_address: '10.0.0.123',
    reason: 'Actividad sospechosa - Escaneo de puertos detectado',
    block_date: '2024-03-14 20:00:00',
    active: true,
  },
  {
    id_blocked_ip: 3,
    ip_address: '203.0.113.45',
    reason: 'Intento de inyección SQL en formularios',
    block_date: '2024-03-14 15:30:00',
    active: true,
  },
  {
    id_blocked_ip: 4,
    ip_address: '198.51.100.89',
    reason: 'IP reportada en lista negra de spam/malware',
    block_date: '2024-03-13 10:00:00',
    active: false,
  },
];

export const BlockedIPsPage = () => {
  const [blockedIPs] = useState(mockBlockedIPs);

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
