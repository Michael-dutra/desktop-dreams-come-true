
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
import { useState, useEffect } from "react";

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
  // Individual projection years for each asset
  const [realEstateYears, setRealEstateYears] = useState([10]);
  const [rrspYears, setRrspYears] = useState([10]);
  const [tfsaYears, setTfsaYears] = useState([10]);
  const [nonRegYears, setNonRegYears] = useState([10]);

  // Individual growth rates
  const [realEstateRate, setRealEstateRate] = useState([4.2]);
  const [rrspRate, setRrspRate] = useState([7.0]);
  const [tfsaRate, setTfsaRate] = useState([6.5]);
  const [nonRegRate, setNonRegRate] = useState([8.0]);

  // Editable state tracking
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>("");

  // Animation states for future values
  const [animatedRealEstate, setAnimatedRealEstate] = useState(0);
  const [animatedRrsp, setAnimatedRrsp] = useState(0);
  const [animatedTfsa, setAnimatedTfsa] = useState(0);
  const [animatedNonReg, setAnimatedNonReg] = useState(0);

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
    monthlyContribution: 500,
  });

  const [tfsaDetails, setTfsaDetails] = useState({
    totalContributions: 35000,
    currentValue: 38000,
    availableRoom: 8500,
    ytdGrowth: 6.1,
    annualContribution: 5000,
    monthlyContribution: 417,
    totalRoom: 88000,
    taxFreeGrowth: 3000,
  });

  const [nonRegisteredDetails, setNonRegisteredDetails] = useState({
    totalValue: 25000,
    unrealizedGains: 3200,
    annualContribution: 2000,
    monthlyContribution: 167,
    dividendIncome: 850,
    annualInterestIncome: 450,
    capitalGains: 2350,
  });

  // FV calculations
  const calculateFV = (currentValue: number, rate: number, years: number, annualContribution = 0) => {
    const fvCurrentValue = currentValue * Math.pow(1 + rate / 100, years);
    const fvContributions = annualContribution * (Math.pow(1 + rate / 100, years) - 1) / (rate / 100);
    return fvCurrentValue + fvContributions;
  };

  const realEstateFV = calculateFV(realEstateDetails.currentFMV, realEstateRate[0], realEstateYears[0]);
  const rrspFV = calculateFV(rrspDetails.currentValue, rrspRate[0], rrspYears[0], rrspDetails.annualContribution);
  const tfsaFV = calculateFV(tfsaDetails.currentValue, tfsaRate[0], tfsaYears[0], tfsaDetails.annualContribution);
  const nonRegFV = calculateFV(nonRegisteredDetails.totalValue, nonRegRate[0], nonRegYears[0], nonRegisteredDetails.annualContribution);

  // Animation effect for future values
  useEffect(() => {
    const animateValue = (startValue: number, endValue: number, setValue: (value: number) => void) => {
      const duration = 1500; // 1.5 seconds
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (endValue - startValue) * easeOutQuart;
        
        setValue(Math.round(currentValue));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    };

    if (isOpen) {
      // Start animations with a slight delay between each
      setTimeout(() => animateValue(realEstateDetails.currentFMV, realEstateFV, setAnimatedRealEstate), 100);
      setTimeout(() => animateValue(rrspDetails.currentValue, rrspFV, setAnimatedRrsp), 300);
      setTimeout(() => animateValue(tfsaDetails.currentValue, tfsaFV, setAnimatedTfsa), 500);
      setTimeout(() => animateValue(nonRegisteredDetails.totalValue, nonRegFV, setAnimatedNonReg), 700);
    }
  }, [isOpen, realEstateFV, rrspFV, tfsaFV, nonRegFV, realEstateDetails.currentFMV, rrspDetails.currentValue, tfsaDetails.currentValue, nonRegisteredDetails.totalValue]);

  const chartConfig = {
    value: { label: "Value", color: "#3b82f6" },
    futureValue: { label: "Future Value", color: "#10b981" }
  };

  // Edit handlers
  const startEdit = (fieldId: string, currentValue: number | string) => {
    setEditingField(fieldId);
    setTempValue(currentValue.toString());
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
    isAutoCalculated = false
  }: { 
    fieldId: string; 
    value: number; 
    label: string; 
    isEditable?: boolean;
    prefix?: string;
    isAutoCalculated?: boolean;
  }) => {
    const isEditing = editingField === fieldId;
    
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
              {prefix}{value.toLocaleString()}
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

  // Animated Future Value component
  const AnimatedFutureValue = ({ 
    currentValue, 
    animatedValue, 
    targetValue, 
    label, 
    years 
  }: { 
    currentValue: number;
    animatedValue: number;
    targetValue: number;
    label: string;
    years: number;
  }) => {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border-2 border-dashed border-blue-300">
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label} ({years} years)</p>
          <div className="space-y-1">
            <p className="text-lg font-bold text-blue-600 animate-pulse">
              ${animatedValue.toLocaleString()}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-muted-foreground">Growth:</span>
              <span className="font-semibold text-green-600">
                +${Math.round(targetValue - currentValue).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${Math.min((animatedValue / targetValue) * 100, 100)}%` 
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Assets Portfolio Details & Future Value Projections</DialogTitle>
        </DialogHeader>

        {/* Portfolio Summary & Key Metrics */}
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
          </CardContent>
        </Card>

        {/* Animated Future Value Projections */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Animated Future Value Projections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <AnimatedFutureValue
                currentValue={realEstateDetails.currentFMV}
                animatedValue={animatedRealEstate}
                targetValue={realEstateFV}
                label="Real Estate"
                years={realEstateYears[0]}
              />
              <AnimatedFutureValue
                currentValue={rrspDetails.currentValue}
                animatedValue={animatedRrsp}
                targetValue={rrspFV}
                label="RRSP"
                years={rrspYears[0]}
              />
              <AnimatedFutureValue
                currentValue={tfsaDetails.currentValue}
                animatedValue={animatedTfsa}
                targetValue={tfsaFV}
                label="TFSA"
                years={tfsaYears[0]}
              />
              <AnimatedFutureValue
                currentValue={nonRegisteredDetails.totalValue}
                animatedValue={animatedNonReg}
                targetValue={nonRegFV}
                label="Non-Registered"
                years={nonRegYears[0]}
              />
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
                <div>
                  <label className="text-sm font-medium mb-2 block">Projection Years: {realEstateYears[0]}</label>
                  <Slider
                    value={realEstateYears}
                    onValueChange={setRealEstateYears}
                    max={30}
                    min={1}
                    step={1}
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
                  label={`Future Value (${realEstateYears[0]} years)`} 
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
                <div>
                  <label className="text-sm font-medium mb-2 block">Projection Years: {rrspYears[0]}</label>
                  <Slider
                    value={rrspYears}
                    onValueChange={setRrspYears}
                    max={30}
                    min={1}
                    step={1}
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
                  label={`Future Value (${rrspYears[0]} years)`} 
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
                  label="Annual Contribution" 
                />
                <EditableField 
                  fieldId="rrsp.monthlyContribution" 
                  value={rrspDetails.monthlyContribution} 
                  label="Monthly Contribution" 
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
                <div>
                  <label className="text-sm font-medium mb-2 block">Projection Years: {tfsaYears[0]}</label>
                  <Slider
                    value={tfsaYears}
                    onValueChange={setTfsaYears}
                    max={30}
                    min={1}
                    step={1}
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
                  label={`Future Value (${tfsaYears[0]} years)`} 
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
                  label="Annual Contribution" 
                />
                <EditableField 
                  fieldId="tfsa.monthlyContribution" 
                  value={tfsaDetails.monthlyContribution} 
                  label="Monthly Contribution" 
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
                <div>
                  <label className="text-sm font-medium mb-2 block">Projection Years: {nonRegYears[0]}</label>
                  <Slider
                    value={nonRegYears}
                    onValueChange={setNonRegYears}
                    max={30}
                    min={1}
                    step={1}
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
                  label={`Future Value (${nonRegYears[0]} years)`} 
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
                  label="Annual Dividend Income" 
                />
                <EditableField 
                  fieldId="nonReg.annualInterestIncome" 
                  value={nonRegisteredDetails.annualInterestIncome} 
                  label="Annual Interest Income" 
                />
                <EditableField 
                  fieldId="nonReg.capitalGains" 
                  value={nonRegisteredDetails.capitalGains} 
                  label="Capital Gains" 
                />
                <EditableField 
                  fieldId="nonReg.annualContribution" 
                  value={nonRegisteredDetails.annualContribution} 
                  label="Annual Contribution" 
                />
                <EditableField 
                  fieldId="nonReg.monthlyContribution" 
                  value={nonRegisteredDetails.monthlyContribution} 
                  label="Monthly Contribution" 
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
                      <SelectItem value="tfsa">TFSA</SelectItem>
                      <SelectItem value="non-registered">Non-Registered</SelectItem>
                      <SelectItem value="db">DB (Defined Benefit)</SelectItem>
                      <SelectItem value="dc">DC (Defined Contribution)</SelectItem>
                      <SelectItem value="ipp">IPP (Individual Pension Plan)</SelectItem>
                      <SelectItem value="lira">LIRA (Locked-in Retirement Account)</SelectItem>
                      <SelectItem value="lif">LIF (Life Income Fund)</SelectItem>
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
