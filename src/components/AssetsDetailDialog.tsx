
import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Home, PiggyBank, Shield, TrendingUp, Plus } from "lucide-react";
import { useAssets } from "@/contexts/AssetsContext";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils";

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChartData {
  year: number;
  value: number;
}

interface Asset {
  id: string;
  name: string;
  value: number;
  description?: string;
  color?: string;
}

export const AssetsDetailDialog = ({ isOpen, onClose }: AssetsDetailDialogProps) => {
  const { assets, updateAsset, addAsset, deleteAsset } = useAssets();
  const { toast } = useToast();

  const [realEstateValue, setRealEstateValue] = useState([500000]);
  const [realEstateGrowthRate, setRealEstateGrowthRate] = useState([3]);

  const [rrspBalance, setRrspBalance] = useState([50000]);
  const [rrspGrowthRate, setRrspGrowthRate] = useState([7]);

  const [tfsaBalance, setTfsaBalance] = useState([30000]);
  const [tfsaGrowthRate, setTfsaGrowthRate] = useState([5]);

  const [nonRegBalance, setNonRegBalance] = useState([20000]);
  const [nonRegGrowthRate, setNonRegGrowthRate] = useState([4]);

  const [yearsToProject, setYearsToProject] = useState(10);

  // New asset form state
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetValue, setNewAssetValue] = useState(0);
  const [newAssetDescription, setNewAssetDescription] = useState("");

  // Edit asset form state
  const [editAssetId, setEditAssetId] = useState<string | null>(null);
  const [editAssetName, setEditAssetName] = useState("");
  const [editAssetValue, setEditAssetValue] = useState(0);
  const [editAssetDescription, setEditAssetDescription] = useState("");

  const generateChartData = (baseValue: number, rate: number, years: number): ChartData[] => {
    const data: ChartData[] = [];
    let value = baseValue;
    for (let year = 0; year <= years; year++) {
      data.push({ year, value });
      value += value * (rate / 100);
    }
    return data;
  };

  const generateStableChartData = (baseValue: number, rate: number, years: number) => {
    const data: { year: number; current: number; future: number }[] = [];
    let futureValue = baseValue;
    for (let year = 0; year <= years; year++) {
      data.push({ year, current: baseValue, future: futureValue });
      futureValue += futureValue * (rate / 100);
    }
    return data;
  };

  const realEstateChartData = React.useMemo(() => {
    return generateStableChartData(
      realEstateValue[0],
      realEstateGrowthRate[0],
      yearsToProject
    );
  }, [realEstateValue, realEstateGrowthRate, yearsToProject]);

  const rrspChartData = React.useMemo(() => {
    return generateStableChartData(
      rrspBalance[0],
      rrspGrowthRate[0],
      yearsToProject
    );
  }, [rrspBalance, rrspGrowthRate, yearsToProject]);

  const tfsaChartData = React.useMemo(() => {
    return generateStableChartData(
      tfsaBalance[0],
      tfsaGrowthRate[0],
      yearsToProject
    );
  }, [tfsaBalance, tfsaGrowthRate, yearsToProject]);

  const nonRegChartData = React.useMemo(() => {
    return generateStableChartData(
      nonRegBalance[0],
      nonRegGrowthRate[0],
      yearsToProject
    );
  }, [nonRegBalance, nonRegGrowthRate, yearsToProject]);

  const totalAssets =
    realEstateValue[0] + rrspBalance[0] + tfsaBalance[0] + nonRegBalance[0];

  const totalProjectedAssets =
    realEstateChartData[yearsToProject].future +
    rrspChartData[yearsToProject].future +
    tfsaChartData[yearsToProject].future +
    nonRegChartData[yearsToProject].future;

  const formatValue = (value: number) => {
    if (value > 999000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const handleAddAsset = () => {
    if (!newAssetName || !newAssetValue) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newAsset = {
      id: uuidv4(),
      name: newAssetName,
      value: newAssetValue,
      description: newAssetDescription,
    };

    addAsset(newAsset);
    setNewAssetName("");
    setNewAssetValue(0);
    setNewAssetDescription("");

    toast({
      title: "Success",
      description: "Asset added successfully.",
    });
  };

  const handleEditAsset = (asset: Asset) => {
    setEditAssetId(asset.id);
    setEditAssetName(asset.name);
    setEditAssetValue(asset.value);
    setEditAssetDescription(asset.description || "");
  };

  const handleUpdateAsset = () => {
    if (!editAssetId) return;

    const updatedAsset = {
      id: editAssetId,
      name: editAssetName,
      value: editAssetValue,
      description: editAssetDescription,
    };

    updateAsset(editAssetId, updatedAsset);
    setEditAssetId(null);

    toast({
      title: "Success",
      description: "Asset updated successfully.",
    });
  };

  const handleDeleteAsset = (id: string) => {
    deleteAsset(id);
    toast({
      title: "Success",
      description: "Asset deleted successfully.",
    });
  };

  const chartConfig = {
    current: {
      label: "Current Value",
      color: "#94a3b8", // gray color for baseline
    },
    future: {
      label: "Projected Value", 
      color: "#3b82f6", // blue color for growth
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Asset Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Assets:</span>
                  <span>{formatValue(totalAssets)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Projected Total Assets (in {yearsToProject} years):</span>
                  <span>{formatValue(totalProjectedAssets)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projection Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Years to Project</Label>
                <Slider
                  value={[yearsToProject]}
                  onValueChange={(value) => setYearsToProject(value[0])}
                  min={5}
                  max={30}
                  step={1}
                />
                <p className="text-sm text-muted-foreground">
                  Adjust the slider to change the number of years for asset
                  projections.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Real Estate Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Primary Residence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="realEstateValue">Current Value</Label>
                  <Input
                    type="number"
                    id="realEstateValue"
                    value={realEstateValue[0]}
                    onChange={(e) =>
                      setRealEstateValue([Number(e.target.value)])
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="realEstateGrowthRate">Growth Rate (%)</Label>
                  <Input
                    type="number"
                    id="realEstateGrowthRate"
                    value={realEstateGrowthRate[0]}
                    onChange={(e) =>
                      setRealEstateGrowthRate([Number(e.target.value)])
                    }
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <ChartContainer config={chartConfig} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={realEstateChartData}>
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="current" 
                        stroke="#94a3b8" 
                        strokeWidth={2}
                        strokeDasharray="5,5"
                        fill="transparent"
                        name="Current Value"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="future" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        fill="#3b82f6" 
                        fillOpacity={0.2}
                        name="Projected Value"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  The chart shows the projected growth of your primary residence
                  over the next {yearsToProject} years.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* RRSP Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="h-5 w-5" />
                RRSP
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rrspBalance">Current Balance</Label>
                  <Input
                    type="number"
                    id="rrspBalance"
                    value={rrspBalance[0]}
                    onChange={(e) => setRrspBalance([Number(e.target.value)])}
                  />
                </div>
                <div>
                  <Label htmlFor="rrspGrowthRate">Growth Rate (%)</Label>
                  <Input
                    type="number"
                    id="rrspGrowthRate"
                    value={rrspGrowthRate[0]}
                    onChange={(e) => setRrspGrowthRate([Number(e.target.value)])}
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <ChartContainer config={chartConfig} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={rrspChartData}>
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="current" 
                        stroke="#94a3b8" 
                        strokeWidth={2}
                        strokeDasharray="5,5"
                        fill="transparent"
                        name="Current Value"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="future" 
                        stroke="#22c55e" 
                        strokeWidth={3}
                        fill="#22c55e" 
                        fillOpacity={0.2}
                        name="Projected Value"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  The chart shows the projected growth of your RRSP over the next{" "}
                  {yearsToProject} years.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* TFSA Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                TFSA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tfsaBalance">Current Balance</Label>
                  <Input
                    type="number"
                    id="tfsaBalance"
                    value={tfsaBalance[0]}
                    onChange={(e) => setTfsaBalance([Number(e.target.value)])}
                  />
                </div>
                <div>
                  <Label htmlFor="tfsaGrowthRate">Growth Rate (%)</Label>
                  <Input
                    type="number"
                    id="tfsaGrowthRate"
                    value={tfsaGrowthRate[0]}
                    onChange={(e) => setTfsaGrowthRate([Number(e.target.value)])}
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <ChartContainer config={chartConfig} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={tfsaChartData}>
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="current" 
                        stroke="#94a3b8" 
                        strokeWidth={2}
                        strokeDasharray="5,5"
                        fill="transparent"
                        name="Current Value"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="future" 
                        stroke="#f59e0b" 
                        strokeWidth={3}
                        fill="#f59e0b" 
                        fillOpacity={0.2}
                        name="Projected Value"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  The chart shows the projected growth of your TFSA over the next{" "}
                  {yearsToProject} years.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Non-Registered Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Non-Registered
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nonRegBalance">Current Balance</Label>
                  <Input
                    type="number"
                    id="nonRegBalance"
                    value={nonRegBalance[0]}
                    onChange={(e) => setNonRegBalance([Number(e.target.value)])}
                  />
                </div>
                <div>
                  <Label htmlFor="nonRegGrowthRate">Growth Rate (%)</Label>
                  <Input
                    type="number"
                    id="nonRegGrowthRate"
                    value={nonRegGrowthRate[0]}
                    onChange={(e) => setNonRegGrowthRate([Number(e.target.value)])}
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <ChartContainer config={chartConfig} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={nonRegChartData}>
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="current" 
                        stroke="#94a3b8" 
                        strokeWidth={2}
                        strokeDasharray="5,5"
                        fill="transparent"
                        name="Current Value"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="future" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        fill="#8b5cf6" 
                        fillOpacity={0.2}
                        name="Projected Value"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  The chart shows the projected growth of your non-registered
                  investments over the next {yearsToProject} years.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Add Asset Section */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Asset</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newAssetName">Asset Name</Label>
                  <Input
                    type="text"
                    id="newAssetName"
                    value={newAssetName}
                    onChange={(e) => setNewAssetName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="newAssetValue">Current Value</Label>
                  <Input
                    type="number"
                    id="newAssetValue"
                    value={newAssetValue}
                    onChange={(e) => setNewAssetValue(Number(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="newAssetDescription">Description</Label>
                <Textarea
                  id="newAssetDescription"
                  value={newAssetDescription}
                  onChange={(e) => setNewAssetDescription(e.target.value)}
                />
              </div>
              <Button onClick={handleAddAsset}>Add Asset</Button>
            </CardContent>
          </Card>

          {/* Dynamic Assets Grid */}
          {assets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell>{asset.name}</TableCell>
                        <TableCell>{formatValue(asset.value)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditAsset(asset)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAsset(asset.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Edit Asset Dialog (Conditional) */}
          {editAssetId && (
            <Dialog open={!!editAssetId} onOpenChange={() => setEditAssetId(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Asset</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="editAssetName">Asset Name</Label>
                    <Input
                      type="text"
                      id="editAssetName"
                      value={editAssetName}
                      onChange={(e) => setEditAssetName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editAssetValue">Current Value</Label>
                    <Input
                      type="number"
                      id="editAssetValue"
                      value={editAssetValue}
                      onChange={(e) => setEditAssetValue(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <Label htmlFor="editAssetDescription">Description</Label>
                  <Textarea
                    id="editAssetDescription"
                    value={editAssetDescription}
                    onChange={(e) => setEditAssetDescription(e.target.value)}
                  />
                </div>
                <Button onClick={handleUpdateAsset}>Update Asset</Button>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
```
