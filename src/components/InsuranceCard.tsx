
import { Shield, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const InsuranceCard = () => {
  const coverageData = [
    { category: "Current Coverage", amount: 320000, color: "#3b82f6" },
    { category: "Recommended Need", amount: 640000, color: "#ef4444" },
  ];

  const chartConfig = {
    current: { label: "Current Coverage", color: "#3b82f6" },
    recommended: { label: "Recommended Need", color: "#ef4444" },
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Insurance</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-2xl font-bold text-foreground">$2,400/year</p>
            <p className="text-sm text-muted-foreground">Total Premiums</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Life Insurance</span>
              <span className="text-sm font-medium">$1,200/year</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Home Insurance</span>
              <span className="text-sm font-medium">$800/year</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Auto Insurance</span>
              <span className="text-sm font-medium">$400/year</span>
            </div>
          </div>
          
          <div className="border-t pt-3 space-y-3">
            <div>
              <h4 className="text-sm font-medium mb-2">Life Insurance Coverage</h4>
              <ChartContainer config={chartConfig} className="h-32">
                <BarChart data={coverageData} layout="horizontal">
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="category" type="category" tick={{ fontSize: 9 }} width={80} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
            
            <div className="flex items-center space-x-1 text-orange-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Coverage gap: $320K</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsuranceCard;
