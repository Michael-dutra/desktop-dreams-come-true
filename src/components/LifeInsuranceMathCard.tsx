
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calculator, Edit } from "lucide-react";
import { useState } from "react";

interface LifeInsuranceMathCardProps {
  financialDetails: any;
  coverageFactors: any;
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
  onBreakdownChange?: (breakdown: any) => void;
}

export const LifeInsuranceMathCard = ({ 
  financialDetails, 
  coverageFactors, 
  lifeAnalysis, 
  onBreakdownChange 
}: LifeInsuranceMathCardProps) => {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Life Insurance Need Calculation
          </div>
          <button
            onClick={() => setEditingMode(!editingMode)}
            className="p-1 hover:bg-gray-100 rounded"
            title={editingMode ? "Done editing" : "Edit values"}
          >
            <Edit className="w-4 h-4" />
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};
