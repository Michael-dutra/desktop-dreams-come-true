import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Home, Wallet, PiggyBank, DollarSign, Plus, Brain, Copy, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { EditableField } from "./EditableField";
import { GrowthChart } from "./GrowthChart";
import { AssetControlSliders } from "./AssetControlSliders";
import { AIGuidanceTips } from "./AIGuidanceTips";
import { DynamicAssetCard } from "./DynamicAssetCard";
import { calculateFV, generateStableChartData } from "../utils/assetUtils";

interface Asset {
  name: string;
  amount: string;
  value: number;
  color: string;
}

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
}

interface DynamicAsset {
  id: string;
  name: string;
  type: string;
  currentValue: number;
  years: number;
  growthRate: number;
  monthlyContribution: number;
  color: string;
  // Real Estate specific fields
  purchasePrice?: number;
  purchaseYear?: number;
  improvements?: number;
  mortgageBalance?: number;
  address?: string;
  propertyName?: string;
  capitalImprovements?: number;
  taxRate?: number;
  isPrimaryResidence?: boolean;
  // RRSP/TFSA specific fields
  availableRoom?: number;
  ytdGrowth?: number;
  annualContribution?: number;
  // Non-Registered specific fields
  unrealizedGains?: number;
}

export const AssetsDetailDialog = ({ isOpen, onClose, assets }: AssetsDetailDialogProps) => {
  const [realEstateYears, setRealEstateYears] = useState([10]);
  const [rrspYears, setRrspYears] = useState([10]);
  const [tfsaYears, setTfsaYears] = useState([10]);
  const [nonRegYears, setNonRegYears] = useState([10]);

  const [realEstateRate, setRealEstateRate] = useState([4.2]);
  const [rrspRate, setRrspRate] = useState([7.0]);
  const [tfsaRate, setTfsaRate] = useState([6.5]);
  const [nonRegRate, setNonRegRate] = useState([8.0]);

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>("");

  const [realEstateDetails, setRealEstateDetails] = useState({
    purchasePrice: 480000,
    purchaseYear: 2019,
    currentFMV: 620000,
    improvements: 35000,
    mortgageBalance: 285000,
    equity: 335000,
    yearlyAppreciation: 4.2,
    totalReturn: 29.2,
    address: "123 Maple Street, Toronto, ON",
    capitalImprovements: 50000,
    taxRate: 25,
    isPrimaryResidence: true,
  });

  const [rrspDetails, setRrspDetails] = useState({
    currentValue: 52000,
    availableRoom: 18500,
    ytdGrowth: 8.2,
    annualContribution: 6000,
    monthlyContribution: 500,
  });

  const [tfsaDetails, setTfsaDetails] = useState({
    currentValue: 38000,
    availableRoom: 8500,
    ytdGrowth: 6.1,
    annualContribution: 5000,
    monthlyContribution: 417,
  });

  const [nonRegisteredDetails, setNonRegisteredDetails] = useState({
    totalValue: 25000,
    unrealizedGains: 3200,
    annualContribution: 2000,
    monthlyContribution: 167,
  });

  const [dynamicAssets, setDynamicAssets] = useState<DynamicAsset[]>([]);

  const addDynamicAsset = (type: string, sourceAsset?: Asset) => {
    const colors = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#d946ef", "#f43f5e"];
    const usedColors = [...assets.map(a => a.color), ...dynamicAssets.map(a => a.color)];
    const availableColor = colors.find(color => !usedColors.includes(color)) || colors[0];

    const baseAsset = {
      id: Date.now().toString(),
      name: sourceAsset ? `${sourceAsset.name} (Copy)` : type,
      type: type,
      currentValue: sourceAsset ? sourceAsset.value : 10000,
      years: 10,
      growthRate: 6.0,
      monthlyContribution: 1000,
      color: availableColor
    };

    let newAsset: DynamicAsset;

    switch (type) {
      case "Primary Residence":
        newAsset = {
          ...baseAsset,
          name: sourceAsset ? `${sourceAsset.name} (Copy)` : "Primary Residence",
          propertyName: "My Home",
          purchasePrice: sourceAsset ? sourceAsset.value - 100000 : 480000,
          purchaseYear: 2019,
          improvements: 35000,
          capitalImprovements: 50000,
          mortgageBalance: sourceAsset ? Math.floor(sourceAsset.value * 0.45) : 285000,
          address: "123 Main Street, City, Province",
          growthRate: 4.2,
          monthlyContribution: 0,
          taxRate: 0,
          isPrimaryResidence: true
        };
        break;
      case "Secondary Properties":
        newAsset = {
          ...baseAsset,
          name: sourceAsset ? `${sourceAsset.name} (Copy)` : "Investment Property",
          propertyName: "Investment Property 1",
          purchasePrice: sourceAsset ? sourceAsset.value - 100000 : 350000,
          purchaseYear: 2020,
          improvements: 15000,
          capitalImprovements: 25000,
          mortgageBalance: sourceAsset ? Math.floor(sourceAsset.value * 0.6) : 200000,
          address: "456 Investment Ave, City, Province",
          growthRate: 4.2,
          monthlyContribution: 0,
          taxRate: 25,
          isPrimaryResidence: false
        };
        break;
      case "RRSP":
        newAsset = {
          ...baseAsset,
          availableRoom: 18500,
          ytdGrowth: 8.2,
          monthlyContribution: 500,
          growthRate: 7.0,
          annualContribution: 6000
        };
        break;
      case "TFSA":
        newAsset = {
          ...baseAsset,
          availableRoom: 8500,
          ytdGrowth: 6.1,
          monthlyContribution: 417,
          growthRate: 6.5,
          annualContribution: 5000
        };
        break;
      case "Non-Registered":
        newAsset = {
          ...baseAsset,
          unrealizedGains: 3200,
          monthlyContribution: 167,
          growthRate: 8.0,
          annualContribution: 2000
        };
        break;
      default:
        newAsset = baseAsset;
    }

    setDynamicAssets(prev => [...prev, newAsset]);
  };

  const removeDynamicAsset = (id: string) => {
    setDynamicAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const updateDynamicAsset = (id: string, updates: Partial<DynamicAsset>) => {
    setDynamicAssets(prev => prev.map(asset => 
      asset.id === id ? { ...asset, ...updates } : asset
    ));
  };

  const realEstateFV = calculateFV(realEstateDetails.currentFMV, realEstateRate[0], realEstateYears[0]);
  const rrspFV = calculateFV(rrspDetails.currentValue, rrspRate[0], rrspYears[0], rrspDetails.annualContribution);
  const tfsaFV = calculateFV(tfsaDetails.currentValue, tfsaRate[0], tfsaYears[0], tfsaDetails.annualContribution);
  const nonRegFV = calculateFV(nonRegisteredDetails.totalValue, nonRegRate[0], nonRegYears[0], nonRegisteredDetails.annualContribution);

  const realEstateChartData = generateStableChartData(realEstateDetails.currentFMV, realEstateFV, realEstateYears[0], realEstateRate[0]);
  const rrspChartData = generateStableChartData(rrspDetails.currentValue, rrspFV, rrspYears[0], rrspRate[0]);
  const tfsaChartData = generateStableChartData(tfsaDetails.currentValue, tfsaFV, tfsaYears[0], tfsaRate[0]);
  const nonRegChartData = generateStableChartData(nonRegisteredDetails.totalValue, nonRegFV, nonRegYears[0], nonRegRate[0]);

  const assumedAnnualIncome = 80000;

  const startEdit = (fieldId: string, currentValue: number | string) => {
    setEditingField(fieldId);
    setTempValue(currentValue.toString());
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempValue("");
  };

  const saveEdit = (fieldId: string) => {
    let numericValue = parseFloat(tempValue);
    if (isNaN(numericValue)) {
      cancelEdit();
      return;
    }

    const [category, field] = fieldId.split(".");
    
    switch (category) {
      case 'realEstate':
        setRealEstateDetails(prev => ({ ...prev, [field]: numericValue }));
        break;
      case 'rrsp':
        setRrspDetails(prev => ({ ...prev, [field]: numericValue }));
        break;
      case 'tfsa':
        setTfsaDetails(prev => ({ ...prev, [field]: numericValue }));
        break;
      case 'nonReg':
        setNonRegisteredDetails(prev => ({ ...prev, [field]: numericValue }));
        break;
    }
    
    setEditingField(null);
    setTempValue("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Assets</DialogTitle>
        </DialogHeader>

        {/* Portfolio Summary & Key Metrics */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Portfolio Summary & Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Current Value</p>
                <p className="font-bold text-2xl text-green-600">
                  ${(realEstateDetails.currentFMV + rrspDetails.currentValue + tfsaDetails.currentValue + nonRegisteredDetails.totalValue + dynamicAssets.reduce((sum, asset) => sum + asset.currentValue, 0)).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Future Value</p>
                <p className="font-bold text-2xl text-blue-600">
                  ${Math.round(realEstateFV + rrspFV + tfsaFV + nonRegFV + dynamicAssets.reduce((sum, asset) => sum + calculateFV(asset.currentValue, asset.growthRate, asset.years, asset.monthlyContribution), 0)).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Projected Growth</p>
                <p className="font-bold text-2xl text-purple-600">
                  +${Math.round((realEstateFV + rrspFV + tfsaFV + nonRegFV + dynamicAssets.reduce((sum, asset) => sum + calculateFV(asset.currentValue, asset.growthRate, asset.years, asset.monthlyContribution), 0)) - (realEstateDetails.currentFMV + rrspDetails.currentValue + tfsaDetails.currentValue + nonRegisteredDetails.totalValue + dynamicAssets.reduce((sum, asset) => sum + asset.currentValue, 0))).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Growth Rate</p>
                <p className="font-bold text-2xl text-orange-600">
                  {(((realEstateFV + rrspFV + tfsaFV + nonRegFV + dynamicAssets.reduce((sum, asset) => sum + calculateFV(asset.currentValue, asset.growthRate, asset.years, asset.monthlyContribution), 0)) / (realEstateDetails.currentFMV + rrspDetails.currentValue + tfsaDetails.currentValue + nonRegisteredDetails.totalValue + dynamicAssets.reduce((sum, asset) => sum + asset.currentValue, 0)) - 1) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Real Estate */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-xl">
                <div className="flex items-center gap-2">
                  <Home className="w-6 h-6" />
                  Real Estate
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addDynamicAsset("Primary Residence", { name: "Real Estate", value: realEstateDetails.currentFMV, amount: `$${realEstateDetails.currentFMV.toLocaleString()}`, color: "#f59e0b" })}
                  className="opacity-70 hover:opacity-100"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <GrowthChart 
                data={realEstateChartData}
                currentValue={realEstateDetails.currentFMV}
                futureValue={realEstateFV}
                years={realEstateYears[0]}
                color="#f59e0b"
              />

              <AssetControlSliders
                growthRate={realEstateRate}
                setGrowthRate={setRealEstateRate}
                projectionYears={realEstateYears}
                setProjectionYears={setRealEstateYears}
              />

              <div className="grid grid-cols-2 gap-4">
                <EditableField 
                  fieldId="realEstate.currentFMV" 
                  value={realEstateDetails.currentFMV} 
                  label="Current FMV" 
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
                <EditableField 
                  fieldId="future-value-re" 
                  value={Math.round(realEstateFV)} 
                  label={`Future Value (${realEstateYears[0]} years)`} 
                  isAutoCalculated={true}
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
                <EditableField 
                  fieldId="realEstate.purchasePrice" 
                  value={realEstateDetails.purchasePrice} 
                  label="Purchase Price" 
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
                <EditableField 
                  fieldId="projected-growth-re" 
                  value={Math.round(realEstateFV - realEstateDetails.currentFMV)} 
                  label="Projected Growth" 
                  prefix="+$"
                  isAutoCalculated={true}
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
                <EditableField 
                  fieldId="realEstate.mortgageBalance" 
                  value={realEstateDetails.mortgageBalance} 
                  label="Mortgage Balance" 
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
                <EditableField 
                  fieldId="net-equity-re" 
                  value={realEstateDetails.currentFMV - realEstateDetails.mortgageBalance} 
                  label="Net Equity" 
                  isAutoCalculated={true}
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
                <EditableField 
                  fieldId="realEstate.capitalImprovements" 
                  value={realEstateDetails.capitalImprovements} 
                  label="Capital Improvements" 
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
                <EditableField 
                  fieldId="realEstate.taxRate" 
                  value={realEstateDetails.taxRate} 
                  label="Tax Rate" 
                  prefix=""
                  suffix="%"
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
              </div>
              
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-1">Address: {realEstateDetails.address}</p>
                <p className="text-xs text-green-600 font-medium">Primary Residence (No Capital Gains Tax)</p>
              </div>
            </CardContent>
          </Card>

          {/* RRSP */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-xl">
                <div className="flex items-center gap-2">
                  <PiggyBank className="w-6 h-6" />
                  RRSP
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addDynamicAsset("RRSP", { name: "RRSP", value: rrspDetails.currentValue, amount: `$${rrspDetails.currentValue.toLocaleString()}`, color: "#10b981" })}
                  className="opacity-70 hover:opacity-100"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <GrowthChart 
                data={rrspChartData}
                currentValue={rrspDetails.currentValue}
                futureValue={rrspFV}
                years={rrspYears[0]}
                color="#8b5cf6"
              />

              <AssetControlSliders
                growthRate={rrspRate}
                setGrowthRate={setRrspRate}
                projectionYears={rrspYears}
                setProjectionYears={setRrspYears}
              />

              <div className="grid grid-cols-2 gap-4">
                <EditableField 
                  fieldId="rrsp.currentValue" 
                  value={rrspDetails.currentValue} 
                  label="Current Value" 
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
                <EditableField 
                  fieldId="future-value-rrsp" 
                  value={Math.round(rrspFV)} 
                  label={`Future Value (${rrspYears[0]} years)`} 
                  isAutoCalculated={true}
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
                <EditableField 
                  fieldId="projected-growth-rrsp" 
                  value={Math.round(rrspFV - rrspDetails.currentValue)} 
                  label="Projected Growth" 
                  prefix="+$"
                  isAutoCalculated={true}
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
                <EditableField 
                  fieldId="rrsp.availableRoom" 
                  value={rrspDetails.availableRoom} 
                  label="Available Room" 
                  tip={`If maxed out, worth $${Math.round(rrspDetails.availableRoom * Math.pow(1.07, 10)).toLocaleString()} in 10 years at 7%`}
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
                <EditableField 
                  fieldId="rrsp.annualContribution" 
                  value={rrspDetails.annualContribution} 
                  label="Annual Contribution" 
                  tip={`${(rrspDetails.annualContribution / assumedAnnualIncome * 100).toFixed(1)}% of gross annual income`}
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
                <EditableField 
                  fieldId="rrsp.monthlyContribution" 
                  value={rrspDetails.monthlyContribution} 
                  label="Monthly Contribution" 
                  tip={`${((rrspDetails.monthlyContribution * 12) / assumedAnnualIncome * 100).toFixed(1)}% of gross annual income`}
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
              </div>
              
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Rate: <span className="font-semibold">{rrspRate[0]}%</span> annually</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* TFSA */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-xl">
                <div className="flex items-center gap-2">
                  <Wallet className="w-6 h-6" />
                  TFSA
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addDynamicAsset("TFSA", { name: "TFSA", value: tfsaDetails.currentValue, amount: `$${tfsaDetails.currentValue.toLocaleString()}`, color: "#8b5cf6" })}
                  className="opacity-70 hover:opacity-100"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <GrowthChart 
                data={tfsaChartData}
                currentValue={tfsaDetails.currentValue}
                futureValue={tfsaFV}
                years={tfsaYears[0]}
                color="#06b6d4"
              />

              <AssetControlSliders
                growthRate={tfsaRate}
                setGrowthRate={setTfsaRate}
                projectionYears={tfsaYears}
                setProjectionYears={setTfsaYears}
              />

              <div className="grid grid-cols-2 gap-4">
                <EditableField 
                  fieldId="tfsa.currentValue" 
                  value={tfsaDetails.currentValue} 
                  label="Current Value" 
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
                <EditableField 
                  fieldId="future-value-tfsa" 
                  value={Math.round(tfsaFV)} 
                  label={`Future Value (${tfsaYears[0]} years)`} 
                  isAutoCalculated={true}
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
                <EditableField 
                  fieldId="projected-growth-tfsa" 
                  value={Math.round(tfsaFV - tfsaDetails.currentValue)} 
                  label="Projected Growth" 
                  prefix="+$"
                  isAutoCalculated={true}
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
                <EditableField 
                  fieldId="tfsa.availableRoom" 
                  value={tfsaDetails.availableRoom} 
                  label="Available Room" 
                  tip={`If maxed out, worth $${Math.round(tfsaDetails.availableRoom * Math.pow(1.065, 10)).toLocaleString()} in 10 years at 6.5%`}
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
                <EditableField 
                  fieldId="tfsa.annualContribution" 
                  value={tfsaDetails.annualContribution} 
                  label="Annual Contribution" 
                  tip={`${(tfsaDetails.annualContribution / assumedAnnualIncome * 100).toFixed(1)}% of gross annual income`}
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
                <EditableField 
                  fieldId="tfsa.monthlyContribution" 
                  value={tfsaDetails.monthlyContribution} 
                  label="Monthly Contribution" 
                  tip={`${((tfsaDetails.monthlyContribution * 12) / assumedAnnualIncome * 100).toFixed(1)}% of gross annual income`}
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
              </div>
              
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Rate: <span className="font-semibold">{tfsaRate[0]}%</span> annually</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Non-Registered */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-xl">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-6 h-6" />
                  Non-Registered
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addDynamicAsset("Non-Registered", { name: "Non-Registered", value: nonRegisteredDetails.totalValue, amount: `$${nonRegisteredDetails.totalValue.toLocaleString()}`, color: "#f59e0b" })}
                  className="opacity-70 hover:opacity-100"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <GrowthChart 
                data={nonRegChartData}
                currentValue={nonRegisteredDetails.totalValue}
                futureValue={nonRegFV}
                years={nonRegYears[0]}
                color="#ef4444"
              />

              <AssetControlSliders
                growthRate={nonRegRate}
                setGrowthRate={setNonRegRate}
                projectionYears={nonRegYears}
                setProjectionYears={setNonRegYears}
              />

              <div className="grid grid-cols-2 gap-4">
                <EditableField 
                  fieldId="nonReg.totalValue" 
                  value={nonRegisteredDetails.totalValue} 
                  label="Current Value" 
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
                <EditableField 
                  fieldId="future-value-nonreg" 
                  value={Math.round(nonRegFV)} 
                  label={`Future Value (${nonRegYears[0]} years)`} 
                  isAutoCalculated={true}
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
                <EditableField 
                  fieldId="nonReg.unrealizedGains" 
                  value={nonRegisteredDetails.unrealizedGains} 
                  label="Unrealized Gains" 
                  prefix="+$"
                  tip={`${((nonRegisteredDetails.unrealizedGains / nonRegisteredDetails.totalValue) * 100).toFixed(1)}% of total value`}
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
                <EditableField 
                  fieldId="projected-growth-nonreg" 
                  value={Math.round(nonRegFV - nonRegisteredDetails.totalValue)} 
                  label="Projected Growth" 
                  prefix="+$"
                  isAutoCalculated={true}
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
                <EditableField 
                  fieldId="nonReg.annualContribution" 
                  value={nonRegisteredDetails.annualContribution} 
                  label="Annual Contribution" 
                  tip={`${(nonRegisteredDetails.annualContribution / assumedAnnualIncome * 100).toFixed(1)}% of gross annual income`}
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
                <EditableField 
                  fieldId="nonReg.monthlyContribution" 
                  value={nonRegisteredDetails.monthlyContribution} 
                  label="Monthly Contribution" 
                  editingField={editingField}
                  tempValue={tempValue}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  setTempValue={setTempValue}
                />
              </div>
              
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Rate: <span className="font-semibold">{nonRegRate[0]}%</span> annually</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Asset Cards */}
          {dynamicAssets.map((asset) => (
            <DynamicAssetCard 
              key={asset.id} 
              asset={{
                id: asset.id,
                name: asset.name,
                type: asset.type,
                currentValue: asset.currentValue,
                monthlyContribution: asset.monthlyContribution || 0,
                growthRate: asset.growthRate || 6.0,
                years: asset.years || 10,
                purchasePrice: asset.purchasePrice,
                capitalImprovements: asset.capitalImprovements,
                propertyName: asset.propertyName
              }}
              onDelete={removeDynamicAsset}
              onCopy={() => {}}
              onUpdate={updateDynamicAsset}
            />
          ))}

          {/* Add Asset Card */}
          <Card className="border-dashed border-2 border-muted-foreground/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-muted-foreground">
                <Plus className="w-6 h-6" />
                Add Asset
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Asset Type</label>
                  <Select onValueChange={(value) => addDynamicAsset(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Primary Residence">Primary Residence</SelectItem>
                      <SelectItem value="Secondary Properties">Secondary Properties</SelectItem>
                      <SelectItem value="RRSP">RRSP</SelectItem>
                      <SelectItem value="RRIF">RRIF</SelectItem>
                      <SelectItem value="TFSA">TFSA</SelectItem>
                      <SelectItem value="Non-Registered">Non-Registered</SelectItem>
                      <SelectItem value="DB">DB (Defined Benefit)</SelectItem>
                      <SelectItem value="DC">DC (Defined Contribution)</SelectItem>
                      <SelectItem value="IPP">IPP (Individual Pension Plan)</SelectItem>
                      <SelectItem value="LIRA">LIRA (Locked-in Retirement Account)</SelectItem>
                      <SelectItem value="LIF">LIF (Life Income Fund)</SelectItem>
                      <SelectItem value="Pension">Pension</SelectItem>
                      <SelectItem value="Chequing Account">Chequing Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Guidance Tips */}
        <AIGuidanceTips />
      </DialogContent>
    </Dialog>
  );
};
