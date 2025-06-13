import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import { Calculator, DollarSign, TrendingUp, AlertTriangle, FileText, Users, Plus, Edit, Calendar, Heart, BookOpen, Scale } from "lucide-react";

interface EstateDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EstateDocument {
  id: string;
  name: string;
  lastUpdated: string;
  status: "Current" | "Outdated" | "Pending";
  review: string;
}

interface TrustStructure {
  id: string;
  name: string;
  type: string;
  assets: string;
  purpose: string;
}

interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
  percentage: number;
  amount: number;
}

interface DocumentAction {
  id: string;
  action: string;
  priority: "High" | "Medium" | "Low";
}

export const EstateDetailDialog = ({ isOpen, onClose }: EstateDetailDialogProps) => {
  // Original estate data from EstateCard
  const totalEstateValue = 785000;
  const estateTaxes = 25000;
  const netEstateValue = totalEstateValue - estateTaxes;

  const estateBreakdownData = [
    {
      category: "Total Estate",
      amount: totalEstateValue,
      color: "#8b5cf6"
    },
    {
      category: "Estate Taxes",
      amount: estateTaxes,
      color: "#f59e0b"
    },
    {
      category: "Net to Beneficiaries",
      amount: netEstateValue,
      color: "#06b6d4"
    }
  ];

  const [estateAssets] = useState([
    { 
      name: "Real Estate", 
      currentValue: 620000, 
      taxableStatus: "Capital Gains",
      acquisitionCost: 450000,
      color: "#3b82f6"
    },
    { 
      name: "RRSP", 
      currentValue: 52000, 
      taxableStatus: "Fully Taxable",
      acquisitionCost: 35000,
      color: "#10b981"
    },
    { 
      name: "TFSA", 
      currentValue: 38000, 
      taxableStatus: "Tax-Free",
      acquisitionCost: 30000,
      color: "#8b5cf6"
    },
    { 
      name: "Non-Registered", 
      currentValue: 25000, 
      taxableStatus: "Capital Gains",
      acquisitionCost: 20000,
      color: "#f59e0b"
    },
  ]);

  // Individual sliders for each asset
  const [assetSettings, setAssetSettings] = useState({
    "Real Estate": { rateOfReturn: [5], timeFrame: [15] },
    "RRSP": { rateOfReturn: [7], timeFrame: [15] },
    "TFSA": { rateOfReturn: [6], timeFrame: [15] },
    "Non-Registered": { rateOfReturn: [6], timeFrame: [15] }
  });

  // Legacy tab state
  const [estateDocuments, setEstateDocuments] = useState<EstateDocument[]>([
    { id: "1", name: "Last Will & Testament", lastUpdated: "Mar 2024", status: "Current", review: "Review in 5 years" },
    { id: "2", name: "Power of Attorney", lastUpdated: "Mar 2024", status: "Current", review: "No expiry" },
    { id: "3", name: "Living Will", lastUpdated: "Jan 2020", status: "Outdated", review: "Review needed" },
    { id: "4", name: "Beneficiary Designations", lastUpdated: "Feb 2024", status: "Current", review: "Annual review" },
  ]);

  const [trustStructures, setTrustStructures] = useState<TrustStructure[]>([
    { id: "1", name: "Family Trust", type: "Discretionary", assets: "$185,000", purpose: "Tax minimization" },
    { id: "2", name: "Children's Education Trust", type: "Fixed", assets: "$50,000", purpose: "Education funding" },
  ]);

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    { id: "1", name: "Sarah Johnson", relationship: "Spouse", percentage: 60, amount: 471000 },
    { id: "2", name: "Michael Johnson", relationship: "Son", percentage: 25, amount: 196250 },
    { id: "3", name: "Emma Johnson", relationship: "Daughter", percentage: 15, amount: 117750 },
  ]);

  const [documentActions, setDocumentActions] = useState<DocumentAction[]>([
    { id: "1", action: "Update Living Will", priority: "High" },
    { id: "2", action: "Schedule Annual Review", priority: "Medium" },
    { id: "3", action: "Review Beneficiaries", priority: "Medium" },
  ]);

  const updateAssetSetting = (assetName: string, setting: 'rateOfReturn' | 'timeFrame', value: number[]) => {
    setAssetSettings(prev => ({
      ...prev,
      [assetName]: {
        ...prev[assetName],
        [setting]: value
      }
    }));
  };

  // Calculate future values and taxes for each asset
  const calculateAssetProjections = () => {
    return estateAssets.map(asset => {
      const settings = assetSettings[asset.name];
      const rateOfReturn = settings.rateOfReturn[0] / 100;
      const timeFrame = settings.timeFrame[0];
      
      // Future Value calculation
      const futureValue = asset.currentValue * Math.pow(1 + rateOfReturn, timeFrame);
      const totalGain = futureValue - asset.acquisitionCost;
      
      // Tax calculations based on asset type
      let taxableAmount = 0;
      let taxOwed = 0;
      const marginalTaxRate = 0.43; // Assume 43% marginal tax rate
      const capitalGainsRate = marginalTaxRate * 0.5; // 50% inclusion rate
      
      switch (asset.taxableStatus) {
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
        netValue: futureValue - taxOwed
      };
    });
  };

  const projectedAssets = calculateAssetProjections();
  const totalFutureValue = projectedAssets.reduce((sum, asset) => sum + asset.futureValue, 0);
  const totalTaxOwed = projectedAssets.reduce((sum, asset) => sum + asset.taxOwed, 0);
  const totalNetValue = projectedAssets.reduce((sum, asset) => sum + asset.netValue, 0);

  // Chart data for tax breakdown
  const taxBreakdownData = projectedAssets.map(asset => ({
    name: asset.name,
    grossValue: asset.futureValue,
    taxOwed: asset.taxOwed,
    netValue: asset.netValue,
    fill: asset.color
  }));

  const chartConfig = {
    grossValue: { label: "Gross Value", color: "#3b82f6" },
    taxOwed: { label: "Tax Owed", color: "#ef4444" },
    netValue: { label: "Net Value", color: "#10b981" },
    amount: { label: "Amount", color: "#8b5cf6" }
  };

  // Add dialog states for each section
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [showAddTrust, setShowAddTrust] = useState(false);
  const [showAddAction, setShowAddAction] = useState(false);
  const [showAddBeneficiary, setShowAddBeneficiary] = useState(false);

  // Add form states
  const [newDocument, setNewDocument] = useState({ name: "", status: "Current" as "Current" | "Outdated" | "Pending", review: "" });
  const [newTrust, setNewTrust] = useState({ name: "", type: "", assets: "", purpose: "" });
  const [newAction, setNewAction] = useState({ action: "", priority: "Medium" as "High" | "Medium" | "Low" });
  const [newBeneficiary, setNewBeneficiary] = useState({ name: "", relationship: "", percentage: 0 });

  // Add handlers for adding new items
  const handleAddDocument = () => {
    if (newDocument.name.trim()) {
      const document: EstateDocument = {
        id: Date.now().toString(),
        name: newDocument.name,
        lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        status: newDocument.status,
        review: newDocument.review || "Review annually"
      };
      setEstateDocuments([...estateDocuments, document]);
      setNewDocument({ name: "", status: "Current", review: "" });
      setShowAddDocument(false);
    }
  };

  const handleAddTrust = () => {
    if (newTrust.name.trim()) {
      const trust: TrustStructure = {
        id: Date.now().toString(),
        name: newTrust.name,
        type: newTrust.type || "Discretionary",
        assets: newTrust.assets || "$0",
        purpose: newTrust.purpose || "Tax planning"
      };
      setTrustStructures([...trustStructures, trust]);
      setNewTrust({ name: "", type: "", assets: "", purpose: "" });
      setShowAddTrust(false);
    }
  };

  const handleAddAction = () => {
    if (newAction.action.trim()) {
      const action: DocumentAction = {
        id: Date.now().toString(),
        action: newAction.action,
        priority: newAction.priority
      };
      setDocumentActions([...documentActions, action]);
      setNewAction({ action: "", priority: "Medium" });
      setShowAddAction(false);
    }
  };

  const handleAddBeneficiary = () => {
    if (newBeneficiary.name.trim() && newBeneficiary.percentage > 0) {
      // Calculate amount based on net estate value
      const amount = (netEstateValue * newBeneficiary.percentage) / 100;
      const beneficiary: Beneficiary = {
        id: Date.now().toString(),
        name: newBeneficiary.name,
        relationship: newBeneficiary.relationship || "Other",
        percentage: newBeneficiary.percentage,
        amount: amount
      };
      setBeneficiaries([...beneficiaries, beneficiary]);
      setNewBeneficiary({ name: "", relationship: "", percentage: 0 });
      setShowAddBeneficiary(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Estate Planning
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Estate Overview</TabsTrigger>
              <TabsTrigger value="legacy">Legacy</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Original Estate Value Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Estate Value Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={estateBreakdownData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis 
                          dataKey="category" 
                          tick={{ fontSize: 12 }}
                          interval={0}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                        />
                        <ChartTooltip 
                          content={<ChartTooltipContent 
                            formatter={(value) => [`$${Number(value).toLocaleString()}`, "Amount"]}
                          />}
                        />
                        <Bar 
                          dataKey="amount" 
                          radius={[4, 4, 0, 0]}
                        >
                          {estateBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>

                  {/* Original Summary Numbers */}
                  <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <p className="text-xs text-purple-700 font-medium">Total Estate</p>
                      <p className="text-lg font-bold text-purple-800">${(totalEstateValue / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <p className="text-xs text-amber-700 font-medium">Estate Taxes</p>
                      <p className="text-lg font-bold text-amber-800">${(estateTaxes / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="p-2 bg-cyan-100 rounded-lg">
                      <p className="text-xs text-cyan-700 font-medium">Net Amount</p>
                      <p className="text-lg font-bold text-cyan-800">${(netEstateValue / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Final Tax Projections Title */}
              <div className="text-2xl font-bold text-foreground">Final Tax Projections</div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">${(totalFutureValue / 1000).toFixed(0)}K</p>
                      <p className="text-sm text-muted-foreground">Total Future Value</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">${(totalTaxOwed / 1000).toFixed(0)}K</p>
                      <p className="text-sm text-muted-foreground">Estimated Taxes</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">${(totalNetValue / 1000).toFixed(0)}K</p>
                      <p className="text-sm text-muted-foreground">Net Estate Value</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Individual Asset Controls */}
              <div className="space-y-6">
                {projectedAssets.map((asset, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: asset.color }}></div>
                        {asset.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Controls */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Rate of Return: {asset.settings.rateOfReturn[0]}%
                          </label>
                          <Slider
                            value={asset.settings.rateOfReturn}
                            onValueChange={(value) => updateAssetSetting(asset.name, 'rateOfReturn', value)}
                            min={1}
                            max={15}
                            step={0.5}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Time Frame: {asset.settings.timeFrame[0]} years
                          </label>
                          <Slider
                            value={asset.settings.timeFrame}
                            onValueChange={(value) => updateAssetSetting(asset.name, 'timeFrame', value)}
                            min={1}
                            max={30}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      </div>

                      {/* Asset Projections */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-muted-foreground">Current Value</p>
                          <p className="text-lg font-bold">${(asset.currentValue / 1000).toFixed(0)}K</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-muted-foreground">Future Value</p>
                          <p className="text-lg font-bold text-blue-600">${(asset.futureValue / 1000).toFixed(0)}K</p>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <p className="text-xs text-muted-foreground">Tax Owed</p>
                          <p className="text-lg font-bold text-red-600">${(asset.taxOwed / 1000).toFixed(0)}K</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-xs text-muted-foreground">Net Value</p>
                          <p className="text-lg font-bold text-green-600">${(asset.netValue / 1000).toFixed(0)}K</p>
                        </div>
                      </div>

                      {/* Tax Status */}
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Calculator className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium text-orange-800">Tax Treatment: {asset.taxableStatus}</span>
                        </div>
                        <p className="text-xs text-orange-700">
                          {asset.taxableStatus === "Fully Taxable" && "Full value subject to marginal tax rate at death"}
                          {asset.taxableStatus === "Capital Gains" && "Only gains subject to capital gains tax (50% inclusion rate)"}
                          {asset.taxableStatus === "Tax-Free" && "No tax implications on this asset"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Detailed Tax Calculations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detailed Tax Calculations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Asset</th>
                          <th className="text-right p-2">Current Value</th>
                          <th className="text-right p-2">Future Value</th>
                          <th className="text-right p-2">Taxable Amount</th>
                          <th className="text-right p-2">Tax Rate</th>
                          <th className="text-right p-2">Tax Owed</th>
                          <th className="text-right p-2">Net Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectedAssets.map((asset, index) => {
                          const taxRate = asset.taxableStatus === "Fully Taxable" ? 43 :
                                         asset.taxableStatus === "Capital Gains" ? 21.5 : 0;
                          return (
                            <tr key={index} className="border-b">
                              <td className="p-2 font-medium">{asset.name}</td>
                              <td className="text-right p-2">${asset.currentValue.toLocaleString()}</td>
                              <td className="text-right p-2 font-medium">${asset.futureValue.toLocaleString()}</td>
                              <td className="text-right p-2">${asset.taxableAmount.toLocaleString()}</td>
                              <td className="text-right p-2">{taxRate}%</td>
                              <td className="text-right p-2 text-red-600 font-medium">${asset.taxOwed.toLocaleString()}</td>
                              <td className="text-right p-2 text-green-600 font-bold">${asset.netValue.toLocaleString()}</td>
                            </tr>
                          );
                        })}
                        <tr className="border-t-2 font-bold">
                          <td className="p-2">Total</td>
                          <td className="text-right p-2">${estateAssets.reduce((sum, asset) => sum + asset.currentValue, 0).toLocaleString()}</td>
                          <td className="text-right p-2">${totalFutureValue.toLocaleString()}</td>
                          <td className="text-right p-2">${projectedAssets.reduce((sum, asset) => sum + asset.taxableAmount, 0).toLocaleString()}</td>
                          <td className="text-right p-2">-</td>
                          <td className="text-right p-2 text-red-600">${totalTaxOwed.toLocaleString()}</td>
                          <td className="text-right p-2 text-green-600">${totalNetValue.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="legacy" className="space-y-6">
              {/* Estate Documents Status */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="bg-blue-100 border-b border-blue-200">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="text-blue-800">Estate Documents Status</span>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddDocument(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Document
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {estateDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border border-blue-200 rounded-lg bg-white">
                        <div>
                          <h4 className="font-medium text-blue-900">{doc.name}</h4>
                          <p className="text-sm text-blue-700">Last Updated: {doc.lastUpdated}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <Badge variant={doc.status === "Current" ? "secondary" : doc.status === "Outdated" ? "destructive" : "outline"}>
                              {doc.status}
                            </Badge>
                            <p className="text-xs text-blue-600 mt-1">{doc.review}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trust Structures */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="bg-green-100 border-b border-green-200">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Scale className="h-5 w-5 text-green-600" />
                      <span className="text-green-800">Trust Structures</span>
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => setShowAddTrust(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Trust
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {trustStructures.map((trust) => (
                      <div key={trust.id} className="p-4 border border-green-200 rounded-lg bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-green-900">{trust.name}</h4>
                          <Badge variant="outline" className="border-green-300 text-green-700">{trust.type}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-green-600">Assets</p>
                            <p className="font-medium text-green-800">{trust.assets}</p>
                          </div>
                          <div>
                            <p className="text-green-600">Purpose</p>
                            <p className="font-medium text-green-800">{trust.purpose}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Document Actions */}
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader className="bg-orange-100 border-b border-orange-200">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-orange-600" />
                      <span className="text-orange-800">Document Actions</span>
                    </div>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700" onClick={() => setShowAddAction(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Action
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {documentActions.map((action) => (
                      <div key={action.id} className="flex items-center justify-between p-3 border border-orange-200 rounded-lg bg-white">
                        <span className="font-medium text-orange-900">{action.action}</span>
                        <Badge variant={action.priority === "High" ? "destructive" : action.priority === "Medium" ? "default" : "secondary"}>
                          {action.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Beneficiary Allocation */}
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader className="bg-purple-100 border-b border-purple-200">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <span className="text-purple-800">Beneficiary Allocation</span>
                    </div>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowAddBeneficiary(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Beneficiary
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {beneficiaries.map((beneficiary) => (
                      <div key={beneficiary.id} className="flex items-center justify-between p-4 border border-purple-200 rounded-lg bg-white">
                        <div>
                          <h4 className="font-medium text-purple-900">{beneficiary.name}</h4>
                          <p className="text-sm text-purple-700">{beneficiary.relationship}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-800">{beneficiary.percentage}%</p>
                          <p className="text-sm text-purple-600">${beneficiary.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Add Document Dialog */}
      <Dialog open={showAddDocument} onOpenChange={setShowAddDocument}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Estate Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Document Name</label>
              <Input
                value={newDocument.name}
                onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                placeholder="e.g., Power of Attorney"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={newDocument.status}
                onChange={(e) => setNewDocument({ ...newDocument, status: e.target.value as "Current" | "Outdated" | "Pending" })}
              >
                <option value="Current">Current</option>
                <option value="Outdated">Outdated</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Review Notes</label>
              <Input
                value={newDocument.review}
                onChange={(e) => setNewDocument({ ...newDocument, review: e.target.value })}
                placeholder="e.g., Review annually"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddDocument(false)}>Cancel</Button>
              <Button onClick={handleAddDocument}>Add Document</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Trust Dialog */}
      <Dialog open={showAddTrust} onOpenChange={setShowAddTrust}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Trust Structure</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Trust Name</label>
              <Input
                value={newTrust.name}
                onChange={(e) => setNewTrust({ ...newTrust, name: e.target.value })}
                placeholder="e.g., Family Trust"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <Input
                value={newTrust.type}
                onChange={(e) => setNewTrust({ ...newTrust, type: e.target.value })}
                placeholder="e.g., Discretionary"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Assets</label>
              <Input
                value={newTrust.assets}
                onChange={(e) => setNewTrust({ ...newTrust, assets: e.target.value })}
                placeholder="e.g., $100,000"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Purpose</label>
              <Input
                value={newTrust.purpose}
                onChange={(e) => setNewTrust({ ...newTrust, purpose: e.target.value })}
                placeholder="e.g., Tax minimization"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddTrust(false)}>Cancel</Button>
              <Button onClick={handleAddTrust}>Add Trust</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Action Dialog */}
      <Dialog open={showAddAction} onOpenChange={setShowAddAction}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Document Action</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Action</label>
              <Input
                value={newAction.action}
                onChange={(e) => setNewAction({ ...newAction, action: e.target.value })}
                placeholder="e.g., Update beneficiary designations"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Priority</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={newAction.priority}
                onChange={(e) => setNewAction({ ...newAction, priority: e.target.value as "High" | "Medium" | "Low" })}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddAction(false)}>Cancel</Button>
              <Button onClick={handleAddAction}>Add Action</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Beneficiary Dialog */}
      <Dialog open={showAddBeneficiary} onOpenChange={setShowAddBeneficiary}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Beneficiary</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={newBeneficiary.name}
                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, name: e.target.value })}
                placeholder="e.g., John Smith"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Relationship</label>
              <Input
                value={newBeneficiary.relationship}
                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, relationship: e.target.value })}
                placeholder="e.g., Son"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Percentage</label>
              <Input
                type="number"
                value={newBeneficiary.percentage}
                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, percentage: Number(e.target.value) })}
                placeholder="e.g., 25"
                min="0"
                max="100"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddBeneficiary(false)}>Cancel</Button>
              <Button onClick={handleAddBeneficiary}>Add Beneficiary</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
