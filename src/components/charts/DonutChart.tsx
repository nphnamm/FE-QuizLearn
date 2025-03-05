interface DonutChartProps {
  data: Array<{
    value: number;
    color: string;
  }>;
  total: number;
}

export function DonutChart({ data, total }: DonutChartProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg className="w-48 h-48 transform -rotate-90">
        {data.map((segment, i) => {
          const percentage = (segment.value / total) * 100;
          const strokeDasharray = (percentage / 100) * circumference;
          const strokeDashoffset = currentOffset;
          currentOffset -= strokeDasharray;

          return (
            <circle
              key={i}
              cx="96"
              cy="96"
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth="24"
              strokeDasharray={`${strokeDasharray} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{total.toLocaleString()}</span>
        <span className="text-sm text-gray-400">Total</span>
      </div>
    </div>
  );
} 