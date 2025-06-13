
import { TrendingUp, TrendingDown, DollarSign, Eye, PiggyBank, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { CashFlowDetailDialog } from "./CashFlowDetailDialog";
import { useState } from "react";

const MonthlyCashFlow = () => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Cash flow trend data for the interactive chart
  const cashFlowTrend = [
    { month: "Jul", flow: 6800 },
    { month: "Aug", flow: 7200 },
    { month: "Sep", flow: 7500 },
    { month: "Oct", flow: 7100 },
    { month: "Nov", flow: 7800 },
    { month: "Dec", flow: 7500 },
  ];

  const chartConfig = {
    flow: {
      label: "Net Cash Flow",
      color: "#10b981",
    },
  };

  return (
    <>
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <span>Cash Flow</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDetailDialog(true)}
            className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
          >
            <Eye className="w-4 h-4" />
            Details
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Net Cash Flow */}
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="flex items-center justify-center mb-2">
              <Zap className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-3xl font-bold text-green-600">+$7,500</p>
            </div>
            <p className="text-sm text-green-700 font-medium">Net Monthly Flow</p>
          </div>

          {/* 6-Month Cash Flow Trend Chart - Full Width */}
          <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
            <div className="mb-4">
              <h3 className="text-base font-bold text-gray-800 mb-1 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                6-Month Cash Flow Trend
              </h3>
              <p className="text-xs text-gray-600 font-medium">Monthly net cash flow progression</p>
            </div>
            
            <ChartContainer config={chartConfig} className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cashFlowTrend} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12, fill: "#374151" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <ChartTooltip 
                    content={<ChartTooltipContent 
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, "Net Flow"]}
                    />}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="flow" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2, fill: "#fff" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          
          {/* Income vs Expenses */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-800">Income</span>
              </div>
              <p className="text-2xl font-bold text-green-700">$22,500</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-200">
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
                <span className="text-sm font-medium text-red-800">Expenses</span>
              </div>
              <p className="text-2xl font-bold text-red-700">$15,000</p>
            </div>
          </div>
          
          {/* Key Metrics */}
          <div className="space-y-3 pt-2 border-t border-gray-200">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <PiggyBank className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-blue-800">Savings Rate</span>
              </div>
              <span className="text-xl font-bold text-blue-700">33.3%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <CashFlowDetailDialog 
        isOpen={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
      />
    </>
  );
};

export default MonthlyCashFlow;
