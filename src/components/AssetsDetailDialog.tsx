
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, TrendingUp, Plus, Building2, PiggyBank, DollarSign, Trash2, Edit } from "lucide-react";
import { useFinancialData, Asset } from "@/contexts/FinancialDataContext";

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AssetProjection {
  year: number;
  value: number;
}

export const AssetsDetailDialog = ({ isOpen, onClose }: AssetsDetailDialogProps) => {
  const { assets, addAsset, updateAsset, removeAsset } = useFinancialData();
  
  // Asset projection settings
  const [projectionYears, setProjectionYears] = useState([10]);
  const [rateOfReturn, setRateOfReturn] = useState([7]);

  // Add Asset form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetValue, setNewAssetValue] = useState("");
  const [newAssetCategory, setNewAssetCategory] = useState<Asset['category']>("other");

  // Edit asset state
  const [editingAsset, setEditingAsset] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const getAssetIcon = (category: Asset['category']) => {
    switch (category) {
      case 'real-estate': return <Home className="h-5 w-5" />;
      case 'retirement': return <PiggyBank className="h-5 w-5" />;
      case 'investment': return <TrendingUp className="h-5 w-5" />;
      case 'business': return <Building2 className="h-5 w-5" />;
      default: return <DollarSign className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: Asset['category']) => {
    switch (category) {
      case 'real-estate': return '#10b981';
      case 'retirement': return '#3b82f6';
      case 'investment': return '#8b5cf6';
      case 'business': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getCategoryName = (category: Asset['category']) => {
    switch (category) {
      case 'real-estate': return 'Real Estate';
      case 'retirement': return 'Retirement';
      case 'investment': return 'Investment';
      case 'business': return 'Business';
      default: return 'Other';
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${Math.round(value).toLocaleString()}`;
  };

  const formatCurrencyFull = (value: number) => {
    return `$${Math.round(value).toLocaleString()}`;
  };

  // Calculate projected asset values
  const calculateProjectedValue = (currentValue: number, years: number, rate: number) => {
    return currentValue * Math.pow(1 + rate / 100, years);
  };

  const generateProjectionData = (asset: Asset): AssetProjection[] => {
    const data: AssetProjection[] = [];
    for (let year = 0; year <= projectionYears[0]; year++) {
      data.push({
        year,
        value: calculateProjectedValue(asset.value, year, rateOfReturn[0])
      });
    }
    return data;
  };

  const totalCurrentValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalProjectedValue = assets.reduce((sum, asset) => 
    sum + calculateProjectedValue(asset.value, projectionYears[0], rateOfReturn[0]), 0
  );
  const totalGrowth = totalProjectedValue - totalCurrentValue;

  // Chart data for pie chart
  const pieChartData = assets.map(asset => ({
    name: asset.name,
    value: asset.value,
    color: asset.color
  }));

  // Chart data for growth projection
  const projectionChartData = Array.from({ length: projectionYears[0] + 1 }, (_, year) => {
    const yearData: any = { year };
    assets.forEach(asset => {
      yearData[asset.name] = calculateProjectedValue(asset.value, year, rateOfReturn[0]);
    });
    return yearData;
  });

  const handleAddAsset = () => {
    if (!newAssetName.trim() || !newAssetValue.trim()) return;

    const value = parseFloat(newAssetValue.replace(/[^0-9.-]/g, ''));
    if (isNaN(value) || value < 0) return;

    const newAsset: Asset = {
      id: Date.now().toString(),
      name: newAssetName.trim(),
      amount: formatCurrencyFull(value),
      value: value,
      color: getCategoryColor(newAssetCategory),
      category: newAssetCategory,
      isRetirementEligible: newAssetCategory === 'retirement'
    };

    addAsset(newAsset);
    
    // Reset form
    setNewAssetName("");
    setNewAssetValue("");
    setNewAssetCategory("other");
    setShowAddForm(false);
  };

  const handleEditAsset = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      setEditingAsset(assetId);
      setEditValue(asset.value.toString());
    }
  };

  const handleSaveEdit = (assetId: string) => {
    const value = parseFloat(editValue.replace(/[^0-9.-]/g, ''));
    if (isNaN(value) || value < 0) return;

    updateAsset(assetId, {
      value: value,
      amount: formatCurrencyFull(value)
    });

    setEditingAsset(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingAsset(null);
    setEditValue("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Asset Portfolio Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Control Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Analysis Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Projection Period: {projectionYears[0]} years
                  </label>
                  <Slider
                    value={projectionYears}
                    onValueChange={setProjectionYears}
                    min={1}
                    max={30}
                    step={1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Rate of Return: {rateOfReturn[0]}%
                  </label>
                  <Slider
                    value={rateOfReturn}
                    onValueChange={setRateOfReturn}
                    min={1}
                    max={15}
                    step={0.5}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalCurrentValue)}
              </div>
              <p className="text-sm text-blue-600">Current Portfolio</p>
            </div>
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalProjectedValue)}
              </div>
              <p className="text-sm text-green-600">Projected Value</p>
            </div>
            <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                +{formatCurrency(totalGrowth)}
              </div>
              <p className="text-sm text-purple-600">Expected Growth</p>
            </div>
          </div>

          {/* Assets List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Assets</CardTitle>
              <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Asset
              </Button>
            </CardHeader>
            <CardContent>
              {assets.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No assets added yet. Click "Add Asset" to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assets.map((asset) => {
                    const projectedValue = calculateProjectedValue(asset.value, projectionYears[0], rateOfReturn[0]);
                    const growth = projectedValue - asset.value;
                    
                    return (
                      <div key={asset.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="p-2 rounded-lg text-white" 
                              style={{ backgroundColor: asset.color }}
                            >
                              {getAssetIcon(asset.category)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{asset.name}</h3>
                              <Badge variant="secondary">{getCategoryName(asset.category)}</Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              {editingAsset === asset.id ? (
                                <div className="flex items-center gap-2">
                                  <Input
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="w-32"
                                    placeholder="Enter value"
                                  />
                                  <Button size="sm" onClick={() => handleSaveEdit(asset.id)}>Save</Button>
                                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                                </div>
                              ) : (
                                <>
                                  <div className="text-lg font-bold">{formatCurrency(asset.value)}</div>
                                  <div className="text-sm text-green-600">
                                    Projected: {formatCurrency(projectedValue)} (+{formatCurrency(growth)})
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditAsset(asset.id)}
                                disabled={editingAsset === asset.id}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => removeAsset(asset.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add Asset Form */}
              {showAddForm && (
                <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold mb-4">Add New Asset</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="asset-name">Asset Name</Label>
                      <Input
                        id="asset-name"
                        value={newAssetName}
                        onChange={(e) => setNewAssetName(e.target.value)}
                        placeholder="e.g., Primary Residence"
                      />
                    </div>
                    <div>
                      <Label htmlFor="asset-value">Current Value</Label>
                      <Input
                        id="asset-value"
                        value={newAssetValue}
                        onChange={(e) => setNewAssetValue(e.target.value)}
                        placeholder="e.g., 500000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="asset-category">Category</Label>
                      <Select value={newAssetCategory} onValueChange={(value: Asset['category']) => setNewAssetCategory(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="real-estate">Real Estate</SelectItem>
                          <SelectItem value="retirement">Retirement</SelectItem>
                          <SelectItem value="investment">Investment</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleAddAsset}>Add Asset</Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {assets.length > 0 && (
            <>
              {/* Portfolio Allocation Chart */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Allocation</CardTitle>
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
                            label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
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
                        <BarChart data={projectionChartData}>
                          <XAxis dataKey="year" />
                          <YAxis tickFormatter={(value) => formatCurrency(value)} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          {assets.map((asset, index) => (
                            <Bar 
                              key={asset.id}
                              dataKey={asset.name} 
                              fill={asset.color}
                              stackId="a"
                            />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Projection Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Growth Projections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Asset</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Current Value</TableHead>
                          <TableHead>Projected Value</TableHead>
                          <TableHead>Expected Growth</TableHead>
                          <TableHead>Growth %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assets.map((asset) => {
                          const projectedValue = calculateProjectedValue(asset.value, projectionYears[0], rateOfReturn[0]);
                          const growth = projectedValue - asset.value;
                          const growthPercent = ((projectedValue / asset.value - 1) * 100);
                          
                          return (
                            <TableRow key={asset.id}>
                              <TableCell className="font-medium">{asset.name}</TableCell>
                              <TableCell>
                                <Badge variant="secondary">{getCategoryName(asset.category)}</Badge>
                              </TableCell>
                              <TableCell>{formatCurrencyFull(asset.value)}</TableCell>
                              <TableCell className="font-bold text-green-600">
                                {formatCurrencyFull(projectedValue)}
                              </TableCell>
                              <TableCell className="font-bold text-blue-600">
                                +{formatCurrencyFull(growth)}
                              </TableCell>
                              <TableCell className="font-bold text-purple-600">
                                +{growthPercent.toFixed(1)}%
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
