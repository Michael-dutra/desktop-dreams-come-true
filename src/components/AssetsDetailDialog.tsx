
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, TrendingUp, Calculator, FileText, Trash2, AlertTriangle } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Asset {
  name: string;
  amount: string;
  value: number;
  color: string;
}

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
}

interface RRIFInputs {
  currentValue: number;
  rateOfReturn: number;
  timeHorizon: number;
  currentAge: number;
}

const AssetsDetailDialog = ({ isOpen, onClose, assets }: AssetsDetailDialogProps) => {
  const [localAssets, setLocalAssets] = useState<Asset[]>(assets);
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetValue, setNewAssetValue] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  
  // RRIF-specific states
  const [rrifInputs, setRrifInputs] = useState<RRIFInputs>({
    currentValue: 100000,
    rateOfReturn: 6,
    timeHorizon: 20,
    currentAge: 65
  });

  const addAsset = () => {
    if (newAssetName && newAssetValue) {
      const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];
      const newAsset: Asset = {
        name: newAssetName,
        amount: `$${parseInt(newAssetValue).toLocaleString()}`,
        value: parseInt(newAssetValue),
        color: colors[localAssets.length % colors.length]
      };
      setLocalAssets([...localAssets, newAsset]);
      setNewAssetName("");
      setNewAssetValue("");
    }
  };

  const deleteAsset = (assetName: string) => {
    setAssetToDelete(assetName);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (assetToDelete) {
      console.log("Delete confirmed for asset:", assetToDelete);
      setLocalAssets(localAssets.filter(asset => asset.name !== assetToDelete));
      setDeleteConfirmOpen(false);
      setAssetToDelete(null);
    }
  };

  const calculateMinimumWithdrawal = (age: number, balance: number): number => {
    const withdrawalRates: { [key: number]: number } = {
      71: 0.0528, 72: 0.0540, 73: 0.0553, 74: 0.0567, 75: 0.0582,
      76: 0.0598, 77: 0.0617, 78: 0.0636, 79: 0.0658, 80: 0.0682,
      81: 0.0708, 82: 0.0738, 83: 0.0771, 84: 0.0808, 85: 0.0851,
      86: 0.0899, 87: 0.0955, 88: 0.1021, 89: 0.1099, 90: 0.1192
    };
    
    const rate = withdrawalRates[age] || 0.20;
    return balance * rate;
  };

  const generateRRIFProjections = () => {
    const projections = [];
    let currentBalance = rrifInputs.currentValue;
    const annualReturn = rrifInputs.rateOfReturn / 100;
    
    for (let year = 0; year <= rrifInputs.timeHorizon; year++) {
      const currentAge = rrifInputs.currentAge + year;
      const minimumWithdrawal = currentAge >= 71 ? calculateMinimumWithdrawal(currentAge, currentBalance) : 0;
      
      projections.push({
        year: rrifInputs.currentAge + year,
        balance: Math.round(currentBalance),
        withdrawal: Math.round(minimumWithdrawal)
      });
      
      if (year < rrifInputs.timeHorizon) {
        currentBalance = (currentBalance - minimumWithdrawal) * (1 + annualReturn);
      }
    }
    
    return projections;
  };

  const generateRRIFReport = (asset: Asset) => {
    const projections = generateRRIFProjections();
    const totalWithdrawals = projections.reduce((sum, p) => sum + p.withdrawal, 0);
    const finalBalance = projections[projections.length - 1]?.balance || 0;
    
    return `RRIF Analysis Report for ${asset.name}

Current Value: ${asset.amount}
Rate of Return: ${rrifInputs.rateOfReturn}% annually
Current Age: ${rrifInputs.currentAge}
Time Horizon: ${rrifInputs.timeHorizon} years

Key Projections:
• Total Minimum Withdrawals: $${Math.round(totalWithdrawals).toLocaleString()}
• Final Balance at Age ${rrifInputs.currentAge + rrifInputs.timeHorizon}: $${finalBalance.toLocaleString()}
• First Minimum Withdrawal (Age 71): $${Math.round(calculateMinimumWithdrawal(71, rrifInputs.currentValue)).toLocaleString()}

The RRIF minimum withdrawal requirements begin at age 71. This analysis assumes a ${rrifInputs.rateOfReturn}% annual return and only minimum withdrawals. Actual results may vary based on market performance and withdrawal strategies.

Important Notes:
- Minimum withdrawal rates increase with age
- Withdrawals are fully taxable as income
- Consider tax-efficient withdrawal strategies
- Review and adjust investment allocation as needed`;
  };

  const showReport = (asset: Asset) => {
    console.log("Showing writeup for", asset.name + ":", asset.name);
    setSelectedAsset(asset);
    setReportModalOpen(true);
  };

  const isRRIFAsset = (assetName: string) => {
    return assetName.toLowerCase().includes('rrif');
  };

  const rrifProjections = generateRRIFProjections();
  const totalValue = localAssets.reduce((sum, asset) => sum + asset.value, 0);

  const chartConfig = {
    value: { label: "Value", color: "#8b5cf6" }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3 text-2xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <span>Assets Portfolio Details</span>
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="manage">Manage Assets</TabsTrigger>
              <TabsTrigger value="rrif">RRIF Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-64">
                      <PieChart>
                        <Pie
                          data={localAssets}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {localAssets.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                      <p className="text-3xl font-bold">${totalValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Number of Assets</p>
                      <p className="text-xl font-bold">{localAssets.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Largest Holding</p>
                      <p className="text-lg font-bold">
                        {localAssets.length > 0 ? localAssets.reduce((max, asset) => asset.value > max.value ? asset : max).name : "None"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Asset Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {localAssets.map((asset, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: asset.color }}></div>
                          <div>
                            <span className="font-medium">{asset.name}</span>
                            {isRRIFAsset(asset.name) && (
                              <Badge variant="secondary" className="ml-2">RRIF</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-semibold">{asset.amount}</p>
                            <p className="text-sm text-muted-foreground">
                              {((asset.value / totalValue) * 100).toFixed(1)}%
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            {isRRIFAsset(asset.name) && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => showReport(asset)}
                                  className="flex items-center gap-1"
                                >
                                  <FileText className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => showReport(asset)}
                                  className="flex items-center gap-1"
                                >
                                  <Calculator className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteAsset(asset.name)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manage" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PlusCircle className="h-5 w-5" />
                    <span>Add New Asset</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="assetName">Asset Name</Label>
                      <Select value={newAssetName} onValueChange={setNewAssetName}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select asset type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RRSP">RRSP</SelectItem>
                          <SelectItem value="RRIF">RRIF</SelectItem>
                          <SelectItem value="TFSA">TFSA</SelectItem>
                          <SelectItem value="Non-Registered">Non-Registered</SelectItem>
                          <SelectItem value="Real Estate">Real Estate</SelectItem>
                          <SelectItem value="Business Assets">Business Assets</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="assetValue">Value ($)</Label>
                      <Input
                        id="assetValue"
                        type="number"
                        placeholder="Enter value"
                        value={newAssetValue}
                        onChange={(e) => setNewAssetValue(e.target.value)}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={addAsset} className="w-full">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add Asset
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Assets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {localAssets.map((asset, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: asset.color }}></div>
                          <span className="font-medium">{asset.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold">{asset.amount}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteAsset(asset.name)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rrif" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5" />
                    <span>RRIF Analysis Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Current RRIF Value: ${rrifInputs.currentValue.toLocaleString()}</Label>
                      <Slider
                        value={[rrifInputs.currentValue]}
                        onValueChange={(value) => setRrifInputs({...rrifInputs, currentValue: value[0]})}
                        max={1000000}
                        min={10000}
                        step={5000}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Rate of Return: {rrifInputs.rateOfReturn}%</Label>
                      <Slider
                        value={[rrifInputs.rateOfReturn]}
                        onValueChange={(value) => setRrifInputs({...rrifInputs, rateOfReturn: value[0]})}
                        max={12}
                        min={1}
                        step={0.5}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Current Age: {rrifInputs.currentAge}</Label>
                      <Slider
                        value={[rrifInputs.currentAge]}
                        onValueChange={(value) => setRrifInputs({...rrifInputs, currentAge: value[0]})}
                        max={85}
                        min={50}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Time Horizon: {rrifInputs.timeHorizon} years</Label>
                      <Slider
                        value={[rrifInputs.timeHorizon]}
                        onValueChange={(value) => setRrifInputs({...rrifInputs, timeHorizon: value[0]})}
                        max={40}
                        min={5}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>RRIF Balance Projection</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-80">
                    <LineChart data={rrifProjections}>
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="balance" stroke="#8b5cf6" strokeWidth={2} name="Balance" />
                      <Line type="monotone" dataKey="withdrawal" stroke="#10b981" strokeWidth={2} name="Annual Withdrawal" />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Minimum Withdrawal at 71</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-600">
                      ${Math.round(calculateMinimumWithdrawal(71, rrifInputs.currentValue)).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      5.28% of current balance
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Total Withdrawals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">
                      ${Math.round(rrifProjections.reduce((sum, p) => sum + p.withdrawal, 0)).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Over {rrifInputs.timeHorizon} years
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Final Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-purple-600">
                      ${(rrifProjections[rrifProjections.length - 1]?.balance || 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      At age {rrifInputs.currentAge + rrifInputs.timeHorizon}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Confirm Delete</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete "{assetToDelete}"? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* RRIF Report Modal */}
      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>RRIF Analysis Report</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">
                {selectedAsset ? generateRRIFReport(selectedAsset) : ''}
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
    </>
  );
};

export default AssetsDetailDialog;
