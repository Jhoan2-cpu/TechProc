import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import type { ContactForm, ContactFormStatus } from '../types';
import { ContactFormCard, RespondContactModal } from '../components';
import { contactFormsService } from '../services/webService';

export const ContactsPage = () => {
  const [contacts, setContacts] = useState<ContactForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ContactFormStatus | 'all'>('all');
  const [showRespondModal, setShowRespondModal] = useState(false);
  const [contactToRespond, setContactToRespond] = useState<ContactForm | null>(null);

  useEffect(() => {
    fetchContacts();
  }, [statusFilter]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = statusFilter !== 'all' ? { status: statusFilter } : undefined;
      const { forms } = await contactFormsService.getAll(filters);
      setContacts(forms);
    } catch (err: any) {
      console.error('Error al cargar consultas:', err);
      setError(err.message || 'Error al cargar las consultas');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-danger/20 text-red-700';
      case 'high': return 'bg-orange-900/20 text-orange-700';
      case 'medium': return 'bg-warning/20 text-yellow-700';
      case 'low': return 'bg-primary-900/20 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-success/20 text-green-700';
      case 'pending':
        return 'bg-warning/20 text-yellow-700';
      case 'in_progress':
        return 'bg-primary-900/20 text-blue-700';
      case 'spam':
        return 'bg-danger/20 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleRespondContact = (contact: ContactForm) => {
    setContactToRespond(contact);
    setShowRespondModal(true);
  };

  const handleMarkAsSpam = async (contact: ContactForm) => {
    try {
      await contactFormsService.markAsSpam(contact.id); // USAR contact.id
      await fetchContacts();
    } catch (err: any) {
      console.error('Error al marcar como spam:', err);
      alert('Error: ' + (err.message || 'No se pudo marcar como spam'));
    }
  };

  const handleResolve = async (contact: ContactForm) => {
    try {
      await contactFormsService.updateStatus(contact.id, 'resolved'); // USAR contact.id
      await fetchContacts();
    } catch (err: any) {
      console.error('Error al resolver:', err);
      alert('Error: ' + (err.message || 'No se pudo resolver la consulta'));
    }
  };

  const handleViewDetails = (contact: ContactForm) => {
    setContactToRespond(contact);
    setShowRespondModal(true);
  };

  const handleSaveResponse = async (contactId: number, response: string, status: ContactFormStatus) => {
    try {
      await contactFormsService.respond(contactId, { response, status });
      setShowRespondModal(false);
      setContactToRespond(null);
      await fetchContacts();
    } catch (err: any) {
      console.error('Error al responder:', err);
      alert('Error: ' + (err.message || 'No se pudo guardar la respuesta'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando consultas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-white">
          Consultas y Formularios de Contacto
        </h2>
      </div>

      {/* Filtros */}
      <div className="card p-4">
        <div className="flex items-center gap-4">
          <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
          <select
            className="input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="resolved">Resueltos</option>
            <option value="spam">Spam</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-danger/20 border border-red-300 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {contacts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No hay consultas para mostrar.</p>
          </div>
        ) : (
          contacts.map((contact, index) => (
            <ContactFormCard
              key={contact.id} // Usar contact.id como key
              contact={contact}
              index={index}
              formatDateTime={formatDateTime}
              getPriorityColor={getPriorityColor}
              getStatusColor={getStatusColor}
              onRespond={handleRespondContact}
              onMarkAsSpam={handleMarkAsSpam}
              onResolve={handleResolve}
              onViewDetails={handleViewDetails}
            />
          ))
        )}
      </div>

      <RespondContactModal
        isOpen={showRespondModal}
        contact={contactToRespond}
        onSave={handleSaveResponse}
        onCancel={() => {
          setShowRespondModal(false);
          setContactToRespond(null);
        }}
        formatDateTime={formatDateTime}
      />
    </div>
  );
};