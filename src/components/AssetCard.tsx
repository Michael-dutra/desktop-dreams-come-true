
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { X, FileText } from "lucide-react";
import { CapitalGainsSection } from "./CapitalGainsSection";

interface Asset {
  id: string;
  name: string;
  currentValue: number;
  originalValue?: number;
  rateOfReturn: number;
  inclusionRate?: number;
  taxRate?: number;
}

interface AssetCardProps {
  asset: Asset;
  onUpdate: (id: string, updates: Partial<Asset>) => void;
  onDelete: (id: string) => void;
  onGenerateReport?: (asset: Asset) => void;
}

export const AssetCard = ({ asset, onUpdate, onDelete, onGenerateReport }: AssetCardProps) => {
  const isNonRegistered = asset.name === "Non-Registered" || asset.id.includes("non-registered");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl">
          <span>{asset.name}</span>
          <div className="flex items-center gap-2">
            {onGenerateReport && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onGenerateReport(asset)}
                className="text-blue-600 hover:bg-blue-50 p-1"
              >
                <FileText className="w-4 h-4" />
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 hover:bg-red-50 p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove the {asset.name} from your assets. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(asset.id)} className="bg-red-600 hover:bg-red-700">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 p-4 rounded-lg bg-gray-50">
          <h4 className="font-semibold mb-3">Asset Details</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium">Current Value</Label>
              <Input
                type="number"
                value={asset.currentValue}
                onChange={(e) => onUpdate(asset.id, { currentValue: Number(e.target.value) })}
                className="mt-1"
              />
            </div>
            {isNonRegistered && (
              <div>
                <Label className="text-sm font-medium">Original Value</Label>
                <Input
                  type="number"
                  value={asset.originalValue || 0}
                  onChange={(e) => onUpdate(asset.id, { originalValue: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Rate of Return: {asset.rateOfReturn}%</label>
            <Slider
              value={[asset.rateOfReturn]}
              onValueChange={(value) => onUpdate(asset.id, { rateOfReturn: value[0] })}
              max={15}
              min={1}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>

        {isNonRegistered && (
          <CapitalGainsSection
            originalValue={asset.originalValue || 0}
            currentValue={asset.currentValue}
            inclusionRate={asset.inclusionRate || 50}
            taxRate={asset.taxRate || 25}
            onInclusionRateChange={(value) => onUpdate(asset.id, { inclusionRate: value })}
            onTaxRateChange={(value) => onUpdate(asset.id, { taxRate: value })}
          />
        )}
      </CardContent>
    </Card>
  );
};
