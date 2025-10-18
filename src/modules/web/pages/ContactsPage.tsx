import { useState, useEffect } from 'react';
import type { ContactForm, ContactFormStatus } from '../types';
import { ContactFormCard, RespondContactModal } from '../components';
import {
  getContactForms,
  respondContactForm,
  markContactFormAsSpam,
} from '../../../services/webService';

export const ContactsPage = () => {
  const [contacts, setContacts] = useState<ContactForm[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [contactsError, setContactsError] = useState<string | null>(null);
  const [contactsFilter, setContactsFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved' | 'spam'>('all');
  const [showRespondContactModal, setShowRespondContactModal] = useState(false);
  const [contactToRespond, setContactToRespond] = useState<ContactForm | null>(null);

  useEffect(() => {
    const loadContactForms = async () => {
      setIsLoadingContacts(true);
      setContactsError(null);

      try {
        const { forms } = await getContactForms(contactsFilter);
        setContacts(forms);
      } catch (error) {
        console.error('Error al cargar formularios de contacto:', error);
        setContactsError('Error al cargar los formularios de contacto. Por favor, intenta nuevamente.');
      } finally {
        setIsLoadingContacts(false);
      }
    };

    loadContactForms();
  }, [contactsFilter]);

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
      case 'in_progress':
        return 'bg-warning/20 text-yellow-700';
      case 'spam':
        return 'bg-danger/20 text-red-700';
      default:
        return 'bg-primary-900/20 text-blue-700';
    }
  };

  const handleRespondContact = (contact: ContactForm) => {
    setContactToRespond(contact);
    setShowRespondContactModal(true);
  };

  const handleMarkAsSpam = async (contact: ContactForm) => {
    try {
      await markContactFormAsSpam(contact.id_contact);
      const { forms } = await getContactForms(contactsFilter);
      setContacts(forms);
    } catch (error) {
      console.error('Error al marcar como spam:', error);
      alert('Error al marcar el formulario como spam. Por favor, intenta nuevamente.');
    }
  };

  const handleResolve = async (contact: ContactForm) => {
    try {
      const updatedContact = await respondContactForm(
        contact.id_contact,
        contact.response || 'Resuelto',
        'resolved'
      );

      const updatedContacts = contacts.map(c =>
        c.id_contact === contact.id_contact ? updatedContact : c
      );
      setContacts(updatedContacts);
    } catch (error) {
      console.error('Error al resolver:', error);
      alert('Error al resolver el formulario. Por favor, intenta nuevamente.');
    }
  };

  const handleViewContactDetails = (contact: ContactForm) => {
    setContactToRespond(contact);
    setShowRespondContactModal(true);
  };

  const handleSaveContactResponse = async (
    contactId: number,
    response: string,
    status: ContactFormStatus,
    assignedTo: number | null
  ) => {
    try {
      const updatedContact = await respondContactForm(contactId, response, status);

      const updatedContacts = contacts.map(c =>
        c.id_contact === contactId ? updatedContact : c
      );
      setContacts(updatedContacts);
      setShowRespondContactModal(false);
      setContactToRespond(null);
    } catch (error) {
      console.error('Error al guardar respuesta:', error);
      alert('Error al guardar la respuesta. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-white">Consultas y Formularios de Contacto</h2>
        <div className="flex gap-2">
          <select
            className="select"
            value={contactsFilter}
            onChange={(e) => setContactsFilter(e.target.value as typeof contactsFilter)}
          >
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="in_progress">En Progreso</option>
            <option value="resolved">Resueltos</option>
            <option value="spam">Spam</option>
          </select>
        </div>
      </div>

      {isLoadingContacts && (
        <div className="text-center py-8">
          <p className="text-gray-400">Cargando formularios de contacto...</p>
        </div>
      )}

      {contactsError && (
        <div className="bg-danger/20 border border-red-300 text-red-700 px-4 py-3 rounded">
          {contactsError}
        </div>
      )}

      {!isLoadingContacts && !contactsError && contacts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No hay formularios de contacto para mostrar.</p>
        </div>
      )}

      {!isLoadingContacts && !contactsError && contacts.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {contacts.map((contact, index) => (
            <ContactFormCard
              key={contact.id_contact}
              contact={contact}
              index={index}
              formatDateTime={formatDateTime}
              getPriorityColor={getPriorityColor}
              getStatusColor={getStatusColor}
              onRespond={handleRespondContact}
              onMarkAsSpam={handleMarkAsSpam}
              onResolve={handleResolve}
              onViewDetails={handleViewContactDetails}
            />
          ))}
        </div>
      )}

      <RespondContactModal
        isOpen={showRespondContactModal}
        contact={contactToRespond}
        onSave={handleSaveContactResponse}
        onCancel={() => {
          setShowRespondContactModal(false);
          setContactToRespond(null);
        }}
        formatDateTime={formatDateTime}
      />
    </div>
  );
};
