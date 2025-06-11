
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const InquiriesPerMonthChart = () => {
  const data = [
    { month: "Jan", inquiries: 15 },
    { month: "Feb", inquiries: 20 },
    { month: "Mar", inquiries: 18 },
    { month: "Apr", inquiries: 25 },
    { month: "May", inquiries: 30 },
    { month: "Jun", inquiries: 28 },
    { month: "Jul", inquiries: 35 },
    { month: "Aug", inquiries: 32 },
    { month: "Sep", inquiries: 40 },
    { month: "Oct", inquiries: 38 },
    { month: "Nov", inquiries: 42 },
    { month: "Dec", inquiries: 45 },
  ];

  const chartConfig = {
    inquiries: {
      label: "Inquiries",
      color: "#8b5cf6",
    },
  };

  return (
    <Card className="bg-slate-800 text-white border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-slate-300">Inquiries per Month</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-32">
          <BarChart data={data}>
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="inquiries" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default InquiriesPerMonthChart;
