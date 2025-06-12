import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Calculator, Edit } from "lucide-react";
import { useState } from "react";
import { LifeInsuranceCalculator } from "./LifeInsuranceCalculator";
import { CoverageAnalysisTab } from "./CoverageAnalysisTab";

interface InsuranceDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FinancialDetails {
  grossAnnualIncome: number;
  netAnnualIncome: number;
  mortgageBalance: number;
  otherDebts: number;
  childrenEducationCost: number;
  finalExpenses: number;
  charitableDonations: number;
  estateTaxes: number;
  incomeReplacementYears: number;
  emergencyFundMonths: number;
}

interface CoverageFactors {
  debtCoverage: number[];
  emergencyMultiplier: number[];
  educationCoverage: number[];
  finalExpenseCoverage: number[];
  charitableMultiplier: number[];
}

interface LifeAnalysis {
  totalNeed: number;
  breakdown: {
    incomeReplacement: number;
    debtCoverage: number;
    emergencyNeed: number;
    educationNeed: number;
    finalExpenseNeed: number;
    charitableNeed: number;
    estateTaxNeed: number;
  };
}

export const InsuranceDetailDialog = ({ isOpen, onClose }: InsuranceDetailDialogProps) => {
  const [financialDetails, setFinancialDetails] = useState({
    grossAnnualIncome: 80000,
    netAnnualIncome: 60000,
    mortgageBalance: 250000,
    otherDebts: 50000,
    childrenEducationCost: 40000,
    finalExpenses: 10000,
    charitableDonations: 5000,
    estateTaxes: 15000,
    incomeReplacementYears: 10,
    emergencyFundMonths: 6,
  });

  const [coverageFactors, setCoverageFactors] = useState({
    debtCoverage: [80],
    emergencyMultiplier: [1.2],
    educationCoverage: [75],
    finalExpenseCoverage: [100],
    charitableMultiplier: [5],
  });

  const [currentCoverage, setCurrentCoverage] = useState({
    life: [320000],
    critical: [50000],
    disability: [3000],
  });

  const [lifeAnalysis, setLifeAnalysis] = useState({
    totalNeed: 750000,
    breakdown: {
      incomeReplacement: 500000,
      debtCoverage: 240000,
      emergencyNeed: 36000,
      educationNeed: 30000,
      finalExpenseNeed: 10000,
      charitableNeed: 25000,
      estateTaxNeed: 15000,
    },
  });

  const handleBreakdownChange = (newBreakdown: any) => {
    setLifeAnalysis(prev => ({ ...prev, breakdown: newBreakdown }));
  };

  // Calculate insurance needs
  const criticalNeed = 150000;
  const disabilityNeed = 4500;
  const lifeGap = Math.max(0, lifeAnalysis.totalNeed - currentCoverage.life[0]);
  const criticalGap = Math.max(0, criticalNeed - currentCoverage.critical[0]);
  const disabilityGap = Math.max(0, disabilityNeed - currentCoverage.disability[0]);
  const disabilityReplacementRate = (currentCoverage.disability[0] / financialDetails.netAnnualIncome) * 12 * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Insurance Details</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList>
            <TabsTrigger value="calculator">Life Insurance Calculator</TabsTrigger>
            <TabsTrigger value="coverage">Coverage Analysis</TabsTrigger>
            <TabsTrigger value="details">Financial Details</TabsTrigger>
            <TabsTrigger value="factors">Coverage Factors</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <LifeInsuranceCalculator />
          </TabsContent>

          <TabsContent value="coverage" className="space-y-6">
            <CoverageAnalysisTab 
              currentCoverage={currentCoverage}
              setCurrentCoverage={setCurrentCoverage}
              lifeAnalysis={lifeAnalysis}
              criticalNeed={criticalNeed}
              disabilityNeed={disabilityNeed}
              lifeGap={lifeGap}
              criticalGap={criticalGap}
              disabilityGap={disabilityGap}
              disabilityReplacementRate={disabilityReplacementRate}
              onLifeBreakdownChange={handleBreakdownChange}
              financialDetails={financialDetails}
              coverageFactors={coverageFactors}
            />
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  <Label htmlFor="grossIncome">Gross Annual Income</Label>
                  <Input type="number" id="grossIncome" value={financialDetails.grossAnnualIncome} onChange={(e) => setFinancialDetails({ ...financialDetails, grossAnnualIncome: parseInt(e.target.value) })} />
                </div>
                <div>
                  <Label htmlFor="netIncome">Net Annual Income</Label>
                  <Input type="number" id="netIncome" value={financialDetails.netAnnualIncome} onChange={(e) => setFinancialDetails({ ...financialDetails, netAnnualIncome: parseInt(e.target.value) })} />
                </div>
                <div>
                  <Label htmlFor="mortgage">Mortgage Balance</Label>
                  <Input type="number" id="mortgage" value={financialDetails.mortgageBalance} onChange={(e) => setFinancialDetails({ ...financialDetails, mortgageBalance: parseInt(e.target.value) })} />
                </div>
                <div>
                  <Label htmlFor="otherDebts">Other Debts</Label>
                  <Input type="number" id="otherDebts" value={financialDetails.otherDebts} onChange={(e) => setFinancialDetails({ ...financialDetails, otherDebts: parseInt(e.target.value) })} />
                </div>
                <div>
                  <Label htmlFor="educationCost">Children Education Cost</Label>
                  <Input type="number" id="educationCost" value={financialDetails.childrenEducationCost} onChange={(e) => setFinancialDetails({ ...financialDetails, childrenEducationCost: parseInt(e.target.value) })} />
                </div>
                <div>
                  <Label htmlFor="finalExpenses">Final Expenses</Label>
                  <Input type="number" id="finalExpenses" value={financialDetails.finalExpenses} onChange={(e) => setFinancialDetails({ ...financialDetails, finalExpenses: parseInt(e.target.value) })} />
                </div>
                <div>
                  <Label htmlFor="charitableDonations">Charitable Donations</Label>
                  <Input type="number" id="charitableDonations" value={financialDetails.charitableDonations} onChange={(e) => setFinancialDetails({ ...financialDetails, charitableDonations: parseInt(e.target.value) })} />
                </div>
                <div>
                  <Label htmlFor="estateTaxes">Estate Taxes</Label>
                  <Input type="number" id="estateTaxes" value={financialDetails.estateTaxes} onChange={(e) => setFinancialDetails({ ...financialDetails, estateTaxes: parseInt(e.target.value) })} />
                </div>
                <div>
                  <Label htmlFor="incomeReplacementYears">Income Replacement Years</Label>
                  <Input type="number" id="incomeReplacementYears" value={financialDetails.incomeReplacementYears} onChange={(e) => setFinancialDetails({ ...financialDetails, incomeReplacementYears: parseInt(e.target.value) })} />
                </div>
                <div>
                  <Label htmlFor="emergencyFundMonths">Emergency Fund Months</Label>
                  <Input type="number" id="emergencyFundMonths" value={financialDetails.emergencyFundMonths} onChange={(e) => setFinancialDetails({ ...financialDetails, emergencyFundMonths: parseInt(e.target.value) })} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="factors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Coverage Factors</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  <Label htmlFor="debtCoverage">Debt Coverage (%)</Label>
                  <Slider value={coverageFactors.debtCoverage} onValueChange={(value) => setCoverageFactors({ ...coverageFactors, debtCoverage: value })} max={100} />
                </div>
                <div>
                  <Label htmlFor="emergencyMultiplier">Emergency Multiplier</Label>
                  <Slider value={coverageFactors.emergencyMultiplier} onValueChange={(value) => setCoverageFactors({ ...coverageFactors, emergencyMultiplier: value })} max={2} step={0.1} />
                </div>
                <div>
                  <Label htmlFor="educationCoverage">Education Coverage (%)</Label>
                  <Slider value={coverageFactors.educationCoverage} onValueChange={(value) => setCoverageFactors({ ...coverageFactors, educationCoverage: value })} max={100} />
                </div>
                <div>
                  <Label htmlFor="finalExpenseCoverage">Final Expense Coverage (%)</Label>
                  <Slider value={coverageFactors.finalExpenseCoverage} onValueChange={(value) => setCoverageFactors({ ...coverageFactors, finalExpenseCoverage: value })} max={100} />
                </div>
                <div>
                  <Label htmlFor="charitableMultiplier">Charitable Multiplier</Label>
                  <Slider value={coverageFactors.charitableMultiplier} onValueChange={(value) => setCoverageFactors({ ...coverageFactors, charitableMultiplier: value })} max={10} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
