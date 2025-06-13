
import { TrendingUp, TrendingDown, DollarSign, Eye, PiggyBank, Zap, Shield, Target, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { CashFlowDetailDialog } from "./CashFlowDetailDialog";
import { useState } from "react";

const MonthlyCashFlow = () => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  
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

  return (
    <>
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <span>Cash Flow</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDetailDialog(true)}
            className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
          >
            <Eye className="w-4 h-4" />
            Details
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Income, Expenses, and Net Cash Flow in one row */}
          <div className="grid grid-cols-3 gap-4">
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

          {/* Emergency Fund Calculator */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="mb-4">
              <h3 className="text-base font-bold text-blue-800 mb-1 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Emergency Fund Calculator
              </h3>
              <p className="text-xs text-blue-600 font-medium">Assess your financial safety net</p>
            </div>
            
            {/* Current Status */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                <p className="text-xs text-blue-700 font-medium">Current Fund</p>
                <p className="text-lg font-bold text-blue-800">${(currentFund / 1000).toFixed(0)}K</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                <p className="text-xs text-blue-700 font-medium">Months Covered</p>
                <p className="text-lg font-bold text-blue-800">{monthsCovered.toFixed(1)}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-blue-700">Progress to Target</span>
                <span className="text-xs font-bold text-blue-800">{progressPercentage.toFixed(0)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Target Analysis */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              <div className="flex justify-between">
                <span className="text-blue-600">Target ({targetMonths} months):</span>
                <span className="font-medium text-blue-800">${(targetAmount / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600">Shortfall:</span>
                <span className="font-medium text-blue-800">${(shortfall / 1000).toFixed(0)}K</span>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-blue-700">Current Emergency Fund</span>
                  <span className="text-xs font-bold text-blue-800">${(currentFund / 1000).toFixed(0)}K</span>
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

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-blue-700">Essential Monthly Expenses</span>
                  <span className="text-xs font-bold text-blue-800">${(monthlyExpenses / 1000).toFixed(1)}K</span>
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

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-blue-700">Target Months Coverage</span>
                  <span className="text-xs font-bold text-blue-800">{targetMonths} months</span>
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
            <div className={`mt-3 p-2 rounded-lg text-xs ${
              monthsCovered >= targetMonths 
                ? 'bg-green-100 border border-green-200 text-green-800'
                : monthsCovered >= targetMonths * 0.5
                ? 'bg-yellow-100 border border-yellow-200 text-yellow-800'
                : 'bg-red-100 border border-red-200 text-red-800'
            }`}>
              <div className="flex items-center gap-1">
                {monthsCovered >= targetMonths ? (
                  <Shield className="h-3 w-3" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
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
    </>
  );
};

export default MonthlyCashFlow;
