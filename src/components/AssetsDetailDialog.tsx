import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Plus, Trash2, Building, PiggyBank, Wallet, Home, Car, Coins, Briefcase, Landmark } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { FieldCard } from "./FieldCard";

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DynamicAsset {
  id: string;
  name: string;
  type: string;
  currentValue: number;
  growthRate: number;
  years: number;
  futureValue: number;
  monthlyContribution: number;
  taxRate: number;
  liquidityRating: number;
  riskLevel: "Low" | "Medium" | "High";
  notes: string;
  icon: React.ComponentType<any>;
}

const assetTemplates = {
  "Real Estate": { icon: Home, growthRate: 3, years: 40, taxRate: 25, liquidityRating: 2, riskLevel: "Medium" as const },
  "RRSP": { icon: PiggyBank, growthRate: 6, years: 40, taxRate: 30, liquidityRating: 1, riskLevel: "Medium" as const },
  "TFSA": { icon: Wallet, growthRate: 5, years: 40, taxRate: 0, liquidityRating: 3, riskLevel: "Medium" as const },
  "Non-Registered": { icon: Briefcase, growthRate: 5, years: 40, taxRate: 15, liquidityRating: 4, riskLevel: "Medium" as const },
  "Vehicle": { icon: Car, growthRate: -8, years: 10, taxRate: 0, liquidityRating: 3, riskLevel: "High" as const },
  "Cryptocurrency": { icon: Coins, growthRate: 12, years: 20, taxRate: 25, liquidityRating: 5, riskLevel: "High" as const },
  "GIC/Bond": { icon: Landmark, growthRate: 2.5, years: 5, taxRate: 25, liquidityRating: 2, riskLevel: "Low" as const },
  "Custom": { icon: Building, growthRate: 5, years: 20, taxRate: 20, liquidityRating: 3, riskLevel: "Medium" as const }
};

