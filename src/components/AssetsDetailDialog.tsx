import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { TrendingUp, Bot, X, Plus, Brain, Lightbulb, Edit2, Check } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState, useEffect, useMemo } from "react";

interface Asset {
  name: string;
  amount: string;
  value: number;
  color: string;
}

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DynamicAsset {
  id: string;
  name: string;
  type: string;
  currentValue: number;
  years: number[];
  rate: number[];
  annualContribution: number;
  color: string;
  // Real Estate specific fields
  purchasePrice?: number;
  purchaseYear?: number;
  improvements?: number;
  mortgageBalance?: number;
  address?: string;
  // Secondary Property specific fields
  originalPurchasePrice?: number;
  capitalImprovements?: number;
  inclusionRate?: number;
  taxRate?: number;
  // RRSP/TFSA/FHSA specific fields
  availableRoom?: number;
  ytdGrowth?: number;
  monthlyContribution?: number;
  // Non-Registered specific fields
  unrealizedGains?: number;
  costBase?: number;
}

const generateStableChartData = (currentValue: number, futureValue: number, years: number, rate: number) => {
  const points = [];
  const steps = 10;
  
  for (let i = 0; i <= steps; i++) {
    const yearProgress = (years * i) / steps;
    const currentProjection = currentValue * Math.pow(1 + rate / 100, yearProgress);
    
    points.push({
      year: yearProgress.toFixed(1),
      current: currentValue,
      future: currentProjection,
      yearLabel: i === 0 ? 'Now' : i === steps ? `${years}Y` : `${yearProgress.toFixed(1)}Y`
    });
  }
  
  return points;
};

