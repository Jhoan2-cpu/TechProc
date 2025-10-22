import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { Alert, AlertStatus, AlertType } from '../types';
import { AlertCard, AlertFormModal, DeleteAlertModal } from '../components';
import { alertsService } from '../services/webService';

// Tipos de alerta predefinidos
const ALERT_TYPES: AlertType[] = ['info', 'warning', 'error', 'success', 'maintenance'];

// Estados predefinidos
const ALERT_STATUSES: AlertStatus[] = ['active', 'inactive', 'expired'];

export const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAlertFormModal, setShowAlertFormModal] = useState(false);
  const [showDeleteAlertModal, setShowDeleteAlertModal] = useState(false);
  const [alertToEdit, setAlertToEdit] = useState<Alert | null>(null);
  const [alertToDelete, setAlertToDelete] = useState<Alert | null>(null);
  
  // Estados para filtros
  const [filters, setFilters] = useState({
    status: '' as AlertStatus | '',
    type: '' as AlertType | ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, [filters.status, filters.type]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Preparar filtros para la API
      const apiFilters: any = {};
      if (filters.status) apiFilters.status = filters.status;
      if (filters.type) apiFilters.type = filters.type;

      const { alerts: alertsData } = await alertsService.getAll(apiFilters);
      setAlerts(alertsData);
    } catch (err: any) {
      console.error('Error al cargar alertas:', err);
      setError(err.message || 'Error al cargar las alertas');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/20 text-green-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      case 'expired':
        return 'bg-danger/20 text-red-700';
      default:
        return 'bg-primary-900/20 text-blue-700';
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-success/20 text-green-700 border-green-300';
      case 'warning': return 'bg-warning/20 text-yellow-700 border-yellow-300';
      case 'error': return 'bg-danger/20 text-red-700 border-red-300';
      case 'info': return 'bg-primary-900/20 text-blue-700 border-blue-300';
      case 'maintenance': return 'bg-purple-900/20 text-purple-700 border-purple-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getAlertTypeLabel = (type: AlertType) => {
    switch (type) {
      case 'success': return 'Éxito';
      case 'warning': return 'Advertencia';
      case 'error': return 'Error';
      case 'info': return 'Información';
      case 'maintenance': return 'Mantenimiento';
      default: return type;
    }
  };

  const getStatusLabel = (status: AlertStatus) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'inactive': return 'Inactiva';
      case 'expired': return 'Expirada';
      default: return status;
    }
  };

  const handleNewAlert = () => {
    setAlertToEdit(null);
    setShowAlertFormModal(true);
  };

  const handleEditAlert = (alert: Alert) => {
    setAlertToEdit(alert);
    setShowAlertFormModal(true);
  };

  const handleDeleteAlert = (alert: Alert) => {
    setAlertToDelete(alert);
    setShowDeleteAlertModal(true);
  };

  const handleToggleAlertStatus = async (alert: Alert) => {
    try {
      const newStatus: AlertStatus = alert.status === 'active' ? 'inactive' : 'active';
      await alertsService.update(alert.id, { status: newStatus });
      await fetchAlerts();
    } catch (err: any) {
      console.error('Error al cambiar estado:', err);
    }
  };

  const handleSaveAlert = async (alertData: Partial<Alert>) => {
    try {
      if (alertToEdit) {
        await alertsService.update(alertToEdit.id, alertData);
      } else {
        await alertsService.create(alertData);
      }
      
      setShowAlertFormModal(false);
      setAlertToEdit(null);
      await fetchAlerts();
    } catch (error: any) {
      throw error;
    }
  };

  const handleConfirmDeleteAlert = async () => {
    if (alertToDelete) {
      try {
        await alertsService.delete(alertToDelete.id);
        setShowDeleteAlertModal(false);
        setAlertToDelete(null);
        await fetchAlerts();
      } catch (err: any) {
        console.error('Error al eliminar alerta:', err);
        alert('Error: ' + (err.message || 'No se pudo eliminar la alerta'));
      }
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };


  const clearFilters = () => {
    setFilters({
      status: '',
      type: ''
    });
  };

  const hasActiveFilters = filters.status || filters.type;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando alertas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-white">Gestión de Alertas</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn flex items-center gap-2 ${
              showFilters || hasActiveFilters 
                ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                : 'bg-secondary-200 hover:bg-secondary-300 text-gray-700'
            }`}
          >
            <FontAwesomeIcon icon={faFilter} />
            Filtros
            {hasActiveFilters && (
              <span className="bg-primary-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                !
              </span>
            )}
          </button>
          <button
            onClick={handleNewAlert}
            className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            Nueva Alerta
          </button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="card p-6 animate-slide-down">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-heading font-bold text-white">Filtros</h3>
            <div className="flex gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="btn bg-gray-500 hover:bg-gray-600 text-white text-sm"
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Limpiar
                </button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Filtro por tipo (automático) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Alerta
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value as AlertType)}
                className="input w-full"
              >
                <option value="">Todos los tipos</option>
                {ALERT_TYPES.map(type => (
                  <option key={type} value={type}>
                    {getAlertTypeLabel(type)}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por estado (automático) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estado
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value as AlertStatus)}
                className="input w-full"
              >
                <option value="">Todos los estados</option>
                {ALERT_STATUSES.map(status => (
                  <option key={status} value={status}>
                    {getStatusLabel(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-danger/20 border border-red-300 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Contador de resultados */}
      <div className="flex justify-between items-center">
        <p className="text-gray-400">
          {alerts.length} alerta{alerts.length !== 1 ? 's' : ''} encontrada{alerts.length !== 1 ? 's' : ''}
          {hasActiveFilters && ' con filtros aplicados'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">
              {hasActiveFilters 
                ? 'No hay alertas que coincidan con los filtros aplicados.' 
                : 'No hay alertas para mostrar.'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn bg-primary-600 hover:bg-primary-700 text-white mt-4"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          alerts.map((alert, index) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              index={index}
              formatDate={formatDate}
              getStatusColor={getStatusColor}
              getAlertTypeColor={getAlertTypeColor}
              onEdit={handleEditAlert}
              onDelete={handleDeleteAlert}
              onToggleStatus={handleToggleAlertStatus}
            />
          ))
        )}
      </div>

      <AlertFormModal
        isOpen={showAlertFormModal}
        alert={alertToEdit}
        onSave={handleSaveAlert}
        onCancel={() => {
          setShowAlertFormModal(false);
          setAlertToEdit(null);
        }}
      />

      <DeleteAlertModal
        isOpen={showDeleteAlertModal}
        alert={alertToDelete}
        onConfirm={handleConfirmDeleteAlert}
        onCancel={() => {
          setShowDeleteAlertModal(false);
          setAlertToDelete(null);
        }}
      />
    </div>
  );
};