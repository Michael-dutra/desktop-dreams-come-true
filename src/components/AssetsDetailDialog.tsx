
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import { Calculator, DollarSign, TrendingUp, AlertTriangle, Plus, Building, Coins, PiggyBank, Briefcase, Home } from "lucide-react";
import { useState } from "react";

interface AssetType {
  name: string;
  amount: string;
  value: number;
  color: string;
}

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assets?: AssetType[];
}

interface DetailFieldProps {
  fieldId: string;
  value: number;
  label: string;
  isEditable?: boolean;
  prefix?: string;
  isAutoCalculated?: boolean;
  tip?: string;
}

// Sample DetailField component for display
const DetailField = ({ fieldId, value, label, isEditable = true, prefix = "$", isAutoCalculated = false, tip }: DetailFieldProps) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <Input
          id={fieldId}
          value={isAutoCalculated ? value.toLocaleString() : value}
          disabled={!isEditable || isAutoCalculated}
          className={`${!isEditable || isAutoCalculated ? 'bg-gray-100' : ''}`}
        />
        {prefix && <span className="absolute left-3 top-2.5 text-gray-500">{prefix}</span>}
      </div>
      {tip && <p className="text-xs text-gray-500">{tip}</p>}
    </div>
  );
};

export const AssetsDetailDialog = ({ isOpen, onClose, assets = [] }: AssetsDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [rateOfReturn, setRateOfReturn] = useState([7]);
  const [timeHorizon, setTimeHorizon] = useState([10]);
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [newAssetType, setNewAssetType] = useState("");

  // Default assets if none provided
  const defaultAssets = [
    { name: "Real Estate", amount: "$620,000", value: 620000, color: "#3b82f6" },
    { name: "RRSP", amount: "$52,000", value: 52000, color: "#10b981" },
    { name: "TFSA", amount: "$38,000", value: 38000, color: "#8b5cf6" },
    { name: "Non-Registered", amount: "$25,000", value: 25000, color: "#f59e0b" },
    { name: "Digital Asset", amount: "$15,000", value: 15000, color: "#ef4444" },
  ];

  const displayAssets = assets.length > 0 ? assets : defaultAssets;

  // Calculate projected values
  const projectedAssets = displayAssets.map(asset => {
    const projectedValue = asset.value * Math.pow(1 + rateOfReturn[0] / 100, timeHorizon[0]);
    return {
      ...asset,
      currentValue: asset.value,
      projectedValue: projectedValue,
      growth: projectedValue - asset.value
    };
  });

  const totalCurrentValue = displayAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalProjectedValue = projectedAssets.reduce((sum, asset) => sum + asset.projectedValue, 0);
  const totalGrowth = totalProjectedValue - totalCurrentValue;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else {
      return `$${(value / 1000).toFixed(0)}K`;
    }
  };

  const chartConfig = {
    value: { label: "Value", color: "#8b5cf6" },
    projected: { label: "Projected", color: "#06b6d4" }
  };

  const handleAddAsset = () => {
    if (newAssetType) {
      console.log("Adding new asset:", newAssetType);
      setNewAssetType("");
      setShowAddAsset(false);
    }
  };

  const getIconForAssetType = (type: string) => {
    switch (type.toLowerCase()) {
      case "real estate":
        return Home;
      case "rrsp":
        return PiggyBank;
      case "tfsa":
        return Coins;
      case "non-registered":
        return Briefcase;
      case "digital asset":
        return Building;
      default:
        return DollarSign;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Assets Details
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="manage">Manage Assets</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Interactive Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Projection Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Rate of Return: {rateOfReturn[0]}%
                    </label>
                    <Slider
                      value={rateOfReturn}
                      onValueChange={setRateOfReturn}
                      min={1}
                      max={15}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Time Horizon: {timeHorizon[0]} years
                    </label>
                    <Slider
                      value={timeHorizon}
                      onValueChange={setTimeHorizon}
                      min={1}
                      max={30}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatCurrency(totalCurrentValue)}</p>
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

            {/* Assets Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Asset Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={projectedAssets}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        dataKey="projectedValue"
                        label={({ name, percentage }) => `${name} (${(percentage * 100).toFixed(1)}%)`}
                      >
                        {projectedAssets.map((entry, index) => (
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

            {/* Individual Asset Details */}
            <div className="space-y-4">
              {projectedAssets.map((asset, index) => {
                const Icon = getIconForAssetType(asset.name);
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        {asset.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-muted-foreground">Current</p>
                          <p className="text-lg font-bold">{formatCurrency(asset.currentValue)}</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-muted-foreground">Projected</p>
                          <p className="text-lg font-bold text-blue-600">{formatCurrency(asset.projectedValue)}</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-xs text-muted-foreground">Growth</p>
                          <p className="text-lg font-bold text-green-600">+{formatCurrency(asset.growth)}</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <p className="text-xs text-muted-foreground">% Change</p>
                          <p className="text-lg font-bold text-purple-600">+{(((asset.projectedValue - asset.currentValue) / asset.currentValue) * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            {/* Add New Asset Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Add New Asset</span>
                  <Button onClick={() => setShowAddAsset(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Asset
                  </Button>
                </CardTitle>
              </CardHeader>
              {showAddAsset && (
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Asset Type</label>
                      <Select value={newAssetType} onValueChange={setNewAssetType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select asset type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Real Estate">Real Estate</SelectItem>
                          <SelectItem value="RRSP">RRSP</SelectItem>
                          <SelectItem value="TFSA">TFSA</SelectItem>
                          <SelectItem value="Non-Registered">Non-Registered</SelectItem>
                          <SelectItem value="Digital Asset">Digital Asset</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddAsset}>Add</Button>
                      <Button variant="outline" onClick={() => setShowAddAsset(false)}>Cancel</Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Asset Management Cards */}
            <div className="space-y-4">
              {displayAssets.map((asset, index) => {
                const Icon = getIconForAssetType(asset.name);
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        {asset.name}
                        <Badge variant="outline">{asset.amount}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailField
                          fieldId={`${asset.name}-current-value`}
                          value={asset.value}
                          label="Current Value"
                          prefix="$"
                        />
                        <DetailField
                          fieldId={`${asset.name}-acquisition-cost`}
                          value={asset.value * 0.8}
                          label="Acquisition Cost"
                          prefix="$"
                        />
                      </div>
                      
                      {(asset.name === "Non-Registered" || asset.name === "Digital Asset") && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <DetailField
                            fieldId={`${asset.name}-annual-income`}
                            value={asset.value * 0.04}
                            label="Annual Income"
                            prefix="$"
                          />
                          <DetailField
                            fieldId={`${asset.name}-growth-rate`}
                            value={5.5}
                            label="Expected Growth Rate"
                          />
                        </div>
                      )}

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">Asset Details</p>
                        <p className="text-xs text-gray-600">
                          {asset.name === "Real Estate" && "Primary residence and investment properties"}
                          {asset.name === "RRSP" && "Registered retirement savings with tax-deferred growth"}
                          {asset.name === "TFSA" && "Tax-free savings account with no withdrawal taxes"}
                          {(asset.name === "Non-Registered" || asset.name === "Digital Asset") && "Taxable investment account with flexible access"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
