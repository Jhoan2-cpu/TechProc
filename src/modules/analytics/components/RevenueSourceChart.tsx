import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie } from '@fortawesome/free-solid-svg-icons';
import type { RevenueBySource } from '../types/financial';

interface RevenueSourceChartProps {
  data: RevenueBySource[];
}

export const RevenueSourceChart = ({ data }: RevenueSourceChartProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const total = data.reduce((sum, item) => sum + parseFloat(item.amount), 0);

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-orange-500'
  ];

  const textColors = [
    'text-blue-400',
    'text-green-400',
    'text-yellow-400',
    'text-purple-400',
    'text-pink-400',
    'text-indigo-400',
    'text-red-400',
    'text-orange-400'
  ];

  const borderColors = [
    'border-blue-500/30',
    'border-green-500/30',
    'border-yellow-500/30',
    'border-purple-500/30',
    'border-pink-500/30',
    'border-indigo-500/30',
    'border-red-500/30',
    'border-orange-500/30'
  ];

  return (
    <div className="card p-6 border border-gray-700/30">
      <h3 className="font-heading font-bold text-white flex items-center gap-2 mb-6">
        <FontAwesomeIcon icon={faChartPie} className="text-primary-400" />
        Distribución de Ingresos por Fuente
      </h3>

      {/* Barra de progreso visual */}
      <div className="mb-6">
        <div className="flex h-8 rounded-lg overflow-hidden">
          {data.map((item, index) => {
            const percentage = (parseFloat(item.amount) / total) * 100;
            return (
              <div
                key={item.source_id}
                className={`${colors[index % colors.length]} relative group transition-all hover:opacity-80`}
                style={{ width: `${percentage}%` }}
                title={`${item.source_name}: ${formatCurrency(parseFloat(item.amount))} (${percentage.toFixed(1)}%)`}
              >
                {percentage > 10 && (
                  <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                    {percentage.toFixed(0)}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Leyenda con detalles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((item, index) => {
          const percentage = (parseFloat(item.amount) / total) * 100;
          return (
            <div
              key={item.source_id}
              className={`p-4 rounded-lg border ${borderColors[index % borderColors.length]} bg-gray-800/50`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
                  <span className="text-sm font-medium text-white">{item.source_name}</span>
                </div>
                <span className={`text-xs font-bold ${textColors[index % textColors.length]}`}>
                  {percentage.toFixed(1)}%
                </span>
              </div>
              <p className={`text-lg font-bold ${textColors[index % textColors.length]}`}>
                {formatCurrency(parseFloat(item.amount))}
              </p>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 font-medium">Total de Ingresos</span>
          <span className="text-2xl font-bold text-primary-400">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  );
};