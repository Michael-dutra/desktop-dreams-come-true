
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, AlertTriangle, CheckCircle, Calculator, DollarSign, Calendar } from "lucide-react";

interface RetirementDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RetirementDetailDialog = ({ isOpen, onClose }: RetirementDetailDialogProps) => {
  const [retirementAge, setRetirementAge] = useState([65]);
  const [monthlyContribution, setMonthlyContribution] = useState([1000]);
  const [targetIncome, setTargetIncome] = useState([4000]);

  // Current data
  const currentAge = 35;
  const currentSavings = 90000;
  const yearsToRetirement = retirementAge[0] - currentAge;
  const lifeExpectancy = 90;
  const yearsInRetirement = lifeExpectancy - retirementAge[0];

  // Calculations
  const projectedCPP = 15000; // Annual at 65
  const projectedOAS = 7500; // Annual at 65
  const inflationRate = 0.025;
  const investmentReturn = 0.07;

  // CPP/OAS adjustments for early/late retirement
  const cppAdjustmentFactor = retirementAge[0] < 65 ? 0.6 + (retirementAge[0] - 60) * 0.08 : 
                             retirementAge[0] > 65 ? Math.min(1.42, 1 + (retirementAge[0] - 65) * 0.084) : 1;
  const oasAdjustmentFactor = retirementAge[0] < 65 ? 0 : retirementAge[0] > 65 ? 1 + (retirementAge[0] - 65) * 0.06 : 1;

  const adjustedCPP = projectedCPP * cppAdjustmentFactor;
  const adjustedOAS = projectedOAS * oasAdjustmentFactor;

  // Future value of current savings and contributions
  const futureCurrentSavings = currentSavings * Math.pow(1 + investmentReturn, yearsToRetirement);
  const futureContributions = monthlyContribution[0] * 12 * (Math.pow(1 + investmentReturn, yearsToRetirement) - 1) / investmentReturn;
  const totalRetirementSavings = futureCurrentSavings + futureContributions;

  // RRIF minimum withdrawal rates by age
  const rrfWithdrawalRates: { [key: number]: number } = {
    65: 0.04, 66: 0.0417, 67: 0.0435, 68: 0.0455, 69: 0.0476,
    70: 0.05, 71: 0.0519, 72: 0.054, 73: 0.0563, 74: 0.0588,
    75: 0.0615, 76: 0.0645, 77: 0.0678, 78: 0.0714, 79: 0.0755,
    80: 0.08, 85: 0.1029, 90: 0.1667
  };

  // Annual retirement income need
  const annualIncomeNeed = targetIncome[0] * 12;
  
  // Retirement income gap
  const governmentBenefits = adjustedCPP + adjustedOAS;
  const savingsIncome = totalRetirementSavings * 0.04; // 4% withdrawal rule
  const totalProjectedIncome = governmentBenefits + savingsIncome;
  const incomeGap = Math.max(0, annualIncomeNeed - totalProjectedIncome);

  // Required savings to hit retirement goal (PV of annuity)
  const requiredAnnualIncome = incomeGap;
  const discountRate = investmentReturn - inflationRate;
  const pvAnnuity = requiredAnnualIncome * (1 - Math.pow(1 + discountRate, -yearsInRetirement)) / discountRate;
  const requiredTotalSavings = pvAnnuity + totalRetirementSavings;
  const additionalSavingsNeeded = Math.max(0, requiredTotalSavings - totalRetirementSavings);
  
  // Monthly savings required
  const requiredMonthlySavings = additionalSavingsNeeded > 0 ? 
    (additionalSavingsNeeded * investmentReturn) / (12 * (Math.pow(1 + investmentReturn, yearsToRetirement) - 1)) : 0;

  // Retirement readiness ratio
  const readinessRatio = Math.min(1, totalProjectedIncome / annualIncomeNeed);

  // Chart data
  const incomeProjectionData = Array.from({ length: 25 }, (_, i) => {
    const age = retirementAge[0] + i;
    const withdrawalRate = rrfWithdrawalRates[Math.min(age, 90)] || 0.2;
    return {
      age,
      cpp: adjustedCPP / 1000,
      oas: age >= 65 ? adjustedOAS / 1000 : 0,
      rrsp: (totalRetirementSavings * withdrawalRate) / 1000,
      total: ((adjustedCPP + (age >= 65 ? adjustedOAS : 0) + totalRetirementSavings * withdrawalRate) / 1000)
    };
  });

  const savingsProjectionData = Array.from({ length: yearsToRetirement + 1 }, (_, i) => {
    const year = currentAge + i;
    const currentValue = currentSavings * Math.pow(1 + investmentReturn, i);
    const contributionValue = i > 0 ? monthlyContribution[0] * 12 * (Math.pow(1 + investmentReturn, i) - 1) / investmentReturn : 0;
    return {
      age: year,
      savings: (currentValue + contributionValue) / 1000
    };
  });

  const incomeSourcesData = [
    { source: "CPP", amount: adjustedCPP, color: "#3b82f6" },
    { source: "OAS", amount: adjustedOAS, color: "#10b981" },
    { source: "RRSP/RRIF", amount: savingsIncome, color: "#f59e0b" },
    { source: "Gap", amount: incomeGap, color: "#ef4444" }
  ];

