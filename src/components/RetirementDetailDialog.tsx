import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, BarChart, Bar, Cell } from "recharts";
import { Calculator, DollarSign, TrendingUp, Calendar, PiggyBank } from "lucide-react";

interface RetirementDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RetirementDetailDialog = ({ isOpen, onClose }: RetirementDetailDialogProps) => {
  const [retirementAge, setRetirementAge] = useState([65]);
  const [monthlyIncomeNeeded, setMonthlyIncomeNeeded] = useState([4500]);
  const [currentAge, setCurrentAge] = useState([35]);
  const [inflationRate, setInflationRate] = useState([2.5]);
  const [investmentReturn, setInvestmentReturn] = useState([7]);

  const totalAssets = 330000; // Fixed value to show $330K
  const currentSavings = 145000;
  const monthlyContributions = 1200;
  
  const yearsToRetirement = retirementAge[0] - currentAge[0];
  const yearsInRetirement = 90 - retirementAge[0];
  
  const calculateProjectedRetirementValue = () => {
    let futureValue = currentSavings;
    for (let i = 0; i < yearsToRetirement; i++) {
      futureValue = futureValue * (1 + investmentReturn[0] / 100) + (monthlyContributions * 12);
    }
    return futureValue;
  };

  const projectedRetirementValue = calculateProjectedRetirementValue();

  const generateYearByYearData = () => {
    const data = [];
    let currentValue = totalAssets;
    
    for (let year = 0; year <= 30; year++) {
      const age = currentAge[0] + year;
      const isRetired = age >= retirementAge[0];
      
      if (!isRetired) {
        currentValue = currentValue * (1 + investmentReturn[0] / 100) + (monthlyContributions * 12);
      } else {
        const annualWithdrawal = monthlyIncomeNeeded[0] * 12 * Math.pow(1 + inflationRate[0] / 100, age - retirementAge[0]);
        currentValue = Math.max(0, currentValue * (1 + investmentReturn[0] / 100) - annualWithdrawal);
      }
      
      data.push({
        year: year,
        age: age,
        portfolioValue: Math.round(currentValue),
        status: isRetired ? "Retired" : "Working"
      });
    }
    return data;
  };

