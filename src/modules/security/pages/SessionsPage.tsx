import { useState } from 'react';
import type { ActiveSession } from '../types';
import { SessionCard } from '../components';

const mockActiveSessions: (ActiveSession & {
  user_name: string;
  user_email: string;
  last_activity: string;
  location?: string;
})[] = [
  {
    session_id: 1,
    user_id: 5,
    user_name: 'Carlos Méndez',
    user_email: 'carlos.mendez@techproc.com',
    ip_address: '192.168.1.105',
    device: 'Chrome 120 - Windows 10',
    start_date: '2024-03-15 08:30:00',
    last_activity: '2024-03-15 14:25:00',
    location: 'Lima, Perú',
    active: true,
  },
  {
    session_id: 2,
    user_id: 8,
    user_name: 'Ana Torres',
    user_email: 'ana.torres@techproc.com',
    ip_address: '192.168.1.120',
    device: 'Firefox 122 - macOS',
    start_date: '2024-03-15 09:00:00',
    last_activity: '2024-03-15 14:30:00',
    location: 'Lima, Perú',
    active: true,
  },
  {
    session_id: 3,
    user_id: 12,
    user_name: 'Roberto Silva',
    user_email: 'roberto.silva@techproc.com',
    ip_address: '192.168.1.135',
    device: 'Chrome 120 - Android',
    start_date: '2024-03-15 10:15:00',
    last_activity: '2024-03-15 14:28:00',
    location: 'Arequipa, Perú',
    active: true,
  },
  {
    session_id: 4,
    user_id: 15,
    user_name: 'María González',
    user_email: 'maria.gonzalez@techproc.com',
    ip_address: '10.0.0.50',
    device: 'Safari 17 - iOS',
    start_date: '2024-03-15 11:00:00',
    last_activity: '2024-03-15 14:20:00',
    location: 'Cusco, Perú',
    active: true,
  },
];

export const SessionsPage = () => {
  const [sessions] = useState(mockActiveSessions);

  const activeSessions = sessions.filter((s) => s.active).length;

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
          security/sessions
        </h1>
        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold">
          {activeSessions} activas
        </span>
      </div>

      <h2 className="text-xl font-heading text-secondary-700">
        Monitoreo de Sesiones Activas
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {sessions.map((session) => (
          <SessionCard
            key={session.session_id}
            session={session}
            formatDate={formatDate}
          />
        ))}
      </div>
    </div>
  );
};
