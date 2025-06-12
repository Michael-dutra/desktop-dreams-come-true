
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Calendar, Shield } from "lucide-react";
import { useState } from "react";

export const DisabilityCalculator = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(7500);
  const [benefitPeriod, setBenefitPeriod] = useState([24]); // months
  const [waitingPeriod, setWaitingPeriod] = useState([90]); // days
  const [currentCoverage, setCurrentCoverage] = useState(3000);
  const [livingExpenses, setLivingExpenses] = useState(4500);
  const [healthcareCosts, setHealthcareCosts] = useState(800);
  const [rehabilitationCosts, setRehabilitationCosts] = useState(1200);
  const [lostBenefits, setLostBenefits] = useState(600);
  const [otherExpenses, setOtherExpenses] = useState(400);

  // Calculate disability needs
  const totalMonthlyNeeds = livingExpenses + healthcareCosts + rehabilitationCosts + lostBenefits + otherExpenses;
  const recommendedCoverage = Math.min(monthlyIncome * 0.7, totalMonthlyNeeds); // 70% of income or total needs, whichever is lower
  const coverageGap = Math.max(0, recommendedCoverage - currentCoverage);
  const totalBenefitPayout = currentCoverage * benefitPeriod[0];
  const replacementRatio = (currentCoverage / monthlyIncome) * 100;

  // Chart data
  const needsBreakdown = [
    { name: "Living Expenses", value: livingExpenses, color: "#3b82f6" },
    { name: "Healthcare", value: healthcareCosts, color: "#ef4444" },
    { name: "Rehabilitation", value: rehabilitationCosts, color: "#10b981" },
    { name: "Lost Benefits", value: lostBenefits, color: "#f59e0b" },
    { name: "Other Expenses", value: otherExpenses, color: "#8b5cf6" },
  ];

  const coverageComparison = [
    { category: "Current Coverage", amount: currentCoverage },
    { category: "Recommended", amount: recommendedCoverage },
    { category: "Total Needs", amount: totalMonthlyNeeds },
  ];

  const chartConfig = {
    amount: { label: "Monthly Amount", color: "#3b82f6" },
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Replacement Ratio</p>
                <p className="text-2xl font-bold">{replacementRatio.toFixed(1)}%</p>
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
                <label className="text-sm font-medium mb-2 block">
                  Benefit Period: {benefitPeriod[0]} months
                </label>
                <Slider
                  value={benefitPeriod}
                  onValueChange={setBenefitPeriod}
                  max={120}
                  min={12}
                  step={6}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Waiting Period: {waitingPeriod[0]} days
                </label>
                <Slider
                  value={waitingPeriod}
                  onValueChange={setWaitingPeriod}
                  max={365}
                  min={30}
                  step={30}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-semibold">Monthly Expenses During Disability</h4>
              
              <div>
                <Label htmlFor="livingExpenses">Living Expenses</Label>
                <Input
                  id="livingExpenses"
                  type="number"
                  value={livingExpenses}
                  onChange={(e) => setLivingExpenses(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="healthcareCosts">Healthcare Costs</Label>
                <Input
                  id="healthcareCosts"
                  type="number"
                  value={healthcareCosts}
                  onChange={(e) => setHealthcareCosts(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="rehabilitationCosts">Rehabilitation Costs</Label>
                <Input
                  id="rehabilitationCosts"
                  type="number"
                  value={rehabilitationCosts}
                  onChange={(e) => setRehabilitationCosts(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="lostBenefits">Lost Benefits</Label>
                <Input
                  id="lostBenefits"
                  type="number"
                  value={lostBenefits}
                  onChange={(e) => setLostBenefits(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="otherExpenses">Other Expenses</Label>
                <Input
                  id="otherExpenses"
                  type="number"
                  value={otherExpenses}
                  onChange={(e) => setOtherExpenses(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="space-y-6">
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
                    <Bar dataKey="amount" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Needs Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={needsBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
                    >
                      {needsBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-50">
              <p className="text-sm text-blue-800 font-medium">Total Monthly Needs</p>
              <p className="text-2xl font-bold text-blue-600">${totalMonthlyNeeds.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50">
              <p className="text-sm text-green-800 font-medium">Total Benefit Payout</p>
              <p className="text-2xl font-bold text-green-600">${totalBenefitPayout.toLocaleString()}</p>
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
