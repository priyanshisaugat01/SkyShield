import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import ChartTooltip from "./ChartTooltip";

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
  centerLabel?: string;
  centerValue?: string;
  height?: number;
}

export default function DonutChart({ data, centerLabel, centerValue, height = 200 }: DonutChartProps) {
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<ChartTooltip />} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="65%"
            outerRadius="100%"
            paddingAngle={3}
            animationDuration={900}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} stroke="none" />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {centerValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-semibold text-text">{centerValue}</span>
          {centerLabel && <span className="text-xs text-text-muted mt-0.5">{centerLabel}</span>}
        </div>
      )}
    </div>
  );
}
