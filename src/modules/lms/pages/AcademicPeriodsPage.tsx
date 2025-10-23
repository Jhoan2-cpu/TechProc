import { useState, useEffect } from 'react';
import type { AcademicPeriod, CreateAcademicPeriodData } from '../types';
import { AcademicPeriodCard } from '../components/AcademicPeriodCard';
import { CreateAcademicPeriodModal } from '../components/CreateAcademicPeriodModal';
import { ViewAcademicPeriodModal } from '../components/ViewAcademicPeriodModal';
import { academicPeriodsService } from '../services';
import { ConfirmDeleteModal } from '../../../shared/components/ConfirmDeleteModal';

export const AcademicPeriodsPage = () => {
  const [periods, setPeriods] = useState<AcademicPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<AcademicPeriod | null>(null);
  const [periodToDelete, setPeriodToDelete] = useState<AcademicPeriod | null>(null);

  useEffect(() => {
    fetchPeriods();
  }, []);

  const fetchPeriods = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await academicPeriodsService.getAll();
      setPeriods(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los periodos académicos');
      console.error('Error fetching academic periods:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePeriod = async (periodData: CreateAcademicPeriodData) => {
    try {
      await academicPeriodsService.create(periodData);
      setShowCreateModal(false);
      fetchPeriods();
    } catch (error) {
      console.error('Error creating academic period:', error);
      throw error;
    }
  };

  const handleDeletePeriod = async () => {
    if (periodToDelete) {
      try {
        await academicPeriodsService.delete(periodToDelete.id);
        setPeriods(periods.filter((p) => p.id !== periodToDelete.id));
        setPeriodToDelete(null);
      } catch (error) {
        console.error('Error deleting academic period:', error);
      }
    }
  };

  const filteredPeriods = periods.filter((period) =>
    period.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    period.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando periodos académicos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Periodos Académicos</h1>
          <p className="text-gray-400">Gestiona los periodos académicos del sistema</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">Crear Periodo</button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="card p-4">
        <input
          type="text"
          placeholder="Buscar periodos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPeriods.map((period, index) => (
          <AcademicPeriodCard
            key={period.id}
            period={period}
            index={index}
            onView={setSelectedPeriod}
            onDelete={setPeriodToDelete}
          />
        ))}
      </div>

      {filteredPeriods.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No se encontraron periodos académicos</p>
        </div>
      )}

      <CreateAcademicPeriodModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreatePeriod}
      />

      <ViewAcademicPeriodModal
        period={selectedPeriod}
        isOpen={!!selectedPeriod}
        onClose={() => setSelectedPeriod(null)}
      />

      <ConfirmDeleteModal
        isOpen={!!periodToDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar este periodo académico?"
        itemName={periodToDelete?.name || ''}
        onConfirm={handleDeletePeriod}
        onCancel={() => setPeriodToDelete(null)}
      />
    </div>
  );
};
