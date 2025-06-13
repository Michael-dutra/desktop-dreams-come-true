
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialField } from "./FinancialField";

interface CapitalGainsSectionProps {
  originalValue: number;
  currentValue: number;
  inclusionRate: number;
  taxRate: number;
  onInclusionRateChange: (value: number) => void;
  onTaxRateChange: (value: number) => void;
}

export const CapitalGainsSection = ({
  originalValue,
  currentValue,
  inclusionRate,
  taxRate,
  onInclusionRateChange,
  onTaxRateChange
}: CapitalGainsSectionProps) => {
  const capitalGain = currentValue - originalValue;
  const taxableGain = capitalGain * (inclusionRate / 100);
  const estimatedTax = taxableGain * (taxRate / 100);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Capital Gains Calculation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FinancialField
            fieldId="capital-gain"
            value={capitalGain}
            label="Capital Gain"
            isEditable={false}
            isAutoCalculated={true}
          />
          <FinancialField
            fieldId="inclusion-rate"
            value={inclusionRate}
            label="Inclusion Rate"
            prefix=""
            onChange={onInclusionRateChange}
          />
          <FinancialField
            fieldId="tax-rate"
            value={taxRate}
            label="Tax Rate"
            prefix=""
            onChange={onTaxRateChange}
          />
          <FinancialField
            fieldId="estimated-tax"
            value={estimatedTax}
            label="Estimated Capital Gains Tax"
            isEditable={false}
            isAutoCalculated={true}
          />
        </div>
      </CardContent>
    </Card>
  );
};
