
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Plus, Trash2, Edit, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IncomeTaxCalculator } from "./IncomeTaxCalculator";
import { useState } from "react";

interface CashFlowDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CashFlowDetailDialog = ({ isOpen, onClose }: CashFlowDetailDialogProps) => {
  const [incomeSourcesData, setIncomeSourcesData] = useState([
    { source: "Salary (Primary)", amount: 18000, percentage: 80 },
    { source: "Rental Income", amount: 2500, percentage: 11.1 },
    { source: "Dividends", amount: 1200, percentage: 5.3 },
    { source: "Side Business", amount: 800, percentage: 3.6 }
  ]);

  const [expensesData, setExpensesData] = useState([
    { category: "Housing", amount: 5200, percentage: 34.7 },
    { category: "Transportation", amount: 1800, percentage: 12 },
    { category: "Food & Dining", amount: 1500, percentage: 10 },
    { category: "Insurance", amount: 800, percentage: 5.3 },
    { category: "Utilities", amount: 650, percentage: 4.3 },
    { category: "Entertainment", amount: 600, percentage: 4 },
    { category: "Healthcare", amount: 500, percentage: 3.3 },
    { category: "Groceries", amount: 1200, percentage: 8 },
    { category: "Personal Care", amount: 300, percentage: 2 },
    { category: "Miscellaneous", amount: 450, percentage: 3 },
    { category: "Savings & Investments", amount: 2000, percentage: 13.3 }
  ]);

  const [editingIncome, setEditingIncome] = useState<number | null>(null);
  const [editingExpense, setEditingExpense] = useState<number | null>(null);
  const [newIncomeSource, setNewIncomeSource] = useState("");
  const [newIncomeAmount, setNewIncomeAmount] = useState("");
  const [newExpenseCategory, setNewExpenseCategory] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");

  const updateIncomePercentages = (data: typeof incomeSourcesData) => {
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    return data.map(item => ({
      ...item,
      percentage: total > 0 ? (item.amount / total) * 100 : 0
    }));
  };

  const updateExpensePercentages = (data: typeof expensesData) => {
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    return data.map(item => ({
      ...item,
      percentage: total > 0 ? (item.amount / total) * 100 : 0
    }));
  };

  const handleIncomeEdit = (index: number, field: 'source' | 'amount', value: string | number) => {
    const updated = [...incomeSourcesData];
    if (field === 'source') {
      updated[index].source = value as string;
    } else {
      updated[index].amount = Number(value);
    }
    setIncomeSourcesData(updateIncomePercentages(updated));
  };

  const handleExpenseEdit = (index: number, field: 'category' | 'amount', value: string | number) => {
    const updated = [...expensesData];
    if (field === 'category') {
      updated[index].category = value as string;
    } else {
      updated[index].amount = Number(value);
    }
    setExpensesData(updateExpensePercentages(updated));
  };

  const addIncomeSource = () => {
    if (newIncomeSource && newIncomeAmount) {
      const updated = [...incomeSourcesData, {
        source: newIncomeSource,
        amount: Number(newIncomeAmount),
        percentage: 0
      }];
      setIncomeSourcesData(updateIncomePercentages(updated));
      setNewIncomeSource("");
      setNewIncomeAmount("");
    }
  };

  const addExpenseCategory = () => {
    if (newExpenseCategory && newExpenseAmount) {
      const updated = [...expensesData, {
        category: newExpenseCategory,
        amount: Number(newExpenseAmount),
        percentage: 0
      }];
      setExpensesData(updateExpensePercentages(updated));
      setNewExpenseCategory("");
      setNewExpenseAmount("");
    }
  };

  const deleteIncomeSource = (index: number) => {
    const updated = incomeSourcesData.filter((_, i) => i !== index);
    setIncomeSourcesData(updateIncomePercentages(updated));
  };

  const deleteExpenseCategory = (index: number) => {
    const updated = expensesData.filter((_, i) => i !== index);
    setExpensesData(updateExpensePercentages(updated));
  };

  const totalIncome = incomeSourcesData.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expensesData.reduce((sum, item) => sum + item.amount, 0);
  const netCashFlow = totalIncome - totalExpenses;

