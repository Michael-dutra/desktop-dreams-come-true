
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Building2, TrendingUp, DollarSign, Calculator, Users, Plus, X, FileText } from "lucide-react";

interface BusinessDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Shareholder {
  id: string;
  name: string;
  shares: number;
  percentage: number;
  type: "Common" | "Preferred";
}

export const BusinessDetailDialog = ({ isOpen, onClose }: BusinessDetailDialogProps) => {
  const [businessRegistration, setBusinessRegistration] = useState({
    yearEstablished: 2018,
    sharesIssued: 1000000,
    paidUpCapital: 50000,
    retainedEarnings: 125000
  });

  const [lcgeCalculation, setLcgeCalculation] = useState({
    eligibleGains: [875000],
    usedExemption: [0],
    lifeTimeExemption: 1000000
  });

  const [shareholders, setShareholders] = useState<Shareholder[]>([
    { id: "1", name: "John Smith", shares: 750000, percentage: 75, type: "Common" },
    { id: "2", name: "Jane Smith", shares: 250000, percentage: 25, type: "Common" },
  ]);

  const [showAddShareholder, setShowAddShareholder] = useState(false);
  const [newShareholder, setNewShareholder] = useState({
    name: "",
    shares: 0,
    percentage: 0,
    type: "Common" as "Common" | "Preferred"
  });

  // Revenue and projection data
  const revenueStreams = [
    { source: "Product Sales", amount: 450000, percentage: 65, growth: 12 },
    { source: "Services", amount: 180000, percentage: 26, growth: 8 },
    { source: "Licensing", amount: 62000, percentage: 9, growth: 15 }
  ];

  const financialProjections = [
    { year: 2024, revenue: 692000, expenses: 485000, netIncome: 207000 },
    { year: 2025, revenue: 775000, expenses: 525000, netIncome: 250000 },
    { year: 2026, revenue: 868000, expenses: 568000, netIncome: 300000 },
    { year: 2027, revenue: 972000, expenses: 615000, netIncome: 357000 },
    { year: 2028, revenue: 1089000, expenses: 665000, netIncome: 424000 }
  ];

  // LCGE calculations
  const availableExemption = lcgeCalculation.lifeTimeExemption - lcgeCalculation.usedExemption[0];
  const eligibleForExemption = Math.min(lcgeCalculation.eligibleGains[0], availableExemption);
  const taxableGain = Math.max(0, lcgeCalculation.eligibleGains[0] - eligibleForExemption);
  const taxSavings = eligibleForExemption * 0.267; // Approximate combined tax rate on capital gains

  const chartConfig = {
    revenue: { label: "Revenue", color: "#3b82f6" },
    expenses: { label: "Expenses", color: "#ef4444" },
    netIncome: { label: "Net Income", color: "#10b981" },
    amount: { label: "Amount", color: "#8b5cf6" }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    } else {
      return `$${value.toLocaleString()}`;
    }
  };

  const handleAddShareholder = () => {
    if (newShareholder.name.trim() && newShareholder.shares > 0) {
      const shareholder: Shareholder = {
        id: Date.now().toString(),
        name: newShareholder.name,
        shares: newShareholder.shares,
        percentage: newShareholder.percentage,
        type: newShareholder.type
      };
      setShareholders([...shareholders, shareholder]);
      setNewShareholder({ name: "", shares: 0, percentage: 0, type: "Common" });
      setShowAddShareholder(false);
    }
  };

  const handleDeleteShareholder = (id: string) => {
    setShareholders(shareholders.filter(s => s.id !== id));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Business Planning Details
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="shareholders">Shareholders</TabsTrigger>
              <TabsTrigger value="registration">Registration</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* LCGE Auto-Calculator - Now at the top */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="bg-green-100 border-b border-green-200">
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5 text-green-600" />
                    <span className="text-green-800">LCGE Auto-Calculator</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Input Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-green-700">
                            Eligible Capital Gains: {formatCurrency(lcgeCalculation.eligibleGains[0])}
                          </label>
                          <Slider
                            value={lcgeCalculation.eligibleGains}
                            onValueChange={(value) => setLcgeCalculation(prev => ({ ...prev, eligibleGains: value }))}
                            min={0}
                            max={2000000}
                            step={25000}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-green-700">
                            Previously Used Exemption: {formatCurrency(lcgeCalculation.usedExemption[0])}
                          </label>
                          <Slider
                            value={lcgeCalculation.usedExemption}
                            onValueChange={(value) => setLcgeCalculation(prev => ({ ...prev, usedExemption: value }))}
                            min={0}
                            max={lcgeCalculation.lifeTimeExemption}
                            step={10000}
                            className="mt-2"
                          />
                        </div>
                      </div>

                      {/* Calculation Results */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                          <p className="text-sm text-green-600">Lifetime Exemption</p>
                          <p className="text-lg font-bold text-green-800">{formatCurrency(lcgeCalculation.lifeTimeExemption)}</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                          <p className="text-sm text-green-600">Available Exemption</p>
                          <p className="text-lg font-bold text-green-800">{formatCurrency(availableExemption)}</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                          <p className="text-sm text-green-600">Eligible for Exemption</p>
                          <p className="text-lg font-bold text-blue-600">{formatCurrency(eligibleForExemption)}</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                          <p className="text-sm text-green-600">Tax Savings</p>
                          <p className="text-lg font-bold text-green-600">{formatCurrency(taxSavings)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="p-4 bg-green-100 rounded-lg border border-green-300">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-800">LCGE Analysis Summary</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-green-700">Eligible Gains: </span>
                          <span className="font-medium text-green-800">{formatCurrency(lcgeCalculation.eligibleGains[0])}</span>
                        </div>
                        <div>
                          <span className="text-green-700">Exemption Applied: </span>
                          <span className="font-medium text-green-800">{formatCurrency(eligibleForExemption)}</span>
                        </div>
                        <div>
                          <span className="text-green-700">Potential Tax Savings: </span>
                          <span className="font-medium text-green-800">{formatCurrency(taxSavings)}</span>
                        </div>
                      </div>
                      {taxableGain > 0 && (
                        <div className="mt-2 p-2 bg-amber-100 rounded border border-amber-300">
                          <span className="text-amber-700 text-sm">
                            Remaining taxable gain: {formatCurrency(taxableGain)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Streams and Financial Projections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Streams */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Revenue Streams</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {revenueStreams.map((stream, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{stream.source}</h4>
                            <p className="text-sm text-gray-600">{stream.percentage}% of total revenue</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{formatCurrency(stream.amount)}</p>
                            <p className="text-sm text-green-600">+{stream.growth}% growth</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Financial Projections */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Financial Projections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={financialProjections}>
                          <XAxis dataKey="year" />
                          <YAxis tickFormatter={(value) => formatCurrency(value)} />
                          <ChartTooltip 
                            content={<ChartTooltipContent 
                              formatter={(value) => [formatCurrency(Number(value)), ""]}
                            />}
                          />
                          <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                          <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
                          <Line type="monotone" dataKey="netIncome" stroke="#10b981" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="shareholders" className="space-y-6">
              {/* Shareholders Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Shareholders</span>
                    </div>
                    <Button size="sm" onClick={() => setShowAddShareholder(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Shareholder
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {shareholders.map((shareholder) => (
                      <div key={shareholder.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{shareholder.name}</h4>
                          <p className="text-sm text-gray-600">
                            {shareholder.shares.toLocaleString()} shares ({shareholder.percentage}%)
                          </p>
                          <Badge variant="outline">{shareholder.type}</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteShareholder(shareholder.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="registration" className="space-y-6">
              {/* Business Registration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Business Registration Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Year Established</label>
                      <Input
                        type="number"
                        value={businessRegistration.yearEstablished}
                        onChange={(e) => setBusinessRegistration(prev => ({ 
                          ...prev, 
                          yearEstablished: Number(e.target.value) 
                        }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Shares Issued</label>
                      <Input
                        type="number"
                        value={businessRegistration.sharesIssued}
                        onChange={(e) => setBusinessRegistration(prev => ({ 
                          ...prev, 
                          sharesIssued: Number(e.target.value) 
                        }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Paid-Up Capital</label>
                      <Input
                        type="number"
                        value={businessRegistration.paidUpCapital}
                        onChange={(e) => setBusinessRegistration(prev => ({ 
                          ...prev, 
                          paidUpCapital: Number(e.target.value) 
                        }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Retained Earnings</label>
                      <Input
                        type="number"
                        value={businessRegistration.retainedEarnings}
                        onChange={(e) => setBusinessRegistration(prev => ({ 
                          ...prev, 
                          retainedEarnings: Number(e.target.value) 
                        }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Add Shareholder Dialog */}
      <Dialog open={showAddShareholder} onOpenChange={setShowAddShareholder}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Shareholder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={newShareholder.name}
                onChange={(e) => setNewShareholder({ ...newShareholder, name: e.target.value })}
                placeholder="Shareholder name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Number of Shares</label>
              <Input
                type="number"
                value={newShareholder.shares}
                onChange={(e) => setNewShareholder({ ...newShareholder, shares: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Percentage</label>
              <Input
                type="number"
                value={newShareholder.percentage}
                onChange={(e) => setNewShareholder({ ...newShareholder, percentage: Number(e.target.value) })}
                placeholder="0"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Share Type</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={newShareholder.type}
                onChange={(e) => setNewShareholder({ ...newShareholder, type: e.target.value as "Common" | "Preferred" })}
              >
                <option value="Common">Common</option>
                <option value="Preferred">Preferred</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddShareholder(false)}>Cancel</Button>
              <Button onClick={handleAddShareholder}>Add Shareholder</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
