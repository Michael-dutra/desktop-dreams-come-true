import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { FinancialDetailsTab } from "./FinancialDetailsTab";
import { AssumptionsTab } from "./AssumptionsTab";
import { CoverageAnalysisTab } from "./CoverageAnalysisTab";

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
    incomeReplacementYears: 10,
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

  // State for current coverage amounts
  const [currentCoverage, setCurrentCoverage] = useState({
    life: [320000],
    critical: [50000], 
    disability: [3000],
  });

  // Custom breakdown state to allow manual editing
  const [customLifeBreakdown, setCustomLifeBreakdown] = useState<any>(null);

  // Calculate comprehensive insurance needs
  const calculateLifeInsuranceNeed = () => {
    const { grossAnnualIncome, mortgageBalance, otherDebts, childrenEducationCost, 
            charitableDonations, finalExpenses, estateTaxes, emergencyFundMonths, 
            netAnnualIncome, incomeReplacementYears } = financialDetails;
    
    // If custom breakdown exists, use it
    if (customLifeBreakdown) {
      const totalNeed = Object.values(customLifeBreakdown).reduce((sum: number, value: unknown) => {
        return sum + (typeof value === 'number' ? value : 0);
      }, 0);
      return {
        totalNeed: Math.round(totalNeed),
        breakdown: customLifeBreakdown
      };
    }
    
    // Otherwise calculate from financial details
    const incomeReplacement = grossAnnualIncome * incomeReplacementYears;
    const debtCoverage = (mortgageBalance + otherDebts) * (coverageFactors.debtCoverage[0] / 100);
    const emergencyNeed = (netAnnualIncome / 12) * emergencyFundMonths * (coverageFactors.emergencyMultiplier[0]);
    const educationNeed = childrenEducationCost * (coverageFactors.educationCoverage[0] / 100);
    const finalExpenseNeed = finalExpenses * (coverageFactors.finalExpenseCoverage[0] / 100);
    const charitableNeed = charitableDonations * (coverageFactors.charitableMultiplier[0]);
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

  // Calculate needs
  const lifeAnalysis = calculateLifeInsuranceNeed();
  const criticalNeed = calculateCriticalIllnessNeed();
  const disabilityNeed = calculateDisabilityNeed();

  // Calculate gaps
  const lifeGap = Math.max(0, lifeAnalysis.totalNeed - currentCoverage.life[0]);
  const criticalGap = Math.max(0, criticalNeed - currentCoverage.critical[0]);
  const disabilityGap = Math.max(0, disabilityNeed - currentCoverage.disability[0]);

  const handleLifeBreakdownChange = (newBreakdown: any) => {
    setCustomLifeBreakdown(newBreakdown);
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
            <FinancialDetailsTab 
              financialDetails={financialDetails}
              setFinancialDetails={setFinancialDetails}
            />
          </TabsContent>

          <TabsContent value="assumptions" className="space-y-6">
            <AssumptionsTab
              incomeMultiples={incomeMultiples}
              setIncomeMultiples={setIncomeMultiples}
              coverageFactors={coverageFactors}
              setCoverageFactors={setCoverageFactors}
              taxDetails={taxDetails}
              setTaxDetails={setTaxDetails}
            />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <CoverageAnalysisTab
              currentCoverage={currentCoverage}
              setCurrentCoverage={setCurrentCoverage}
              lifeAnalysis={lifeAnalysis}
              criticalNeed={criticalNeed}
              disabilityNeed={disabilityNeed}
              lifeGap={lifeGap}
              criticalGap={criticalGap}
              disabilityGap={disabilityGap}
              disabilityReplacementRate={incomeMultiples.disabilityReplacement[0]}
              onLifeBreakdownChange={handleLifeBreakdownChange}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
