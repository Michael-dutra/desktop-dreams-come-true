
import { Shield, TrendingUp, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { InsuranceDetailDialog } from "./InsuranceDetailDialog";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { useState } from "react";

const InsuranceCard = () => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Life Insurance needs toggles
  const [needsToggles, setNeedsToggles] = useState({
    incomeReplacement: true,
    debtCoverage: true,
    emergencyFund: true,
    education: true,
    finalExpenses: true,
    charitable: false
  });

  // Base amounts for each need
  const baseAmounts = {
    incomeReplacement: 450000,
    debtCoverage: 120000,
    emergencyFund: 35000,
    education: 80000,
    finalExpenses: 25000,
    charitable: 50000
  };

  // Calculate total need based on active toggles
  const calculateTotalNeed = () => {
    return Object.entries(needsToggles).reduce((total, [key, isActive]) => {
      return total + (isActive ? baseAmounts[key as keyof typeof baseAmounts] : 0);
    }, 0);
  };

  const currentLifeCoverage = 320000;
  const calculatedLifeNeed = calculateTotalNeed();
  const lifeGap = Math.max(0, calculatedLifeNeed - currentLifeCoverage);

  const lifeInsuranceData = [
    {
      category: "Current Coverage",
      amount: currentLifeCoverage,
      color: "#3b82f6"
    },
    {
      category: "Calculated Need",
      amount: calculatedLifeNeed,
      color: "#ef4444"
    },
    {
      category: "Coverage Gap",
      amount: lifeGap,
      color: "#f59e0b"
    }
  ];

  const chartConfig = {
    amount: { label: "Amount", color: "#3b82f6" }
  };

  const handleToggleChange = (key: keyof typeof needsToggles) => {
    setNeedsToggles(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const needsLabels = {
    incomeReplacement: "Income Replacement",
    debtCoverage: "Debt Coverage", 
    emergencyFund: "Emergency Fund",
    education: "Education Costs",
    finalExpenses: "Final Expenses",
    charitable: "Charitable Legacy"
  };

  return (
    <>
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-full -translate-y-16 translate-x-16" />
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <span>Insurance</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDetailDialog(true)}
            className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <Eye className="w-4 h-4" />
            Details
          </Button>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Life Insurance Analysis Chart */}
          <div className="p-5 bg-gradient-to-r from-blue-50 to-red-50 border border-blue-200 rounded-xl">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Life Insurance Coverage Analysis</h3>
              <p className="text-sm text-gray-600">Current coverage vs calculated needs</p>
            </div>
            
            <ChartContainer config={chartConfig} className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lifeInsuranceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                    {lifeInsuranceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Summary Numbers */}
            <div className="grid grid-cols-3 gap-4 mt-4 text-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <p className="text-xs text-blue-700 font-medium">Current Coverage</p>
                <p className="text-lg font-bold text-blue-800">${(currentLifeCoverage / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <p className="text-xs text-red-700 font-medium">Calculated Need</p>
                <p className="text-lg font-bold text-red-800">${(calculatedLifeNeed / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <p className="text-xs text-amber-700 font-medium">Coverage Gap</p>
                <p className="text-lg font-bold text-amber-800">${(lifeGap / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </div>

          {/* Life Insurance Needs Toggles */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-3">Life Insurance Needs</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(needsToggles).map(([key, isActive]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-white rounded-lg border">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700">
                      {needsLabels[key as keyof typeof needsLabels]}
                    </span>
                    <p className="text-xs text-gray-500">
                      ${(baseAmounts[key as keyof typeof baseAmounts] / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <Switch
                    checked={isActive}
                    onCheckedChange={() => handleToggleChange(key as keyof typeof needsToggles)}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <InsuranceDetailDialog 
        isOpen={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
      />
    </>
  );
};

export default InsuranceCard;
