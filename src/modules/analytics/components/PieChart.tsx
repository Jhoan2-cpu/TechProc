interface PieChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
  title?: string;
}

export const PieChart = ({ data, title }: PieChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const segments = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    return {
      ...item,
      percentage,
      startAngle,
      endAngle: currentAngle,
    };
  });

  return (
    <div className="w-full">
      {title && <h3 className="text-base font-heading font-semibold text-secondary-900 mb-4 text-center">{title}</h3>}
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Circular Representation */}
        <div className="relative w-48 h-48 flex-shrink-0">
          <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
            {segments.map((segment, index) => {
              const radius = 80;
              const circumference = 2 * Math.PI * radius;
              const offset = circumference - (segment.percentage / 100) * circumference;
              const rotateAngle = (segment.startAngle / 360) * circumference;

              return (
                <circle
                  key={index}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke={segment.color.replace('bg-', '#').replace('-500', '')}
                  strokeWidth="40"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={{
                    strokeDashoffset: offset,
                    strokeDasharray: circumference,
                    transformOrigin: '100px 100px',
                    transform: `rotate(${(rotateAngle / circumference) * 360}deg)`,
                    transition: 'stroke-dashoffset 1s ease-out',
                  }}
                  className="animate-fade-in"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary-900">{total}</p>
              <p className="text-xs text-secondary-600">Total</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center justify-between p-2 hover:bg-secondary-50 rounded transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded ${segment.color}`} />
                <span className="text-sm font-medium text-secondary-700">{segment.label}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-secondary-900">{segment.value}</span>
                <span className="text-xs text-secondary-600 ml-2">({segment.percentage.toFixed(1)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
