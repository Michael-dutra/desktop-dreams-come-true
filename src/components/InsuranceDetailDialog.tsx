
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { Shield, TrendingUp, Eye, Plus, Trash2, Edit, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface InsuranceDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InsuranceDetailDialog = ({ isOpen, onClose }: InsuranceDetailDialogProps) => {
  // Life Insurance Data
  const lifeInsuranceData = [
    { category: "Current Coverage", amount: 320000, fill: "#3b82f6" },
    { category: "Recommended Need", amount: 640000, fill: "#ef4444" },
    { category: "Coverage Gap", amount: 320000, fill: "#f59e0b" },
  ];

  // Critical Illness Data
  const criticalIllnessData = [
    { category: "Current Coverage", amount: 50000, fill: "#10b981" },
    { category: "Recommended Need", amount: 150000, fill: "#ef4444" },
    { category: "Coverage Gap", amount: 100000, fill: "#f59e0b" },
  ];

  // Disability Insurance Data
  const disabilityInsuranceData = [
    { category: "Current Coverage", amount: 3000, fill: "#8b5cf6" },
    { category: "Recommended Need", amount: 4500, fill: "#ef4444" },
    { category: "Coverage Gap", amount: 1500, fill: "#f59e0b" },
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
                  <p className="text-2xl font-bold text-blue-600">$1,200/year</p>
                  <p className="text-xs text-muted-foreground">$320K Coverage</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Critical Illness</p>
                  <p className="text-2xl font-bold text-green-600">$400/year</p>
                  <p className="text-xs text-muted-foreground">$50K Coverage</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Disability Insurance</p>
                  <p className="text-2xl font-bold text-purple-600">$800/year</p>
                  <p className="text-xs text-muted-foreground">$3K/month Coverage</p>
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
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-900 mb-2">Coverage Gap Identified</h4>
                    <p className="text-sm text-orange-700 mb-3">
                      Your current life insurance coverage of $320K falls short of the recommended $640K. Consider increasing coverage by $320K.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Current Coverage:</span>
                        <span className="font-medium">$320,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recommended Need:</span>
                        <span className="font-medium">$640,000</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Coverage Gap:</span>
                        <span className="font-bold text-orange-600">$320,000</span>
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
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-2">Significant Coverage Gap</h4>
                    <p className="text-sm text-red-700 mb-3">
                      Your critical illness coverage of $50K is well below the recommended $150K. Consider increasing coverage by $100K.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Current Coverage:</span>
                        <span className="font-medium">$50,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recommended Need:</span>
                        <span className="font-medium">$150,000</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Coverage Gap:</span>
                        <span className="font-bold text-red-600">$100,000</span>
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
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-900 mb-2">Moderate Coverage Gap</h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      Your disability insurance provides $3K/month but you need $4.5K/month. Consider increasing coverage by $1.5K/month.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Current Coverage:</span>
                        <span className="font-medium">$3,000/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recommended Need:</span>
                        <span className="font-medium">$4,500/month</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Coverage Gap:</span>
                        <span className="font-bold text-yellow-600">$1,500/month</span>
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
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="font-medium text-red-800">Life Insurance Priority</p>
                  <p className="text-sm text-red-600">Increase life insurance coverage by $320K to meet recommended levels.</p>
                </div>

                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="font-medium text-orange-800">Critical Illness Gap</p>
                  <p className="text-sm text-orange-600">
                    Add $100K in critical illness coverage to protect against major health events.
                  </p>
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="font-medium text-yellow-800">Disability Income</p>
                  <p className="text-sm text-yellow-600">
                    Increase disability insurance by $1.5K/month to maintain income replacement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
