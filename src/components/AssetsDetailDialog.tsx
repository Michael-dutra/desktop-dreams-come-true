
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";
import { Calculator, DollarSign, TrendingUp, AlertTriangle, FileText, Users, Plus, Edit, Calendar, Heart, BookOpen, Scale, X, Trash2, Building2, CreditCard, Home, Coins, Banknote, Smartphone } from "lucide-react";

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Asset {
  id: string;
  name: string;
  type: "Real Estate" | "RRSP" | "TFSA" | "Non-Registered" | "Digital Asset";
  value: number;
  acquisitionCost?: number;
  acquisitionDate?: string;
  description?: string;
  institution?: string;
  accountNumber?: string;
  beneficiary?: string;
  maturityDate?: string;
  interestRate?: number;
  riskLevel?: "Low" | "Medium" | "High";
  location?: string;
  propertyType?: string;
  digitalAssetType?: string;
  walletAddress?: string;
}

interface AssetFormData {
  name: string;
  type: "Real Estate" | "RRSP" | "TFSA" | "Non-Registered" | "Digital Asset";
  value: string;
  acquisitionCost: string;
  acquisitionDate: string;
  description: string;
  institution: string;
  accountNumber: string;
  beneficiary: string;
  maturityDate: string;
  interestRate: string;
  riskLevel: "Low" | "Medium" | "High";
  location: string;
  propertyType: string;
  digitalAssetType: string;
  walletAddress: string;
}

