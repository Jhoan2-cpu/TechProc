import { useState } from 'react';
import type { Report, ReportType, ReportFormat } from '../types';
import { ReportGeneratorForm, ReportCard } from '../components';

interface ReportFormData {
  report_type: ReportType;
  format: ReportFormat;
  date_from: string;
  date_to: string;
  include_charts: boolean;
  include_raw_data: boolean;
}

interface ReportsPageProps {
  reports: Report[];
  onDownloadReport: (report: Report) => void;
}

export const ReportsPage = ({
  reports,
  onDownloadReport,
}: ReportsPageProps) => {
  const [reportForm, setReportForm] = useState<ReportFormData>({
    report_type: 'asistencia',
    format: 'pdf',
    date_from: '',
    date_to: '',
    include_charts: true,
    include_raw_data: false,
  });
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleGenerateReport = () => {
    if (!reportForm.date_from || !reportForm.date_to) {
      alert('Por favor, selecciona las fechas de inicio y fin');
      return;
    }

    setIsGeneratingReport(true);
    setReportSuccess(false);

    // Simulación de generación de reporte
    setTimeout(() => {
      setIsGeneratingReport(false);
      setReportSuccess(true);

      console.log('Reporte generado:', reportForm);
      alert(`Reporte generado exitosamente!\nTipo: ${reportForm.report_type}\nFormato: ${reportForm.format}\nFechas: ${reportForm.date_from} a ${reportForm.date_to}`);

      // Resetear el mensaje de éxito después de 3 segundos
      setTimeout(() => setReportSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-white">
          Generación de Reportes
        </h2>
      </div>

      {/* Formulario de Nuevo Reporte */}
      <ReportGeneratorForm
        reportForm={reportForm}
        isGenerating={isGeneratingReport}
        success={reportSuccess}
        onFormChange={setReportForm}
        onGenerate={handleGenerateReport}
      />

      {/* Reportes Generados */}
      <div>
        <h3 className="font-heading font-bold text-lg text-white mb-4">Reportes Generados Recientemente</h3>
        <div className="grid grid-cols-1 gap-4">
          {reports.map((report, index) => (
            <ReportCard
              key={report.id_report}
              report={report}
              index={index}
              onDownload={onDownloadReport}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
