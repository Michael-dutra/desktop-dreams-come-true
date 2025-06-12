import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, TrendingUp, Shield, Users, DollarSign, Target, AlertTriangle, CheckCircle, Plus, Edit, Trash2, FileText, Calendar, Share2 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

interface BusinessDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RevenueStream {
  id: string;
  name: string;
  value: number;
  color: string;
}

interface FinancialData {
  year: string;
  valuation: number;
  revenue: number;
  profit: number;
  expenses: number;
}

interface BusinessInsurance {
  id: string;
  type: "General Liability" | "Professional Liability" | "Term Life" | "Universal Life" | "Whole Life" | "Key Person Insurance" | "Business Interruption" | "Cyber Liability" | "Commercial Auto" | "Workers Compensation" | "Directors & Officers";
  coverage: string;
  status: "Active" | "Pending" | "Expired";
  premium: string;
  policyNumber?: string;
  insuredAmount?: number;
}

const BusinessDetailDialog = ({ isOpen, onClose }: BusinessDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Revenue Streams State
  const [revenueStreams, setRevenueStreams] = useState<RevenueStream[]>([
    { id: "1", name: "Core Services", value: 285000, color: "#8b5cf6" },
    { id: "2", name: "Consulting", value: 125000, color: "#06b6d4" },
    { id: "3", name: "Products", value: 75000, color: "#10b981" },
  ]);

  const [isEditingRevenue, setIsEditingRevenue] = useState(false);
  const [newRevenueName, setNewRevenueName] = useState("");
  const [newRevenueValue, setNewRevenueValue] = useState(0);

  // Financial Data State - Updated to show future projections from 2025-2029
  const [financialData, setFinancialData] = useState<FinancialData[]>([
    { year: "2025", valuation: 384000, revenue: 572000, profit: 131000, expenses: 441000 },
    { year: "2026", valuation: 453000, revenue: 675000, profit: 155000, expenses: 520000 },
    { year: "2027", valuation: 535000, revenue: 797000, profit: 183000, expenses: 614000 },
    { year: "2028", valuation: 632000, revenue: 940000, profit: 216000, expenses: 724000 },
    { year: "2029", valuation: 746000, revenue: 1109000, profit: 255000, expenses: 854000 },
  ]);

  const [isEditingFinancials, setIsEditingFinancials] = useState(false);

  // Insurance State
  const [businessInsurances, setBusinessInsurances] = useState<BusinessInsurance[]>([
    { id: "1", type: "General Liability", coverage: "$2M", status: "Active", premium: "$3,200", policyNumber: "GL-2024-001", insuredAmount: 2000000 },
    { id: "2", type: "Professional Liability", coverage: "$1M", status: "Active", premium: "$2,800", policyNumber: "PL-2024-002", insuredAmount: 1000000 },
    { id: "3", type: "Key Person Insurance", coverage: "$500K", status: "Active", premium: "$4,500", policyNumber: "KP-2024-003", insuredAmount: 500000 },
    { id: "4", type: "Business Interruption", coverage: "$750K", status: "Active", premium: "$1,900", policyNumber: "BI-2024-004", insuredAmount: 750000 },
  ]);

  const [isAddingInsurance, setIsAddingInsurance] = useState(false);
  const [newInsurance, setNewInsurance] = useState({
    type: "" as BusinessInsurance["type"],
    coverage: "",
    premium: "",
    policyNumber: "",
    insuredAmount: 0
  });

  // Revenue Stream Functions
  const addRevenueStream = () => {
    if (newRevenueName && newRevenueValue > 0) {
      const colors = ["#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#10b981"];
      const newStream: RevenueStream = {
        id: Date.now().toString(),
        name: newRevenueName,
        value: newRevenueValue,
        color: colors[revenueStreams.length % colors.length]
      };
      setRevenueStreams([...revenueStreams, newStream]);
      setNewRevenueName("");
      setNewRevenueValue(0);
    }
  };

  const deleteRevenueStream = (id: string) => {
    setRevenueStreams(revenueStreams.filter(stream => stream.id !== id));
  };

  const updateRevenueStream = (id: string, field: string, value: any) => {
    setRevenueStreams(revenueStreams.map(stream => 
      stream.id === id ? { ...stream, [field]: value } : stream
    ));
  };

  // Financial Data Functions
  const updateFinancialData = (year: string, field: string, value: number) => {
    setFinancialData(financialData.map(data => 
      data.year === year ? { ...data, [field]: value } : data
    ));
  };

  // Insurance Functions
  const addInsurance = () => {
    if (newInsurance.type && newInsurance.coverage && newInsurance.premium) {
      const insurance: BusinessInsurance = {
        id: Date.now().toString(),
        ...newInsurance,
        status: "Active"
      };
      setBusinessInsurances([...businessInsurances, insurance]);
      setNewInsurance({
        type: "" as BusinessInsurance["type"],
        coverage: "",
        premium: "",
        policyNumber: "",
        insuredAmount: 0
      });
      setIsAddingInsurance(false);
    }
  };

  const deleteInsurance = (id: string) => {
    setBusinessInsurances(businessInsurances.filter(insurance => insurance.id !== id));
  };

  const businessGrowthData = financialData;

  const businessMetrics = [
    { metric: "Gross Margin", value: "68%", trend: "+5%", positive: true },
    { metric: "Net Margin", value: "22%", trend: "+3%", positive: true },
    { metric: "Employee Count", value: "12", trend: "+2", positive: true },
    { metric: "Customer Retention", value: "94%", trend: "+2%", positive: true },
  ];

  const chartConfig = {
    valuation: { label: "Valuation", color: "#8b5cf6" },
    revenue: { label: "Revenue", color: "#06b6d4" },
    profit: { label: "Profit", color: "#10b981" },
    expenses: { label: "Expenses", color: "#ef4444" },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 text-2xl">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 className="h-6 w-6 text-purple-600" />
            </div>
            <span>Business Planning Details</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
            <TabsTrigger value="important">Important</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Business Valuation Projections (2025-2029)</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-64">
                    <AreaChart data={businessGrowthData}>
                      <defs>
                        <linearGradient id="valuationGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <ChartTooltip content={<ChartTooltipContent formatter={(value) => [`$${value.toLocaleString()}`, "Valuation"]} />} />
                      <Area type="monotone" dataKey="valuation" stroke="#8b5cf6" fill="url(#valuationGradient)" />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <span>Revenue Streams</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingRevenue(!isEditingRevenue)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-64">
                    <PieChart>
                      <Pie
                        data={revenueStreams}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {revenueStreams.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent formatter={(value) => [`$${value.toLocaleString()}`, ""]} />} />
                    </PieChart>
                  </ChartContainer>
                  
                  {isEditingRevenue && (
                    <div className="space-y-4 mt-4">
                      {revenueStreams.map((stream) => (
                        <div key={stream.id} className="flex items-center gap-2 p-2 border rounded">
                          <Input
                            value={stream.name}
                            onChange={(e) => updateRevenueStream(stream.id, 'name', e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            value={stream.value}
                            onChange={(e) => updateRevenueStream(stream.id, 'value', Number(e.target.value))}
                            className="w-32"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteRevenueStream(stream.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <div className="flex items-center gap-2 p-2 border rounded bg-gray-50">
                        <Input
                          placeholder="Revenue stream name"
                          value={newRevenueName}
                          onChange={(e) => setNewRevenueName(e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          placeholder="Amount"
                          value={newRevenueValue || ""}
                          onChange={(e) => setNewRevenueValue(Number(e.target.value))}
                          className="w-32"
                        />
                        <Button onClick={addRevenueStream} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {!isEditingRevenue && (
                    <div className="space-y-2 mt-4">
                      {revenueStreams.map((stream) => (
                        <div key={stream.name} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stream.color }} />
                            <span className="text-sm">{stream.name}</span>
                          </div>
                          <span className="text-sm font-medium">${stream.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Key Business Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {businessMetrics.map((metric) => (
                    <div key={metric.metric} className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">{metric.metric}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className={`text-sm ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.trend}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Revenue, Profit & Expenses Trends</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingFinancials(!isEditingFinancials)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <BarChart data={businessGrowthData}>
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="#06b6d4" name="Revenue" />
                    <Bar dataKey="profit" fill="#10b981" name="Profit" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {isEditingFinancials && (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Financial Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {financialData.map((data) => (
                      <div key={data.year} className="grid grid-cols-5 gap-4 items-center p-4 border rounded-lg">
                        <div>
                          <Label className="text-sm font-medium">{data.year}</Label>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Revenue</Label>
                          <Input
                            type="number"
                            value={data.revenue}
                            onChange={(e) => updateFinancialData(data.year, 'revenue', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Expenses</Label>
                          <Input
                            type="number"
                            value={data.expenses}
                            onChange={(e) => updateFinancialData(data.year, 'expenses', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Profit</Label>
                          <Input
                            type="number"
                            value={data.profit}
                            onChange={(e) => updateFinancialData(data.year, 'profit', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Valuation</Label>
                          <Input
                            type="number"
                            value={data.valuation}
                            onChange={(e) => updateFinancialData(data.year, 'valuation', Number(e.target.value))}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Year</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">$485,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profit</p>
                    <p className="text-2xl font-bold text-green-600">$105,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valuation</p>
                    <p className="text-2xl font-bold text-purple-600">$325,000</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Growth Rates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue Growth</p>
                    <p className="text-xl font-bold text-green-600">+18% YoY</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profit Growth</p>
                    <p className="text-xl font-bold text-green-600">+25% YoY</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valuation Growth</p>
                    <p className="text-xl font-bold text-green-600">+18% YoY</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Projections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">2025 Revenue</p>
                    <p className="text-xl font-bold">$572,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">2025 Profit</p>
                    <p className="text-xl font-bold">$131,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">2025 Valuation</p>
                    <p className="text-xl font-bold">$384,000</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insurance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Business Insurance Coverage</span>
                  </div>
                  <Button onClick={() => setIsAddingInsurance(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Insurance
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {businessInsurances.map((insurance) => (
                    <div key={insurance.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{insurance.type}</h4>
                        <p className="text-sm text-muted-foreground">Coverage: {insurance.coverage}</p>
                        {insurance.policyNumber && (
                          <p className="text-xs text-muted-foreground">Policy: {insurance.policyNumber}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge variant="secondary" className="mb-2">
                            {insurance.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            Annual Premium: {insurance.premium}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteInsurance(insurance.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {isAddingInsurance && (
                  <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-medium mb-4">Add New Insurance</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Insurance Type</Label>
                        <Select 
                          value={newInsurance.type} 
                          onValueChange={(value: BusinessInsurance["type"]) => 
                            setNewInsurance({...newInsurance, type: value})
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select insurance type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General Liability">General Liability</SelectItem>
                            <SelectItem value="Professional Liability">Professional Liability</SelectItem>
                            <SelectItem value="Term Life">Term Life Insurance</SelectItem>
                            <SelectItem value="Universal Life">Universal Life Insurance</SelectItem>
                            <SelectItem value="Whole Life">Whole Life Insurance</SelectItem>
                            <SelectItem value="Key Person Insurance">Key Person Insurance</SelectItem>
                            <SelectItem value="Business Interruption">Business Interruption</SelectItem>
                            <SelectItem value="Cyber Liability">Cyber Liability</SelectItem>
                            <SelectItem value="Commercial Auto">Commercial Auto</SelectItem>
                            <SelectItem value="Workers Compensation">Workers Compensation</SelectItem>
                            <SelectItem value="Directors & Officers">Directors & Officers</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Coverage Amount</Label>
                        <Input
                          placeholder="$1M"
                          value={newInsurance.coverage}
                          onChange={(e) => setNewInsurance({...newInsurance, coverage: e.target.value})}
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Annual Premium</Label>
                        <Input
                          placeholder="$3,200"
                          value={newInsurance.premium}
                          onChange={(e) => setNewInsurance({...newInsurance, premium: e.target.value})}
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Policy Number (Optional)</Label>
                        <Input
                          placeholder="POL-2024-001"
                          value={newInsurance.policyNumber}
                          onChange={(e) => setNewInsurance({...newInsurance, policyNumber: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button onClick={addInsurance}>Add Insurance</Button>
                      <Button variant="outline" onClick={() => setIsAddingInsurance(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Coverage Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Coverage</p>
                    <p className="text-2xl font-bold">$4.25M</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Annual Premiums</p>
                    <p className="text-xl font-bold">$12,400</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Coverage Ratio</p>
                    <p className="text-xl font-bold">13:1</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">General Liability</span>
                    <Badge variant="secondary">Well Covered</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Key Person Risk</span>
                    <Badge variant="secondary">Covered</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Business Interruption</span>
                    <Badge variant="outline">Consider Increase</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cyber Liability</span>
                    <Badge variant="destructive">Not Covered</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="important" className="space-y-6">
            {/* Business Registration Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Business Registration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Corporation Number</p>
                  <p className="text-lg font-bold">123456789</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Business Number</p>
                  <p className="text-lg font-bold">987654321 RC0001</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tax Year End</p>
                  <p className="text-lg font-bold">December 31</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next Tax Return Due</p>
                  <p className="text-lg font-bold text-orange-600">June 30, 2025</p>
                </div>
              </CardContent>
            </Card>

            {/* Tax Planning Accounts Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Tax Planning Accounts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-muted-foreground">Capital Dividend Account</p>
                    <p className="text-2xl font-bold text-green-600">$45,000</p>
                    <p className="text-xs text-green-600">Available for tax-free distribution</p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-muted-foreground">Eligible LCGE Remaining</p>
                    <p className="text-2xl font-bold text-blue-600">$971,190</p>
                    <p className="text-xs text-blue-600">Lifetime Capital Gains Exemption</p>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-muted-foreground">LCGE Used to Date</p>
                    <p className="text-2xl font-bold">$0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shareholder Structure Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Shareholder Structure</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">John Smith</h4>
                      <p className="text-sm text-muted-foreground">Class A Common</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">100 shares</p>
                      <p className="text-sm text-muted-foreground">60%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Jane Smith</h4>
                      <p className="text-sm text-muted-foreground">Class A Common</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">67 shares</p>
                      <p className="text-sm text-muted-foreground">40%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share Classes Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Share2 className="h-5 w-5" />
                  <span>Share Classes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Class A Common</h4>
                    <p className="text-sm text-muted-foreground mb-2">Voting common shares</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Outstanding</p>
                        <p className="font-bold">167</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Voting Rights</p>
                        <Badge variant="secondary">Yes</Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Dividend Rights</p>
                        <Badge variant="secondary">Yes</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Class B Preferred</h4>
                    <p className="text-sm text-muted-foreground mb-2">Non-voting preferred shares</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Outstanding</p>
                        <p className="font-bold">0</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Voting Rights</p>
                        <Badge variant="outline">No</Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Dividend Rights</p>
                        <Badge variant="secondary">Fixed 5%</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Corporate Structure Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Corporate Structure</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Smith Holdings Inc.</h4>
                      <p className="text-sm text-muted-foreground">Investment holding</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">Active</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Ownership: 100%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Family Trust Co.</h4>
                      <p className="text-sm text-muted-foreground">Estate planning</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">Trust</Badge>
                      <p className="text-sm text-muted-foreground mt-1">Ownership: 75%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Dates Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Important Dates</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium">Corporate Tax Return</p>
                    <p className="text-sm text-orange-600">June 30, 2025</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium">Annual Return</p>
                    <p className="text-sm text-blue-600">March 31, 2025</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium">Payroll Remittance</p>
                    <p className="text-sm text-green-600">15th of each month</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium">GST/HST Filing</p>
                    <p className="text-sm text-purple-600">Quarterly</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tax Planning Opportunities Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Tax Planning Opportunities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800">Capital Dividend Distribution</h4>
                    <p className="text-sm text-green-600">$45,000 available for tax-free distribution</p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800">LCGE Planning</h4>
                    <p className="text-sm text-blue-600">$971,190 lifetime exemption available</p>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-medium text-purple-800">Income Splitting</h4>
                    <p className="text-sm text-purple-600">Consider family trust distributions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            Schedule Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessDetailDialog;
