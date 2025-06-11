
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Home, Wallet, PiggyBank, DollarSign } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
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
  // FV calculation controls
  const [projectionYears, setProjectionYears] = useState([10]);
  const [realEstateRate, setRealEstateRate] = useState([4.2]);
  const [rrspRate, setRrspRate] = useState([7.0]);
  const [tfsaRate, setTfsaRate] = useState([6.5]);
  const [nonRegRate, setNonRegRate] = useState([8.0]);
  const [includeContributions, setIncludeContributions] = useState(true);

  // Asset details
  const realEstateDetails = {
    purchasePrice: 480000,
    purchaseYear: 2019,
    currentFMV: 620000,
    improvements: 35000,
    mortgageBalance: 285000,
    equity: 335000,
    yearlyAppreciation: 4.2,
    totalReturn: 29.2,
    address: "123 Maple Street, Toronto, ON"
  };

  const rrspDetails = {
    totalContributions: 45000,
    currentValue: 52000,
    availableRoom: 18500,
    ytdGrowth: 8.2,
    annualContribution: 6000
  };

  const tfsaDetails = {
    totalContributions: 35000,
    currentValue: 38000,
    availableRoom: 8500,
    ytdGrowth: 6.1,
    annualContribution: 5000
  };

  const nonRegisteredDetails = {
    totalValue: 25000,
    ytdGrowth: 12.5,
    unrealizedGains: 3200,
    annualContribution: 2000
  };

  // FV calculations
  const calculateFV = (currentValue: number, rate: number, years: number, annualContribution = 0) => {
    if (!includeContributions) {
      return currentValue * Math.pow(1 + rate / 100, years);
    }
    // With annual contributions (annuity)
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Assets Portfolio Details & Future Value Projections</DialogTitle>
        </DialogHeader>

        {/* FV Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Future Value Assumptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Projection Years: {projectionYears[0]}</label>
                  <Slider
                    value={projectionYears}
                    onValueChange={setProjectionYears}
                    max={30}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={includeContributions}
                    onCheckedChange={setIncludeContributions}
                  />
                  <label className="text-sm font-medium">Include Annual Contributions</label>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Real Estate Rate: {realEstateRate[0]}%</label>
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
                  <label className="text-sm font-medium mb-2 block">RRSP Rate: {rrspRate[0]}%</label>
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

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">TFSA Rate: {tfsaRate[0]}%</label>
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
                  <label className="text-sm font-medium mb-2 block">Non-Registered Rate: {nonRegRate[0]}%</label>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current FMV</p>
                  <p className="font-semibold text-lg text-green-600">${realEstateDetails.currentFMV.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Future Value ({projectionYears[0]} years)</p>
                  <p className="font-semibold text-lg text-blue-600">${Math.round(realEstateFV).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purchase Price</p>
                  <p className="font-semibold">${realEstateDetails.purchasePrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Projected Growth</p>
                  <p className="font-semibold text-green-600">+${Math.round(realEstateFV - realEstateDetails.currentFMV).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mortgage Balance</p>
                  <p className="font-semibold text-red-600">${realEstateDetails.mortgageBalance.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Net Equity</p>
                  <p className="font-semibold text-green-600">${realEstateDetails.equity.toLocaleString()}</p>
                </div>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Value</p>
                  <p className="font-semibold text-lg text-green-600">${rrspDetails.currentValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Future Value ({projectionYears[0]} years)</p>
                  <p className="font-semibold text-lg text-blue-600">${Math.round(rrspFV).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Contributions</p>
                  <p className="font-semibold">${rrspDetails.totalContributions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Projected Growth</p>
                  <p className="font-semibold text-green-600">+${Math.round(rrspFV - rrspDetails.currentValue).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Room</p>
                  <p className="font-semibold">${rrspDetails.availableRoom.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Annual Contribution</p>
                  <p className="font-semibold">${rrspDetails.annualContribution.toLocaleString()}</p>
                </div>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Value</p>
                  <p className="font-semibold text-lg text-green-600">${tfsaDetails.currentValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Future Value ({projectionYears[0]} years)</p>
                  <p className="font-semibold text-lg text-blue-600">${Math.round(tfsaFV).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Contributions</p>
                  <p className="font-semibold">${tfsaDetails.totalContributions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Projected Growth</p>
                  <p className="font-semibold text-green-600">+${Math.round(tfsaFV - tfsaDetails.currentValue).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Room</p>
                  <p className="font-semibold">${tfsaDetails.availableRoom.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Annual Contribution</p>
                  <p className="font-semibold">${tfsaDetails.annualContribution.toLocaleString()}</p>
                </div>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Value</p>
                  <p className="font-semibold text-lg text-green-600">${nonRegisteredDetails.totalValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Future Value ({projectionYears[0]} years)</p>
                  <p className="font-semibold text-lg text-blue-600">${Math.round(nonRegFV).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unrealized Gains</p>
                  <p className="font-semibold text-green-600">+${nonRegisteredDetails.unrealizedGains.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Projected Growth</p>
                  <p className="font-semibold text-green-600">+${Math.round(nonRegFV - nonRegisteredDetails.totalValue).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">YTD Growth</p>
                  <p className="font-semibold text-green-600">+{nonRegisteredDetails.ytdGrowth}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Annual Contribution</p>
                  <p className="font-semibold">${nonRegisteredDetails.annualContribution.toLocaleString()}</p>
                </div>
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Rate: <span className="font-semibold">{nonRegRate[0]}%</span> annually</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl">Portfolio Summary</CardTitle>
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
      </DialogContent>
    </Dialog>
  );
};
