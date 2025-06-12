
import { Card, CardContent } from "@/components/ui/card";
import { InsuranceAnalysisCard } from "./InsuranceAnalysisCard";
import { RecommendationsCard } from "./RecommendationsCard";
import { LifeInsuranceMathCard } from "./LifeInsuranceMathCard";

interface CoverageAnalysisTabProps {
  currentCoverage: {
    life: number[];
    critical: number[];
    disability: number[];
  };
  setCurrentCoverage: (coverage: any) => void;
  lifeAnalysis: {
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
  };
  criticalNeed: number;
  disabilityNeed: number;
  lifeGap: number;
  criticalGap: number;
  disabilityGap: number;
  disabilityReplacementRate: number;
  onLifeBreakdownChange?: (breakdown: any) => void;
  financialDetails: any;
  coverageFactors: any;
}

export const CoverageAnalysisTab = ({
  currentCoverage,
  setCurrentCoverage,
  lifeAnalysis,
  criticalNeed,
  disabilityNeed,
  lifeGap,
  criticalGap,
  disabilityGap,
  disabilityReplacementRate,
  onLifeBreakdownChange,
  financialDetails,
  coverageFactors
}: CoverageAnalysisTabProps) => {
  // Chart data with better visual colors
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

  const lifeBreakdown = [
    { label: "Income Replacement", amount: lifeAnalysis.breakdown.incomeReplacement },
    { label: "Debt Coverage", amount: lifeAnalysis.breakdown.debtCoverage },
    { label: "Emergency Fund", amount: lifeAnalysis.breakdown.emergencyNeed },
    { label: "Education Costs", amount: lifeAnalysis.breakdown.educationNeed },
    { label: "Final Expenses", amount: lifeAnalysis.breakdown.finalExpenseNeed },
    { label: "Charitable Legacy", amount: lifeAnalysis.breakdown.charitableNeed },
    { label: "Estate Taxes", amount: lifeAnalysis.breakdown.estateTaxNeed },
  ];

  const handleLifeBreakdownChange = (index: number, value: number) => {
    if (onLifeBreakdownChange) {
      const keys = ['incomeReplacement', 'debtCoverage', 'emergencyNeed', 'educationNeed', 'finalExpenseNeed', 'charitableNeed', 'estateTaxNeed'];
      const newBreakdown = { ...lifeAnalysis.breakdown };
      newBreakdown[keys[index] as keyof typeof newBreakdown] = value;
      onLifeBreakdownChange(newBreakdown);
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Life Insurance Math Breakdown */}
      <LifeInsuranceMathCard
        financialDetails={financialDetails}
        coverageFactors={coverageFactors}
        lifeAnalysis={lifeAnalysis}
        onBreakdownChange={onLifeBreakdownChange}
      />

      {/* Life Insurance Analysis */}
      <InsuranceAnalysisCard
        title="Life Insurance Coverage Analysis"
        currentCoverage={currentCoverage.life}
        onCoverageChange={(value) => setCurrentCoverage(prev => ({...prev, life: value}))}
        calculatedNeed={lifeAnalysis.totalNeed}
        gap={lifeGap}
        chartData={lifeInsuranceData}
        maxSlider={2000000}
        stepSlider={25000}
        breakdown={lifeBreakdown}
        onBreakdownChange={handleLifeBreakdownChange}
      />

      {/* Critical Illness Analysis */}
      <InsuranceAnalysisCard
        title="Critical Illness Coverage Analysis"
        currentCoverage={currentCoverage.critical}
        onCoverageChange={(value) => setCurrentCoverage(prev => ({...prev, critical: value}))}
        calculatedNeed={criticalNeed}
        gap={criticalGap}
        chartData={criticalIllnessData}
        maxSlider={500000}
        stepSlider={10000}
      />

      {/* Disability Insurance Analysis */}
      <InsuranceAnalysisCard
        title="Disability Insurance Coverage Analysis"
        currentCoverage={currentCoverage.disability}
        onCoverageChange={(value) => setCurrentCoverage(prev => ({...prev, disability: value}))}
        calculatedNeed={disabilityNeed}
        gap={disabilityGap}
        chartData={disabilityInsuranceData}
        unit="/month"
        maxSlider={10000}
        stepSlider={250}
      />

      {/* Recommendations */}
      <RecommendationsCard
        lifeGap={lifeGap}
        criticalGap={criticalGap}
        disabilityGap={disabilityGap}
        disabilityReplacementRate={disabilityReplacementRate}
      />
    </div>
  );
};
