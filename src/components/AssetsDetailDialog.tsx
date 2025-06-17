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
import { TrendingUp, Eye, Plus, DollarSign, X, Pencil } from "lucide-react";
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
    category: "investment" as "retirement" | "investment" | "real-estate" | "business" | "other"
  });

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

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
    percentage: totalValue > 0 ? ((asset.value / totalValue) * 100).toFixed(1) : "0"
  }));

  const barChartData = assetsWithColors.map(asset => ({
    name: asset.name,
    amount: asset.value,
    color: asset.color
  }));

  const handleAddAsset = () => {
    if (newAsset.name.trim() && newAsset.value.trim()) {
      const value = parseInputCurrency(newAsset.value);
      const asset = {
        id: Date.now().toString(),
        name: newAsset.name,
        amount: formatInputCurrency(newAsset.value),
        value: value,
        color: ASSET_COLORS[assets.length % ASSET_COLORS.length],
        category: newAsset.category,
        isRetirementEligible: newAsset.category === 'retirement' || newAsset.category === 'investment'
      };
      
      console.log('Adding new asset:', asset);
      addAsset(asset);
      setNewAsset({ name: "", value: "", category: "investment" });
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
    value: {
      label: "Value",
      color: "#3b82f6"
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Assets Overview
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Asset Overview</TabsTrigger>
            <TabsTrigger value="management">Asset Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {assets.length > 0 ? (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">{formatCurrency(totalValue)}</p>
                        <p className="text-sm text-muted-foreground">Total Assets</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{assets.length}</p>
                        <p className="text-sm text-muted-foreground">Asset Count</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(totalValue / assets.length)}
                        </p>
                        <p className="text-sm text-muted-foreground">Average Value</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Asset Allocation</CardTitle>
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
                      <CardTitle className="text-lg">Asset Values</CardTitle>
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
                            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                              {barChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="p-6 bg-blue-50 rounded-full inline-block mb-4">
                  <TrendingUp className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Assets Added Yet</h3>
                <p className="text-gray-600 mb-6">Start by adding your first asset to see your portfolio overview.</p>
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
            {/* Add Asset Section - Shows at top if no assets, at bottom if assets exist */}
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <label className="text-sm font-medium text-green-700">Value</label>
                      <Input
                        value={newAsset.value}
                        onChange={(e) => setNewAsset({ ...newAsset, value: e.target.value })}
                        placeholder="e.g., 500000"
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
