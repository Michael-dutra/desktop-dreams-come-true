import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import { PiggyBank } from "lucide-react";

interface RetirementDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChartData {
  age: number;
  income: number;
  needs: number;
}

interface ChartConfig {
  [key: string]: { label: string; color: string };
}

export const RetirementDetailDialog = ({ isOpen, onClose }: RetirementDetailDialogProps) => {
  const [retirementAge, setRetirementAge] = useState([65]);
  const [netMonthlyIncomeNeeded, setNetMonthlyIncomeNeeded] = useState([4500]);
  const [currentSavings, setCurrentSavings] = useState([90000]);
  const [monthlyContribution, setMonthlyContribution] = useState([500]);
  const [rateOfReturn, setRateOfReturn] = useState([5]);

  const lifeExpectancy = 90;
  const yearsInRetirement = lifeExpectancy - retirementAge[0];

  const calculateFutureSavings = () => {
    let futureValue = currentSavings[0];
    for (let i = 0; i < retirementAge[0] - 25; i++) {
      futureValue = futureValue * (1 + rateOfReturn[0] / 100) + (monthlyContribution[0] * 12);
    }
    return futureValue;
  };

  const futureSavings = calculateFutureSavings();
  const totalRetirementNeeded = netMonthlyIncomeNeeded[0] * 12 * yearsInRetirement;
  const savingsPercentage = Math.min(100, (futureSavings / totalRetirementNeeded) * 100);

  const calculateMonthlyIncomeFromSavings = () => {
    const safeWithdrawalRate = 0.04; // 4% rule
    return (futureSavings * safeWithdrawalRate) / 12;
  };

  const monthlyIncomeFromSavings = calculateMonthlyIncomeFromSavings();
  const cpp = 1200;
  const oas = 700;
  const totalMonthlyIncome = monthlyIncomeFromSavings + cpp + oas;

  const chartData: ChartData[] = [];
  for (let age = retirementAge[0]; age <= lifeExpectancy; age++) {
    chartData.push({
      age: age,
      income: totalMonthlyIncome,
      needs: netMonthlyIncomeNeeded[0],
    });
  }

  const chartConfig: ChartConfig = {
    income: { label: "Total Income", color: "#8884d8" },
    needs: { label: "Income Needed", color: "#82ca9d" },
  };

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5" />
            Retirement Planning Details
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="income">Income Sources</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Retirement Age</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{retirementAge[0]} years</p>
                  <Slider
                    value={retirementAge}
                    onValueChange={setRetirementAge}
                    min={55}
                    max={75}
                    step={1}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Life Expectancy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{lifeExpectancy} years</p>
                  <p className="text-sm text-muted-foreground">
                    Years in Retirement: {yearsInRetirement}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Income Needed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {formatCurrency(netMonthlyIncomeNeeded[0] * 12)} / year
                </p>
                <Slider
                  value={netMonthlyIncomeNeeded}
                  onValueChange={setNetMonthlyIncomeNeeded}
                  min={2000}
                  max={8000}
                  step={100}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="savings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{formatCurrency(currentSavings[0])}</p>
                  <Slider
                    value={currentSavings}
                    onValueChange={setCurrentSavings}
                    min={0}
                    max={500000}
                    step={1000}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Contribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{formatCurrency(monthlyContribution[0])}</p>
                  <Slider
                    value={monthlyContribution}
                    onValueChange={setMonthlyContribution}
                    min={0}
                    max={2000}
                    step={50}
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Rate of Return</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{rateOfReturn[0]}%</p>
                <Slider
                  value={rateOfReturn}
                  onValueChange={setRateOfReturn}
                  min={0}
                  max={15}
                  step={0.5}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Future Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(futureSavings)}</p>
                <p className="text-sm text-muted-foreground">
                  Based on current savings, monthly contributions, and rate of return.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="income" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Income Sources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>CPP</Label>
                  <Input type="text" value={formatCurrency(cpp)} disabled />
                </div>
                <div>
                  <Label>OAS</Label>
                  <Input type="text" value={formatCurrency(oas)} disabled />
                </div>
                <div>
                  <Label>Savings</Label>
                  <Input type="text" value={formatCurrency(monthlyIncomeFromSavings)} disabled />
                </div>
                <div>
                  <Label>Total Monthly Income</Label>
                  <Input type="text" value={formatCurrency(totalMonthlyIncome)} disabled />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Retirement Projections</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Retirement Age: {retirementAge[0]}
                  <br />
                  Life Expectancy: {lifeExpectancy}
                  <br />
                  Years in Retirement: {yearsInRetirement}
                  <br />
                  Total Retirement Needed: {formatCurrency(totalRetirementNeeded)}
                  <br />
                  Future Savings: {formatCurrency(futureSavings)}
                  <br />
                  Savings Percentage: {savingsPercentage.toFixed(2)}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Retirement Income vs. Needs</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="age" />
                      <YAxis tickFormatter={(value) => {
                        if (typeof value === 'number') {
                          return `$${Math.round(value / 1000)}K`;
                        }
                        return String(value);
                      }} />
                      <ChartTooltip 
                        content={<ChartTooltipContent 
                          formatter={(value) => {
                            if (typeof value === 'number') {
                              return [`$${Math.round(value).toLocaleString()}`, "Amount"];
                            }
                            return [String(value), "Amount"];
                          }}
                        />}
                      />
                      <Bar dataKey="income" fill="#8884d8" name="Total Income" />
                      <Bar dataKey="needs" fill="#82ca9d" name="Income Needed" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Action Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  <li>Increase monthly contributions</li>
                  <li>Consider delaying retirement</li>
                  <li>Reduce monthly expenses</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
