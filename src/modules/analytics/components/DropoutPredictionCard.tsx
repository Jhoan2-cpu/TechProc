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
      case 'crítico': return 'border-danger/70 bg-danger/10';
      case 'alto': return 'border-orange-500/70 bg-orange-500/10';
      case 'medio': return 'border-yellow-500/70 bg-yellow-500/10';
      case 'bajo': return 'border-green-500/70 bg-green-500/10';
      default: return 'border-gray-400/70 bg-gray-200/10';
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'crítico': return 'bg-danger text-white';
      case 'alto': return 'bg-orange-600 text-white';
      case 'medio': return 'bg-yellow-600 text-white';
      case 'bajo': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div
      className={`relative rounded-2xl border-2 p-6 shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${getRiskColor(student.risk_level)}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-semibold text-lg text-white">
              {student.student_name}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getRiskBadge(student.risk_level)}`}>
              Riesgo {student.risk_level}
            </span>
          </div>
          <p className="text-sm text-gray-200/90">{student.course_name}</p>
          <p className="text-xs text-gray-400">{student.email}</p>
        </div>

        <div className="text-right">
          <p className="text-4xl font-extrabold text-white drop-shadow-sm">{student.risk_score}</p>
          <p className="text-xs text-gray-300/80">Puntuación de riesgo</p>
        </div>
      </div>

      {/* Factores */}
      <div className="mb-5">
        <h4 className="text-sm font-semibold text-white uppercase mb-2 flex items-center gap-2">
          Factores de Riesgo
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {student.factors.map((factor, idx) => (
            <div key={idx} className="rounded-xl bg-white/10 p-3 border border-white/10 hover:bg-white/20 transition-all duration-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm text-white">{factor.factor_name}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    factor.impact === 'alto'
                      ? 'bg-red-200 text-red-800'
                      : factor.impact === 'medio'
                      ? 'bg-yellow-200 text-yellow-800'
                      : 'bg-green-200 text-green-800'
                  }`}
                >
                  {factor.impact.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-200/90">{factor.description}</p>
              <p className="text-sm font-bold text-gray-100 mt-1">Valor: {factor.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Estado de acceso */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200 mb-4">
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faClock} className="text-primary-400" />
          Último acceso: <strong>{student.last_login}</strong>
        </span>
        <span className="flex items-center gap-2 text-danger font-semibold">
          <FontAwesomeIcon icon={faTimesCircle} />
          {student.days_inactive} días inactivo
        </span>
      </div>

      {/* Acciones recomendadas */}
      <div>
        <h4 className="text-sm font-semibold text-white uppercase mb-2 flex items-center gap-2">
          <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
          Acciones Recomendadas
        </h4>
        <ul className="space-y-1">
          {student.recommended_actions.map((action, idx) => (
            <li key={idx} className="text-sm flex items-start gap-2 text-gray-200">
              <FontAwesomeIcon icon={faCheckCircle} className="mt-1 text-green-500" />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
