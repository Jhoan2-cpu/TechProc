import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { License } from '../types';
import { LicenseCard } from '../components';

interface LicensesPageProps {
  licenses: License[];
}

export const LicensesPage = ({ licenses }: LicensesPageProps) => {
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
        <h2 className="text-2xl font-heading font-bold text-secondary-900">Gestión de Licencias</h2>
        <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} />
          Nueva Licencia
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {licenses.map((license, index) => (
          <LicenseCard
            key={license.id_license}
            license={license}
            formatDate={formatDate}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};
