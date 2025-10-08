import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { SessionCard, TerminateSessionModal } from '../components';
import { sessionsService } from '../services';

export const SessionsPage = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUserType, setFilterUserType] = useState<string>('all');
  const [sessionToTerminate, setSessionToTerminate] = useState<{ id: number; userName: string } | null>(null);

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

  const handleTerminateSession = (sessionId: number) => {
    const session = sessions.find(s => s.session_id === sessionId);
    if (session) {
      setSessionToTerminate({ id: sessionId, userName: session.user_name });
    }
  };

  const handleConfirmTerminate = () => {
    if (sessionToTerminate) {
      setSessions(sessions.map(s =>
        s.session_id === sessionToTerminate.id
          ? { ...s, active: false, end_date: new Date().toISOString() }
          : s
      ));
      setSessionToTerminate(null);
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

  // Filtrar sesiones
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.ip_address.includes(searchTerm);

    const matchesUserType = filterUserType === 'all' || session.user_role === filterUserType;

    return matchesSearch && matchesUserType && session.active;
  });

  const activeSessions = sessions.filter((s) => s.active).length;

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

      {/* Filtros y Búsqueda */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* Buscador */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
            />
            <input
              type="text"
              placeholder="Buscar por usuario, email o IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        {/* Filtro por tipo de usuario */}
        <div className="flex gap-2 flex-wrap">
          <select
            value={filterUserType}
            onChange={(e) => setFilterUserType(e.target.value)}
            className="select"
          >
            <option value="all">Todos los usuarios</option>
            <option value="administrador">Administradores</option>
            <option value="gestor_lms">Gestores LMS</option>
            <option value="soporte_tecnico">Soporte Técnico</option>
            <option value="soporte_seguridad">Soporte Seguridad</option>
            <option value="soporte_infraestructura">Soporte Infraestructura</option>
            <option value="developer_web">Developers Web</option>
            <option value="analista_datos">Analistas de Datos</option>
          </select>
        </div>
      </div>

      {/* Lista de sesiones */}
      <div className="grid grid-cols-1 gap-4">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <SessionCard
              key={session.session_id}
              session={session}
              formatDate={formatDate}
              onTerminate={handleTerminateSession}
            />
          ))
        ) : (
          <div className="card p-12 text-center">
            <p className="text-xl text-secondary-500">No se encontraron sesiones activas</p>
            <p className="text-sm text-secondary-400 mt-2">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        )}
      </div>

      {/* Modal de terminar sesión */}
      <TerminateSessionModal
        isOpen={!!sessionToTerminate}
        sessionId={sessionToTerminate?.id || null}
        userName={sessionToTerminate?.userName || ''}
        onConfirm={handleConfirmTerminate}
        onCancel={() => setSessionToTerminate(null)}
      />
    </div>
  );
};
