
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Plus, Trash2, Building2, TrendingUp, Landmark } from "lucide-react";

interface Investment {
  id: string;
  name: string;
  currentValue: number;
  acb: number;
  type: 'bank' | 'investment' | 'realestate';
}

const InvestmentsTab = () => {
  const [investments, setInvestments] = useState<Investment[]>([
    { id: '1', name: 'Business Checking Account', currentValue: 50000, acb: 50000, type: 'bank' },
    { id: '2', name: 'Portfolio Investments', currentValue: 150000, acb: 120000, type: 'investment' },
    { id: '3', name: 'Commercial Property', currentValue: 800000, acb: 650000, type: 'realestate' },
  ]);

  const [growthRate, setGrowthRate] = useState([7]);
  const [timeHorizon, setTimeHorizon] = useState([10]);

  const addInvestment = (type: 'bank' | 'investment' | 'realestate') => {
    const newInvestment: Investment = {
      id: Date.now().toString(),
      name: `New ${type === 'bank' ? 'Bank Account' : type === 'investment' ? 'Investment' : 'Real Estate'}`,
      currentValue: 0,
      acb: 0,
      type,
    };
    setInvestments([...investments, newInvestment]);
  };

  const updateInvestment = (id: string, field: keyof Investment, value: string | number) => {
    setInvestments(investments.map(inv => 
      inv.id === id ? { ...inv, [field]: value } : inv
    ));
  };

  const deleteInvestment = (id: string) => {
    setInvestments(investments.filter(inv => inv.id !== id));
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const generateProjectionData = (investments: Investment[]) => {
    const data = [];
    const rate = growthRate[0] / 100;
    
    for (let year = 0; year <= timeHorizon[0]; year++) {
      const yearData: any = { year: new Date().getFullYear() + year };
      
      investments.forEach(inv => {
        const projectedValue = inv.currentValue * Math.pow(1 + rate, year);
        yearData[inv.id] = Math.round(projectedValue);
      });
      
      data.push(yearData);
    }
    
    return data;
  };

  const chartData = generateProjectionData(investments);
  
  const getInvestmentsByType = (type: 'bank' | 'investment' | 'realestate') => {
    return investments.filter(inv => inv.type === type);
  };

  const getTotalByType = (type: 'bank' | 'investment' | 'realestate') => {
    return getInvestmentsByType(type).reduce((sum, inv) => sum + inv.currentValue, 0);
  };

  const getIconForType = (type: 'bank' | 'investment' | 'realestate') => {
    switch (type) {
      case 'bank': return <Landmark className="h-5 w-5 text-blue-600" />;
      case 'investment': return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'realestate': return <Building2 className="h-5 w-5 text-purple-600" />;
    }
  };

  const getColorForType = (type: 'bank' | 'investment' | 'realestate') => {
    switch (type) {
      case 'bank': return '#3b82f6';
      case 'investment': return '#10b981';
      case 'realestate': return '#8b5cf6';
    }
  };

  const InvestmentSection = ({ type, title }: { type: 'bank' | 'investment' | 'realestate', title: string }) => {
    const sectionInvestments = getInvestmentsByType(type);
    const total = getTotalByType(type);

    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              {getIconForType(type)}
              <span>{title}</span>
              <span className="text-sm font-normal text-muted-foreground">
                ({formatCurrency(total)})
              </span>
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => addInvestment(type)}
              className="flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sectionInvestments.map((investment) => (
              <div key={investment.id} className="grid grid-cols-12 gap-3 items-end p-3 border rounded-lg">
                <div className="col-span-4">
                  <Label htmlFor={`name-${investment.id}`} className="text-xs">Name</Label>
                  <Input
                    id={`name-${investment.id}`}
                    value={investment.name}
                    onChange={(e) => updateInvestment(investment.id, 'name', e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="col-span-3">
                  <Label htmlFor={`current-${investment.id}`} className="text-xs">Current Value</Label>
                  <Input
                    id={`current-${investment.id}`}
                    type="number"
                    value={investment.currentValue}
                    onChange={(e) => updateInvestment(investment.id, 'currentValue', parseFloat(e.target.value) || 0)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="col-span-3">
                  <Label htmlFor={`acb-${investment.id}`} className="text-xs">ACB</Label>
                  <Input
                    id={`acb-${investment.id}`}
                    type="number"
                    value={investment.acb}
                    onChange={(e) => updateInvestment(investment.id, 'acb', parseFloat(e.target.value) || 0)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="col-span-2 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteInvestment(investment.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="col-span-12 grid grid-cols-2 gap-4 mt-2 text-xs text-muted-foreground">
                  <div>
                    Capital Gain: {formatCurrency(Math.max(0, investment.currentValue - investment.acb))}
                  </div>
                  <div>
                    Return: {investment.acb > 0 ? ((investment.currentValue - investment.acb) / investment.acb * 100).toFixed(1) : 0}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const chartConfig = {
    ...investments.reduce((config, inv) => ({
      ...config,
      [inv.id]: {
        label: inv.name,
        color: getColorForType(inv.type),
      }
    }), {})
  };

  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalACB = investments.reduce((sum, inv) => sum + inv.acb, 0);
  const totalGain = totalCurrentValue - totalACB;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(getTotalByType('bank'))}</div>
            <div className="text-sm text-muted-foreground">Bank Accounts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(getTotalByType('investment'))}</div>
            <div className="text-sm text-muted-foreground">Investments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(getTotalByType('realestate'))}</div>
            <div className="text-sm text-muted-foreground">Real Estate</div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Projection Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Growth Rate: {growthRate[0]}%
              </label>
              <Slider
                value={growthRate}
                onValueChange={setGrowthRate}
                min={0}
                max={20}
                step={0.5}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Time Horizon: {timeHorizon[0]} years
              </label>
              <Slider
                value={timeHorizon}
                onValueChange={setTimeHorizon}
                min={1}
                max={30}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Sections */}
      <InvestmentSection type="bank" title="Bank Accounts" />
      <InvestmentSection type="investment" title="Investments" />
      <InvestmentSection type="realestate" title="Real Estate" />

      {/* Portfolio Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-xl font-bold">{formatCurrency(totalCurrentValue)}</div>
              <div className="text-sm text-muted-foreground">Total Current Value</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{formatCurrency(totalACB)}</div>
              <div className="text-sm text-muted-foreground">Total ACB</div>
            </div>
            <div className="text-center">
              <div className={`text-xl font-bold ${totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalGain)}
              </div>
              <div className="text-sm text-muted-foreground">Total Capital Gain</div>
            </div>
          </div>

          {/* Projection Chart */}
          <div className="h-64">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart data={chartData}>
                <defs>
                  {investments.map((inv, index) => (
                    <linearGradient key={inv.id} id={`gradient-${inv.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={getColorForType(inv.type)} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={getColorForType(inv.type)} stopOpacity={0.1}/>
                    </linearGradient>
                  ))}
                </defs>
                <XAxis 
                  dataKey="year" 
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <ChartTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border rounded-lg p-3 shadow-lg">
                          <p className="font-bold text-sm mb-2">{label}</p>
                          {payload.map((entry: any) => {
                            const investment = investments.find(inv => inv.id === entry.dataKey);
                            if (!investment) return null;
                            return (
                              <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
                                {investment.name}: {formatCurrency(entry.value)}
                              </p>
                            );
                          })}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {investments.map((investment) => (
                  <Area 
                    key={investment.id}
                    type="monotone" 
                    dataKey={investment.id}
                    stackId="1"
                    stroke={getColorForType(investment.type)}
                    fill={`url(#gradient-${investment.id})`}
                    strokeWidth={2}
                  />
                ))}
              </AreaChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentsTab;
