import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import type { TechResource } from '../types';

interface ResourceCardProps {
  resource: TechResource;
  formatDate: (dateString: string | null) => string;
  index: number;
}

export const ResourceCard = ({ resource, formatDate, index }: ResourceCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_use': return 'bg-success/20 text-green-700';
      case 'available': return 'bg-primary-900/20 text-blue-700';
      case 'maintenance': return 'bg-warning/20 text-yellow-700';
      case 'retired': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const isWarrantyValid = resource.warranty_until && new Date(resource.warranty_until) > new Date();

  return (
    <div className="card p-6 border border-transparent hover:shadow-lg hover:border-primary-500/20 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-heading font-bold text-white capitalize">
            {resource.resource_type.replace('_', ' ')}
          </h3>
          <p className="text-sm text-gray-400">{resource.brand} {resource.model}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(resource.status)}`}>
          {resource.status.replace('_', ' ')}
        </span>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-400">S/N:</span>
          <span className="font-mono text-white text-xs">{resource.serial_number}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Ubicación:</span>
          <span className="text-white">{resource.location}</span>
        </div>
        {resource.assigned_to_user && (
          <div className="flex justify-between">
            <span className="text-gray-400">Asignado a:</span>
            <span className="text-white">Usuario #{resource.assigned_to_user}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-400">Garantía:</span>
          <span className={isWarrantyValid ? 'text-green-700' : 'text-red-700'}>
            {formatDate(resource.warranty_until)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Costo:</span>
          <span className="font-semibold text-white">S/ {resource.cost.toLocaleString()}</span>
        </div>
      </div>

      {resource.notes && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-3 mb-4">
          <p className="text-sm text-gray-300">{resource.notes}</p>
        </div>
      )}

      <div className="flex gap-2 pt-4 border-t border-secondary-200">
        <button className="btn bg-secondary-200 hover:bg-secondary-300 text-gray-300 flex-1 flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faEdit} />
          Editar
        </button>
        <button className="btn bg-danger/20 hover:bg-red-200 text-red-700 flex-1 flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faTrash} />
          Eliminar
        </button>
      </div>
    </div>
  );
};
