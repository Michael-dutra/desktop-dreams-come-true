
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis } from "recharts";
import { Plus, Edit2, Trash2, DollarSign, TrendingUp, Home, CreditCard } from "lucide-react";
import { EditableField } from "./EditableField";
import { useFinancialData, Asset } from "@/contexts/FinancialDataContext";

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ASSET_COLORS = [
  "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", 
  "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6366f1"
];

const ASSET_CATEGORIES = [
  "Property", "Retirement", "Tax-Free", "Investment", "Crypto", "Cash", "Business", "Other"
];

export const AssetsDetailDialog = ({ isOpen, onClose }: AssetsDetailDialogProps) => {
  const { assets, addAsset, updateAsset, removeAsset, getTotalAssets } = useFinancialData();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<string | null>(null);
  const [newAsset, setNewAsset] = useState({
    name: "",
    value: 0,
    category: "Investment",
    description: "",
    growthRate: 6,
    purchasePrice: 0,
    mortgageBalance: 0,
    monthlyPayment: 0,
    interestRate: 0,
    remainingTerm: 0
  });

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    } else {
      return `$${value.toLocaleString()}`;
    }
  };

  const handleAddAsset = () => {
    if (newAsset.name.trim() && newAsset.value > 0) {
      const colorIndex = assets.length % ASSET_COLORS.length;
      addAsset({
        name: newAsset.name,
        amount: formatCurrency(newAsset.value),
        value: newAsset.value,
        color: ASSET_COLORS[colorIndex],
        category: newAsset.category,
        description: newAsset.description,
        growthRate: newAsset.growthRate,
        purchasePrice: newAsset.purchasePrice || undefined,
        mortgageBalance: newAsset.mortgageBalance || undefined,
        monthlyPayment: newAsset.monthlyPayment || undefined,
        interestRate: newAsset.interestRate || undefined,
        remainingTerm: newAsset.remainingTerm || undefined,
      });
      
      setNewAsset({
        name: "",
        value: 0,
        category: "Investment",
        description: "",
        growthRate: 6,
        purchasePrice: 0,
        mortgageBalance: 0,
        monthlyPayment: 0,
        interestRate: 0,
        remainingTerm: 0
      });
      setShowAddForm(false);
    }
  };

  const handleUpdateAsset = (assetId: string, field: keyof Asset, value: any) => {
    updateAsset(assetId, { [field]: value });
  };

  const handleDeleteAsset = (assetId: string) => {
    removeAsset(assetId);
  };

  // Prepare chart data
  const pieChartData = assets.map(asset => ({
    name: asset.name,
    value: asset.value,
    color: asset.color
  }));

  const barChartData = assets.map(asset => ({
    name: asset.name,
    current: asset.value,
    potential: asset.value * 1.5, // Example potential growth
    color: asset.color
  }));

  const chartConfig = {
    value: { label: "Value", color: "#8884d8" },
    current: { label: "Current", color: "#8884d8" },
    potential: { label: "Potential", color: "#82ca9d" }
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

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Asset Details</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(getTotalAssets())}</p>
                    <p className="text-sm text-muted-foreground">Total Assets</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{assets.length}</p>
                    <p className="text-sm text-muted-foreground">Asset Categories</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {assets.length > 0 ? ((assets.reduce((sum, a) => sum + (a.growthRate || 0), 0) / assets.length).toFixed(1)) : '0'}%
                    </p>
                    <p className="text-sm text-muted-foreground">Avg Growth Rate</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
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
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
                  <CardTitle>Growth Potential</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barChartData}>
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(value) => formatCurrency(value)} />
                        <ChartTooltip 
                          content={<ChartTooltipContent 
                            formatter={(value) => [formatCurrency(Number(value)), ""]}
                          />}
                        />
                        <Bar dataKey="current" fill="#8884d8" name="Current Value" />
                        <Bar dataKey="potential" fill="#82ca9d" name="Potential Value" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {/* Add Asset Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Asset Management</h3>
              <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Asset
              </Button>
            </div>

            {/* Add Asset Form */}
            {showAddForm && (
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle>Add New Asset</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="assetName">Asset Name</Label>
                      <Input
                        id="assetName"
                        value={newAsset.name}
                        onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                        placeholder="e.g., Rental Property"
                      />
                    </div>
                    <div>
                      <Label htmlFor="assetValue">Current Value</Label>
                      <Input
                        id="assetValue"
                        type="number"
                        value={newAsset.value}
                        onChange={(e) => setNewAsset({ ...newAsset, value: Number(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="assetCategory">Category</Label>
                      <select
                        id="assetCategory"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        value={newAsset.category}
                        onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                      >
                        {ASSET_CATEGORIES.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="growthRate">Expected Growth Rate (%)</Label>
                      <Input
                        id="growthRate"
                        type="number"
                        value={newAsset.growthRate}
                        onChange={(e) => setNewAsset({ ...newAsset, growthRate: Number(e.target.value) })}
                        placeholder="6"
                        step="0.1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newAsset.description}
                      onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
                      placeholder="Optional description"
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                    <Button onClick={handleAddAsset}>Add Asset</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Asset List */}
            <div className="space-y-4">
              {assets.map((asset) => (
                <Card key={asset.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: asset.color }}
                        />
                        <span>{asset.name}</span>
                        {asset.category && (
                          <Badge variant="outline">{asset.category}</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingAsset(editingAsset === asset.id ? null : asset.id)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Current Value</Label>
                        <EditableField
                          fieldId={`${asset.id}-value`}
                          value={asset.value}
                          label="Current Value"
                          prefix="$"
                          onValueChange={(value) => handleUpdateAsset(asset.id, 'value', value)}
                        />
                      </div>
                      {asset.growthRate && (
                        <div>
                          <Label className="text-sm text-muted-foreground">Growth Rate</Label>
                          <EditableField
                            fieldId={`${asset.id}-growth`}
                            value={asset.growthRate}
                            label="Growth Rate"
                            suffix="%"
                            onValueChange={(value) => handleUpdateAsset(asset.id, 'growthRate', value)}
                          />
                        </div>
                      )}
                      {asset.purchasePrice && (
                        <div>
                          <Label className="text-sm text-muted-foreground">Purchase Price</Label>
                          <EditableField
                            fieldId={`${asset.id}-purchase`}
                            value={asset.purchasePrice}
                            label="Purchase Price"
                            prefix="$"
                            onValueChange={(value) => handleUpdateAsset(asset.id, 'purchasePrice', value)}
                          />
                        </div>
                      )}
                      {asset.mortgageBalance && (
                        <div>
                          <Label className="text-sm text-muted-foreground">Mortgage Balance</Label>
                          <EditableField
                            fieldId={`${asset.id}-mortgage`}
                            value={asset.mortgageBalance}
                            label="Mortgage Balance"
                            prefix="$"
                            onValueChange={(value) => handleUpdateAsset(asset.id, 'mortgageBalance', value)}
                          />
                        </div>
                      )}
                    </div>
                    {asset.description && (
                      <div className="mt-4">
                        <Label className="text-sm text-muted-foreground">Description</Label>
                        <p className="text-sm mt-1">{asset.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This section will show detailed analysis of your assets including growth projections, 
                    risk assessments, and optimization recommendations.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Top Performing Asset</h4>
                      <p className="text-sm">
                        {assets.length > 0 && 
                          assets.reduce((best, current) => 
                            (current.growthRate || 0) > (best.growthRate || 0) ? current : best
                          ).name
                        } with {assets.length > 0 && 
                          Math.max(...assets.map(a => a.growthRate || 0))
                        }% expected growth
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Portfolio Diversification</h4>
                      <p className="text-sm">
                        {new Set(assets.map(a => a.category)).size} different asset categories
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
