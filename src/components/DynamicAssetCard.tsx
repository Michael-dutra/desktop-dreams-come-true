
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Copy, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GrowthChart } from "./GrowthChart";
import { AssetControlSliders } from "./AssetControlSliders";
import { calculateFV, generateStableChartData } from "../utils/assetUtils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DynamicAssetCardProps {
  asset: {
    id: string;
    name: string;
    type: string;
    currentValue: number;
    monthlyContribution: number;
    growthRate: number;
    years: number;
    purchasePrice?: number;
    capitalImprovements?: number;
    propertyName?: string;
  };
  onDelete: (id: string) => void;
  onCopy: (asset: any) => void;
  onUpdate: (id: string, updates: any) => void;
}

export const DynamicAssetCard = ({ asset, onDelete, onCopy, onUpdate }: DynamicAssetCardProps) => {
  const [growthRate, setGrowthRate] = useState([asset.growthRate]);
  const [projectionYears, setProjectionYears] = useState([asset.years]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const futureValue = calculateFV(asset.currentValue, growthRate[0], projectionYears[0], asset.monthlyContribution * 12);
  const chartData = generateStableChartData(asset.currentValue, futureValue, projectionYears[0], growthRate[0]);

  const handleFieldUpdate = (field: string, value: any) => {
    onUpdate(asset.id, { [field]: value });
  };

  // Calculate capital gains for secondary properties
  const calculateCapitalGains = () => {
    if (asset.type !== "Secondary Properties" || !asset.purchasePrice) return 0;
    
    const capitalGain = futureValue - (asset.purchasePrice + (asset.capitalImprovements || 0));
    const taxableGain = capitalGain * 0.5; // 50% inclusion rate
    const taxRate = 0.25; // Default 25% tax rate, should be adjustable
    return taxableGain * taxRate;
  };

  const capitalGainsTax = calculateCapitalGains();

  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">{asset.name}</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCopy(asset)}
            className="text-blue-600 hover:text-blue-700"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <AlertDialogTitle>Delete Asset</AlertDialogTitle>
                </div>
                <AlertDialogDescription>
                  Are you sure you want to delete "{asset.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onDelete(asset.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Property Name for Secondary Properties */}
        {asset.type === "Secondary Properties" && (
          <div>
            <Label htmlFor={`property-name-${asset.id}`}>Property Name</Label>
            <Input
              id={`property-name-${asset.id}`}
              value={asset.propertyName || ""}
              onChange={(e) => handleFieldUpdate("propertyName", e.target.value)}
              placeholder="Enter property name"
            />
          </div>
        )}

        {/* Current Value */}
        <div>
          <Label htmlFor={`current-value-${asset.id}`}>Current Value</Label>
          <Input
            id={`current-value-${asset.id}`}
            type="number"
            value={asset.currentValue}
            onChange={(e) => handleFieldUpdate("currentValue", Number(e.target.value))}
          />
        </div>

        {/* Real Estate specific fields */}
        {asset.type === "Secondary Properties" && (
          <>
            <div>
              <Label htmlFor={`purchase-price-${asset.id}`}>Purchase Price</Label>
              <Input
                id={`purchase-price-${asset.id}`}
                type="number"
                value={asset.purchasePrice || 0}
                onChange={(e) => handleFieldUpdate("purchasePrice", Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor={`capital-improvements-${asset.id}`}>Capital Improvements</Label>
              <Input
                id={`capital-improvements-${asset.id}`}
                type="number"
                value={asset.capitalImprovements || 0}
                onChange={(e) => handleFieldUpdate("capitalImprovements", Number(e.target.value))}
              />
            </div>
          </>
        )}

        {/* Monthly Contribution */}
        <div>
          <Label htmlFor={`monthly-contribution-${asset.id}`}>Monthly Contribution</Label>
          <Input
            id={`monthly-contribution-${asset.id}`}
            type="number"
            value={asset.monthlyContribution}
            onChange={(e) => handleFieldUpdate("monthlyContribution", Number(e.target.value))}
          />
        </div>

        {/* Control Sliders */}
        <AssetControlSliders
          growthRate={growthRate}
          setGrowthRate={(value) => {
            setGrowthRate(value);
            handleFieldUpdate("growthRate", value[0]);
          }}
          projectionYears={projectionYears}
          setProjectionYears={(value) => {
            setProjectionYears(value);
            handleFieldUpdate("years", value[0]);
          }}
        />

        {/* Growth Chart */}
        <GrowthChart
          data={chartData}
          currentValue={asset.currentValue}
          futureValue={futureValue}
          years={projectionYears[0]}
          color="#10b981"
        />

        {/* Projections */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Future Value:</span>
            <span className="font-semibold">${futureValue.toLocaleString()}</span>
          </div>
          
          {/* Capital Gains Tax for Secondary Properties */}
          {asset.type === "Secondary Properties" && capitalGainsTax > 0 && (
            <>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Capital Gain:</span>
                <span className="font-semibold">
                  ${(futureValue - (asset.purchasePrice || 0) - (asset.capitalImprovements || 0)).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Capital Gains Tax (50% × 25%):</span>
                <span className="font-semibold text-red-600">${capitalGainsTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium">Net After Tax:</span>
                <span className="font-bold">${(futureValue - capitalGainsTax).toLocaleString()}</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
