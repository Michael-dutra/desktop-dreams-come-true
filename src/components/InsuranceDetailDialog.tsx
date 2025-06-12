
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { Shield, TrendingUp, Eye, Plus, Trash2, Edit, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface InsuranceDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InsuranceDetailDialog = ({ isOpen, onClose }: InsuranceDetailDialogProps) => {
  // State for coverage amounts
  const [lifeCoverage, setLifeCoverage] = useState([320000]);
  const [criticalCoverage, setCriticalCoverage] = useState([50000]);
  const [disabilityCoverage, setDisabilityCoverage] = useState([3000]);

  // Recommended amounts (fixed)
  const lifeRecommended = 640000;
  const criticalRecommended = 150000;
  const disabilityRecommended = 4500;

  // Calculate gaps
  const lifeGap = Math.max(0, lifeRecommended - lifeCoverage[0]);
  const criticalGap = Math.max(0, criticalRecommended - criticalCoverage[0]);
  const disabilityGap = Math.max(0, disabilityRecommended - disabilityCoverage[0]);

  // Dynamic chart data based on slider values
  const lifeInsuranceData = [
    { category: "Current Coverage", amount: lifeCoverage[0], fill: "#3b82f6" },
    { category: "Recommended Need", amount: lifeRecommended, fill: "#ef4444" },
    { category: "Coverage Gap", amount: lifeGap, fill: "#f59e0b" },
  ];

  const criticalIllnessData = [
    { category: "Current Coverage", amount: criticalCoverage[0], fill: "#10b981" },
    { category: "Recommended Need", amount: criticalRecommended, fill: "#ef4444" },
    { category: "Coverage Gap", amount: criticalGap, fill: "#f59e0b" },
  ];

  const disabilityInsuranceData = [
    { category: "Current Coverage", amount: disabilityCoverage[0], fill: "#8b5cf6" },
    { category: "Recommended Need", amount: disabilityRecommended, fill: "#ef4444" },
    { category: "Coverage Gap", amount: disabilityGap, fill: "#f59e0b" },
  ];

  const lifeChartConfig = {
    amount: {
      label: "Amount",
    },
  };

  const criticalChartConfig = {
    amount: {
      label: "Amount",
    },
  };

  const disabilityChartConfig = {
    amount: {
      label: "Amount",
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Shield className="h-6 w-6" />
            Insurance Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Life Insurance</p>
                  <p className="text-2xl font-bold text-blue-600">${(lifeCoverage[0] / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-muted-foreground">Current Coverage</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Critical Illness</p>
                  <p className="text-2xl font-bold text-green-600">${(criticalCoverage[0] / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-muted-foreground">Current Coverage</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Disability Insurance</p>
                  <p className="text-2xl font-bold text-purple-600">${(disabilityCoverage[0] / 1000).toFixed(1)}K/month</p>
                  <p className="text-xs text-muted-foreground">Current Coverage</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Life Insurance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Life Insurance Coverage Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Current Coverage: ${(lifeCoverage[0] / 1000).toFixed(0)}K</label>
                    <Slider
                      value={lifeCoverage}
                      onValueChange={setLifeCoverage}
                      max={1000000}
                      min={0}
                      step={10000}
                      className="w-full"
                    />
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${lifeGap > 0 ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}>
                    <h4 className={`font-semibold mb-2 ${lifeGap > 0 ? 'text-orange-900' : 'text-green-900'}`}>
                      {lifeGap > 0 ? 'Coverage Gap Identified' : 'Coverage Met'}
                    </h4>
                    <p className={`text-sm mb-3 ${lifeGap > 0 ? 'text-orange-700' : 'text-green-700'}`}>
                      {lifeGap > 0 
                        ? `Your current life insurance coverage falls short of the recommended amount by $${(lifeGap / 1000).toFixed(0)}K.`
                        : 'Your current coverage meets or exceeds the recommended amount.'
                      }
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Current Coverage:</span>
                        <span className="font-medium">${lifeCoverage[0].toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recommended Need:</span>
                        <span className="font-medium">${lifeRecommended.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Coverage Gap:</span>
                        <span className={`font-bold ${lifeGap > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                          ${lifeGap.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <ChartContainer config={lifeChartConfig} className="h-64">
                  <BarChart data={lifeInsuranceData} layout="horizontal" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="category" type="category" tick={{ fontSize: 9 }} width={120} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="amount" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Critical Illness Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Critical Illness Coverage Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Current Coverage: ${(criticalCoverage[0] / 1000).toFixed(0)}K</label>
                    <Slider
                      value={criticalCoverage}
                      onValueChange={setCriticalCoverage}
                      max={300000}
                      min={0}
                      step={5000}
                      className="w-full"
                    />
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${criticalGap > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                    <h4 className={`font-semibold mb-2 ${criticalGap > 0 ? 'text-red-900' : 'text-green-900'}`}>
                      {criticalGap > 0 ? 'Significant Coverage Gap' : 'Coverage Met'}
                    </h4>
                    <p className={`text-sm mb-3 ${criticalGap > 0 ? 'text-red-700' : 'text-green-700'}`}>
                      {criticalGap > 0 
                        ? `Your critical illness coverage is below the recommended amount by $${(criticalGap / 1000).toFixed(0)}K.`
                        : 'Your current coverage meets or exceeds the recommended amount.'
                      }
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Current Coverage:</span>
                        <span className="font-medium">${criticalCoverage[0].toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recommended Need:</span>
                        <span className="font-medium">${criticalRecommended.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Coverage Gap:</span>
                        <span className={`font-bold ${criticalGap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ${criticalGap.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <ChartContainer config={criticalChartConfig} className="h-64">
                  <BarChart data={criticalIllnessData} layout="horizontal" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="category" type="category" tick={{ fontSize: 9 }} width={120} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="amount" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Disability Insurance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Disability Insurance Coverage Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Current Coverage: ${(disabilityCoverage[0] / 1000).toFixed(1)}K/month</label>
                    <Slider
                      value={disabilityCoverage}
                      onValueChange={setDisabilityCoverage}
                      max={8000}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${disabilityGap > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                    <h4 className={`font-semibold mb-2 ${disabilityGap > 0 ? 'text-yellow-900' : 'text-green-900'}`}>
                      {disabilityGap > 0 ? 'Moderate Coverage Gap' : 'Coverage Met'}
                    </h4>
                    <p className={`text-sm mb-3 ${disabilityGap > 0 ? 'text-yellow-700' : 'text-green-700'}`}>
                      {disabilityGap > 0 
                        ? `Your disability insurance falls short by $${(disabilityGap / 1000).toFixed(1)}K/month.`
                        : 'Your current coverage meets or exceeds the recommended amount.'
                      }
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Current Coverage:</span>
                        <span className="font-medium">${disabilityCoverage[0].toLocaleString()}/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recommended Need:</span>
                        <span className="font-medium">${disabilityRecommended.toLocaleString()}/month</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Coverage Gap:</span>
                        <span className={`font-bold ${disabilityGap > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                          ${disabilityGap.toLocaleString()}/month
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <ChartContainer config={disabilityChartConfig} className="h-64">
                  <BarChart data={disabilityInsuranceData} layout="horizontal" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="category" type="category" tick={{ fontSize: 9 }} width={120} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="amount" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Insurance Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lifeGap > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="font-medium text-red-800">Life Insurance Priority</p>
                    <p className="text-sm text-red-600">Increase life insurance coverage by ${(lifeGap / 1000).toFixed(0)}K to meet recommended levels.</p>
                  </div>
                )}

                {criticalGap > 0 && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="font-medium text-orange-800">Critical Illness Gap</p>
                    <p className="text-sm text-orange-600">
                      Add ${(criticalGap / 1000).toFixed(0)}K in critical illness coverage to protect against major health events.
                    </p>
                  </div>
                )}

                {disabilityGap > 0 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="font-medium text-yellow-800">Disability Income</p>
                    <p className="text-sm text-yellow-600">
                      Increase disability insurance by ${(disabilityGap / 1000).toFixed(1)}K/month to maintain income replacement.
                    </p>
                  </div>
                )}

                {lifeGap === 0 && criticalGap === 0 && disabilityGap === 0 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="font-medium text-green-800">Excellent Coverage</p>
                    <p className="text-sm text-green-600">
                      All your insurance coverage levels meet or exceed the recommended amounts. Well done!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
