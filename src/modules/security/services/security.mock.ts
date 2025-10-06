// Datos Mock para el módulo Security
// Estos datos simulan las respuestas de la API
import type { ActiveSession, BlockedIP, Incident, Backup } from '../types';

// Mock Sesiones Activas
export const mockActiveSessions: (ActiveSession & {
  user_name: string;
  user_email: string;
  last_activity: string;
  location?: string;
})[] = [
  {
    session_id: 1,
    user_id: 5,
    user_name: 'Carlos Méndez',
    user_email: 'carlos.mendez@techproc.com',
    ip_address: '192.168.1.105',
    device: 'Chrome 120 - Windows 10',
    start_date: '2024-03-15 08:30:00',
    last_activity: '2024-03-15 14:25:00',
    location: 'Lima, Perú',
    active: true,
  },
  {
    session_id: 2,
    user_id: 8,
    user_name: 'Ana Torres',
    user_email: 'ana.torres@techproc.com',
    ip_address: '192.168.1.120',
    device: 'Firefox 122 - macOS',
    start_date: '2024-03-15 09:00:00',
    last_activity: '2024-03-15 14:30:00',
    location: 'Lima, Perú',
    active: true,
  },
  {
    session_id: 3,
    user_id: 12,
    user_name: 'Roberto Silva',
    user_email: 'roberto.silva@techproc.com',
    ip_address: '192.168.1.135',
    device: 'Chrome 120 - Android',
    start_date: '2024-03-15 10:15:00',
    last_activity: '2024-03-15 14:28:00',
    location: 'Arequipa, Perú',
    active: true,
  },
  {
    session_id: 4,
    user_id: 15,
    user_name: 'María González',
    user_email: 'maria.gonzalez@techproc.com',
    ip_address: '10.0.0.50',
    device: 'Safari 17 - iOS',
    start_date: '2024-03-15 11:00:00',
    last_activity: '2024-03-15 14:20:00',
    location: 'Cusco, Perú',
    active: true,
  },
];

// Mock IPs Bloqueadas
export const mockBlockedIPs: BlockedIP[] = [
  {
    id_blocked_ip: 1,
    ip_address: '192.168.100.50',
    reason: 'Múltiples intentos de acceso fallidos (15 intentos en 5 minutos)',
    block_date: '2024-03-15 08:00:00',
    active: true,
  },
  {
    id_blocked_ip: 2,
    ip_address: '10.0.0.123',
    reason: 'Actividad sospechosa - Escaneo de puertos detectado',
    block_date: '2024-03-14 20:00:00',
    active: true,
  },
  {
    id_blocked_ip: 3,
    ip_address: '203.0.113.45',
    reason: 'Intento de inyección SQL en formularios',
    block_date: '2024-03-14 15:30:00',
    active: true,
  },
  {
    id_blocked_ip: 4,
    ip_address: '198.51.100.89',
    reason: 'IP reportada en lista negra de spam/malware',
    block_date: '2024-03-13 10:00:00',
    active: false,
  },
];

// Mock Incidentes
export const mockIncidents: (Incident & {
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

// Mock Backups
export const mockBackups: Backup[] = [
  {
    id_backup: 1,
    user_id: 1,
    type: 'complete',
    status: 'completed',
    backup_date: '2024-03-15 02:00:00',
    size_mb: 2048.5,
  },
  {
    id_backup: 2,
    user_id: 1,
    type: 'incremental',
    status: 'completed',
    backup_date: '2024-03-14 02:00:00',
    size_mb: 512.3,
  },
  {
    id_backup: 3,
    user_id: 1,
    type: 'differential',
    status: 'completed',
    backup_date: '2024-03-13 02:00:00',
    size_mb: 850.7,
  },
  {
    id_backup: 4,
    user_id: 1,
    type: 'incremental',
    status: 'failed',
    backup_date: '2024-03-12 02:00:00',
    size_mb: 0,
  },
];
