
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, AreaChart, Area } from "recharts";
import { TrendingDown, Home, CreditCard, Car, DollarSign, Calendar, AlertTriangle, Target, Calculator } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface Liability {
  name: string;
  amount: string;
  value: number;
  color: string;
}

interface LiabilitiesDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  liabilities: Liability[];
}

export const LiabilitiesDetailDialog = ({ isOpen, onClose, liabilities }: LiabilitiesDetailDialogProps) => {
  // Payment calculation controls
  const [extraPayment, setExtraPayment] = useState([0]);
  const [newInterestRate, setNewInterestRate] = useState([4.5]);
  const [payoffGoalYears, setPayoffGoalYears] = useState([25]);

  // Detailed liability data
  const mortgageDetails = {
    principal: 420000,
    currentBalance: 285000,
    interestRate: 4.5,
    originalTerm: 30,
    remainingTerm: 18,
    monthlyPayment: 1800,
    monthlyPrincipal: 743,
    monthlyInterest: 1057,
    totalPaid: 216000,
    totalInterestPaid: 136000,
    propertyValue: 620000,
    loanToValue: 46,
  };

  const carLoanDetails = {
    principal: 25000,
    currentBalance: 18000,
    interestRate: 6.2,
    remainingTerm: 3.5,
    monthlyPayment: 425,
    monthlyPrincipal: 293,
    monthlyInterest: 132,
    totalPaid: 10200,
    vehicleValue: 22000,
    loanToValue: 82,
  };

  const creditCardDetails = {
    totalBalance: 7500,
    averageRate: 19.5,
    minimumPayment: 225,
    totalCreditLimit: 25000,
    utilizationRate: 30,
    monthlyInterest: 122,
    cards: [
      { name: "Visa", balance: 4500, rate: 18.9, limit: 15000 },
      { name: "Mastercard", balance: 3000, rate: 20.5, limit: 10000 }
    ]
  };

  // Canadian mortgage payment calculation: PMT = P × [r_p (1+r_p)^n / ((1+r_p)^n–1)]
  const calculateMortgagePayment = (principal: number, rate: number, years: number) => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    if (monthlyRate === 0) return principal / numPayments;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  // Debt-free date calculation
  const calculateDebtFreeDate = (balance: number, payment: number, rate: number) => {
    const monthlyRate = rate / 100 / 12;
    if (monthlyRate === 0) return balance / payment;
    return Math.log(1 - (balance * monthlyRate / payment)) / Math.log(1 + monthlyRate) * -1;
  };

  // Calculate new payments and timelines with extra payments
  const newMortgagePayment = mortgageDetails.monthlyPayment + extraPayment[0];
  const currentPayoffMonths = calculateDebtFreeDate(mortgageDetails.currentBalance, mortgageDetails.monthlyPayment, mortgageDetails.interestRate);
  const newPayoffMonths = calculateDebtFreeDate(mortgageDetails.currentBalance, newMortgagePayment, newInterestRate[0]);
  
  const monthsSaved = currentPayoffMonths - newPayoffMonths;
  const interestSaved = (currentPayoffMonths * mortgageDetails.monthlyPayment) - (newPayoffMonths * newMortgagePayment);

  // Generate amortization data for chart
  const generateAmortizationData = () => {
    const data = [];
    let balance = mortgageDetails.currentBalance;
    const monthlyRate = mortgageDetails.interestRate / 100 / 12;
    
    for (let month = 1; month <= Math.min(36, currentPayoffMonths); month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = mortgageDetails.monthlyPayment - interestPayment;
      balance -= principalPayment;
      
      data.push({
        month,
        balance: Math.max(0, balance),
        principal: principalPayment,
        interest: interestPayment,
        totalPayment: mortgageDetails.monthlyPayment
      });
    }
    return data;
  };

  const amortizationData = generateAmortizationData();

  // Payment breakdown data
  const paymentBreakdownData = [
    { name: "Mortgage", current: mortgageDetails.monthlyPayment, withExtra: newMortgagePayment },
    { name: "Car Loan", current: carLoanDetails.monthlyPayment, withExtra: carLoanDetails.monthlyPayment },
    { name: "Credit Cards", current: creditCardDetails.minimumPayment, withExtra: creditCardDetails.minimumPayment },
  ];

  const chartConfig = {
    balance: { label: "Balance", color: "#ef4444" },
    principal: { label: "Principal", color: "#10b981" },
    interest: { label: "Interest", color: "#f59e0b" },
    current: { label: "Current", color: "#3b82f6" },
    withExtra: { label: "With Extra", color: "#10b981" }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Liabilities Analysis & Debt Paydown Strategies</DialogTitle>
        </DialogHeader>

        {/* Debt Strategy Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Debt Paydown Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Extra Monthly Payment: ${extraPayment[0]}</label>
                  <Slider
                    value={extraPayment}
                    onValueChange={setExtraPayment}
                    max={2000}
                    min={0}
                    step={50}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">New Interest Rate: {newInterestRate[0]}%</label>
                  <Slider
                    value={newInterestRate}
                    onValueChange={setNewInterestRate}
                    max={8}
                    min={2}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Payoff Goal (Years): {payoffGoalYears[0]}</label>
                  <Slider
                    value={payoffGoalYears}
                    onValueChange={setPayoffGoalYears}
                    max={30}
                    min={5}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-green-50">
                  <p className="text-sm font-medium text-green-800">Time Saved</p>
                  <p className="text-lg font-bold text-green-600">{Math.round(monthsSaved)} months</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50">
                  <p className="text-sm font-medium text-blue-800">Interest Saved</p>
                  <p className="text-lg font-bold text-blue-600">${Math.round(interestSaved).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debt Summary & Key Metrics */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Debt Summary & Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Debt</p>
                <p className="font-bold text-2xl text-red-600">
                  ${(mortgageDetails.currentBalance + carLoanDetails.currentBalance + creditCardDetails.totalBalance).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Monthly Payments</p>
                <p className="font-bold text-2xl text-orange-600">
                  ${(mortgageDetails.monthlyPayment + carLoanDetails.monthlyPayment + creditCardDetails.minimumPayment).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Debt-Free Date</p>
                <p className="font-bold text-2xl text-green-600">
                  {Math.round(currentPayoffMonths / 12)} years
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Interest</p>
                <p className="font-bold text-2xl text-purple-600">
                  ${((currentPayoffMonths * mortgageDetails.monthlyPayment) - mortgageDetails.currentBalance).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Debt Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-red-50">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium">High Interest Debt</p>
                  <p className="text-xs text-muted-foreground">Credit cards at {creditCardDetails.averageRate}% avg</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50">
                <Target className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">Debt-to-Asset Ratio</p>
                  <p className="text-xs text-muted-foreground">{Math.round((310500 / 735000) * 100)}% of total assets</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50">
                <Calculator className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Mortgage LTV</p>
                  <p className="text-xs text-muted-foreground">{mortgageDetails.loanToValue}% loan-to-value</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amortization Schedule Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Mortgage Amortization Schedule (Next 3 Years)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <AreaChart data={amortizationData}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area dataKey="balance" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Payment Comparison Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Payment Comparison: Current vs With Extra Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-48">
              <BarChart data={paymentBreakdownData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="current" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="withExtra" fill="#10b981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Detailed Debt Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Mortgage Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Home className="w-6 h-6" />
                Mortgage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="font-semibold text-lg text-red-600">${mortgageDetails.currentBalance.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Payment</p>
                  <p className="font-semibold text-lg">${mortgageDetails.monthlyPayment.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                  <p className="font-semibold">{mortgageDetails.interestRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Remaining Term</p>
                  <p className="font-semibold">{mortgageDetails.remainingTerm} years</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Principal</p>
                  <p className="font-semibold text-green-600">${mortgageDetails.monthlyPrincipal}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Interest</p>
                  <p className="font-semibold text-red-600">${mortgageDetails.monthlyInterest}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loan-to-Value</p>
                  <p className="font-semibold">{mortgageDetails.loanToValue}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Property Value</p>
                  <p className="font-semibold text-green-600">${mortgageDetails.propertyValue.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Payoff Analysis</span>
                </div>
                <div className="text-xs space-y-1">
                  <p>Current payoff: {Math.round(currentPayoffMonths / 12)} years, {Math.round(currentPayoffMonths % 12)} months</p>
                  <p>With ${extraPayment[0]} extra: {Math.round(newPayoffMonths / 12)} years, {Math.round(newPayoffMonths % 12)} months</p>
                  <p className="text-green-600 font-medium">Save: ${Math.round(interestSaved).toLocaleString()} in interest</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Car Loan Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Car className="w-6 h-6" />
                Car Loan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="font-semibold text-lg text-red-600">${carLoanDetails.currentBalance.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Payment</p>
                  <p className="font-semibold text-lg">${carLoanDetails.monthlyPayment}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                  <p className="font-semibold">{carLoanDetails.interestRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Remaining Term</p>
                  <p className="font-semibold">{carLoanDetails.remainingTerm} years</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Principal</p>
                  <p className="font-semibold text-green-600">${carLoanDetails.monthlyPrincipal}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Interest</p>
                  <p className="font-semibold text-red-600">${carLoanDetails.monthlyInterest}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle Value</p>
                  <p className="font-semibold">${carLoanDetails.vehicleValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loan-to-Value</p>
                  <p className="font-semibold">{carLoanDetails.loanToValue}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credit Cards Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CreditCard className="w-6 h-6" />
                Credit Cards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Balance</p>
                  <p className="font-semibold text-lg text-red-600">${creditCardDetails.totalBalance.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Minimum Payment</p>
                  <p className="font-semibold text-lg">${creditCardDetails.minimumPayment}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Rate</p>
                  <p className="font-semibold">{creditCardDetails.averageRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Utilization</p>
                  <p className="font-semibold">{creditCardDetails.utilizationRate}%</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Card Breakdown</h4>
                <div className="space-y-3">
                  {creditCardDetails.cards.map((card, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                      <div>
                        <p className="font-medium">{card.name}</p>
                        <p className="text-sm text-muted-foreground">Limit: ${card.limit.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">${card.balance.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{card.rate}% APR</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
