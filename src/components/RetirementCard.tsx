
import { PiggyBank, TrendingUp, Eye, Calendar, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RetirementDetailDialog } from "./RetirementDetailDialog";
import { useState } from "react";

const RetirementCard = () => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  
  // Retirement calculations
  const retirementAge = 65;
  const netMonthlyIncomeNeeded = 4500;
  const totalRetirementSavings = 90000;
  const projectedMonthlyIncome = 3200; // From CPP, OAS, and savings
  const lifeExpectancy = 90;
  const yearsInRetirement = lifeExpectancy - retirementAge;
  const yearsIncomeWillLast = totalRetirementSavings / (netMonthlyIncomeNeeded * 12);
  const coverageRatio = Math.min(1, yearsIncomeWillLast / yearsInRetirement);

  return (
    <>
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-50 to-transparent rounded-full -translate-y-16 translate-x-16" />
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <PiggyBank className="h-6 w-6 text-purple-600" />
            </div>
            <span>Retirement Planning</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDetailDialog(true)}
            className="flex items-center gap-2 hover:bg-purple-50"
          >
            <Eye className="w-4 h-4" />
            Details
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Total Savings */}
          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
            <p className="text-3xl font-bold text-purple-600 mb-1">$90,000</p>
            <p className="text-sm text-purple-700 font-medium">Total Retirement Savings</p>
          </div>
          
          {/* Retirement Goals */}
          <div className="space-y-4 pt-2 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center space-x-2 mb-1">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Retirement Age</span>
                </div>
                <p className="text-lg font-bold text-orange-600">{retirementAge}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center space-x-2 mb-1">
                  <Target className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-800">Monthly Need</span>
                </div>
                <p className="text-lg font-bold text-emerald-600">${netMonthlyIncomeNeeded.toLocaleString()}</p>
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="p-5 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border-2 border-indigo-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-indigo-800">Income Coverage</span>
                <span className="text-lg font-bold text-indigo-600 bg-white px-3 py-1 rounded-full">
                  {yearsIncomeWillLast.toFixed(0)} of {yearsInRetirement} years
                </span>
              </div>
              <div className="space-y-3">
                <Progress 
                  value={coverageRatio * 100} 
                  className="h-4 bg-indigo-100 border border-indigo-200 rounded-full overflow-hidden"
                />
                <div className="flex justify-between text-sm text-indigo-700">
                  <span>0 years</span>
                  <span className="font-medium">{(coverageRatio * 100).toFixed(0)}% covered</span>
                  <span>{yearsInRetirement} years</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-4 p-3 bg-green-100 rounded-lg border border-green-200">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-sm font-semibold text-green-700">On track for retirement at 65</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <RetirementDetailDialog 
        isOpen={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
      />
    </>
  );
};

export default RetirementCard;
