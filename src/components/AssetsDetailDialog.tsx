
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  Legend 
} from "recharts";
import { 
  Plus, 
  FileText, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Calculator,
  TrendingUp,
  DollarSign,
  Home,
  Building,
  Car,
  Briefcase,
  Coins
} from "lucide-react";

interface Asset {
  name: string;
  amount: string;
  value: number;
  color: string;
  category?: string;
  acquisitionDate?: string;
  acquisitionCost?: number;
  currentMarketValue?: number;
  appreciationRate?: number;
}

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
}

interface NewAsset {
  name: string;
  value: string;
  category: string;
  acquisitionDate: string;
  acquisitionCost: string;
}

export const AssetsDetailDialog = ({ isOpen, onClose, assets }: AssetsDetailDialogProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [assetsList, setAssetsList] = useState<Asset[]>(assets);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [newAsset, setNewAsset] = useState<NewAsset>({
    name: "",
    value: "",
    category: "Real Estate",
    acquisitionDate: "",
    acquisitionCost: ""
  });

  const assetCategories = [
    "Real Estate",
    "Investment Accounts",
    "Vehicles", 
    "Business Assets",
    "Personal Property",
    "Cash & Savings",
    "Other"
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Real Estate": return <Home className="h-4 w-4" />;
      case "Investment Accounts": return <TrendingUp className="h-4 w-4" />;
      case "Vehicles": return <Car className="h-4 w-4" />;
      case "Business Assets": return <Briefcase className="h-4 w-4" />;
      case "Personal Property": return <Building className="h-4 w-4" />;
      case "Cash & Savings": return <Coins className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const generateColor = (index: number) => {
    const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#84cc16", "#f97316"];
    return colors[index % colors.length];
  };

  const handleAddAsset = () => {
    if (newAsset.name && newAsset.value) {
      const assetValue = parseFloat(newAsset.value.replace(/[^0-9.-]+/g, ""));
      const acquisitionCost = parseFloat(newAsset.acquisitionCost.replace(/[^0-9.-]+/g, "")) || assetValue;
      
      const asset: Asset = {
        name: newAsset.name,
        amount: `$${assetValue.toLocaleString()}`,
        value: assetValue,
        color: generateColor(assetsList.length),
        category: newAsset.category,
        acquisitionDate: newAsset.acquisitionDate,
        acquisitionCost: acquisitionCost,
        currentMarketValue: assetValue,
        appreciationRate: 3.5 // Default appreciation rate
      };

      setAssetsList([...assetsList, asset]);
      setNewAsset({
        name: "",
        value: "",
        category: "Real Estate",
        acquisitionDate: "",
        acquisitionCost: ""
      });
      setShowAddForm(false);
    }
  };

  const handleGenerateDocument = (asset: Asset) => {
    // Generate document content for any asset
    const documentContent = `
ASSET DOCUMENTATION REPORT
==========================

Asset Name: ${asset.name}
Category: ${asset.category || 'Not specified'}
Current Market Value: ${asset.amount}
Acquisition Cost: $${asset.acquisitionCost?.toLocaleString() || 'Not specified'}
Acquisition Date: ${asset.acquisitionDate || 'Not specified'}
Estimated Appreciation Rate: ${asset.appreciationRate || 3.5}% annually

VALUATION SUMMARY
-----------------
Current Value: ${asset.amount}
Original Cost: $${asset.acquisitionCost?.toLocaleString() || 'Not specified'}
Unrealized Gain/Loss: $${asset.acquisitionCost ? (asset.value - asset.acquisitionCost).toLocaleString() : 'Not calculated'}

RECOMMENDATIONS
---------------
• Review asset valuation annually
• Consider professional appraisal for significant assets
• Update insurance coverage as needed
• Monitor market conditions for optimal timing

Generated on: ${new Date().toLocaleDateString()}
    `.trim();

    // Create and download the document
    const blob = new Blob([documentContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${asset.name.replace(/[^a-z0-9]/gi, '_')}_asset_report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`Generated document for ${asset.name}`);
  };

  const handleDeleteAsset = (assetToDelete: Asset) => {
    setAssetsList(assetsList.filter(asset => asset.name !== assetToDelete.name));
    if (selectedAsset?.name === assetToDelete.name) {
      setSelectedAsset(null);
    }
  };

  const totalValue = assetsList.reduce((sum, asset) => sum + asset.value, 0);

  const chartData = assetsList.map(asset => ({
    name: asset.name,
    value: asset.value,
    fill: asset.color
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Assets Portfolio Analysis
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Asset Details</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Portfolio Distribution Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Value"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Summary Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{assetsList.length}</p>
                      <p className="text-sm text-blue-700">Total Assets</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</p>
                      <p className="text-sm text-green-700">Total Value</p>
                    </div>
                  </div>
                  
                  {/* Asset Categories */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Asset Categories</h4>
                    {Array.from(new Set(assetsList.map(asset => asset.category || 'Other'))).map(category => {
                      const categoryAssets = assetsList.filter(asset => (asset.category || 'Other') === category);
                      const categoryValue = categoryAssets.reduce((sum, asset) => sum + asset.value, 0);
                      const percentage = ((categoryValue / totalValue) * 100).toFixed(1);
                      
                      return (
                        <div key={category} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(category)}
                            <span className="text-sm">{category}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">${categoryValue.toLocaleString()}</p>
                            <p className="text-xs text-gray-600">{percentage}%</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assetsList.map((asset, index) => (
                <Card key={index} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: asset.color }}
                        />
                        {asset.name}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGenerateDocument(asset)}
                          className="flex items-center gap-1"
                        >
                          <FileText className="h-3 w-3" />
                          Generate Doc
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedAsset(asset)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteAsset(asset)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Current Value</span>
                        <span className="font-medium">{asset.amount}</span>
                      </div>
                      {asset.category && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Category</span>
                          <Badge variant="secondary">{asset.category}</Badge>
                        </div>
                      )}
                      {asset.acquisitionCost && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Acquisition Cost</span>
                          <span className="font-medium">${asset.acquisitionCost.toLocaleString()}</span>
                        </div>
                      )}
                      {asset.acquisitionDate && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Acquisition Date</span>
                          <span className="font-medium">{asset.acquisitionDate}</span>
                        </div>
                      )}
                      {asset.acquisitionCost && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Unrealized Gain/Loss</span>
                          <span className={`font-medium ${asset.value >= asset.acquisitionCost ? 'text-green-600' : 'text-red-600'}`}>
                            ${(asset.value - asset.acquisitionCost).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Asset Management</h3>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Asset
              </Button>
            </div>

            {showAddForm && (
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
                        value={newAsset.name}
                        onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                        placeholder="e.g., Primary Residence"
                      />
                    </div>
                    <div>
                      <Label htmlFor="assetValue">Current Value</Label>
                      <Input
                        id="assetValue"
                        value={newAsset.value}
                        onChange={(e) => setNewAsset({ ...newAsset, value: e.target.value })}
                        placeholder="e.g., 650000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        value={newAsset.category}
                        onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        {assetCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="acquisitionDate">Acquisition Date</Label>
                      <Input
                        id="acquisitionDate"
                        type="date"
                        value={newAsset.acquisitionDate}
                        onChange={(e) => setNewAsset({ ...newAsset, acquisitionDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="acquisitionCost">Acquisition Cost</Label>
                      <Input
                        id="acquisitionCost"
                        value={newAsset.acquisitionCost}
                        onChange={(e) => setNewAsset({ ...newAsset, acquisitionCost: e.target.value })}
                        placeholder="e.g., 500000"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddAsset}>Add Asset</Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Asset List with Management Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Current Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assetsList.map((asset, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: asset.color }}
                        />
                        <div>
                          <p className="font-medium">{asset.name}</p>
                          <p className="text-sm text-gray-600">{asset.category || 'Other'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{asset.amount}</span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleGenerateDocument(asset)}
                            title="Generate Document"
                          >
                            <FileText className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedAsset(asset)}
                            title="View Details"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteAsset(asset)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete Asset"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Reports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => {
                      // Generate portfolio summary report
                      const summaryReport = `
PORTFOLIO SUMMARY REPORT
========================

Total Assets: ${assetsList.length}
Total Portfolio Value: $${totalValue.toLocaleString()}

ASSET BREAKDOWN:
${assetsList.map(asset => `• ${asset.name}: ${asset.amount}`).join('\n')}

CATEGORY DISTRIBUTION:
${Array.from(new Set(assetsList.map(asset => asset.category || 'Other'))).map(category => {
  const categoryValue = assetsList.filter(asset => (asset.category || 'Other') === category)
    .reduce((sum, asset) => sum + asset.value, 0);
  const percentage = ((categoryValue / totalValue) * 100).toFixed(1);
  return `• ${category}: $${categoryValue.toLocaleString()} (${percentage}%)`;
}).join('\n')}

Generated on: ${new Date().toLocaleDateString()}
                      `.trim();

                      const blob = new Blob([summaryReport], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'portfolio_summary_report.txt';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Portfolio Summary Report
                  </Button>
                  
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => {
                      // Generate detailed asset report for all assets
                      const detailedReport = assetsList.map(asset => `
ASSET: ${asset.name}
Category: ${asset.category || 'Not specified'}
Current Value: ${asset.amount}
Acquisition Cost: $${asset.acquisitionCost?.toLocaleString() || 'Not specified'}
Acquisition Date: ${asset.acquisitionDate || 'Not specified'}
Unrealized Gain/Loss: $${asset.acquisitionCost ? (asset.value - asset.acquisitionCost).toLocaleString() : 'Not calculated'}
-------------------
                      `).join('\n');

                      const fullReport = `
DETAILED ASSETS REPORT
======================

Generated on: ${new Date().toLocaleDateString()}
Total Portfolio Value: $${totalValue.toLocaleString()}

${detailedReport}
                      `.trim();

                      const blob = new Blob([fullReport], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'detailed_assets_report.txt';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Detailed Assets Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Individual Asset Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {assetsList.map((asset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => handleGenerateDocument(asset)}
                    >
                      <span className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: asset.color }}
                        />
                        {asset.name}
                      </span>
                      <FileText className="h-4 w-4" />
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Asset Detail Modal */}
        {selectedAsset && (
          <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedAsset.name} Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Current Value</Label>
                    <p className="font-medium">{selectedAsset.amount}</p>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <p className="font-medium">{selectedAsset.category || 'Not specified'}</p>
                  </div>
                  {selectedAsset.acquisitionCost && (
                    <div>
                      <Label>Acquisition Cost</Label>
                      <p className="font-medium">${selectedAsset.acquisitionCost.toLocaleString()}</p>
                    </div>
                  )}
                  {selectedAsset.acquisitionDate && (
                    <div>
                      <Label>Acquisition Date</Label>
                      <p className="font-medium">{selectedAsset.acquisitionDate}</p>
                    </div>
                  )}
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleGenerateDocument(selectedAsset)}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Generate Document
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedAsset(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};
