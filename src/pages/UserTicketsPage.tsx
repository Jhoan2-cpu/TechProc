import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTicket,
  faPlus,
  faSpinner,
  faClock,
  faExclamationCircle,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { userTicketsService } from '../services/userTicketsService';
import { authService } from '../services/authService';
import type {
  UserTicket,
  CreateUserTicketData,
  TicketPriority,
  TicketCategory,
} from '../shared/types/userTickets';

export const UserTicketsPage = () => {
  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const user = authService.getCurrentUser();
  const userId = user?.id;

  const [formData, setFormData] = useState<Omit<CreateUserTicketData, 'user_id'>>({
    title: '',
    description: '',
    priority: 'media',
    category: 'Software',
  });

  useEffect(() => {
    if (userId) {
      loadTickets();
    }
  }, [userId]);

  const loadTickets = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const data = await userTicketsService.getUserTickets(userId);

      // Asegurar que data sea un array
      if (Array.isArray(data)) {
        setTickets(data);
      } else {
        console.warn('La respuesta no es un array:', data);
        setTickets([]);
      }
    } catch (err: any) {
      console.error('Error al cargar tickets:', err);
      setError(err.message || 'Error al cargar los tickets');
      setTickets([]); // Asegurar que tickets sea un array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError('No se pudo obtener el ID del usuario');
      return;
    }

    setError(null);
    setSuccessMessage(null);

    try {
      setSubmitting(true);
      const response = await userTicketsService.create({
        user_id: userId,
        ...formData,
      });

      if (response.success) {
        setSuccessMessage(response.message || 'Ticket creado exitosamente');
        setFormData({
          title: '',
          description: '',
          priority: 'media',
          category: 'Software',
        });
        setShowCreateForm(false);
        await loadTickets();
      }
    } catch (err: any) {
      console.error('Error al crear ticket:', err);
      setError(err.message || 'Error al crear el ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case 'alta':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'media':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'baja':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getPriorityIcon = (priority: TicketPriority) => {
    switch (priority) {
      case 'alta':
        return faExclamationCircle;
      case 'media':
        return faClock;
      case 'baja':
        return faCheckCircle;
      default:
        return faClock;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-full flex items-center justify-center border border-primary-500/30">
                <FontAwesomeIcon icon={faTicket} className="text-primary-400 text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-gradient">Mis Tickets</h1>
                <p className="text-gray-400 text-sm">Crea y gestiona tus solicitudes de soporte</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300 font-medium flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Nuevo Ticket</span>
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-success/10 border border-success/30 rounded-lg animate-slide-down">
            <p className="text-success text-sm">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/30 rounded-lg animate-slide-down">
            <p className="text-danger text-sm">{error}</p>
          </div>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-8 bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-primary-500/30 shadow-xl animate-slide-down">
            <h2 className="text-xl font-heading font-bold text-white mb-4">Crear Nuevo Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Título <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                    placeholder="Ej: Problema con impresora"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Prioridad <span className="text-danger">*</span>
                  </label>
                  <select
                    required
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TicketPriority })}
                    className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 cursor-pointer"
                    disabled={submitting}
                  >
                    <option value="baja" className="bg-secondary-700">Baja</option>
                    <option value="media" className="bg-secondary-700">Media</option>
                    <option value="alta" className="bg-secondary-700">Alta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Categoría <span className="text-danger">*</span>
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as TicketCategory })}
                    className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 cursor-pointer"
                    disabled={submitting}
                  >
                    <option value="Hardware" className="bg-secondary-700">Hardware</option>
                    <option value="Software" className="bg-secondary-700">Software</option>
                    <option value="Red" className="bg-secondary-700">Red</option>
                    <option value="Acceso" className="bg-secondary-700">Acceso</option>
                    <option value="Otro" className="bg-secondary-700">Otro</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Descripción <span className="text-danger">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary-700/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 resize-none"
                    placeholder="Describe el problema en detalle..."
                    rows={4}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-700/50">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 bg-secondary-700/50 hover:bg-secondary-600/50 text-gray-300 hover:text-white rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 font-medium"
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faPlus} />
                      Crear Ticket
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tickets List */}
        <div className="bg-gradient-to-br from-secondary-500/80 to-secondary-600/80 backdrop-blur-sm rounded-xl p-6 border border-primary-500/30 shadow-xl">
          <h2 className="text-xl font-heading font-bold text-white mb-6">Mis Tickets</h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <FontAwesomeIcon icon={faSpinner} className="text-3xl text-primary-400 animate-spin" />
              <span className="ml-3 text-gray-400">Cargando tickets...</span>
            </div>
          ) : !Array.isArray(tickets) || tickets.length === 0 ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faTicket} className="text-6xl text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg mb-4">No tienes tickets creados</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300 font-medium inline-flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPlus} />
                Crear tu primer ticket
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {Array.isArray(tickets) && tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-secondary-700/30 border border-gray-700/50 rounded-lg p-5 hover:bg-secondary-700/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{ticket.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">{ticket.description}</p>
                    </div>
                    <span
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-2 ${getPriorityColor(
                        ticket.priority
                      )}`}
                    >
                      <FontAwesomeIcon icon={getPriorityIcon(ticket.priority)} />
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="px-2 py-1 bg-secondary-600/50 rounded border border-gray-700/30">
                      {ticket.category}
                    </span>
                    <span>Ticket #{ticket.ticket_id}</span>
                    {ticket.created_at && (
                      <span>
                        {new Date(ticket.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
