
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp, TrendingDown, DollarSign, Check } from "lucide-react";

interface CashFlowReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  incomeSourcesData: Array<{ source: string; amount: number; percentage: number; }>;
  expensesData: Array<{ category: string; amount: number; percentage: number; }>;
  debtToIncomeRatio: number;
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
}

export const CashFlowReportDialog = ({ 
  isOpen, 
  onClose, 
  incomeSourcesData, 
  expensesData, 
  debtToIncomeRatio,
  totalIncome,
  totalExpenses,
  netCashFlow
}: CashFlowReportDialogProps) => {
  const getRatioBracket = (ratio: number) => {
    if (ratio <= 20) return { range: "0-20%", status: "Excellent", color: "text-green-600" };
    if (ratio <= 35) return { range: "21-35%", status: "Good", color: "text-green-600" };
    if (ratio <= 49) return { range: "36-49%", status: "Fair", color: "text-orange-500" };
    return { range: "50%+", status: "Poor", color: "text-red-500" };
  };

  const currentBracket = getRatioBracket(debtToIncomeRatio);
  const savingsRate = ((netCashFlow / totalIncome) * 100);
  const monthlyDebtPayments = 3500;

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  const allBrackets = [
    { range: "0-20%", status: "Excellent", color: "text-green-600" },
    { range: "21-35%", status: "Good", color: "text-green-600" },
    { range: "36-49%", status: "Fair", color: "text-orange-500" },
    { range: "50%+", status: "Poor", color: "text-red-500" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FileText className="h-6 w-6" />
            Cash Flow Analysis Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 prose max-w-none">
          {/* Executive Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                This comprehensive cash flow analysis provides insights into your current financial position, 
                debt management, and spending patterns. Your financial health is assessed across multiple 
                dimensions to provide actionable recommendations.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 not-prose">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Income</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-lg font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Net Cash Flow</p>
                  <p className={`text-lg font-bold ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(netCashFlow)}
                  </p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Savings Rate</p>
                  <p className="text-lg font-bold text-blue-600">{savingsRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Debt-to-Income Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Debt-to-Net Income Ratio Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                currentBracket.status === 'Excellent' || currentBracket.status === 'Good' 
                  ? 'bg-green-50 border-green-200' 
                  : currentBracket.status === 'Fair' 
                  ? 'bg-orange-50 border-orange-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <h4 className={`font-semibold mb-2 ${
                  currentBracket.status === 'Excellent' || currentBracket.status === 'Good' 
                    ? 'text-green-900' 
                    : currentBracket.status === 'Fair' 
                    ? 'text-orange-900' 
                    : 'text-red-900'
                }`}>
                  {currentBracket.status} Debt Management Status
                </h4>
                <p className="mb-3">
                  Your current debt-to-income ratio is <strong>{debtToIncomeRatio.toFixed(1)}%</strong>, 
                  which falls within the <strong>{currentBracket.range}</strong> range, 
                  indicating <strong>{currentBracket.status.toLowerCase()}</strong> debt management.
                </p>
              </div>

              <p>
                <strong>Analysis:</strong> Your monthly debt payments of {formatCurrency(monthlyDebtPayments)} 
                represent {debtToIncomeRatio.toFixed(1)}% of your total monthly income of {formatCurrency(totalIncome)}. 
                {currentBracket.status === 'Excellent' || currentBracket.status === 'Good' 
                  ? ' This is well within recommended guidelines and indicates strong financial discipline.' 
                  : currentBracket.status === 'Fair'
                  ? ' While manageable, there is room for improvement in debt reduction strategies.'
                  : ' This level requires immediate attention and debt reduction strategies.'}
              </p>

              <div className="not-prose">
                <h5 className="font-medium mb-2">Industry Benchmarks:</h5>
                <ul className="space-y-1 text-sm">
                  {allBrackets.map((bracket) => (
                    <li key={bracket.range} className="flex items-center gap-2">
                      {bracket.range === currentBracket.range && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                      <span className="flex-1">
                        <strong>{bracket.status} ({bracket.range}):</strong> 
                        {bracket.status === 'Excellent' && ' Exceptional debt management'}
                        {bracket.status === 'Good' && ' Healthy debt levels, within recommended range'}
                        {bracket.status === 'Fair' && ' Moderate risk, consider debt reduction'}
                        {bracket.status === 'Poor' && ' High risk, immediate action required'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Income Sources Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Income Sources Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Your total monthly income of {formatCurrency(totalIncome)} is derived from {incomeSourcesData.length} 
                different sources, providing {incomeSourcesData.length > 1 ? 'some diversification' : 'limited diversification'} 
                in your income streams.
              </p>

              <div className="not-prose space-y-3">
                {incomeSourcesData.map((source, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{source.source}</p>
                      <p className="text-sm text-muted-foreground">
                        {source.percentage.toFixed(1)}% of total income
                      </p>
                    </div>
                    <p className="font-semibold text-green-600">{formatCurrency(source.amount)}</p>
                  </div>
                ))}
              </div>

              <p>
                <strong>Income Diversification Assessment:</strong> 
                {incomeSourcesData[0]?.percentage > 80 
                  ? ` Your primary income source represents ${incomeSourcesData[0].percentage.toFixed(1)}% of total income, indicating high dependency on a single source. Consider developing additional income streams to reduce financial risk.`
                  : incomeSourcesData[0]?.percentage > 60
                  ? ` Your primary income source represents ${incomeSourcesData[0].percentage.toFixed(1)}% of total income, showing moderate diversification. This is generally acceptable but additional income sources could provide more security.`
                  : ` Your income is well-diversified across multiple sources, which provides good financial stability and reduces dependency risk.`}
              </p>
            </CardContent>
          </Card>

          {/* Expenses Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Expenses Breakdown Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Your monthly expenses total {formatCurrency(totalExpenses)}, distributed across {expensesData.length} 
                categories. This represents {((totalExpenses / totalIncome) * 100).toFixed(1)}% of your total income.
              </p>

              <div className="not-prose space-y-2">
                {expensesData.sort((a, b) => b.amount - a.amount).map((expense, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                    <div>
                      <span className="font-medium">{expense.category}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({expense.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <span className="font-semibold">{formatCurrency(expense.amount)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h5 className="font-medium">Expense Category Analysis:</h5>
                {expensesData.find(e => e.category.toLowerCase().includes('housing')) && (
                  <p>
                    <strong>Housing:</strong> Housing costs represent{' '}
                    {expensesData.find(e => e.category.toLowerCase().includes('housing'))?.percentage.toFixed(1)}% 
                    of your total expenses. The recommended guideline is to keep housing below 30% of gross income.
                  </p>
                )}
                
                {expensesData.find(e => e.category.toLowerCase().includes('savings') || e.category.toLowerCase().includes('investment')) && (
                  <p>
                    <strong>Savings & Investments:</strong> You're allocating{' '}
                    {expensesData.find(e => e.category.toLowerCase().includes('savings') || e.category.toLowerCase().includes('investment'))?.percentage.toFixed(1)}% 
                    of your expenses toward savings and investments, which demonstrates good financial planning.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Key Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-4">
                <div className={`p-3 border rounded-lg ${
                  netCashFlow > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <h5 className={`font-medium ${netCashFlow > 0 ? 'text-green-800' : 'text-red-800'}`}>
                    Cash Flow Management
                  </h5>
                  <p className={`text-sm ${netCashFlow > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {netCashFlow > 0 
                      ? `Maintain your positive cash flow of ${formatCurrency(netCashFlow)}/month. Consider increasing investments or emergency fund contributions.`
                      : `Address negative cash flow of ${formatCurrency(Math.abs(netCashFlow))}/month by reducing expenses or increasing income.`}
                  </p>
                </div>

                <div className={`p-3 border rounded-lg ${
                  currentBracket.status === 'Excellent' || currentBracket.status === 'Good' 
                    ? 'bg-green-50 border-green-200' 
                    : currentBracket.status === 'Fair' 
                    ? 'bg-orange-50 border-orange-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <h5 className={`font-medium ${
                    currentBracket.status === 'Excellent' || currentBracket.status === 'Good' 
                      ? 'text-green-800' 
                      : currentBracket.status === 'Fair' 
                      ? 'text-orange-800' 
                      : 'text-red-800'
                  }`}>
                    Debt Management
                  </h5>
                  <p className={`text-sm ${
                    currentBracket.status === 'Excellent' || currentBracket.status === 'Good' 
                      ? 'text-green-600' 
                      : currentBracket.status === 'Fair' 
                      ? 'text-orange-600' 
                      : 'text-red-600'
                  }`}>
                    {currentBracket.status === 'Excellent' || currentBracket.status === 'Good' 
                      ? 'Your debt management is excellent. Continue current practices and consider optimizing investment strategies.'
                      : currentBracket.status === 'Fair'
                      ? 'Focus on debt reduction strategies such as debt consolidation or aggressive paydown of high-interest debt.'
                      : 'Immediate debt reduction required. Consider debt counseling, refinancing, or income enhancement strategies.'}
                  </p>
                </div>

                {incomeSourcesData[0]?.percentage > 70 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-800">Income Diversification</h5>
                    <p className="text-sm text-blue-600">
                      Consider developing additional income streams to reduce dependency on your primary source. 
                      Options include side businesses, investments, or skill development for career advancement.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
