import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import type { DropoutPrediction } from '../types';
import { DropoutPredictionCard } from '../components';

interface DropoutPageProps {
  dropoutPredictions: DropoutPrediction[];
  onExportCSV: (data: any[], filename: string) => void;
}

export const DropoutPage = ({
  dropoutPredictions,
  onExportCSV,
}: DropoutPageProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-heading font-bold text-white">
          Predicción de Riesgo de Deserción
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onExportCSV(dropoutPredictions, 'riesgo_desercion')}
            className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faFileCsv} />
            Exportar CSV
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-3 py-1 rounded-full bg-danger/20 text-danger font-bold shadow-sm">
              {dropoutPredictions.filter(d => d.risk_level === 'crítico').length} Críticos
            </span>
            <span className="px-3 py-1 rounded-full bg-orange-900/20 text-orange-400 font-bold shadow-sm">
              {dropoutPredictions.filter(d => d.risk_level === 'alto').length} Altos
            </span>
            <span className="px-3 py-1 rounded-full bg-warning/20 text-warning font-bold shadow-sm">
              {dropoutPredictions.filter(d => d.risk_level === 'medio').length} Medios
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {dropoutPredictions.map((student, index) => (
          <DropoutPredictionCard
            key={student.student_id}
            student={student}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};
