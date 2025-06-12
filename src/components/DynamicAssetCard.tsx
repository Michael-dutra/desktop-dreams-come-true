
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { TrendingUp, X, AlertTriangle, Edit2, Check } from "lucide-react";
import { useState, useMemo } from "react";
import { GrowthChart } from "./GrowthChart";
import { AssetControlSliders } from "./AssetControlSliders";
import { calculateFV, generateStableChartData } from "../utils/assetUtils";

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
  propertyName?: string;
  capitalImprovements?: number;
  taxRate?: number;
  isPrimaryResidence?: boolean;
  // RRSP/TFSA specific fields
  availableRoom?: number;
  ytdGrowth?: number;
  monthlyContribution?: number;
  // Non-Registered specific fields
  unrealizedGains?: number;
}

interface DynamicAssetCardProps {
  asset: DynamicAsset;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<DynamicAsset>) => void;
}

export const DynamicAssetCard = ({ asset, onRemove, onUpdate }: DynamicAssetCardProps) => {
  const futureValue = calculateFV(asset.currentValue, asset.rate[0], asset.years[0], asset.annualContribution);
  const chartData = useMemo(() => {
    return generateStableChartData(asset.currentValue, futureValue, asset.years[0], asset.rate[0]);
  }, [asset.currentValue, futureValue, asset.years[0], asset.rate[0]]);

  // Editable field component for dynamic assets
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
        onUpdate(asset.id, { [fieldKey]: numericValue });
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

  // Editable text field for property names
  const EditableTextField = ({ 
    fieldKey, 
    value, 
    label 
  }: { 
    fieldKey: string; 
    value: string; 
    label: string; 
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState("");

    const startEdit = () => {
      setIsEditing(true);
      setTempValue(value);
    };

    const cancelEdit = () => {
      setIsEditing(false);
      setTempValue("");
    };

    const saveEdit = () => {
      if (tempValue.trim()) {
        onUpdate(asset.id, { [fieldKey]: tempValue.trim() });
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
            <p className="font-semibold text-lg text-foreground">{value}</p>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={startEdit}
              className="opacity-50 hover:opacity-100"
            >
              <Edit2 className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderAssetSpecificFields = () => {
    const assumedAnnualIncome = 80000;

    switch (asset.type) {
      case "Primary Residence":
      case "Secondary Properties":
        const netEquity = asset.currentValue - (asset.mortgageBalance || 0);
        const totalCostBase = (asset.purchasePrice || 0) + (asset.capitalImprovements || 0);
        const futureCapitalGain = asset.isPrimaryResidence ? 0 : Math.max(0, futureValue - totalCostBase);
        const futureCapitalGainsTax = asset.isPrimaryResidence ? 0 : futureCapitalGain * (asset.taxRate || 0) / 100 * 0.5; // 50% inclusion rate
        
        return (
          <div className="space-y-4">
            {/* Property Name */}
            <EditableTextField
              fieldKey="propertyName"
              value={asset.propertyName || "Property"}
              label="Property Name"
            />
            
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
                fieldKey="capitalImprovements" 
                value={asset.capitalImprovements || 0} 
                label="Capital Improvements" 
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
              
              {!asset.isPrimaryResidence && (
                <>
                  <DynamicEditableField 
                    fieldKey="futureCapitalGain" 
                    value={Math.round(futureCapitalGain)} 
                    label="Future Capital Gain" 
                    prefix="+$"
                    isAutoCalculated={true}
                    isEditable={false}
                    tip="Based on future value minus total cost base"
                  />
                  <DynamicEditableField 
                    fieldKey="taxRate" 
                    value={asset.taxRate || 0} 
                    label="Tax Rate" 
                    prefix=""
                    suffix="%"
                    tip="Marginal tax rate for capital gains"
                  />
                  <DynamicEditableField 
                    fieldKey="futureCapitalGainsTax" 
                    value={Math.round(futureCapitalGainsTax)} 
                    label="Future Capital Gains Tax" 
                    prefix="$"
                    isAutoCalculated={true}
                    isEditable={false}
                    tip="50% of capital gain taxed at marginal rate"
                  />
                </>
              )}
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
              tip={`If maxed out, worth $${Math.round((asset.availableRoom || 0) * Math.pow(1.07, 10)).toLocaleString()} in 10 years at 7%`}
            />
            <DynamicEditableField 
              fieldKey="annualContribution" 
              value={asset.annualContribution} 
              label="Annual Contribution" 
              tip={`${(asset.annualContribution / assumedAnnualIncome * 100).toFixed(1)}% of gross annual income`}
            />
            <DynamicEditableField 
              fieldKey="monthlyContribution" 
              value={asset.monthlyContribution || 0} 
              label="Monthly Contribution" 
              tip={`${(((asset.monthlyContribution || 0) * 12) / assumedAnnualIncome * 100).toFixed(1)}% of gross annual income`}
            />
          </div>
        );

      case "TFSA":
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
              tip={`If maxed out, worth $${Math.round((asset.availableRoom || 0) * Math.pow(1.065, 10)).toLocaleString()} in 10 years at 6.5%`}
            />
            <DynamicEditableField 
              fieldKey="annualContribution" 
              value={asset.annualContribution} 
              label="Annual Contribution" 
              tip={`${(asset.annualContribution / assumedAnnualIncome * 100).toFixed(1)}% of gross annual income`}
            />
            <DynamicEditableField 
              fieldKey="monthlyContribution" 
              value={asset.monthlyContribution || 0} 
              label="Monthly Contribution" 
              tip={`${(((asset.monthlyContribution || 0) * 12) / assumedAnnualIncome * 100).toFixed(1)}% of gross annual income`}
            />
          </div>
        );

      case "Non-Registered":
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
              fieldKey="unrealizedGains" 
              value={asset.unrealizedGains || 0} 
              label="Unrealized Gains" 
              prefix="+$"
              tip={`${(((asset.unrealizedGains || 0) / asset.currentValue) * 100).toFixed(1)}% of total value`}
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
              tip={`${(asset.annualContribution / assumedAnnualIncome * 100).toFixed(1)}% of gross annual income`}
            />
            <DynamicEditableField 
              fieldKey="monthlyContribution" 
              value={asset.monthlyContribution || 0} 
              label="Monthly Contribution" 
            />
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
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Delete Asset
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{asset.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onRemove(asset.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
        <AssetControlSliders
          growthRate={asset.rate}
          setGrowthRate={(value) => onUpdate(asset.id, { rate: value })}
          projectionYears={asset.years}
          setProjectionYears={(value) => onUpdate(asset.id, { years: value })}
        />

        {/* Asset-specific fields */}
        {renderAssetSpecificFields()}
        
        {/* Additional asset-specific info */}
        {(asset.type === "Primary Residence" || asset.type === "Secondary Properties") && asset.address && (
          <div className="pt-2">
            <p className="text-xs text-muted-foreground mb-1">Address: {asset.address}</p>
            <p className="text-xs font-medium">
              {asset.isPrimaryResidence ? (
                <span className="text-green-600">Primary Residence (No Capital Gains Tax)</span>
              ) : (
                <span className="text-orange-600">Investment Property (Subject to Capital Gains Tax)</span>
              )}
            </p>
          </div>
        )}
        
        {(asset.type === "RRSP" || asset.type === "TFSA" || asset.type === "Non-Registered") && (
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
