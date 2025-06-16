
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Home, Building2, Briefcase, DollarSign, Calculator, Bot } from "lucide-react";
import { AssetControlSliders } from "./AssetControlSliders";
import { SectionAIDialog } from "./SectionAIDialog";

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssetsDetailDialog = ({ isOpen, onClose }: AssetsDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [aiDialogOpen, setAIDialogOpen] = useState(false);

  // Asset data with growth projections
  const [assets, setAssets] = useState({
    // Registered assets
    rrsp: { currentValue: 45000, growthRate: 7, projectionYears: 20 },
    tfsa: { currentValue: 30000, growthRate: 6, projectionYears: 20 },
    rpp: { currentValue: 15000, growthRate: 7, projectionYears: 20 },
    
    // Non-registered assets
    nonRegistered: { 
      currentValue: 25000, 
      growthRate: 5, 
      projectionYears: 20,
      costBase: 20000
    },
    
    // Real estate
    primaryResidence: { currentValue: 450000, growthRate: 3, projectionYears: 20 },
    secondaryProperty: { 
      currentValue: 280000, 
      growthRate: 4, 
      projectionYears: 20,
      originalPurchasePrice: 220000,
      capitalImprovements: 15000
    },
    
    // Business assets
    businessAssets: { currentValue: 75000, growthRate: 8, projectionYears: 10 },
  });

  const updateDynamicAsset = (assetType: string, field: string, value: number) => {
    setAssets(prev => ({
      ...prev,
      [assetType]: {
        ...prev[assetType as keyof typeof prev],
        [field]: value
      }
    }));
  };

  // Calculate future values
  const calculateFutureValue = (currentValue: number, growthRate: number, years: number) => {
    return currentValue * Math.pow(1 + growthRate / 100, years);
  };

  // Calculate capital gains based on FUTURE VALUE minus cost basis
  const calculateCapitalGain = (futureValue: number, costBase: number) => {
    return Math.max(0, futureValue - costBase);
  };

  const calculateCapitalGainsTax = (capitalGain: number, taxRate: number = 0.25) => {
    return capitalGain * 0.5 * taxRate; // 50% inclusion rate
  };

  // Updated asset calculations using future values
  const assetCalculations = {
    rrsp: {
      ...assets.rrsp,
      futureValue: calculateFutureValue(assets.rrsp.currentValue, assets.rrsp.growthRate, assets.rrsp.projectionYears)
    },
    tfsa: {
      ...assets.tfsa,
      futureValue: calculateFutureValue(assets.tfsa.currentValue, assets.tfsa.growthRate, assets.tfsa.projectionYears)
    },
    rpp: {
      ...assets.rpp,
      futureValue: calculateFutureValue(assets.rpp.currentValue, assets.rpp.growthRate, assets.rpp.projectionYears)
    },
    nonRegistered: {
      ...assets.nonRegistered,
      futureValue: calculateFutureValue(assets.nonRegistered.currentValue, assets.nonRegistered.growthRate, assets.nonRegistered.projectionYears),
      get capitalGain() {
        const fv = calculateFutureValue(assets.nonRegistered.currentValue, assets.nonRegistered.growthRate, assets.nonRegistered.projectionYears);
        return calculateCapitalGain(fv, assets.nonRegistered.costBase);
      },
      get capitalGainsTax() {
        const fv = calculateFutureValue(assets.nonRegistered.currentValue, assets.nonRegistered.growthRate, assets.nonRegistered.projectionYears);
        const gain = calculateCapitalGain(fv, assets.nonRegistered.costBase);
        return calculateCapitalGainsTax(gain);
      },
      get estateCapitalGainsTax() {
        const fv = calculateFutureValue(assets.nonRegistered.currentValue, assets.nonRegistered.growthRate, assets.nonRegistered.projectionYears);
        const gain = calculateCapitalGain(fv, assets.nonRegistered.costBase);
        return calculateCapitalGainsTax(gain);
      }
    },
    primaryResidence: {
      ...assets.primaryResidence,
      futureValue: calculateFutureValue(assets.primaryResidence.currentValue, assets.primaryResidence.growthRate, assets.primaryResidence.projectionYears)
    },
    secondaryProperty: {
      ...assets.secondaryProperty,
      futureValue: calculateFutureValue(assets.secondaryProperty.currentValue, assets.secondaryProperty.growthRate, assets.secondaryProperty.projectionYears),
      get capitalGain() {
        const fv = calculateFutureValue(assets.secondaryProperty.currentValue, assets.secondaryProperty.growthRate, assets.secondaryProperty.projectionYears);
        return calculateCapitalGain(fv, assets.secondaryProperty.originalPurchasePrice + assets.secondaryProperty.capitalImprovements);
      },
      get capitalGainsTax() {
        const fv = calculateFutureValue(assets.secondaryProperty.currentValue, assets.secondaryProperty.growthRate, assets.secondaryProperty.projectionYears);
        const gain = calculateCapitalGain(fv, assets.secondaryProperty.originalPurchasePrice + assets.secondaryProperty.capitalImprovements);
        return calculateCapitalGainsTax(gain);
      },
      get estateCapitalGainsTax() {
        const fv = calculateFutureValue(assets.secondaryProperty.currentValue, assets.secondaryProperty.growthRate, assets.secondaryProperty.projectionYears);
        const gain = calculateCapitalGain(fv, assets.secondaryProperty.originalPurchasePrice + assets.secondaryProperty.capitalImprovements);
        return calculateCapitalGainsTax(gain);
      }
    },
    businessAssets: {
      ...assets.businessAssets,
      futureValue: calculateFutureValue(assets.businessAssets.currentValue, assets.businessAssets.growthRate, assets.businessAssets.projectionYears)
    }
  };

  // Asset allocation data
  const totalCurrentValue = Object.values(assets).reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalFutureValue = Object.values(assetCalculations).reduce((sum, asset) => sum + asset.futureValue, 0);

  const assetAllocationData = [
    { name: 'Registered', value: assets.rrsp.currentValue + assets.tfsa.currentValue + assets.rpp.currentValue, color: '#8884d8' },
    { name: 'Non-Registered', value: assets.nonRegistered.currentValue, color: '#82ca9d' },
    { name: 'Real Estate', value: assets.primaryResidence.currentValue + assets.secondaryProperty.currentValue, color: '#ffc658' },
    { name: 'Business', value: assets.businessAssets.currentValue, color: '#ff7300' },
  ];

  // Growth projection data
  const projectionData = Array.from({ length: 21 }, (_, i) => ({
    year: i,
    registered: (assets.rrsp.currentValue + assets.tfsa.currentValue + assets.rpp.currentValue) * Math.pow(1.065, i),
    nonRegistered: assets.nonRegistered.currentValue * Math.pow(1.05, i),
    realEstate: (assets.primaryResidence.currentValue + assets.secondaryProperty.currentValue) * Math.pow(1.035, i),
    business: assets.businessAssets.currentValue * Math.pow(1.08, i),
  }));

  const generateAIAnalysis = () => {
    let text = `Asset Portfolio Analysis:\n\n`;
    text += `💰 Total Current Value: $${totalCurrentValue.toLocaleString()}\n`;
    text += `📈 Projected Future Value (20 years): $${Math.round(totalFutureValue).toLocaleString()}\n\n`;
    text += `🏠 Real Estate: $${(assets.primaryResidence.currentValue + assets.secondaryProperty.currentValue).toLocaleString()} (${((assets.primaryResidence.currentValue + assets.secondaryProperty.currentValue) / totalCurrentValue * 100).toFixed(1)}%)\n`;
    text += `📊 Registered Accounts: $${(assets.rrsp.currentValue + assets.tfsa.currentValue + assets.rpp.currentValue).toLocaleString()} (${((assets.rrsp.currentValue + assets.tfsa.currentValue + assets.rpp.currentValue) / totalCurrentValue * 100).toFixed(1)}%)\n`;
    text += `💼 Business Assets: $${assets.businessAssets.currentValue.toLocaleString()} (${(assets.businessAssets.currentValue / totalCurrentValue * 100).toFixed(1)}%)\n`;
    text += `🏦 Non-Registered: $${assets.nonRegistered.currentValue.toLocaleString()} (${(assets.nonRegistered.currentValue / totalCurrentValue * 100).toFixed(1)}%)\n\n`;
    text += `📊 Your portfolio shows a balanced approach with strong real estate holdings. Consider diversification opportunities and tax-efficient strategies for continued growth.`;
    return text;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              Assets Portfolio Details
            </DialogTitle>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center border-indigo-600 text-indigo-700 hover:bg-indigo-50 px-3 rounded-lg shadow-sm"
              onClick={() => setAIDialogOpen(true)}
              style={{ border: '2px solid #6366f1' }}
            >
              <Bot className="w-4 h-4 mr-1 text-indigo-600" />
              AI Analysis
            </Button>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="registered">Registered</TabsTrigger>
              <TabsTrigger value="non-registered">Non-Registered</TabsTrigger>
              <TabsTrigger value="real-estate">Real Estate</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Assets Value</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalCurrentValue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Across all accounts</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Projected Future Value</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${Math.round(totalFutureValue).toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Based on current projections</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Asset Allocation</CardTitle>
                    <Calculator className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={assetAllocationData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {assetAllocationData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v) => `$${Math.round(Number(v)).toLocaleString()}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Growth Projection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={projectionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                        <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
                        <Line type="monotone" dataKey="registered" stroke="#8884d8" strokeWidth={2} />
                        <Line type="monotone" dataKey="nonRegistered" stroke="#82ca9d" strokeWidth={2} />
                        <Line type="monotone" dataKey="realEstate" stroke="#ffc658" strokeWidth={2} />
                        <Line type="monotone" dataKey="business" stroke="#ff7300" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="registered" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      RRSP
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Current Value</Label>
                      <Input 
                        type="number" 
                        value={assets.rrsp.currentValue}
                        onChange={(e) => updateDynamicAsset('rrsp', 'currentValue', Number(e.target.value))}
                      />
                    </div>
                    
                    <AssetControlSliders
                      growthRate={assets.rrsp.growthRate}
                      projectionYears={assets.rrsp.projectionYears}
                      onGrowthRateChange={(value) => updateDynamicAsset('rrsp', 'growthRate', value[0])}
                      onProjectionYearsChange={(value) => updateDynamicAsset('rrsp', 'projectionYears', value[0])}
                    />
                    
                    <div>
                      <Label>Future Value ({assets.rrsp.projectionYears} years)</Label>
                      <div className="text-2xl font-bold text-green-600">
                        ${Math.round(assetCalculations.rrsp.futureValue).toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      TFSA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Current Value</Label>
                      <Input 
                        type="number" 
                        value={assets.tfsa.currentValue}
                        onChange={(e) => updateDynamicAsset('tfsa', 'currentValue', Number(e.target.value))}
                      />
                    </div>
                    
                    <AssetControlSliders
                      growthRate={assets.tfsa.growthRate}
                      projectionYears={assets.tfsa.projectionYears}
                      onGrowthRateChange={(value) => updateDynamicAsset('tfsa', 'growthRate', value[0])}
                      onProjectionYearsChange={(value) => updateDynamicAsset('tfsa', 'projectionYears', value[0])}
                    />
                    
                    <div>
                      <Label>Future Value ({assets.tfsa.projectionYears} years)</Label>
                      <div className="text-2xl font-bold text-green-600">
                        ${Math.round(assetCalculations.tfsa.futureValue).toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      RPP
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Current Value</Label>
                      <Input 
                        type="number" 
                        value={assets.rpp.currentValue}
                        onChange={(e) => updateDynamicAsset('rpp', 'currentValue', Number(e.target.value))}
                      />
                    </div>
                    
                    <AssetControlSliders
                      growthRate={assets.rpp.growthRate}
                      projectionYears={assets.rpp.projectionYears}
                      onGrowthRateChange={(value) => updateDynamicAsset('rpp', 'growthRate', value[0])}
                      onProjectionYearsChange={(value) => updateDynamicAsset('rpp', 'projectionYears', value[0])}
                    />
                    
                    <div>
                      <Label>Future Value ({assets.rpp.projectionYears} years)</Label>
                      <div className="text-2xl font-bold text-green-600">
                        ${Math.round(assetCalculations.rpp.futureValue).toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="non-registered" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Non-Registered Assets
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Current Value</Label>
                        <Input 
                          type="number" 
                          value={assets.nonRegistered.currentValue}
                          onChange={(e) => updateDynamicAsset('nonRegistered', 'currentValue', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Cost Base</Label>
                        <Input 
                          type="number" 
                          value={assets.nonRegistered.costBase}
                          onChange={(e) => updateDynamicAsset('nonRegistered', 'costBase', Number(e.target.value))}
                        />
                      </div>
                    </div>
                    
                    <AssetControlSliders
                      growthRate={assets.nonRegistered.growthRate}
                      projectionYears={assets.nonRegistered.projectionYears}
                      onGrowthRateChange={(value) => updateDynamicAsset('nonRegistered', 'growthRate', value[0])}
                      onProjectionYearsChange={(value) => updateDynamicAsset('nonRegistered', 'projectionYears', value[0])}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Projections & Tax Implications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Future Value ({assets.nonRegistered.projectionYears} years)</Label>
                        <div className="text-2xl font-bold text-green-600">
                          ${Math.round(assetCalculations.nonRegistered.futureValue).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <Label>Projected Growth</Label>
                        <div className="text-xl font-semibold text-blue-600">
                          ${Math.round(assetCalculations.nonRegistered.futureValue - assets.nonRegistered.currentValue).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-semibold text-yellow-800">Capital Gains (Based on Future Value)</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-blue-600">Capital Gain</Label>
                          <div className="font-semibold text-blue-700">
                            ${Math.round(assetCalculations.nonRegistered.capitalGain).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <Label className="text-red-600">Est. Capital Gains Tax</Label>
                          <div className="font-semibold text-red-700">
                            ${Math.round(assetCalculations.nonRegistered.capitalGainsTax).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-red-600">Estate Capital Gains Tax</Label>
                        <div className="font-semibold text-red-700">
                          ${Math.round(assetCalculations.nonRegistered.estateCapitalGainsTax).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="real-estate" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      Primary Residence
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label>Current Value</Label>
                          <Input 
                            type="number" 
                            value={assets.primaryResidence.currentValue}
                            onChange={(e) => updateDynamicAsset('primaryResidence', 'currentValue', Number(e.target.value))}
                          />
                        </div>
                        
                        <AssetControlSliders
                          growthRate={assets.primaryResidence.growthRate}
                          projectionYears={assets.primaryResidence.projectionYears}
                          onGrowthRateChange={(value) => updateDynamicAsset('primaryResidence', 'growthRate', value[0])}
                          onProjectionYearsChange={(value) => updateDynamicAsset('primaryResidence', 'projectionYears', value[0])}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Future Value ({assets.primaryResidence.projectionYears} years)</Label>
                          <div className="text-3xl font-bold text-green-600">
                            ${Math.round(assetCalculations.primaryResidence.futureValue).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <Label>Projected Growth</Label>
                          <div className="text-xl font-semibold text-blue-600">
                            ${Math.round(assetCalculations.primaryResidence.futureValue - assets.primaryResidence.currentValue).toLocaleString()}
                          </div>
                        </div>
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-800 text-sm font-medium">Principal Residence Exemption</p>
                          <p className="text-green-700 text-xs">No capital gains tax on primary residence</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Secondary Property
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Current Value</Label>
                            <Input 
                              type="number" 
                              value={assets.secondaryProperty.currentValue}
                              onChange={(e) => updateDynamicAsset('secondaryProperty', 'currentValue', Number(e.target.value))}
                            />
                          </div>
                          <div>
                            <Label>Original Purchase Price</Label>
                            <Input 
                              type="number" 
                              value={assets.secondaryProperty.originalPurchasePrice}
                              onChange={(e) => updateDynamicAsset('secondaryProperty', 'originalPurchasePrice', Number(e.target.value))}
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Capital Improvements</Label>
                          <Input 
                            type="number" 
                            value={assets.secondaryProperty.capitalImprovements}
                            onChange={(e) => updateDynamicAsset('secondaryProperty', 'capitalImprovements', Number(e.target.value))}
                          />
                        </div>
                        
                        <AssetControlSliders
                          growthRate={assets.secondaryProperty.growthRate}
                          projectionYears={assets.secondaryProperty.projectionYears}
                          onGrowthRateChange={(value) => updateDynamicAsset('secondaryProperty', 'growthRate', value[0])}
                          onProjectionYearsChange={(value) => updateDynamicAsset('secondaryProperty', 'projectionYears', value[0])}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Future Value ({assets.secondaryProperty.projectionYears} years)</Label>
                          <div className="text-3xl font-bold text-green-600">
                            ${Math.round(assetCalculations.secondaryProperty.futureValue).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <Label>Projected Growth</Label>
                          <div className="text-xl font-semibold text-blue-600">
                            ${Math.round(assetCalculations.secondaryProperty.futureValue - assets.secondaryProperty.currentValue).toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="space-y-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <h4 className="font-semibold text-yellow-800">Capital Gains (Based on Future Value)</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <Label className="text-blue-600">Capital Gain</Label>
                              <div className="font-semibold text-blue-700">
                                ${Math.round(assetCalculations.secondaryProperty.capitalGain).toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <Label className="text-red-600">Est. Capital Gains Tax</Label>
                              <div className="font-semibold text-red-700">
                                ${Math.round(assetCalculations.secondaryProperty.capitalGainsTax).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div>
                            <Label className="text-red-600">Estate Capital Gains Tax</Label>
                            <div className="font-semibold text-red-700">
                              ${Math.round(assetCalculations.secondaryProperty.estateCapitalGainsTax).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="business" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Business Assets
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Current Value</Label>
                      <Input 
                        type="number" 
                        value={assets.businessAssets.currentValue}
                        onChange={(e) => updateDynamicAsset('businessAssets', 'currentValue', Number(e.target.value))}
                      />
                    </div>
                    
                    <AssetControlSliders
                      growthRate={assets.businessAssets.growthRate}
                      projectionYears={assets.businessAssets.projectionYears}
                      onGrowthRateChange={(value) => updateDynamicAsset('businessAssets', 'growthRate', value[0])}
                      onProjectionYearsChange={(value) => updateDynamicAsset('businessAssets', 'projectionYears', value[0])}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Projections</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Future Value ({assets.businessAssets.projectionYears} years)</Label>
                      <div className="text-2xl font-bold text-green-600">
                        ${Math.round(assetCalculations.businessAssets.futureValue).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <Label>Projected Growth</Label>
                      <div className="text-xl font-semibold text-blue-600">
                        ${Math.round(assetCalculations.businessAssets.futureValue - assets.businessAssets.currentValue).toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-4">
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <SectionAIDialog
        isOpen={aiDialogOpen}
        onClose={() => setAIDialogOpen(false)}
        title="Assets Portfolio"
        content={generateAIAnalysis()}
      />
    </>
  );
};

export default AssetsDetailDialog;
