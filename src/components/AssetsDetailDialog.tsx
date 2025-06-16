
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, LineChart, Line } from "recharts";
import { Calculator, TrendingUp, FileText, Eye, Plus, X, Download } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssetsDetailDialog = ({ isOpen, onClose }: AssetsDetailDialogProps) => {
  const { assets, getTotalAssets } = useFinancialData();
  
  // State for sliders - each asset has its own settings
  const [assetSettings, setAssetSettings] = useState({
    "Primary Residence": { rateOfReturn: [4], timeHorizon: [10] },
    "RRSP": { rateOfReturn: [7], timeHorizon: [10] },
    "TFSA": { rateOfReturn: [6], timeHorizon: [10] },
    "Non-Registered": { rateOfReturn: [6], timeHorizon: [10] }
  });

  // Update settings for specific asset
  const updateAssetSetting = (assetName: string, setting: 'rateOfReturn' | 'timeHorizon', value: number[]) => {
    setAssetSettings(prev => ({
      ...prev,
      [assetName]: {
        ...prev[assetName],
        [setting]: value
      }
    }));
  };

  // Calculate projected values for main assets
  const calculateProjections = () => {
    return assets.map(asset => {
      const settings = assetSettings[asset.name] || { rateOfReturn: [6], timeHorizon: [10] };
      const projectedValue = asset.value * Math.pow(1 + settings.rateOfReturn[0] / 100, settings.timeHorizon[0]);
      return {
        ...asset,
        settings,
        currentValue: asset.value,
        projectedValue: projectedValue,
        growth: projectedValue - asset.value
      };
    });
  };

  const projectedAssets = calculateProjections();

  const totalCurrentValue = getTotalAssets();
  const totalProjectedValue = projectedAssets.reduce((sum, asset) => sum + asset.projectedValue, 0);
  const totalGrowth = totalProjectedValue - totalCurrentValue;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else {
      return `$${(value / 1000).toFixed(0)}K`;
    }
  };

  // Chart data for asset allocation
  const assetAllocationData = projectedAssets.map(asset => ({
    name: asset.name,
    value: asset.projectedValue,
    color: asset.color
  }));

  // Chart data for growth over time - using settings from each asset
  const growthOverTimeData = Array.from({ length: 11 }, (_, year) => {
    const dataPoint: any = { year };
    projectedAssets.forEach(asset => {
      const rate = asset.settings.rateOfReturn[0];
      const value = asset.currentValue * Math.pow(1 + rate / 100, year);
      dataPoint[asset.name] = value;
    });
    return dataPoint;
  });

  const chartConfig = {
    "Primary Residence": { label: "Primary Residence", color: "#3b82f6" },
    "RRSP": { label: "RRSP", color: "#10b981" },
    "TFSA": { label: "TFSA", color: "#8b5cf6" },
    "Non-Registered": { label: "Non-Registered", color: "#f59e0b" }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Asset Portfolio Analysis
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="projections" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projections">Asset Projections</TabsTrigger>
            <TabsTrigger value="allocation">Asset Allocation</TabsTrigger>
            <TabsTrigger value="growth">Growth Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="projections" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(totalCurrentValue)}</p>
                    <p className="text-sm text-muted-foreground">Current Total</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalProjectedValue)}</p>
                    <p className="text-sm text-muted-foreground">Projected Total</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">+{formatCurrency(totalGrowth)}</p>
                    <p className="text-sm text-muted-foreground">Total Growth</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Assets - Individual Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projectedAssets.map((asset, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: asset.color }}></div>
                      {asset.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Controls */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Rate of Return: {asset.settings.rateOfReturn[0]}%
                        </label>
                        <Slider
                          value={asset.settings.rateOfReturn}
                          onValueChange={(value) => updateAssetSetting(asset.name, 'rateOfReturn', value)}
                          onClick={(e) => e.stopPropagation()}
                          min={1}
                          max={15}
                          step={0.5}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Time Horizon: {asset.settings.timeHorizon[0]} years
                        </label>
                        <Slider
                          value={asset.settings.timeHorizon}
                          onValueChange={(value) => updateAssetSetting(asset.name, 'timeHorizon', value)}
                          onClick={(e) => e.stopPropagation()}
                          min={1}
                          max={30}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Asset Projections */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Current</p>
                        <p className="text-sm font-bold">{formatCurrency(asset.currentValue)}</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Projected</p>
                        <p className="text-sm font-bold text-blue-600">{formatCurrency(asset.projectedValue)}</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg col-span-2">
                        <p className="text-xs text-muted-foreground">Growth</p>
                        <p className="text-sm font-bold text-green-600">+{formatCurrency(asset.growth)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="allocation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Projected Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={assetAllocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {assetAllocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={<ChartTooltipContent 
                          formatter={(value) => [formatCurrency(Number(value)), "Value"]}
                        />}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>

                {/* Allocation Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {assetAllocationData.map((asset, index) => (
                    <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }}></div>
                        <p className="text-xs font-medium">{asset.name}</p>
                      </div>
                      <p className="text-sm font-bold">{formatCurrency(asset.value)}</p>
                      <p className="text-xs text-muted-foreground">
                        {((asset.value / totalProjectedValue) * 100).toFixed(1)}%
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="growth" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Growth Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthOverTimeData}>
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <ChartTooltip 
                        content={<ChartTooltipContent 
                          formatter={(value, name) => [formatCurrency(Number(value)), name]}
                        />}
                      />
                      {projectedAssets.map((asset, index) => (
                        <Line
                          key={index}
                          type="monotone"
                          dataKey={asset.name}
                          stroke={asset.color}
                          strokeWidth={2}
                          dot={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>

                {/* Growth Summary Table */}
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Asset</th>
                        <th className="text-right p-2">Current</th>
                        <th className="text-right p-2">5 Years</th>
                        <th className="text-right p-2">10 Years</th>
                        <th className="text-right p-2">Annual Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectedAssets.map((asset, index) => {
                        const rate = asset.settings.rateOfReturn[0];
                        const value5Years = asset.currentValue * Math.pow(1 + rate / 100, 5);
                        const value10Years = asset.currentValue * Math.pow(1 + rate / 100, 10);
                        
                        return (
                          <tr key={index} className="border-b">
                            <td className="p-2 font-medium flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }}></div>
                              {asset.name}
                            </td>
                            <td className="text-right p-2">{formatCurrency(asset.currentValue)}</td>
                            <td className="text-right p-2">{formatCurrency(value5Years)}</td>
                            <td className="text-right p-2">{formatCurrency(value10Years)}</td>
                            <td className="text-right p-2 text-green-600 font-medium">{rate}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