  const incomeColors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"];
  const expenseColors = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#06b6d4", "#8b5cf6", "#ec4899", "#6366f1", "#f59e0b", "#10b981", "#64748b"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <TrendingUp className="h-6 w-6" />
            Monthly Cash Flow Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Income</p>
                    <p className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Net Cash Flow</p>
                    <p className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${netCashFlow.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Income Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Income Sources Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {incomeSourcesData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: incomeColors[index % incomeColors.length] }}
                        />
                        <div className="flex-1">
                          {editingIncome === index ? (
                            <div className="space-y-2">
                              <Input
                                value={item.source}
                                onChange={(e) => handleIncomeEdit(index, 'source', e.target.value)}
                                className="text-sm"
                              />
                              <Input
                                type="number"
                                value={item.amount}
                                onChange={(e) => handleIncomeEdit(index, 'amount', e.target.value)}
                                className="text-sm"
                              />
                            </div>
                          ) : (
                            <>
                              <p className="font-medium">{item.source}</p>
                              <p className="text-sm text-muted-foreground">{item.percentage.toFixed(1)}% of total</p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {editingIncome === index ? (
                          <Button size="sm" onClick={() => setEditingIncome(null)}>
                            <Save className="h-4 w-4" />
                          </Button>
                        ) : (
                          <>
                            <p className="font-semibold text-green-600">${item.amount.toLocaleString()}</p>
                            <Button size="sm" variant="outline" onClick={() => setEditingIncome(index)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteIncomeSource(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Add new income source */}
                  <div className="p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                    <div className="space-y-2">
                      <Input
                        placeholder="Income source name"
                        value={newIncomeSource}
                        onChange={(e) => setNewIncomeSource(e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={newIncomeAmount}
                        onChange={(e) => setNewIncomeAmount(e.target.value)}
                      />
                      <Button onClick={addIncomeSource} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Income
                      </Button>
                    </div>
                  </div>
                </div>
                
                <ChartContainer config={{}} className="h-64">
                  <PieChart>
                    <Pie
                      data={incomeSourcesData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="amount"
                      label={({ source, percentage }) => `${source}: ${percentage.toFixed(1)}%`}
                    >
                      {incomeSourcesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={incomeColors[index % incomeColors.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Expenses Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Expenses Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {expensesData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: expenseColors[index % expenseColors.length] }}
                        />
                        <div className="flex-1">
                          {editingExpense === index ? (
                            <div className="space-y-2">
                              <Input
                                value={item.category}
                                onChange={(e) => handleExpenseEdit(index, 'category', e.target.value)}
                                className="text-sm"
                              />
                              <Input
                                type="number"
                                value={item.amount}
                                onChange={(e) => handleExpenseEdit(index, 'amount', e.target.value)}
                                className="text-sm"
                              />
                            </div>
                          ) : (
                            <>
                              <p className="font-medium">{item.category}</p>
                              <p className="text-sm text-muted-foreground">{item.percentage.toFixed(1)}% of total</p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {editingExpense === index ? (
                          <Button size="sm" onClick={() => setEditingExpense(null)}>
                            <Save className="h-4 w-4" />
                          </Button>
                        ) : (
                          <>
                            <p className="font-semibold">${item.amount.toLocaleString()}</p>
                            <Button size="sm" variant="outline" onClick={() => setEditingExpense(index)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteExpenseCategory(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add new expense category */}
                  <div className="p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                    <div className="space-y-2">
                      <Input
                        placeholder="Expense category"
                        value={newExpenseCategory}
                        onChange={(e) => setNewExpenseCategory(e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={newExpenseAmount}
                        onChange={(e) => setNewExpenseAmount(e.target.value)}
                      />
                      <Button onClick={addExpenseCategory} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Expense
                      </Button>
                    </div>
                  </div>
                </div>

                <ChartContainer config={{}} className="h-80">
                  <PieChart>
                    <Pie
                      data={expensesData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="amount"
                      label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
                    >
                      {expensesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={expenseColors[index % expenseColors.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Income Tax Calculator */}
          <IncomeTaxCalculator />

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="font-medium text-green-800">Positive Cash Flow</p>
                  <p className="text-sm text-green-600">You're maintaining a healthy positive cash flow of ${netCashFlow.toLocaleString()}/month.</p>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-medium text-blue-800">Diversification Opportunity</p>
                  <p className="text-sm text-blue-600">
                    {incomeSourcesData[0].percentage}% of income comes from salary. Consider diversifying income sources.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
