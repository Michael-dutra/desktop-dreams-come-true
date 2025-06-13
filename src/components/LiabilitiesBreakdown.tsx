import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, CreditCard } from "lucide-react";
import { LiabilitiesDetailDialog } from "./LiabilitiesDetailDialog";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const LiabilitiesBreakdown = () => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);

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
      <div className="mt-2">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Time Saved:</span>
          <span className={`font-bold ${monthsSaved > 0 ? 'text-green-600' : 'text-gray-400'}`}>
            {Math.round(monthsSaved)} months
          </span>
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
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
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-2xl flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-red-600" />
            </div>
            <span>Liabilities</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDetailDialog(true)}
            className="flex items-center gap-2 border-red-600 text-red-600 hover:bg-red-50"
          >
            <Eye className="w-4 h-4" />
            Details
          </Button>
        </CardHeader>
        <CardContent className="pb-4 flex-1 flex flex-col">
          <div className="space-y-3 flex-1">
            {/* Total Monthly Payments Summary */}
            <div className="p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Total Monthly Payments</span>
                <span className="text-xl font-bold text-red-600">${totalMonthlyPayments.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Compact Individual Debt Cards */}
            <div className="space-y-3 flex-1">
              {liabilities.map((liability, index) => {
                const originalPayoff = calculatePayoffDetails(liability.value, liability.monthlyPayment, liability.rate);
                const newPayoff = calculatePayoffDetails(liability.value, liability.monthlyPayment, liability.rate, liability.extraPayment);
                const monthsSaved = originalPayoff.months - newPayoff.months;
                
                return (
                  <div key={index} className="p-3 rounded-lg border space-y-2" style={{ borderColor: liability.color }}>
                    {/* Compact Header */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: liability.color }}></div>
                        <span className="font-bold">{liability.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{liability.amount}</span>
                        <span className="text-gray-600">${liability.monthlyPayment}/mo</span>
                      </div>
                    </div>
                    
                    {/* Compact Sliders */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700">
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
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700">
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
                    
                    {/* Compact Results */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Original:</span>
                        <span className="font-medium">{formatMonthsToDate(originalPayoff.months)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">New:</span>
                        <span className="font-bold text-green-600">{formatMonthsToDate(newPayoff.months)}</span>
                      </div>
                    </div>

                    {/* Visual Timeline for Time Saved - Always Show */}
                    <TimelineSaved monthsSaved={monthsSaved} color={liability.color} />
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <LiabilitiesDetailDialog 
        isOpen={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
        liabilities={liabilities}
      />
    </>
  );
};

export default LiabilitiesBreakdown;
