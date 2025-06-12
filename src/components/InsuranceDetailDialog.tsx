import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Shield, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface InsuranceDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InsuranceDetailDialog = ({ isOpen, onClose }: InsuranceDetailDialogProps) => {
  // Editable fields for life insurance calculator
  const [income, setIncome] = useState(65000);
  const [incomeMultiplier, setIncomeMultiplier] = useState(10);
  const [mortgage, setMortgage] = useState(445500);
  const [childEducation, setChildEducation] = useState(120000);
  const [otherDebts, setOtherDebts] = useState(25000);
  const [finalExpenses, setFinalExpenses] = useState(15000);
  const [taxes, setTaxes] = useState(50000);
  const [charity, setCharity] = useState(10000);
  const [other, setOther] = useState(5000);

  const currentCoverage = {
    life: 320000,
    criticalIllness: 100000,
    disability: 0
  };

  // Calculate total life insurance need based on user inputs
  const calculateTotalNeed = () => {
    const incomeReplacement = income * incomeMultiplier;
    return incomeReplacement + mortgage + childEducation + otherDebts + finalExpenses + taxes + charity + other;
  };

  const totalNeed = calculateTotalNeed();
  const coverageGap = totalNeed - currentCoverage.life;

  const recommendedCoverage = {
    life: totalNeed,
    criticalIllness: 200000,
    disability: 39000
  };

  const coverageGaps = {
    life: coverageGap,
    criticalIllness: recommendedCoverage.criticalIllness - currentCoverage.criticalIllness,
    disability: recommendedCoverage.disability - currentCoverage.disability
  };

  const coverageComparison = [
    { 
      type: "Life Insurance", 
      current: currentCoverage.life, 
      recommended: recommendedCoverage.life, 
      gap: coverageGaps.life,
      status: coverageGaps.life > 0 ? "underinsured" : "adequate"
    },
    { 
      type: "Critical Illness", 
      current: currentCoverage.criticalIllness, 
      recommended: recommendedCoverage.criticalIllness, 
      gap: coverageGaps.criticalIllness,
      status: coverageGaps.criticalIllness > 0 ? "underinsured" : "adequate"
    },
    { 
      type: "Disability", 
      current: currentCoverage.disability, 
      recommended: recommendedCoverage.disability, 
      gap: coverageGaps.disability,
      status: coverageGaps.disability > 0 ? "underinsured" : "adequate"
    }
  ];

  const chartConfig = {
    current: { label: "Current Coverage", color: "#3b82f6" },
    recommended: { label: "Recommended Coverage", color: "#ef4444" },
    gap: { label: "Coverage Gap", color: "#f59e0b" }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Insurance</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Simplified Life Insurance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Life Insurance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Current Coverage</h4>
                  <p className="text-2xl font-bold text-blue-700">{formatCurrency(currentCoverage.life)}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">Recommended Need</h4>
                  <p className="text-2xl font-bold text-green-700">{formatCurrency(totalNeed)}</p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-2">Coverage Gap</h4>
                  <p className="text-2xl font-bold text-red-700">{formatCurrency(coverageGap)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="life-calculator" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="life-calculator">Life Insurance Calculator</TabsTrigger>
              <TabsTrigger value="ci-disability">CI & Disability</TabsTrigger>
              <TabsTrigger value="coverage-comparison">Coverage Comparison</TabsTrigger>
            </TabsList>

            <TabsContent value="life-calculator" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Life Insurance Needs Calculator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Income Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Annual Income</label>
                      <Input
                        type="number"
                        value={income}
                        onChange={(e) => setIncome(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Income Multiplier</label>
                      <Input
                        type="number"
                        value={incomeMultiplier}
                        onChange={(e) => setIncomeMultiplier(Number(e.target.value))}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended: 8-12x annual income
                      </p>
                    </div>
                  </div>

                  {/* Calculated Income Replacement */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium text-blue-900">Income Replacement:</span>
                      <span className="font-bold text-blue-700">{formatCurrency(income * incomeMultiplier)}</span>
                    </div>
                  </div>

                  {/* Debt and Expense Fields */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Debts and Expenses</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Mortgage</label>
                        <Input
                          type="number"
                          value={mortgage}
                          onChange={(e) => setMortgage(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Child Education</label>
                        <Input
                          type="number"
                          value={childEducation}
                          onChange={(e) => setChildEducation(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Other Debts</label>
                        <Input
                          type="number"
                          value={otherDebts}
                          onChange={(e) => setOtherDebts(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Final Expenses</label>
                        <Input
                          type="number"
                          value={finalExpenses}
                          onChange={(e) => setFinalExpenses(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Taxes</label>
                        <Input
                          type="number"
                          value={taxes}
                          onChange={(e) => setTaxes(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Charity</label>
                        <Input
                          type="number"
                          value={charity}
                          onChange={(e) => setCharity(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-2 block">Other</label>
                        <Input
                          type="number"
                          value={other}
                          onChange={(e) => setOther(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Total Calculation */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-3">Total Life Insurance Need</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Income Replacement:</span>
                        <span className="font-medium">{formatCurrency(income * incomeMultiplier)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mortgage:</span>
                        <span className="font-medium">{formatCurrency(mortgage)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Child Education:</span>
                        <span className="font-medium">{formatCurrency(childEducation)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Other Debts:</span>
                        <span className="font-medium">{formatCurrency(otherDebts)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Final Expenses:</span>
                        <span className="font-medium">{formatCurrency(finalExpenses)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxes:</span>
                        <span className="font-medium">{formatCurrency(taxes)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Charity:</span>
                        <span className="font-medium">{formatCurrency(charity)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Other:</span>
                        <span className="font-medium">{formatCurrency(other)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-bold text-green-900">Total Need:</span>
                        <span className="font-bold text-green-700">{formatCurrency(totalNeed)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Coverage:</span>
                        <span className="font-medium">{formatCurrency(currentCoverage.life)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-bold text-red-900">Coverage Gap:</span>
                        <span className="font-bold text-red-600">{formatCurrency(coverageGap)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ci-disability" className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Critical Illness Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Current Coverage</span>
                        <span className="font-medium">{formatCurrency(currentCoverage.criticalIllness)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Recommended Coverage</span>
                        <span className="font-medium">{formatCurrency(recommendedCoverage.criticalIllness)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Coverage Gap</span>
                        <span className="font-bold text-red-600">{formatCurrency(coverageGaps.criticalIllness)}</span>
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-sm text-orange-800">
                        <strong>Recommendation:</strong> CI coverage should be 2-3x annual income to cover treatment costs and income replacement during recovery.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Disability Insurance Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Current Coverage</span>
                        <span className="font-medium">{formatCurrency(currentCoverage.disability)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Recommended Coverage</span>
                        <span className="font-medium">{formatCurrency(recommendedCoverage.disability)} annually</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Coverage Gap</span>
                        <span className="font-bold text-red-600">{formatCurrency(coverageGaps.disability)} annually</span>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Critical Gap:</strong> No disability coverage currently in place. Recommended coverage is 60-70% of gross income.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="coverage-comparison" className="space-y-6">
              
              <Card>
                <CardHeader>
                  <CardTitle>Coverage Comparison: Current vs Recommended</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {coverageComparison.map((coverage, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{coverage.type}</h4>
                          <div className="flex items-center space-x-2">
                            {coverage.status === "underinsured" ? (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                            <span className={`text-sm font-medium ${
                              coverage.status === "underinsured" ? "text-red-600" : "text-green-600"
                            }`}>
                              {coverage.status === "underinsured" ? "Underinsured" : "Adequate"}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground block">Current</span>
                            <span className="font-medium">{formatCurrency(coverage.current)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Recommended</span>
                            <span className="font-medium">{formatCurrency(coverage.recommended)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Gap</span>
                            <span className={`font-medium ${coverage.gap > 0 ? "text-red-600" : "text-green-600"}`}>
                              {coverage.gap > 0 ? formatCurrency(coverage.gap) : "Adequate"}
                            </span>
                          </div>
                        </div>
                        
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              coverage.current >= coverage.recommended ? "bg-green-500" : "bg-red-500"
                            }`}
                            style={{ 
                              width: `${Math.min((coverage.current / coverage.recommended) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-900">Priority 1: Increase Life Insurance</p>
                        <p className="text-sm text-red-700">Add {formatCurrency(coverageGaps.life)} in life insurance coverage to protect family's financial security.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-900">Priority 2: Add Disability Insurance</p>
                        <p className="text-sm text-yellow-700">Implement disability coverage for {formatCurrency(recommendedCoverage.disability)} annual benefit.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-orange-900">Priority 3: Enhance Critical Illness</p>
                        <p className="text-sm text-orange-700">Increase critical illness coverage by {formatCurrency(coverageGaps.criticalIllness)}.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
