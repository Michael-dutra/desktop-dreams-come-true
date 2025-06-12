
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Home, CreditCard, Car, Plus, Building, GraduationCap, User } from "lucide-react";
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

interface LiabilityDetails {
  id: string;
  type: string;
  currentBalance: number;
  interestRate: number;
  monthlyPayment: number;
  paymentFrequency: string;
  extraPayment: number;
  newRate: number;
}

interface LiabilitiesDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  liabilities: Liability[];
}

export const LiabilitiesDetailDialog = ({ isOpen, onClose, liabilities }: LiabilitiesDetailDialogProps) => {
  // Original liability details
  const [mortgageDetails, setMortgageDetails] = useState({
    id: "mortgage",
    type: "Mortgage",
    currentBalance: 285000,
    interestRate: 4.5,
    monthlyPayment: 1800,
    paymentFrequency: "Monthly",
    extraPayment: 0,
    newRate: 4.5,
  });

  const [carLoanDetails, setCarLoanDetails] = useState({
    id: "car-loan",
    type: "Car Loan",
    currentBalance: 18000,
    interestRate: 6.2,
    monthlyPayment: 425,
    paymentFrequency: "Monthly",
    extraPayment: 0,
    newRate: 6.2,
  });

  const [creditCardDetails, setCreditCardDetails] = useState({
    id: "credit-card",
    type: "Credit Card",
    currentBalance: 4500,
    interestRate: 18.9,
    monthlyPayment: 225,
    paymentFrequency: "Monthly",
    extraPayment: 0,
    newRate: 18.9,
  });

  // New liabilities state
  const [customLiabilities, setCustomLiabilities] = useState<LiabilityDetails[]>([]);
  const [newLiabilityType, setNewLiabilityType] = useState("");

  // Add new liability functionality
  const handleAddLiability = () => {
    if (!newLiabilityType) return;

    const newId = `custom-${Date.now()}`;
    const newLiability: LiabilityDetails = {
      id: newId,
      type: newLiabilityType,
      currentBalance: 10000,
      interestRate: 5.0,
      monthlyPayment: 200,
      paymentFrequency: "Monthly",
      extraPayment: 0,
      newRate: 5.0,
    };

    setCustomLiabilities([...customLiabilities, newLiability]);
    setNewLiabilityType("");
  };

  const updateCustomLiability = (id: string, updates: Partial<LiabilityDetails>) => {
    setCustomLiabilities(customLiabilities.map(liability => 
      liability.id === id ? { ...liability, ...updates } : liability
    ));
  };

  const removeCustomLiability = (id: string) => {
    setCustomLiabilities(customLiabilities.filter(liability => liability.id !== id));
  };

  // Calculation functions
  const calculateDebtFreeDate = (balance: number, payment: number, rate: number) => {
    const monthlyRate = rate / 100 / 12;
    if (monthlyRate === 0) return balance / payment;
    return Math.log(1 - (balance * monthlyRate / payment)) / Math.log(1 + monthlyRate) * -1;
  };

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
      
      if (currentBalance > 0) {
        const currentInterestPayment = currentBalance * currentMonthlyRate;
        const currentPrincipalPayment = Math.min(currentPayment - currentInterestPayment, currentBalance);
        currentBalance -= currentPrincipalPayment;
      }
      
      if (optimizedBalance > 0) {
        const optimizedInterestPayment = optimizedBalance * newMonthlyRate;
        const optimizedPrincipalPayment = Math.min(newPayment - optimizedInterestPayment, optimizedBalance);
        optimizedBalance -= optimizedPrincipalPayment;
      }
    }
    return data;
  };

  const getIconForType = (type: string) => {
    switch (type.toLowerCase()) {
      case "mortgage":
        return Home;
      case "car loan":
        return Car;
      case "credit card":
        return CreditCard;
      case "personal loan":
        return User;
      case "line of credit":
        return CreditCard;
      case "student loan":
        return GraduationCap;
      default:
        return Building;
    }
  };

  const renderLiabilityCard = (liability: LiabilityDetails) => {
    const Icon = getIconForType(liability.type);
    const newPayment = liability.monthlyPayment + liability.extraPayment;
    const currentPayoff = calculateDebtFreeDate(liability.currentBalance, liability.monthlyPayment, liability.interestRate);
    const newPayoff = calculateDebtFreeDate(liability.currentBalance, newPayment, liability.newRate);
    const monthsSaved = currentPayoff - newPayoff;
    const interestSaved = (currentPayoff * liability.monthlyPayment) - (newPayoff * newPayment);
    const chartData = generateCombinedPayoffData(
      liability.currentBalance,
      liability.monthlyPayment,
      liability.interestRate,
      newPayment,
      liability.newRate,
      60
    );

    const chartConfig = {
      current: { label: "Current", color: "#ef4444" },
      optimized: { label: "Optimized", color: "#10b981" }
    };

    return (
      <Card key={liability.id}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl">
            <div className="flex items-center gap-2">
              <Icon className="w-6 h-6" />
              {liability.type}
            </div>
            {liability.id.startsWith('custom-') && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => removeCustomLiability(liability.id)}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Remove
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 p-4 rounded-lg bg-gray-50">
            <h4 className="font-semibold mb-3">Current Details</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium">Balance</Label>
                <Input
                  type="number"
                  value={liability.currentBalance}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (liability.id === "mortgage") {
                      setMortgageDetails(prev => ({...prev, currentBalance: value}));
                    } else if (liability.id === "car-loan") {
                      setCarLoanDetails(prev => ({...prev, currentBalance: value}));
                    } else if (liability.id === "credit-card") {
                      setCreditCardDetails(prev => ({...prev, currentBalance: value}));
                    } else {
                      updateCustomLiability(liability.id, {currentBalance: value});
                    }
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Interest Rate (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={liability.interestRate}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (liability.id === "mortgage") {
                      setMortgageDetails(prev => ({...prev, interestRate: value}));
                    } else if (liability.id === "car-loan") {
                      setCarLoanDetails(prev => ({...prev, interestRate: value}));
                    } else if (liability.id === "credit-card") {
                      setCreditCardDetails(prev => ({...prev, interestRate: value}));
                    } else {
                      updateCustomLiability(liability.id, {interestRate: value});
                    }
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Monthly Payment</Label>
                <Input
                  type="number"
                  value={liability.monthlyPayment}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (liability.id === "mortgage") {
                      setMortgageDetails(prev => ({...prev, monthlyPayment: value}));
                    } else if (liability.id === "car-loan") {
                      setCarLoanDetails(prev => ({...prev, monthlyPayment: value}));
                    } else if (liability.id === "credit-card") {
                      setCreditCardDetails(prev => ({...prev, monthlyPayment: value}));
                    } else {
                      updateCustomLiability(liability.id, {monthlyPayment: value});
                    }
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Payment Frequency</Label>
                <Select 
                  value={liability.paymentFrequency} 
                  onValueChange={(value) => {
                    if (liability.id === "mortgage") {
                      setMortgageDetails(prev => ({...prev, paymentFrequency: value}));
                    } else if (liability.id === "car-loan") {
                      setCarLoanDetails(prev => ({...prev, paymentFrequency: value}));
                    } else if (liability.id === "credit-card") {
                      setCreditCardDetails(prev => ({...prev, paymentFrequency: value}));
                    } else {
                      updateCustomLiability(liability.id, {paymentFrequency: value});
                    }
                  }}
                >
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
                <label className="text-sm font-medium mb-2 block">Extra Monthly Payment: ${liability.extraPayment}</label>
                <Slider
                  value={[liability.extraPayment]}
                  onValueChange={(value) => {
                    if (liability.id === "mortgage") {
                      setMortgageDetails(prev => ({...prev, extraPayment: value[0]}));
                    } else if (liability.id === "car-loan") {
                      setCarLoanDetails(prev => ({...prev, extraPayment: value[0]}));
                    } else if (liability.id === "credit-card") {
                      setCreditCardDetails(prev => ({...prev, extraPayment: value[0]}));
                    } else {
                      updateCustomLiability(liability.id, {extraPayment: value[0]});
                    }
                  }}
                  max={1000}
                  min={0}
                  step={25}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">New Interest Rate: {liability.newRate}%</label>
                <Slider
                  value={[liability.newRate]}
                  onValueChange={(value) => {
                    if (liability.id === "mortgage") {
                      setMortgageDetails(prev => ({...prev, newRate: value[0]}));
                    } else if (liability.id === "car-loan") {
                      setCarLoanDetails(prev => ({...prev, newRate: value[0]}));
                    } else if (liability.id === "credit-card") {
                      setCreditCardDetails(prev => ({...prev, newRate: value[0]}));
                    } else {
                      updateCustomLiability(liability.id, {newRate: value[0]});
                    }
                  }}
                  max={25}
                  min={1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="p-3 rounded-lg bg-green-50">
                  <p className="text-sm font-medium text-green-800">Time Saved</p>
                  <p className="text-lg font-bold text-green-600">{Math.round(monthsSaved)} months</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <p className="text-sm font-medium text-blue-800">Interest Saved</p>
                  <p className="text-lg font-bold text-blue-600">${Math.round(interestSaved).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Payoff Chart</h4>
            <ChartContainer config={chartConfig} className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
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
    );
  };

  // Calculate totals
  const allLiabilities = [mortgageDetails, carLoanDetails, creditCardDetails, ...customLiabilities];
  const totalDebt = allLiabilities.reduce((sum, liability) => sum + liability.currentBalance, 0);
  const totalMonthlyPayments = allLiabilities.reduce((sum, liability) => sum + liability.monthlyPayment + liability.extraPayment, 0);
  const totalMonthsSaved = allLiabilities.reduce((sum, liability) => {
    const currentPayoff = calculateDebtFreeDate(liability.currentBalance, liability.monthlyPayment, liability.interestRate);
    const newPayoff = calculateDebtFreeDate(liability.currentBalance, liability.monthlyPayment + liability.extraPayment, liability.newRate);
    return sum + (currentPayoff - newPayoff);
  }, 0) / allLiabilities.length;
  const totalInterestSaved = allLiabilities.reduce((sum, liability) => {
    const currentPayoff = calculateDebtFreeDate(liability.currentBalance, liability.monthlyPayment, liability.interestRate);
    const newPayoff = calculateDebtFreeDate(liability.currentBalance, liability.monthlyPayment + liability.extraPayment, liability.newRate);
    return sum + ((currentPayoff * liability.monthlyPayment) - (newPayoff * (liability.monthlyPayment + liability.extraPayment)));
  }, 0);

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
                  ${totalDebt.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Monthly Payments</p>
                <p className="font-bold text-2xl text-orange-600">
                  ${totalMonthlyPayments.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Time Saved</p>
                <p className="font-bold text-2xl text-green-600">
                  {Math.round(totalMonthsSaved)} months
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Interest Saved</p>
                <p className="font-bold text-2xl text-purple-600">
                  ${Math.round(totalInterestSaved).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Individual Debt Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderLiabilityCard(mortgageDetails)}
          {renderLiabilityCard(carLoanDetails)}
          {renderLiabilityCard(creditCardDetails)}
          
          {/* Custom Liabilities */}
          {customLiabilities.map(liability => renderLiabilityCard(liability))}

          {/* Add Liability Card */}
          <Card className="border-dashed border-2 border-muted-foreground/30">
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
                  <Select value={newLiabilityType} onValueChange={setNewLiabilityType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select liability type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Personal Loan">Personal Loan</SelectItem>
                      <SelectItem value="Line of Credit">Line of Credit</SelectItem>
                      <SelectItem value="Student Loan">Student Loan</SelectItem>
                      <SelectItem value="Business Loan">Business Loan</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={handleAddLiability}
                  disabled={!newLiabilityType}
                >
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
