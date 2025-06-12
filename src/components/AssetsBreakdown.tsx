
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { AssetsDetailDialog } from "./AssetsDetailDialog";
import { Button } from "@/components/ui/button";
import { Eye, TrendingUp, Brain, Lightbulb } from "lucide-react";

const AssetsBreakdown = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const aiGuidanceTips = [
    {
      icon: TrendingUp,
      title: "Diversification Opportunity",
      tip: "Your portfolio is heavily weighted in real estate (84%). Consider increasing liquid investments to reduce concentration risk.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      icon: Brain,
      title: "Tax Optimization",
      tip: "Maximize your TFSA contributions first ($38K current vs $88K+ limit), then focus on RRSP to reduce taxable income.",
      color: "text-blue-600", 
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: Lightbulb,
      title: "Emergency Fund Strategy",
      tip: "Consider keeping 3-6 months of expenses in high-interest savings. Your current liquid assets may not provide adequate emergency coverage.",
      color: "text-green-600",
      bgColor: "bg-green-50", 
      borderColor: "border-green-200"
    }
  ];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-2xl flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <span>Assets</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Details
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Breakdown List */}
            <div className="space-y-3">
              {assets.map((asset, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: asset.color }}></div>
                    <span className="text-lg font-medium">{asset.name}</span>
                  </div>
                  <span className="text-lg font-semibold">{asset.amount}</span>
                </div>
              ))}
            </div>
            
            {/* Chart - Made bigger and better centered */}
            <div className="flex justify-center">
              <ChartContainer config={chartConfig} className="h-80 w-full max-w-md mx-auto">
                <PieChart>
                  <Pie
                    data={assets}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {assets.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </div>

            {/* AI Guidance Tips */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI Guidance Tips
              </h4>
              {aiGuidanceTips.map((tip, index) => (
                <div key={index} className={`p-3 rounded-lg border ${tip.bgColor} ${tip.borderColor}`}>
                  <div className="flex items-start gap-3">
                    <tip.icon className={`w-4 h-4 mt-0.5 ${tip.color}`} />
                    <div>
                      <h5 className={`font-medium ${tip.color} mb-1`}>{tip.title}</h5>
                      <p className="text-sm text-gray-700">{tip.tip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <AssetsDetailDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        assets={assets}
      />
    </>
  );
};

export default AssetsBreakdown;
