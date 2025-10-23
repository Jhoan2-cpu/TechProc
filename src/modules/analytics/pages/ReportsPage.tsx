import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faFilter,
  faTimes,
  faSearch,
  faFileExport,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';
import type { Report, ReportFormData } from '../types';
import { ReportCard, ReportFormModal, DeleteReportModal } from '../components';
import { reportService, type ReportType as ApiReportType } from '../services/reportService';

export const ReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [reportTypes, setReportTypes] = useState<ApiReportType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReportFormModal, setShowReportFormModal] = useState(false);
  const [showDeleteReportModal, setShowDeleteReportModal] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);

  // Estados para filtros
  const [filters, setFilters] = useState({
    report_type: '',
    format: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchReportTypes();
    fetchReports();
  }, [filters.report_type, filters.format]); // Se ejecuta cuando cambian los filtros

  const fetchReportTypes = async () => {
    try {
      const types = await reportService.getReportTypes();
      setReportTypes(types);
    } catch (err: any) {
      console.error('Error al cargar tipos de reporte:', err);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 [DEBUG] Iniciando fetchReports con filtros:', filters);

      const result = await reportService.listReports({
        report_type: filters.report_type || undefined,
        format: filters.format || undefined,
        search: filters.search || undefined,
        per_page: 20
      });

      console.log('[DEBUG] Resultado de listReports:', result);
      console.log('[DEBUG] Reports recibidos:', result.reports);
      console.log('[DEBUG] Número de reports:', result.reports.length);

      setReports(result.reports.map(reportService._mapToReport) as Report[]);

    } catch (err: any) {
      console.error('DEBUG] Error en fetchReports:', err);
      console.error('[DEBUG] Error details:', err.response?.data);
      setError(err.message || 'Error al cargar los reportes');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (reportType: string) => {
    const colors: { [key: string]: string } = {
      'students': 'bg-blue-900/20 text-blue-700',
      'courses': 'bg-green-900/20 text-green-700',
      'attendance': 'bg-yellow-900/20 text-yellow-700',
      'grades': 'bg-purple-900/20 text-purple-700',
      'financial': 'bg-red-900/20 text-red-700',
      'tickets': 'bg-orange-900/20 text-orange-700',
      'security': 'bg-gray-900/20 text-gray-700',
      'dashboard': 'bg-indigo-900/20 text-indigo-700'
    };
    return colors[reportType] || 'bg-primary-900/20 text-blue-700';
  };

  const handleNewReport = () => {
    setShowReportFormModal(true);
  };

  const handleDeleteReport = (report: Report) => {
    setReportToDelete(report);
    setShowDeleteReportModal(true);
  };

  const verifyFileOnServer = async (report: Report) => {
    try {
      const token = report.download_url.split('/').pop();
      if (!token) return;

      console.log('🔍 [VERIFY] Verificando archivo en servidor para token:', token);

      // Hacer una petición HEAD para verificar sin descargar el archivo completo
      const response = await fetch(`/api/data-analyst/export/download/${token}`, {
        method: 'HEAD',
        credentials: 'include',
      });

      console.log('🔍 [VERIFY] HEAD Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        ok: response.ok
      });

      if (response.ok) {
        const contentLength = response.headers.get('content-length');
        const contentType = response.headers.get('content-type');
        console.log('🔍 [VERIFY] Archivo disponible:', {
          size: contentLength ? `${contentLength} bytes` : 'desconocido',
          type: contentType || 'desconocido'
        });
      } else {
        console.error('🔍 [VERIFY] Archivo no disponible:', response.status, response.statusText);
      }

    } catch (error) {
      console.error('🔍 [VERIFY] Error en verificación:', error);
    }
  };

  const [downloadingReports, setDownloadingReports] = useState<Set<number>>(new Set());

  const handleDownloadReport = async (report: Report) => {
    if (downloadingReports.has(report.id)) {
      return; // Ya se está descargando
    }

    try {
      setDownloadingReports(prev => new Set(prev).add(report.id));
      if (report.is_expired) {
        alert('Este reporte ha expirado y no puede ser descargado.');
        return;
      }

      console.log('📥 Iniciando descarga:', report.report_title);

      // Usar la URL de descarga directamente - MÉTODO RECOMENDADO
      const downloadUrl = report.download_url;

      // Si la URL es relativa, hacerla absoluta
      const absoluteUrl = downloadUrl.startsWith('http')
        ? downloadUrl
        : `${window.location.origin}${downloadUrl}`;

      console.log('🔗 URL de descarga:', absoluteUrl);

      // Crear un enlace temporal
      const link = document.createElement('a');
      link.href = absoluteUrl;
      link.setAttribute('download', report.file_name);
      link.setAttribute('target', '_blank'); // Abrir en nueva pestaña/pestaña en segundo plano

      // Opcional: agregar atributos para mejor experiencia
      link.setAttribute('rel', 'noopener noreferrer');

      // Hacer el enlace invisible
      link.style.display = 'none';
      document.body.appendChild(link);

      // Simular click
      link.click();

      // Limpiar después de un tiempo
      setTimeout(() => {
        document.body.removeChild(link);
      }, 1000);

      console.log('✅ Descarga iniciada exitosamente');

    } catch (err: any) {
      console.error('❌ Error en descarga:', err);
      alert('Error al descargar el reporte: ' + (err.message || 'Error desconocido'));
    } finally {
      setDownloadingReports(prev => {
        const newSet = new Set(prev);
        newSet.delete(report.id);
        return newSet;
      });
    }

  };

  const handleSaveReport = async (reportData: ReportFormData) => {
    try {
      const result = await reportService.generateReport(reportData);

      setShowReportFormModal(false);
      await fetchReports(); // Recargar la lista

      alert(`Reporte "${result.report.report_title}" generado exitosamente!`);

    } catch (error: any) {
      // Propagar el error al modal para que lo muestre
      throw error;
    }
  };

  const handleConfirmDeleteReport = async () => {
    if (reportToDelete) {
      try {
        // Extraer el token del reporte (necesitas agregar access_token a tu interfaz Report)
        const token = (reportToDelete as any).access_token || reportToDelete.download_url.split('/').pop();
        await reportService.deleteReport(token);

        setShowDeleteReportModal(false);
        setReportToDelete(null);
        await fetchReports(); // Recargar la lista

      } catch (err: any) {
        console.error('Error al eliminar reporte:', err);
        alert('Error: ' + (err.message || 'No se pudo eliminar el reporte'));
      }
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    fetchReports();
  };

  const clearFilters = () => {
    setFilters({
      report_type: '',
      format: '',
      search: ''
    });
  };

  const hasActiveFilters = filters.report_type || filters.format || filters.search;

  if (loading && reports.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-3">
          <FontAwesomeIcon icon={faChartBar} className="text-primary-600" />
          Generación de Reportes
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn flex items-center gap-2 ${showFilters || hasActiveFilters
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
            onClick={handleNewReport}
            className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            Nuevo Reporte
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Buscar en títulos
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="input flex-1"
                  placeholder="Buscar en títulos..."
                />
                <button
                  onClick={handleSearch}
                  className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
                  title="Buscar"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
            </div>

            {/* Filtro por tipo de reporte */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Reporte
              </label>
              <select
                value={filters.report_type}
                onChange={(e) => handleFilterChange('report_type', e.target.value)}
                className="input w-full"
              >
                <option value="">Todos los tipos</option>
                {reportTypes.map(type => (
                  <option key={type.key} value={type.key}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por formato */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Formato
              </label>
              <select
                value={filters.format}
                onChange={(e) => handleFilterChange('format', e.target.value)}
                className="input w-full"
              >
                <option value="">Todos los formatos</option>
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
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
          {reports.length} reporte{reports.length !== 1 ? 's' : ''} encontrado{reports.length !== 1 ? 's' : ''}
          {hasActiveFilters && ' con filtros aplicados'}
        </p>
        <button
          onClick={fetchReports}
          disabled={loading}
          className="btn btn-secondary text-sm flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faFileExport} />
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reports.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-24 h-24 bg-secondary-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faFileExport} className="text-gray-400 text-3xl" />
            </div>
            <p className="text-gray-400 text-lg mb-2">
              {hasActiveFilters
                ? 'No hay reportes que coincidan con los filtros aplicados.'
                : 'No hay reportes generados aún.'
              }
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {hasActiveFilters
                ? 'Intenta con otros filtros o limpia los actuales.'
                : 'Genera tu primer reporte usando el botón "Nuevo Reporte".'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn bg-primary-600 hover:bg-primary-700 text-white"
              >
                Limpiar filtros
              </button>
            )}
            {!hasActiveFilters && (
              <button
                onClick={handleNewReport}
                className="btn bg-primary-600 hover:bg-primary-700 text-white"
              >
                Generar Primer Reporte
              </button>
            )}
          </div>
        ) : (
          reports.map((report, index) => (
            <ReportCard
              key={report.id}
              report={report}
              index={index}
              formatDate={formatDate}
              getStatusColor={getStatusColor}
              onDownload={handleDownloadReport}
              onDelete={handleDeleteReport}
            />
          ))
        )}
      </div>

      {/* Modales */}
      <ReportFormModal
        isOpen={showReportFormModal}
        reportTypes={reportTypes}
        onSave={handleSaveReport}
        onCancel={() => setShowReportFormModal(false)}
      />

      <DeleteReportModal
        isOpen={showDeleteReportModal}
        report={reportToDelete}
        onConfirm={handleConfirmDeleteReport}
        onCancel={() => {
          setShowDeleteReportModal(false);
          setReportToDelete(null);
        }}
      />
    </div>
  );
};