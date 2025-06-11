
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const LiabilitiesBreakdown = () => {
  const liabilities = [
    { name: "Mortgage", amount: "$420,000", value: 420000, color: "#ef4444" },
    { name: "Car Loan", amount: "$18,000", value: 18000, color: "#f97316" },
    { name: "Credit Cards", amount: "$7,500", value: 7500, color: "#eab308" },
  ];

  const chartConfig = {
    mortgage: { label: "Mortgage", color: "#ef4444" },
    carLoan: { label: "Car Loan", color: "#f97316" },
    creditCards: { label: "Credit Cards", color: "#eab308" },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Liabilities</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="breakdown" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            <TabsTrigger value="chart">Chart</TabsTrigger>
          </TabsList>
          <TabsContent value="breakdown" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-3">
                {liabilities.map((liability, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: liability.color }}></div>
                      <span className="text-sm font-medium">{liability.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-red-600">{liability.amount}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Monthly Payments</span>
                  <span className="text-sm font-semibold">$7,500</span>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="chart" className="mt-4">
            <ChartContainer config={chartConfig} className="h-48">
              <BarChart data={liabilities}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LiabilitiesBreakdown;
