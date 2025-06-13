import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line } from "recharts";
import { DollarSign, TrendingUp, AlertTriangle, Plus, Trash2 } from "lucide-react";

interface Asset {
  id: string;
  name: string;
  type: string;
  currentValue: number;
  monthlyContribution: number;
  rateOfReturn: number;
  riskLevel: "Low" | "Medium" | "High";
  taxStatus: "Taxable" | "Tax-Deferred" | "Tax-Free";
}

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssetsDetailDialog = ({ isOpen, onClose }: AssetsDetailDialogProps) => {
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "1",
      name: "Primary Residence",
      type: "Real Estate",
      currentValue: 620000,
      monthlyContribution: 0,
      rateOfReturn: 5,
      riskLevel: "Low",
      taxStatus: "Taxable"
    },
    {
      id: "2",
      name: "RRSP Portfolio",
      type: "RRSP",
      currentValue: 52000,
      monthlyContribution: 500,
      rateOfReturn: 7,
      riskLevel: "Medium",
      taxStatus: "Tax-Deferred"
    },
    {
      id: "3",
      name: "TFSA Investments",
      type: "TFSA",
      currentValue: 38000,
      monthlyContribution: 300,
      rateOfReturn: 6,
      riskLevel: "Medium",
      taxStatus: "Tax-Free"
    },
    {
      id: "4",
      name: "Non-Registered Portfolio",
      type: "Non-Registered",
      currentValue: 25000,
      monthlyContribution: 200,
      rateOfReturn: 6,
      riskLevel: "Medium",
      taxStatus: "Taxable"
    }
  ]);

  const [showAddAsset, setShowAddAsset] = useState(false);
  const [newAsset, setNewAsset] = useState<Omit<Asset, "id">>({
    name: "",
    type: "",
    currentValue: 0,
    monthlyContribution: 0,
    rateOfReturn: 6,
    riskLevel: "Medium",
    taxStatus: "Taxable"
  });

  const assetTypes = [
    { value: "Real Estate", label: "Real Estate", taxStatus: "Taxable" },
    { value: "RRSP", label: "RRSP", taxStatus: "Tax-Deferred" },
    { value: "TFSA", label: "TFSA", taxStatus: "Tax-Free" },
    { value: "FHSA", label: "FHSA", taxStatus: "Tax-Free" },
    { value: "Non-Registered", label: "Non-Registered", taxStatus: "Taxable" },
    { value: "Savings Account", label: "Savings Account", taxStatus: "Taxable" },
    { value: "GIC", label: "GIC", taxStatus: "Taxable" },
    { value: "Stocks", label: "Stocks", taxStatus: "Taxable" },
    { value: "Bonds", label: "Bonds", taxStatus: "Taxable" },
    { value: "Mutual Funds", label: "Mutual Funds", taxStatus: "Taxable" },
    { value: "ETFs", label: "ETFs", taxStatus: "Taxable" }
  ];

  const totalAssetValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const monthlyContributions = assets.reduce((sum, asset) => sum + asset.monthlyContribution, 0);

  // Calculate future projections (10 years)
  const calculateFutureValue = (asset: Asset) => {
    const years = 10;
    const monthlyRate = asset.rateOfReturn / 100 / 12;
    const totalMonths = years * 12;
    
    // Future value of current amount
    const currentValueFuture = asset.currentValue * Math.pow(1 + asset.rateOfReturn / 100, years);
    
    // Future value of monthly contributions (annuity)
    const contributionsFuture = asset.monthlyContribution * 
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    
    return currentValueFuture + contributionsFuture;
  };

  const projectedAssets = assets.map(asset => ({
    ...asset,
    futureValue: calculateFutureValue(asset)
  }));

  const totalFutureValue = projectedAssets.reduce((sum, asset) => sum + asset.futureValue, 0);

  // Asset allocation data
  const assetAllocationData = assets.map(asset => ({
    name: asset.name,
    value: asset.currentValue,
    percentage: ((asset.currentValue / totalAssetValue) * 100).toFixed(1)
  }));

  // Growth projection data
  const growthProjectionData = Array.from({ length: 11 }, (_, year) => {
    const yearData = { year };
    assets.forEach(asset => {
      const currentValueFuture = asset.currentValue * Math.pow(1 + asset.rateOfReturn / 100, year);
      const monthlyRate = asset.rateOfReturn / 100 / 12;
      const totalMonths = year * 12;
      const contributionsFuture = totalMonths > 0 ? 
        asset.monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) : 0;
      
      yearData[asset.name] = Math.round(currentValueFuture + contributionsFuture);
    });
    return yearData;
  });

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

  const updateAsset = (id: string, field: keyof Asset, value: any) => {
    setAssets(assets.map(asset => 
      asset.id === id ? { ...asset, [field]: value } : asset
    ));
  };

  const handleAddAsset = () => {
    if (newAsset.name.trim() && newAsset.type) {
      const asset: Asset = {
        ...newAsset,
        id: Date.now().toString()
      };
      setAssets([...assets, asset]);
      setNewAsset({
        name: "",
        type: "",
        currentValue: 0,
        monthlyContribution: 0,
        rateOfReturn: 6,
        riskLevel: "Medium",
        taxStatus: "Taxable"
      });
      setShowAddAsset(false);
    }
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id));
  };

  const handleAssetTypeChange = (type: string) => {
    const selectedType = assetTypes.find(t => t.value === type);
    setNewAsset({
      ...newAsset,
      type,
      taxStatus: selectedType?.taxStatus as "Taxable" | "Tax-Deferred" | "Tax-Free" || "Taxable"
    });
  };

  const chartConfig = {
    value: { label: "Value", color: "#8884d8" }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Assets Portfolio Analysis
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
              <TabsTrigger value="assets">Individual Assets</TabsTrigger>
              <TabsTrigger value="projections">Growth Projections</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">${totalAssetValue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total Assets</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">${monthlyContributions.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Monthly Contributions</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">${Math.round(totalFutureValue).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">10-Year Projection</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Asset Allocation Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={assetAllocationData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name}: ${percentage}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {assetAllocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip 
                          content={<ChartTooltipContent 
                            formatter={(value) => [`$${Number(value).toLocaleString()}`, "Value"]}
                          />}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assets" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Individual Assets</h3>
                <Button onClick={() => setShowAddAsset(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Asset
                </Button>
              </div>

              <div className="space-y-4">
                {assets.map((asset) => (
                  <Card key={asset.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{asset.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{asset.type}</Badge>
                          <Badge variant={asset.riskLevel === "Low" ? "secondary" : asset.riskLevel === "Medium" ? "default" : "destructive"}>
                            {asset.riskLevel} Risk
                          </Badge>
                          <Badge variant="outline">{asset.taxStatus}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAsset(asset.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-sm font-medium">Current Value</label>
                          <Input
                            type="number"
                            value={asset.currentValue}
                            onChange={(e) => updateAsset(asset.id, 'currentValue', Number(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Monthly Contribution</label>
                          <Input
                            type="number"
                            value={asset.monthlyContribution}
                            onChange={(e) => updateAsset(asset.id, 'monthlyContribution', Number(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Rate of Return (%)</label>
                          <Input
                            type="number"
                            step="0.1"
                            value={asset.rateOfReturn}
                            onChange={(e) => updateAsset(asset.id, 'rateOfReturn', Number(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Risk Level</label>
                          <Select
                            value={asset.riskLevel}
                            onValueChange={(value) => updateAsset(asset.id, 'riskLevel', value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">10-Year Projection</h4>
                        <p className="text-2xl font-bold text-green-600">
                          ${Math.round(calculateFutureValue(asset)).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Growth: ${Math.round(calculateFutureValue(asset) - asset.currentValue).toLocaleString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="projections" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Growth Projections (10 Years)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={growthProjectionData}>
                        <XAxis dataKey="year" />
                        <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                        <ChartTooltip 
                          content={<ChartTooltipContent 
                            formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name]}
                          />}
                        />
                        {assets.map((asset, index) => (
                          <Line
                            key={asset.id}
                            type="monotone"
                            dataKey={asset.name}
                            stroke={COLORS[index % COLORS.length]}
                            strokeWidth={2}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectedAssets.map((asset, index) => (
                  <Card key={asset.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{asset.name}</h4>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Current:</span>
                          <span className="text-sm font-medium">${asset.currentValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">10-Year:</span>
                          <span className="text-sm font-bold text-green-600">${Math.round(asset.futureValue).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Growth:</span>
                          <span className="text-sm font-medium text-blue-600">
                            {(((asset.futureValue - asset.currentValue) / asset.currentValue) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Add Asset Dialog */}
      <Dialog open={showAddAsset} onOpenChange={setShowAddAsset}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Asset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Asset Name</label>
              <Input
                value={newAsset.name}
                onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                placeholder="e.g., Emergency Fund"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Asset Type</label>
              <Select
                value={newAsset.type}
                onValueChange={handleAssetTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  {assetTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Current Value</label>
              <Input
                type="number"
                value={newAsset.currentValue}
                onChange={(e) => setNewAsset({ ...newAsset, currentValue: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Monthly Contribution</label>
              <Input
                type="number"
                value={newAsset.monthlyContribution}
                onChange={(e) => setNewAsset({ ...newAsset, monthlyContribution: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Expected Rate of Return (%)</label>
              <Input
                type="number"
                step="0.1"
                value={newAsset.rateOfReturn}
                onChange={(e) => setNewAsset({ ...newAsset, rateOfReturn: Number(e.target.value) })}
                placeholder="6"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Risk Level</label>
              <Select
                value={newAsset.riskLevel}
                onValueChange={(value) => setNewAsset({ ...newAsset, riskLevel: value as "Low" | "Medium" | "High" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddAsset(false)}>Cancel</Button>
              <Button onClick={handleAddAsset}>Add Asset</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
