import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { TrendingUp, FileText, X, Plus, Brain, Lightbulb, Edit2, Check } from "lucide-react";
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
                    value={Math.round(estimatedCapitalGainsTaxNonReg)} 
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
                className="text-muted-foreground hover:text-foreground"
              >
                <FileText className="w-4 h-4" />
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
    );
  };

  const chartConfig = {
    current: { label: "Current Value", color: "#3b82f6" },
    future: { label: "Future Value", color: "#10b981" }
  };

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

  const EditableField = ({ 
    fieldId, 
    value, 
    label, 
    isEditable = true, 
    prefix = "$",
    isAutoCalculated = false,
    tip
  }: { 
    fieldId: string; 
    value: number; 
    label: string; 
    isEditable?: boolean;
    prefix?: string;
    isAutoCalculated?: boolean;
    tip?: string;
  }) => {
    const isEditing = editingField === fieldId;
    
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
            <Button size="sm" variant="ghost" onClick={() => saveEdit(fieldId)}>
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
                {prefix}{value.toLocaleString()}
              </p>
              {tip && (
                <p className="text-xs text-muted-foreground/80 mt-1 italic">
                  💡 {tip}
                </p>
              )}
            </div>
            {isEditable && !isAutoCalculated && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => startEdit(fieldId, value)}
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

  const GrowthChart = ({ 
    data, 
    currentValue, 
    futureValue, 
    years,
    color = "#10b981"
  }: { 
    data: any[];
    currentValue: number;
    futureValue: number;
    years: number;
    color?: string;
  }) => {
    return (
      <div className="h-48 w-full bg-muted/20 rounded-lg p-4 border border-border/30">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted-foreground font-medium">Growth Projection</span>
          <span className="text-xs text-primary font-semibold">
            +{((futureValue / currentValue - 1) * 100).toFixed(1)}% over {years} years
          </span>
        </div>
        
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={data} 
              margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
            >
              <XAxis 
                dataKey="yearLabel"
                axisLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: 'normal' }}
                interval={0}
              />
              <YAxis 
                axisLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: 'normal' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <ChartTooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const current = payload.find(p => p.dataKey === 'current')?.value;
                    const future = payload.find(p => p.dataKey === 'future')?.value;
                    
                    return (
                      <div className="bg-background border border-border rounded-lg p-3 shadow-xl">
                        <p className="font-medium text-foreground mb-1">{label}</p>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="text-destructive">Current: </span>
                            <span className="text-foreground font-semibold">${current?.toLocaleString()}</span>
                          </p>
                          <p className="text-sm">
                            <span className="text-green-600">Future: </span>
                            <span className="text-foreground font-semibold">${future?.toLocaleString()}</span>
                          </p>
                          {future && current && (
                            <p className="text-xs text-muted-foreground">
                              Difference: +${((future as number) - (current as number)).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              
              <Line 
                type="monotone" 
                dataKey="current" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: 'hsl(var(--destructive))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                isAnimationActive={false}
              />
              
              <Line 
                type="monotone" 
                dataKey="future" 
                stroke="#22c55e" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#22c55e', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-between items-center mt-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-destructive rounded"></div>
            <span className="text-muted-foreground">Current Value</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-green-600 rounded"></div>
            <span className="text-muted-foreground">Future Value</span>
          </div>
        </div>
      </div>
    );
  };

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<{ name: string; type: string } | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<{ name: string; type: string } | null>(null);

  const generateAssetReport = (assetName: string, assetType: string) => {
    // Generate different reports based on asset type
    switch (assetType) {
      case "Primary Residence":
        return `Your Primary Residence currently holds $${realEstateDetails.currentFMV.toLocaleString()} and is projected to grow to $${Math.round(realEstateFV).toLocaleString()} over ${realEstateYears[0]} years, assuming ${realEstateRate[0]}% annual appreciation.

Current Fair Market Value: $${realEstateDetails.currentFMV.toLocaleString()}
Purchase Price: $${realEstateDetails.purchasePrice.toLocaleString()}
Mortgage Balance: $${realEstateDetails.mortgageBalance.toLocaleString()}
Net Equity: $${(realEstateDetails.currentFMV - realEstateDetails.mortgageBalance).toLocaleString()}
Growth Assumption: ${realEstateRate[0]}% annually
Projected Value: $${Math.round(realEstateFV).toLocaleString()}
Total Projected Growth: $${Math.round(realEstateFV - realEstateDetails.currentFMV).toLocaleString()}

This projection assumes consistent real estate market performance. Actual results may vary based on local market conditions, property improvements, and economic factors.`;

      case "RRSP":
        return `Your RRSP currently holds $${rrspDetails.currentValue.toLocaleString()} and is projected to grow to $${Math.round(rrspFV).toLocaleString()} over ${rrspYears[0]} years, assuming ${rrspRate[0]}% annual returns and $${rrspDetails.annualContribution.toLocaleString()} in annual contributions.

Current Value: $${rrspDetails.currentValue.toLocaleString()}
Available Contribution Room: $${rrspDetails.availableRoom.toLocaleString()}
Annual Contributions: $${rrspDetails.annualContribution.toLocaleString()}
Monthly Contributions: $${rrspDetails.monthlyContribution.toLocaleString()}
Growth Assumption: ${rrspRate[0]}% annually
Projected Value: $${Math.round(rrspFV).toLocaleString()}
Total Projected Growth: $${Math.round(rrspFV - rrspDetails.currentValue).toLocaleString()}

This projection assumes consistent market performance and regular contributions. RRSP contributions provide immediate tax deductions, making this an excellent tax-deferred growth vehicle.`;

      case "TFSA":
        return `Your TFSA currently holds $${tfsaDetails.currentValue.toLocaleString()} and is projected to grow to $${Math.round(tfsaFV).toLocaleString()} over ${tfsaYears[0]} years, assuming ${tfsaRate[0]}% annual returns and $${tfsaDetails.annualContribution.toLocaleString()} in annual contributions.

Current Value: $${tfsaDetails.currentValue.toLocaleString()}
Available Contribution Room: $${tfsaDetails.availableRoom.toLocaleString()}
Annual Contributions: $${tfsaDetails.annualContribution.toLocaleString()}
Monthly Contributions: $${tfsaDetails.monthlyContribution.toLocaleString()}
Growth Assumption: ${tfsaRate[0]}% annually
Projected Value: $${Math.round(tfsaFV).toLocaleString()}
Total Projected Growth: $${Math.round(tfsaFV - tfsaDetails.currentValue).toLocaleString()}

This projection assumes consistent market performance and regular contributions. TFSA growth is completely tax-free, making this an excellent vehicle for long-term wealth building.`;

      case "Non-Registered":
        const capitalGain = nonRegisteredDetails.totalValue - nonRegisteredDetails.costBase;
        const estimatedCapitalGainsTax = capitalGain * (nonRegisteredDetails.inclusionRate / 100) * (nonRegisteredDetails.taxRate / 100);
        
        return `Your Non-Registered investment account currently holds $${nonRegisteredDetails.totalValue.toLocaleString()} and is projected to grow to $${Math.round(nonRegFV).toLocaleString()} over ${nonRegYears[0]} years, assuming ${nonRegRate[0]}% annual returns and $${nonRegisteredDetails.annualContribution.toLocaleString()} in annual contributions.

Current Value: $${nonRegisteredDetails.totalValue.toLocaleString()}
Cost Base: $${nonRegisteredDetails.costBase.toLocaleString()}
Capital Gain: $${capitalGain.toLocaleString()}
Estimated Capital Gains Tax: $${Math.round(estimatedCapitalGainsTax).toLocaleString()}
Annual Contributions: $${nonRegisteredDetails.annualContribution.toLocaleString()}
Monthly Contributions: $${nonRegisteredDetails.monthlyContribution.toLocaleString()}
Growth Assumption: ${nonRegRate[0]}% annually
Projected Value: $${Math.round(nonRegFV).toLocaleString()}
Total Projected Growth: $${Math.round(nonRegFV - nonRegisteredDetails.totalValue).toLocaleString()}

This projection assumes consistent market performance and regular contributions. Note that capital gains and dividends in non-registered accounts are subject to taxation.`;

      default:
        return `Your ${assetName} is being tracked with custom parameters. Please review the detailed projections in the card above for specific growth assumptions and projected values.`;
    }
  };

  const handleAssetReport = (assetName: string, assetType: string) => {
    setSelectedAsset({ name: assetName, type: assetType });
    setReportModalOpen(true);
  };

  const handleAssetDelete = (assetName: string, assetType: string) => {
    setAssetToDelete({ name: assetName, type: assetType });
    setDeleteModalOpen(true);
  };

  const confirmAssetDelete = () => {
    if (assetToDelete) {
      console.log(`Delete confirmed for asset: ${assetToDelete.name}`);
      // Note: For the main assets (Primary Residence, RRSP, TFSA, Non-Registered), 
      // deletion would need to be handled differently as they're not in a removable array
      // For now, we'll just close the modal
      setDeleteModalOpen(false);
      setAssetToDelete(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Assets</DialogTitle>
        </DialogHeader>

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
                  ${Math.round(realEstateFV + rrspFV + tfsaFV + nonRegFV + dynamicAssets.reduce((sum, asset) => sum + calculateFV(asset.currentValue, asset.rate[0], asset.years[0], asset.annualContribution), 0)).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Projected Growth</p>
                <p className="font-bold text-2xl text-purple-600">
                  +${Math.round((realEstateFV + rrspFV + tfsaFV + nonRegFV + dynamicAssets.reduce((sum, asset) => sum + calculateFV(asset.currentValue, asset.rate[0], asset.years[0], asset.annualContribution), 0)) - (realEstateDetails.currentFMV + rrspDetails.currentValue + tfsaDetails.currentValue + nonRegisteredDetails.totalValue + dynamicAssets.reduce((sum, asset) => sum + asset.currentValue, 0))).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Growth Rate</p>
                <p className="font-bold text-2xl text-orange-600">
                  {(((realEstateFV + rrspFV + tfsaFV + nonRegFV + dynamicAssets.reduce((sum, asset) => sum + calculateFV(asset.currentValue, asset.rate[0], asset.years[0], asset.annualContribution), 0)) / (realEstateDetails.currentFMV + rrspDetails.currentValue + tfsaDetails.currentValue + nonRegisteredDetails.totalValue + dynamicAssets.reduce((sum, asset) => sum + asset.currentValue, 0)) - 1) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => addDynamicAsset("Primary Residence", { name: "Primary Residence", value: realEstateDetails.currentFMV, amount: `$${realEstateDetails.currentFMV.toLocaleString()}`, color: "#f59e0b" })}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-xl">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500"></div>
                  <span>Primary Residence</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAssetReport("Primary Residence", "Primary Residence");
                    }}
                    className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAssetDelete("Primary Residence", "Primary Residence");
                    }}
                    className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
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

              <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Growth Rate: {realEstateRate[0]}%</label>
                  <Slider
                    value={realEstateRate}
                    onValueChange={setRealEstateRate}
                    max={15}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Projection Years: {realEstateYears[0]}</label>
                  <Slider
                    value={realEstateYears}
                    onValueChange={setRealEstateYears}
                    max={30}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <EditableField 
                  fieldId="realEstate.currentFMV" 
                  value={realEstateDetails.currentFMV} 
                  label="Current FMV" 
                />
                <EditableField 
                  fieldId="future-value-re" 
                  value={Math.round(realEstateFV)} 
                  label={`Future Value (${realEstateYears[0]} years)`} 
                  isAutoCalculated={true}
                  isEditable={false}
                />
                <EditableField 
                  fieldId="realEstate.purchasePrice" 
                  value={realEstateDetails.purchasePrice} 
                  label="Purchase Price" 
                />
                <EditableField 
                  fieldId="projected-growth-re" 
                  value={Math.round(realEstateFV - realEstateDetails.currentFMV)} 
                  label="Projected Growth" 
                  prefix="+$"
                  isAutoCalculated={true}
                  isEditable={false}
                />
                <EditableField 
                  fieldId="realEstate.mortgageBalance" 
                  value={realEstateDetails.mortgageBalance} 
                  label="Mortgage Balance" 
                />
                <EditableField 
                  fieldId="net-equity-re" 
                  value={realEstateDetails.currentFMV - realEstateDetails.mortgageBalance} 
                  label="Net Equity" 
                  isAutoCalculated={true}
                  isEditable={false}
                />
              </div>
              
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-1">Address: {realEstateDetails.address}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => addDynamicAsset("RRSP", { name: "RRSP", value: rrspDetails.currentValue, amount: `$${rrspDetails.currentValue.toLocaleString()}`, color: "#10b981" })}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-xl">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500"></div>
                  <span>RRSP</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAssetReport("RRSP", "RRSP");
                    }}
                    className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAssetDelete("RRSP", "RRSP");
                    }}
                    className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
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

              <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Growth Rate: {rrspRate[0]}%</label>
                  <Slider
                    value={rrspRate}
                    onValueChange={setRrspRate}
                    max={15}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Projection Years: {rrspYears[0]}</label>
                  <Slider
                    value={rrspYears}
                    onValueChange={setRrspYears}
                    max={30}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <EditableField 
                  fieldId="rrsp.currentValue" 
                  value={rrspDetails.currentValue} 
                  label="Current Value" 
                />
                <EditableField 
                  fieldId="future-value-rrsp" 
                  value={Math.round(rrspFV)} 
                  label={`Future Value (${rrspYears[0]} years)`} 
                  isAutoCalculated={true}
                  isEditable={false}
                />
                <EditableField 
                  fieldId="projected-growth-rrsp" 
                  value={Math.round(rrspFV - rrspDetails.currentValue)} 
                  label="Projected Growth" 
                  prefix="+$"
                  isAutoCalculated={true}
                  isEditable={false}
                />
                <EditableField 
                  fieldId="rrsp.availableRoom" 
                  value={rrspDetails.availableRoom} 
                  label="Available Room" 
                  tip={`If maxed out, worth $${Math.round(rrspDetails.availableRoom * Math.pow(1.07, 10)).toLocaleString()} in 10 years at 7%`}
                />
                <EditableField 
                  fieldId="rrsp.annualContribution" 
                  value={rrspDetails.annualContribution} 
                  label="Annual Contribution" 
                  tip={`${(rrspDetails.annualContribution / assumedAnnualIncome * 100).toFixed(1)}% of gross annual income`}
                />
                <EditableField 
                  fieldId="rrsp.monthlyContribution" 
                  value={rrspDetails.monthlyContribution} 
                  label="Monthly Contribution" 
                  tip={`${((rrspDetails.monthlyContribution * 12) / assumedAnnualIncome * 100).toFixed(1)}% of gross annual income`}
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

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => addDynamicAsset("TFSA", { name: "TFSA", value: tfsaDetails.currentValue, amount: `$${tfsaDetails.currentValue.toLocaleString()}`, color: "#8b5cf6" })}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-xl">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-violet-500"></div>
                  <span>TFSA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAssetReport("TFSA", "TFSA");
                    }}
                    className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAssetDelete("TFSA", "TFSA");
                    }}
                    className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
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

              <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Growth Rate: {tfsaRate[0]}%</label>
                  <Slider
                    value={tfsaRate}
                    onValueChange={setTfsaRate}
                    max={15}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Projection Years: {tfsaYears[0]}</label>
                  <Slider
                    value={tfsaYears}
                    onValueChange={setTfsaYears}
                    max={30}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <EditableField 
                  fieldId="tfsa.currentValue" 
                  value={tfsaDetails.currentValue} 
                  label="Current Value" 
                />
                <EditableField 
                  fieldId="future-value-tfsa" 
                  value={Math.round(tfsaFV)} 
                  label={`Future Value (${tfsaYears[0]} years)`} 
                  isAutoCalculated={true}
                  isEditable={false}
                />
                <EditableField 
                  fieldId="projected-growth-tfsa" 
                  value={Math.round(tfsaFV - tfsaDetails.currentValue)} 
                  label="Projected Growth" 
                  prefix="+$"
                  isAutoCalculated={true}
                  isEditable={false}
                />
                <EditableField 
                  fieldId="tfsa.availableRoom" 
                  value={tfsaDetails.availableRoom} 
                  label="Available Room" 
                  tip={`If maxed out, worth $${Math.round(tfsaDetails.availableRoom * Math.pow(1.065, 10)).toLocaleString()} in 10 years at 6.5%`}
                />
                <EditableField 
                  fieldId="tfsa.annualContribution" 
                  value={tfsaDetails.annualContribution} 
                  label="Annual Contribution" 
                  tip={`${(tfsaDetails.annualContribution / assumedAnnualIncome * 100).toFixed(1)}% of gross annual income`}
                />
                <EditableField 
                  fieldId="tfsa.monthlyContribution" 
                  value={tfsaDetails.monthlyContribution} 
                  label="Monthly Contribution" 
                  tip={`${((tfsaDetails.monthlyContribution * 12) / assumedAnnualIncome * 100).toFixed(1)}% of gross annual income`}
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

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => addDynamicAsset("Non-Registered", { name: "Non-Registered", value: nonRegisteredDetails.totalValue, amount: `$${nonRegisteredDetails.totalValue.toLocaleString()}`, color: "#f59e0b" })}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-xl">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-red-500"></div>
                  <span>Non-Registered</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAssetReport("Non-Registered", "Non-Registered");
                    }}
                    className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAssetDelete("Non-Registered", "Non-Registered");
                    }}
                    className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
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

              <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Growth Rate: {nonRegRate[0]}%</label>
                  <Slider
                    value={nonRegRate}
                    onValueChange={setNonRegRate}
                    max={15}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Projection Years: {nonRegYears[0]}</label>
                  <Slider
                    value={nonRegYears}
                    onValueChange={setNonRegYears}
                    max={30}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <EditableField 
                    fieldId="nonReg.totalValue" 
                    value={nonRegisteredDetails.totalValue} 
                    label="Current Value" 
                  />
                  <EditableField 
                    fieldId="future-value-nonreg" 
                    value={Math.round(nonRegFV)} 
                    label={`Future Value (${nonRegYears[0]} years)`} 
                    isAutoCalculated={true}
                    isEditable={false}
                  />
                  <EditableField 
                    fieldId="nonReg.costBase" 
                    value={nonRegisteredDetails.costBase} 
                    label="Cost Base" 
                  />
                  <EditableField 
                    fieldId="projected-growth-nonreg" 
                    value={Math.round(nonRegFV - nonRegisteredDetails.totalValue)} 
                    label="Projected Growth" 
                    prefix="+$"
                    isAutoCalculated={true}
                    isEditable={false}
                  />
                  <EditableField 
                    fieldId="nonReg.annualContribution" 
                    value={nonRegisteredDetails.annualContribution} 
                    label="Annual Contribution" 
                    tip={`${(nonRegisteredDetails.annualContribution / assumedAnnualIncome * 100).toFixed(1)}% of gross annual income`}
                  />
                  <EditableField 
                    fieldId="nonReg.monthlyContribution" 
                    value={nonRegisteredDetails.monthlyContribution} 
                    label="Monthly Contribution" 
                  />
                </div>

                <div className="bg-muted/20 p-4 rounded-lg space-y-3">
                  <h4 className="font-medium text-sm">Capital Gains Calculation</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <EditableField 
                      fieldId="capital-gain-nonreg" 
                      value={Math.round(nonRegisteredDetails.totalValue - nonRegisteredDetails.costBase)} 
                      label="Capital Gain" 
                      isAutoCalculated={true}
                      isEditable={false}
                    />
                    <EditableField 
                      fieldId="nonReg.inclusionRate" 
                      value={nonRegisteredDetails.inclusionRate} 
                      label="Inclusion Rate" 
                      prefix=""
                      suffix="%"
                    />
                    <EditableField 
                      fieldId="nonReg.taxRate" 
                      value={nonRegisteredDetails.taxRate} 
                      label="Tax Rate" 
                      prefix=""
                      suffix="%"
                    />
                    <EditableField 
                      fieldId="estimated-capital-gains-tax-nonreg" 
                      value={Math.round((nonRegisteredDetails.totalValue - nonRegisteredDetails.costBase) * (nonRegisteredDetails.inclusionRate / 100) * (nonRegisteredDetails.taxRate / 100))} 
                      label="Estimated Capital Gains Tax" 
                      isAutoCalculated={true}
                      isEditable={false}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Rate: <span className="font-semibold">{nonRegRate[0]}%</span> annually</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {dynamicAssets.map((asset) => (
            <DynamicAssetCard key={asset.id} asset={asset} />
          ))}

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
                      <SelectItem value="Secondary Property">Secondary Property</SelectItem>
                      <SelectItem value="RRSP">RRSP</SelectItem>
                      <SelectItem value="RRIF">RRIF</SelectItem>
                      <SelectItem value="TFSA">TFSA</SelectItem>
                      <SelectItem value="FHSA">FHSA</SelectItem>
                      <SelectItem value="Non-Registered">Non-Registered</SelectItem>
                      <SelectItem value="DB">DB (Defined Benefit)</SelectItem>
                      <SelectItem value="DC">DC (Defined Contribution)</SelectItem>
                      <SelectItem value="IPP">IPP (Individual Pension Plan)</SelectItem>
                      <SelectItem value="LIRA">LIRA (Locked-in Retirement Account)</SelectItem>
                      <SelectItem value="LIF">LIF (Life Income Fund)</SelectItem>
                      <SelectItem value="Pension">Pension</SelectItem>
                      <SelectItem value="Chequing">Chequing Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Guidance Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  icon: TrendingUp,
                  title: "Diversification Opportunity",
                  tip: "Your portfolio is heavily weighted in real estate (84%). Consider increasing liquid investments to reduce concentration risk.",
                  color: "text-orange-600",
                  bgColor: "bg-orange-50",
                  borderColor: "border-orange-200"
                },
                {
                  icon: Brain,
                  title: "Tax Optimization",
                  tip: "Maximize your TFSA contributions first ($38K current vs $88K+ limit), then focus on RRSP to reduce taxable income.",
                  color: "text-blue-600", 
                  bgColor: "bg-blue-50",
                  borderColor: "border-blue-200"
                },
                {
                  icon: Lightbulb,
                  title: "Emergency Fund Strategy",
                  tip: "Consider keeping 3-6 months of expenses in high-interest savings. Your current liquid assets may not provide adequate emergency coverage.",
                  color: "text-green-600",
                  bgColor: "bg-green-50", 
                  borderColor: "border-green-200"
                }
              ].map((tip, index) => (
                <div key={index} className={`p-3 rounded-lg border ${tip.bgColor} ${tip.borderColor}`}>
                  <div className="flex items-start gap-3">
                    <tip.icon className={`w-4 h-4 mt-0.5 ${tip.color}`} />
                    <div>
                      <h5 className={`font-medium ${tip.color} mb-1`}>{tip.title}</h5>
                      <p className="text-sm text-gray-700">{tip.tip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Asset Report Modal */}
        <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>{selectedAsset?.name} Report</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">
                  {selectedAsset ? generateAssetReport(selectedAsset.name, selectedAsset.type) : ''}
                </pre>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setReportModalOpen(false)}>
                  Close
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Export to PDF
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center space-x-2 text-red-600">
                <X className="h-5 w-5" />
                <span>Delete Asset Card</span>
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the <strong>{assetToDelete?.name}</strong> asset card? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmAssetDelete}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
};
