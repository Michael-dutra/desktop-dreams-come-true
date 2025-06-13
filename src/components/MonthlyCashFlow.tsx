
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
      <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200 shadow-xl">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-green-200/30 to-transparent rounded-full -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-200/20 to-transparent rounded-full translate-y-16 -translate-x-16" />
        
        <CardHeader className="flex flex-row items-center justify-between pb-4 relative z-10">
          <CardTitle className="text-xl flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl border-2 border-green-300 shadow-lg">
              <TrendingUp className="h-6 w-6 text-green-700" />
            </div>
            <span className="bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent font-bold">Cash Flow</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDetailDialog(true)}
            className="flex items-center gap-2 border-2 border-green-600 text-green-600 hover:bg-green-100 bg-white/80 backdrop-blur-sm shadow-lg"
          >
            <Eye className="w-4 h-4" />
            Details
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6 relative z-10">
          {/* Net Cash Flow */}
          <div className="text-center p-6 bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 rounded-2xl border-2 border-green-300 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-green-600 mr-2" />
                <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">+$7,500</p>
              </div>
              <p className="text-sm text-green-800 font-semibold">Net Monthly Flow</p>
            </div>
          </div>

          {/* Interactive Cash Flow Trend Chart */}
          <div className="p-5 bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 rounded-2xl border-3 border-emerald-300 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/20 to-green-200/20 rounded-2xl" />
            <div className="relative z-10">
              <div className="mb-4">
                <h3 className="text-base font-bold text-emerald-800 mb-1 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  6-Month Cash Flow Trend
                </h3>
                <p className="text-xs text-emerald-700 font-medium">Monthly net cash flow progression</p>
              </div>
              
              <ChartContainer config={chartConfig} className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cashFlowTrend} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 10, fill: "#047857" }}
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
                      activeDot={{ r: 5, stroke: "#10b981", strokeWidth: 3, fill: "#fff", filter: "drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
          
          {/* Income vs Expenses */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl border-2 border-green-300 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-xl" />
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="p-2 bg-green-200 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-green-700" />
                  </div>
                  <span className="text-sm font-bold text-green-800">Income</span>
                </div>
                <p className="text-2xl font-bold text-green-700">$22,500</p>
              </div>
            </div>
            
            <div className="p-5 bg-gradient-to-br from-red-100 to-rose-100 rounded-xl border-2 border-red-300 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-200/30 to-rose-200/30 rounded-xl" />
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="p-2 bg-red-200 rounded-lg">
                    <TrendingDown className="h-4 w-4 text-red-700" />
                  </div>
                  <span className="text-sm font-bold text-red-800">Expenses</span>
                </div>
                <p className="text-2xl font-bold text-red-700">$15,000</p>
              </div>
            </div>
          </div>
          
          {/* Key Metrics */}
          <div className="space-y-3 pt-2 border-t-2 border-green-200">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 rounded-xl border-2 border-blue-300 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-xl" />
              <div className="relative z-10 flex items-center space-x-3">
                <div className="p-2 bg-blue-200 rounded-lg">
                  <PiggyBank className="h-5 w-5 text-blue-700" />
                </div>
                <span className="text-sm font-bold text-blue-800">Savings Rate</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent relative z-10">33.3%</span>
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
