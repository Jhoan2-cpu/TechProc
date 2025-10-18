import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { Alert, AlertStatus } from '../types';
import { AlertCard, AlertFormModal, DeleteAlertModal } from '../components';
import { mockAlerts } from '../../../services/mockData';

export const AlertsPage = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [showAlertFormModal, setShowAlertFormModal] = useState(false);
  const [showDeleteAlertModal, setShowDeleteAlertModal] = useState(false);
  const [alertToEdit, setAlertToEdit] = useState<Alert | null>(null);
  const [alertToDelete, setAlertToDelete] = useState<Alert | null>(null);

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
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
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

  const handleToggleAlertStatus = (alert: Alert) => {
    const newStatus: AlertStatus = alert.status === 'active' ? 'inactive' : 'active';
    const updatedAlerts = alerts.map(a =>
      a.id_alert === alert.id_alert ? { ...a, status: newStatus } : a
    );
    setAlerts(updatedAlerts);
  };

  const handleSaveAlert = (alertData: Partial<Alert>) => {
    if (alertToEdit) {
      const updatedAlerts = alerts.map(a =>
        a.id_alert === alertToEdit.id_alert ? { ...a, ...alertData } : a
      );
      setAlerts(updatedAlerts);
    } else {
      const newAlert: Alert = {
        id_alert: Date.now(),
        ...alertData as Omit<Alert, 'id_alert'>,
        created_date: new Date().toISOString().split('T')[0],
      };
      setAlerts([newAlert, ...alerts]);
    }
    setShowAlertFormModal(false);
    setAlertToEdit(null);
  };

  const handleConfirmDeleteAlert = () => {
    if (alertToDelete) {
      setAlerts(alerts.filter(a => a.id_alert !== alertToDelete.id_alert));
      setShowDeleteAlertModal(false);
      setAlertToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-white">Gestión de Alertas</h2>
        <button
          onClick={handleNewAlert}
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Nueva Alerta
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {alerts.map((alert, index) => (
          <AlertCard
            key={alert.id_alert}
            alert={alert}
            index={index}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
            getAlertTypeColor={getAlertTypeColor}
            onEdit={handleEditAlert}
            onDelete={handleDeleteAlert}
            onToggleStatus={handleToggleAlertStatus}
          />
        ))}
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
