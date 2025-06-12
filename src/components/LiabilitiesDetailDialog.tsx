import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Home, CreditCard, Car, Plus, Lightbulb } from "lucide-react";
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
  const [carExtraPayment, setCarExtraPayment] = useState([0]);
  const [creditExtraPayment, setCreditExtraPayment] = useState([0]);

  // Editable mortgage fields
  const [mortgageAmount, setMortgageAmount] = useState(285000);
  const [mortgagePayment, setMortgagePayment] = useState(1800);
  const [mortgageFrequency, setMortgageFrequency] = useState("Monthly");
  const [mortgageRate, setMortgageRate] = useState(4.5);

  // Editable car loan fields
  const [carBalance, setCarBalance] = useState(18000);
  const [carRate, setCarRate] = useState(6.2);
  const [carPayment, setCarPayment] = useState(425);

  // Editable credit card fields
  const [creditBalance, setCreditBalance] = useState(4500);
  const [creditRate, setCreditRate] = useState(18.9);
  const [creditPayment, setCreditPayment] = useState(135);

  // Debt-free date calculation
  const calculateDebtFreeDate = (balance: number, payment: number, rate: number) => {
    const monthlyRate = rate / 100 / 12;
    if (monthlyRate === 0) return balance / payment;
    return Math.log(1 - (balance * monthlyRate / payment)) / Math.log(1 + monthlyRate) * -1;
  };

  // Calculate individual debt scenarios
  const mortgageNewPayment = mortgagePayment + mortgageExtraPayment[0];
  const mortgageCurrentPayoff = calculateDebtFreeDate(mortgageAmount, mortgagePayment, mortgageRate);
  const mortgageNewPayoff = calculateDebtFreeDate(mortgageAmount, mortgageNewPayment, mortgageRate);
  const mortgageMonthsSaved = mortgageCurrentPayoff - mortgageNewPayoff;
  const mortgageInterestSaved = (mortgageCurrentPayoff * mortgagePayment) - (mortgageNewPayoff * mortgageNewPayment);

  const carNewPayment = carPayment + carExtraPayment[0];
  const carCurrentPayoff = calculateDebtFreeDate(carBalance, carPayment, carRate);
  const carNewPayoff = calculateDebtFreeDate(carBalance, carNewPayment, carRate);
  const carMonthsSaved = carCurrentPayoff - carNewPayoff;
  const carInterestSaved = (carCurrentPayoff * carPayment) - (carNewPayoff * carNewPayment);

  const creditNewPayment = creditPayment + creditExtraPayment[0];
  const creditCurrentPayoff = calculateDebtFreeDate(creditBalance, creditPayment, creditRate);
  const creditNewPayoff = calculateDebtFreeDate(creditBalance, creditNewPayment, creditRate);
  const creditMonthsSaved = creditCurrentPayoff - creditNewPayoff;
  const creditInterestSaved = (creditCurrentPayoff * creditPayment) - (creditNewPayoff * creditNewPayment);

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
    mortgageAmount, 
    mortgagePayment, 
    mortgageRate,
    mortgageNewPayment,
    mortgageRate,
    240
  );

  const carChartData = generateCombinedPayoffData(
    carBalance,
    carPayment,
    carRate,
    carNewPayment,
    carRate,
    60
  );

  const creditChartData = generateCombinedPayoffData(
    creditBalance,
    creditPayment,
    creditRate,
    creditNewPayment,
    creditRate,
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
                  ${(mortgageAmount + carBalance + creditBalance).toLocaleString()}
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
                  <h4 className="font-semibold mb-3">Current Mortgage Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="mortgageAmount" className="text-xs">Amount</Label>
                      <Input
                        id="mortgageAmount"
                        type="number"
                        value={mortgageAmount}
                        onChange={(e) => setMortgageAmount(Number(e.target.value))}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mortgagePayment" className="text-xs">Payment</Label>
                      <Input
                        id="mortgagePayment"
                        type="number"
                        value={mortgagePayment}
                        onChange={(e) => setMortgagePayment(Number(e.target.value))}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mortgageFrequency" className="text-xs">Frequency</Label>
                      <Select value={mortgageFrequency} onValueChange={setMortgageFrequency}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="mortgageRate" className="text-xs">Rate (%)</Label>
                      <Input
                        id="mortgageRate"
                        type="number"
                        step="0.1"
                        value={mortgageRate}
                        onChange={(e) => setMortgageRate(Number(e.target.value))}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="border-t pt-3 mt-3">
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
                  <h4 className="font-semibold mb-3">Mortgage Payoff Chart</h4>
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
              {/* Editable Fields */}
              <div className="space-y-3 p-4 rounded-lg bg-gray-50">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="carBalance" className="text-xs">Balance</Label>
                    <Input
                      id="carBalance"
                      type="number"
                      value={carBalance}
                      onChange={(e) => setCarBalance(Number(e.target.value))}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="carRate" className="text-xs">Rate (%)</Label>
                    <Input
                      id="carRate"
                      type="number"
                      step="0.1"
                      value={carRate}
                      onChange={(e) => setCarRate(Number(e.target.value))}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="carPayment" className="text-xs">Monthly Payment</Label>
                    <Input
                      id="carPayment"
                      type="number"
                      value={carPayment}
                      onChange={(e) => setCarPayment(Number(e.target.value))}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>

                <div className="border-t pt-3">
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
                <h4 className="font-semibold mb-3">Car Loan Payoff Chart</h4>
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
              {/* Editable Fields */}
              <div className="space-y-3 p-4 rounded-lg bg-gray-50">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="creditBalance" className="text-xs">Balance</Label>
                    <Input
                      id="creditBalance"
                      type="number"
                      value={creditBalance}
                      onChange={(e) => setCreditBalance(Number(e.target.value))}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="creditRate" className="text-xs">Rate (%)</Label>
                    <Input
                      id="creditRate"
                      type="number"
                      step="0.1"
                      value={creditRate}
                      onChange={(e) => setCreditRate(Number(e.target.value))}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="creditPayment" className="text-xs">Monthly Payment</Label>
                    <Input
                      id="creditPayment"
                      type="number"
                      value={creditPayment}
                      onChange={(e) => setCreditPayment(Number(e.target.value))}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>

                <div className="border-t pt-3">
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
                <h4 className="font-semibold mb-3">Credit Card Payoff Chart</h4>
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

        {/* AI Guidance Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              AI Guidance for Liabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Debt Snowball Strategy</h4>
                <p className="text-sm text-blue-700">Focus on paying off your smallest debt first while making minimum payments on others. This builds momentum and motivation.</p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Mortgage Optimization</h4>
                <p className="text-sm text-green-700">Consider refinancing if rates have dropped. Even a 0.5% reduction can save thousands over the loan term.</p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Credit Card Balance Transfer</h4>
                <p className="text-sm text-purple-700">Look for 0% APR balance transfer offers to reduce interest payments while you pay down the principal.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
