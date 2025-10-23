import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileInvoice, 
  faCalendar, 
  faExclamationTriangle,
  faMoneyBill,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import type { PendingPayment } from '../types/financial';

interface PendingPaymentCardProps {
  payment: PendingPayment;
  index: number;
}

export const PendingPaymentCard = ({ payment, index }: PendingPaymentCardProps) => {
  const getOverdueColor = (days: number) => {
    if (days > 60) return 'text-red-400 bg-red-500/20 border-red-500/30';
    if (days > 30) return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    if (days > 0) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(parseFloat(amount));
  };

  return (
    <div
      className="card p-6 border border-transparent hover:shadow-lg hover:border-primary-500/20 transition-all duration-300"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <FontAwesomeIcon icon={faFileInvoice} className="text-primary-400 text-xl" />
            <h3 className="font-heading font-bold text-lg text-white">
              {payment.invoice_number}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs border ${getOverdueColor(payment.days_overdue)}`}>
              {payment.days_overdue > 0 
                ? `${payment.days_overdue} días vencido` 
                : 'Por vencer'}
            </span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faMoneyBill} className="w-4 text-green-400" />
              <span className="font-medium">{payment.revenue_source.name}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faUser} className="w-4 text-primary-400" />
              <span>Matrícula: {payment.enrollment.enrollment_id}</span>
              <span className="text-gray-500">•</span>
              <span>Estudiante ID: {payment.enrollment.student_id}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <FontAwesomeIcon icon={faCalendar} className="w-4 text-primary-400" />
              <span>Fecha de emisión: {formatDate(payment.issue_date)}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-3xl font-bold text-primary-400">
            {formatCurrency(payment.total_amount)}
          </p>
          <p className="text-xs text-gray-400 mt-1">Monto pendiente</p>
        </div>
      </div>

      {/* Alerta de vencimiento */}
      {payment.days_overdue > 30 && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-400" />
          <span className="text-sm text-red-300">
            Este pago requiere atención urgente
          </span>
        </div>
      )}

      {/* Información adicional */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-700">
        <div>
          <p className="text-xs text-gray-400 mb-1">Estado de Matrícula</p>
          <p className="text-sm text-white font-medium capitalize">{payment.enrollment.status}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Tipo de Matrícula</p>
          <p className="text-sm text-white font-medium capitalize">{payment.enrollment.enrollment_type}</p>
        </div>
      </div>
    </div>
  );
};