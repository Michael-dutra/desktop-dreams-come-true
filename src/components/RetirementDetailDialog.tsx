import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, PiggyBank, DollarSign, Calendar, Target, Calculator } from "lucide-react";

interface RetirementDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const RetirementDetailDialog = ({ isOpen, onClose }: RetirementDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Retirement projection data
  const currentAge = 45;
  const retirementAge = 65;
  const currentSavings = 90000;
  const monthlyContribution = 1200;
  const expectedReturn = 0.07;
  const yearsToRetirement = retirementAge - currentAge;
  
  // Calculate projected retirement savings
  const futureValue = currentSavings * Math.pow(1 + expectedReturn, yearsToRetirement) + 
    monthlyContribution * 12 * (Math.pow(1 + expectedReturn, yearsToRetirement) - 1) / expectedReturn;

  // Retirement income sources
  const retirementIncomeData = [
    { name: 'CPP', value: 800, color: '#8884d8' },
    { name: 'OAS', value: 700, color: '#82ca9d' },
    { name: 'Savings', value: 1700, color: '#ffc658' },
  ];

  // Savings growth projection
  const savingsGrowthData = Array.from({ length: yearsToRetirement + 1 }, (_, i) => {
    const year = currentAge + i;
    const savings = currentSavings * Math.pow(1 + expectedReturn, i) + 
      monthlyContribution * 12 * (i > 0 ? (Math.pow(1 + expectedReturn, i) - 1) / expectedReturn : 0);
    return {
      age: year,
      savings: Math.round(savings)
    };
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <PiggyBank className="h-8 w-8 text-purple-600" />
            Retirement Planning Details
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projections">Growth Projections</TabsTrigger>
            <TabsTrigger value="income">Income Sources</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Savings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${currentSavings.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Across all accounts</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Contributions</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${monthlyContribution.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Employer + personal</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Projected at 65</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${Math.round(futureValue).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">7% annual return</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Retirement Readiness Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Projected Monthly Income</span>
                    <span className="font-semibold">$3,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Monthly Needs</span>
                    <span className="font-semibold">$4,500</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Monthly Shortfall</span>
                    <span className="font-semibold">-$1,300</span>
                  </div>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-orange-800 font-medium">Action Required</p>
                  <p className="text-orange-700 text-sm">Consider increasing contributions or delaying retirement to meet your income goals.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Savings Growth Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={savingsGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" />
                      <YAxis 
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                      />
                      <Tooltip 
                        formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Savings']}
                        labelFormatter={(label) => `Age ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="savings" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={{ fill: '#8884d8' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="income" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Projected Monthly Income Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={retirementIncomeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {retirementIncomeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => `$${Math.round(Number(v)).toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Income Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {retirementIncomeData.map((source) => (
                    <div key={source.name} className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: source.color }}
                        />
                        <span>{source.name}</span>
                      </div>
                      <span className="font-semibold">${source.value}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-4">
                    <div className="flex justify-between items-center font-bold">
                      <span>Total Monthly Income</span>
                      <span>${retirementIncomeData.reduce((sum, source) => sum + source.value, 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="strategies" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Contribution Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">To close the $1,300 monthly gap:</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Increase monthly contributions by $400</li>
                      <li>• Delay retirement by 2-3 years</li>
                      <li>• Reduce retirement expenses by 30%</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Growth Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Maximize investment returns:</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Maximize RRSP contributions</li>
                      <li>• Utilize TFSA for tax-free growth</li>
                      <li>• Consider balanced portfolio allocation</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RetirementDetailDialog;
