
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const AssetsBreakdown = () => {
  const assets = [
    { name: "Real Estate", amount: "$620,000", value: 620000, color: "#3b82f6" },
    { name: "RRSP", amount: "$52,000", value: 52000, color: "#10b981" },
    { name: "TFSA", amount: "$38,000", value: 38000, color: "#8b5cf6" },
    { name: "Non-Registered", amount: "$25,000", value: 25000, color: "#f59e0b" },
  ];

  const chartConfig = {
    realEstate: { label: "Real Estate", color: "#3b82f6" },
    rrsp: { label: "RRSP", color: "#10b981" },
    tfsa: { label: "TFSA", color: "#8b5cf6" },
    nonRegistered: { label: "Non-Registered", color: "#f59e0b" },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Assets</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="breakdown" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            <TabsTrigger value="chart">Chart</TabsTrigger>
          </TabsList>
          <TabsContent value="breakdown" className="mt-4">
            <div className="space-y-3">
              {assets.map((asset, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: asset.color }}></div>
                    <span className="text-sm font-medium">{asset.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{asset.amount}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="chart" className="mt-4">
            <ChartContainer config={chartConfig} className="h-48">
              <PieChart>
                <Pie
                  data={assets}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {assets.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AssetsBreakdown;
