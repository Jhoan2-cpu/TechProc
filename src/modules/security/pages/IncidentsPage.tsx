import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { Incident } from '../types';
import { IncidentCard } from '../components';

const mockIncidents: (Incident & {
  description: string;
  severity: string;
  assigned_to?: string;
})[] = [
  {
    id_incident: 1,
    alert_id: 1,
    responsible_id: 3,
    title: 'Intento de acceso no autorizado detectado',
    description: 'Se detectaron múltiples intentos de acceso desde IP 192.168.100.50',
    severity: 'high',
    status: 'investigating',
    report_date: '2024-03-15 08:15:00',
    assigned_to: 'Carlos Ramírez',
  },
  {
    id_incident: 2,
    alert_id: 2,
    responsible_id: 3,
    title: 'Actividad inusual en base de datos',
    description: 'Consultas sospechosas detectadas en horario no laboral',
    severity: 'medium',
    status: 'open',
    report_date: '2024-03-15 02:30:00',
  },
  {
    id_incident: 3,
    alert_id: 3,
    responsible_id: 1,
    title: 'Posible fuga de datos detectada',
    description: 'Transferencia inusual de gran volumen de datos hacia IP externa',
    severity: 'critical',
    status: 'investigating',
    report_date: '2024-03-15 12:00:00',
    assigned_to: 'Juan Pérez',
  },
  {
    id_incident: 4,
    alert_id: 4,
    responsible_id: 2,
    title: 'Malware detectado en estación de trabajo',
    description: 'El antivirus detectó y eliminó malware en PC-205',
    severity: 'medium',
    status: 'resolved',
    report_date: '2024-03-14 16:00:00',
    assigned_to: 'Ana García',
  },
];

export const IncidentsPage = () => {
  const [incidents] = useState(mockIncidents);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold text-secondary-900">
          security/incidents
        </h1>
        <button className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} />
          Nuevo Incidente
        </button>
      </div>

      <h2 className="text-xl font-heading text-secondary-700">
        Gestión de Incidentes de Seguridad
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {incidents.map((incident) => (
          <IncidentCard
            key={incident.id_incident}
            incident={incident}
            formatDate={formatDate}
          />
        ))}
      </div>
    </div>
  );
};