export const AssetsDetailDialog = ({ isOpen, onClose }: AssetsDetailDialogProps) => {
  // Individual projection years for each asset
  const [realEstateYears, setRealEstateYears] = useState([10]);
  const [rrspYears, setRrspYears] = useState([10]);
  const [tfsaYears, setTfsaYears] = useState([10]);
  const [nonRegYears, setNonRegYears] = useState([10]);

  // Individual growth rates
  const [realEstateRate, setRealEstateRate] = useState([4.2]);
  const [rrspRate, setRrspRate] = useState([7.0]);
  const [tfsaRate, setTfsaRate] = useState([6.5]);
  const [nonRegRate, setNonRegRate] = useState([8.0]);

  // Editable state tracking
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>("");

  // Asset details with enhanced data - now as state for editing
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
    costBase: 21800,
    inclusionRate: 50,
    taxRate: 25,
  });

  // New state for dynamic assets
  const [dynamicAssets, setDynamicAssets] = useState<DynamicAsset[]>([]);

  const addDynamicAsset = (type: string, sourceAsset?: Asset) => {
    const colors = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#d946ef", "#f43f5e"];
    const usedColors = [...dynamicAssets.map(a => a.color)];
    const availableColor = colors.find(color => !usedColors.includes(color)) || colors[0];

    const baseAsset = {
      id: Date.now().toString(),
      name: sourceAsset ? `${sourceAsset.name} (Copy)` : type,
      type: type,
      currentValue: sourceAsset ? sourceAsset.value : 10000,
      years: [10],
      rate: [6.0],
      annualContribution: 1000,
      color: availableColor
    };

    let newAsset: DynamicAsset;

    switch (type) {
      case "Primary Residence":
        newAsset = {
          ...baseAsset,
          purchasePrice: sourceAsset ? sourceAsset.value - 100000 : 480000,
          purchaseYear: 2019,
          improvements: 35000,
          mortgageBalance: sourceAsset ? Math.floor(sourceAsset.value * 0.45) : 285000,
          address: "123 Main Street, City, Province",
          rate: [4.2],
          annualContribution: 0
        };
        break;
      case "Secondary Property":
        newAsset = {
          ...baseAsset,
          originalPurchasePrice: sourceAsset ? sourceAsset.value - 150000 : 350000,
          capitalImprovements: 25000,
          inclusionRate: 50,
          taxRate: 25,
          address: "456 Investment Lane, City, Province",
          rate: [4.2],
          annualContribution: 0
        };
        break;
      case "RRSP":
        newAsset = {
          ...baseAsset,
          availableRoom: 18500,
          ytdGrowth: 8.2,
          monthlyContribution: 500,
          rate: [7.0],
          annualContribution: 6000
        };
        break;
      case "TFSA":
        newAsset = {
          ...baseAsset,
          availableRoom: 8500,
          ytdGrowth: 6.1,
          monthlyContribution: 417,
          rate: [6.5],
          annualContribution: 5000
        };
        break;
      case "FHSA":
        newAsset = {
          ...baseAsset,
          availableRoom: 8000,
          ytdGrowth: 6.1,
          monthlyContribution: 417,
          rate: [6.5],
          annualContribution: 5000
        };
        break;
      case "Non-Registered":
        newAsset = {
          ...baseAsset,
          unrealizedGains: 3200,
          monthlyContribution: 167,
          rate: [8.0],
          annualContribution: 2000,
          costBase: sourceAsset ? sourceAsset.value - 3200 : 6800,
          inclusionRate: 50,
          taxRate: 25
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

  const calculateFV = (currentValue: number, rate: number, years: number, annualContribution = 0) => {
    const fvCurrentValue = currentValue * Math.pow(1 + rate / 100, years);
    const fvContributions = annualContribution * (Math.pow(1 + rate / 100, years) - 1) / (rate / 100);
    return fvCurrentValue + fvContributions;
  };

  const realEstateFV = calculateFV(realEstateDetails.currentFMV, realEstateRate[0], realEstateYears[0]);
  const rrspFV = calculateFV(rrspDetails.currentValue, rrspRate[0], rrspYears[0], rrspDetails.annualContribution);
  const tfsaFV = calculateFV(tfsaDetails.currentValue, tfsaRate[0], tfsaYears[0], tfsaDetails.annualContribution);
  const nonRegFV = calculateFV(nonRegisteredDetails.totalValue, nonRegRate[0], nonRegYears[0], nonRegisteredDetails.annualContribution);

  const realEstateChartData = useMemo(() => {
    return generateStableChartData(realEstateDetails.currentFMV, realEstateFV, realEstateYears[0], realEstateRate[0]);
  }, [realEstateDetails.currentFMV, realEstateFV, realEstateYears[0], realEstateRate[0]]);

  const rrspChartData = useMemo(() => {
    return generateStableChartData(rrspDetails.currentValue, rrspFV, rrspYears[0], rrspRate[0]);
  }, [rrspDetails.currentValue, rrspFV, rrspYears[0], rrspRate[0]]);

  const tfsaChartData = useMemo(() => {
    return generateStableChartData(tfsaDetails.currentValue, tfsaFV, tfsaYears[0], tfsaRate[0]);
  }, [tfsaDetails.currentValue, tfsaFV, tfsaYears[0], tfsaRate[0]]);

  const nonRegChartData = useMemo(() => {
    return generateStableChartData(nonRegisteredDetails.totalValue, nonRegFV, nonRegYears[0], nonRegRate[0]);
  }, [nonRegisteredDetails.totalValue, nonRegFV, nonRegYears[0], nonRegRate[0]]);

  const showAssetWriteup = (assetType: string, assetName: string) => {
    // This would typically open a dialog or modal with detailed writeup about the asset
    console.log(`Showing writeup for ${assetType}: ${assetName}`);
    // TODO: Implement writeup dialog similar to life insurance writeup
  };

  const confirmDeleteAsset = (assetId: string, assetName: string) => {
    // The AlertDialog component will handle the confirmation
    console.log(`Delete confirmed for asset: ${assetName}`);
    removeDynamicAsset(assetId);
  };

  const DynamicAssetCard = ({ asset }: { asset: DynamicAsset }) => {
    const futureValue = calculateFV(asset.currentValue, asset.rate[0], asset.years[0], asset.annualContribution);
    const chartData = useMemo(() => {
      return generateStableChartData(asset.currentValue, futureValue, asset.years[0], asset.rate[0]);
    }, [asset.currentValue, futureValue, asset.years[0], asset.rate[0]]);

    const DynamicEditableField = ({ 
      fieldKey, 
      value, 
      label, 
      isEditable = true, 
      prefix = "$",
      suffix = "",
      isAutoCalculated = false,
      tip
    }: { 
      fieldKey: string; 
      value: number; 
      label: string; 
      isEditable?: boolean;
      prefix?: string;
      suffix?: string;
      isAutoCalculated?: boolean;
      tip?: string;
    }) => {
      const [isEditing, setIsEditing] = useState(false);
      const [tempValue, setTempValue] = useState("");

      const startEdit = () => {
        setIsEditing(true);
        setTempValue(value.toString());
      };

      const cancelEdit = () => {
        setIsEditing(false);
        setTempValue("");
      };

      const saveEdit = () => {
        const numericValue = parseFloat(tempValue);
        if (!isNaN(numericValue)) {
          updateDynamicAsset(asset.id, { [fieldKey]: numericValue });
        }
        setIsEditing(false);
        setTempValue("");
      };

      return (
        <div className="relative">
          <p className="text-sm text-muted-foreground">{label}</p>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="text-lg font-semibold"
                type="number"
                autoFocus
              />
              <Button size="sm" variant="ghost" onClick={saveEdit}>
                <Check className="w-4 h-4 text-green-600" />
              </Button>
              <Button size="sm" variant="ghost" onClick={cancelEdit}>
                <X className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className={`font-semibold text-lg ${isAutoCalculated ? 'text-blue-600' : 'text-green-600'}`}>
                  {prefix}{value.toLocaleString()}{suffix}
                </p>
              </div>
              {isEditable && !isAutoCalculated && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={startEdit}
                  className="opacity-50 hover:opacity-100"
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          )}
        </div>
      );
    };

    const renderAssetSpecificFields = () => {
      const assumedAnnualIncome = 80000;

      switch (asset.type) {
        case "Primary Residence":
          const netEquity = asset.currentValue - (asset.mortgageBalance || 0);
          return (
            <div className="grid grid-cols-2 gap-4">
              <DynamicEditableField 
                fieldKey="currentValue" 
                value={asset.currentValue} 
                label="Current FMV" 
              />
              <DynamicEditableField 
                fieldKey="futureValue" 
                value={Math.round(futureValue)} 
                label={`Future Value (${asset.years[0]} years)`} 
                isAutoCalculated={true}
                isEditable={false}
              />
              <DynamicEditableField 
                fieldKey="purchasePrice" 
                value={asset.purchasePrice || 0} 
                label="Purchase Price" 
              />
              <DynamicEditableField 
                fieldKey="projectedGrowth" 
                value={Math.round(futureValue - asset.currentValue)} 
                label="Projected Growth" 
                prefix="+$"
                isAutoCalculated={true}
                isEditable={false}
              />
              <DynamicEditableField 
                fieldKey="mortgageBalance" 
                value={asset.mortgageBalance || 0} 
                label="Mortgage Balance" 
              />
              <DynamicEditableField 
                fieldKey="netEquity" 
                value={netEquity} 
                label="Net Equity" 
                isAutoCalculated={true}
                isEditable={false}
              />
            </div>
          );

        case "Secondary Property":
          const capitalGain = asset.currentValue - ((asset.originalPurchasePrice || 0) + (asset.capitalImprovements || 0));
          const estimatedCapitalGainsTax = capitalGain * ((asset.inclusionRate || 50) / 100) * ((asset.taxRate || 25) / 100);
          
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <DynamicEditableField 
                  fieldKey="currentValue" 
                  value={asset.currentValue} 
                  label="Current FMV" 
                />
                <DynamicEditableField 
                  fieldKey="futureValue" 
                  value={Math.round(futureValue)} 
                  label={`Future Value (${asset.years[0]} years)`} 
                  isAutoCalculated={true}
                  isEditable={false}
                />
                <DynamicEditableField 
                  fieldKey="originalPurchasePrice" 
                  value={asset.originalPurchasePrice || 0} 
                  label="Original Purchase Price" 
                />
                <DynamicEditableField 
                  fieldKey="capitalImprovements" 
                  value={asset.capitalImprovements || 0} 
                  label="Capital Improvements" 
                />
              </div>
              
              <div className="bg-muted/20 p-4 rounded-lg space-y-3">
                <h4 className="font-medium text-sm">Capital Gains Calculation</h4>
                <div className="grid grid-cols-2 gap-4">
                  <DynamicEditableField 
                    fieldKey="capitalGain" 
                    value={Math.round(capitalGain)} 
                    label="Capital Gain" 
                    isAutoCalculated={true}
                    isEditable={false}
                  />
                  <DynamicEditableField 
                    fieldKey="inclusionRate" 
                    value={asset.inclusionRate || 50} 
                    label="Inclusion Rate" 
                    prefix=""
                    suffix="%"
                  />
                  <DynamicEditableField 
                    fieldKey="taxRate" 
                    value={asset.taxRate || 25} 
                    label="Tax Rate" 
                    prefix=""
                    suffix="%"
                  />
                  <DynamicEditableField 
                    fieldKey="estimatedCapitalGainsTax" 
                    value={Math.round(estimatedCapitalGainsTax)} 
                    label="Estimated Capital Gains Tax" 
                    isAutoCalculated={true}
                    isEditable={false}
                  />
                </div>
              </div>
            </div>
          );

        case "RRSP":
          return (
            <div className="grid grid-cols-2 gap-4">
              <DynamicEditableField 
                fieldKey="currentValue" 
                value={asset.currentValue} 
                label="Current Value" 
              />
              <DynamicEditableField 
                fieldKey="futureValue" 
                value={Math.round(futureValue)} 
                label={`Future Value (${asset.years[0]} years)`} 
                isAutoCalculated={true}
                isEditable={false}
              />
              <DynamicEditableField 
                fieldKey="projectedGrowth" 
                value={Math.round(futureValue - asset.currentValue)} 
                label="Projected Growth" 
                prefix="+$"
                isAutoCalculated={true}
                isEditable={false}
              />
              <DynamicEditableField 
                fieldKey="availableRoom" 
                value={asset.availableRoom || 0} 
                label="Available Room" 
              />
              <DynamicEditableField 
                fieldKey="annualContribution" 
                value={asset.annualContribution} 
                label="Annual Contribution" 
              />
              <DynamicEditableField 
                fieldKey="monthlyContribution" 
                value={asset.monthlyContribution || 0} 
                label="Monthly Contribution" 
              />
            </div>
          );

        case "TFSA":
        case "FHSA":
          return (
            <div className="grid grid-cols-2 gap-4">
              <DynamicEditableField 
                fieldKey="currentValue" 
                value={asset.currentValue} 
                label="Current Value" 
              />
              <DynamicEditableField 
                fieldKey="futureValue" 
                value={Math.round(futureValue)} 
                label={`Future Value (${asset.years[0]} years)`} 
                isAutoCalculated={true}
                isEditable={false}
              />
              <DynamicEditableField 
                fieldKey="projectedGrowth" 
                value={Math.round(futureValue - asset.currentValue)} 
                label="Projected Growth" 
                prefix="+$"
                isAutoCalculated={true}
                isEditable={false}
              />
              <DynamicEditableField 
                fieldKey="availableRoom" 
                value={asset.availableRoom || 0} 
                label="Available Room" 
              />
              <DynamicEditableField 
                fieldKey="annualContribution" 
                value={asset.annualContribution} 
                label="Annual Contribution" 
              />
              <DynamicEditableField 
                fieldKey="monthlyContribution" 
                value={asset.monthlyContribution || 0} 
                label="Monthly Contribution" 
              />
            </div>
          );

        case "Non-Registered":
          const capitalGainNonReg = asset.currentValue - (asset.costBase || 0);
          const estimatedCapitalGainsTaxNonReg = capitalGainNonReg * ((asset.inclusionRate || 50) / 100) * ((asset.taxRate || 25) / 100);

          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <DynamicEditableField 
                  fieldKey="currentValue" 
                  value={asset.currentValue} 
                  label="Current Value" 
                />
                <DynamicEditableField 
                  fieldKey="futureValue" 
                  value={Math.round(futureValue)} 
                  label={`Future Value (${asset.years[0]} years)`} 
                  isAutoCalculated={true}
                  isEditable={false}
                />
                <DynamicEditableField 
                  fieldKey="costBase" 
                  value={asset.costBase || 0} 
                  label="Cost Base" 
                />
                <DynamicEditableField 
                  fieldKey="projectedGrowth" 
                  value={Math.round(futureValue - asset.currentValue)} 
                  label="Projected Growth" 
                  prefix="+$"
                  isAutoCalculated={true}
                  isEditable={false}
                />
                <DynamicEditableField 
                  fieldKey="annualContribution" 
                  value={asset.annualContribution} 
                  label="Annual Contribution" 
                />
                <DynamicEditableField 
                  fieldKey="monthlyContribution" 
                  value={asset.monthlyContribution || 0} 
                  label="Monthly Contribution" 
                />
              </div>

              <div className="bg-muted/20 p-4 rounded-lg space-y-3">
                <h4 className="font-medium text-sm">Capital Gains Calculation</h4>
                <div className="grid grid-cols-2 gap-4">
                  <DynamicEditableField 
                    fieldKey="capitalGain" 
                    value={Math.round(capitalGainNonReg)} 
                    label="Capital Gain" 
                    isAutoCalculated={true}
                    isEditable={false}
                  />
                  <DynamicEditableField 
                    fieldKey="nonReg.inclusionRate" 
                    value={asset.inclusionRate} 
                    label="Inclusion Rate" 
                    prefix=""
                    suffix="%"
                  />
                  <DynamicEditableField 
                    fieldKey="nonReg.taxRate" 
                    value={asset.taxRate} 
                    label="Tax Rate" 
                    prefix=""
                    suffix="%"
                  />
                  <DynamicEditableField 
                    fieldKey="estimated-capital-gains-tax-nonreg" 
                    value={Math.round((nonRegisteredDetails.totalValue - nonRegisteredDetails.costBase) * (nonRegisteredDetails.inclusionRate / 100) * (nonRegisteredDetails.taxRate / 100))} 
                    label="Estimated Capital Gains Tax" 
                    isAutoCalculated={true}
                    isEditable={false}
                  />
                </div>
              </div>
            </div>
          );

        default:
          return (
            <div className="grid grid-cols-2 gap-4">
              <DynamicEditableField 
                fieldKey="currentValue" 
                value={asset.currentValue} 
                label="Current Value" 
              />
              <DynamicEditableField 
                fieldKey="futureValue" 
                value={Math.round(futureValue)} 
                label={`Future Value (${asset.years[0]} years)`} 
                isAutoCalculated={true}
                isEditable={false}
              />
              <DynamicEditableField 
                fieldKey="annualContribution" 
                value={asset.annualContribution} 
                label="Annual Contribution" 
              />
              <DynamicEditableField 
                fieldKey="projectedGrowth" 
                value={Math.round(futureValue - asset.currentValue)} 
                label="Projected Growth" 
                prefix="+$"
                isAutoCalculated={true}
                isEditable={false}
              />
            </div>
          );
      }
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: asset.color }}></div>
              <span>{asset.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => showAssetWriteup(asset.type, asset.name)}
                className="border border-indigo-600 text-indigo-700 hover:bg-indigo-50 h-8 w-8 p-0 rounded-md"
              >
                <Bot className="w-4 h-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Asset</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{asset.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => confirmDeleteAsset(asset.id, asset.name)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Growth Visualization */}
          <GrowthChart 
            data={chartData}
            currentValue={asset.currentValue}
            futureValue={futureValue}
            years={asset.years[0]}
            color={asset.color}
          />

          {/* Controls */}
          <div className="bg-muted/30 p-4 rounded-lg space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Growth Rate: {asset.rate[0]}%</label>
              <Slider
                value={asset.rate}
                onValueChange={(value) => updateDynamicAsset(asset.id, { rate: value })}
                max={15}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Projection Years: {asset.years[0]}</label>
              <Slider
                value={asset.years}
                onValueChange={(value) => updateDynamicAsset(asset.id, { years: value })}
                max={30}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Asset-specific fields */}
          {renderAssetSpecificFields()}
          
          {/* Additional asset-specific info */}
          {(asset.type === "Primary Residence" || asset.type === "Secondary Property") && asset.address && (
            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-1">Address: {asset.address}</p>
            </div>
          )}
          
          {(asset.type === "RRSP" || asset.type === "TFSA" || asset.type === "FHSA" || asset.type === "Non-Registered") && (
            <div className="pt-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm">Rate: <span className="font-semibold">{asset.rate[0]}%</span> annually</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Dialog>
  );
};
