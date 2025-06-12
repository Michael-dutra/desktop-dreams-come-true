
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Home, CreditCard, Car, Plus } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  // Individual debt strategy controls
  const [mortgageExtraPayment, setMortgageExtraPayment] = useState([0]);
  const [mortgageNewRate, setMortgageNewRate] = useState([4.5]);

  const [carExtraPayment, setCarExtraPayment] = useState([0]);
  const [carNewRate, setCarNewRate] = useState([6.2]);

  const [creditExtraPayment, setCreditExtraPayment] = useState([0]);
  const [creditNewRate, setCreditNewRate] = useState([19.5]);

  // Editable debt details
  const [mortgageDetails, setMortgageDetails] = useState({
    currentBalance: 285000,
    interestRate: 4.5,
    monthlyPayment: 1800,
    paymentFrequency: "Monthly",
  });

  const [carLoanDetails, setCarLoanDetails] = useState({
    currentBalance: 18000,
    interestRate: 6.2,
    monthlyPayment: 425,
    paymentFrequency: "Monthly",
  });

  const [creditCardDetails, setCreditCardDetails] = useState({
    balance: 4500,
    interestRate: 18.9,
    monthlyPayment: 225,
  });

  // Debt-free date calculation
  const calculateDebtFreeDate = (balance: number, payment: number, rate: number) => {
    const monthlyRate = rate / 100 / 12;
    if (monthlyRate === 0) return balance / payment;
    return Math.log(1 - (balance * monthlyRate / payment)) / Math.log(1 + monthlyRate) * -1;
  };

  // Calculate individual debt scenarios
  const mortgageNewPayment = mortgageDetails.monthlyPayment + mortgageExtraPayment[0];
  const mortgageCurrentPayoff = calculateDebtFreeDate(mortgageDetails.currentBalance, mortgageDetails.monthlyPayment, mortgageDetails.interestRate);
  const mortgageNewPayoff = calculateDebtFreeDate(mortgageDetails.currentBalance, mortgageNewPayment, mortgageNewRate[0]);
  const mortgageMonthsSaved = mortgageCurrentPayoff - mortgageNewPayoff;
  const mortgageInterestSaved = (mortgageCurrentPayoff * mortgageDetails.monthlyPayment) - (mortgageNewPayoff * mortgageNewPayment);

  const carNewPayment = carLoanDetails.monthlyPayment + carExtraPayment[0];
  const carCurrentPayoff = calculateDebtFreeDate(carLoanDetails.currentBalance, carLoanDetails.monthlyPayment, carLoanDetails.interestRate);
  const carNewPayoff = calculateDebtFreeDate(carLoanDetails.currentBalance, carNewPayment, carNewRate[0]);
  const carMonthsSaved = carCurrentPayoff - carNewPayoff;
  const carInterestSaved = (carCurrentPayoff * carLoanDetails.monthlyPayment) - (carNewPayoff * carNewPayment);

  const creditNewPayment = creditCardDetails.monthlyPayment + creditExtraPayment[0];
  const creditCurrentPayoff = calculateDebtFreeDate(creditCardDetails.balance, creditCardDetails.monthlyPayment, creditCardDetails.interestRate);
  const creditNewPayoff = calculateDebtFreeDate(creditCardDetails.balance, creditNewPayment, creditNewRate[0]);
  const creditMonthsSaved = creditCurrentPayoff - creditNewPayoff;
  const creditInterestSaved = (creditCurrentPayoff * creditCardDetails.monthlyPayment) - (creditNewPayoff * creditNewPayment);

  // Generate combined payoff data for charts
  const generateCombinedPayoffData = (balance: number, currentPayment: number, currentRate: number, newPayment: number, newRate: number, maxMonths = 60) => {
    const data = [];
    let currentBalance = balance;
    let optimizedBalance = balance;
    const currentMonthlyRate = currentRate / 100 / 12;
    const newMonthlyRate = newRate / 100 / 12;
    
    const maxPayoffMonths = Math.max(
      Math.ceil(calculateDebtFreeDate(balance, currentPayment, currentRate)),
      Math.ceil(calculateDebtFreeDate(balance, newPayment, newRate))
    );
    
    for (let month = 0; month <= Math.min(maxMonths, maxPayoffMonths); month++) {
      data.push({
        month,
        current: Math.max(0, currentBalance),
        optimized: Math.max(0, optimizedBalance)
      });
      
      // Calculate current strategy
      if (currentBalance > 0) {
        const currentInterestPayment = currentBalance * currentMonthlyRate;
        const currentPrincipalPayment = Math.min(currentPayment - currentInterestPayment, currentBalance);
        currentBalance -= currentPrincipalPayment;
      }
      
      // Calculate optimized strategy
      if (optimizedBalance > 0) {
        const optimizedInterestPayment = optimizedBalance * newMonthlyRate;
        const optimizedPrincipalPayment = Math.min(newPayment - optimizedInterestPayment, optimizedBalance);
        optimizedBalance -= optimizedPrincipalPayment;
      }
    }
    return data;
  };

  const mortgageChartData = generateCombinedPayoffData(
    mortgageDetails.currentBalance, 
    mortgageDetails.monthlyPayment, 
    mortgageDetails.interestRate,
    mortgageNewPayment,
    mortgageNewRate[0],
    240
  );

  const carChartData = generateCombinedPayoffData(
    carLoanDetails.currentBalance,
    carLoanDetails.monthlyPayment,
    carLoanDetails.interestRate,
    carNewPayment,
    carNewRate[0],
    60
  );

  const creditChartData = generateCombinedPayoffData(
    creditCardDetails.balance,
    creditCardDetails.monthlyPayment,
    creditCardDetails.interestRate,
    creditNewPayment,
    creditNewRate[0],
    60
  );

  const chartConfig = {
    current: { label: "Current", color: "#ef4444" },
    optimized: { label: "Optimized", color: "#10b981" }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Liabilities Analysis & Debt Paydown Strategies</DialogTitle>
        </DialogHeader>

        {/* Debt Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Debt Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Debt</p>
                <p className="font-bold text-2xl text-red-600">
                  ${(mortgageDetails.currentBalance + carLoanDetails.currentBalance + creditCardDetails.balance).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Monthly Payments</p>
                <p className="font-bold text-2xl text-orange-600">
                  ${(mortgageNewPayment + carNewPayment + creditNewPayment).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Time Saved</p>
                <p className="font-bold text-2xl text-green-600">
                  {Math.round((mortgageMonthsSaved + carMonthsSaved + creditMonthsSaved) / 3)} months
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Interest Saved</p>
                <p className="font-bold text-2xl text-purple-600">
                  ${Math.round(mortgageInterestSaved + carInterestSaved + creditInterestSaved).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Individual Debt Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Mortgage Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Home className="w-6 h-6" />
                Mortgage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Mortgage Details */}
                <div className="space-y-3 p-4 rounded-lg bg-gray-50">
                  <h4 className="font-semibold mb-3">Current Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm font-medium">Current Amount</Label>
                      <Input
                        type="number"
                        value={mortgageDetails.currentBalance}
                        onChange={(e) => setMortgageDetails(prev => ({...prev, currentBalance: Number(e.target.value)}))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Monthly Payment</Label>
                      <Input
                        type="number"
                        value={mortgageDetails.monthlyPayment}
                        onChange={(e) => setMortgageDetails(prev => ({...prev, monthlyPayment: Number(e.target.value)}))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Interest Rate (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={mortgageDetails.interestRate}
                        onChange={(e) => setMortgageDetails(prev => ({...prev, interestRate: Number(e.target.value)}))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Payment Frequency</Label>
                      <Select value={mortgageDetails.paymentFrequency} onValueChange={(value) => setMortgageDetails(prev => ({...prev, paymentFrequency: value}))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3 mt-3 space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Extra Monthly Payment: ${mortgageExtraPayment[0]}</label>
                      <Slider
                        value={mortgageExtraPayment}
                        onValueChange={setMortgageExtraPayment}
                        max={2000}
                        min={0}
                        step={50}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">New Interest Rate: {mortgageNewRate[0]}%</label>
                      <Slider
                        value={mortgageNewRate}
                        onValueChange={setMortgageNewRate}
                        max={8}
                        min={2}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    {/* Results */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="p-3 rounded-lg bg-green-50">
                        <p className="text-sm font-medium text-green-800">Time Saved</p>
                        <p className="text-lg font-bold text-green-600">{Math.round(mortgageMonthsSaved)} months</p>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50">
                        <p className="text-sm font-medium text-blue-800">Interest Saved</p>
                        <p className="text-lg font-bold text-blue-600">${Math.round(mortgageInterestSaved).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payoff Chart */}
                <div>
                  <h4 className="font-semibold mb-3">Payoff Chart</h4>
                  <ChartContainer config={chartConfig} className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mortgageChartData}>
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                        <ChartTooltip 
                          content={<ChartTooltipContent />}
                          formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name]}
                        />
                        <ChartLegend 
                          content={<ChartLegendContent />}
                          verticalAlign="top"
                          height={36}
                        />
                        <Line 
                          dataKey="current"
                          stroke="#ef4444" 
                          strokeWidth={2}
                          name="Current"
                          dot={false}
                        />
                        <Line 
                          dataKey="optimized"
                          stroke="#10b981" 
                          strokeWidth={2}
                          name="Optimized"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
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
              {/* Current Details */}
              <div className="space-y-3 p-4 rounded-lg bg-gray-50">
                <h4 className="font-semibold mb-3">Current Details</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm font-medium">Balance</Label>
                    <Input
                      type="number"
                      value={carLoanDetails.currentBalance}
                      onChange={(e) => setCarLoanDetails(prev => ({...prev, currentBalance: Number(e.target.value)}))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Interest Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={carLoanDetails.interestRate}
                      onChange={(e) => setCarLoanDetails(prev => ({...prev, interestRate: Number(e.target.value)}))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Payment</Label>
                    <Input
                      type="number"
                      value={carLoanDetails.monthlyPayment}
                      onChange={(e) => setCarLoanDetails(prev => ({...prev, monthlyPayment: Number(e.target.value)}))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Payment Frequency</Label>
                    <Select value={carLoanDetails.paymentFrequency} onValueChange={(value) => setCarLoanDetails(prev => ({...prev, paymentFrequency: value}))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t pt-3 space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Extra Monthly Payment: ${carExtraPayment[0]}</label>
                    <Slider
                      value={carExtraPayment}
                      onValueChange={setCarExtraPayment}
                      max={500}
                      min={0}
                      step={25}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">New Interest Rate: {carNewRate[0]}%</label>
                    <Slider
                      value={carNewRate}
                      onValueChange={setCarNewRate}
                      max={12}
                      min={2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  {/* Results */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="p-3 rounded-lg bg-green-50">
                      <p className="text-sm font-medium text-green-800">Time Saved</p>
                      <p className="text-lg font-bold text-green-600">{Math.round(carMonthsSaved)} months</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-50">
                      <p className="text-sm font-medium text-blue-800">Interest Saved</p>
                      <p className="text-lg font-bold text-blue-600">${Math.round(carInterestSaved).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payoff Chart */}
              <div>
                <h4 className="font-semibold mb-3">Payoff Chart</h4>
                <ChartContainer config={chartConfig} className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={carChartData}>
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name]}
                      />
                      <ChartLegend 
                        content={<ChartLegendContent />}
                        verticalAlign="top"
                        height={36}
                      />
                      <Line 
                        dataKey="current"
                        stroke="#ef4444" 
                        strokeWidth={2}
                        name="Current"
                        dot={false}
                      />
                      <Line 
                        dataKey="optimized"
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="Optimized"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Credit Card Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CreditCard className="w-6 h-6" />
                Credit Card
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Details */}
              <div className="space-y-3 p-4 rounded-lg bg-gray-50">
                <h4 className="font-semibold mb-3">Current Details</h4>
                <div className="grid grid-cols-1 gap-3 max-w-xs">
                  <div>
                    <Label className="text-sm font-medium">Balance</Label>
                    <Input
                      type="number"
                      value={creditCardDetails.balance}
                      onChange={(e) => setCreditCardDetails(prev => ({...prev, balance: Number(e.target.value)}))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Interest Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={creditCardDetails.interestRate}
                      onChange={(e) => setCreditCardDetails(prev => ({...prev, interestRate: Number(e.target.value)}))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Monthly Payment</Label>
                    <Input
                      type="number"
                      value={creditCardDetails.monthlyPayment}
                      onChange={(e) => setCreditCardDetails(prev => ({...prev, monthlyPayment: Number(e.target.value)}))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="border-t pt-3 space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Extra Monthly Payment: ${creditExtraPayment[0]}</label>
                    <Slider
                      value={creditExtraPayment}
                      onValueChange={setCreditExtraPayment}
                      max={1000}
                      min={0}
                      step={25}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">New Rate: {creditNewRate[0]}%</label>
                    <Slider
                      value={creditNewRate}
                      onValueChange={setCreditNewRate}
                      max={25}
                      min={10}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  {/* Results */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="p-3 rounded-lg bg-green-50">
                      <p className="text-sm font-medium text-green-800">Time Saved</p>
                      <p className="text-lg font-bold text-green-600">{Math.round(creditMonthsSaved)} months</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-50">
                      <p className="text-sm font-medium text-blue-800">Interest Saved</p>
                      <p className="text-lg font-bold text-blue-600">${Math.round(creditInterestSaved).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payoff Chart */}
              <div>
                <h4 className="font-semibold mb-3">Payoff Chart</h4>
                <ChartContainer config={chartConfig} className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={creditChartData}>
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name]}
                      />
                      <ChartLegend 
                        content={<ChartLegendContent />}
                        verticalAlign="top"
                        height={36}
                      />
                      <Line 
                        dataKey="current"
                        stroke="#ef4444" 
                        strokeWidth={2}
                        name="Current"
                        dot={false}
                      />
                      <Line 
                        dataKey="optimized"
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="Optimized"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Add Liability Card */}
          <Card className="lg:col-span-2 border-dashed border-2 border-muted-foreground/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-muted-foreground">
                <Plus className="w-6 h-6" />
                Add Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Liability Type</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mortgage">Mortgage</SelectItem>
                      <SelectItem value="car-loan">Car Loan</SelectItem>
                      <SelectItem value="credit-card">Credit Card</SelectItem>
                      <SelectItem value="personal-loan">Personal Loan</SelectItem>
                      <SelectItem value="line-of-credit">Line of Credit</SelectItem>
                      <SelectItem value="student-loan">Student Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Liability
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
