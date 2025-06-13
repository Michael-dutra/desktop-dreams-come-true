import { Shield, TrendingUp, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { InsuranceDetailDialog } from "./InsuranceDetailDialog";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { useState } from "react";

const InsuranceCard = () => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Life Insurance needs with slider values (0 to max amount)
  const [needsValues, setNeedsValues] = useState({
    incomeReplacement: [450000],
    debtCoverage: [120000],
    finalExpenses: [25000]
  });

  // Calculate total need based on slider values
  const calculateTotalNeed = () => {
    return Object.values(needsValues).reduce((total, valueArray) => {
      return total + valueArray[0];
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

  const handleSliderChange = (key: keyof typeof needsValues, value: number[]) => {
    setNeedsValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const needsConfig = {
    incomeReplacement: { label: "Income Replacement", max: 5000000 },
    debtCoverage: { label: "Debt Coverage", max: 5000000 },
    finalExpenses: { label: "Final Expenses", max: 5000000 }
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

          {/* Life Insurance Needs Sliders */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-4">Life Insurance Needs</h4>
            <div className="space-y-4">
              {Object.entries(needsConfig).map(([key, config]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      {config.label}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      ${(needsValues[key as keyof typeof needsValues][0] / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <Slider
                    value={needsValues[key as keyof typeof needsValues]}
                    onValueChange={(value) => handleSliderChange(key as keyof typeof needsValues, value)}
                    max={config.max}
                    min={0}
                    step={5000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>$0</span>
                    <span>${(config.max / 1000).toFixed(0)}K</span>
                  </div>
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
