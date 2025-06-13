

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Shield, FileText } from "lucide-react";
import { useState } from "react";

export const DisabilityCalculator = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(7500);
  const [currentCoverage, setCurrentCoverage] = useState(3000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(5500);
  const [showWriteUp, setShowWriteUp] = useState(false);

  // Calculate disability needs
  const recommendedCoverage = Math.min(monthlyIncome * 0.7, monthlyExpenses); // 70% of income or total expenses, whichever is lower
  const coverageGap = Math.max(0, recommendedCoverage - currentCoverage);
  const replacementRatio = (currentCoverage / monthlyIncome) * 100;

  const generateWriteUp = () => {
    const coverageStatus = coverageGap > 0 ? `shortfall of $${coverageGap.toLocaleString()}` : 'adequate coverage';
    
    return `Disability Insurance Analysis Summary

Based on our comprehensive analysis of your disability insurance needs, here are the key findings:

**Income Protection Assessment:**
Your monthly income of $${monthlyIncome.toLocaleString()} supports your current lifestyle and financial obligations. In the event of a disability, maintaining financial stability becomes crucial for covering your monthly expenses of $${monthlyExpenses.toLocaleString()}.

**Coverage Recommendations:**
We recommend disability coverage of $${recommendedCoverage.toLocaleString()} monthly, which represents the lesser of:
- 70% of your monthly income: $${(monthlyIncome * 0.7).toLocaleString()}
- Your total monthly expenses: $${monthlyExpenses.toLocaleString()}

This approach ensures you can maintain your standard of living while preventing over-insurance beyond your actual financial needs.

**Current Coverage Analysis:**
You currently have $${currentCoverage.toLocaleString()} in monthly disability coverage, providing a ${replacementRatio.toFixed(1)}% income replacement ratio. ${coverageGap > 0 ? `This analysis reveals a ${coverageStatus} per month. Additional coverage would help bridge this gap and provide more comprehensive income protection.` : `Your current coverage meets or exceeds your calculated needs, providing solid financial protection in case of disability.`}

**Key Benefits of Adequate Coverage:**
- Maintains your ability to pay mortgage, rent, and other fixed expenses
- Protects your family's standard of living during recovery
- Prevents the need to dip into retirement savings or emergency funds
- Provides peace of mind knowing your income is protected

**Next Steps:**
${coverageGap > 0 ? `Consider securing additional disability insurance to ensure comprehensive income protection. Look for policies with features like cost-of-living adjustments and partial disability benefits.` : `Review your coverage annually to ensure it keeps pace with any income increases or changes in your financial obligations.`}`;
  };

  // Chart data with colors
  const coverageComparison = [
    { category: "Current Coverage", amount: currentCoverage, color: "#3b82f6" }, // Blue
    { category: "Recommended", amount: recommendedCoverage, color: "#10b981" }, // Green
    { category: "Coverage Gap", amount: coverageGap, color: "#ef4444" }, // Red
  ];

  const chartConfig = {
    amount: { label: "Monthly Amount" },
  };

  return (
    <div className="space-y-6">
      {/* Header with Get Write Up Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Disability Calculator</h2>
        <Button 
          onClick={() => setShowWriteUp(!showWriteUp)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Get Write Up
        </Button>
      </div>

      {showWriteUp && (
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-lg">Client Report</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generateWriteUp()}
              readOnly
              className="min-h-[300px] text-sm"
            />
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Current Coverage</p>
                <p className="text-2xl font-bold">${currentCoverage.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Recommended</p>
                <p className="text-2xl font-bold">${recommendedCoverage.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              {coverageGap > 0 ? (
                <TrendingDown className="w-5 h-5 text-red-600" />
              ) : (
                <TrendingUp className="w-5 h-5 text-green-600" />
              )}
              <div>
                <p className="text-sm text-muted-foreground">
                  {coverageGap > 0 ? "Coverage Gap" : "Surplus"}
                </p>
                <p className={`text-2xl font-bold ${coverageGap > 0 ? "text-red-600" : "text-green-600"}`}>
                  ${Math.abs(coverageGap).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Disability Insurance Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="monthlyIncome">Monthly Income</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="currentCoverage">Current Monthly Coverage</Label>
                <Input
                  id="currentCoverage"
                  type="number"
                  value={currentCoverage}
                  onChange={(e) => setCurrentCoverage(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="monthlyExpenses">Monthly Expenses During Disability</Label>
                <Input
                  id="monthlyExpenses"
                  type="number"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Coverage Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={coverageComparison}>
                  <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, "Monthly Amount"]}
                  />
                  <Bar dataKey="amount">
                    {coverageComparison.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-50">
              <p className="text-sm text-blue-800 font-medium">Monthly Expenses</p>
              <p className="text-2xl font-bold text-blue-600">${monthlyExpenses.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50">
              <p className="text-sm text-green-800 font-medium">Income Replacement Ratio</p>
              <p className="text-2xl font-bold text-green-600">{replacementRatio.toFixed(1)}%</p>
            </div>
            <div className={`text-center p-4 rounded-lg ${coverageGap > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
              <p className={`text-sm font-medium ${coverageGap > 0 ? 'text-red-800' : 'text-green-800'}`}>
                {coverageGap > 0 ? 'Additional Coverage Needed' : 'Coverage Adequate'}
              </p>
              <p className={`text-2xl font-bold ${coverageGap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {coverageGap > 0 ? `$${coverageGap.toLocaleString()}` : '✓'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

