
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import { Calculator, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";

interface EstateDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EstateDetailDialog = ({ isOpen, onClose }: EstateDetailDialogProps) => {
  // Original estate data from EstateCard
  const totalEstateValue = 785000;
  const estateTaxes = 25000;
  const netEstateValue = totalEstateValue - estateTaxes;

  const estateBreakdownData = [
    {
      category: "Total Estate",
      amount: totalEstateValue,
      color: "#8b5cf6"
    },
    {
      category: "Estate Taxes",
      amount: estateTaxes,
      color: "#f59e0b"
    },
    {
      category: "Net to Beneficiaries",
      amount: netEstateValue,
      color: "#06b6d4"
    }
  ];

  const [estateAssets] = useState([
    { 
      name: "Real Estate", 
      currentValue: 620000, 
      taxableStatus: "Capital Gains",
      acquisitionCost: 450000,
      color: "#3b82f6"
    },
    { 
      name: "RRSP", 
      currentValue: 52000, 
      taxableStatus: "Fully Taxable",
      acquisitionCost: 35000,
      color: "#10b981"
    },
    { 
      name: "TFSA", 
      currentValue: 38000, 
      taxableStatus: "Tax-Free",
      acquisitionCost: 30000,
      color: "#8b5cf6"
    },
    { 
      name: "Non-Registered", 
      currentValue: 25000, 
      taxableStatus: "Capital Gains",
      acquisitionCost: 20000,
      color: "#f59e0b"
    },
  ]);

  // Individual sliders for each asset
  const [assetSettings, setAssetSettings] = useState({
    "Real Estate": { rateOfReturn: [5], timeFrame: [15] },
    "RRSP": { rateOfReturn: [7], timeFrame: [15] },
    "TFSA": { rateOfReturn: [6], timeFrame: [15] },
    "Non-Registered": { rateOfReturn: [6], timeFrame: [15] }
  });

  const updateAssetSetting = (assetName: string, setting: 'rateOfReturn' | 'timeFrame', value: number[]) => {
    setAssetSettings(prev => ({
      ...prev,
      [assetName]: {
        ...prev[assetName],
        [setting]: value
      }
    }));
  };

  // Calculate future values and taxes for each asset
  const calculateAssetProjections = () => {
    return estateAssets.map(asset => {
      const settings = assetSettings[asset.name];
      const rateOfReturn = settings.rateOfReturn[0] / 100;
      const timeFrame = settings.timeFrame[0];
      
      // Future Value calculation
      const futureValue = asset.currentValue * Math.pow(1 + rateOfReturn, timeFrame);
      const totalGain = futureValue - asset.acquisitionCost;
      
      // Tax calculations based on asset type
      let taxableAmount = 0;
      let taxOwed = 0;
      const marginalTaxRate = 0.43; // Assume 43% marginal tax rate
      const capitalGainsRate = marginalTaxRate * 0.5; // 50% inclusion rate
      
      switch (asset.taxableStatus) {
        case "Fully Taxable":
          taxableAmount = futureValue;
          taxOwed = futureValue * marginalTaxRate;
          break;
        case "Capital Gains":
          taxableAmount = totalGain > 0 ? totalGain : 0;
          taxOwed = taxableAmount * capitalGainsRate;
          break;
        case "Tax-Free":
          taxableAmount = 0;
          taxOwed = 0;
          break;
        default:
          taxableAmount = 0;
          taxOwed = 0;
      }

      return {
        ...asset,
        settings,
        futureValue,
        totalGain,
        taxableAmount,
        taxOwed,
        netValue: futureValue - taxOwed
      };
    });
  };

  const projectedAssets = calculateAssetProjections();
  const totalFutureValue = projectedAssets.reduce((sum, asset) => sum + asset.futureValue, 0);
  const totalTaxOwed = projectedAssets.reduce((sum, asset) => sum + asset.taxOwed, 0);
  const totalNetValue = projectedAssets.reduce((sum, asset) => sum + asset.netValue, 0);

  // Chart data for tax breakdown
  const taxBreakdownData = projectedAssets.map(asset => ({
    name: asset.name,
    grossValue: asset.futureValue,
    taxOwed: asset.taxOwed,
    netValue: asset.netValue,
    fill: asset.color
  }));

  const chartConfig = {
    grossValue: { label: "Gross Value", color: "#3b82f6" },
    taxOwed: { label: "Tax Owed", color: "#ef4444" },
    netValue: { label: "Net Value", color: "#10b981" },
    amount: { label: "Amount", color: "#8b5cf6" }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Estate Planning & Tax Analysis
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Estate Overview</TabsTrigger>
            <TabsTrigger value="projections">Asset Projections</TabsTrigger>
            <TabsTrigger value="taxes">Tax Analysis</TabsTrigger>
            <TabsTrigger value="summary">Estate Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Original Estate Value Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Estate Value Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={estateBreakdownData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis 
                        dataKey="category" 
                        tick={{ fontSize: 12 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent 
                          formatter={(value) => [`$${Number(value).toLocaleString()}`, "Amount"]}
                        />}
                      />
                      <Bar 
                        dataKey="amount" 
                        radius={[4, 4, 0, 0]}
                      >
                        {estateBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>

                {/* Original Summary Numbers */}
                <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <p className="text-xs text-purple-700 font-medium">Total Estate</p>
                    <p className="text-lg font-bold text-purple-800">${(totalEstateValue / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <p className="text-xs text-amber-700 font-medium">Estate Taxes</p>
                    <p className="text-lg font-bold text-amber-800">${(estateTaxes / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <p className="text-xs text-cyan-700 font-medium">Net Amount</p>
                    <p className="text-lg font-bold text-cyan-800">${(netEstateValue / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Asset Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Asset Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {estateAssets.map((asset, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: asset.color }}></div>
                      <p className="text-sm font-medium">{asset.name}</p>
                      <p className="text-lg font-bold">${(asset.currentValue / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-gray-600">{asset.taxableStatus}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projections" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">${(totalFutureValue / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-muted-foreground">Total Future Value</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">${(totalTaxOwed / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-muted-foreground">Estimated Taxes</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">${(totalNetValue / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-muted-foreground">Net Estate Value</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Individual Asset Controls */}
            <div className="space-y-6">
              {projectedAssets.map((asset, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: asset.color }}></div>
                      {asset.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Rate of Return: {asset.settings.rateOfReturn[0]}%
                        </label>
                        <Slider
                          value={asset.settings.rateOfReturn}
                          onValueChange={(value) => updateAssetSetting(asset.name, 'rateOfReturn', value)}
                          min={1}
                          max={15}
                          step={0.5}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Time Frame: {asset.settings.timeFrame[0]} years
                        </label>
                        <Slider
                          value={asset.settings.timeFrame}
                          onValueChange={(value) => updateAssetSetting(asset.name, 'timeFrame', value)}
                          min={1}
                          max={30}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Asset Projections */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Current Value</p>
                        <p className="text-lg font-bold">${(asset.currentValue / 1000).toFixed(0)}K</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Future Value</p>
                        <p className="text-lg font-bold text-blue-600">${(asset.futureValue / 1000).toFixed(0)}K</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Tax Owed</p>
                        <p className="text-lg font-bold text-red-600">${(asset.taxOwed / 1000).toFixed(0)}K</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Net Value</p>
                        <p className="text-lg font-bold text-green-600">${(asset.netValue / 1000).toFixed(0)}K</p>
                      </div>
                    </div>

                    {/* Tax Status */}
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Calculator className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">Tax Treatment: {asset.taxableStatus}</span>
                      </div>
                      <p className="text-xs text-orange-700">
                        {asset.taxableStatus === "Fully Taxable" && "Full value subject to marginal tax rate at death"}
                        {asset.taxableStatus === "Capital Gains" && "Only gains subject to capital gains tax (50% inclusion rate)"}
                        {asset.taxableStatus === "Tax-Free" && "No tax implications on this asset"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="taxes" className="space-y-6">
            {/* Tax Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tax Impact by Asset</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taxBreakdownData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent 
                          formatter={(value, name) => [`$${Number(value).toLocaleString()}`, 
                            name === 'grossValue' ? 'Gross Value' :
                            name === 'taxOwed' ? 'Tax Owed' :
                            name === 'netValue' ? 'Net Value' : name
                          ]}
                        />}
                      />
                      <Bar dataKey="grossValue" fill="#3b82f6" name="Gross Value" />
                      <Bar dataKey="taxOwed" fill="#ef4444" name="Tax Owed" />
                      <Bar dataKey="netValue" fill="#10b981" name="Net Value" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Detailed Tax Breakdown Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detailed Tax Calculations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Asset</th>
                        <th className="text-right p-2">Current Value</th>
                        <th className="text-right p-2">Future Value</th>
                        <th className="text-right p-2">Taxable Amount</th>
                        <th className="text-right p-2">Tax Rate</th>
                        <th className="text-right p-2">Tax Owed</th>
                        <th className="text-right p-2">Net Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectedAssets.map((asset, index) => {
                        const taxRate = asset.taxableStatus === "Fully Taxable" ? 43 :
                                       asset.taxableStatus === "Capital Gains" ? 21.5 : 0;
                        return (
                          <tr key={index} className="border-b">
                            <td className="p-2 font-medium">{asset.name}</td>
                            <td className="text-right p-2">${asset.currentValue.toLocaleString()}</td>
                            <td className="text-right p-2 font-medium">${asset.futureValue.toLocaleString()}</td>
                            <td className="text-right p-2">${asset.taxableAmount.toLocaleString()}</td>
                            <td className="text-right p-2">{taxRate}%</td>
                            <td className="text-right p-2 text-red-600 font-medium">${asset.taxOwed.toLocaleString()}</td>
                            <td className="text-right p-2 text-green-600 font-bold">${asset.netValue.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                      <tr className="border-t-2 font-bold">
                        <td className="p-2">Total</td>
                        <td className="text-right p-2">${estateAssets.reduce((sum, asset) => sum + asset.currentValue, 0).toLocaleString()}</td>
                        <td className="text-right p-2">${totalFutureValue.toLocaleString()}</td>
                        <td className="text-right p-2">${projectedAssets.reduce((sum, asset) => sum + asset.taxableAmount, 0).toLocaleString()}</td>
                        <td className="text-right p-2">-</td>
                        <td className="text-right p-2 text-red-600">${totalTaxOwed.toLocaleString()}</td>
                        <td className="text-right p-2 text-green-600">${totalNetValue.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estate Tax Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Gross Estate Value</span>
                      <span className="font-bold">${totalFutureValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Tax Liability</span>
                      <span className="font-bold text-red-600">${totalTaxOwed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Net Estate Value</span>
                      <span className="font-bold text-green-600">${totalNetValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span>Tax Efficiency</span>
                      <span className="font-bold">{((totalNetValue / totalFutureValue) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tax Optimization Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Maximize TFSA Contributions</p>
                        <p className="text-xs text-muted-foreground">Tax-free growth and no tax on death</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Consider Income Splitting</p>
                        <p className="text-xs text-muted-foreground">Distribute assets to lower tax brackets</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calculator className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Estate Freeze Strategies</p>
                        <p className="text-xs text-muted-foreground">Lock in current values, transfer growth</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
