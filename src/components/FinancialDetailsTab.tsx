
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Users } from "lucide-react";

interface FinancialDetails {
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
}

interface FinancialDetailsTabProps {
  financialDetails: FinancialDetails;
  setFinancialDetails: (details: FinancialDetails | ((prev: FinancialDetails) => FinancialDetails)) => void;
}

export const FinancialDetailsTab = ({ financialDetails, setFinancialDetails }: FinancialDetailsTabProps) => {
  return (
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
  );
};
