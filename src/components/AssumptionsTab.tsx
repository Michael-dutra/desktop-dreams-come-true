
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface IncomeMultiples {
  lifeInsurance: number[];
  criticalIllness: number[];
  disabilityReplacement: number[];
}

interface CoverageFactors {
  debtCoverage: number[];
  educationCoverage: number[];
  emergencyMultiplier: number[];
  finalExpenseCoverage: number[];
  charitableMultiplier: number[];
}

interface TaxDetails {
  marginalTaxRate: number[];
  estateTaxRate: number[];
  insuranceTaxFree: boolean;
}

interface AssumptionsTabProps {
  incomeMultiples: IncomeMultiples;
  setIncomeMultiples: (multiples: IncomeMultiples | ((prev: IncomeMultiples) => IncomeMultiples)) => void;
  coverageFactors: CoverageFactors;
  setCoverageFactors: (factors: CoverageFactors | ((prev: CoverageFactors) => CoverageFactors)) => void;
  taxDetails: TaxDetails;
  setTaxDetails: (details: TaxDetails | ((prev: TaxDetails) => TaxDetails)) => void;
}

export const AssumptionsTab = ({ 
  incomeMultiples, 
  setIncomeMultiples, 
  coverageFactors, 
  setCoverageFactors, 
  taxDetails, 
  setTaxDetails 
}: AssumptionsTabProps) => {
  return (
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
  );
};
