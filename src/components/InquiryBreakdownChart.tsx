
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const InquiryBreakdownChart = () => {
  const data = [
    { name: "Received", value: 36.2, color: "#8b5cf6" },
    { name: "Pending", value: 63.8, color: "#374151" },
  ];

  const chartConfig = {
    received: {
      label: "Received",
      color: "#8b5cf6",
    },
    pending: {
      label: "Pending", 
      color: "#374151",
    },
  };

  return (
    <Card className="bg-slate-800 text-white border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-slate-300">Inquiry Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-32 w-32 mx-auto">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={25}
              outerRadius={50}
              paddingAngle={0}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
        <div className="text-center mt-2">
          <p className="text-lg font-bold">36.2%</p>
          <p className="text-xs text-slate-400">Success Rate</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InquiryBreakdownChart;
