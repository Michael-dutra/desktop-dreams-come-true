
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const SourceBreakdownChart = () => {
  const data = [
    { source: "Web", value: 65 },
    { source: "Email", value: 45 },
    { source: "Instagram", value: 35 },
    { source: "TikTok", value: 55 },
    { source: "Pinterest", value: 40 },
  ];

  const chartConfig = {
    value: {
      label: "Value",
      color: "#8b5cf6",
    },
  };

  return (
    <Card className="bg-slate-800 text-white border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-slate-300">Inquiry Source Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-32">
          <BarChart data={data} layout="horizontal">
            <XAxis type="number" tick={{ fontSize: 10 }} />
            <YAxis dataKey="source" type="category" tick={{ fontSize: 10 }} width={60} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="#8b5cf6" radius={[0, 2, 2, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SourceBreakdownChart;
