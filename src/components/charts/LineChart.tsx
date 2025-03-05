interface LineChartProps {
  data: number[];
  color: string;
}

export function LineChart({ data, color }: LineChartProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  // Create points for the line
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((position) => (
          <line
            key={position}
            x1="0"
            y1={position}
            x2="100"
            y2={position}
            stroke="#4a4a4a"
            strokeWidth="0.2"
          />
        ))}
        {[0, 25, 50, 75, 100].map((position) => (
          <line
            key={position}
            x1={position}
            y1="0"
            x2={position}
            y2="100"
            stroke="#4a4a4a"
            strokeWidth="0.2"
          />
        ))}

        {/* Line chart */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="transition-all duration-300"
        />

        {/* Data points */}
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((value - min) / range) * 100;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1.5"
              fill={color}
              className="transition-all duration-300"
            />
          );
        })}
      </svg>
    </div>
  );
} 