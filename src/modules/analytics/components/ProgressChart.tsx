interface ProgressChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
  title?: string;
}

export const ProgressChart = ({ data, title }: ProgressChartProps) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full">
      {title && <h3 className="text-base font-heading font-semibold text-white mb-4">{title}</h3>}
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300 font-medium">{item.label}</span>
              <span className="text-white font-bold">{item.value}%</span>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${item.color}`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
