import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp, PlusCircle, DollarSign, Building, Coins, Target, ChevronRight, Eye, Calculator, PiggyBank, Home, Briefcase, Building2, Landmark, MoreHorizontal, Trash2, Edit, TrendingDown } from 'lucide-react';
import { useFinancialData, type Asset } from '@/contexts/FinancialDataContext';

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssetsDetailDialog = ({ isOpen, onClose }: AssetsDetailDialogProps) => {
  const { assets: dynamicAssets, addAsset, updateAsset, removeAsset } = useFinancialData();

  // Asset form state
  const [assetForm, setAssetForm] = useState({
    name: '',
    amount: '',
    value: 0,
    category: 'investment' as Asset['category'],
    isRetirementEligible: false,
    acquisitionCost: 0,
    taxStatus: 'fully-taxable' as Asset['taxStatus']
  });

  const generateColor = () => {
    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
      '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleAssetFormChange = (field: string, value: any) => {
    setAssetForm(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'amount' && { value: parseFloat(value.replace(/[^0-9.]/g, '')) || 0 })
    }));
  };

  const handleAddAsset = () => {
    if (assetForm.name && assetForm.value > 0) {
      const newAsset: Asset = {
        id: Date.now().toString(),
        name: assetForm.name,
        amount: assetForm.amount,
        value: assetForm.value,
        color: generateColor(),
        category: assetForm.category,
        isRetirementEligible: assetForm.isRetirementEligible,
        acquisitionCost: assetForm.acquisitionCost,
        taxStatus: assetForm.taxStatus
      };

      addAsset(newAsset);
      
      // Reset form
      setAssetForm({
        name: '',
        amount: '',
        value: 0,
        category: 'investment',
        isRetirementEligible: false,
        acquisitionCost: 0,
        taxStatus: 'fully-taxable'
      });
    }
  };

  const handleDeleteAsset = (assetId: string) => {
    removeAsset(assetId);
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

  // Calculate totals from dynamic assets only
  const totalAssets = dynamicAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalRetirementEligible = dynamicAssets
    .filter(asset => asset.isRetirementEligible)
    .reduce((sum, asset) => sum + asset.value, 0);

  // Asset category breakdown for pie chart
  const categoryBreakdown = dynamicAssets.reduce((acc, asset) => {
    acc[asset.category] = (acc[asset.category] || 0) + asset.value;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(categoryBreakdown).map(([category, value]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' '),
    value,
    percentage: (value / totalAssets) * 100
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const assetTypeTemplates = [
    { name: "Real Estate", category: "real-estate", isRetirementEligible: false, taxStatus: "capital-gains" },
    { name: "RRSP", category: "retirement", isRetirementEligible: true, taxStatus: "fully-taxable" },
    { name: "TFSA", category: "retirement", isRetirementEligible: true, taxStatus: "tax-free" },
    { name: "Non-Registered Investment", category: "investment", isRetirementEligible: false, taxStatus: "capital-gains" },
    { name: "Business Assets", category: "business", isRetirementEligible: false, taxStatus: "capital-gains" },
    { name: "Cash/Savings", category: "other", isRetirementEligible: false, taxStatus: "fully-taxable" }
  ];

  const applyTemplate = (template: any) => {
    setAssetForm(prev => ({
      ...prev,
      name: template.name,
      category: template.category,
      isRetirementEligible: template.isRetirementEligible,
      taxStatus: template.taxStatus
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'real-estate': return <Home className="h-4 w-4" />;
      case 'retirement': return <PiggyBank className="h-4 w-4" />;
      case 'investment': return <TrendingUp className="h-4 w-4" />;
      case 'business': return <Briefcase className="h-4 w-4" />;
      case 'other': return <Coins className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Assets Detail & Management
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="add">Add Asset</TabsTrigger>
            <TabsTrigger value="projections">Projections</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary & Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Assets</p>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalAssets)}</p>
                    </div>
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Asset Count</p>
                      <p className="text-2xl font-bold text-green-600">{dynamicAssets.length}</p>
                    </div>
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Retirement Eligible</p>
                      <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalRetirementEligible)}</p>
                    </div>
                    <PiggyBank className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Assets List Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Landmark className="h-5 w-5" />
                  Your Assets
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dynamicAssets.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No assets added yet</p>
                    <p className="text-sm text-gray-500">Use the "Add Asset" tab to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dynamicAssets.map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div 
                            className="w-4 h-4 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: asset.color }}
                          />
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(asset.category)}
                            <span className="font-medium">{asset.name}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {asset.category.replace('-', ' ')}
                          </span>
                          {asset.isRetirementEligible && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              Retirement
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-bold text-lg">{formatCurrencyFull(asset.value)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAsset(asset.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Asset Allocation Pie Chart */}
            {dynamicAssets.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Asset Allocation by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ChartContainer config={{}} className="w-full h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="add" className="space-y-6">
            {/* Asset Type Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Add Templates</CardTitle>
                <p className="text-sm text-gray-600">Click a template to pre-fill the form with common asset types</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {assetTypeTemplates.map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="p-4 h-auto flex flex-col items-center space-y-2 hover:bg-blue-50 hover:border-blue-300"
                      onClick={() => applyTemplate(template)}
                    >
                      {getCategoryIcon(template.category)}
                      <span className="text-sm font-medium">{template.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Add Asset Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Asset</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Asset Name</Label>
                    <Input
                      id="name"
                      value={assetForm.name}
                      onChange={(e) => handleAssetFormChange('name', e.target.value)}
                      placeholder="e.g., Primary Residence"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Current Value</Label>
                    <Input
                      id="amount"
                      value={assetForm.amount}
                      onChange={(e) => handleAssetFormChange('amount', e.target.value)}
                      placeholder="$500,000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={assetForm.category} onValueChange={(value) => handleAssetFormChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retirement">Retirement</SelectItem>
                        <SelectItem value="investment">Investment</SelectItem>
                        <SelectItem value="real-estate">Real Estate</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="acquisitionCost">Acquisition Cost (Optional)</Label>
                    <Input
                      id="acquisitionCost"
                      type="number"
                      value={assetForm.acquisitionCost}
                      onChange={(e) => handleAssetFormChange('acquisitionCost', parseFloat(e.target.value) || 0)}
                      placeholder="Original purchase price"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxStatus">Tax Status</Label>
                    <Select value={assetForm.taxStatus} onValueChange={(value) => handleAssetFormChange('taxStatus', value)}>
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

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="retirementEligible"
                      checked={assetForm.isRetirementEligible}
                      onChange={(e) => handleAssetFormChange('isRetirementEligible', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="retirementEligible">Retirement Eligible</Label>
                  </div>
                </div>

                <Button onClick={handleAddAsset} className="w-full" disabled={!assetForm.name || assetForm.value <= 0}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Asset
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Growth Projections</CardTitle>
                <p className="text-sm text-gray-600">
                  Project how your assets might grow over time with different scenarios
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Asset projections feature coming soon</p>
                  <p className="text-sm text-gray-500">Track growth scenarios and retirement planning</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Analysis & Insights</CardTitle>
                <p className="text-sm text-gray-600">
                  Deep dive into your asset allocation and performance metrics
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Asset analysis feature coming soon</p>
                  <p className="text-sm text-gray-500">Portfolio optimization and risk assessment</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
