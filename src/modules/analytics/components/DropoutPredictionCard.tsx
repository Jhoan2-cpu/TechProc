import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faTimesCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import type { DropoutPrediction } from '../types';

interface DropoutPredictionCardProps {
  student: DropoutPrediction;
  index: number;
}

export const DropoutPredictionCard = ({ student, index }: DropoutPredictionCardProps) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'crítico': return 'bg-danger/20 border-red-500 text-danger';
      case 'alto': return 'bg-orange-900/20 border-orange-500 text-orange-400';
      case 'medio': return 'bg-warning/20 border-yellow-500 text-warning';
      case 'bajo': return 'bg-success/20 border-green-500 text-success';
      default: return 'bg-gray-100 border-gray-500 text-gray-900';
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'crítico': return 'bg-red-600 text-white';
      case 'alto': return 'bg-orange-600 text-white';
      case 'medio': return 'bg-yellow-600 text-white';
      case 'bajo': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div
      className={`border-l-4 rounded-lg p-6 ${getRiskColor(student.risk_level)}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-heading font-bold text-xl">
              {student.student_name}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getRiskBadge(student.risk_level)}`}>
              Riesgo {student.risk_level}
            </span>
          </div>
          <p className="text-sm opacity-80">{student.course_name}</p>
          <p className="text-xs opacity-70">{student.email}</p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold">{student.risk_score}</p>
          <p className="text-xs opacity-70">puntuación de riesgo</p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-heading font-bold text-sm mb-2 uppercase">Factores de Riesgo</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {student.factors.map((factor, idx) => (
            <div key={idx} className="bg-white bg-opacity-50 rounded p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm">{factor.factor_name}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  factor.impact === 'alto' ? 'bg-red-200 text-danger' :
                  factor.impact === 'medio' ? 'bg-yellow-200 text-warning' :
                  'bg-green-200 text-success'
                }`}>
                  Impacto {factor.impact}
                </span>
              </div>
              <p className="text-xs opacity-80">{factor.description}</p>
              <p className="text-sm font-bold mt-1">Valor: {factor.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 flex items-center gap-6 text-sm">
        <span>
          <FontAwesomeIcon icon={faClock} className="mr-2" />
          Último acceso: <strong>{student.last_login}</strong>
        </span>
        <span className="text-red-700 font-bold">
          <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
          {student.days_inactive} días inactivo
        </span>
      </div>

      <div>
        <h4 className="font-heading font-bold text-sm mb-2 uppercase flex items-center gap-2">
          <FontAwesomeIcon icon={faCheckCircle} />
          Acciones Recomendadas
        </h4>
        <ul className="space-y-1">
          {student.recommended_actions.map((action, idx) => (
            <li key={idx} className="text-sm flex items-start gap-2">
              <FontAwesomeIcon icon={faCheckCircle} className="mt-1 text-green-700" />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
