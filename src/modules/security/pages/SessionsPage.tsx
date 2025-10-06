import { useState, useEffect } from 'react';
import { SessionCard } from '../components';
import { sessionsService } from '../services';

export const SessionsPage = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await sessionsService.getAll();
        setSessions(data);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Cargando sesiones...</p>
        </div>
      </div>
    );
  }

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
