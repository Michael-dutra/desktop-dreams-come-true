
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis } from "recharts";
import { TrendingUp, Eye, Plus, DollarSign, X, Calculator } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useFinancialData } from "@/contexts/FinancialDataContext";

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// Color palette for new assets
const ASSET_COLORS = [
  "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", 
  "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6366f1"
];

export const AssetsDetailDialog = ({ isOpen, onClose }: AssetsDetailDialogProps) => {
  const { assets, addAsset, updateAsset, removeAsset } = useFinancialData();
  
  // Add Asset form state
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: "",
    value: "",
    acquisitionCost: "",
    category: "investment" as "retirement" | "investment" | "real-estate" | "business" | "other",
    taxableStatus: "Capital Gains" as "Fully Taxable" | "Capital Gains" | "Tax-Free"
  });

  // Individual sliders for each asset
  const [assetSettings, setAssetSettings] = useState<{[key: string]: { rateOfReturn: number[], timeHorizon: number[] }}>({});

  const updateAssetSetting = (assetId: string, setting: 'rateOfReturn' | 'timeHorizon', value: number[]) => {
    setAssetSettings(prev => ({
      ...prev,
      [assetId]: {
        ...prev[assetId],
        [setting]: value
      }
    }));
  };

  // Initialize asset settings if they don't exist
  const getAssetSettings = (assetId: string) => {
    if (!assetSettings[assetId]) {
      setAssetSettings(prev => ({
        ...prev,
        [assetId]: {
          rateOfReturn: [7],
          timeHorizon: [10]
        }
      }));
      return { rateOfReturn: [7], timeHorizon: [10] };
    }
    return assetSettings[assetId];
  };

  // Calculate projections for each asset
  const calculateAssetProjections = () => {
    return assets.map(asset => {
      const settings = getAssetSettings(asset.id);
      const rateOfReturn = settings.rateOfReturn[0] / 100;
      const timeFrame = settings.timeHorizon[0];
      
      // Future Value calculation
      const futureValue = asset.value * Math.pow(1 + rateOfReturn, timeFrame);
      const acquisitionCost = asset.acquisitionCost || asset.value * 0.7; // Default to 70% if not specified
      const totalGain = futureValue - acquisitionCost;
      
      // Tax calculations based on asset type
      let taxableAmount = 0;
      let taxOwed = 0;
      const marginalTaxRate = 0.43; // Assume 43% marginal tax rate
      const capitalGainsRate = marginalTaxRate * 0.5; // 50% inclusion rate
      
      const taxStatus = asset.taxableStatus || (asset.category === 'retirement' ? 'Fully Taxable' : 'Capital Gains');
      
      switch (taxStatus) {
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
        netValue: futureValue - taxOwed,
        acquisitionCost,
        taxStatus
      };
    });
  };

  const projectedAssets = calculateAssetProjections();
  const totalCurrentValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalFutureValue = projectedAssets.reduce((sum, asset) => sum + asset.futureValue, 0);
  const totalTaxOwed = projectedAssets.reduce((sum, asset) => sum + asset.taxOwed, 0);
  const totalNetValue = projectedAssets.reduce((sum, asset) => sum + asset.netValue, 0);
  const totalGrowth = totalFutureValue - totalCurrentValue;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  };

  const formatInputCurrency = (value: string) => {
    const num = parseFloat(value.replace(/[$,]/g, ''));
    if (isNaN(num)) return value;
    return `$${num.toLocaleString()}`;
  };

  const parseInputCurrency = (value: string) => {
    return parseFloat(value.replace(/[$,]/g, '')) || 0;
  };

  // Assign colors to assets (using existing color or assigning new one)
  const assetsWithColors = assets.map((asset, index) => ({
    ...asset,
    color: asset.color || ASSET_COLORS[index % ASSET_COLORS.length]
  }));

  // Prepare chart data
  const pieChartData = assetsWithColors.map(asset => ({
    name: asset.name,
    value: asset.value,
    color: asset.color,
    percentage: totalCurrentValue > 0 ? ((asset.value / totalCurrentValue) * 100).toFixed(1) : "0"
  }));

  const barChartData = projectedAssets.map(asset => ({
    name: asset.name,
    current: asset.value,
    projected: asset.futureValue,
    color: asset.color
  }));

  const handleAddAsset = () => {
    if (newAsset.name.trim() && newAsset.value.trim()) {
      const value = parseInputCurrency(newAsset.value);
      const acquisitionCost = newAsset.acquisitionCost ? parseInputCurrency(newAsset.acquisitionCost) : value * 0.7;
      
      const asset = {
        id: Date.now().toString(),
        name: newAsset.name,
        amount: formatInputCurrency(newAsset.value),
        value: value,
        color: ASSET_COLORS[assets.length % ASSET_COLORS.length],
        category: newAsset.category,
        isRetirementEligible: newAsset.category === 'retirement' || newAsset.category === 'investment',
        acquisitionCost: acquisitionCost,
        taxableStatus: newAsset.taxableStatus,
        rateOfReturn: 7,
        timeHorizon: 10
      };
      
      console.log('Adding new asset:', asset);
      addAsset(asset);
      setNewAsset({ name: "", value: "", acquisitionCost: "", category: "investment", taxableStatus: "Capital Gains" });
      setShowAddAsset(false);
    }
  };

  const handleDeleteAsset = (id: string) => {
    removeAsset(id);
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      'retirement': 'bg-green-100 text-green-800',
      'investment': 'bg-blue-100 text-blue-800',
      'real-estate': 'bg-purple-100 text-purple-800',
      'business': 'bg-orange-100 text-orange-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const chartConfig = {
    current: { label: "Current Value", color: "#8b5cf6" },
    projected: { label: "Projected Value", color: "#3b82f6" },
    value: { label: "Value", color: "#3b82f6" }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Assets Overview & Projections
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="projections" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="projections">Asset Projections</TabsTrigger>
            <TabsTrigger value="management">Asset Management</TabsTrigger>
          </TabsList>

          <TabsContent value="projections" className="space-y-6">
            {assets.length > 0 ? (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">{formatCurrency(totalCurrentValue)}</p>
                        <p className="text-sm text-muted-foreground">Current Value</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalFutureValue)}</p>
                        <p className="text-sm text-muted-foreground">Future Value</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(totalGrowth)}</p>
                        <p className="text-sm text-muted-foreground">Total Growth</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalTaxOwed)}</p>
                        <p className="text-sm text-muted-foreground">Est. Taxes</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Current Asset Allocation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieChartData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percentage }) => `${name}: ${percentage}%`}
                            >
                              {pieChartData.map((entry, index) => (
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
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Current vs Projected Values</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                              tickFormatter={(value) => formatCurrency(value)}
                            />
                            <ChartTooltip 
                              content={<ChartTooltipContent 
                                formatter={(value) => [formatCurrency(Number(value)), "Amount"]}
                              />}
                            />
                            <Bar dataKey="current" fill="#8b5cf6" name="Current" />
                            <Bar dataKey="projected" fill="#3b82f6" name="Projected" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Individual Asset Controls - 2 Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {projectedAssets.map((asset, index) => (
                    <Card key={asset.id}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: asset.color }}></div>
                          {asset.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Controls - Vertical Stack */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Rate of Return: {asset.settings.rateOfReturn[0]}%
                            </label>
                            <Slider
                              value={asset.settings.rateOfReturn}
                              onValueChange={(value) => updateAssetSetting(asset.id, 'rateOfReturn', value)}
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
                              onValueChange={(value) => updateAssetSetting(asset.id, 'timeHorizon', value)}
                              min={1}
                              max={30}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        </div>

                        {/* Asset Projections - 2x2 Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-muted-foreground">Current Value</p>
                            <p className="text-sm font-bold">{formatCurrency(asset.value)}</p>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-muted-foreground">Future Value</p>
                            <p className="text-sm font-bold text-blue-600">{formatCurrency(asset.futureValue)}</p>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded-lg">
                            <p className="text-xs text-muted-foreground">Tax Owed</p>
                            <p className="text-sm font-bold text-red-600">{formatCurrency(asset.taxOwed)}</p>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <p className="text-xs text-muted-foreground">Net Value</p>
                            <p className="text-sm font-bold text-green-600">{formatCurrency(asset.netValue)}</p>
                          </div>
                        </div>

                        {/* Tax Status */}
                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Calculator className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-800">Tax Treatment: {asset.taxStatus}</span>
                          </div>
                          <p className="text-xs text-orange-700">
                            {asset.taxStatus === "Fully Taxable" && "Full value subject to marginal tax rate at disposition"}
                            {asset.taxStatus === "Capital Gains" && "Only gains subject to capital gains tax (50% inclusion rate)"}
                            {asset.taxStatus === "Tax-Free" && "No tax implications on this asset"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Detailed Tax Calculations Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Detailed Tax Calculations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Asset</TableHead>
                            <TableHead className="text-right">Current Value</TableHead>
                            <TableHead className="text-right">Future Value</TableHead>
                            <TableHead className="text-right">Acquisition Cost</TableHead>
                            <TableHead className="text-right">Taxable Amount</TableHead>
                            <TableHead className="text-right">Tax Rate</TableHead>
                            <TableHead className="text-right">Tax Owed</TableHead>
                            <TableHead className="text-right">Net Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {projectedAssets.map((asset) => {
                            const taxRate = asset.taxStatus === "Fully Taxable" ? 43 :
                                           asset.taxStatus === "Capital Gains" ? 21.5 : 0;
                            return (
                              <TableRow key={asset.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center space-x-3">
                                    <div 
                                      className="w-4 h-4 rounded-full" 
                                      style={{ backgroundColor: asset.color }}
                                    />
                                    <span>{asset.name}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">{formatCurrency(asset.value)}</TableCell>
                                <TableCell className="text-right font-medium">{formatCurrency(asset.futureValue)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(asset.acquisitionCost)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(asset.taxableAmount)}</TableCell>
                                <TableCell className="text-right">{taxRate}%</TableCell>
                                <TableCell className="text-right text-red-600 font-medium">{formatCurrency(asset.taxOwed)}</TableCell>
                                <TableCell className="text-right text-green-600 font-bold">{formatCurrency(asset.netValue)}</TableCell>
                              </TableRow>
                            );
                          })}
                          <TableRow className="border-t-2 font-bold">
                            <TableCell>Total</TableCell>
                            <TableCell className="text-right">{formatCurrency(totalCurrentValue)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(totalFutureValue)}</TableCell>
                            <TableCell className="text-right">-</TableCell>
                            <TableCell className="text-right">{formatCurrency(projectedAssets.reduce((sum, asset) => sum + asset.taxableAmount, 0))}</TableCell>
                            <TableCell className="text-right">-</TableCell>
                            <TableCell className="text-right text-red-600">{formatCurrency(totalTaxOwed)}</TableCell>
                            <TableCell className="text-right text-green-600">{formatCurrency(totalNetValue)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="p-6 bg-blue-50 rounded-full inline-block mb-4">
                  <TrendingUp className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Assets Added Yet</h3>
                <p className="text-gray-600 mb-6">Start by adding your first asset to see projections and tax calculations.</p>
                <Button 
                  onClick={() => setShowAddAsset(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Asset
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            {/* Add Asset Section */}
            {(assets.length === 0 || showAddAsset) && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="bg-green-100 border-b border-green-200">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Plus className="h-5 w-5 text-green-600" />
                      <span className="text-green-800">Add New Asset</span>
                    </div>
                    {assets.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowAddAsset(false)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-green-700">Asset Name</label>
                      <Input
                        value={newAsset.name}
                        onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                        placeholder="e.g., Primary Residence"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-green-700">Current Value</label>
                      <Input
                        value={newAsset.value}
                        onChange={(e) => setNewAsset({ ...newAsset, value: e.target.value })}
                        placeholder="e.g., 500000"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-green-700">Acquisition Cost (for tax calc)</label>
                      <Input
                        value={newAsset.acquisitionCost}
                        onChange={(e) => setNewAsset({ ...newAsset, acquisitionCost: e.target.value })}
                        placeholder="e.g., 350000 (optional)"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-green-700">Category</label>
                      <select
                        className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                        value={newAsset.category}
                        onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value as any })}
                      >
                        <option value="investment">Investment</option>
                        <option value="retirement">Retirement</option>
                        <option value="real-estate">Real Estate</option>
                        <option value="business">Business</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-medium text-green-700">Tax Treatment</label>
                    <select
                      className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                      value={newAsset.taxableStatus}
                      onChange={(e) => setNewAsset({ ...newAsset, taxableStatus: e.target.value as any })}
                    >
                      <option value="Capital Gains">Capital Gains (Real Estate, Non-Reg Investments)</option>
                      <option value="Fully Taxable">Fully Taxable (RRSP, Business Income)</option>
                      <option value="Tax-Free">Tax-Free (TFSA, Principal Residence)</option>
                    </select>
                  </div>
                  <div className="flex gap-2 justify-end mt-4">
                    <Button variant="outline" onClick={() => setShowAddAsset(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddAsset} className="bg-green-600 hover:bg-green-700">
                      Add Asset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Existing Assets List */}
            {assets.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Your Assets</span>
                  </CardTitle>
                  {!showAddAsset && (
                    <Button 
                      size="sm" 
                      onClick={() => setShowAddAsset(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Asset
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Asset</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Tax Treatment</TableHead>
                          <TableHead className="text-right">Value</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assetsWithColors.map((asset) => (
                          <TableRow key={asset.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-3">
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ backgroundColor: asset.color }}
                                />
                                <span>{asset.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getCategoryBadgeColor(asset.category)}>
                                {asset.category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {asset.taxableStatus || 'Capital Gains'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(asset.value)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAsset(asset.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
