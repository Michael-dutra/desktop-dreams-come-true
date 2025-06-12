
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { Shield, TrendingUp, Eye, Plus, Trash2, Edit, Save, DollarSign, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface InsuranceDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InsuranceDetailDialog = ({ isOpen, onClose }: InsuranceDetailDialogProps) => {
  // Financial Details for Insurance Analysis
  const [financialDetails, setFinancialDetails] = useState({
    grossAnnualIncome: 85000,
    netAnnualIncome: 62000,
    spouseIncome: 45000,
    mortgageBalance: 285000,
    otherDebts: 22500,
    emergencyFundMonths: 6,
    childrenEducationCost: 80000,
    charitableDonations: 5000,
    finalExpenses: 15000,
    estateTaxes: 25000,
    yearsToRetirement: 25,
    inflationRate: 3,
    investmentReturn: 7,
  });

  // Income multiple sliders for different insurance types
  const [incomeMultiples, setIncomeMultiples] = useState({
    lifeInsurance: [7.5], // 7.5x income
    criticalIllness: [1.8], // 1.8x income
    disabilityReplacement: [0.7], // 70% income replacement
  });

  // Additional coverage factors
  const [coverageFactors, setCoverageFactors] = useState({
    debtCoverage: [100], // 100% debt coverage
    educationCoverage: [100], // 100% education cost coverage
    emergencyMultiplier: [1.5], // 1.5x emergency fund
    finalExpenseCoverage: [100], // 100% final expense coverage
    charitableMultiplier: [10], // 10x annual charitable giving
  });

  // Tax considerations
  const [taxDetails, setTaxDetails] = useState({
    marginalTaxRate: [35], // 35% marginal rate
    estateTaxRate: [40], // 40% estate tax rate
    insuranceTaxFree: true,
  });

  // Calculate comprehensive insurance needs
  const calculateLifeInsuranceNeed = () => {
    const { grossAnnualIncome, mortgageBalance, otherDebts, childrenEducationCost, 
            charitableDonations, finalExpenses, estateTaxes, emergencyFundMonths, netAnnualIncome } = financialDetails;
    
    // Income replacement need
    const incomeReplacement = grossAnnualIncome * incomeMultiples.lifeInsurance[0];
    
    // Debt coverage need  
    const debtCoverage = (mortgageBalance + otherDebts) * (coverageFactors.debtCoverage[0] / 100);
    
    // Emergency fund need
    const emergencyNeed = (netAnnualIncome / 12) * emergencyFundMonths * (coverageFactors.emergencyMultiplier[0]);
    
    // Education costs
    const educationNeed = childrenEducationCost * (coverageFactors.educationCoverage[0] / 100);
    
    // Final expenses
    const finalExpenseNeed = finalExpenses * (coverageFactors.finalExpenseCoverage[0] / 100);
    
    // Charitable legacy
    const charitableNeed = charitableDonations * (coverageFactors.charitableMultiplier[0]);
    
    // Estate taxes
    const estateTaxNeed = estateTaxes;
    
    const totalNeed = incomeReplacement + debtCoverage + emergencyNeed + educationNeed + 
                     finalExpenseNeed + charitableNeed + estateTaxNeed;
    
    return {
      totalNeed: Math.round(totalNeed),
      breakdown: {
        incomeReplacement: Math.round(incomeReplacement),
        debtCoverage: Math.round(debtCoverage),
        emergencyNeed: Math.round(emergencyNeed),
        educationNeed: Math.round(educationNeed),
        finalExpenseNeed: Math.round(finalExpenseNeed),
        charitableNeed: Math.round(charitableNeed),
        estateTaxNeed: Math.round(estateTaxNeed),
      }
    };
  };

  const calculateCriticalIllnessNeed = () => {
    const { grossAnnualIncome, netAnnualIncome } = financialDetails;
    const incomeMultiplierNeed = grossAnnualIncome * incomeMultiples.criticalIllness[0];
    const medicalExpenses = 50000; // Estimated additional medical costs
    const incomeReplacement = netAnnualIncome * 2; // 2 years income replacement
    
    return Math.round(incomeMultiplierNeed + medicalExpenses + incomeReplacement);
  };

  const calculateDisabilityNeed = () => {
    const { netAnnualIncome } = financialDetails;
    const monthlyNeed = (netAnnualIncome / 12) * (incomeMultiples.disabilityReplacement[0]);
    return Math.round(monthlyNeed);
  };

  // State for current coverage amounts
  const [currentCoverage, setCurrentCoverage] = useState({
    life: [320000],
    critical: [50000], 
    disability: [3000],
  });

  // Calculate needs
  const lifeAnalysis = calculateLifeInsuranceNeed();
  const criticalNeed = calculateCriticalIllnessNeed();
  const disabilityNeed = calculateDisabilityNeed();

  // Calculate gaps
  const lifeGap = Math.max(0, lifeAnalysis.totalNeed - currentCoverage.life[0]);
  const criticalGap = Math.max(0, criticalNeed - currentCoverage.critical[0]);
  const disabilityGap = Math.max(0, disabilityNeed - currentCoverage.disability[0]);

  // Chart data
  const lifeInsuranceData = [
    { category: "Current Coverage", amount: currentCoverage.life[0], fill: "#3b82f6" },
    { category: "Calculated Need", amount: lifeAnalysis.totalNeed, fill: "#ef4444" },
    { category: "Coverage Gap", amount: lifeGap, fill: "#f59e0b" },
  ];

  const criticalIllnessData = [
    { category: "Current Coverage", amount: currentCoverage.critical[0], fill: "#10b981" },
    { category: "Calculated Need", amount: criticalNeed, fill: "#ef4444" },
    { category: "Coverage Gap", amount: criticalGap, fill: "#f59e0b" },
  ];

  const disabilityInsuranceData = [
    { category: "Current Coverage", amount: currentCoverage.disability[0], fill: "#8b5cf6" },
    { category: "Calculated Need", amount: disabilityNeed, fill: "#ef4444" },
    { category: "Coverage Gap", amount: disabilityGap, fill: "#f59e0b" },
  ];

  const chartConfig = {
    amount: { label: "Amount" },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Shield className="h-6 w-6" />
            Comprehensive Insurance Analysis
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="analysis" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis">Coverage Analysis</TabsTrigger>
            <TabsTrigger value="financial">Financial Details</TabsTrigger>
            <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
          </TabsList>

          <TabsContent value="financial" className="space-y-6">
            {/* Financial Input Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Income & Family Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Income & Family Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Gross Annual Income</Label>
                      <Input
                        type="number"
                        value={financialDetails.grossAnnualIncome}
                        onChange={(e) => setFinancialDetails(prev => ({
                          ...prev, grossAnnualIncome: Number(e.target.value)
                        }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Net Annual Income</Label>
                      <Input
                        type="number"
                        value={financialDetails.netAnnualIncome}
                        onChange={(e) => setFinancialDetails(prev => ({
                          ...prev, netAnnualIncome: Number(e.target.value)
                        }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Spouse Income</Label>
                      <Input
                        type="number"
                        value={financialDetails.spouseIncome}
                        onChange={(e) => setFinancialDetails(prev => ({
                          ...prev, spouseIncome: Number(e.target.value)
                        }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Years to Retirement</Label>
                      <Input
                        type="number"
                        value={financialDetails.yearsToRetirement}
                        onChange={(e) => setFinancialDetails(prev => ({
                          ...prev, yearsToRetirement: Number(e.target.value)
                        }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Debt & Obligations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Debts & Obligations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Mortgage Balance</Label>
                      <Input
                        type="number"
                        value={financialDetails.mortgageBalance}
                        onChange={(e) => setFinancialDetails(prev => ({
                          ...prev, mortgageBalance: Number(e.target.value)
                        }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Other Debts</Label>
                      <Input
                        type="number"
                        value={financialDetails.otherDebts}
                        onChange={(e) => setFinancialDetails(prev => ({
                          ...prev, otherDebts: Number(e.target.value)
                        }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Education Costs</Label>
                      <Input
                        type="number"
                        value={financialDetails.childrenEducationCost}
                        onChange={(e) => setFinancialDetails(prev => ({
                          ...prev, childrenEducationCost: Number(e.target.value)
                        }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Final Expenses</Label>
                      <Input
                        type="number"
                        value={financialDetails.finalExpenses}
                        onChange={(e) => setFinancialDetails(prev => ({
                          ...prev, finalExpenses: Number(e.target.value)
                        }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Legacy & Charitable */}
              <Card>
                <CardHeader>
                  <CardTitle>Legacy & Charitable Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Annual Charitable Donations</Label>
                      <Input
                        type="number"
                        value={financialDetails.charitableDonations}
                        onChange={(e) => setFinancialDetails(prev => ({
                          ...prev, charitableDonations: Number(e.target.value)
                        }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Estate Taxes</Label>
                      <Input
                        type="number"
                        value={financialDetails.estateTaxes}
                        onChange={(e) => setFinancialDetails(prev => ({
                          ...prev, estateTaxes: Number(e.target.value)
                        }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Emergency Fund (Months)</Label>
                      <Input
                        type="number"
                        value={financialDetails.emergencyFundMonths}
                        onChange={(e) => setFinancialDetails(prev => ({
                          ...prev, emergencyFundMonths: Number(e.target.value)
                        }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Economic Assumptions */}
              <Card>
                <CardHeader>
                  <CardTitle>Economic Assumptions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Inflation Rate (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={financialDetails.inflationRate}
                        onChange={(e) => setFinancialDetails(prev => ({
                          ...prev, inflationRate: Number(e.target.value)
                        }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Investment Return (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={financialDetails.investmentReturn}
                        onChange={(e) => setFinancialDetails(prev => ({
                          ...prev, investmentReturn: Number(e.target.value)
                        }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assumptions" className="space-y-6">
            {/* Coverage Calculation Assumptions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Income Multiples */}
              <Card>
                <CardHeader>
                  <CardTitle>Income Multiple Assumptions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Life Insurance Multiple: {incomeMultiples.lifeInsurance[0]}x income
                      </label>
                      <Slider
                        value={incomeMultiples.lifeInsurance}
                        onValueChange={(value) => setIncomeMultiples(prev => ({...prev, lifeInsurance: value}))}
                        max={15}
                        min={3}
                        step={0.5}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Critical Illness Multiple: {incomeMultiples.criticalIllness[0]}x income
                      </label>
                      <Slider
                        value={incomeMultiples.criticalIllness}
                        onValueChange={(value) => setIncomeMultiples(prev => ({...prev, criticalIllness: value}))}
                        max={5}
                        min={0.5}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Disability Replacement: {(incomeMultiples.disabilityReplacement[0] * 100).toFixed(0)}% of income
                      </label>
                      <Slider
                        value={incomeMultiples.disabilityReplacement}
                        onValueChange={(value) => setIncomeMultiples(prev => ({...prev, disabilityReplacement: value}))}
                        max={0.8}
                        min={0.4}
                        step={0.05}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Coverage Factors */}
              <Card>
                <CardHeader>
                  <CardTitle>Coverage Factor Assumptions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Debt Coverage: {coverageFactors.debtCoverage[0]}%
                      </label>
                      <Slider
                        value={coverageFactors.debtCoverage}
                        onValueChange={(value) => setCoverageFactors(prev => ({...prev, debtCoverage: value}))}
                        max={150}
                        min={50}
                        step={10}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Education Coverage: {coverageFactors.educationCoverage[0]}%
                      </label>
                      <Slider
                        value={coverageFactors.educationCoverage}
                        onValueChange={(value) => setCoverageFactors(prev => ({...prev, educationCoverage: value}))}
                        max={150}
                        min={50}
                        step={10}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Emergency Fund Multiple: {coverageFactors.emergencyMultiplier[0]}x
                      </label>
                      <Slider
                        value={coverageFactors.emergencyMultiplier}
                        onValueChange={(value) => setCoverageFactors(prev => ({...prev, emergencyMultiplier: value}))}
                        max={3}
                        min={0.5}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Charitable Legacy Multiple: {coverageFactors.charitableMultiplier[0]}x annual giving
                      </label>
                      <Slider
                        value={coverageFactors.charitableMultiplier}
                        onValueChange={(value) => setCoverageFactors(prev => ({...prev, charitableMultiplier: value}))}
                        max={25}
                        min={5}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tax Considerations */}
              <Card>
                <CardHeader>
                  <CardTitle>Tax Considerations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Marginal Tax Rate: {taxDetails.marginalTaxRate[0]}%
                      </label>
                      <Slider
                        value={taxDetails.marginalTaxRate}
                        onValueChange={(value) => setTaxDetails(prev => ({...prev, marginalTaxRate: value}))}
                        max={50}
                        min={20}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Estate Tax Rate: {taxDetails.estateTaxRate[0]}%
                      </label>
                      <Slider
                        value={taxDetails.estateTaxRate}
                        onValueChange={(value) => setTaxDetails(prev => ({...prev, estateTaxRate: value}))}
                        max={55}
                        min={25}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Life Insurance</p>
                    <p className="text-2xl font-bold text-blue-600">${(currentCoverage.life[0] / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-muted-foreground">Current Coverage</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Critical Illness</p>
                    <p className="text-2xl font-bold text-green-600">${(currentCoverage.critical[0] / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-muted-foreground">Current Coverage</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Disability Insurance</p>
                    <p className="text-2xl font-bold text-purple-600">${(currentCoverage.disability[0] / 1000).toFixed(1)}K/month</p>
                    <p className="text-xs text-muted-foreground">Current Coverage</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Life Insurance Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Life Insurance Coverage Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Current Coverage: ${(currentCoverage.life[0] / 1000).toFixed(0)}K</label>
                      <Slider
                        value={currentCoverage.life}
                        onValueChange={(value) => setCurrentCoverage(prev => ({...prev, life: value}))}
                        max={2000000}
                        min={0}
                        step={25000}
                        className="w-full"
                      />
                    </div>
                    
                    <div className={`p-4 rounded-lg border ${lifeGap > 0 ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}>
                      <h4 className={`font-semibold mb-2 ${lifeGap > 0 ? 'text-orange-900' : 'text-green-900'}`}>
                        {lifeGap > 0 ? 'Coverage Gap Identified' : 'Coverage Met'}
                      </h4>
                      <p className={`text-sm mb-3 ${lifeGap > 0 ? 'text-orange-700' : 'text-green-700'}`}>
                        {lifeGap > 0 
                          ? `Your current life insurance coverage falls short by $${(lifeGap / 1000).toFixed(0)}K.`
                          : 'Your current coverage meets or exceeds the calculated need.'
                        }
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Current Coverage:</span>
                          <span className="font-medium">${currentCoverage.life[0].toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Calculated Need:</span>
                          <span className="font-medium">${lifeAnalysis.totalNeed.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-semibold">Coverage Gap:</span>
                          <span className={`font-bold ${lifeGap > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                            ${lifeGap.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Need Breakdown */}
                      <div className="mt-4 pt-3 border-t">
                        <h5 className="font-medium mb-2">Need Breakdown:</h5>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Income Replacement:</span>
                            <span>${lifeAnalysis.breakdown.incomeReplacement.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Debt Coverage:</span>
                            <span>${lifeAnalysis.breakdown.debtCoverage.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Emergency Fund:</span>
                            <span>${lifeAnalysis.breakdown.emergencyNeed.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Education Costs:</span>
                            <span>${lifeAnalysis.breakdown.educationNeed.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Final Expenses:</span>
                            <span>${lifeAnalysis.breakdown.finalExpenseNeed.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Charitable Legacy:</span>
                            <span>${lifeAnalysis.breakdown.charitableNeed.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Estate Taxes:</span>
                            <span>${lifeAnalysis.breakdown.estateTaxNeed.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <ChartContainer config={chartConfig} className="h-64">
                    <BarChart data={lifeInsuranceData} layout="horizontal" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis dataKey="category" type="category" tick={{ fontSize: 9 }} width={120} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="amount" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            {/* Critical Illness Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Critical Illness Coverage Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Current Coverage: ${(currentCoverage.critical[0] / 1000).toFixed(0)}K</label>
                      <Slider
                        value={currentCoverage.critical}
                        onValueChange={(value) => setCurrentCoverage(prev => ({...prev, critical: value}))}
                        max={500000}
                        min={0}
                        step={10000}
                        className="w-full"
                      />
                    </div>
                    
                    <div className={`p-4 rounded-lg border ${criticalGap > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                      <h4 className={`font-semibold mb-2 ${criticalGap > 0 ? 'text-red-900' : 'text-green-900'}`}>
                        {criticalGap > 0 ? 'Significant Coverage Gap' : 'Coverage Met'}
                      </h4>
                      <p className={`text-sm mb-3 ${criticalGap > 0 ? 'text-red-700' : 'text-green-700'}`}>
                        {criticalGap > 0 
                          ? `Your critical illness coverage is below the calculated need by $${(criticalGap / 1000).toFixed(0)}K.`
                          : 'Your current coverage meets or exceeds the calculated need.'
                        }
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Current Coverage:</span>
                          <span className="font-medium">${currentCoverage.critical[0].toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Calculated Need:</span>
                          <span className="font-medium">${criticalNeed.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-semibold">Coverage Gap:</span>
                          <span className={`font-bold ${criticalGap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ${criticalGap.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <ChartContainer config={chartConfig} className="h-64">
                    <BarChart data={criticalIllnessData} layout="horizontal" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis dataKey="category" type="category" tick={{ fontSize: 9 }} width={120} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="amount" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            {/* Disability Insurance Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Disability Insurance Coverage Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Current Coverage: ${(currentCoverage.disability[0] / 1000).toFixed(1)}K/month</label>
                      <Slider
                        value={currentCoverage.disability}
                        onValueChange={(value) => setCurrentCoverage(prev => ({...prev, disability: value}))}
                        max={10000}
                        min={0}
                        step={250}
                        className="w-full"
                      />
                    </div>
                    
                    <div className={`p-4 rounded-lg border ${disabilityGap > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                      <h4 className={`font-semibold mb-2 ${disabilityGap > 0 ? 'text-yellow-900' : 'text-green-900'}`}>
                        {disabilityGap > 0 ? 'Moderate Coverage Gap' : 'Coverage Met'}
                      </h4>
                      <p className={`text-sm mb-3 ${disabilityGap > 0 ? 'text-yellow-700' : 'text-green-700'}`}>
                        {disabilityGap > 0 
                          ? `Your disability insurance falls short by $${(disabilityGap / 1000).toFixed(1)}K/month.`
                          : 'Your current coverage meets or exceeds the calculated need.'
                        }
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Current Coverage:</span>
                          <span className="font-medium">${currentCoverage.disability[0].toLocaleString()}/month</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Calculated Need:</span>
                          <span className="font-medium">${disabilityNeed.toLocaleString()}/month</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-semibold">Coverage Gap:</span>
                          <span className={`font-bold ${disabilityGap > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                            ${disabilityGap.toLocaleString()}/month
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <ChartContainer config={chartConfig} className="h-64">
                    <BarChart data={disabilityInsuranceData} layout="horizontal" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis dataKey="category" type="category" tick={{ fontSize: 9 }} width={120} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="amount" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Insurance Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lifeGap > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="font-medium text-red-800">Life Insurance Priority</p>
                      <p className="text-sm text-red-600">Increase life insurance coverage by ${(lifeGap / 1000).toFixed(0)}K to meet calculated needs based on your financial profile.</p>
                    </div>
                  )}

                  {criticalGap > 0 && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="font-medium text-orange-800">Critical Illness Gap</p>
                      <p className="text-sm text-orange-600">
                        Add ${(criticalGap / 1000).toFixed(0)}K in critical illness coverage based on income multiple analysis.
                      </p>
                    </div>
                  )}

                  {disabilityGap > 0 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="font-medium text-yellow-800">Disability Income</p>
                      <p className="text-sm text-yellow-600">
                        Increase disability insurance by ${(disabilityGap / 1000).toFixed(1)}K/month to maintain {(incomeMultiples.disabilityReplacement[0] * 100).toFixed(0)}% income replacement.
                      </p>
                    </div>
                  )}

                  {lifeGap === 0 && criticalGap === 0 && disabilityGap === 0 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="font-medium text-green-800">Excellent Coverage</p>
                      <p className="text-sm text-green-600">
                        All your insurance coverage levels meet or exceed the calculated needs based on your comprehensive financial analysis!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
