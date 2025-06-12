import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calculator, DollarSign, FileText } from "lucide-react";

export const LifeInsuranceCalculator = () => {
  const [income, setIncome] = useState(75000);
  const [yearsCovered, setYearsCovered] = useState([10]);
  const [currentCoverage, setCurrentCoverage] = useState(100000);
  const [mortgage, setMortgage] = useState(250000);
  const [otherDebts, setOtherDebts] = useState(30000);
  const [kidsEducation, setKidsEducation] = useState(50000);
  const [charitableDonations, setCharitableDonations] = useState(10000);
  const [finalExpenses, setFinalExpenses] = useState(15000);
  const [other, setOther] = useState(20000);
  const [showWriteUp, setShowWriteUp] = useState(false);

  // Calculate total need
  const incomeNeed = income * yearsCovered[0];
  const totalNeed = incomeNeed + mortgage + otherDebts + kidsEducation + charitableDonations + finalExpenses + other;
  const shortage = Math.max(0, totalNeed - currentCoverage);
  const surplus = Math.max(0, currentCoverage - totalNeed);

  const generateWriteUp = () => {
    const coverageStatus = shortage > 0 ? `shortfall of ${formatCurrency(shortage)}` : 
                          surplus > 0 ? `surplus of ${formatCurrency(surplus)}` : 'adequate coverage';
    
    return `Life Insurance Analysis Summary

Based on our comprehensive analysis of your financial situation, here are the key findings:

**Current Financial Profile:**
Your annual income of ${formatCurrency(income)} supports your family's lifestyle and financial goals. We've calculated your insurance needs based on ${yearsCovered[0]} years of income replacement, which amounts to ${formatCurrency(incomeNeed)}.

**Total Protection Needs:**
Your total life insurance need is ${formatCurrency(totalNeed)}, which includes:
- Income replacement: ${formatCurrency(incomeNeed)}
- Mortgage balance: ${formatCurrency(mortgage)}
- Other debts: ${formatCurrency(otherDebts)}
- Children's education: ${formatCurrency(kidsEducation)}
- Final expenses: ${formatCurrency(finalExpenses)}
- Charitable giving: ${formatCurrency(charitableDonations)}
- Other financial needs: ${formatCurrency(other)}

**Coverage Analysis:**
You currently have ${formatCurrency(currentCoverage)} in life insurance coverage. This analysis reveals a ${coverageStatus}. ${shortage > 0 ? `We recommend securing additional coverage to ensure your family's financial security.` : surplus > 0 ? `Your current coverage exceeds your calculated needs, providing extra financial security.` : `Your current coverage aligns well with your calculated needs.`}

**Next Steps:**
${shortage > 0 ? `Consider reviewing term life insurance options to bridge the coverage gap efficiently and cost-effectively.` : `Review your coverage annually to ensure it continues to meet your family's evolving needs.`}`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleNumberInput = (value: string, setter: (val: number) => void) => {
    const numValue = parseInt(value.replace(/,/g, '')) || 0;
    setter(numValue);
  };

  const getBarWidth = (amount: number, maxAmount: number) => {
    return Math.min((amount / maxAmount) * 100, 100);
  };

  const maxVisualizationAmount = Math.max(totalNeed, currentCoverage);

  const categories = [
    { label: "Income Replacement", value: incomeNeed, color: "bg-blue-500" },
    { label: "Mortgage", value: mortgage, color: "bg-red-500" },
    { label: "Other Debts", value: otherDebts, color: "bg-orange-500" },
    { label: "Kids Education", value: kidsEducation, color: "bg-green-500" },
    { label: "Charitable Donations", value: charitableDonations, color: "bg-purple-500" },
    { label: "Final Expenses", value: finalExpenses, color: "bg-yellow-500" },
    { label: "Other", value: other, color: "bg-pink-500" },
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-xl">
            <Calculator className="h-6 w-6 mr-2" />
            Life Insurance Calculator
          </CardTitle>
          <Button 
            onClick={() => setShowWriteUp(!showWriteUp)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Get Write Up
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showWriteUp && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg">Client Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generateWriteUp()}
                readOnly
                className="min-h-[300px] text-sm"
              />
            </CardContent>
          </Card>
        )}

        {/* Income and Years Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="income">Annual Income</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="income"
                type="text"
                value={income.toLocaleString()}
                onChange={(e) => handleNumberInput(e.target.value, setIncome)}
                className="pl-10"
                placeholder="Enter annual income"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Years of Income Replacement: {yearsCovered[0]} years</Label>
            <Slider
              value={yearsCovered}
              onValueChange={setYearsCovered}
              max={30}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 year</span>
              <span>30 years</span>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentCoverage">Current Coverage</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="currentCoverage"
                type="text"
                value={currentCoverage.toLocaleString()}
                onChange={(e) => handleNumberInput(e.target.value, setCurrentCoverage)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mortgage">Mortgage Balance</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="mortgage"
                type="text"
                value={mortgage.toLocaleString()}
                onChange={(e) => handleNumberInput(e.target.value, setMortgage)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherDebts">Other Debts</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="otherDebts"
                type="text"
                value={otherDebts.toLocaleString()}
                onChange={(e) => handleNumberInput(e.target.value, setOtherDebts)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="kidsEducation">Kids Education</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="kidsEducation"
                type="text"
                value={kidsEducation.toLocaleString()}
                onChange={(e) => handleNumberInput(e.target.value, setKidsEducation)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="charitableDonations">Charitable Donations</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="charitableDonations"
                type="text"
                value={charitableDonations.toLocaleString()}
                onChange={(e) => handleNumberInput(e.target.value, setCharitableDonations)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="finalExpenses">Final Expenses & Taxes</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="finalExpenses"
                type="text"
                value={finalExpenses.toLocaleString()}
                onChange={(e) => handleNumberInput(e.target.value, setFinalExpenses)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2 lg:col-span-1">
            <Label htmlFor="other">Other Needs</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="other"
                type="text"
                value={other.toLocaleString()}
                onChange={(e) => handleNumberInput(e.target.value, setOther)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Animated Visual Comparison */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Coverage Analysis</h3>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-blue-600 font-medium">Total Need</p>
                <p className="text-2xl font-bold text-blue-700">{formatCurrency(totalNeed)}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-green-600 font-medium">Current Coverage</p>
                <p className="text-2xl font-bold text-green-700">{formatCurrency(currentCoverage)}</p>
              </CardContent>
            </Card>
            
            <Card className={shortage > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}>
              <CardContent className="p-4 text-center">
                <p className={`text-sm font-medium ${shortage > 0 ? "text-red-600" : "text-green-600"}`}>
                  {shortage > 0 ? "Coverage Shortage" : surplus > 0 ? "Coverage Surplus" : "Perfectly Covered"}
                </p>
                <p className={`text-2xl font-bold ${shortage > 0 ? "text-red-700" : "text-green-700"}`}>
                  {shortage > 0 ? formatCurrency(shortage) : surplus > 0 ? formatCurrency(surplus) : formatCurrency(0)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <div className="space-y-4">
            <h4 className="font-medium">Need Breakdown</h4>
            {categories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{category.label}</span>
                  <span className="font-medium">{formatCurrency(category.value)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${category.color} transition-all duration-700 ease-out animate-fade-in`}
                    style={{ 
                      width: `${getBarWidth(category.value, maxVisualizationAmount)}%`,
                      animationDelay: `${index * 100}ms`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Coverage Comparison */}
          <div className="space-y-4">
            <h4 className="font-medium">Coverage Comparison</h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Insurance Need</span>
                  <span className="font-medium text-blue-600">{formatCurrency(totalNeed)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-1000 ease-out"
                    style={{ width: `${getBarWidth(totalNeed, maxVisualizationAmount)}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Coverage</span>
                  <span className="font-medium text-green-600">{formatCurrency(currentCoverage)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${getBarWidth(currentCoverage, maxVisualizationAmount)}%`,
                      animationDelay: '500ms'
                    }}
                  ></div>
                </div>
              </div>

              {shortage > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Coverage Gap</span>
                    <span className="font-medium text-red-600">{formatCurrency(shortage)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all duration-1000 ease-out animate-pulse"
                      style={{ 
                        width: `${getBarWidth(shortage, maxVisualizationAmount)}%`,
                        animationDelay: '1000ms'
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
