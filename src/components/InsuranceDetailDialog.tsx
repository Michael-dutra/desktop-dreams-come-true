import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Shield, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface InsuranceDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InsuranceDetailDialog = ({ isOpen, onClose }: InsuranceDetailDialogProps) => {
  // Editable fields for life insurance calculator
  const [income, setIncome] = useState(65000);
  const [incomeMultiplier, setIncomeMultiplier] = useState(10);
  const [mortgage, setMortgage] = useState(445500);
  const [childEducation, setChildEducation] = useState(120000);
  const [otherDebts, setOtherDebts] = useState(25000);
  const [finalExpenses, setFinalExpenses] = useState(15000);
  const [taxes, setTaxes] = useState(50000);
  const [charity, setCharity] = useState(10000);
  const [other, setOther] = useState(5000);

  // Current life insurance details
  const [currentLifeInsurance, setCurrentLifeInsurance] = useState({
    provider: "ABC Life Insurance",
    policyType: "Term Life - 20 Year",
    coverageAmount: 320000,
    monthlyPremium: 100,
    beneficiaries: "Spouse (100%)"
  });

  // CI Calculator fields
  const [ciIncome, setCiIncome] = useState(65000);
  const [ciMultiplier, setCiMultiplier] = useState(3);
  const [ciTreatmentCosts, setCiTreatmentCosts] = useState(50000);
  const [ciRecoveryPeriod, setCiRecoveryPeriod] = useState(2);

  // DI Calculator fields
  const [diIncome, setDiIncome] = useState(65000);
  const [diCoveragePercentage, setDiCoveragePercentage] = useState(65);
  const [diBenefitPeriod, setDiBenefitPeriod] = useState(5);
  const [diWaitingPeriod, setDiWaitingPeriod] = useState(90);

  const currentCoverage = {
    life: currentLifeInsurance.coverageAmount,
    criticalIllness: 100000,
    disability: 0
  };

  // Calculate total life insurance need based on user inputs
  const calculateTotalNeed = () => {
    const incomeReplacement = income * incomeMultiplier;
    return incomeReplacement + mortgage + childEducation + otherDebts + finalExpenses + taxes + charity + other;
  };

  // Calculate CI need
  const calculateCiNeed = () => {
    const incomeReplacement = ciIncome * ciMultiplier;
    const totalTreatmentCosts = ciTreatmentCosts;
    const recoveryIncome = (ciIncome * ciRecoveryPeriod);
    return incomeReplacement + totalTreatmentCosts + recoveryIncome;
  };

  // Calculate DI need
  const calculateDiNeed = () => {
    return (diIncome * (diCoveragePercentage / 100));
  };

  const totalNeed = calculateTotalNeed();
  const coverageGap = totalNeed - currentCoverage.life;

  const ciTotalNeed = calculateCiNeed();
  const ciCoverageGap = ciTotalNeed - currentCoverage.criticalIllness;

  const diTotalNeed = calculateDiNeed();
  const diCoverageGap = diTotalNeed - currentCoverage.disability;

  const recommendedCoverage = {
    life: totalNeed,
    criticalIllness: ciTotalNeed,
    disability: diTotalNeed
  };

  const coverageGaps = {
    life: coverageGap,
    criticalIllness: ciCoverageGap,
    disability: diCoverageGap
  };

  const coverageComparison = [
    { 
      type: "Life Insurance", 
      current: currentCoverage.life, 
      recommended: recommendedCoverage.life, 
      gap: coverageGaps.life,
      status: coverageGaps.life > 0 ? "underinsured" : "adequate"
    },
    { 
      type: "Critical Illness", 
      current: currentCoverage.criticalIllness, 
      recommended: recommendedCoverage.criticalIllness, 
      gap: coverageGaps.criticalIllness,
      status: coverageGaps.criticalIllness > 0 ? "underinsured" : "adequate"
    },
    { 
      type: "Disability", 
      current: currentCoverage.disability, 
      recommended: recommendedCoverage.disability, 
      gap: coverageGaps.disability,
      status: coverageGaps.disability > 0 ? "underinsured" : "adequate"
    }
  ];

  const chartConfig = {
    current: { label: "Current Coverage", color: "#3b82f6" },
    recommended: { label: "Recommended Coverage", color: "#ef4444" },
    gap: { label: "Coverage Gap", color: "#f59e0b" }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Insurance</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Simplified Life Insurance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Life Insurance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Current Coverage</h4>
                  <p className="text-2xl font-bold text-blue-700">{formatCurrency(currentCoverage.life)}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">Recommended Need</h4>
                  <p className="text-2xl font-bold text-green-700">{formatCurrency(totalNeed)}</p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-2">Coverage Gap</h4>
                  <p className="text-2xl font-bold text-red-700">{formatCurrency(coverageGap)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="current-life" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="current-life">Current Life Insurance</TabsTrigger>
              <TabsTrigger value="life-calculator">Life Insurance Calculator</TabsTrigger>
              <TabsTrigger value="ci-calculator">CI Calculator</TabsTrigger>
              <TabsTrigger value="di-calculator">DI Calculator</TabsTrigger>
            </TabsList>

            <TabsContent value="current-life" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Life Insurance Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Insurance Provider</label>
                      <Input
                        value={currentLifeInsurance.provider}
                        onChange={(e) => setCurrentLifeInsurance(prev => ({ ...prev, provider: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Policy Type</label>
                      <Input
                        value={currentLifeInsurance.policyType}
                        onChange={(e) => setCurrentLifeInsurance(prev => ({ ...prev, policyType: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Coverage Amount</label>
                      <Input
                        type="number"
                        value={currentLifeInsurance.coverageAmount}
                        onChange={(e) => setCurrentLifeInsurance(prev => ({ ...prev, coverageAmount: Number(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Monthly Premium</label>
                      <Input
                        type="number"
                        value={currentLifeInsurance.monthlyPremium}
                        onChange={(e) => setCurrentLifeInsurance(prev => ({ ...prev, monthlyPremium: Number(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium mb-2 block">Beneficiaries</label>
                      <Input
                        value={currentLifeInsurance.beneficiaries}
                        onChange={(e) => setCurrentLifeInsurance(prev => ({ ...prev, beneficiaries: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-3">Policy Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Annual Premium:</span>
                        <span className="font-medium">{formatCurrency(currentLifeInsurance.monthlyPremium * 12)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coverage Amount:</span>
                        <span className="font-medium">{formatCurrency(currentLifeInsurance.coverageAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cost per $1,000 coverage:</span>
                        <span className="font-medium">{formatCurrency((currentLifeInsurance.monthlyPremium * 12) / (currentLifeInsurance.coverageAmount / 1000))}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="life-calculator" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Life Insurance Needs Calculator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Income Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Annual Income</label>
                      <Input
                        type="number"
                        value={income}
                        onChange={(e) => setIncome(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Income Multiplier</label>
                      <Input
                        type="number"
                        value={incomeMultiplier}
                        onChange={(e) => setIncomeMultiplier(Number(e.target.value))}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended: 8-12x annual income
                      </p>
                    </div>
                  </div>

                  {/* Calculated Income Replacement */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium text-blue-900">Income Replacement:</span>
                      <span className="font-bold text-blue-700">{formatCurrency(income * incomeMultiplier)}</span>
                    </div>
                  </div>

                  {/* Debt and Expense Fields */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Debts and Expenses</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Mortgage</label>
                        <Input
                          type="number"
                          value={mortgage}
                          onChange={(e) => setMortgage(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Child Education</label>
                        <Input
                          type="number"
                          value={childEducation}
                          onChange={(e) => setChildEducation(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Other Debts</label>
                        <Input
                          type="number"
                          value={otherDebts}
                          onChange={(e) => setOtherDebts(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Final Expenses</label>
                        <Input
                          type="number"
                          value={finalExpenses}
                          onChange={(e) => setFinalExpenses(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Taxes</label>
                        <Input
                          type="number"
                          value={taxes}
                          onChange={(e) => setTaxes(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Charity</label>
                        <Input
                          type="number"
                          value={charity}
                          onChange={(e) => setCharity(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-2 block">Other</label>
                        <Input
                          type="number"
                          value={other}
                          onChange={(e) => setOther(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Total Calculation */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-3">Total Life Insurance Need</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Income Replacement:</span>
                        <span className="font-medium">{formatCurrency(income * incomeMultiplier)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mortgage:</span>
                        <span className="font-medium">{formatCurrency(mortgage)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Child Education:</span>
                        <span className="font-medium">{formatCurrency(childEducation)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Other Debts:</span>
                        <span className="font-medium">{formatCurrency(otherDebts)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Final Expenses:</span>
                        <span className="font-medium">{formatCurrency(finalExpenses)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxes:</span>
                        <span className="font-medium">{formatCurrency(taxes)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Charity:</span>
                        <span className="font-medium">{formatCurrency(charity)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Other:</span>
                        <span className="font-medium">{formatCurrency(other)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-bold text-green-900">Total Need:</span>
                        <span className="font-bold text-green-700">{formatCurrency(totalNeed)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Coverage:</span>
                        <span className="font-medium">{formatCurrency(currentCoverage.life)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-bold text-red-900">Coverage Gap:</span>
                        <span className="font-bold text-red-600">{formatCurrency(coverageGap)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ci-calculator" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Critical Illness Insurance Calculator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Annual Income</label>
                      <Input
                        type="number"
                        value={ciIncome}
                        onChange={(e) => setCiIncome(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Income Multiplier</label>
                      <Input
                        type="number"
                        value={ciMultiplier}
                        onChange={(e) => setCiMultiplier(Number(e.target.value))}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended: 2-3x annual income
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Estimated Treatment Costs</label>
                      <Input
                        type="number"
                        value={ciTreatmentCosts}
                        onChange={(e) => setCiTreatmentCosts(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Recovery Period (years)</label>
                      <Input
                        type="number"
                        value={ciRecoveryPeriod}
                        onChange={(e) => setCiRecoveryPeriod(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-900 mb-3">Critical Illness Need Calculation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Income Replacement:</span>
                        <span className="font-medium">{formatCurrency(ciIncome * ciMultiplier)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Treatment Costs:</span>
                        <span className="font-medium">{formatCurrency(ciTreatmentCosts)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recovery Income:</span>
                        <span className="font-medium">{formatCurrency(ciIncome * ciRecoveryPeriod)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-bold text-orange-900">Total CI Need:</span>
                        <span className="font-bold text-orange-700">{formatCurrency(ciTotalNeed)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Coverage:</span>
                        <span className="font-medium">{formatCurrency(currentCoverage.criticalIllness)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-bold text-red-900">Coverage Gap:</span>
                        <span className="font-bold text-red-600">{formatCurrency(ciCoverageGap)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="di-calculator" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Disability Insurance Calculator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Annual Income</label>
                      <Input
                        type="number"
                        value={diIncome}
                        onChange={(e) => setDiIncome(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Coverage Percentage</label>
                      <Input
                        type="number"
                        value={diCoveragePercentage}
                        onChange={(e) => setDiCoveragePercentage(Number(e.target.value))}
                        className="w-full"
                        min={0}
                        max={100}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended: 60-70% of gross income
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Benefit Period (years)</label>
                      <Input
                        type="number"
                        value={diBenefitPeriod}
                        onChange={(e) => setDiBenefitPeriod(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Waiting Period (days)</label>
                      <Input
                        type="number"
                        value={diWaitingPeriod}
                        onChange={(e) => setDiWaitingPeriod(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-3">Disability Insurance Need Calculation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Annual Income:</span>
                        <span className="font-medium">{formatCurrency(diIncome)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coverage Percentage:</span>
                        <span className="font-medium">{diCoveragePercentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Benefit Need:</span>
                        <span className="font-medium">{formatCurrency(diTotalNeed / 12)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-bold text-purple-900">Annual Benefit Need:</span>
                        <span className="font-bold text-purple-700">{formatCurrency(diTotalNeed)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Coverage:</span>
                        <span className="font-medium">{formatCurrency(currentCoverage.disability)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-bold text-red-900">Coverage Gap:</span>
                        <span className="font-bold text-red-600">{formatCurrency(diCoverageGap)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Benefit period of {diBenefitPeriod} years with {diWaitingPeriod} day waiting period. Consider "own occupation" vs "any occupation" definitions when selecting coverage.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