export const AssetsDetailDialog = ({ isOpen, onClose }: AssetsDetailDialogProps) => {
  const { assets } = useFinancialData();
  
  const [dynamicAssets, setDynamicAssets] = useState<DynamicAsset[]>([]);
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [newAssetType, setNewAssetType] = useState("Real Estate");
  
  const addDynamicAsset = () => {
    const template = assetTemplates[newAssetType as keyof typeof assetTemplates];
    const newAsset: DynamicAsset = {
      id: Date.now().toString(),
      name: newAssetType,
      type: newAssetType,
      currentValue: 100000,
      growthRate: template.growthRate,
      years: template.years,
      futureValue: 0,
      monthlyContribution: 0,
      taxRate: template.taxRate,
      liquidityRating: template.liquidityRating,
      riskLevel: template.riskLevel,
      notes: "",
      icon: template.icon
    };
    
    newAsset.futureValue = calculateFutureValue(
      newAsset.currentValue,
      newAsset.growthRate,
      newAsset.years,
      newAsset.monthlyContribution
    );
    
    setDynamicAssets([...dynamicAssets, newAsset]);
    setShowAddAsset(false);
  };

  const updateDynamicAsset = (id: string, field: keyof DynamicAsset, value: any) => {
    setDynamicAssets(dynamicAssets.map(asset => {
      if (asset.id === id) {
        const updatedAsset = { ...asset, [field]: value };
        if (field === 'currentValue' || field === 'growthRate' || field === 'years' || field === 'monthlyContribution') {
          updatedAsset.futureValue = calculateFutureValue(
            updatedAsset.currentValue,
            updatedAsset.growthRate,
            updatedAsset.years,
            updatedAsset.monthlyContribution
          );
        }
        return updatedAsset;
      }
      return asset;
    }));
  };

  const removeDynamicAsset = (id: string) => {
    setDynamicAssets(dynamicAssets.filter(asset => asset.id !== id));
  };

  const calculateFutureValue = (currentValue: number, growthRate: number, years: number, monthlyContribution: number) => {
    const monthlyRate = growthRate / 100 / 12;
    const totalMonths = years * 12;
    
    let futureValue = currentValue * Math.pow(1 + monthlyRate, totalMonths);
    
    if (monthlyContribution > 0) {
      const contributionFV = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
      futureValue += contributionFV;
    }
    
    return Math.round(futureValue);
  };

  const totalCurrentValue = dynamicAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalFutureValue = dynamicAssets.reduce((sum, asset) => sum + asset.futureValue, 0);
  const totalGrowth = totalFutureValue - totalCurrentValue;
  const averageGrowthRate = dynamicAssets.length > 0 
    ? dynamicAssets.reduce((sum, asset) => sum + asset.growthRate, 0) / dynamicAssets.length 
    : 0;

  const formatCurrency = (value: number) => {
    return Math.round(value).toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Assets Portfolio Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary & Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FieldCard
              label="Total Current Value"
              value={totalCurrentValue}
              type="currency"
              variant="current"
              isEditable={false}
            />
            <FieldCard
              label="Total Future Value"
              value={totalFutureValue}
              type="currency"
              variant="future"
              isEditable={false}
            />
            <FieldCard
              label="Total Growth"
              value={totalGrowth}
              type="currency"
              variant="growth"
              isEditable={false}
            />
            <FieldCard
              label="Average Growth Rate"
              value={averageGrowthRate.toFixed(1)}
              type="percentage"
              variant="default"
              isEditable={false}
            />
          </div>

          {/* Dynamic Assets */}
          {dynamicAssets.map((asset) => {
            const IconComponent = asset.icon;
            return (
              <Card key={asset.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5" />
                      {asset.name} ({asset.type})
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeDynamicAsset(asset.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <FieldCard
                      label="Current Value"
                      value={asset.currentValue}
                      type="currency"
                      variant="current"
                      onSave={(value) => updateDynamicAsset(asset.id, 'currentValue', parseFloat(value) || 0)}
                    />
                    <FieldCard
                      label="Future Value"
                      value={asset.futureValue}
                      type="currency"
                      variant="future"
                      isEditable={false}
                      isAutoCalculated={true}
                      tooltip="Calculated based on current value, growth rate, years, and monthly contributions"
                    />
                    <FieldCard
                      label="Growth Rate"
                      value={asset.growthRate}
                      type="percentage"
                      variant="growth"
                      onSave={(value) => updateDynamicAsset(asset.id, 'growthRate', parseFloat(value) || 0)}
                    />
                    <FieldCard
                      label="Years to Hold"
                      value={asset.years}
                      type="number"
                      variant="default"
                      onSave={(value) => updateDynamicAsset(asset.id, 'years', parseInt(value) || 0)}
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <FieldCard
                      label="Monthly Contribution"
                      value={asset.monthlyContribution}
                      type="currency"
                      variant="default"
                      onSave={(value) => updateDynamicAsset(asset.id, 'monthlyContribution', parseFloat(value) || 0)}
                    />
                    <FieldCard
                      label="Tax Rate"
                      value={asset.taxRate}
                      type="percentage"
                      variant="tax"
                      onSave={(value) => updateDynamicAsset(asset.id, 'taxRate', parseFloat(value) || 0)}
                    />
                    <FieldCard
                      label="Liquidity Rating"
                      value={`${asset.liquidityRating}/5`}
                      variant="default"
                      onSave={(value) => updateDynamicAsset(asset.id, 'liquidityRating', parseInt(value) || 1)}
                      tooltip="1 = Very Low, 5 = Very High"
                    />
                    <FieldCard
                      label="Risk Level"
                      value={asset.riskLevel}
                      variant="default"
                      onSave={(value) => updateDynamicAsset(asset.id, 'riskLevel', value as "Low" | "Medium" | "High")}
                    />
                  </div>

                  <FieldCard
                    label="Notes"
                    value={asset.notes || "No notes"}
                    variant="default"
                    onSave={(value) => updateDynamicAsset(asset.id, 'notes', value)}
                  />
                </CardContent>
              </Card>
            );
          })}

          {/* Add Asset Section */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Asset</CardTitle>
            </CardHeader>
            <CardContent>
              {!showAddAsset ? (
                <Button onClick={() => setShowAddAsset(true)} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Asset
                </Button>
              ) : (
                <div className="space-y-4">
                  <Select value={newAssetType} onValueChange={setNewAssetType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(assetTemplates).map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button onClick={addDynamicAsset}>Add Asset</Button>
                    <Button variant="outline" onClick={() => setShowAddAsset(false)}>Cancel</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
