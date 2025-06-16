import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { DollarSign, TrendingUp, User2, Edit, Trash2, Plus, PiggyBank } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { EditableField } from "./EditableField";
import { GrowthChart } from "./GrowthChart";

interface RetirementDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RetirementAsset {
  id: string;
  name: string;
  type: "RRSP" | "TFSA" | "Non-Registered" | "Pension" | "Annuity";
  currentValue: number;
  annualContribution: number;
  growthRate: number;
  years: number;
}

interface RetirementIncomeStream {
  id: string;
  name: string;
  type: "CPP" | "OAS" | "Company Pension" | "Personal Savings";
  monthlyAmount: number;
  startDate: string;
}

interface RetirementExpense {
  id: string;
  name: string;
  category: "Housing" | "Food" | "Healthcare" | "Travel" | "Other";
  monthlyCost: number;
}

interface RetirementGoal {
  id: string;
  name: string;
  targetAmount: number;
  deadline: string;
  priority: "High" | "Medium" | "Low";
}

interface RetirementProjection {
  year: number;
  portfolioValue: number;
  annualIncome: number;
  expenses: number;
}

const RetirementDetailDialog = ({ isOpen, onClose }: RetirementDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const [retirementAssets, setRetirementAssets] = useState<RetirementAsset[]>([
    { id: "1", name: "RRSP - Investments", type: "RRSP", currentValue: 450000, annualContribution: 12000, growthRate: 7, years: 20 },
    { id: "2", name: "TFSA - Savings", type: "TFSA", currentValue: 120000, annualContribution: 6000, growthRate: 5, years: 20 },
    { id: "3", name: "Non-Registered - Stocks", type: "Non-Registered", currentValue: 75000, annualContribution: 0, growthRate: 8, years: 20 },
  ]);

  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: "",
    type: "" as RetirementAsset["type"],
    currentValue: 0,
    annualContribution: 0,
    growthRate: 5,
    years: 20
  });

  const [retirementIncomeStreams, setRetirementIncomeStreams] = useState<RetirementIncomeStream[]>([
    { id: "1", name: "Canada Pension Plan (CPP)", type: "CPP", monthlyAmount: 1200, startDate: "2045-01-01" },
    { id: "2", name: "Old Age Security (OAS)", type: "OAS", monthlyAmount: 700, startDate: "2045-01-01" },
  ]);

  const [isAddingIncome, setIsAddingIncome] = useState(false);
  const [newIncome, setNewIncome] = useState({
    name: "",
    type: "" as RetirementIncomeStream["type"],
    monthlyAmount: 0,
    startDate: ""
  });

  const [retirementExpenses, setRetirementExpenses] = useState<RetirementExpense[]>([
    { id: "1", name: "Housing Costs", category: "Housing", monthlyCost: 2000 },
    { id: "2", name: "Food & Groceries", category: "Food", monthlyCost: 800 },
  ]);

  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    name: "",
    category: "" as RetirementExpense["category"],
    monthlyCost: 0
  });

  const [retirementGoals, setRetirementGoals] = useState<RetirementGoal[]>([
    { id: "1", name: "Travel Fund", targetAmount: 50000, deadline: "2045-01-01", priority: "High" },
    { id: "2", name: "Healthcare Costs", targetAmount: 25000, deadline: "2045-01-01", priority: "Medium" },
  ]);

  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: 0,
    deadline: "",
    priority: "" as RetirementGoal["priority"]
  });

  const [retirementProjections, setRetirementProjections] = useState<RetirementProjection[]>([
    { year: 2025, portfolioValue: 575000, annualIncome: 0, expenses: 30000 },
    { year: 2030, portfolioValue: 850000, annualIncome: 0, expenses: 36000 },
    { year: 2035, portfolioValue: 1200000, annualIncome: 0, expenses: 42000 },
    { year: 2040, portfolioValue: 1650000, annualIncome: 50000, expenses: 48000 },
    { year: 2045, portfolioValue: 2200000, annualIncome: 80000, expenses: 54000 },
  ]);

  const addRetirementAsset = () => {
    if (newAsset.name && newAsset.type && newAsset.currentValue >= 0) {
      const asset: RetirementAsset = {
        id: Date.now().toString(),
        ...newAsset
      };
      setRetirementAssets([...retirementAssets, asset]);
      setNewAsset({
        name: "",
        type: "" as RetirementAsset["type"],
        currentValue: 0,
        annualContribution: 0,
        growthRate: 5,
        years: 20
      });
      setIsAddingAsset(false);
    }
  };

  const deleteRetirementAsset = (id: string) => {
    setRetirementAssets(retirementAssets.filter(asset => asset.id !== id));
  };

  const addRetirementIncome = () => {
    if (newIncome.name && newIncome.type && newIncome.monthlyAmount > 0 && newIncome.startDate) {
      const income: RetirementIncomeStream = {
        id: Date.now().toString(),
        ...newIncome
      };
      setRetirementIncomeStreams([...retirementIncomeStreams, income]);
      setNewIncome({
        name: "",
        type: "" as RetirementIncomeStream["type"],
        monthlyAmount: 0,
        startDate: ""
      });
      setIsAddingIncome(false);
    }
  };

  const deleteRetirementIncome = (id: string) => {
    setRetirementIncomeStreams(retirementIncomeStreams.filter(income => income.id !== id));
  };

  const addRetirementExpense = () => {
    if (newExpense.name && newExpense.category && newExpense.monthlyCost > 0) {
      const expense: RetirementExpense = {
        id: Date.now().toString(),
        ...newExpense
      };
      setRetirementExpenses([...retirementExpenses, expense]);
      setNewExpense({
        name: "",
        category: "" as RetirementExpense["category"],
        monthlyCost: 0
      });
      setIsAddingExpense(false);
    }
  };

  const deleteRetirementExpense = (id: string) => {
    setRetirementExpenses(retirementExpenses.filter(expense => expense.id !== id));
  };

  const addRetirementGoal = () => {
    if (newGoal.name && newGoal.targetAmount > 0 && newGoal.deadline && newGoal.priority) {
      const goal: RetirementGoal = {
        id: Date.now().toString(),
        ...newGoal
      };
      setRetirementGoals([...retirementGoals, goal]);
      setNewGoal({
        name: "",
        targetAmount: 0,
        deadline: "",
        priority: "" as RetirementGoal["priority"]
      });
      setIsAddingGoal(false);
    }
  };

  const deleteRetirementGoal = (id: string) => {
    setRetirementGoals(retirementGoals.filter(goal => goal.id !== id));
  };

  const calculateFutureValue = (currentValue: number, annualContribution: number, growthRate: number, years: number) => {
    const futureValue = currentValue * Math.pow(1 + (growthRate / 100), years) +
      annualContribution * ((Math.pow(1 + (growthRate / 100), years) - 1) / (growthRate / 100));
    return futureValue;
  };

  const generateAssetChartData = (asset: RetirementAsset) => {
    const data = [];
    for (let i = 0; i <= asset.years; i++) {
      const futureValue = calculateFutureValue(asset.currentValue, asset.annualContribution, asset.growthRate, i);
      data.push({
        year: new Date().getFullYear() + i,
        value: futureValue
      });
    }
    return data;
  };

  const getAssetTypeColor = (type: string) => {
    const colors = {
      "RRSP": "#8b5cf6",
      "TFSA": "#06b6d4",
      "Non-Registered": "#10b981",
      "Pension": "#f59e0b",
      "Annuity": "#ef4444"
    };
    return colors[type as keyof typeof colors] || "#6b7280";
  };

  const formatLargeNumber = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 0)}K`;
    }
    return value.toString();
  };

  const chartConfig = {
    portfolioValue: { label: "Portfolio Value", color: "#8b5cf6" },
    annualIncome: { label: "Annual Income", color: "#06b6d4" },
    expenses: { label: "Expenses", color: "#10b981" },
  };

  const updateRetirementAsset = (id: string, field: string, value: any) => {
    setRetirementAssets(retirementAssets.map(asset => 
      asset.id === id ? { ...asset, [field]: typeof value === 'string' ? parseFloat(value) || 0 : value } : asset
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 text-2xl">
            <div className="p-2 bg-orange-100 rounded-lg">
              <PiggyBank className="h-6 w-6 text-orange-600" />
            </div>
            <span>Retirement Planning Details</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assets">Retirement Assets</TabsTrigger>
            <TabsTrigger value="income">Income Streams</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Retirement Portfolio Projection</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-64">
                    <AreaChart data={retirementProjections}>
                      <defs>
                        <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                      <ChartTooltip content={<ChartTooltipContent formatter={(value) => [`$${value.toLocaleString()}`, "Portfolio Value"]} />} />
                      <Area type="monotone" dataKey="portfolioValue" stroke="#8b5cf6" fill="url(#portfolioGradient)" />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <span>Retirement Income vs Expenses</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-64">
                    <AreaChart data={retirementProjections}>
                      <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="annualIncome" stroke="#06b6d4" fill="url(#incomeGradient)" />
                      <Area type="monotone" dataKey="expenses" stroke="#10b981" fill="url(#expensesGradient)" />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <PiggyBank className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Retirement Assets</h2>
                    <p className="text-sm text-muted-foreground">Manage your retirement investment portfolio</p>
                  </div>
                </div>
                <Button onClick={() => setIsAddingAsset(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Asset
                </Button>
              </div>

              {retirementAssets.map((asset) => {
                const futureValue = calculateFutureValue(asset.currentValue, asset.annualContribution, asset.growthRate, asset.years);
                const chartData = generateAssetChartData(asset);
                
                return (
                  <Card key={asset.id} className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: getAssetTypeColor(asset.type) }}
                          />
                          <div>
                            <CardTitle className="text-lg">{asset.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{asset.type}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRetirementAsset(asset.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm text-muted-foreground">Current Value</Label>
                              <Input
                                type="number"
                                value={asset.currentValue}
                                onChange={(e) => updateRetirementAsset(asset.id, 'currentValue', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label className="text-sm text-muted-foreground">Annual Contribution</Label>
                              <Input
                                type="number"
                                value={asset.annualContribution}
                                onChange={(e) => updateRetirementAsset(asset.id, 'annualContribution', e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm text-muted-foreground">
                                Growth Rate: {asset.growthRate}%
                              </Label>
                              <Slider
                                value={[asset.growthRate]}
                                onValueChange={(value) => updateRetirementAsset(asset.id, 'growthRate', value[0])}
                                max={15}
                                min={0}
                                step={0.5}
                                className="mt-2"
                              />
                            </div>
                            <div>
                              <Label className="text-sm text-muted-foreground">
                                Years to Retirement: {asset.years}
                              </Label>
                              <Slider
                                value={[asset.years]}
                                onValueChange={(value) => updateRetirementAsset(asset.id, 'years', value[0])}
                                max={40}
                                min={1}
                                step={1}
                                className="mt-2"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <EditableField
                              fieldId={`current-${asset.id}`}
                              value={asset.currentValue}
                              label="Current Value"
                              prefix="$"
                            />
                            <EditableField
                              fieldId={`future-${asset.id}`}
                              value={futureValue}
                              label={`Future Value (${asset.years}y)`}
                              prefix="$"
                            />
                          </div>
                        </div>

                        <div>
                          <GrowthChart
                            data={chartData}
                            title={`${asset.name} Growth Projection`}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {isAddingAsset && (
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Retirement Asset</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Asset Name</Label>
                        <Input
                          placeholder="e.g., RRSP - Investments"
                          value={newAsset.name}
                          onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Asset Type</Label>
                        <Select 
                          value={newAsset.type} 
                          onValueChange={(value: RetirementAsset["type"]) => 
                            setNewAsset({...newAsset, type: value})
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select asset type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="RRSP">RRSP</SelectItem>
                            <SelectItem value="TFSA">TFSA</SelectItem>
                            <SelectItem value="Non-Registered">Non-Registered</SelectItem>
                            <SelectItem value="Pension">Pension</SelectItem>
                            <SelectItem value="Annuity">Annuity</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Current Value</Label>
                        <Input
                          type="number"
                          placeholder="Current market value"
                          value={newAsset.currentValue || ""}
                          onChange={(e) => setNewAsset({...newAsset, currentValue: Number(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Annual Contribution</Label>
                        <Input
                          type="number"
                          placeholder="Annual contribution amount"
                          value={newAsset.annualContribution || ""}
                          onChange={(e) => setNewAsset({...newAsset, annualContribution: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button onClick={addRetirementAsset}>Add Asset</Button>
                      <Button variant="outline" onClick={() => setIsAddingAsset(false)}>Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="income" className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Retirement Income Streams</h2>
                    <p className="text-sm text-muted-foreground">Manage your retirement income sources</p>
                  </div>
                </div>
                <Button onClick={() => setIsAddingIncome(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Income
                </Button>
              </div>

              {retirementIncomeStreams.map((income) => (
                <Card key={income.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full bg-green-400" />
                        <div>
                          <CardTitle className="text-lg">{income.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{income.type}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRetirementIncome(income.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Monthly Amount</Label>
                        <Input
                          type="number"
                          value={income.monthlyAmount}
                          onChange={(e) => setRetirementIncomeStreams(retirementIncomeStreams.map(i => 
                            i.id === income.id ? {...i, monthlyAmount: Number(e.target.value)} : i
                          ))}
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Start Date</Label>
                        <Input
                          type="date"
                          value={income.startDate}
                          onChange={(e) => setRetirementIncomeStreams(retirementIncomeStreams.map(i => 
                            i.id === income.id ? {...i, startDate: e.target.value} : i
                          ))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {isAddingIncome && (
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Retirement Income Stream</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Income Name</Label>
                        <Input
                          placeholder="e.g., Canada Pension Plan"
                          value={newIncome.name}
                          onChange={(e) => setNewIncome({...newIncome, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Income Type</Label>
                        <Select 
                          value={newIncome.type} 
                          onValueChange={(value: RetirementIncomeStream["type"]) => 
                            setNewIncome({...newIncome, type: value})
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select income type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CPP">CPP</SelectItem>
                            <SelectItem value="OAS">OAS</SelectItem>
                            <SelectItem value="Company Pension">Company Pension</SelectItem>
                            <SelectItem value="Personal Savings">Personal Savings</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Monthly Amount</Label>
                        <Input
                          type="number"
                          placeholder="Monthly income amount"
                          value={newIncome.monthlyAmount || ""}
                          onChange={(e) => setNewIncome({...newIncome, monthlyAmount: Number(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Start Date</Label>
                        <Input
                          type="date"
                          value={newIncome.startDate}
                          onChange={(e) => setNewIncome({...newIncome, startDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button onClick={addRetirementIncome}>Add Income</Button>
                      <Button variant="outline" onClick={() => setIsAddingIncome(false)}>Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            Schedule Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RetirementDetailDialog;
