
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Shield, Edit } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface InsuranceAnalysisCardProps {
  title: string;
  currentCoverage: number[];
  onCoverageChange: (value: number[]) => void;
  calculatedNeed: number;
  gap: number;
  chartData: Array<{
    category: string;
    amount: number;
    fill: string;
  }>;
  unit?: string;
  maxSlider: number;
  stepSlider: number;
  breakdown?: Array<{
    label: string;
    amount: number;
  }>;
  onBreakdownChange?: (index: number, value: number) => void;
}

const chartConfig = {
  amount: { label: "Amount" },
};

export const InsuranceAnalysisCard = ({
  title,
  currentCoverage,
  onCoverageChange,
  calculatedNeed,
  gap,
  chartData,
  unit = "",
  maxSlider,
  stepSlider,
  breakdown,
  onBreakdownChange
}: InsuranceAnalysisCardProps) => {
  const [editingBreakdown, setEditingBreakdown] = useState(false);

  const getGapColor = () => {
    if (gap > calculatedNeed * 0.5) return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', textLight: 'text-red-700', accent: 'text-red-600' };
    if (gap > 0) return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900', textLight: 'text-orange-700', accent: 'text-orange-600' };
    return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900', textLight: 'text-green-700', accent: 'text-green-600' };
  };

  const colors = getGapColor();

  const handleBreakdownEdit = (index: number, value: string) => {
    const numValue = parseInt(value.replace(/,/g, '')) || 0;
    if (onBreakdownChange) {
      onBreakdownChange(index, numValue);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Current Coverage: {unit === "/month" ? `$${(currentCoverage[0] / 1000).toFixed(1)}K${unit}` : `$${(currentCoverage[0] / 1000).toFixed(0)}K${unit}`}
              </label>
              <Slider
                value={currentCoverage}
                onValueChange={onCoverageChange}
                max={maxSlider}
                min={0}
                step={stepSlider}
                className="w-full"
              />
            </div>
            
            <div className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}>
              <h4 className={`font-semibold mb-2 ${colors.text}`}>
                {gap > 0 ? 'Coverage Gap Identified' : 'Coverage Met'}
              </h4>
              <p className={`text-sm mb-3 ${colors.textLight}`}>
                {gap > 0 
                  ? `Your current coverage falls short by ${unit === "/month" ? `$${(gap / 1000).toFixed(1)}K${unit}` : `$${(gap / 1000).toFixed(0)}K${unit}`}.`
                  : 'Your current coverage meets or exceeds the calculated need.'
                }
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Current Coverage:</span>
                  <span className="font-medium">${currentCoverage[0].toLocaleString()}{unit}</span>
                </div>
                <div className="flex justify-between">
                  <span>Calculated Need:</span>
                  <span className="font-medium">${calculatedNeed.toLocaleString()}{unit}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Coverage Gap:</span>
                  <span className={`font-bold ${colors.accent}`}>
                    ${gap.toLocaleString()}{unit}
                  </span>
                </div>
              </div>

              {breakdown && (
                <div className="mt-4 pt-3 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">Need Breakdown:</h5>
                    {onBreakdownChange && (
                      <button
                        onClick={() => setEditingBreakdown(!editingBreakdown)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title={editingBreakdown ? "Done editing" : "Edit breakdown"}
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-1 text-xs">
                    {breakdown.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{item.label}:</span>
                        {editingBreakdown && onBreakdownChange ? (
                          <Input
                            type="text"
                            value={item.amount.toLocaleString()}
                            onChange={(e) => handleBreakdownEdit(index, e.target.value)}
                            className="w-20 h-6 text-xs text-right"
                          />
                        ) : (
                          <span>${item.amount.toLocaleString()}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-center">Coverage Comparison</h4>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="horizontal" margin={{ top: 20, right: 30, left: 80, bottom: 20 }}>
                  <XAxis 
                    type="number" 
                    tick={{ fontSize: 12 }} 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <YAxis 
                    dataKey="category" 
                    type="category" 
                    tick={{ fontSize: 11 }} 
                    width={75}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent 
                      formatter={(value) => [`$${Number(value).toLocaleString()}${unit}`, "Amount"]}
                    />} 
                  />
                  <Bar 
                    dataKey="amount" 
                    radius={[0, 4, 4, 0]}
                    strokeWidth={1}
                    stroke="#ffffff"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
