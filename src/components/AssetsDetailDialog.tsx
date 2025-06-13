
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AssetCard } from "./AssetCard";
import { useToast } from "@/hooks/use-toast";

interface Asset {
  id: string;
  name: string;
  currentValue: number;
  originalValue?: number;
  rateOfReturn: number;
  inclusionRate?: number;
  taxRate?: number;
}

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssetsDetailDialog = ({ isOpen, onClose }: AssetsDetailDialogProps) => {
  const { toast } = useToast();

  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "real-estate",
      name: "Real Estate",
      currentValue: 620000,
      rateOfReturn: 7
    },
    {
      id: "rrsp",
      name: "RRSP",
      currentValue: 52000,
      rateOfReturn: 7
    },
    {
      id: "tfsa",
      name: "TFSA",
      currentValue: 38000,
      rateOfReturn: 7
    },
    {
      id: "non-registered",
      name: "Non-Registered",
      currentValue: 25000,
      originalValue: 20000,
      rateOfReturn: 7,
      inclusionRate: 50,
      taxRate: 25
    }
  ]);

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets(prev => prev.map(asset => 
      asset.id === id ? { ...asset, ...updates } : asset
    ));
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const addAsset = (assetType: string) => {
    if (!assetType) return;

    const newId = `${assetType.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const isNonRegistered = assetType === "Non-Registered";
    
    const newAsset: Asset = {
      id: newId,
      name: assetType,
      currentValue: 10000,
      rateOfReturn: 7,
      ...(isNonRegistered && {
        originalValue: 8000,
        inclusionRate: 50,
        taxRate: 25
      })
    };

    setAssets(prev => [...prev, newAsset]);
  };

  const generateAssetReport = (asset: Asset) => {
    // Placeholder for report generation
    toast({
      title: "Report Generated",
      description: `Report for ${asset.name} has been generated.`,
    });
  };

  // Calculate totals
  const totalCurrentValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Assets</DialogTitle>
        </DialogHeader>

        {/* Assets Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Assets Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="font-bold text-2xl text-blue-600">
                  ${totalCurrentValue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Individual Asset Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {assets.map(asset => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onUpdate={updateAsset}
              onDelete={deleteAsset}
              onGenerateReport={generateAssetReport}
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
                  <Select value="" onValueChange={addAsset}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RRSP">RRSP</SelectItem>
                      <SelectItem value="TFSA">TFSA</SelectItem>
                      <SelectItem value="Non-Registered">Non-Registered</SelectItem>
                      <SelectItem value="Real Estate">Real Estate</SelectItem>
                      <SelectItem value="Investment">Investment</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
