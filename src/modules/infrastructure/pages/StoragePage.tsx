import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { Storage } from '../types';
import { StorageCard } from '../components';

interface StoragePageProps {
  storage: Storage[];
}

export const StoragePage = ({ storage }: StoragePageProps) => {
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
        <h2 className="text-2xl font-heading font-bold text-secondary-900">Gestión de Almacenamiento</h2>
        <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} />
          Nuevo Almacenamiento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {storage.map((store, index) => (
          <StorageCard
            key={store.id_storage}
            storage={store}
            formatDate={formatDate}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};
