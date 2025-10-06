import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { Software } from '../types';
import { SoftwareCard } from '../components';

interface SoftwarePageProps {
  software: Software[];
}

export const SoftwarePage = ({ software }: SoftwarePageProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-secondary-900">Gestión de Software</h2>
        <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} />
          Registrar Software
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {software.map((soft, index) => (
          <SoftwareCard
            key={soft.id_software}
            software={soft}
            formatDate={formatDate}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};
