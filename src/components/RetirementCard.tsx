
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
  
  const lifeExpectancy = 90;
  const yearsInRetirement = lifeExpectancy - retirementAge[0];
  
  // Demo progress calculation - purely visual based on slider positions
  // Formula: Higher retirement age + lower income needed = higher percentage
  const calculateDemoProgress = () => {
    const ageScore = ((retirementAge[0] - 55) / (70 - 55)) * 50; // 0-50% based on age
    const incomeScore = ((8000 - netMonthlyIncomeNeeded[0]) / (8000 - 2000)) * 50; // 0-50% based on income
    return Math.min(100, Math.max(0, ageScore + incomeScore));
  };
  
  const demoProgress = calculateDemoProgress();
  
  // Calculate total retirement needs for display purposes
  const totalRetirementNeeded = netMonthlyIncomeNeeded[0] * 12 * yearsInRetirement;

  const generateAIAnalysis = () => {
    let text = `Personalized Retirement Analysis:\n\n`;
    text += `Hi there, here's an overview based on your selections:\n\n`;
    text += `🎂 Target retirement age: ${retirementAge[0]}\n`;
    text += `💸 Monthly income goal in retirement: $${netMonthlyIncomeNeeded[0].toLocaleString()}\n`;
    text += `💰 Total assets available: $330K\n`;
    text += `📈 Projected monthly income (pensions & savings): $3,200\n`;
    text += `⏳ Estimated years in retirement: ${yearsInRetirement} (up to age ${lifeExpectancy})\n\n`;
    
    text += `🔢 Based on your needs, your total retirement funding requirement is $${(totalRetirementNeeded/1000).toFixed(1)}K.\n`;
    text += `Your current progress shows ${demoProgress.toFixed(1)}% towards your retirement readiness.\n\n`;
    text += demoProgress >= 75
      ? "🎉 Great progress! You're on track for a comfortable retirement. Keep adjusting your plan as needed.\n"
      : demoProgress >= 50
      ? "📈 You're making good progress. Consider optimizing your retirement age or income needs for better results.\n"
      : "⚠️ There's room for improvement. Try adjusting your retirement age or monthly income needs to see different scenarios.\n";
    text += `\n👤 Adjust the sliders to explore different retirement scenarios and see how your progress changes!`;
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
          {/* Total Assets */}
          <div className="text-center p-5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
            <p className="text-4xl font-bold text-purple-600 mb-2">$330K</p>
            <p className="text-base text-purple-700 font-medium">Total Assets Available</p>
          </div>

          {/* Interactive Controls */}
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

          {/* Demo Retirement Savings Progress Meter */}
          <div className="flex-1 p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border-2 border-indigo-200 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <span className="text-xl font-bold text-indigo-800">Retirement Readiness</span>
              <span className="text-xl font-bold text-indigo-600 bg-white px-4 py-2 rounded-full">
                {demoProgress.toFixed(1)}%
              </span>
            </div>
            <div className="space-y-4">
              <Progress 
                value={demoProgress} 
                className="h-5 bg-indigo-100 border border-indigo-200 rounded-full overflow-hidden"
              />
              <div className="flex justify-between text-base text-indigo-700 font-medium">
                <span>0%</span>
                <span className="font-semibold">{demoProgress.toFixed(1)}% ready</span>
                <span>100%</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-5 p-4 bg-green-100 rounded-lg border border-green-200">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <span className="text-base font-semibold text-green-700">
                {demoProgress >= 75 ? "Excellent retirement readiness!" : 
                 demoProgress >= 50 ? "Good progress towards retirement!" : 
                 "Adjust sliders to improve readiness"}
              </span>
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
