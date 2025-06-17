
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssetsDetailDialog = ({ isOpen, onClose }: AssetsDetailDialogProps) => {
  const { assets, addAsset, updateAsset, removeAsset, getTotalAssets } = useFinancialData();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<string | null>(null);
  
  // New asset form state
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetValue, setNewAssetValue] = useState("");
  const [newAssetCategory, setNewAssetCategory] = useState<"retirement" | "investment" | "real-estate" | "business" | "other">("investment");
  const [newAssetTaxStatus, setNewAssetTaxStatus] = useState<"fully-taxable" | "capital-gains" | "tax-free">("fully-taxable");
  const [newAssetRetirementEligible, setNewAssetRetirementEligible] = useState(false);
  const [newAssetAcquisitionCost, setNewAssetAcquisitionCost] = useState("");

  // Editing form state
  const [editName, setEditName] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editCategory, setEditCategory] = useState<"retirement" | "investment" | "real-estate" | "business" | "other">("investment");
  const [editTaxStatus, setEditTaxStatus] = useState<"fully-taxable" | "capital-gains" | "tax-free">("fully-taxable");
  const [editRetirementEligible, setEditRetirementEligible] = useState(false);
  const [editAcquisitionCost, setEditAcquisitionCost] = useState("");

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#f97316", "#06b6d4", "#84cc16"];

  const getNextColor = () => {
    const usedColors = assets.map(asset => asset.color);
    return colors.find(color => !usedColors.includes(color)) || colors[0];
  };

  const handleAddAsset = () => {
    if (!newAssetName || !newAssetValue) return;

    const value = parseFloat(newAssetValue);
    if (isNaN(value)) return;

    const newAsset = {
      id: Date.now().toString(),
      name: newAssetName,
      amount: `$${value.toLocaleString()}`,
      value: value,
      color: getNextColor(),
      category: newAssetCategory,
      isRetirementEligible: newAssetRetirementEligible,
      taxStatus: newAssetTaxStatus,
      acquisitionCost: newAssetAcquisitionCost ? parseFloat(newAssetAcquisitionCost) : undefined
    };

    addAsset(newAsset);
    
    // Reset form
    setNewAssetName("");
    setNewAssetValue("");
    setNewAssetCategory("investment");
    setNewAssetTaxStatus("fully-taxable");
    setNewAssetRetirementEligible(false);
    setNewAssetAcquisitionCost("");
    setShowAddForm(false);
  };

  const handleStartEdit = (asset: any) => {
    setEditingAsset(asset.id);
    setEditName(asset.name);
    setEditValue(asset.value.toString());
    setEditCategory(asset.category);
    setEditTaxStatus(asset.taxStatus || "fully-taxable");
    setEditRetirementEligible(asset.isRetirementEligible);
    setEditAcquisitionCost(asset.acquisitionCost?.toString() || "");
  };

  const handleSaveEdit = () => {
    if (!editName || !editValue || !editingAsset) return;

    const value = parseFloat(editValue);
    if (isNaN(value)) return;

    updateAsset(editingAsset, {
      name: editName,
      amount: `$${value.toLocaleString()}`,
      value: value,
      category: editCategory,
      taxStatus: editTaxStatus,
      isRetirementEligible: editRetirementEligible,
      acquisitionCost: editAcquisitionCost ? parseFloat(editAcquisitionCost) : undefined
    });

    setEditingAsset(null);
  };

  const handleCancelEdit = () => {
    setEditingAsset(null);
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${Math.round(value).toLocaleString()}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'retirement': return 'bg-blue-100 text-blue-800';
      case 'investment': return 'bg-green-100 text-green-800';
      case 'real-estate': return 'bg-orange-100 text-orange-800';
      case 'business': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaxStatusColor = (taxStatus: string) => {
    switch (taxStatus) {
      case 'tax-free': return 'bg-green-100 text-green-800';
      case 'capital-gains': return 'bg-yellow-100 text-yellow-800';
      case 'fully-taxable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assets Detail</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Assets Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(getTotalAssets())}
                  </div>
                  <p className="text-sm text-blue-600">Total Assets</p>
                </div>
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {assets.length}
                  </div>
                  <p className="text-sm text-green-600">Total Items</p>
                </div>
                <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {assets.filter(a => a.isRetirementEligible).length}
                  </div>
                  <p className="text-sm text-orange-600">Retirement Assets</p>
                </div>
                <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(assets.filter(a => a.isRetirementEligible).reduce((sum, a) => sum + a.value, 0))}
                  </div>
                  <p className="text-sm text-purple-600">Retirement Value</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assets List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Assets</CardTitle>
              <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Asset
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {assets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No assets added yet. Click "Add Asset" to get started.</p>
                </div>
              ) : (
                assets.map((asset) => (
                  <div key={asset.id} className="p-4 border rounded-lg">
                    {editingAsset === asset.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Asset Name</Label>
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              placeholder="Asset name"
                            />
                          </div>
                          <div>
                            <Label>Current Value</Label>
                            <Input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              placeholder="Current value"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Category</Label>
                            <Select value={editCategory} onValueChange={(value: any) => setEditCategory(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="retirement">Retirement</SelectItem>
                                <SelectItem value="investment">Investment</SelectItem>
                                <SelectItem value="real-estate">Real Estate</SelectItem>
                                <SelectItem value="business">Business</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Tax Status</Label>
                            <Select value={editTaxStatus} onValueChange={(value: any) => setEditTaxStatus(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="tax-free">Tax Free</SelectItem>
                                <SelectItem value="capital-gains">Capital Gains</SelectItem>
                                <SelectItem value="fully-taxable">Fully Taxable</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Acquisition Cost (Optional)</Label>
                            <Input
                              type="number"
                              value={editAcquisitionCost}
                              onChange={(e) => setEditAcquisitionCost(e.target.value)}
                              placeholder="Original purchase price"
                            />
                          </div>
                          <div className="flex items-center space-x-2 pt-6">
                            <input
                              type="checkbox"
                              id={`edit-retirement-${asset.id}`}
                              checked={editRetirementEligible}
                              onChange={(e) => setEditRetirementEligible(e.target.checked)}
                            />
                            <Label htmlFor={`edit-retirement-${asset.id}`}>Retirement Eligible</Label>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSaveEdit} size="sm">
                            <Check className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button onClick={handleCancelEdit} variant="outline" size="sm">
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: asset.color }}
                          />
                          <div>
                            <h3 className="font-semibold text-lg">{asset.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(asset.category)}`}>
                                {asset.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaxStatusColor(asset.taxStatus || 'fully-taxable')}`}>
                                {(asset.taxStatus || 'fully-taxable').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                              {asset.isRetirementEligible && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Retirement
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-xl font-bold">{formatCurrency(asset.value)}</div>
                            {asset.acquisitionCost && (
                              <div className="text-sm text-gray-500">
                                Cost: {formatCurrency(asset.acquisitionCost)}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStartEdit(asset)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeAsset(asset.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}

              {/* Add Asset Form */}
              {showAddForm && (
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Add New Asset</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Asset Name</Label>
                        <Input
                          value={newAssetName}
                          onChange={(e) => setNewAssetName(e.target.value)}
                          placeholder="e.g., Primary Residence, RRSP, etc."
                        />
                      </div>
                      <div>
                        <Label>Current Value</Label>
                        <Input
                          type="number"
                          value={newAssetValue}
                          onChange={(e) => setNewAssetValue(e.target.value)}
                          placeholder="Current market value"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Category</Label>
                        <Select value={newAssetCategory} onValueChange={(value: any) => setNewAssetCategory(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="retirement">Retirement</SelectItem>
                            <SelectItem value="investment">Investment</SelectItem>
                            <SelectItem value="real-estate">Real Estate</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Tax Status</Label>
                        <Select value={newAssetTaxStatus} onValueChange={(value: any) => setNewAssetTaxStatus(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tax-free">Tax Free</SelectItem>
                            <SelectItem value="capital-gains">Capital Gains</SelectItem>
                            <SelectItem value="fully-taxable">Fully Taxable</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Acquisition Cost (Optional)</Label>
                        <Input
                          type="number"
                          value={newAssetAcquisitionCost}
                          onChange={(e) => setNewAssetAcquisitionCost(e.target.value)}
                          placeholder="Original purchase price"
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <input
                          type="checkbox"
                          id="new-retirement-eligible"
                          checked={newAssetRetirementEligible}
                          onChange={(e) => setNewAssetRetirementEligible(e.target.checked)}
                        />
                        <Label htmlFor="new-retirement-eligible">Retirement Eligible</Label>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddAsset}>Add Asset</Button>
                      <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                    </div>
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
