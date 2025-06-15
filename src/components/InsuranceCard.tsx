import { Shield, TrendingUp, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { InsuranceDetailDialog } from "./InsuranceDetailDialog";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { useState } from "react";
import { Bot } from "lucide-react";
import { SectionAIDialog } from "./SectionAIDialog";

const InsuranceCard = () => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [aiDialogOpen, setAIDialogOpen] = useState(false);

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

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    } else {
      return `$${value.toFixed(0)}`;
    }
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

  const generateAIAnalysis = () => {
    let text = `Personalized Insurance Coverage Review:\n\n`;
    text += `Hi! Let's review your insurance needs based on your current profile:\n\n`;
    text += `• Current coverage: ${formatCurrency(currentLifeCoverage)}\n`;
    text += `• Coverage needed (based on your sliders): ${formatCurrency(calculatedLifeNeed)}\n`;
    text += `• Coverage gap: ${formatCurrency(lifeGap)}\n\n`;
    text += `🔍 Needs breakdown:\n`;
    Object.entries(needsConfig).forEach(([key, config]) => {
      text += `  - ${config.label}: ${formatCurrency(needsValues[key as keyof typeof needsValues][0])}\n`;
    });
    text += lifeGap > 0
      ? `\n🚨 You have a shortfall in coverage. It's a good time to discuss additional protection for your family's income, debts, and final expenses.\n`
      : `\n✅ Your insurance coverage meets your current needs! Review annually or after major life events.\n`;
    text += `\n👉 For even more precision, consider adding data on other insurance types, family changes, or liabilities.\n\nYou can adjust the sliders to instantly see how different needs affect your gap.`;
    return text;
  };

  return (
    <>
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <span>Insurance</span>
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDetailDialog(true)}
              className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Eye className="w-4 h-4" />
              Details
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center border-indigo-600 text-indigo-700 hover:bg-indigo-50 px-3 rounded-lg shadow-sm"
              onClick={() => setAIDialogOpen(true)}
              style={{ border: '2px solid #6366f1' }}
            >
              <Bot className="w-4 h-4 mr-1 text-indigo-600" />
              AI
            </Button>
          </div>
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
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent 
                      formatter={(value) => [formatCurrency(Number(value)), "Amount"]}
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
                <p className="text-lg font-bold text-blue-800">{formatCurrency(currentLifeCoverage)}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <p className="text-xs text-red-700 font-medium">Calculated Need</p>
                <p className="text-lg font-bold text-red-800">{formatCurrency(calculatedLifeNeed)}</p>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <p className="text-xs text-amber-700 font-medium">Coverage Gap</p>
                <p className="text-lg font-bold text-amber-800">{formatCurrency(lifeGap)}</p>
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
                      {formatCurrency(needsValues[key as keyof typeof needsValues][0])}
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
                    <span>{formatCurrency(config.max)}</span>
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
      <SectionAIDialog
        isOpen={aiDialogOpen}
        onClose={() => setAIDialogOpen(false)}
        title="Insurance"
        content={generateAIAnalysis()}
      />
    </>
  );
};

export default InsuranceCard;
