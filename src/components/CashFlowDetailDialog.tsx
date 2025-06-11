
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Calendar, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CashFlowDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CashFlowDetailDialog = ({ isOpen, onClose }: CashFlowDetailDialogProps) => {
  const incomeSourcesData = [
    { source: "Salary (Primary)", amount: 18000, percentage: 80 },
    { source: "Rental Income", amount: 2500, percentage: 11.1 },
    { source: "Dividends", amount: 1200, percentage: 5.3 },
    { source: "Side Business", amount: 800, percentage: 3.6 }
  ];

  const expensesData = [
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
  ];

  const cashFlowTrend = [
    { month: "Jan", income: 22500, expenses: 15000, netFlow: 7500 },
    { month: "Feb", income: 22500, expenses: 15200, netFlow: 7300 },
    { month: "Mar", income: 23000, expenses: 15500, netFlow: 7500 },
    { month: "Apr", income: 23000, expenses: 15800, netFlow: 7200 },
    { month: "May", income: 23500, expenses: 16000, netFlow: 7500 },
    { month: "Jun", income: 22500, expenses: 15000, netFlow: 7500 }
  ];

  const totalIncome = incomeSourcesData.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expensesData.reduce((sum, item) => sum + item.amount, 0);
  const netCashFlow = totalIncome - totalExpenses;
  const emergencyFundCoverage = 45000 / totalExpenses; // Assuming $45,000 in emergency fund

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Emergency Fund</p>
                    <p className="text-2xl font-bold text-blue-600">{emergencyFundCoverage.toFixed(1)} months</p>
                    <Badge variant={emergencyFundCoverage >= 6 ? "default" : "destructive"} className="mt-1">
                      {emergencyFundCoverage >= 6 ? "Adequate" : "Needs Attention"}
                    </Badge>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-500" />
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
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: incomeColors[index % incomeColors.length] }}
                        />
                        <div>
                          <p className="font-medium">{item.source}</p>
                          <p className="text-sm text-muted-foreground">{item.percentage}% of total</p>
                        </div>
                      </div>
                      <p className="font-semibold text-green-600">${item.amount.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <ChartContainer config={{}} className="h-64">
                  <PieChart>
                    <Pie
                      data={incomeSourcesData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="amount"
                      label={({ source, percentage }) => `${source}: ${percentage}%`}
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
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: expenseColors[index % expenseColors.length] }}
                        />
                        <div>
                          <p className="font-medium">{item.category}</p>
                          <p className="text-sm text-muted-foreground">{item.percentage}% of total</p>
                        </div>
                      </div>
                      <p className="font-semibold">${item.amount.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <ChartContainer config={{}} className="h-80">
                  <BarChart data={expensesData} layout="horizontal">
                    <XAxis type="number" />
                    <YAxis dataKey="category" type="category" width={100} tick={{ fontSize: 10 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="amount" fill="#ef4444" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Cash Flow Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                6-Month Cash Flow Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-64">
                <LineChart data={cashFlowTrend}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Income"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    name="Expenses"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="netFlow" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Net Flow"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

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
                
                {emergencyFundCoverage < 6 && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="font-medium text-orange-800">Emergency Fund Gap</p>
                    <p className="text-sm text-orange-600">
                      Your emergency fund covers {emergencyFundCoverage.toFixed(1)} months. Consider building it to 6+ months of expenses.
                    </p>
                  </div>
                )}

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
