import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, CreditCard } from "lucide-react";
import { LiabilitiesDetailDialog } from "./LiabilitiesDetailDialog";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Bot } from "lucide-react";
import { SectionAIDialog } from "./SectionAIDialog";

const LiabilitiesBreakdown = () => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [aiDialogOpen, setAIDialogOpen] = useState(false);

  // Individual debt states with sliders
  const [mortgageRate, setMortgageRate] = useState([4.5]);
  const [mortgageExtra, setMortgageExtra] = useState([0]);
  
  const [carLoanRate, setCarLoanRate] = useState([6.2]);
  const [carLoanExtra, setCarLoanExtra] = useState([0]);
  
  const [creditCardRate, setCreditCardRate] = useState([18.9]);
  const [creditCardExtra, setCreditCardExtra] = useState([0]);

  const liabilities = [
    { 
      name: "Mortgage", 
      amount: "$420,000", 
      monthlyPayment: 2800,
      color: "#8b5cf6", // Purple
      value: 420000,
      rate: mortgageRate[0],
      extraPayment: mortgageExtra[0],
      setRate: setMortgageRate,
      setExtra: setMortgageExtra,
      minRate: 2.0,
      maxRate: 8.0
    },
    { 
      name: "Car Loan", 
      amount: "$18,000", 
      monthlyPayment: 450,
      color: "#f59e0b", // Amber
      value: 18000,
      rate: carLoanRate[0],
      extraPayment: carLoanExtra[0],
      setRate: setCarLoanRate,
      setExtra: setCarLoanExtra,
      minRate: 3.0,
      maxRate: 12.0
    },
    { 
      name: "Credit Cards", 
      amount: "$7,500", 
      monthlyPayment: 250,
      color: "#06b6d4", // Cyan
      value: 7500,
      rate: creditCardRate[0],
      extraPayment: creditCardExtra[0],
      setRate: setCreditCardRate,
      setExtra: setCreditCardExtra,
      minRate: 10.0,
      maxRate: 30.0
    },
  ];

  // Calculate payoff details
  const calculatePayoffDetails = (balance, monthlyPayment, rate, extraPayment = 0) => {
    const totalPayment = monthlyPayment + extraPayment;
    const monthlyRate = rate / 100 / 12;
    
    if (monthlyRate === 0) {
      return {
        months: balance / totalPayment,
        totalInterest: 0
      };
    }
    
    if (totalPayment <= balance * monthlyRate) {
      return {
        months: 999, // Never pays off
        totalInterest: Infinity
      };
    }
    
    const months = -Math.log(1 - (balance * monthlyRate) / totalPayment) / Math.log(1 + monthlyRate);
    const totalPaid = totalPayment * months;
    const totalInterest = totalPaid - balance;
    
    return {
      months: Math.ceil(months),
      totalInterest: Math.max(0, totalInterest)
    };
  };

  const formatMonthsToDate = (months) => {
    const currentDate = new Date();
    const payoffDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + months, 1);
    return payoffDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const totalMonthlyPayments = liabilities.reduce((sum, liability) => 
    sum + liability.monthlyPayment + liability.extraPayment, 0
  );

  // Timeline component for visualizing time saved
  const TimelineSaved = ({ monthsSaved, color }: { monthsSaved: number, color: string }) => {
    const progressWidth = Math.min((monthsSaved / 60) * 100, 100);
    
    return (
      <div className="mt-3">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Time Saved:</span>
          <span className={`font-bold ${monthsSaved > 0 ? 'text-green-600' : 'text-gray-400'}`}>
            {Math.round(monthsSaved)} months
          </span>
        </div>
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${progressWidth}%`,
              backgroundColor: monthsSaved > 0 ? color : '#e5e7eb',
              opacity: monthsSaved > 0 ? 0.7 : 0.3
            }}
          />
          <div 
            className="absolute top-0 h-full w-1 bg-white border-2 transition-all duration-500 ease-out"
            style={{ 
              left: `${progressWidth}%`,
              borderColor: monthsSaved > 0 ? color : '#9ca3af',
              transform: 'translateX(-50%)',
              opacity: monthsSaved > 0 ? 1 : 0.5
            }}
          />
        </div>
      </div>
    );
  };

  // Enhanced AI Analysis for Liabilities
  const generateAIAnalysis = () => {
    let text = `Liabilities Analysis – Personalized Insights:\n\n`;
    text += `Here's a detailed breakdown of your current debts and what they mean for your financial journey.\n\n`;

    text += `🔔 **Total Monthly Debt Payments:** $${totalMonthlyPayments.toLocaleString()}\n`;

    liabilities.forEach(liab => {
      const original = calculatePayoffDetails(liab.value, liab.monthlyPayment, liab.rate);
      const origDate = formatMonthsToDate(original.months);
      text += `\n• **${liab.name}:**\n`;
      text += `  - Balance: ${liab.amount}\n`;
      text += `  - Interest Rate: ${liab.rate.toFixed(1)}%\n`;
      text += `  - Standard Payment: $${liab.monthlyPayment}/mo\n`;
      text += `  - Estimated Payoff Date: ${origDate}\n`;

      if (liab.extraPayment > 0) {
        const accelerated = calculatePayoffDetails(liab.value, liab.monthlyPayment, liab.rate, liab.extraPayment);
        const saved = original.months - accelerated.months;
        const accDate = formatMonthsToDate(accelerated.months);
        text += `  - **Accelerated Payments:** Paying an extra $${liab.extraPayment}/mo reduces your payoff to ${accDate}, saving approximately ${Math.round(saved)} months of payments and interest.\n`;
      }

      text += `  - Estimated Total Interest: $${(original.totalInterest).toLocaleString(undefined, { maximumFractionDigits: 0 })}\n`;
    });

    text += `\n💡 **Advisor's Note:** Maintaining manageable debt payments ensures long-term financial health. Speeding up repayments (even small acceleration) saves you thousands in interest and helps you reach your goals sooner. Review your rates and look for consolidation or refinancing opportunities.\n\n`;
    text += `Tip: Regularly revisiting your repayment strategy keeps you motivated and can accommodate life's changes. Good luck on your debt-free journey!`;

    return text;
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-2xl flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-red-600" />
            </div>
            <span>Liabilities</span>
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDetailDialog(true)}
              className="flex items-center gap-2 border-red-600 text-red-600 hover:bg-red-50"
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
        <CardContent className="pb-4 flex-1 flex flex-col">
          {/* Total Monthly Payments Summary */}
          <div className="p-4 bg-gray-50 rounded-lg border mb-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">Total Monthly Payments</span>
              <span className="text-xl font-bold text-red-600">${totalMonthlyPayments.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Individual Debt Cards - Takes up remaining space */}
          <div className="flex-1 flex flex-col space-y-4">
            {liabilities.map((liability, index) => {
              const originalPayoff = calculatePayoffDetails(liability.value, liability.monthlyPayment, liability.rate);
              const newPayoff = calculatePayoffDetails(liability.value, liability.monthlyPayment, liability.rate, liability.extraPayment);
              const monthsSaved = originalPayoff.months - newPayoff.months;
              
              return (
                <div key={index} className="p-4 rounded-lg border-2 space-y-3 flex-1" style={{ borderColor: liability.color }}>
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: liability.color }}></div>
                      <span className="font-bold text-base">{liability.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-medium text-base">{liability.amount}</span>
                      <span className="text-gray-600">${liability.monthlyPayment}/mo</span>
                    </div>
                  </div>
                  
                  {/* Sliders */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Rate: {liability.rate.toFixed(1)}%
                      </label>
                      <Slider
                        value={[liability.rate]}
                        onValueChange={liability.setRate}
                        min={liability.minRate}
                        max={liability.maxRate}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Extra: ${liability.extraPayment}
                      </label>
                      <Slider
                        value={[liability.extraPayment]}
                        onValueChange={liability.setExtra}
                        min={0}
                        max={5000}
                        step={25}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  {/* Results */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Original:</span>
                      <span className="font-medium">{formatMonthsToDate(originalPayoff.months)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">New:</span>
                      <span className="font-bold text-green-600">{formatMonthsToDate(newPayoff.months)}</span>
                    </div>
                  </div>

                  {/* Visual Timeline for Time Saved */}
                  <TimelineSaved monthsSaved={monthsSaved} color={liability.color} />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <LiabilitiesDetailDialog 
        isOpen={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
        liabilities={liabilities}
      />
      <SectionAIDialog
        isOpen={aiDialogOpen}
        onClose={() => setAIDialogOpen(false)}
        title="Liabilities"
        content={generateAIAnalysis()}
      />
    </>
  );
};

export default LiabilitiesBreakdown;
