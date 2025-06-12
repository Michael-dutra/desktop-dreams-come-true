
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Shield, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface InsuranceDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InsuranceDetailDialog = ({ isOpen, onClose }: InsuranceDetailDialogProps) => {
  const [incomeMultiplier, setIncomeMultiplier] = useState([10]);
  const [yearsOfCoverage, setYearsOfCoverage] = useState([20]);

  // Life Insurance Needs Analysis Data
  const lifeInsuranceNeeds = {
    incomeReplacement: 650000, // $65k * 10 years
    debts: 445500, // Mortgage + Car + Credit Cards
    educationFunds: 120000, // Children's education
    estateTaxes: 50000,
    finalExpenses: 25000,
    total: 1290500
  };

  const currentCoverage = {
    life: 320000,
    criticalIllness: 100000,
    disability: 0
  };

  const recommendedCoverage = {
    life: lifeInsuranceNeeds.total,
    criticalIllness: 200000,
    disability: 39000 // 60% of $65k annual income
  };

  const coverageGaps = {
    life: recommendedCoverage.life - currentCoverage.life,
    criticalIllness: recommendedCoverage.criticalIllness - currentCoverage.criticalIllness,
    disability: recommendedCoverage.disability - currentCoverage.disability
  };

  const lifeInsuranceBreakdown = [
    { category: "Income Replacement", amount: lifeInsuranceNeeds.incomeReplacement, color: "#3b82f6" },
    { category: "Outstanding Debts", amount: lifeInsuranceNeeds.debts, color: "#ef4444" },
    { category: "Education Funds", amount: lifeInsuranceNeeds.educationFunds, color: "#10b981" },
    { category: "Estate Taxes", amount: lifeInsuranceNeeds.estateTaxes, color: "#f59e0b" },
    { category: "Final Expenses", amount: lifeInsuranceNeeds.finalExpenses, color: "#8b5cf6" }
  ];

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

  const calculateDynamicNeeds = () => {
    const annualIncome = 65000;
    const dynamicIncomeReplacement = annualIncome * incomeMultiplier[0];
    const dynamicTotal = dynamicIncomeReplacement + lifeInsuranceNeeds.debts + lifeInsuranceNeeds.educationFunds + lifeInsuranceNeeds.estateTaxes + lifeInsuranceNeeds.finalExpenses;
    return {
      incomeReplacement: dynamicIncomeReplacement,
      total: dynamicTotal,
      gap: dynamicTotal - currentCoverage.life
    };
  };

  const dynamicNeeds = calculateDynamicNeeds();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Insurance Needs Analysis & Coverage Gaps</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="text-center">
                  <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-700">{formatCurrency(coverageGaps.life)}</p>
                  <p className="text-sm text-red-600">Life Insurance Gap</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-700">{formatCurrency(coverageGaps.criticalIllness)}</p>
                  <p className="text-sm text-orange-600">Critical Illness Gap</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="text-center">
                  <Shield className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-700">{formatCurrency(coverageGaps.disability)}</p>
                  <p className="text-sm text-yellow-600">Disability Coverage Gap</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="life-analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="life-analysis">Life Insurance Analysis</TabsTrigger>
              <TabsTrigger value="ci-disability">CI & Disability</TabsTrigger>
              <TabsTrigger value="coverage-comparison">Coverage Comparison</TabsTrigger>
            </TabsList>

            <TabsContent value="life-analysis" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Life Insurance Needs Calculator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Interactive Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Income Replacement Multiplier: {incomeMultiplier[0]}x
                      </label>
                      <Slider
                        value={incomeMultiplier}
                        onValueChange={setIncomeMultiplier}
                        max={15}
                        min={5}
                        step={1}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended: 8-12x annual income
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Years of Coverage: {yearsOfCoverage[0]} years
                      </label>
                      <Slider
                        value={yearsOfCoverage}
                        onValueChange={setYearsOfCoverage}
                        max={30}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Dynamic Calculation Results */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Calculated Insurance Need</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Income Replacement:</span>
                        <span className="font-medium float-right">{formatCurrency(dynamicNeeds.incomeReplacement)}</span>
                      </div>
                      <div>
                        <span className="text-blue-700">Total Need:</span>
                        <span className="font-medium float-right">{formatCurrency(dynamicNeeds.total)}</span>
                      </div>
                      <div>
                        <span className="text-blue-700">Current Coverage:</span>
                        <span className="font-medium float-right">{formatCurrency(currentCoverage.life)}</span>
                      </div>
                      <div className="border-t pt-2">
                        <span className="text-blue-900 font-semibold">Coverage Gap:</span>
                        <span className="font-bold float-right text-red-600">{formatCurrency(dynamicNeeds.gap)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Life Insurance Needs Breakdown Chart */}
                  <div>
                    <h4 className="font-semibold mb-3">Insurance Needs Breakdown</h4>
                    <ChartContainer config={chartConfig} className="h-64">
                      <BarChart data={lifeInsuranceBreakdown}>
                        <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
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
                        
                        {/* Progress bar showing coverage ratio */}
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

              {/* Action Recommendations */}
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
