import type { Ticket } from '../types';

interface CriticalTicketAlertProps {
  ticket: Ticket;
  formatDate: (dateString: string | null) => string;
  onTakeTicket?: (ticket: Ticket) => void;
}

export const CriticalTicketAlert = ({ ticket, formatDate, onTakeTicket }: CriticalTicketAlertProps) => {
  return (
    <div className="bg-white border border-red-300 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-heading font-bold text-secondary-900 mb-1">
            #{ticket.ticket_id} - {ticket.title}
          </h3>
          <p className="text-sm text-secondary-700 mb-2">{ticket.description}</p>
          <div className="flex gap-4 text-xs text-secondary-600">
            <span>Usuario ID: {ticket.user_id}</span>
            <span>{formatDate(ticket.creation_date)}</span>
            <span className="font-medium text-red-700">{ticket.category}</span>
          </div>
        </div>
        <button
          onClick={() => onTakeTicket?.(ticket)}
          className="btn bg-red-600 hover:bg-red-700 text-white"
        >
          Tomar Ticket
        </button>
      </div>
    </div>
  );
};
