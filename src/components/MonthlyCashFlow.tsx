
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const MonthlyCashFlow = () => {
  const monthlyData = [
    { month: "Jan", income: 22500, expenses: 15000, netFlow: 7500 },
    { month: "Feb", income: 22500, expenses: 15200, netFlow: 7300 },
    { month: "Mar", income: 23000, expenses: 15500, netFlow: 7500 },
    { month: "Apr", income: 23000, expenses: 15800, netFlow: 7200 },
    { month: "May", income: 23500, expenses: 16000, netFlow: 7500 },
    { month: "Jun", income: 22500, expenses: 15000, netFlow: 7500 },
  ];

  const chartConfig = {
    income: { label: "Income", color: "#10b981" },
    expenses: { label: "Expenses", color: "#ef4444" },
    netFlow: { label: "Net Flow", color: "#3b82f6" },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Monthly Cash Flow</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="trend">Trend</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="mt-4">
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-bold text-green-600">$15,000</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Income</span>
                  <span className="text-sm font-medium">$22,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Debt Payments</span>
                  <span className="text-sm font-medium text-red-600">$7,500</span>
                </div>
              </div>
              
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Net Cash Flow</span>
                  <span className="text-sm font-semibold text-green-600">$7,500</span>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="trend" className="mt-4">
            <ChartContainer config={chartConfig} className="h-48">
              <AreaChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stackId="1" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stackId="2" 
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MonthlyCashFlow;
