import { PiggyBank, TrendingUp, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { RetirementDetailDialog } from "./RetirementDetailDialog";
import { useState } from "react";
import { Bot } from "lucide-react";
import { SectionAIDialog } from "./SectionAIDialog";

const RetirementCard = () => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [aiDialogOpen, setAIDialogOpen] = useState(false);
  
  // Interactive retirement values
  const [retirementAge, setRetirementAge] = useState([65]);
  const [netMonthlyIncomeNeeded, setNetMonthlyIncomeNeeded] = useState([4500]);
  
  const totalRetirementSavings = 90000;
  const projectedMonthlyIncome = 3200; // From CPP, OAS, and savings
  const lifeExpectancy = 90;
  const yearsInRetirement = lifeExpectancy - retirementAge[0];
  
  // Calculate total retirement needs and percentage saved
  const totalRetirementNeeded = netMonthlyIncomeNeeded[0] * 12 * yearsInRetirement;
  const savingsPercentage = Math.min(100, (totalRetirementSavings / totalRetirementNeeded) * 100);

  const generateAIAnalysis = () => {
    let text = `Retirement Analysis:\n\n`;
    text += `- Targeted retirement age: ${retirementAge[0]}\n`;
    text += `- Net monthly income needed: $${netMonthlyIncomeNeeded[0].toLocaleString()}\n`;
    text += `- Total savings: $${totalRetirementSavings.toLocaleString()}\n`;
    text += `- Projected monthly income: $${projectedMonthlyIncome.toLocaleString()}\n`;
    text += `- Life expectancy: ${lifeExpectancy}\n`;
    text += `- Years in retirement: ${yearsInRetirement}\n`;
    text += `- Total needed: $${(totalRetirementNeeded/1000).toFixed(1)}K\n`;
    text += `- % funded with current savings: ${savingsPercentage.toFixed(1)}%\n\n`;
    text += savingsPercentage >= 100 
      ? "✅ Based on your inputs, you are on track to fully fund your retirement."
      : "⚠️ You may need to save more or reduce your retirement income expectations.";
    return text;
  };

  return (
    <>
      <Card className="relative overflow-hidden h-full flex flex-col">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-50 to-transparent rounded-full -translate-y-16 translate-x-16" />
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <PiggyBank className="h-6 w-6 text-purple-600" />
            </div>
            <span>Retirement</span>
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDetailDialog(true)}
              className="flex items-center gap-2 border-purple-600 text-purple-600 hover:bg-purple-50"
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
        <CardContent className="flex-1 flex flex-col space-y-6">
          {/* Total Savings */}
          <div className="text-center p-5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
            <p className="text-4xl font-bold text-purple-600 mb-2">$90,000</p>
            <p className="text-base text-purple-700 font-medium">Total Retirement Savings</p>
          </div>

          {/* Interactive Controls - Reduced size */}
          <div className="p-3 bg-gradient-to-r from-orange-50 via-purple-50 to-emerald-50 rounded-xl border border-orange-200">
            <div className="space-y-3">
              <label className="text-base font-semibold text-orange-700">
                Retirement Age: {retirementAge[0]}
              </label>
              <Slider
                value={retirementAge}
                onValueChange={setRetirementAge}
                min={55}
                max={70}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-3 mt-4">
              <label className="text-base font-semibold text-emerald-700">
                Monthly Income Needed: ${netMonthlyIncomeNeeded[0].toLocaleString()}
              </label>
              <Slider
                value={netMonthlyIncomeNeeded}
                onValueChange={setNetMonthlyIncomeNeeded}
                min={2000}
                max={8000}
                step={100}
                className="w-full"
              />
            </div>
          </div>

          {/* Retirement Savings Progress Meter */}
          <div className="flex-1 p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border-2 border-indigo-200 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <span className="text-xl font-bold text-indigo-800">Retirement Savings Progress</span>
              <span className="text-xl font-bold text-indigo-600 bg-white px-4 py-2 rounded-full">
                {savingsPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="space-y-4">
              <Progress 
                value={savingsPercentage} 
                className="h-5 bg-indigo-100 border border-indigo-200 rounded-full overflow-hidden"
              />
              <div className="flex justify-between text-base text-indigo-700 font-medium">
                <span>$0</span>
                <span className="font-semibold">{savingsPercentage.toFixed(1)}% of goal</span>
                <span>${(totalRetirementNeeded / 1000).toFixed(0)}K needed</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-5 p-4 bg-green-100 rounded-lg border border-green-200">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <span className="text-base font-semibold text-green-700">Building towards retirement goal</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <RetirementDetailDialog 
        isOpen={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
      />
      <SectionAIDialog
        isOpen={aiDialogOpen}
        onClose={() => setAIDialogOpen(false)}
        title="Retirement"
        content={generateAIAnalysis()}
      />
    </>
  );
};

export default RetirementCard;
