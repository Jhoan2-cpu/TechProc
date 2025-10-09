import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { IncidentCard, IncidentFormModal, ChangeIncidentStatusModal } from '../components';
import { incidentsService } from '../services';
import type { Incident, IncidentStatus } from '../types';

export const IncidentsPage = () => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [incidentToEdit, setIncidentToEdit] = useState<any>(null);
  const [incidentToChangeStatus, setIncidentToChangeStatus] = useState<any>(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const data = await incidentsService.getAll();
        setIncidents(data);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleNewIncident = () => {
    setIncidentToEdit(null);
    setShowFormModal(true);
  };

  const handleEdit = (incident: any) => {
    setIncidentToEdit(incident);
    setShowFormModal(true);
  };

  const handleChangeStatus = (incident: any) => {
    setIncidentToChangeStatus(incident);
    setShowStatusModal(true);
  };

  const handleSaveIncident = (incidentData: any) => {
    if (incidentToEdit) {
      // Editar incidente existente
      const updatedIncidents = incidents.map(inc =>
        inc.id_incident === incidentToEdit.id_incident
          ? { ...inc, ...incidentData }
          : inc
      );
      setIncidents(updatedIncidents);
    } else {
      // Crear nuevo incidente
      const newIncident = {
        id_incident: Date.now(),
        ...incidentData,
        report_date: new Date().toISOString(),
      };
      setIncidents([newIncident, ...incidents]);
    }
    setShowFormModal(false);
    setIncidentToEdit(null);
  };

  const handleConfirmStatusChange = (incidentId: number, newStatus: IncidentStatus, notes: string) => {
    const updatedIncidents = incidents.map(inc => {
      if (inc.id_incident === incidentId) {
        const updates: any = { status: newStatus };

        // Si se marca como resuelto, agregar fecha de resolución
        if (newStatus === 'resolved') {
          updates.resolved_date = new Date().toISOString();
        }

        return { ...inc, ...updates };
      }
      return inc;
    });

    setIncidents(updatedIncidents);
    setShowStatusModal(false);
    setIncidentToChangeStatus(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando incidentes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold text-white">
          security/incidents
        </h1>
        <button
          onClick={handleNewIncident}
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Nuevo Incidente
        </button>
      </div>

      <h2 className="text-xl font-heading text-gray-300">
        Gestión de Incidentes de Seguridad
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {incidents.map((incident) => (
          <IncidentCard
            key={incident.id_incident}
            incident={incident}
            formatDate={formatDate}
            onChangeStatus={handleChangeStatus}
            onEdit={handleEdit}
          />
        ))}
      </div>

      {/* Modales */}
      <IncidentFormModal
        isOpen={showFormModal}
        incident={incidentToEdit}
        onSave={handleSaveIncident}
        onCancel={() => {
          setShowFormModal(false);
          setIncidentToEdit(null);
        }}
      />

      <ChangeIncidentStatusModal
        isOpen={showStatusModal}
        incident={incidentToChangeStatus}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => {
          setShowStatusModal(false);
          setIncidentToChangeStatus(null);
        }}
      />
    </div>
  );
};