  const yearByYearData = generateYearByYearData();
  
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    } else {
      return `$${value.toLocaleString()}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5" />
            Retirement Planning Analysis
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="projections" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projections">Projections</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="breakdown">Year-by-Year</TabsTrigger>
          </TabsList>

          <TabsContent value="projections" className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">$330K</p>
                    <p className="text-sm text-muted-foreground">Current Assets</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(projectedRetirementValue)}</p>
                    <p className="text-sm text-muted-foreground">At Retirement</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">${monthlyIncomeNeeded[0].toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Monthly Goal</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{yearsToRetirement}</p>
                    <p className="text-sm text-muted-foreground">Years to Go</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interactive Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Retirement Assumptions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Current Age: {currentAge[0]}</label>
                      <Slider
                        value={currentAge}
                        onValueChange={setCurrentAge}
                        min={25}
                        max={60}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Retirement Age: {retirementAge[0]}</label>
                      <Slider
                        value={retirementAge}
                        onValueChange={setRetirementAge}
                        min={55}
                        max={75}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Monthly Income Needed: ${monthlyIncomeNeeded[0].toLocaleString()}</label>
                      <Slider
                        value={monthlyIncomeNeeded}
                        onValueChange={setMonthlyIncomeNeeded}
                        min={2000}
                        max={10000}
                        step={100}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Expected Investment Return: {investmentReturn[0]}%</label>
                      <Slider
                        value={investmentReturn}
                        onValueChange={setInvestmentReturn}
                        min={3}
                        max={12}
                        step={0.5}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Inflation Rate: {inflationRate[0]}%</label>
                      <Slider
                        value={inflationRate}
                        onValueChange={setInflationRate}
                        min={1}
                        max={5}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Growth Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={yearByYearData.slice(0, 15)}>
                      <XAxis 
                        dataKey="age" 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={formatCurrency}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent 
                          formatter={(value, name) => [formatCurrency(Number(value)), "Portfolio Value"]}
                          labelFormatter={(age) => `Age ${age}`}
                        />}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="portfolioValue" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-4">
            {/* Scenario Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800">Optimistic Scenario</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-green-700">Investment Return: 9%</p>
                    <p className="text-sm text-green-700">Inflation: 2%</p>
                    <p className="text-2xl font-bold text-green-800">{formatCurrency(totalAssets * Math.pow(1.09, yearsToRetirement))}</p>
                    <p className="text-sm text-green-600">At retirement</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-800">Conservative Scenario</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-red-700">Investment Return: 5%</p>
                    <p className="text-sm text-red-700">Inflation: 3%</p>
                    <p className="text-2xl font-bold text-red-800">{formatCurrency(totalAssets * Math.pow(1.05, yearsToRetirement))}</p>
                    <p className="text-sm text-red-600">At retirement</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Retirement Income Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Projected Retirement Income Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-lg font-bold text-blue-800">$1,200</p>
                    <p className="text-sm text-blue-600">CPP (monthly)</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-lg font-bold text-purple-800">$700</p>
                    <p className="text-sm text-purple-600">OAS (monthly)</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-lg font-bold text-green-800">$1,300</p>
                    <p className="text-sm text-green-600">Savings withdrawal</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-4">
            {/* Year by Year Analysis with horizontal scroll */}
            <Card>
              <CardHeader>
                <CardTitle>Year-by-Year Portfolio Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[800px]">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 min-w-[60px]">Year</th>
                        <th className="text-left p-2 min-w-[60px]">Age</th>
                        <th className="text-left p-2 min-w-[80px]">Status</th>
                        <th className="text-right p-2 min-w-[120px]">Portfolio Value</th>
                        <th className="text-right p-2 min-w-[120px]">Annual Contribution</th>
                        <th className="text-right p-2 min-w-[120px]">Annual Withdrawal</th>
                        <th className="text-right p-2 min-w-[100px]">Investment Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearByYearData.slice(0, 20).map((data, index) => {
                        const isRetired = data.status === "Retired";
                        const annualContribution = isRetired ? 0 : monthlyContributions * 12;
                        const annualWithdrawal = isRetired ? monthlyIncomeNeeded[0] * 12 * Math.pow(1 + inflationRate[0] / 100, data.age - retirementAge[0]) : 0;
                        const investmentGrowth = data.portfolioValue * (investmentReturn[0] / 100);
                        
                        return (
                          <tr key={index} className={`border-b ${isRetired ? 'bg-orange-50' : 'bg-blue-50'}`}>
                            <td className="p-2 font-medium">{data.year}</td>
                            <td className="p-2">{data.age}</td>
                            <td className="p-2">
                              <Badge variant={isRetired ? "destructive" : "default"}>
                                {data.status}
                              </Badge>
                            </td>
                            <td className="text-right p-2 font-medium">{formatCurrency(data.portfolioValue)}</td>
                            <td className="text-right p-2 text-green-600">{annualContribution > 0 ? formatCurrency(annualContribution) : '-'}</td>
                            <td className="text-right p-2 text-red-600">{annualWithdrawal > 0 ? formatCurrency(annualWithdrawal) : '-'}</td>
                            <td className="text-right p-2 text-blue-600">{formatCurrency(investmentGrowth)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Depletion Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Sustainability</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yearByYearData.slice(15, 25)}>
                      <XAxis 
                        dataKey="age" 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={formatCurrency}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent 
                          formatter={(value) => [formatCurrency(Number(value)), "Portfolio Value"]}
                          labelFormatter={(age) => `Age ${age}`}
                        />}
                      />
                      <Bar 
                        dataKey="portfolioValue" 
                        radius={[4, 4, 0, 0]}
                      >
                        {yearByYearData.slice(15, 25).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.portfolioValue > 50000 ? "#10b981" : "#ef4444"} />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