  const chartConfig = {
    cpp: { label: "CPP", color: "#3b82f6" },
    oas: { label: "OAS", color: "#10b981" },
    rrsp: { label: "RRSP/RRIF", color: "#f59e0b" },
    total: { label: "Total Income", color: "#8b5cf6" },
    savings: { label: "Projected Savings", color: "#06b6d4" }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Retirement Planning Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Retirement Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{(readinessRatio * 100).toFixed(0)}%</p>
                  <p className="text-sm text-muted-foreground">Retirement Readiness</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">${(totalRetirementSavings / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-muted-foreground">Projected Savings</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">${(totalProjectedIncome / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-muted-foreground">Annual Income</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">${(incomeGap / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-muted-foreground">Income Gap</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Retirement Planning Assumptions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Retirement Age: {retirementAge[0]}</label>
                  <Slider
                    value={retirementAge}
                    onValueChange={setRetirementAge}
                    min={55}
                    max={70}
                    step={1}
                    className="mb-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Monthly Contribution: ${monthlyContribution[0]}</label>
                  <Slider
                    value={monthlyContribution}
                    onValueChange={setMonthlyContribution}
                    min={0}
                    max={3000}
                    step={100}
                    className="mb-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Target Monthly Income: ${targetIncome[0]}</label>
                  <Slider
                    value={targetIncome}
                    onValueChange={setTargetIncome}
                    min={2000}
                    max={8000}
                    step={100}
                    className="mb-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="projections" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="projections">Income Projections</TabsTrigger>
              <TabsTrigger value="government">CPP/OAS Analysis</TabsTrigger>
              <TabsTrigger value="rrif">RRIF Schedule</TabsTrigger>
              <TabsTrigger value="requirements">Savings Requirements</TabsTrigger>
            </TabsList>

            <TabsContent value="projections" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Retirement Income Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-64">
                      <PieChart>
                        <Pie
                          data={incomeSourcesData.filter(item => item.amount > 0)}
                          dataKey="amount"
                          nameKey="source"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                        >
                          {incomeSourcesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Income Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-64">
                      <LineChart data={incomeProjectionData}>
                        <XAxis dataKey="age" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="cpp" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="oas" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="rrsp" stroke="#f59e0b" strokeWidth={2} />
                        <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={3} />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Savings Growth Projection</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-64">
                    <LineChart data={savingsProjectionData}>
                      <XAxis dataKey="age" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="savings" stroke="#06b6d4" strokeWidth={3} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="government" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">CPP/QPP Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Base CPP (at 65)</span>
                        <span className="text-sm font-medium">${projectedCPP.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Retirement Age Factor</span>
                        <span className="text-sm font-medium">{(cppAdjustmentFactor * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span className="text-sm">Adjusted CPP</span>
                        <span className="text-sm">${adjustedCPP.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      CPP can start as early as 60 (reduced by 0.6% per month) or delayed to 70 (increased by 0.7% per month)
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">OAS Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Base OAS (at 65)</span>
                        <span className="text-sm font-medium">${projectedOAS.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Deferral Factor</span>
                        <span className="text-sm font-medium">{(oasAdjustmentFactor * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span className="text-sm">Adjusted OAS</span>
                        <span className="text-sm">${adjustedOAS.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      OAS can be deferred to 70 (increased by 0.6% per month). Not available before 65.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="rrif" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">RRIF Minimum Withdrawal Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-medium">Withdrawal Rates by Age</h4>
                      <div className="space-y-1 text-sm">
                        {Object.entries(rrfWithdrawalRates).slice(0, 10).map(([age, rate]) => (
                          <div key={age} className="flex justify-between">
                            <span>Age {age}</span>
                            <span>{(rate * 100).toFixed(2)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Your Projected Withdrawals</h4>
                      <div className="space-y-1 text-sm">
                        {incomeProjectionData.slice(0, 10).map((item) => (
                          <div key={item.age} className="flex justify-between">
                            <span>Age {item.age}</span>
                            <span>${(item.rrsp * 1000).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Retirement Lump Sum Calculation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Required Annual Income</span>
                        <span className="text-sm font-medium">${annualIncomeNeed.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Government Benefits</span>
                        <span className="text-sm font-medium">${governmentBenefits.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Income Gap</span>
                        <span className="text-sm font-medium">${incomeGap.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Years in Retirement</span>
                        <span className="text-sm font-medium">{yearsInRetirement}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span className="text-sm">Required Lump Sum (PV)</span>
                        <span className="text-sm">${pvAnnuity.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Required Savings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Current Trajectory</span>
                        <span className="text-sm font-medium">${(totalRetirementSavings / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Target Savings</span>
                        <span className="text-sm font-medium">${(requiredTotalSavings / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Additional Needed</span>
                        <span className="text-sm font-medium">${(additionalSavingsNeeded / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span className="text-sm">Required Monthly Savings</span>
                        <span className="text-sm">${requiredMonthlySavings.toFixed(0)}</span>
                      </div>
                    </div>

                    {incomeGap > 0 && (
                      <div className="flex items-center space-x-1 text-orange-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Consider increasing contributions by ${(requiredMonthlySavings - monthlyContribution[0]).toFixed(0)}/month
                        </span>
                      </div>
                    )}
                    
                    {incomeGap <= 0 && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">On track for retirement goals</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
