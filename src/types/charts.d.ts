declare module "@/components/charts/LineChart" {
  interface LineChartProps {
    data: number[];
    color: string;
  }
  
  export function LineChart(props: LineChartProps): JSX.Element;
}

declare module "@/components/charts/DonutChart" {
  interface DonutChartProps {
    data: Array<{
      value: number;
      color: string;
    }>;
    total: number;
  }
  
  export function DonutChart(props: DonutChartProps): JSX.Element;
}

declare module "@/components/dashboard/CampaignTable" {
  interface Campaign {
    id: string;
    name: string;
    spend: number;
    sales: number;
    acos: number;
  }
  
  export function CampaignTable(): JSX.Element;
}

declare module "@/components/dashboard/MetricCard" {
  interface MetricCardProps {
    title: string;
    value: string;
    change: number;
    trend: "up" | "down" | "neutral";
  }
  
  export function MetricCard(props: MetricCardProps): JSX.Element;
} 