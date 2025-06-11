
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";

const IncomeSourceChart = () => {
  const data = [
    { month: "Jan", salary: 8000, investments: 2000, business: 1500 },
    { month: "Feb", salary: 8000, investments: 2200, business: 1800 },
    { month: "Mar", salary: 8200, investments: 1800, business: 2200 },
    { month: "Apr", salary: 8200, investments: 2500, business: 2000 },
    { month: "May", salary: 8500, investments: 2800, business: 2400 },
    { month: "Jun", salary: 8500, investments: 2600, business: 2800 },
    { month: "Jul", salary: 8800, investments: 3000, business: 3200 },
    { month: "Aug", salary: 8800, investments: 2900, business: 3000 },
    { month: "Sep", salary: 9000, investments: 3200, business: 3500 },
    { month: "Oct", salary: 9000, investments: 3100, business: 3800 },
    { month: "Nov", salary: 9200, investments: 3400, business: 4000 },
    { month: "Dec", salary: 9500, investments: 3600, business: 4200 },
  ];

  const chartConfig = {
    salary: {
      label: "Salary",
      color: "#8b5cf6",
    },
    investments: {
      label: "Investments",
      color: "#06b6d4",
    },
    business: {
      label: "Business",
      color: "#f59e0b",
    },
  };

  return (
    <Card className="bg-slate-800 text-white border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-slate-300">Income Source per Month</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-32">
          <AreaChart data={data}>
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area 
              type="monotone" 
              dataKey="salary" 
              stackId="1" 
              stroke="#8b5cf6" 
              fill="#8b5cf6" 
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="investments" 
              stackId="1" 
              stroke="#06b6d4" 
              fill="#06b6d4" 
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="business" 
              stackId="1" 
              stroke="#f59e0b" 
              fill="#f59e0b" 
              fillOpacity={0.6}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default IncomeSourceChart;
