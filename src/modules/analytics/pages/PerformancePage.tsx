import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import type { StudentPerformance } from '../types';
import { PerformanceCard } from '../components';

interface PerformancePageProps {
  performance: StudentPerformance[];
  onExportCSV: (data: any[], filename: string) => void;
}

export const PerformancePage = ({
  performance,
  onExportCSV,
}: PerformancePageProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-heading font-bold text-white">
          Análisis de Rendimiento Académico
        </h2>
        <button
          onClick={() => onExportCSV(performance, 'rendimiento_academico')}
          className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faFileCsv} />
          Exportar CSV
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {performance.map((perf, index) => (
          <PerformanceCard
            key={perf.student_id}
            performance={perf}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};
