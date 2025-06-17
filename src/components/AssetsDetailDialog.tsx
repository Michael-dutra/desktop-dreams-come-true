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
                    fieldKey="estimatedCapitalGainsTaxNonReg" 
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
          <div className="h-48 w-full">
            <ChartContainer config={{}} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id={`colorGradient-${asset.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={asset.color} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={asset.color} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="yearLabel" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent 
                      formatter={(value, name) => [
                        `$${Number(value).toLocaleString()}`,
                        name === 'future' ? 'Projected Value' : 'Current Value'
                      ]}
                    />}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="future" 
                    stroke={asset.color} 
                    fillOpacity={1} 
                    fill={`url(#colorGradient-${asset.id})`}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

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

  const EditableField = ({ 
    fieldKey, 
    value, 
    label, 
    isEditable = true, 
    prefix = "$",
    suffix = "",
    isAutoCalculated = false,
    onUpdate
  }: { 
    fieldKey: string; 
    value: number; 
    label: string; 
    isEditable?: boolean;
    prefix?: string;
    suffix?: string;
    isAutoCalculated?: boolean;
    onUpdate?: (key: string, value: number) => void;
  }) => {
    const handleStartEdit = () => {
      setEditingField(fieldKey);
      setTempValue(value.toString());
    };

    const handleSaveEdit = () => {
      const numericValue = parseFloat(tempValue);
      if (!isNaN(numericValue) && onUpdate) {
        onUpdate(fieldKey, numericValue);
      }
      setEditingField(null);
      setTempValue("");
    };

    const handleCancelEdit = () => {
      setEditingField(null);
      setTempValue("");
    };

    return (
      <div className="relative">
        <p className="text-sm text-muted-foreground">{label}</p>
        {editingField === fieldKey ? (
          <div className="flex items-center gap-2">
            <Input
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="text-lg font-semibold"
              type="number"
              autoFocus
            />
            <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
              <Check className="w-4 h-4 text-green-600" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
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
                onClick={handleStartEdit}
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Assets Detail
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Assets Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Current Value</p>
                <p className="text-2xl font-bold text-green-600">
                  ${(realEstateDetails.currentFMV + rrspDetails.currentValue + tfsaDetails.currentValue + nonRegisteredDetails.totalValue + dynamicAssets.reduce((sum, asset) => sum + asset.currentValue, 0)).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Future Value</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${(realEstateFV + rrspFV + tfsaFV + nonRegFV + dynamicAssets.reduce((sum, asset) => sum + calculateFV(asset.currentValue, asset.rate[0], asset.years[0], asset.annualContribution), 0)).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Growth</p>
                <p className="text-2xl font-bold text-purple-600">
                  +${((realEstateFV + rrspFV + tfsaFV + nonRegFV + dynamicAssets.reduce((sum, asset) => sum + calculateFV(asset.currentValue, asset.rate[0], asset.years[0], asset.annualContribution), 0)) - (realEstateDetails.currentFMV + rrspDetails.currentValue + tfsaDetails.currentValue + nonRegisteredDetails.totalValue + dynamicAssets.reduce((sum, asset) => sum + asset.currentValue, 0))).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Number of Assets</p>
                <p className="text-2xl font-bold text-orange-600">
                  {4 + dynamicAssets.length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Core Assets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real Estate Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500"></div>
                    <span>Primary Residence</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => showAssetWriteup("Real Estate", "Primary Residence")}
                    className="border border-indigo-600 text-indigo-700 hover:bg-indigo-50 h-8 w-8 p-0 rounded-md"
                  >
                    <Bot className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Chart */}
                <div className="h-48 w-full">
                  <ChartContainer config={{}} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={realEstateChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="colorGradient-realestate" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="yearLabel" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                        <ChartTooltip content={<ChartTooltipContent formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name === 'future' ? 'Projected Value' : 'Current Value']} />} />
                        <Area type="monotone" dataKey="future" stroke="#22c55e" fillOpacity={1} fill="url(#colorGradient-realestate)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>

                {/* Controls */}
                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Growth Rate: {realEstateRate[0]}%</label>
                    <Slider value={realEstateRate} onValueChange={setRealEstateRate} max={15} min={0} step={0.1} className="w-full" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Projection Years: {realEstateYears[0]}</label>
                    <Slider value={realEstateYears} onValueChange={setRealEstateYears} max={30} min={1} step={1} className="w-full" />
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <EditableField fieldKey="currentFMV" value={realEstateDetails.currentFMV} label="Current FMV" onUpdate={(key, value) => setRealEstateDetails(prev => ({ ...prev, [key]: value }))} />
                  <EditableField fieldKey="futureValue" value={Math.round(realEstateFV)} label={`Future Value (${realEstateYears[0]} years)`} isAutoCalculated={true} isEditable={false} />
                  <EditableField fieldKey="purchasePrice" value={realEstateDetails.purchasePrice} label="Purchase Price" onUpdate={(key, value) => setRealEstateDetails(prev => ({ ...prev, [key]: value }))} />
                  <EditableField fieldKey="projectedGrowth" value={Math.round(realEstateFV - realEstateDetails.currentFMV)} label="Projected Growth" prefix="+$" isAutoCalculated={true} isEditable={false} />
                  <EditableField fieldKey="mortgageBalance" value={realEstateDetails.mortgageBalance} label="Mortgage Balance" onUpdate={(key, value) => setRealEstateDetails(prev => ({ ...prev, [key]: value }))} />
                  <EditableField fieldKey="netEquity" value={realEstateDetails.currentFMV - realEstateDetails.mortgageBalance} label="Net Equity" isAutoCalculated={true} isEditable={false} />
                </div>
              </CardContent>
            </Card>

            {/* RRSP Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500"></div>
                    <span>RRSP</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => showAssetWriteup("RRSP", "RRSP")}
                    className="border border-indigo-600 text-indigo-700 hover:bg-indigo-50 h-8 w-8 p-0 rounded-md"
                  >
                    <Bot className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Chart */}
                <div className="h-48 w-full">
                  <ChartContainer config={{}} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={rrspChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="colorGradient-rrsp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="yearLabel" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                        <ChartTooltip content={<ChartTooltipContent formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name === 'future' ? 'Projected Value' : 'Current Value']} />} />
                        <Area type="monotone" dataKey="future" stroke="#3b82f6" fillOpacity={1} fill="url(#colorGradient-rrsp)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>

                {/* Controls */}
                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Growth Rate: {rrspRate[0]}%</label>
                    <Slider value={rrspRate} onValueChange={setRrspRate} max={15} min={0} step={0.1} className="w-full" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Projection Years: {rrspYears[0]}</label>
                    <Slider value={rrspYears} onValueChange={setRrspYears} max={30} min={1} step={1} className="w-full" />
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <EditableField fieldKey="currentValue" value={rrspDetails.currentValue} label="Current Value" onUpdate={(key, value) => setRrspDetails(prev => ({ ...prev, [key]: value }))} />
                  <EditableField fieldKey="futureValue" value={Math.round(rrspFV)} label={`Future Value (${rrspYears[0]} years)`} isAutoCalculated={true} isEditable={false} />
                  <EditableField fieldKey="projectedGrowth" value={Math.round(rrspFV - rrspDetails.currentValue)} label="Projected Growth" prefix="+$" isAutoCalculated={true} isEditable={false} />
                  <EditableField fieldKey="availableRoom" value={rrspDetails.availableRoom} label="Available Room" onUpdate={(key, value) => setRrspDetails(prev => ({ ...prev, [key]: value }))} />
                  <EditableField fieldKey="annualContribution" value={rrspDetails.annualContribution} label="Annual Contribution" onUpdate={(key, value) => setRrspDetails(prev => ({ ...prev, [key]: value }))} />
                  <EditableField fieldKey="monthlyContribution" value={rrspDetails.monthlyContribution} label="Monthly Contribution" onUpdate={(key, value) => setRrspDetails(prev => ({ ...prev, [key]: value }))} />
                </div>
              </CardContent>
            </Card>

            {/* TFSA Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-500"></div>
                    <span>TFSA</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => showAssetWriteup("TFSA", "TFSA")}
                    className="border border-indigo-600 text-indigo-700 hover:bg-indigo-50 h-8 w-8 p-0 rounded-md"
                  >
                    <Bot className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Chart */}
                <div className="h-48 w-full">
                  <ChartContainer config={{}} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={tfsaChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="colorGradient-tfsa" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="yearLabel" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                        <ChartTooltip content={<ChartTooltipContent formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name === 'future' ? 'Projected Value' : 'Current Value']} />} />
                        <Area type="monotone" dataKey="future" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorGradient-tfsa)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>

                {/* Controls */}
                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Growth Rate: {tfsaRate[0]}%</label>
                    <Slider value={tfsaRate} onValueChange={setTfsaRate} max={15} min={0} step={0.1} className="w-full" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Projection Years: {tfsaYears[0]}</label>
                    <Slider value={tfsaYears} onValueChange={setTfsaYears} max={30} min={1} step={1} className="w-full" />
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <EditableField fieldKey="currentValue" value={tfsaDetails.currentValue} label="Current Value" onUpdate={(key, value) => setTfsaDetails(prev => ({ ...prev, [key]: value }))} />
                  <EditableField fieldKey="futureValue" value={Math.round(tfsaFV)} label={`Future Value (${tfsaYears[0]} years)`} isAutoCalculated={true} isEditable={false} />
                  <EditableField fieldKey="projectedGrowth" value={Math.round(tfsaFV - tfsaDetails.currentValue)} label="Projected Growth" prefix="+$" isAutoCalculated={true} isEditable={false} />
                  <EditableField fieldKey="availableRoom" value={tfsaDetails.availableRoom} label="Available Room" onUpdate={(key, value) => setTfsaDetails(prev => ({ ...prev, [key]: value }))} />
                  <EditableField fieldKey="annualContribution" value={tfsaDetails.annualContribution} label="Annual Contribution" onUpdate={(key, value) => setTfsaDetails(prev => ({ ...prev, [key]: value }))} />
                  <EditableField fieldKey="monthlyContribution" value={tfsaDetails.monthlyContribution} label="Monthly Contribution" onUpdate={(key, value) => setTfsaDetails(prev => ({ ...prev, [key]: value }))} />
                </div>
              </CardContent>
            </Card>

            {/* Non-Registered Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-500"></div>
                    <span>Non-Registered</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => showAssetWriteup("Non-Registered", "Non-Registered")}
                    className="border border-indigo-600 text-indigo-700 hover:bg-indigo-50 h-8 w-8 p-0 rounded-md"
                  >
                    <Bot className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Chart */}
                <div className="h-48 w-full">
                  <ChartContainer config={{}} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={nonRegChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="colorGradient-nonreg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="yearLabel" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                        <ChartTooltip content={<ChartTooltipContent formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name === 'future' ? 'Projected Value' : 'Current Value']} />} />
                        <Area type="monotone" dataKey="future" stroke="#f97316" fillOpacity={1} fill="url(#colorGradient-nonreg)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>

                {/* Controls */}
                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Growth Rate: {nonRegRate[0]}%</label>
                    <Slider value={nonRegRate} onValueChange={setNonRegRate} max={15} min={0} step={0.1} className="w-full" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Projection Years: {nonRegYears[0]}</label>
                    <Slider value={nonRegYears} onValueChange={setNonRegYears} max={30} min={1} step={1} className="w-full" />
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <EditableField fieldKey="totalValue" value={nonRegisteredDetails.totalValue} label="Current Value" onUpdate={(key, value) => setNonRegisteredDetails(prev => ({ ...prev, [key]: value }))} />
                    <EditableField fieldKey="futureValue" value={Math.round(nonRegFV)} label={`Future Value (${nonRegYears[0]} years)`} isAutoCalculated={true} isEditable={false} />
                    <EditableField fieldKey="costBase" value={nonRegisteredDetails.costBase} label="Cost Base" onUpdate={(key, value) => setNonRegisteredDetails(prev => ({ ...prev, [key]: value }))} />
                    <EditableField fieldKey="projectedGrowth" value={Math.round(nonRegFV - nonRegisteredDetails.totalValue)} label="Projected Growth" prefix="+$" isAutoCalculated={true} isEditable={false} />
                    <EditableField fieldKey="annualContribution" value={nonRegisteredDetails.annualContribution} label="Annual Contribution" onUpdate={(key, value) => setNonRegisteredDetails(prev => ({ ...prev, [key]: value }))} />
                    <EditableField fieldKey="monthlyContribution" value={nonRegisteredDetails.monthlyContribution} label="Monthly Contribution" onUpdate={(key, value) => setNonRegisteredDetails(prev => ({ ...prev, [key]: value }))} />
                  </div>

                  <div className="bg-muted/20 p-4 rounded-lg space-y-3">
                    <h4 className="font-medium text-sm">Capital Gains Calculation</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <EditableField fieldKey="capitalGain" value={Math.round(nonRegisteredDetails.totalValue - nonRegisteredDetails.costBase)} label="Capital Gain" isAutoCalculated={true} isEditable={false} />
                      <EditableField fieldKey="inclusionRate" value={nonRegisteredDetails.inclusionRate} label="Inclusion Rate" prefix="" suffix="%" onUpdate={(key, value) => setNonRegisteredDetails(prev => ({ ...prev, [key]: value }))} />
                      <EditableField fieldKey="taxRate" value={nonRegisteredDetails.taxRate} label="Tax Rate" prefix="" suffix="%" onUpdate={(key, value) => setNonRegisteredDetails(prev => ({ ...prev, [key]: value }))} />
                      <EditableField fieldKey="estimatedCapitalGainsTax" value={Math.round((nonRegisteredDetails.totalValue - nonRegisteredDetails.costBase) * (nonRegisteredDetails.inclusionRate / 100) * (nonRegisteredDetails.taxRate / 100))} label="Estimated Capital Gains Tax" isAutoCalculated={true} isEditable={false} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add Asset Section */}
          <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
            <h3 className="font-semibold">Add New Asset:</h3>
            <Select onValueChange={(value) => addDynamicAsset(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Primary Residence">Primary Residence</SelectItem>
                <SelectItem value="Secondary Property">Secondary Property</SelectItem>
                <SelectItem value="RRSP">RRSP</SelectItem>
                <SelectItem value="TFSA">TFSA</SelectItem>
                <SelectItem value="FHSA">FHSA</SelectItem>
                <SelectItem value="Non-Registered">Non-Registered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic Assets */}
          {dynamicAssets.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Assets</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {dynamicAssets.map((asset) => (
                  <DynamicAssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
