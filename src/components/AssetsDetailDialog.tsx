
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, LineChart, Line } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, TrendingUp, DollarSign, PieChart as PieChartIcon, BarChart3, Calculator, Home, Building2, Briefcase, Coins } from "lucide-react";
import { useFinancialData, Asset } from "@/contexts/FinancialDataContext";

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssetsDetailDialog = ({ isOpen, onClose }: AssetsDetailDialogProps) => {
  const { assets, addAsset, updateAsset, removeAsset } = useFinancialData();
  
  // Form state for adding new assets
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetValue, setNewAssetValue] = useState("");
  const [newAssetCategory, setNewAssetCategory] = useState<Asset['category']>("investment");
  const [newAssetRetirementEligible, setNewAssetRetirementEligible] = useState(false);
  const [newAssetAcquisitionCost, setNewAssetAcquisitionCost] = useState("");
  const [newAssetTaxStatus, setNewAssetTaxStatus] = useState<Asset['taxStatus']>("fully-taxable");

  // Projection settings
  const [projectionYears, setProjectionYears] = useState([10]);
  const [growthRate, setGrowthRate] = useState([7]);

  // Asset colors for visual distinction
  const assetColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16", "#f97316"];

  const resetForm = () => {
    setNewAssetName("");
    setNewAssetValue("");
    setNewAssetCategory("investment");
    setNewAssetRetirementEligible(false);
    setNewAssetAcquisitionCost("");
    setNewAssetTaxStatus("fully-taxable");
  };

  const handleAddAsset = () => {
    if (!newAssetName || !newAssetValue) return;

    const value = parseFloat(newAssetValue);
    const acquisitionCost = newAssetAcquisitionCost ? parseFloat(newAssetAcquisitionCost) : undefined;
    
    const newAsset: Asset = {
      id: Date.now().toString(),
      name: newAssetName,
      amount: `$${value.toLocaleString()}`,
      value: value,
      color: assetColors[assets.length % assetColors.length],
      category: newAssetCategory,
      isRetirementEligible: newAssetRetirementEligible,
      acquisitionCost: acquisitionCost,
      taxStatus: newAssetTaxStatus
    };

    addAsset(newAsset);
    resetForm();
  };

  const handleRemoveAsset = (id: string) => {
    removeAsset(id);
  };

  const handleUpdateAsset = (id: string, field: string, value: any) => {
    const updates: Partial<Asset> = { [field]: value };
    
    if (field === 'value') {
      updates.amount = `$${value.toLocaleString()}`;
    }
    
    updateAsset(id, updates);
  };

  // Calculate projections
  const calculateProjections = () => {
    return assets.map(asset => {
      const futureValue = asset.value * Math.pow(1 + growthRate[0] / 100, projectionYears[0]);
      const growth = futureValue - asset.value;
      const capitalGain = asset.acquisitionCost ? Math.max(0, asset.value - asset.acquisitionCost) : 0;
      
      return {
        ...asset,
        futureValue,
        growth,
        capitalGain,
        projectedGrowth: futureValue - asset.value
      };
    });
  };

  const projectedAssets = calculateProjections();
  const totalCurrentValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalFutureValue = projectedAssets.reduce((sum, asset) => sum + asset.futureValue, 0);
  const totalGrowth = totalFutureValue - totalCurrentValue;

  // Chart data
  const pieChartData = assets.map(asset => ({
    name: asset.name,
    value: asset.value,
    color: asset.color
  }));

  const growthChartData = projectedAssets.map(asset => ({
    name: asset.name,
    current: asset.value,
    projected: asset.futureValue,
    growth: asset.projectedGrowth
  }));

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${Math.round(value).toLocaleString()}`;
  };

  const getCategoryIcon = (category: Asset['category']) => {
    switch (category) {
      case 'real-estate': return <Home className="h-4 w-4" />;
      case 'retirement': return <PieChartIcon className="h-4 w-4" />;
      case 'investment': return <TrendingUp className="h-4 w-4" />;
      case 'business': return <Building2 className="h-4 w-4" />;
      default: return <Coins className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assets Details</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="add">Add Asset</TabsTrigger>
            <TabsTrigger value="projections">Projections</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {assets.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assets Added</h3>
                  <p className="text-gray-600 text-center max-w-sm mb-4">
                    Start building your asset portfolio by adding your first asset. You can track real estate, investments, retirement accounts, and more.
                  </p>
                  <Button onClick={() => document.querySelector('[data-tabs-trigger="add"]')?.click()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Asset
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Asset Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(totalCurrentValue)}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Asset Count</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{assets.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Retirement Eligible</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(assets.filter(a => a.isRetirementEligible).reduce((sum, a) => sum + a.value, 0))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Assets List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Assets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assets.map((asset) => (
                        <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: asset.color }}
                            />
                            {getCategoryIcon(asset.category)}
                            <div>
                              <h3 className="font-semibold">{asset.name}</h3>
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary">{asset.category}</Badge>
                                {asset.isRetirementEligible && (
                                  <Badge variant="outline">Retirement Eligible</Badge>
                                )}
                                <Badge variant="outline">{asset.taxStatus}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{formatCurrency(asset.value)}</div>
                            {asset.acquisitionCost && (
                              <div className="text-sm text-gray-600">
                                Gain: {formatCurrency(asset.value - asset.acquisitionCost)}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveAsset(asset.id)}
                            className="ml-4"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="add" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Asset</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="assetName">Asset Name</Label>
                    <Input
                      id="assetName"
                      value={newAssetName}
                      onChange={(e) => setNewAssetName(e.target.value)}
                      placeholder="e.g., Primary Residence, RRSP, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="assetValue">Current Value</Label>
                    <Input
                      id="assetValue"
                      type="number"
                      value={newAssetValue}
                      onChange={(e) => setNewAssetValue(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="assetCategory">Category</Label>
                    <Select value={newAssetCategory} onValueChange={(value: Asset['category']) => setNewAssetCategory(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="real-estate">Real Estate</SelectItem>
                        <SelectItem value="retirement">Retirement Account</SelectItem>
                        <SelectItem value="investment">Investment</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="taxStatus">Tax Status</Label>
                    <Select value={newAssetTaxStatus} onValueChange={(value: Asset['taxStatus']) => setNewAssetTaxStatus(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fully-taxable">Fully Taxable</SelectItem>
                        <SelectItem value="capital-gains">Capital Gains</SelectItem>
                        <SelectItem value="tax-free">Tax Free</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="acquisitionCost">Acquisition Cost (Optional)</Label>
                  <Input
                    id="acquisitionCost"
                    type="number"
                    value={newAssetAcquisitionCost}
                    onChange={(e) => setNewAssetAcquisitionCost(e.target.value)}
                    placeholder="Original purchase price"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="retirementEligible"
                    checked={newAssetRetirementEligible}
                    onCheckedChange={setNewAssetRetirementEligible}
                  />
                  <Label htmlFor="retirementEligible">Retirement Eligible</Label>
                </div>

                <Separator />

                <Button onClick={handleAddAsset} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Asset
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projections" className="space-y-6">
            {assets.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calculator className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assets to Project</h3>
                  <p className="text-gray-600 text-center max-w-sm">
                    Add assets to see growth projections and analysis.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Projection Controls */}
                <Card>
                  <CardHeader>
                    <CardTitle>Projection Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Time Horizon: {projectionYears[0]} years</Label>
                        <Slider
                          value={projectionYears}
                          onValueChange={setProjectionYears}
                          min={1}
                          max={30}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Annual Growth Rate: {growthRate[0]}%</Label>
                        <Slider
                          value={growthRate}
                          onValueChange={setGrowthRate}
                          min={1}
                          max={15}
                          step={0.5}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Projection Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Current Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalCurrentValue)}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Projected Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalFutureValue)}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">+{formatCurrency(totalGrowth)}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Projection Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Asset Projections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Asset</TableHead>
                          <TableHead>Current Value</TableHead>
                          <TableHead>Projected Value</TableHead>
                          <TableHead>Growth</TableHead>
                          <TableHead>Capital Gain</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projectedAssets.map((asset) => (
                          <TableRow key={asset.id}>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: asset.color }}
                                />
                                <span>{asset.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{formatCurrency(asset.value)}</TableCell>
                            <TableCell className="text-blue-600 font-semibold">
                              {formatCurrency(asset.futureValue)}
                            </TableCell>
                            <TableCell className="text-green-600 font-semibold">
                              +{formatCurrency(asset.projectedGrowth)}
                            </TableCell>
                            <TableCell>
                              {asset.capitalGain > 0 ? formatCurrency(asset.capitalGain) : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {assets.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data to Analyze</h3>
                  <p className="text-gray-600 text-center max-w-sm">
                    Add assets to see detailed analysis and visualizations.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Asset Allocation Pie Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Asset Allocation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={{}} className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Growth Projection Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Growth Projection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={{}} className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={growthChartData}>
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(value) => formatCurrency(value)} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="current" fill="#8b5cf6" name="Current" />
                          <Bar dataKey="projected" fill="#3b82f6" name="Projected" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
