import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Calculator, Edit } from "lucide-react";
import { useState } from "react";

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

const CoverageAnalysisTab = ({
  financialDetails,
  coverageFactors,
  lifeAnalysis,
  onBreakdownChange
}: {
  financialDetails: FinancialDetails;
  coverageFactors: CoverageFactors;
  lifeAnalysis: LifeAnalysis;
  onBreakdownChange?: (breakdown: any) => void;
}) => {
  const [editingMode, setEditingMode] = useState(false);
  const [localBreakdown, setLocalBreakdown] = useState(lifeAnalysis.breakdown);

  const handleValueChange = (key: string, value: string) => {
    const numValue = parseInt(value.replace(/,/g, '')) || 0;
    const newBreakdown = { ...localBreakdown, [key]: numValue };
    setLocalBreakdown(newBreakdown);

    if (onBreakdownChange) {
      onBreakdownChange(newBreakdown);
    }
  };

  const mathFormulas = [
    {
      label: "Income Replacement",
      formula: `$${financialDetails.grossAnnualIncome.toLocaleString()} × ${financialDetails.incomeReplacementYears} years`,
      value: lifeAnalysis.breakdown.incomeReplacement,
      key: "incomeReplacement"
    },
    {
      label: "Debt Coverage",
      formula: `($${financialDetails.mortgageBalance.toLocaleString()} + $${financialDetails.otherDebts.toLocaleString()}) × ${coverageFactors.debtCoverage[0]}%`,
      value: lifeAnalysis.breakdown.debtCoverage,
      key: "debtCoverage"
    },
    {
      label: "Emergency Fund",
      formula: `($${financialDetails.netAnnualIncome.toLocaleString()} ÷ 12) × ${financialDetails.emergencyFundMonths} months × ${coverageFactors.emergencyMultiplier[0]}`,
      value: lifeAnalysis.breakdown.emergencyNeed,
      key: "emergencyNeed"
    },
    {
      label: "Education Costs",
      formula: `$${financialDetails.childrenEducationCost.toLocaleString()} × ${coverageFactors.educationCoverage[0]}%`,
      value: lifeAnalysis.breakdown.educationNeed,
      key: "educationNeed"
    },
    {
      label: "Final Expenses",
      formula: `$${financialDetails.finalExpenses.toLocaleString()} × ${coverageFactors.finalExpenseCoverage[0]}%`,
      value: lifeAnalysis.breakdown.finalExpenseNeed,
      key: "finalExpenseNeed"
    },
    {
      label: "Charitable Legacy",
      formula: `$${financialDetails.charitableDonations.toLocaleString()} × ${coverageFactors.charitableMultiplier[0]}`,
      value: lifeAnalysis.breakdown.charitableNeed,
      key: "charitableNeed"
    },
    {
      label: "Estate Taxes",
      formula: `$${financialDetails.estateTaxes.toLocaleString()}`,
      value: lifeAnalysis.breakdown.estateTaxNeed,
      key: "estateTaxNeed"
    }
  ];

  return (
    <div className="space-y-4">
      {mathFormulas.map((item, index) => (
        <div key={index} className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{item.label}</h4>
              <p className="text-sm text-gray-600 mt-1">{item.formula}</p>
            </div>
            <div className="text-right">
              {editingMode ? (
                <Input
                  type="text"
                  value={localBreakdown[item.key as keyof typeof localBreakdown]?.toLocaleString() || '0'}
                  onChange={(e) => handleValueChange(item.key, e.target.value)}
                  className="w-28 text-right"
                />
              ) : (
                <p className="text-lg font-bold text-blue-600">
                  ${localBreakdown[item.key as keyof typeof localBreakdown]?.toLocaleString() || '0'}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Total */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-blue-900">Total Life Insurance Need</h4>
          <p className="text-xl font-bold text-blue-600">
            ${Object.values(localBreakdown).reduce((sum, val) => sum + (val || 0), 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

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

  const totalNeed = Object.values(lifeAnalysis.breakdown).reduce((sum: number, val: number) => sum + (val || 0), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Insurance Details</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="coverage" className="w-full">
          <TabsList>
            <TabsTrigger value="coverage">Coverage Analysis</TabsTrigger>
            <TabsTrigger value="details">Financial Details</TabsTrigger>
            <TabsTrigger value="factors">Coverage Factors</TabsTrigger>
          </TabsList>

          <TabsContent value="coverage" className="space-y-6">
            <CoverageAnalysisTab 
              financialDetails={financialDetails}
              coverageFactors={coverageFactors}
              lifeAnalysis={lifeAnalysis}
              onBreakdownChange={handleBreakdownChange}
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
