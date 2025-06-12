
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { DollarSign, Users, Home, GraduationCap, Heart, Calculator } from "lucide-react";

interface FinancialDetailsTabProps {
  financialDetails: {
    grossAnnualIncome: number;
    netAnnualIncome: number;
    spouseIncome: number;
    mortgageBalance: number;
    otherDebts: number;
    emergencyFundMonths: number;
    childrenEducationCost: number;
    charitableDonations: number;
    finalExpenses: number;
    estateTaxes: number;
    yearsToRetirement: number;
    inflationRate: number;
    investmentReturn: number;
    incomeReplacementYears: number;
  };
  setFinancialDetails: (details: any) => void;
}

export const FinancialDetailsTab = ({ financialDetails, setFinancialDetails }: FinancialDetailsTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Income Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Income Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Annual Income (Editable)</label>
            <Input
              type="number"
              value={financialDetails.grossAnnualIncome}
              onChange={(e) => setFinancialDetails(prev => ({
                ...prev,
                grossAnnualIncome: Number(e.target.value)
              }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Income Replacement Years: {financialDetails.incomeReplacementYears} years
            </label>
            <Slider
              value={[financialDetails.incomeReplacementYears]}
              onValueChange={(value) => setFinancialDetails(prev => ({
                ...prev,
                incomeReplacementYears: value[0]
              }))}
              max={20}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Net Annual Income</label>
            <Input
              type="number"
              value={financialDetails.netAnnualIncome}
              onChange={(e) => setFinancialDetails(prev => ({
                ...prev,
                netAnnualIncome: Number(e.target.value)
              }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Spouse Income</label>
            <Input
              type="number"
              value={financialDetails.spouseIncome}
              onChange={(e) => setFinancialDetails(prev => ({
                ...prev,
                spouseIncome: Number(e.target.value)
              }))}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Debts & Liabilities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Debts & Liabilities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Mortgage Balance</label>
            <Input
              type="number"
              value={financialDetails.mortgageBalance}
              onChange={(e) => setFinancialDetails(prev => ({
                ...prev,
                mortgageBalance: Number(e.target.value)
              }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Other Debts</label>
            <Input
              type="number"
              value={financialDetails.otherDebts}
              onChange={(e) => setFinancialDetails(prev => ({
                ...prev,
                otherDebts: Number(e.target.value)
              }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Emergency Fund: {financialDetails.emergencyFundMonths} months
            </label>
            <Slider
              value={[financialDetails.emergencyFundMonths]}
              onValueChange={(value) => setFinancialDetails(prev => ({
                ...prev,
                emergencyFundMonths: value[0]
              }))}
              max={12}
              min={3}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Education & Legacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Education & Legacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Children Education Cost</label>
            <Input
              type="number"
              value={financialDetails.childrenEducationCost}
              onChange={(e) => setFinancialDetails(prev => ({
                ...prev,
                childrenEducationCost: Number(e.target.value)
              }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Annual Charitable Donations</label>
            <Input
              type="number"
              value={financialDetails.charitableDonations}
              onChange={(e) => setFinancialDetails(prev => ({
                ...prev,
                charitableDonations: Number(e.target.value)
              }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Final Expenses</label>
            <Input
              type="number"
              value={financialDetails.finalExpenses}
              onChange={(e) => setFinancialDetails(prev => ({
                ...prev,
                finalExpenses: Number(e.target.value)
              }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Estate Taxes</label>
            <Input
              type="number"
              value={financialDetails.estateTaxes}
              onChange={(e) => setFinancialDetails(prev => ({
                ...prev,
                estateTaxes: Number(e.target.value)
              }))}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Planning Assumptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Planning Assumptions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Years to Retirement: {financialDetails.yearsToRetirement}
            </label>
            <Slider
              value={[financialDetails.yearsToRetirement]}
              onValueChange={(value) => setFinancialDetails(prev => ({
                ...prev,
                yearsToRetirement: value[0]
              }))}
              max={40}
              min={5}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Inflation Rate: {financialDetails.inflationRate}%
            </label>
            <Slider
              value={[financialDetails.inflationRate]}
              onValueChange={(value) => setFinancialDetails(prev => ({
                ...prev,
                inflationRate: value[0]
              }))}
              max={6}
              min={1}
              step={0.1}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Investment Return: {financialDetails.investmentReturn}%
            </label>
            <Slider
              value={[financialDetails.investmentReturn]}
              onValueChange={(value) => setFinancialDetails(prev => ({
                ...prev,
                investmentReturn: value[0]
              }))}
              max={12}
              min={3}
              step={0.1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
