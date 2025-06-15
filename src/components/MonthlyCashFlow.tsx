import { TrendingUp, TrendingDown, DollarSign, Eye, PiggyBank, Zap, Shield, Target, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { CashFlowDetailDialog } from "./CashFlowDetailDialog";
import { useState } from "react";
import { Bot } from "lucide-react";
import { SectionAIDialog } from "./SectionAIDialog";

const MonthlyCashFlow = () => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [aiDialogOpen, setAIDialogOpen] = useState(false);
  
  // Emergency Fund Calculator state
  const [currentEmergencyFund, setCurrentEmergencyFund] = useState([18000]);
  const [essentialMonthlyExpenses, setEssentialMonthlyExpenses] = useState([4500]);
  const [targetMonthsCoverage, setTargetMonthsCoverage] = useState([6]);

  // Calculate emergency fund metrics
  const currentFund = currentEmergencyFund[0];
  const monthlyExpenses = essentialMonthlyExpenses[0];
  const targetMonths = targetMonthsCoverage[0];
  
  const monthsCovered = monthlyExpenses > 0 ? currentFund / monthlyExpenses : 0;
  const targetAmount = monthlyExpenses * targetMonths;
  const shortfall = Math.max(0, targetAmount - currentFund);
  const progressPercentage = targetAmount > 0 ? Math.min(100, (currentFund / targetAmount) * 100) : 0;

  // Calculate progress bar color (red at 0% to green at 100%)
  const getProgressBarColor = (percentage: number) => {
    const normalizedProgress = Math.min(100, Math.max(0, percentage)) / 100;
    const red = Math.round(255 * (1 - normalizedProgress));
    const green = Math.round(255 * normalizedProgress);
    return `rgb(${red}, ${green}, 0)`;
  };

  // Enhanced AI Analysis for Cash Flow
  const generateAIAnalysis = () => {
    let text = `Cash Flow & Emergency Planning – Personalized Analysis:\n\n`;

    text += `🟢 **Income:** $22,500/mo\n🔴 **Expenses:** $15,000/mo\n🟦 **Net Flow:** +$7,500/mo\n\n`;
    text += `Your strong positive monthly cash flow means you're well-positioned to save, invest, or pay down debt faster. Congrats on disciplined spending!\n\n`;

    text += `🔰 **Emergency Fund Evaluation:**\n`;
    text += `  - Current Emergency Fund: $${(currentFund / 1000).toFixed(1)}K  – covers approximately ${monthsCovered.toFixed(1)} months of essential expenses.\n`;
    text += `  - Target: ${targetMonths} months coverage ($${(targetAmount / 1000).toFixed(1)}K needed).\n`;
    text += `  - Shortfall: $${(shortfall / 1000).toFixed(1)}K\n`;
    if (monthsCovered >= targetMonths) {
      text += `✅ You have reached your emergency fund target! This strong position provides security if you face job loss, medical events, or major life changes. Maintain this cushion as your expenses evolve.\n`;
    } else if (monthsCovered >= targetMonths * 0.5) {
      text += `⚠️ You're over halfway to your goal. Prioritizing a bit more savings will get you to full coverage soon, granting you even more peace of mind.\n`;
    } else {
      text += `❗ Building your emergency fund should be a top priority. Setting up an automatic monthly transfer can help you reach your goal faster.\n`;
    }

    text += `\n🔎 **Advisor's Tip:** A fully funded emergency reserve is the foundation for wealth-building. Once your safety net is set, consider increasing retirement contributions or investing excess cash for long-term growth.\n`;

    text += `\n📈 As your financial circumstances change (income boost, expense changes, milestones), revisit your cash flow plan and adjust targets as needed. You're on a great path – keep up the momentum!`;

    return text;
  };

  return (
    <>
      <Card className="relative overflow-hidden h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <span>Cash Flow</span>
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDetailDialog(true)}
              className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
            >
              <Eye className="w-4 h-4" />
              Details
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center border-indigo-600 text-indigo-700 hover:bg-indigo-50 px-3 rounded-lg shadow-sm"
              onClick={() => setAIDialogOpen(true)}
              style={{ border: '2px solid #6366f1' }}
            >
              <Bot className="w-4 h-4 mr-1 text-indigo-600" />
              AI
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          {/* Income, Expenses, and Net Cash Flow in one row */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-800">Income</span>
              </div>
              <p className="text-2xl font-bold text-green-700">$22,500</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-200">
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
                <span className="text-sm font-medium text-red-800">Expenses</span>
              </div>
              <p className="text-2xl font-bold text-red-700">$15,000</p>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-blue-800">Net Flow</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">+$7,500</p>
            </div>
          </div>

          {/* Emergency Fund Calculator - Expanded to fill remaining space */}
          <div className="flex-1 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 flex flex-col">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-blue-800 mb-2 flex items-center">
                <Shield className="h-6 w-6 mr-2" />
                Emergency Fund Calculator
              </h3>
              <p className="text-sm text-blue-600 font-medium">Assess your financial safety net</p>
            </div>
            
            {/* Current Status */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700 font-medium">Current Fund</p>
                <p className="text-xl font-bold text-blue-800">${(currentFund / 1000).toFixed(0)}K</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700 font-medium">Months Covered</p>
                <p className="text-xl font-bold text-blue-800">{monthsCovered.toFixed(1)}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-700">Progress to Target</span>
                <span className="text-sm font-bold text-blue-800">{progressPercentage.toFixed(0)}%</span>
              </div>
              <div className="relative">
                <Progress value={progressPercentage} className="h-2" />
                <div 
                  className="absolute top-0 left-0 h-2 rounded-full transition-all"
                  style={{
                    width: `${progressPercentage}%`,
                    backgroundColor: getProgressBarColor(progressPercentage)
                  }}
                />
              </div>
            </div>

            {/* Target Analysis */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-600">Target ({targetMonths} months):</span>
                <span className="font-medium text-blue-800">${(targetAmount / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600">Shortfall:</span>
                <span className="font-medium text-blue-800">${(shortfall / 1000).toFixed(0)}K</span>
              </div>
            </div>

            {/* Sliders - Expanded */}
            <div className="space-y-4 flex-1">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-700">Current Emergency Fund</span>
                  <span className="text-sm font-bold text-blue-800">${(currentFund / 1000).toFixed(0)}K</span>
                </div>
                <Slider
                  value={currentEmergencyFund}
                  onValueChange={setCurrentEmergencyFund}
                  max={100000}
                  min={0}
                  step={1000}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-700">Essential Monthly Expenses</span>
                  <span className="text-sm font-bold text-blue-800">${(monthlyExpenses / 1000).toFixed(1)}K</span>
                </div>
                <Slider
                  value={essentialMonthlyExpenses}
                  onValueChange={setEssentialMonthlyExpenses}
                  max={15000}
                  min={1000}
                  step={250}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-700">Target Months Coverage</span>
                  <span className="text-sm font-bold text-blue-800">{targetMonths} months</span>
                </div>
                <Slider
                  value={targetMonthsCoverage}
                  onValueChange={setTargetMonthsCoverage}
                  max={12}
                  min={3}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Status Message */}
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              monthsCovered >= targetMonths 
                ? 'bg-green-100 border border-green-200 text-green-800'
                : monthsCovered >= targetMonths * 0.5
                ? 'bg-yellow-100 border border-yellow-200 text-yellow-800'
                : 'bg-red-100 border border-red-200 text-red-800'
            }`}>
              <div className="flex items-center gap-2">
                {monthsCovered >= targetMonths ? (
                  <Shield className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span className="font-medium">
                  {monthsCovered >= targetMonths 
                    ? `✅ Target achieved! You have ${monthsCovered.toFixed(1)} months covered.`
                    : `🎯 To cover ${targetMonths} months, you need $${(shortfall / 1000).toFixed(0)}K more.`
                  }
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <CashFlowDetailDialog 
        isOpen={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
      />
      <SectionAIDialog
        isOpen={aiDialogOpen}
        onClose={() => setAIDialogOpen(false)}
        title="Cash Flow"
        content={generateAIAnalysis()}
      />
    </>
  );
};

export default MonthlyCashFlow;
