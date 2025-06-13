
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Eye, CreditCard } from "lucide-react";
import { LiabilitiesDetailDialog } from "./LiabilitiesDetailDialog";
import { useState } from "react";

const LiabilitiesBreakdown = () => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const liabilities = [
    { 
      name: "Mortgage", 
      amount: "$420,000", 
      monthlyPayment: 2800,
      color: "#8b5cf6", // Purple
      value: 420000
    },
    { 
      name: "Car Loan", 
      amount: "$18,000", 
      monthlyPayment: 450,
      color: "#f59e0b", // Amber
      value: 18000
    },
    { 
      name: "Credit Cards", 
      amount: "$7,500", 
      monthlyPayment: 250,
      color: "#06b6d4", // Cyan
      value: 7500
    },
  ];

  const chartConfig = {
    monthlyPayment: { label: "Monthly Payment", color: "#8b5cf6" }
  };

  const totalMonthlyPayments = liabilities.reduce((sum, liability) => sum + liability.monthlyPayment, 0);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-red-600" />
            </div>
            <span>Liabilities</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDetailDialog(true)}
            className="flex items-center gap-2 border-red-600 text-red-600 hover:bg-red-50"
          >
            <Eye className="w-4 h-4" />
            Details
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Total Debt Amount */}
            <div className="space-y-3">
              {liabilities.map((liability, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: liability.color }}></div>
                    <span className="text-lg font-medium">{liability.name}</span>
                  </div>
                  <span className="text-lg font-semibold text-red-600">{liability.amount}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Total Monthly Payments</span>
                <span className="text-lg font-semibold">${totalMonthlyPayments.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Monthly Payments Chart */}
            <div className="p-5 bg-gradient-to-r from-purple-50 via-amber-50 to-cyan-50 rounded-xl border border-purple-200">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Payment Breakdown</h3>
                <p className="text-sm text-gray-600">Monthly debt service obligations</p>
              </div>
              
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={liabilities} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent 
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, "Monthly Payment"]}
                      />}
                    />
                    <Bar dataKey="monthlyPayment" radius={[4, 4, 0, 0]}>
                      {liabilities.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                {liabilities.map((liability, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border-2" style={{ borderColor: liability.color }}>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: liability.color }}></div>
                      <span className="text-xs font-medium text-gray-700">{liability.name}</span>
                    </div>
                    <p className="text-lg font-bold" style={{ color: liability.color }}>
                      ${liability.monthlyPayment.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">per month</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <LiabilitiesDetailDialog 
        isOpen={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
        liabilities={liabilities}
      />
    </>
  );
};

export default LiabilitiesBreakdown;
