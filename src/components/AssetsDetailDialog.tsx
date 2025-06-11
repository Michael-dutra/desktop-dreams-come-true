
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { TrendingUp, Home, Wallet, PiggyBank, DollarSign, Calendar, AlertTriangle, Target } from "lucide-react";
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

  // Asset details with enhanced data
  const realEstateDetails = {
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
    historicalData: [
      { year: "2019", value: 480000 },
      { year: "2020", value: 495000 },
      { year: "2021", value: 545000 },
      { year: "2022", value: 580000 },
      { year: "2023", value: 595000 },
      { year: "2024", value: 620000 },
    ]
  };

  const rrspDetails = {
    totalContributions: 45000,
    currentValue: 52000,
    availableRoom: 18500,
    ytdGrowth: 8.2,
    annualContribution: 6000,
    employer401k: 3600,
    taxDeferred: 12600,
    performanceData: [
      { month: "Jan", value: 48000 },
      { month: "Feb", value: 49200 },
      { month: "Mar", value: 50100 },
      { month: "Apr", value: 48900 },
      { month: "May", value: 51200 },
      { month: "Jun", value: 52000 },
    ]
  };

  const tfsaDetails = {
    totalContributions: 35000,
    currentValue: 38000,
    availableRoom: 8500,
    ytdGrowth: 6.1,
    annualContribution: 5000,
    totalRoom: 88000,
    taxFreeGrowth: 3000,
    allocationData: [
      { category: "Canadian Equity", value: 15200, percentage: 40 },
      { category: "US Equity", value: 11400, percentage: 30 },
      { category: "Bonds", value: 7600, percentage: 20 },
      { category: "International", value: 3800, percentage: 10 },
    ]
  };

  const nonRegisteredDetails = {
    totalValue: 25000,
    ytdGrowth: 12.5,
    unrealizedGains: 3200,
    annualContribution: 2000,
    dividendIncome: 850,
    capitalGains: 2350,
    holdings: [
      { symbol: "AAPL", value: 8500, gain: 15.2 },
      { symbol: "GOOGL", value: 6200, gain: 8.7 },
      { symbol: "VTI", value: 5800, gain: 11.3 },
      { symbol: "MSFT", value: 4500, gain: 18.9 },
    ]
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
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Payment</p>
                  <p className="font-semibold">${realEstateDetails.monthlyPayment.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Years Remaining</p>
                  <p className="font-semibold">{realEstateDetails.remainingYears} years</p>
                </div>
              </div>
              
              {/* Historical Chart */}
              <div className="pt-4">
                <h4 className="text-sm font-medium mb-2">Property Value History</h4>
                <ChartContainer config={chartConfig} className="h-32">
                  <LineChart data={realEstateDetails.historicalData}>
                    <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ChartContainer>
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
                  <p className="text-sm text-muted-foreground">Employer Match</p>
                  <p className="font-semibold text-green-600">${rrspDetails.employer401k.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tax Deferred</p>
                  <p className="font-semibold text-orange-600">${rrspDetails.taxDeferred.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Annual Contribution</p>
                  <p className="font-semibold">${rrspDetails.annualContribution.toLocaleString()}</p>
                </div>
              </div>

              {/* Performance Chart */}
              <div className="pt-4">
                <h4 className="text-sm font-medium mb-2">6-Month Performance</h4>
                <ChartContainer config={chartConfig} className="h-32">
                  <AreaChart data={rrspDetails.performanceData}>
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                </ChartContainer>
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
                  <p className="text-sm text-muted-foreground">Total Room</p>
                  <p className="font-semibold">${tfsaDetails.totalRoom.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tax-Free Growth</p>
                  <p className="font-semibold text-green-600">${tfsaDetails.taxFreeGrowth.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Annual Contribution</p>
                  <p className="font-semibold">${tfsaDetails.annualContribution.toLocaleString()}</p>
                </div>
              </div>

              {/* Asset Allocation Chart */}
              <div className="pt-4">
                <h4 className="text-sm font-medium mb-2">Asset Allocation</h4>
                <div className="grid grid-cols-2 gap-4">
                  <ChartContainer config={chartConfig} className="h-32">
                    <PieChart>
                      <Pie
                        data={tfsaDetails.allocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={20}
                        outerRadius={50}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {tfsaDetails.allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"][index]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                  <div className="space-y-2">
                    {tfsaDetails.allocationData.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.category}</span>
                        <span className="font-medium">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
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
                  <p className="text-sm text-muted-foreground">Dividend Income</p>
                  <p className="font-semibold text-purple-600">${nonRegisteredDetails.dividendIncome.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Capital Gains</p>
                  <p className="font-semibold text-blue-600">${nonRegisteredDetails.capitalGains.toLocaleString()}</p>
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

              {/* Holdings Chart */}
              <div className="pt-4">
                <h4 className="text-sm font-medium mb-2">Top Holdings</h4>
                <div className="space-y-2">
                  {nonRegisteredDetails.holdings.map((holding, index) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded bg-muted">
                      <div>
                        <span className="font-medium">{holding.symbol}</span>
                        <p className="text-xs text-muted-foreground">${holding.value.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-semibold ${holding.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          +{holding.gain}%
                        </span>
                      </div>
                    </div>
                  ))}
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

        {/* Enhanced Summary Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl">Portfolio Summary & Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
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

            {/* Additional Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50">
                <Target className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Asset Diversification</p>
                  <p className="text-xs text-muted-foreground">84% Real Estate, 16% Liquid Assets</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50">
                <Calendar className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Tax Efficiency</p>
                  <p className="text-xs text-muted-foreground">${(rrspDetails.taxDeferred + tfsaDetails.taxFreeGrowth).toLocaleString()} tax optimized</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-orange-50">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Contribution Room</p>
                  <p className="text-xs text-muted-foreground">${(rrspDetails.availableRoom + tfsaDetails.availableRoom).toLocaleString()} available</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