export const AssetsDetailDialog = ({ isOpen, onClose }: AssetsDetailDialogProps) => {
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "1",
      name: "Primary Residence",
      type: "Real Estate",
      value: 620000,
      acquisitionCost: 450000,
      acquisitionDate: "2020-03-15",
      description: "4-bedroom family home",
      location: "Toronto, ON",
      propertyType: "Residential"
    },
    {
      id: "2",
      name: "Company RRSP",
      type: "RRSP",
      value: 52000,
      acquisitionCost: 35000,
      institution: "TD Bank",
      accountNumber: "****1234",
      beneficiary: "Sarah Johnson",
      riskLevel: "Medium"
    },
    {
      id: "3",
      name: "TFSA Savings",
      type: "TFSA",
      value: 38000,
      acquisitionCost: 30000,
      institution: "RBC",
      accountNumber: "****5678",
      beneficiary: "Sarah Johnson",
      riskLevel: "Low"
    },
    {
      id: "4",
      name: "Investment Portfolio",
      type: "Non-Registered",
      value: 25000,
      acquisitionCost: 20000,
      institution: "Questrade",
      accountNumber: "****9012",
      riskLevel: "High"
    },
    {
      id: "5",
      name: "Bitcoin Holdings",
      type: "Digital Asset",
      value: 15000,
      acquisitionCost: 10000,
      acquisitionDate: "2023-01-01",
      digitalAssetType: "Cryptocurrency",
      walletAddress: "bc1q...xyz123",
      riskLevel: "High"
    }
  ]);

  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState<AssetFormData>({
    name: "",
    type: "Non-Registered",
    value: "",
    acquisitionCost: "",
    acquisitionDate: "",
    description: "",
    institution: "",
    accountNumber: "",
    beneficiary: "",
    maturityDate: "",
    interestRate: "",
    riskLevel: "Medium",
    location: "",
    propertyType: "",
    digitalAssetType: "",
    walletAddress: ""
  });

  // Calculate totals and breakdown
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalCost = assets.reduce((sum, asset) => sum + (asset.acquisitionCost || 0), 0);
  const totalGain = totalValue - totalCost;

  const assetsByType = assets.reduce((acc, asset) => {
    const existing = acc.find(item => item.type === asset.type);
    if (existing) {
      existing.value += asset.value;
      existing.count += 1;
    } else {
      acc.push({
        type: asset.type,
        value: asset.value,
        count: 1,
        color: getAssetColor(asset.type)
      });
    }
    return acc;
  }, [] as Array<{ type: string; value: number; count: number; color: string }>);

  function getAssetColor(type: string): string {
    switch (type) {
      case "Real Estate": return "#3b82f6";
      case "RRSP": return "#10b981";
      case "TFSA": return "#8b5cf6";
      case "Non-Registered": return "#f59e0b";
      case "Digital Asset": return "#ef4444";
      default: return "#6b7280";
    }
  }

  function getAssetIcon(type: string) {
    switch (type) {
      case "Real Estate": return <Home className="h-4 w-4" />;
      case "RRSP": return <Building2 className="h-4 w-4" />;
      case "TFSA": return <CreditCard className="h-4 w-4" />;
      case "Non-Registered": return <TrendingUp className="h-4 w-4" />;
      case "Digital Asset": return <Smartphone className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else {
      return `$${(value / 1000).toFixed(0)}K`;
    }
  };

  const handleInputChange = (field: keyof AssetFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAsset = () => {
    if (!formData.name || !formData.value) return;

    const newAsset: Asset = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      value: parseFloat(formData.value) || 0,
      acquisitionCost: parseFloat(formData.acquisitionCost) || undefined,
      acquisitionDate: formData.acquisitionDate || undefined,
      description: formData.description || undefined,
      institution: formData.institution || undefined,
      accountNumber: formData.accountNumber || undefined,
      beneficiary: formData.beneficiary || undefined,
      maturityDate: formData.maturityDate || undefined,
      interestRate: parseFloat(formData.interestRate) || undefined,
      riskLevel: formData.riskLevel,
      location: formData.location || undefined,
      propertyType: formData.propertyType || undefined,
      digitalAssetType: formData.digitalAssetType || undefined,
      walletAddress: formData.walletAddress || undefined
    };

    setAssets([...assets, newAsset]);
    resetForm();
    setIsAddingAsset(false);
  };

  const handleEditAsset = () => {
    if (!editingAsset || !formData.name || !formData.value) return;

    const updatedAsset: Asset = {
      ...editingAsset,
      name: formData.name,
      type: formData.type,
      value: parseFloat(formData.value) || 0,
      acquisitionCost: parseFloat(formData.acquisitionCost) || undefined,
      acquisitionDate: formData.acquisitionDate || undefined,
      description: formData.description || undefined,
      institution: formData.institution || undefined,
      accountNumber: formData.accountNumber || undefined,
      beneficiary: formData.beneficiary || undefined,
      maturityDate: formData.maturityDate || undefined,
      interestRate: parseFloat(formData.interestRate) || undefined,
      riskLevel: formData.riskLevel,
      location: formData.location || undefined,
      propertyType: formData.propertyType || undefined,
      digitalAssetType: formData.digitalAssetType || undefined,
      walletAddress: formData.walletAddress || undefined
    };

    setAssets(assets.map(asset => asset.id === editingAsset.id ? updatedAsset : asset));
    resetForm();
    setEditingAsset(null);
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id));
  };

  const startEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setFormData({
      name: asset.name,
      type: asset.type,
      value: asset.value.toString(),
      acquisitionCost: asset.acquisitionCost?.toString() || "",
      acquisitionDate: asset.acquisitionDate || "",
      description: asset.description || "",
      institution: asset.institution || "",
      accountNumber: asset.accountNumber || "",
      beneficiary: asset.beneficiary || "",
      maturityDate: asset.maturityDate || "",
      interestRate: asset.interestRate?.toString() || "",
      riskLevel: asset.riskLevel || "Medium",
      location: asset.location || "",
      propertyType: asset.propertyType || "",
      digitalAssetType: asset.digitalAssetType || "",
      walletAddress: asset.walletAddress || ""
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "Non-Registered",
      value: "",
      acquisitionCost: "",
      acquisitionDate: "",
      description: "",
      institution: "",
      accountNumber: "",
      beneficiary: "",
      maturityDate: "",
      interestRate: "",
      riskLevel: "Medium",
      location: "",
      propertyType: "",
      digitalAssetType: "",
      walletAddress: ""
    });
  };

  const renderFormFields = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Asset Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Primary Residence"
            />
          </div>
          <div>
            <Label htmlFor="type">Asset Type *</Label>
            <Select value={formData.type} onValueChange={(value: any) => handleInputChange("type", value)}>
              <SelectTrigger>
                <SelectValue />
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="value">Current Value *</Label>
            <Input
              id="value"
              type="number"
              value={formData.value}
              onChange={(e) => handleInputChange("value", e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="acquisitionCost">Acquisition Cost</Label>
            <Input
              id="acquisitionCost"
              type="number"
              value={formData.acquisitionCost}
              onChange={(e) => handleInputChange("acquisitionCost", e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="acquisitionDate">Acquisition Date</Label>
            <Input
              id="acquisitionDate"
              type="date"
              value={formData.acquisitionDate}
              onChange={(e) => handleInputChange("acquisitionDate", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="riskLevel">Risk Level</Label>
            <Select value={formData.riskLevel} onValueChange={(value: any) => handleInputChange("riskLevel", value)}>
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
        </div>

        {/* Conditional fields based on asset type */}
        {(formData.type === "RRSP" || formData.type === "TFSA" || formData.type === "Non-Registered") && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm">Investment Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  value={formData.institution}
                  onChange={(e) => handleInputChange("institution", e.target.value)}
                  placeholder="e.g., TD Bank"
                />
              </div>
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                  placeholder="e.g., ****1234"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="beneficiary">Beneficiary</Label>
                <Input
                  id="beneficiary"
                  value={formData.beneficiary}
                  onChange={(e) => handleInputChange("beneficiary", e.target.value)}
                  placeholder="e.g., Sarah Johnson"
                />
              </div>
              <div>
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.01"
                  value={formData.interestRate}
                  onChange={(e) => handleInputChange("interestRate", e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        )}

        {formData.type === "Real Estate" && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm">Property Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="e.g., Toronto, ON"
                />
              </div>
              <div>
                <Label htmlFor="propertyType">Property Type</Label>
                <Input
                  id="propertyType"
                  value={formData.propertyType}
                  onChange={(e) => handleInputChange("propertyType", e.target.value)}
                  placeholder="e.g., Residential"
                />
              </div>
            </div>
          </div>
        )}

        {formData.type === "Digital Asset" && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm">Digital Asset Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="digitalAssetType">Asset Type</Label>
                <Input
                  id="digitalAssetType"
                  value={formData.digitalAssetType}
                  onChange={(e) => handleInputChange("digitalAssetType", e.target.value)}
                  placeholder="e.g., Cryptocurrency, NFT"
                />
              </div>
              <div>
                <Label htmlFor="walletAddress">Wallet Address</Label>
                <Input
                  id="walletAddress"
                  value={formData.walletAddress}
                  onChange={(e) => handleInputChange("walletAddress", e.target.value)}
                  placeholder="e.g., bc1q...xyz123"
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Additional notes about this asset..."
            rows={3}
          />
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Assets Management
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assets">Assets List</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(totalValue)}</p>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totalGain)}</p>
                    <p className="text-sm text-muted-foreground">Total Gains</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{assets.length}</p>
                    <p className="text-sm text-muted-foreground">Total Assets</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Asset Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ChartContainer config={{}} className="h-full w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={assetsByType}
                            dataKey="value"
                            nameKey="type"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={({ type, value }) => `${type}: ${formatCurrency(value)}`}
                          >
                            {assetsByType.map((entry, index) => (
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
                  </div>
                  <div className="space-y-3">
                    {assetsByType.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <div>
                            <p className="font-medium">{item.type}</p>
                            <p className="text-sm text-muted-foreground">{item.count} asset{item.count !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(item.value)}</p>
                          <p className="text-sm text-muted-foreground">
                            {((item.value / totalValue) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Assets List</h3>
              <Button onClick={() => setIsAddingAsset(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Asset
              </Button>
            </div>

            {/* Assets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assets.map((asset) => (
                <Card key={asset.id} className="relative">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getAssetIcon(asset.type)}
                        <span className="text-lg">{asset.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditAsset(asset)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Current Value</span>
                      <span className="font-bold text-lg">{formatCurrency(asset.value)}</span>
                    </div>
                    
                    {asset.acquisitionCost && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Acquisition Cost</span>
                        <span className="font-medium">{formatCurrency(asset.acquisitionCost)}</span>
                      </div>
                    )}
                    
                    {asset.acquisitionCost && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Gain/Loss</span>
                        <span className={`font-medium ${asset.value >= asset.acquisitionCost ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(asset.value - asset.acquisitionCost)}
                        </span>
                      </div>
                    )}

                    <div className="pt-2 border-t">
                      <Badge variant="outline">{asset.type}</Badge>
                      {asset.riskLevel && (
                        <Badge 
                          variant={asset.riskLevel === "High" ? "destructive" : asset.riskLevel === "Medium" ? "default" : "secondary"}
                          className="ml-2"
                        >
                          {asset.riskLevel} Risk
                        </Badge>
                      )}
                    </div>

                    {asset.description && (
                      <p className="text-sm text-muted-foreground">{asset.description}</p>
                    )}

                    {/* Type-specific details */}
                    {asset.institution && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Institution: </span>
                        <span>{asset.institution}</span>
                      </div>
                    )}
                    
                    {asset.location && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Location: </span>
                        <span>{asset.location}</span>
                      </div>
                    )}
                    
                    {asset.digitalAssetType && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Type: </span>
                        <span>{asset.digitalAssetType}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ChartContainer config={{}} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={assetsByType} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis tickFormatter={formatCurrency} />
                        <ChartTooltip 
                          content={<ChartTooltipContent 
                            formatter={(value) => [formatCurrency(Number(value)), "Value"]}
                          />}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {assetsByType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            {/* Risk Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {["Low", "Medium", "High"].map((risk) => {
                    const riskAssets = assets.filter(asset => asset.riskLevel === risk);
                    const riskValue = riskAssets.reduce((sum, asset) => sum + asset.value, 0);
                    const percentage = totalValue > 0 ? ((riskValue / totalValue) * 100).toFixed(1) : "0";
                    
                    return (
                      <div key={risk} className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold">{formatCurrency(riskValue)}</p>
                        <p className="text-sm text-muted-foreground">{risk} Risk</p>
                        <p className="text-xs text-muted-foreground">{percentage}% of portfolio</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Asset Dialog */}
        <Dialog open={isAddingAsset} onOpenChange={setIsAddingAsset}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Asset</DialogTitle>
            </DialogHeader>
            {renderFormFields()}
            <div className="flex gap-2 justify-end mt-6">
              <Button variant="outline" onClick={() => { setIsAddingAsset(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleAddAsset}>Add Asset</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Asset Dialog */}
        <Dialog open={!!editingAsset} onOpenChange={() => setEditingAsset(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Asset</DialogTitle>
            </DialogHeader>
            {renderFormFields()}
            <div className="flex gap-2 justify-end mt-6">
              <Button variant="outline" onClick={() => { setEditingAsset(null); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleEditAsset}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};
