import { useState } from 'react';
import type { Report } from '../types';
import { reportService } from '../services/reportService';

export const useReportDownload = () => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const downloadReport = async (report: Report) => {
    if (report.is_expired) {
      alert('Este reporte ha expirado y no puede ser descargado.');
      return;
    }

    try {
      setDownloading(report.id.toString());
      
      console.log('🔄 [HOOK] Iniciando descarga del reporte:', report.report_title);

      // Extraer el token de la URL de descarga
      const token = report.download_url.split('/').pop();
      if (!token) {
        throw new Error('Token de descarga no válido');
      }

      const blob = await reportService.downloadReport(token);
      
      console.log('✅ [HOOK] Blob recibido, tamaño:', blob.size);

      // Crear URL del blob y forzar descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', report.file_name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log('✅ [HOOK] Descarga completada exitosamente');
      
    } catch (error: any) {
      console.error('❌ [HOOK] Error descargando reporte:', error);
      
      let errorMessage = 'Error al descargar el reporte';
      if (error.message) {
        errorMessage += ': ' + error.message;
      }
      
      alert(errorMessage);
    } finally {
      setDownloading(null);
    }
  };

  return {
    downloading,
    downloadReport,
  };
};