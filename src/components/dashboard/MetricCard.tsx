import { Card } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down" | "neutral";
}

export function MetricCard({ title, value, change, trend }: MetricCardProps) {
  return (
    <Card className="dark bg-[#2a2a2a]/50 backdrop-blur p-4">
      <div className="flex flex-col">
        <span className="text-sm text-gray-400">{title}</span>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xl font-semibold text-white">{value}</span>
          <div className={cn(
            "flex items-center gap-1 text-sm",
            trend === "up" ? "text-green-400" : 
            trend === "down" ? "text-red-400" : 
            "text-gray-400"
          )}>
            {trend === "up" && <ArrowUpIcon className="w-4 h-4" />}
            {trend === "down" && <ArrowDownIcon className="w-4 h-4" />}
            {trend === "neutral" && <MinusIcon className="w-4 h-4" />}
            <span>{Math.abs(change)}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
} 