import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import type { CreateAcademicPeriodData, AcademicPeriodStatus } from '../types';

interface CreateAcademicPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateAcademicPeriodData) => Promise<void>;
}

export const CreateAcademicPeriodModal = ({ isOpen, onClose, onSave }: CreateAcademicPeriodModalProps) => {
  const [formData, setFormData] = useState<CreateAcademicPeriodData>({
    name: '',
    start_date: '',
    end_date: '',
    status: 'open',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSave(formData);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el periodo');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', start_date: '', end_date: '', status: 'open' });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl shadow-2xl max-w-2xl w-full animate-scale-in">
        <div className="p-6 border-b border-secondary-200 bg-gradient-to-r from-indigo-500 to-indigo-600">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-heading font-bold text-white">Crear Periodo Académico</h2>
            <button onClick={handleClose} disabled={loading} className="text-white hover:bg-white/20 p-2 rounded-lg">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4"><p className="text-red-400 text-sm">{error}</p></div>}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nombre *</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input" placeholder="Ej: 2025-1" disabled={loading} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Fecha Inicio *</label>
              <input type="date" required value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="input" disabled={loading} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Fecha Fin *</label>
              <input type="date" required value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} className="input" disabled={loading} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Estado *</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as AcademicPeriodStatus })} className="select" disabled={loading}>
              <option value="open">Abierto</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200">
            <button type="button" onClick={handleClose} disabled={loading} className="btn bg-secondary-200 text-gray-300 hover:bg-secondary-300">Cancelar</button>
            <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Creando...' : 'Crear Periodo'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
