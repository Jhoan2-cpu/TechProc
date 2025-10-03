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
      case 'in_use': return 'bg-green-100 text-green-700';
      case 'available': return 'bg-blue-100 text-blue-700';
      case 'maintenance': return 'bg-yellow-100 text-yellow-700';
      case 'retired': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const isWarrantyValid = resource.warranty_until && new Date(resource.warranty_until) > new Date();

  return (
    <div className="card p-6 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-heading font-bold text-secondary-900 capitalize">
            {resource.resource_type.replace('_', ' ')}
          </h3>
          <p className="text-sm text-secondary-600">{resource.brand} {resource.model}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(resource.status)}`}>
          {resource.status.replace('_', ' ')}
        </span>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-secondary-600">S/N:</span>
          <span className="font-mono text-secondary-900 text-xs">{resource.serial_number}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-secondary-600">Ubicación:</span>
          <span className="text-secondary-900">{resource.location}</span>
        </div>
        {resource.assigned_to_user && (
          <div className="flex justify-between">
            <span className="text-secondary-600">Asignado a:</span>
            <span className="text-secondary-900">Usuario #{resource.assigned_to_user}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-secondary-600">Garantía:</span>
          <span className={isWarrantyValid ? 'text-green-700' : 'text-red-700'}>
            {formatDate(resource.warranty_until)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-secondary-600">Costo:</span>
          <span className="font-semibold text-secondary-900">S/ {resource.cost.toLocaleString()}</span>
        </div>
      </div>

      {resource.notes && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-3 mb-4">
          <p className="text-sm text-secondary-700">{resource.notes}</p>
        </div>
      )}

      <div className="flex gap-2 pt-4 border-t border-secondary-200">
        <button className="btn bg-secondary-200 hover:bg-secondary-300 text-secondary-700 flex-1 flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faEdit} />
          Editar
        </button>
        <button className="btn bg-red-100 hover:bg-red-200 text-red-700 flex-1 flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faTrash} />
          Eliminar
        </button>
      </div>
    </div>
  );
};
