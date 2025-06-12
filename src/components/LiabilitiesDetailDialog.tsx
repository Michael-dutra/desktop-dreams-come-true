import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Home, CreditCard, Car, Plus, Building, GraduationCap, User, X, FileText, Edit, Save, Copy } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  // Summary dialog state
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [selectedLiabilitySummary, setSelectedLiabilitySummary] = useState<{
    liability: LiabilityDetails;
    currentPayoff: number;
    newPayoff: number;
    monthsSaved: number;
    interestSaved: number;
    newPayment: number;
  } | null>(null);

  // Edit mode state for write-up
  const [isEditingWriteUp, setIsEditingWriteUp] = useState(false);
  const [editableWriteUp, setEditableWriteUp] = useState("");

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

  // Add new liability functionality - automatically triggered on selection
  const handleLiabilityTypeSelect = (liabilityType: string) => {
    if (!liabilityType) return;

    const newId = `custom-${Date.now()}`;
    const newLiability: LiabilityDetails = {
      id: newId,
      type: liabilityType,
      currentBalance: 10000,
      interestRate: 5.0,
      monthlyPayment: 200,
      paymentFrequency: "Monthly",
      extraPayment: 0,
      newRate: 5.0,
    };

    setCustomLiabilities([...customLiabilities, newLiability]);
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

  const removeLiability = (liabilityId: string) => {
    if (liabilityId === "mortgage") {
      // Handle mortgage removal if needed - for now just console log
      console.log("Cannot remove default mortgage");
    } else if (liabilityId === "car-loan") {
      // Handle car loan removal if needed - for now just console log
      console.log("Cannot remove default car loan");
    } else if (liabilityId === "credit-card") {
      // Handle credit card removal if needed - for now just console log
      console.log("Cannot remove default credit card");
    } else {
      removeCustomLiability(liabilityId);
    }
  };

  const handleCopyReport = async () => {
    try {
      await navigator.clipboard.writeText(editableWriteUp);
      toast({
        title: "Report copied",
        description: "The liability report has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy the report to clipboard.",
        variant: "destructive",
      });
    }
  };

  const generateLiabilitySummary = (liability: LiabilityDetails) => {
    const newPayment = liability.monthlyPayment + liability.extraPayment;
    const currentPayoff = calculateDebtFreeDate(liability.currentBalance, liability.monthlyPayment, liability.interestRate);
    const newPayoff = calculateDebtFreeDate(liability.currentBalance, newPayment, liability.newRate);
    const monthsSaved = currentPayoff - newPayoff;
    const interestSaved = (currentPayoff * liability.monthlyPayment) - (newPayoff * newPayment);

    // Generate initial write-up content
    const initialWriteUp = `Your ${liability.type} currently has a balance of $${liability.currentBalance.toLocaleString()} and is projected to be paid off in ${Math.round(currentPayoff)} months with current payments.

Current Balance: $${liability.currentBalance.toLocaleString()}
Interest Rate: ${liability.interestRate}%
Monthly Payment: $${liability.monthlyPayment.toLocaleString()}${liability.extraPayment > 0 ? `\nExtra Payment: $${liability.extraPayment.toLocaleString()}` : ''}
Payoff Timeline: ${Math.round(currentPayoff)} months${liability.newRate !== liability.interestRate ? `\nOptimized Rate: ${liability.newRate}%` : ''}
Time Saved: ${Math.round(monthsSaved)} months
Interest Saved: $${Math.round(interestSaved).toLocaleString()}

${monthsSaved > 0 ? `With the proposed optimizations, you could save ${Math.round(monthsSaved)} months and $${Math.round(interestSaved).toLocaleString()} in interest payments.` : 'This debt is currently on track for optimal payoff with the current payment structure.'}

This projection assumes consistent payment performance. Actual results may vary based on payment timing, rate changes, and other financial factors.`;

    setEditableWriteUp(initialWriteUp);
    setSelectedLiabilitySummary({
      liability,
      currentPayoff,
      newPayoff,
      monthsSaved,
      interestSaved,
      newPayment
    });
    setSummaryDialogOpen(true);
    setIsEditingWriteUp(false);
  };

  const handleSaveWriteUp = () => {
    setIsEditingWriteUp(false);
    toast({
      title: "Write-up saved",
      description: "Your liability report has been updated successfully.",
    });
  };

  const handleCancelEdit = () => {
    setIsEditingWriteUp(false);
    // Reset to original content if needed
    if (selectedLiabilitySummary) {
      generateLiabilitySummary(selectedLiabilitySummary.liability);
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

    // Calculate amortization for mortgage
    const calculateAmortization = () => {
      if (liability.type !== "Mortgage") return null;
      
      const monthlyRate = liability.interestRate / 100 / 12;
      const numPayments = currentPayoff;
      
      if (monthlyRate === 0) return { principal: liability.monthlyPayment, interest: 0 };
      
      const totalInterest = (liability.monthlyPayment * numPayments) - liability.currentBalance;
      const principalPayment = liability.currentBalance / numPayments;
      const interestPayment = totalInterest / numPayments;
      
      return {
        principal: principalPayment,
        interest: interestPayment
      };
    };

    const amortization = calculateAmortization();

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
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => generateLiabilitySummary(liability)}
                className="text-blue-600 hover:bg-blue-50 p-1"
              >
                <FileText className="w-4 h-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:bg-red-50 p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove the {liability.type} from your liabilities. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => removeLiability(liability.id)} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
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

            {/* Amortization section for mortgage */}
            {liability.type === "Mortgage" && amortization && (
              <div className="border-t pt-3 space-y-3">
                <h5 className="font-medium text-sm">Monthly Payment Breakdown</h5>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-blue-50">
                    <p className="text-sm font-medium text-blue-800">Principal</p>
                    <p className="text-lg font-bold text-blue-600">${Math.round(amortization.principal).toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-50">
                    <p className="text-sm font-medium text-orange-800">Interest</p>
                    <p className="text-lg font-bold text-orange-600">${Math.round(amortization.interest).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

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
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">Liabilities</DialogTitle>
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
                    <Select value="" onValueChange={handleLiabilityTypeSelect}>
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
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Liability Write-up Dialog */}
      <Dialog open={summaryDialogOpen} onOpenChange={setSummaryDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                {selectedLiabilitySummary?.liability.type} Report
              </div>
              <div className="flex items-center gap-2">
                {!isEditingWriteUp ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyReport}
                      className="text-gray-600 hover:bg-gray-50"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingWriteUp(true)}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSaveWriteUp}
                      className="text-green-600 hover:bg-green-50"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="text-gray-600 hover:bg-gray-50"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedLiabilitySummary && (
            <div className="space-y-4">
              {!isEditingWriteUp ? (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm font-mono text-gray-700 leading-relaxed">
                    {editableWriteUp}
                  </pre>
                </div>
              ) : (
                <div className="space-y-4">
                  <Label htmlFor="writeup-editor" className="text-sm font-medium">
                    Edit Report Content
                  </Label>
                  <Textarea
                    id="writeup-editor"
                    value={editableWriteUp}
                    onChange={(e) => setEditableWriteUp(e.target.value)}
                    className="min-h-[400px] font-mono text-sm"
                    placeholder="Enter your liability report content here..."
                  />
                </div>
              )}

              <div className="flex justify-end pt-4 border-t gap-2">
                <Button variant="outline" onClick={() => setSummaryDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
