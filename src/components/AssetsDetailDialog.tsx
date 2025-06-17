import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Edit3 } from "lucide-react";
import { useFinancialData, Asset } from "@/contexts/FinancialDataContext";

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const assetTypeToCategory = {
  "Real Estate": "real-estate" as const,
  "RRSP": "retirement" as const,
  "TFSA": "retirement" as const,
  "FHSA": "retirement" as const,
  "Non-Registered": "investment" as const,
  "Digital Asset": "investment" as const,
  "Business": "business" as const,
  "Other": "other" as const,
};

const assetTypeColors = {
  "Real Estate": "#3b82f6",
  "RRSP": "#10b981",
  "TFSA": "#8b5cf6",
  "FHSA": "#06b6d4",
  "Non-Registered": "#f59e0b",
  "Digital Asset": "#ef4444",
  "Business": "#84cc16",
  "Other": "#6b7280",
};

const retirementEligibleTypes = ["RRSP", "TFSA", "FHSA", "Non-Registered"];

export const AssetsDetailDialog: React.FC<AssetsDetailDialogProps> = ({ isOpen, onClose }) => {
  const { assets, addAsset, updateAsset, removeAsset } = useFinancialData();
  const [editingAsset, setEditingAsset] = useState<string | null>(null);
  const [newAsset, setNewAsset] = useState({
    name: "",
    type: "",
    value: "",
  });

  const handleAddAsset = () => {
    if (newAsset.name && newAsset.type && newAsset.value) {
      const value = parseFloat(newAsset.value.replace(/[,$]/g, ''));
      const asset: Asset = {
        id: Date.now().toString(),
        name: newAsset.name,
        amount: `$${value.toLocaleString()}`,
        value: value,
        color: assetTypeColors[newAsset.type as keyof typeof assetTypeColors] || "#6b7280",
        category: assetTypeToCategory[newAsset.type as keyof typeof assetTypeToCategory] || "other",
        isRetirementEligible: retirementEligibleTypes.includes(newAsset.type),
      };
      
      addAsset(asset);
      setNewAsset({ name: "", type: "", value: "" });
    }
  };

  const handleUpdateAsset = (assetId: string, field: string, value: string) => {
    if (field === 'value') {
      const numericValue = parseFloat(value.replace(/[,$]/g, ''));
      updateAsset(assetId, {
        value: numericValue,
        amount: `$${numericValue.toLocaleString()}`
      });
    } else if (field === 'name') {
      updateAsset(assetId, { name: value });
    }
  };

  const handleDeleteAsset = (assetId: string) => {
    removeAsset(assetId);
  };

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Asset Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(totalAssets)}
              </div>
              <p className="text-gray-600">Total Assets</p>
            </CardContent>
          </Card>

          {/* Add New Asset */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Asset
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="asset-name">Asset Name</Label>
                  <Input
                    id="asset-name"
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    placeholder="e.g., Primary Residence"
                  />
                </div>
                <div>
                  <Label htmlFor="asset-type">Type</Label>
                  <Select value={newAsset.type} onValueChange={(value) => setNewAsset({ ...newAsset, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Real Estate">Real Estate</SelectItem>
                      <SelectItem value="RRSP">RRSP</SelectItem>
                      <SelectItem value="TFSA">TFSA</SelectItem>
                      <SelectItem value="FHSA">FHSA</SelectItem>
                      <SelectItem value="Non-Registered">Non-Registered</SelectItem>
                      <SelectItem value="Digital Asset">Digital Asset</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="asset-value">Value</Label>
                  <Input
                    id="asset-value"
                    value={newAsset.value}
                    onChange={(e) => setNewAsset({ ...newAsset, value: e.target.value })}
                    placeholder="e.g., 650000"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddAsset} className="w-full">
                    Add Asset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Existing Assets */}
          <Card>
            <CardHeader>
              <CardTitle>Current Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4 flex-1">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: asset.color }}
                      />
                      <div className="flex-1">
                        {editingAsset === asset.id ? (
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              value={asset.name}
                              onChange={(e) => handleUpdateAsset(asset.id, 'name', e.target.value)}
                              onBlur={() => setEditingAsset(null)}
                              autoFocus
                            />
                            <Input
                              value={asset.value.toString()}
                              onChange={(e) => handleUpdateAsset(asset.id, 'value', e.target.value)}
                              onBlur={() => setEditingAsset(null)}
                            />
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <span className="font-medium">{asset.name}</span>
                            <span className="font-bold text-green-600">{formatCurrency(asset.value)}</span>
                          </div>
                        )}
                        <div className="text-sm text-gray-500 mt-1">
                          {asset.category.charAt(0).toUpperCase() + asset.category.slice(1).replace('-', ' ')}
                          {asset.isRetirementEligible && " • Retirement Eligible"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingAsset(asset.id)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAsset(asset.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {assets.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No assets added yet. Use the form above to add your first asset.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
