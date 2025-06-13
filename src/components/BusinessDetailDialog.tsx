import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2 } from "lucide-react";
import LCGEQualificationCheck from "./LCGEQualificationCheck";

interface BusinessDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Asset {
  id: string;
  name: string;
  value: number;
}

const BusinessDetailDialog = ({ open, onOpenChange }: BusinessDetailDialogProps) => {
  const [bankAccounts, setBankAccounts] = useState<Asset[]>([
    { id: "1", name: "Business Checking", value: 45000 },
    { id: "2", name: "Business Savings", value: 125000 }
  ]);
  
  const [investments, setInvestments] = useState<Asset[]>([
    { id: "1", name: "GIC Portfolio", value: 200000 },
    { id: "2", name: "Corporate Bonds", value: 150000 }
  ]);
  
  const [realEstate, setRealEstate] = useState<Asset[]>([
    { id: "1", name: "Office Building", value: 850000 },
    { id: "2", name: "Warehouse", value: 650000 }
  ]);

  const [newAsset, setNewAsset] = useState({ name: "", value: 0 });
  const [editingAsset, setEditingAsset] = useState<{ type: string; id: string; name: string; value: number } | null>(null);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const getTotalValue = (assets: Asset[]) => {
    return assets.reduce((sum, asset) => sum + asset.value, 0);
  };

  const addAsset = (type: 'bank' | 'investment' | 'realEstate') => {
    if (!newAsset.name || newAsset.value <= 0) return;
    
    const asset = {
      id: Date.now().toString(),
      name: newAsset.name,
      value: newAsset.value
    };

    if (type === 'bank') {
      setBankAccounts([...bankAccounts, asset]);
    } else if (type === 'investment') {
      setInvestments([...investments, asset]);
    } else {
      setRealEstate([...realEstate, asset]);
    }
    
    setNewAsset({ name: "", value: 0 });
  };

  const deleteAsset = (type: 'bank' | 'investment' | 'realEstate', id: string) => {
    if (type === 'bank') {
      setBankAccounts(bankAccounts.filter(asset => asset.id !== id));
    } else if (type === 'investment') {
      setInvestments(investments.filter(asset => asset.id !== id));
    } else {
      setRealEstate(realEstate.filter(asset => asset.id !== id));
    }
  };

  const startEdit = (type: string, asset: Asset) => {
    setEditingAsset({ type, id: asset.id, name: asset.name, value: asset.value });
  };

  const saveEdit = () => {
    if (!editingAsset) return;
    
    const updatedAsset = { 
      id: editingAsset.id, 
      name: editingAsset.name, 
      value: editingAsset.value 
    };

    if (editingAsset.type === 'bank') {
      setBankAccounts(bankAccounts.map(asset => 
        asset.id === editingAsset.id ? updatedAsset : asset
      ));
    } else if (editingAsset.type === 'investment') {
      setInvestments(investments.map(asset => 
        asset.id === editingAsset.id ? updatedAsset : asset
      ));
    } else {
      setRealEstate(realEstate.map(asset => 
        asset.id === editingAsset.id ? updatedAsset : asset
      ));
    }
    
    setEditingAsset(null);
  };

  const AssetSection = ({ 
    title, 
    assets, 
    type 
  }: { 
    title: string; 
    assets: Asset[]; 
    type: 'bank' | 'investment' | 'realEstate' 
  }) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="outline">{formatCurrency(getTotalValue(assets))}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {assets.map((asset) => (
          <div key={asset.id} className="flex justify-between items-center p-3 border rounded-lg">
            {editingAsset?.id === asset.id ? (
              <div className="flex-1 flex gap-2">
                <Input
                  value={editingAsset.name}
                  onChange={(e) => setEditingAsset({...editingAsset, name: e.target.value})}
                  placeholder="Asset name"
                  className="flex-1"
                />
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-gray-500">
                    $
                  </div>
                  <Input
                    type="number"
                    value={editingAsset.value}
                    onChange={(e) => setEditingAsset({...editingAsset, value: Number(e.target.value)})}
                    className="pl-8 w-32"
                  />
                </div>
                <Button onClick={saveEdit} size="sm">Save</Button>
                <Button 
                  onClick={() => setEditingAsset(null)} 
                  variant="outline" 
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <div className="font-medium">{asset.name}</div>
                  <div className="text-sm text-gray-600">{formatCurrency(asset.value)}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(type, asset)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAsset(type, asset.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
        
        <div className="flex gap-2 pt-2 border-t">
          <Input
            placeholder="Asset name"
            value={newAsset.name}
            onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
            className="flex-1"
          />
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-gray-500">
              $
            </div>
            <Input
              type="number"
              placeholder="Value"
              value={newAsset.value || ""}
              onChange={(e) => setNewAsset({...newAsset, value: Number(e.target.value)})}
              className="pl-8 w-32"
            />
          </div>
          <Button onClick={() => addAsset(type)} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const [revenue, setRevenue] = useState<number>(500000);
  const [expenses, setExpenses] = useState<number>(350000);
  const [netIncome, setNetIncome] = useState<number>(revenue - expenses);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Business Details</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="financial" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="financial">Financial Details</TabsTrigger>
            <TabsTrigger value="coverage">Coverage Analysis</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="revenue">Revenue</Label>
                  <Input
                    type="number"
                    id="revenue"
                    value={revenue}
                    onChange={(e) => {
                      const newRevenue = Number(e.target.value);
                      setRevenue(newRevenue);
                      setNetIncome(newRevenue - expenses);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="expenses">Expenses</Label>
                  <Input
                    type="number"
                    id="expenses"
                    value={expenses}
                    onChange={(e) => {
                      const newExpenses = Number(e.target.value);
                      setExpenses(newExpenses);
                      setNetIncome(revenue - newExpenses);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="netIncome">Net Income</Label>
                  <Input
                    type="number"
                    id="netIncome"
                    value={netIncome}
                    readOnly
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="coverage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Coverage Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Coverage analysis content goes here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <div className="grid gap-6">
              <LCGEQualificationCheck />
              
              <div className="grid gap-4">
                <AssetSection 
                  title="Bank Accounts" 
                  assets={bankAccounts} 
                  type="bank" 
                />
                <AssetSection 
                  title="Investments" 
                  assets={investments} 
                  type="investment" 
                />
                <AssetSection 
                  title="Real Estate" 
                  assets={realEstate} 
                  type="realEstate" 
                />
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Total Assets Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Bank Accounts</div>
                      <div className="font-semibold">{formatCurrency(getTotalValue(bankAccounts))}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Investments</div>
                      <div className="font-semibold">{formatCurrency(getTotalValue(investments))}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Real Estate</div>
                      <div className="font-semibold">{formatCurrency(getTotalValue(realEstate))}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Assets</div>
                      <div className="font-bold text-lg text-blue-600">
                        {formatCurrency(getTotalValue(bankAccounts) + getTotalValue(investments) + getTotalValue(realEstate))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessDetailDialog;
