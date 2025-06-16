
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell } from "recharts";
import { TrendingUp, DollarSign, Home, PiggyBank, Briefcase, Calculator, Plus, X } from "lucide-react";

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Asset {
  name: string;
  currentValue: number;
  growthRate: number;
  projectionYears: number;
  color: string;
  type: "real-estate" | "rrsp" | "tfsa" | "non-registered" | "secondary-property";
  monthlyContribution?: number;
  originalPurchasePrice?: number;
  capitalImprovements?: number;
  costBase?: number;
  employerMatch?: number;
  rrspRoom?: number;
  tfsaRoom?: number;
  carryForwardRoom?: number;
  lastYearContribution?: number;
}

export const AssetsDetailDialog = ({ isOpen, onClose }: AssetsDetailDialogProps) => {
  const [assets, setAssets] = useState<Asset[]>([
    {
      name: "Primary Residence",
      currentValue: 850000,
      growthRate: 4,
      projectionYears: 10,
      color: "#3b82f6",
      type: "real-estate"
    },
    {
      name: "RRSP",
      currentValue: 125000,
      growthRate: 6,
      projectionYears: 10,
      monthlyContribution: 800,
      employerMatch: 400,
      rrspRoom: 25000,
      carryForwardRoom: 15000,
      lastYearContribution: 9600,
      color: "#10b981",
      type: "rrsp"
    },
    {
      name: "TFSA",
      currentValue: 95000,
      growthRate: 5,
      projectionYears: 10,
      monthlyContribution: 500,
      tfsaRoom: 8000,
      lastYearContribution: 6000,
      color: "#8b5cf6",
      type: "tfsa"
    },
    {
      name: "Non-Registered",
      currentValue: 45000,
      growthRate: 5,
      projectionYears: 10,
      monthlyContribution: 300,
      costBase: 35000,
      color: "#f59e0b",
      type: "non-registered"
    },
    {
      name: "Secondary Property",
      currentValue: 650000,
      growthRate: 3,
      projectionYears: 10,
      originalPurchasePrice: 480000,
      capitalImprovements: 25000,
      color: "#06b6d4",
      type: "secondary-property"
    }
  ]);

  const updateAsset = (index: number, field: keyof Asset, value: any) => {
    const newAssets = [...assets];
    newAssets[index] = { ...newAssets[index], [field]: value };
    setAssets(newAssets);
  };

  const calculateFutureValue = (asset: Asset) => {
    const rate = asset.growthRate / 100;
    const years = asset.projectionYears;
    
    if (asset.monthlyContribution) {
      // Future Value with monthly contributions
      const monthlyRate = rate / 12;
      const months = years * 12;
      const futureValueWithoutContributions = asset.currentValue * Math.pow(1 + rate, years);
      const futureValueOfAnnuity = asset.monthlyContribution * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
      return futureValueWithoutContributions + futureValueOfAnnuity;
    } else {
      // Simple compound growth
      return asset.currentValue * Math.pow(1 + rate, years);
    }
  };

  const totalCurrentValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalFutureValue = assets.reduce((sum, asset) => sum + calculateFutureValue(asset), 0);

  const chartData = assets.map(asset => ({
    name: asset.name,
    current: asset.currentValue,
    future: calculateFutureValue(asset),
    color: asset.color
  }));

  const chartConfig = {
    current: { label: "Current Value", color: "#94a3b8" },
    future: { label: "Future Value", color: "#3b82f6" }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const formatLargeCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "real-estate":
      case "secondary-property":
        return <Home className="h-5 w-5" />;
      case "rrsp":
      case "tfsa":
        return <PiggyBank className="h-5 w-5" />;
      case "non-registered":
        return <Briefcase className="h-5 w-5" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Assets Detailed Analysis
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Assets Overview</TabsTrigger>
            <TabsTrigger value="projections">Individual Projections</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(totalCurrentValue)}</p>
                    <p className="text-sm text-muted-foreground">Total Current Value</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totalFutureValue)}</p>
                    <p className="text-sm text-muted-foreground">Total Projected Value</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Assets Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Current vs. Future Asset Values</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={formatCurrency}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent 
                          formatter={(value) => [formatCurrency(Number(value)), "Value"]}
                        />}
                      />
                      <Bar dataKey="current" fill="#94a3b8" name="Current Value" />
                      <Bar dataKey="future" fill="#3b82f6" name="Future Value" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projections" className="space-y-6">
            {assets.map((asset, index) => {
              const futureValue = calculateFutureValue(asset);
              const totalGrowth = futureValue - asset.currentValue;
              
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${asset.color}20`, color: asset.color }}>
                        {getIcon(asset.type)}
                      </div>
                      {asset.name}
                      <Badge variant="outline">{asset.type.replace('-', ' ').toUpperCase()}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Asset Controls */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Growth Rate: {asset.growthRate}%
                        </label>
                        <Slider
                          value={[asset.growthRate]}
                          onValueChange={(value) => updateAsset(index, 'growthRate', value[0])}
                          min={0}
                          max={15}
                          step={0.5}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Projection Years: {asset.projectionYears}
                        </label>
                        <Slider
                          value={[asset.projectionYears]}
                          onValueChange={(value) => updateAsset(index, 'projectionYears', value[0])}
                          min={1}
                          max={30}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      {asset.monthlyContribution !== undefined && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Monthly Contribution: ${asset.monthlyContribution}
                          </label>
                          <Slider
                            value={[asset.monthlyContribution]}
                            onValueChange={(value) => updateAsset(index, 'monthlyContribution', value[0])}
                            min={0}
                            max={2000}
                            step={50}
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>

                    {/* Asset Projections */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Current Value</p>
                        <p className="text-lg font-bold">{formatCurrency(asset.currentValue)}</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Future Value</p>
                        <p className="text-lg font-bold text-blue-600">{formatCurrency(futureValue)}</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Total Growth</p>
                        <p className="text-lg font-bold text-green-600">{formatCurrency(totalGrowth)}</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Growth Rate</p>
                        <p className="text-lg font-bold text-purple-600">{asset.growthRate}%</p>
                      </div>
                    </div>

                    {/* Asset-Specific Information */}
                    {asset.type === "rrsp" && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                          <Calculator className="h-4 w-4" />
                          RRSP Details
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-green-600">RRSP Room</p>
                            <p className="font-medium text-green-800">{formatLargeCurrency(asset.rrspRoom || 0)}</p>
                          </div>
                          <div>
                            <p className="text-green-600">Carry Forward</p>
                            <p className="font-medium text-green-800">{formatLargeCurrency(asset.carryForwardRoom || 0)}</p>
                          </div>
                          <div>
                            <p className="text-green-600">Employer Match</p>
                            <p className="font-medium text-green-800">${asset.employerMatch || 0}/month</p>
                          </div>
                          <div>
                            <p className="text-green-600">Last Year Contribution</p>
                            <p className="font-medium text-green-800">{formatLargeCurrency(asset.lastYearContribution || 0)}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {asset.type === "tfsa" && (
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="font-medium text-purple-800 mb-3 flex items-center gap-2">
                          <Calculator className="h-4 w-4" />
                          TFSA Details
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-purple-600">TFSA Room</p>
                            <p className="font-medium text-purple-800">{formatLargeCurrency(asset.tfsaRoom || 0)}</p>
                          </div>
                          <div>
                            <p className="text-purple-600">Last Year Contribution</p>
                            <p className="font-medium text-purple-800">{formatLargeCurrency(asset.lastYearContribution || 0)}</p>
                          </div>
                          <div>
                            <p className="text-purple-600">Tax-Free Growth</p>
                            <p className="font-medium text-purple-800">{formatCurrency(totalGrowth)}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {asset.type === "secondary-property" && (
                      <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                        <h4 className="font-medium text-cyan-800 mb-3 flex items-center gap-2">
                          <Calculator className="h-4 w-4" />
                          Capital Gains Calculation
                        </h4>
                        {(() => {
                          const currentCapitalGain = asset.currentValue - ((asset.originalPurchasePrice || 0) + (asset.capitalImprovements || 0));
                          const futureCapitalGain = futureValue - ((asset.originalPurchasePrice || 0) + (asset.capitalImprovements || 0));
                          const currentTaxableGain = Math.max(0, currentCapitalGain) * 0.5;
                          const futureTaxableGain = Math.max(0, futureCapitalGain) * 0.5;
                          const currentEstimatedTax = currentTaxableGain * 0.43;
                          const futureEstimatedTax = futureTaxableGain * 0.43;
                          
                          return (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-cyan-600">Purchase Price</p>
                                <p className="font-medium text-cyan-800">{formatLargeCurrency(asset.originalPurchasePrice || 0)}</p>
                              </div>
                              <div>
                                <p className="text-cyan-600">Capital Improvements</p>
                                <p className="font-medium text-cyan-800">{formatLargeCurrency(asset.capitalImprovements || 0)}</p>
                              </div>
                              <div>
                                <p className="text-cyan-600">Current Capital Gain</p>
                                <p className="font-medium text-cyan-800">{formatLargeCurrency(currentCapitalGain)}</p>
                              </div>
                              <div>
                                <p className="text-cyan-600">Future Capital Gain</p>
                                <p className="font-medium text-cyan-800">{formatLargeCurrency(futureCapitalGain)}</p>
                              </div>
                              <div>
                                <p className="text-cyan-600">Current Estimated Tax</p>
                                <p className="font-medium text-red-600">{formatLargeCurrency(currentEstimatedTax)}</p>
                              </div>
                              <div>
                                <p className="text-cyan-600">Future Estimated Tax</p>
                                <p className="font-medium text-red-600">{formatLargeCurrency(futureEstimatedTax)}</p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {asset.type === "non-registered" && (
                      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <h4 className="font-medium text-amber-800 mb-3 flex items-center gap-2">
                          <Calculator className="h-4 w-4" />
                          Capital Gains Calculation
                        </h4>
                        {(() => {
                          const currentCapitalGainNonReg = asset.currentValue - (asset.costBase || 0);
                          const futureCapitalGainNonReg = futureValue - (asset.costBase || 0);
                          const currentTaxableGainNonReg = Math.max(0, currentCapitalGainNonReg) * 0.5;
                          const futureTaxableGainNonReg = Math.max(0, futureCapitalGainNonReg) * 0.5;
                          const currentEstimatedTaxNonReg = currentTaxableGainNonReg * 0.43;
                          const futureEstimatedTaxNonReg = futureTaxableGainNonReg * 0.43;
                          
                          return (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-amber-600">Cost Base</p>
                                <p className="font-medium text-amber-800">{formatLargeCurrency(asset.costBase || 0)}</p>
                              </div>
                              <div>
                                <p className="text-amber-600">Current Capital Gain</p>
                                <p className="font-medium text-amber-800">{formatLargeCurrency(currentCapitalGainNonReg)}</p>
                              </div>
                              <div>
                                <p className="text-amber-600">Future Capital Gain</p>
                                <p className="font-medium text-amber-800">{formatLargeCurrency(futureCapitalGainNonReg)}</p>
                              </div>
                              <div>
                                <p className="text-amber-600">Current Estimated Tax</p>
                                <p className="font-medium text-red-600">{formatLargeCurrency(currentEstimatedTaxNonReg)}</p>
                              </div>
                              <div>
                                <p className="text-amber-600">Future Estimated Tax</p>
                                <p className="font-medium text-red-600">{formatLargeCurrency(futureEstimatedTaxNonReg)}</p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
