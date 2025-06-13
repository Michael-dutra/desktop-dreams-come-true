
import { Crown, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EstateDetailDialog } from "./EstateDetailDialog";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

const EstateCard = () => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Estate data
  const totalEstateValue = 785000;
  const estateTaxes = 25000;
  const netEstateValue = totalEstateValue - estateTaxes;

  const estateBreakdownData = [
    {
      category: "Total Estate",
      amount: totalEstateValue,
      color: "#8b5cf6"
    },
    {
      category: "Estate Taxes",
      amount: estateTaxes,
      color: "#f59e0b"
    },
    {
      category: "Net to Beneficiaries",
      amount: netEstateValue,
      color: "#06b6d4"
    }
  ];

  const chartConfig = {
    amount: { label: "Amount", color: "#8b5cf6" }
  };

  return (
    <>
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-50 to-transparent rounded-full -translate-y-16 translate-x-16" />
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Crown className="h-6 w-6 text-orange-700" />
            </div>
            <span>Estate</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 border-orange-700 text-orange-700 hover:bg-orange-50"
            onClick={() => setShowDetailDialog(true)}
          >
            <Eye className="w-4 h-4" />
            Details
          </Button>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Estate Value Breakdown Chart */}
          <div className="p-5 bg-gradient-to-r from-purple-50 to-cyan-50 border border-purple-200 rounded-xl">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Estate Value Breakdown</h3>
              <p className="text-sm text-gray-600">Before and after tax implications</p>
            </div>
            
            <ChartContainer config={chartConfig} className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={estateBreakdownData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="category" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent 
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, "Amount"]}
                    />}
                  />
                  <Bar 
                    dataKey="amount" 
                    radius={[4, 4, 0, 0]}
                  >
                    {estateBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Summary Numbers */}
            <div className="grid grid-cols-3 gap-4 mt-4 text-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <p className="text-xs text-purple-700 font-medium">Total Estate</p>
                <p className="text-lg font-bold text-purple-800">${(totalEstateValue / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <p className="text-xs text-amber-700 font-medium">Estate Taxes</p>
                <p className="text-lg font-bold text-amber-800">${(estateTaxes / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-2 bg-cyan-100 rounded-lg">
                <p className="text-xs text-cyan-700 font-medium">Net Amount</p>
                <p className="text-lg font-bold text-cyan-800">${(netEstateValue / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EstateDetailDialog 
        isOpen={showDetailDialog} 
        onClose={() => setShowDetailDialog(false)} 
      />
    </>
  );
};

export default EstateCard;
