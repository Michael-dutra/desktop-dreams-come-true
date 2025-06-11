
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { TrendingUp, Home, Wallet, PiggyBank, DollarSign, Calendar, AlertTriangle, Target, Edit2, Check, X, Plus } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

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

export const AssetsDetailDialog = ({ isOpen, onClose, assets }: AssetsDetailDialogProps) => {
  // Individual FV calculation controls for each asset
  const [projectionYears, setProjectionYears] = useState([10]);
  const [realEstateRate, setRealEstateRate] = useState([4.2]);
  const [rrspRate, setRrspRate] = useState([7.0]);
  const [tfsaRate, setTfsaRate] = useState([6.5]);
  const [nonRegRate, setNonRegRate] = useState([8.0]);
  const [includeContributions, setIncludeContributions] = useState(true);
  const [contributionPeriod, setContributionPeriod] = useState("annual");

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
    monthlyPayment: 1800,
    remainingYears: 18,
  });

  const [rrspDetails, setRrspDetails] = useState({
    totalContributions: 45000,
    currentValue: 52000,
    availableRoom: 18500,
    ytdGrowth: 8.2,
    annualContribution: 6000,
  });

  const [tfsaDetails, setTfsaDetails] = useState({
    totalContributions: 35000,
    currentValue: 38000,
    availableRoom: 8500,
    ytdGrowth: 6.1,
    annualContribution: 5000,
    totalRoom: 88000,
    taxFreeGrowth: 3000,
  });

  const [nonRegisteredDetails, setNonRegisteredDetails] = useState({
    totalValue: 25000,
    unrealizedGains: 3200,
    annualContribution: 2000,
    dividendIncome: 850,
    capitalGains: 2350,
  });

  // Helper function to get display contribution values
  const getContributionValue = (annualAmount: number) => {
    return contributionPeriod === "monthly" ? Math.round(annualAmount / 12) : annualAmount;
  };

  const getContributionLabel = (baseLabel: string) => {
    return contributionPeriod === "monthly" ? `Monthly ${baseLabel}` : `Annual ${baseLabel}`;
  };

  // FV calculations
  const calculateFV = (currentValue: number, rate: number, years: number, annualContribution = 0) => {
    if (!includeContributions) {
      return currentValue * Math.pow(1 + rate / 100, years);
    }
    const fvCurrentValue = currentValue * Math.pow(1 + rate / 100, years);
    const fvContributions = annualContribution * (Math.pow(1 + rate / 100, years) - 1) / (rate / 100);
    return fvCurrentValue + fvContributions;
  };

  const realEstateFV = calculateFV(realEstateDetails.currentFMV, realEstateRate[0], projectionYears[0]);
  const rrspFV = calculateFV(rrspDetails.currentValue, rrspRate[0], projectionYears[0], includeContributions ? rrspDetails.annualContribution : 0);
  const tfsaFV = calculateFV(tfsaDetails.currentValue, tfsaRate[0], projectionYears[0], includeContributions ? tfsaDetails.annualContribution : 0);
  const nonRegFV = calculateFV(nonRegisteredDetails.totalValue, nonRegRate[0], projectionYears[0], includeContributions ? nonRegisteredDetails.annualContribution : 0);

  const chartConfig = {
    value: { label: "Value", color: "#3b82f6" },
    futureValue: { label: "Future Value", color: "#10b981" }
  };

  // Edit handlers
  const startEdit = (fieldId: string, currentValue: number | string) => {
    setEditingField(fieldId);
    const displayValue = fieldId.includes('Contribution') || fieldId.includes('dividendIncome') ? 
      getContributionValue(Number(currentValue)) : currentValue;
    setTempValue(displayValue.toString());
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempValue("");
  };

  const saveEdit = (fieldId: string) => {
    let numericValue = parseFloat(tempValue);
    if (isNaN(numericValue)) {
      cancelEdit();
      return;
    }

    // Convert monthly values back to annual for storage
    if ((fieldId.includes('Contribution') || fieldId.includes('dividendIncome')) && contributionPeriod === "monthly") {
      numericValue = numericValue * 12;
    }

    const [category, field] = fieldId.split('.');
    
    switch (category) {
      case 'realEstate':
        setRealEstateDetails(prev => ({ ...prev, [field]: numericValue }));
        break;
      case 'rrsp':
        setRrspDetails(prev => ({ ...prev, [field]: numericValue }));
        break;
      case 'tfsa':
        setTfsaDetails(prev => ({ ...prev, [field]: numericValue }));
        break;
      case 'nonReg':
        setNonRegisteredDetails(prev => ({ ...prev, [field]: numericValue }));
        break;
    }
    
    setEditingField(null);
    setTempValue("");
  };

  // Editable field component
  const EditableField = ({ 
    fieldId, 
    value, 
    label, 
    isEditable = true, 
    prefix = "$",
    isAutoCalculated = false,
    isContribution = false
  }: { 
    fieldId: string; 
    value: number; 
    label: string; 
    isEditable?: boolean;
    prefix?: string;
    isAutoCalculated?: boolean;
    isContribution?: boolean;
  }) => {
    const isEditing = editingField === fieldId;
    const displayValue = isContribution ? getContributionValue(value) : value;
    const displayLabel = isContribution ? getContributionLabel(label) : label;
    
    return (
      <div className="relative">
        <p className="text-sm text-muted-foreground">{displayLabel}</p>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="text-lg font-semibold"
              type="number"
              autoFocus
            />
            <Button size="sm" variant="ghost" onClick={() => saveEdit(fieldId)}>
              <Check className="w-4 h-4 text-green-600" />
            </Button>
            <Button size="sm" variant="ghost" onClick={cancelEdit}>
              <X className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className={`font-semibold text-lg ${isAutoCalculated ? 'text-blue-600' : 'text-green-600'}`}>
              {prefix}{displayValue.toLocaleString()}
            </p>
            {isEditable && !isAutoCalculated && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => startEdit(fieldId, value)}
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
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Assets Portfolio Details & Future Value Projections</DialogTitle>
        </DialogHeader>

        {/* Portfolio Summary & Key Metrics - Moved to top */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Portfolio Summary & Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Current Value</p>
                <p className="font-bold text-2xl text-green-600">
                  ${(realEstateDetails.currentFMV + rrspDetails.currentValue + tfsaDetails.currentValue + nonRegisteredDetails.totalValue).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Future Value</p>
                <p className="font-bold text-2xl text-blue-600">
                  ${Math.round(realEstateFV + rrspFV + tfsaFV + nonRegFV).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Projected Growth</p>
                <p className="font-bold text-2xl text-purple-600">
                  +${Math.round((realEstateFV + rrspFV + tfsaFV + nonRegFV) - (realEstateDetails.currentFMV + rrspDetails.currentValue + tfsaDetails.currentValue + nonRegisteredDetails.totalValue)).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Growth Rate</p>
                <p className="font-bold text-2xl text-orange-600">
                  {(((realEstateFV + rrspFV + tfsaFV + nonRegFV) / (realEstateDetails.currentFMV + rrspDetails.currentValue + tfsaDetails.currentValue + nonRegisteredDetails.totalValue) - 1) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Global contribution settings */}
            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={includeContributions}
                      onCheckedChange={setIncludeContributions}
                    />
                    <label className="text-sm font-medium">
                      Include {contributionPeriod === "monthly" ? "Monthly" : "Annual"} Savings
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contribution Display</label>
                    <ToggleGroup type="single" value={contributionPeriod} onValueChange={setContributionPeriod}>
                      <ToggleGroupItem value="annual">Annual</ToggleGroupItem>
                      <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium mb-2 block">Projection Years: {projectionYears[0]}</label>
                  <Slider
                    value={projectionYears}
                    onValueChange={setProjectionYears}
                    max={30}
                    min={1}
                    step={1}
                    className="w-32"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Real Estate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Home className="w-6 h-6" />
                Real Estate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Real Estate Controls */}
              <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Growth Rate: {realEstateRate[0]}%</label>
                  <Slider
                    value={realEstateRate}
                    onValueChange={setRealEstateRate}
                    max={15}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <EditableField 
                  fieldId="realEstate.currentFMV" 
                  value={realEstateDetails.currentFMV} 
                  label="Current FMV" 
                />
                <EditableField 
                  fieldId="future-value-re" 
                  value={Math.round(realEstateFV)} 
                  label={`Future Value (${projectionYears[0]} years)`} 
                  isAutoCalculated={true}
                  isEditable={false}
                />
                <EditableField 
                  fieldId="realEstate.purchasePrice" 
                  value={realEstateDetails.purchasePrice} 
                  label="Purchase Price" 
                />
                <EditableField 
                  fieldId="projected-growth-re" 
                  value={Math.round(realEstateFV - realEstateDetails.currentFMV)} 
                  label="Projected Growth" 
                  prefix="+$"
                  isAutoCalculated={true}
                  isEditable={false}
                />
                <EditableField 
                  fieldId="realEstate.mortgageBalance" 
                  value={realEstateDetails.mortgageBalance} 
                  label="Mortgage Balance" 
                />
                <EditableField 
                  fieldId="net-equity-re" 
                  value={realEstateDetails.currentFMV - realEstateDetails.mortgageBalance} 
                  label="Net Equity" 
                  isAutoCalculated={true}
                  isEditable={false}
                />
                <EditableField 
                  fieldId="realEstate.monthlyPayment" 
                  value={realEstateDetails.monthlyPayment} 
                  label="Monthly Payment" 
                />
                <EditableField 
                  fieldId="realEstate.remainingYears" 
                  value={realEstateDetails.remainingYears} 
                  label="Years Remaining" 
                  prefix=""
                />
              </div>
              
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-1">Address: {realEstateDetails.address}</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Rate: <span className="font-semibold">{realEstateRate[0]}%</span> annually</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RRSP */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <PiggyBank className="w-6 h-6" />
                RRSP
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* RRSP Controls */}
              <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Growth Rate: {rrspRate[0]}%</label>
                  <Slider
                    value={rrspRate}
                    onValueChange={setRrspRate}
                    max={15}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <EditableField 
                  fieldId="rrsp.currentValue" 
                  value={rrspDetails.currentValue} 
                  label="Current Value" 
                />
                <EditableField 
                  fieldId="future-value-rrsp" 
                  value={Math.round(rrspFV)} 
                  label={`Future Value (${projectionYears[0]} years)`} 
                  isAutoCalculated={true}
                  isEditable={false}
                />
                <EditableField 
                  fieldId="rrsp.totalContributions" 
                  value={rrspDetails.totalContributions} 
                  label="Total Contributions" 
                />
                <EditableField 
                  fieldId="projected-growth-rrsp" 
                  value={Math.round(rrspFV - rrspDetails.currentValue)} 
                  label="Projected Growth" 
                  prefix="+$"
                  isAutoCalculated={true}
                  isEditable={false}
                />
                <EditableField 
                  fieldId="rrsp.availableRoom" 
                  value={rrspDetails.availableRoom} 
                  label="Available Room" 
                />
                <EditableField 
                  fieldId="rrsp.annualContribution" 
                  value={rrspDetails.annualContribution} 
                  label="Contribution" 
                  isContribution={true}
                />
              </div>
              
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Rate: <span className="font-semibold">{rrspRate[0]}%</span> annually</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* TFSA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Wallet className="w-6 h-6" />
                TFSA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* TFSA Controls */}
              <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Growth Rate: {tfsaRate[0]}%</label>
                  <Slider
                    value={tfsaRate}
                    onValueChange={setTfsaRate}
                    max={15}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <EditableField 
                  fieldId="tfsa.currentValue" 
                  value={tfsaDetails.currentValue} 
                  label="Current Value" 
                />
                <EditableField 
                  fieldId="future-value-tfsa" 
                  value={Math.round(tfsaFV)} 
                  label={`Future Value (${projectionYears[0]} years)`} 
                  isAutoCalculated={true}
                  isEditable={false}
                />
                <EditableField 
                  fieldId="tfsa.totalContributions" 
                  value={tfsaDetails.totalContributions} 
                  label="Total Contributions" 
                />
                <EditableField 
                  fieldId="projected-growth-tfsa" 
                  value={Math.round(tfsaFV - tfsaDetails.currentValue)} 
                  label="Projected Growth" 
                  prefix="+$"
                  isAutoCalculated={true}
                  isEditable={false}
                />
                <EditableField 
                  fieldId="tfsa.availableRoom" 
                  value={tfsaDetails.availableRoom} 
                  label="Available Room" 
                />
                <EditableField 
                  fieldId="tfsa.totalRoom" 
                  value={tfsaDetails.totalRoom} 
                  label="Total Room" 
                />
                <EditableField 
                  fieldId="tfsa.taxFreeGrowth" 
                  value={tfsaDetails.taxFreeGrowth} 
                  label="Tax-Free Growth" 
                />
                <EditableField 
                  fieldId="tfsa.annualContribution" 
                  value={tfsaDetails.annualContribution} 
                  label="Contribution" 
                  isContribution={true}
                />
              </div>
              
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Rate: <span className="font-semibold">{tfsaRate[0]}%</span> annually</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Non-Registered */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <DollarSign className="w-6 h-6" />
                Non-Registered
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Non-Registered Controls */}
              <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Growth Rate: {nonRegRate[0]}%</label>
                  <Slider
                    value={nonRegRate}
                    onValueChange={setNonRegRate}
                    max={15}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <EditableField 
                  fieldId="nonReg.totalValue" 
                  value={nonRegisteredDetails.totalValue} 
                  label="Current Value" 
                />
                <EditableField 
                  fieldId="future-value-nonreg" 
                  value={Math.round(nonRegFV)} 
                  label={`Future Value (${projectionYears[0]} years)`} 
                  isAutoCalculated={true}
                  isEditable={false}
                />
                <EditableField 
                  fieldId="nonReg.unrealizedGains" 
                  value={nonRegisteredDetails.unrealizedGains} 
                  label="Unrealized Gains" 
                  prefix="+$"
                />
                <EditableField 
                  fieldId="projected-growth-nonreg" 
                  value={Math.round(nonRegFV - nonRegisteredDetails.totalValue)} 
                  label="Projected Growth" 
                  prefix="+$"
                  isAutoCalculated={true}
                  isEditable={false}
                />
                <EditableField 
                  fieldId="nonReg.dividendIncome" 
                  value={nonRegisteredDetails.dividendIncome} 
                  label="Dividend Income" 
                  isContribution={true}
                />
                <EditableField 
                  fieldId="nonReg.capitalGains" 
                  value={nonRegisteredDetails.capitalGains} 
                  label="Capital Gains" 
                />
                <EditableField 
                  fieldId="nonReg.annualContribution" 
                  value={nonRegisteredDetails.annualContribution} 
                  label="Contribution" 
                  isContribution={true}
                />
              </div>
              
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Rate: <span className="font-semibold">{nonRegRate[0]}%</span> annually</span>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an asset type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                      <SelectItem value="rrsp">RRSP</SelectItem>
                      <SelectItem value="non-registered">Non-Registered</SelectItem>
                      <SelectItem value="pension">Pension</SelectItem>
                      <SelectItem value="chequing">Chequing Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Asset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
