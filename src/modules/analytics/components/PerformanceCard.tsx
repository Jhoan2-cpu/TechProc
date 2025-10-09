import type { StudentPerformance } from '../types';

interface PerformanceCardProps {
  performance: StudentPerformance;
  index: number;
}

export const PerformanceCard = ({ performance, index }: PerformanceCardProps) => {
  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-600 text-white';
      case 'B': return 'bg-blue-600 text-white';
      case 'C': return 'bg-yellow-600 text-white';
      case 'D': return 'bg-orange-600 text-white';
      case 'F': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div
      className="card p-6 border border-transparent hover:shadow-lg hover:border-primary-500/20 transition-all duration-300"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-heading font-bold text-lg text-white">
              {performance.student_name}
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(performance.grade)}`}>
              {performance.grade}
            </span>
          </div>
          <p className="text-sm text-gray-400">{performance.course_name}</p>
        </div>
        <div className="text-right">
          <p className={`text-3xl font-bold ${getPerformanceColor(performance.average_score)}`}>
            {performance.average_score.toFixed(1)}
          </p>
          <p className="text-xs text-gray-300">promedio</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
        <div className="text-center p-2 bg-primary-900/20 rounded">
          <p className="text-xs text-gray-400 mb-1">Evaluaciones</p>
          <p className="text-lg font-bold text-primary-400">
            {performance.completed_assessments}/{performance.total_assessments}
          </p>
        </div>
        <div className="text-center p-2 bg-success/20 rounded">
          <p className="text-xs text-gray-400 mb-1">Más Alta</p>
          <p className="text-lg font-bold text-success">{performance.highest_score}</p>
        </div>
        <div className="text-center p-2 bg-danger/20 rounded">
          <p className="text-xs text-gray-400 mb-1">Más Baja</p>
          <p className="text-lg font-bold text-danger">{performance.lowest_score}</p>
        </div>
        <div className="text-center p-2 bg-primary-900/20 rounded">
          <p className="text-xs text-gray-400 mb-1">Aprobación</p>
          <p className="text-lg font-bold text-primary-400">{performance.passing_rate.toFixed(0)}%</p>
        </div>
        <div className="text-center p-2 bg-warning/20 rounded">
          <p className="text-xs text-gray-400 mb-1">Última Eval.</p>
          <p className="text-xs font-bold text-warning">
            {performance.last_assessment_date || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};
