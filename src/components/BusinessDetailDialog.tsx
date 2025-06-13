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

interface BusinessRegistration {
  corporationNumber: string;
  businessNumber: string;
  taxYearEnd: string;
  nextTaxReturnDue: string;
}

interface TaxAccount {
  id: string;
  name: string;
  amount: string;
  description: string;
}

interface Shareholder {
  id: string;
  name: string;
  shareClass: string;
  shares: number;
  percentage: number;
}

interface ShareClass {
  id: string;
  name: string;
  description: string;
  outstanding: number;
  votingRights: boolean;
  dividendRights: string;
}

interface CorporateEntity {
  id: string;
  name: string;
  type: string;
  status: string;
  ownership: string;
}

interface ImportantDate {
  id: string;
  name: string;
  date: string;
  type: string;
}

interface TaxOpportunity {
  id: string;
  title: string;
  description: string;
  type: string;
}

interface CurrentYearData {
  revenue: number;
  profit: number;
  valuation: number;
}

interface GrowthRatesData {
  revenueGrowth: number;
  profitGrowth: number;
  valuationGrowth: number;
}

interface ProjectionsData {
  revenue2025: number;
  profit2025: number;
  valuation2025: number;
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

  // Current Year Data State
  const [currentYearData, setCurrentYearData] = useState<CurrentYearData>({
    revenue: 485000,
    profit: 105000,
    valuation: 325000
  });

  const [isEditingCurrentYear, setIsEditingCurrentYear] = useState(false);

  // Growth Rates State
  const [growthRatesData, setGrowthRatesData] = useState<GrowthRatesData>({
    revenueGrowth: 18,
    profitGrowth: 25,
    valuationGrowth: 18
  });

  const [isEditingGrowthRates, setIsEditingGrowthRates] = useState(false);

  // Projections State
  const [projectionsData, setProjectionsData] = useState<ProjectionsData>({
    revenue2025: 572000,
    profit2025: 131000,
    valuation2025: 384000
  });

  const [isEditingProjections, setIsEditingProjections] = useState(false);

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

  // Business Registration State
  const [businessRegistration, setBusinessRegistration] = useState<BusinessRegistration>({
    corporationNumber: "123456789",
    businessNumber: "987654321 RC0001",
    taxYearEnd: "December 31",
    nextTaxReturnDue: "June 30, 2025"
  });

  const [isEditingRegistration, setIsEditingRegistration] = useState(false);

  // Tax Accounts State
  const [taxAccounts, setTaxAccounts] = useState<TaxAccount[]>([
    { id: "1", name: "Capital Dividend Account", amount: "$45,000", description: "Available for tax-free distribution" },
    { id: "2", name: "Eligible LCGE Remaining", amount: "$971,190", description: "Lifetime Capital Gains Exemption" },
    { id: "3", name: "LCGE Used to Date", amount: "$0", description: "" },
  ]);

  const [isEditingTaxAccounts, setIsEditingTaxAccounts] = useState(false);

  // Shareholders State
  const [shareholders, setShareholders] = useState<Shareholder[]>([
    { id: "1", name: "John Smith", shareClass: "Class A Common", shares: 100, percentage: 60 },
    { id: "2", name: "Jane Smith", shareClass: "Class A Common", shares: 67, percentage: 40 },
  ]);

  const [isEditingShareholders, setIsEditingShareholders] = useState(false);

  // Share Classes State
  const [shareClasses, setShareClasses] = useState<ShareClass[]>([
    { id: "1", name: "Class A Common", description: "Voting common shares", outstanding: 167, votingRights: true, dividendRights: "Yes" },
    { id: "2", name: "Class B Preferred", description: "Non-voting preferred shares", outstanding: 0, votingRights: false, dividendRights: "Fixed 5%" },
  ]);

  const [isEditingShareClasses, setIsEditingShareClasses] = useState(false);

  // Corporate Structure State
  const [corporateEntities, setCorporateEntities] = useState<CorporateEntity[]>([
    { id: "1", name: "Smith Holdings Inc.", type: "Investment holding", status: "Active", ownership: "100%" },
    { id: "2", name: "Family Trust Co.", type: "Estate planning", status: "Trust", ownership: "75%" },
  ]);

  const [isEditingCorporate, setIsEditingCorporate] = useState(false);

  // Important Dates State
  const [importantDates, setImportantDates] = useState<ImportantDate[]>([
    { id: "1", name: "Corporate Tax Return", date: "June 30, 2025", type: "tax" },
    { id: "2", name: "Annual Return", date: "March 31, 2025", type: "filing" },
    { id: "3", name: "Payroll Remittance", date: "15th of each month", type: "payroll" },
    { id: "4", name: "GST/HST Filing", date: "Quarterly", type: "tax" },
  ]);

  const [isEditingDates, setIsEditingDates] = useState(false);

  // Tax Opportunities State
  const [taxOpportunities, setTaxOpportunities] = useState<TaxOpportunity[]>([
    { id: "1", title: "Capital Dividend Distribution", description: "$45,000 available for tax-free distribution", type: "green" },
    { id: "2", title: "LCGE Planning", description: "$971,190 lifetime exemption available", type: "blue" },
    { id: "3", title: "Income Splitting", description: "Consider family trust distributions", type: "purple" },
  ]);

  const [isEditingOpportunities, setIsEditingOpportunities] = useState(false);

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

  // Helper function to format large numbers
  const formatLargeNumber = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 0)}K`;
    }
    return value.toString();
  };

  const businessGrowthData = financialData;

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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
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
                      <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
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
                          <span className="text-sm font-medium">${formatLargeNumber(stream.value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

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
                    <YAxis tickFormatter={(value) => `$${formatLargeNumber(value)}`} />
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
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>Current Year</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingCurrentYear(!isEditingCurrentYear)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditingCurrentYear ? (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Revenue</Label>
                        <Input
                          type="number"
                          value={currentYearData.revenue}
                          onChange={(e) => setCurrentYearData({...currentYearData, revenue: Number(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Profit</Label>
                        <Input
                          type="number"
                          value={currentYearData.profit}
                          onChange={(e) => setCurrentYearData({...currentYearData, profit: Number(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Valuation</Label>
                        <Input
                          type="number"
                          value={currentYearData.valuation}
                          onChange={(e) => setCurrentYearData({...currentYearData, valuation: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-2xl font-bold">${formatLargeNumber(currentYearData.revenue)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Profit</p>
                        <p className="text-2xl font-bold text-green-600">${formatLargeNumber(currentYearData.profit)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Valuation</p>
                        <p className="text-2xl font-bold text-purple-600">${formatLargeNumber(currentYearData.valuation)}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>Growth Rates</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingGrowthRates(!isEditingGrowthRates)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditingGrowthRates ? (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Revenue Growth (%)</Label>
                        <Input
                          type="number"
                          value={growthRatesData.revenueGrowth}
                          onChange={(e) => setGrowthRatesData({...growthRatesData, revenueGrowth: Number(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Profit Growth (%)</Label>
                        <Input
                          type="number"
                          value={growthRatesData.profitGrowth}
                          onChange={(e) => setGrowthRatesData({...growthRatesData, profitGrowth: Number(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Valuation Growth (%)</Label>
                        <Input
                          type="number"
                          value={growthRatesData.valuationGrowth}
                          onChange={(e) => setGrowthRatesData({...growthRatesData, valuationGrowth: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue Growth</p>
                        <p className="text-xl font-bold text-green-600">+{growthRatesData.revenueGrowth}% YoY</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Profit Growth</p>
                        <p className="text-xl font-bold text-green-600">+{growthRatesData.profitGrowth}% YoY</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Valuation Growth</p>
                        <p className="text-xl font-bold text-green-600">+{growthRatesData.valuationGrowth}% YoY</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>Projections</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingProjections(!isEditingProjections)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditingProjections ? (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">2025 Revenue</Label>
                        <Input
                          type="number"
                          value={projectionsData.revenue2025}
                          onChange={(e) => setProjectionsData({...projectionsData, revenue2025: Number(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">2025 Profit</Label>
                        <Input
                          type="number"
                          value={projectionsData.profit2025}
                          onChange={(e) => setProjectionsData({...projectionsData, profit2025: Number(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">2025 Valuation</Label>
                        <Input
                          type="number"
                          value={projectionsData.valuation2025}
                          onChange={(e) => setProjectionsData({...projectionsData, valuation2025: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">2025 Revenue</p>
                        <p className="text-xl font-bold">${formatLargeNumber(projectionsData.revenue2025)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">2025 Profit</p>
                        <p className="text-xl font-bold">${formatLargeNumber(projectionsData.profit2025)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">2025 Valuation</p>
                        <p className="text-xl font-bold">${formatLargeNumber(projectionsData.valuation2025)}</p>
                      </div>
                    </>
                  )}
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

            {/* Enhanced Risk Assessment Section - Coverage Summary Removed */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">General Liability</span>
                        <Badge variant="secondary">Well Covered</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your $2M General Liability coverage provides excellent protection against third-party claims for bodily injury, property damage, and personal injury. This amount is well-suited for your business size and industry, offering comprehensive protection against common business risks. The coverage limit exceeds typical industry requirements and provides a strong defense against potential lawsuits.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Key Person Risk</span>
                        <Badge variant="secondary">Covered</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your $500K Key Person Insurance provides adequate protection for the immediate financial impact of losing a key executive. This coverage will help maintain business operations and provide time to find suitable replacements. However, given your business growth trajectory and increasing valuation, consider reviewing this amount annually to ensure it keeps pace with the actual financial impact a key person loss would have on your revenue and operations.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Business Interruption</span>
                        <Badge variant="outline">Consider Increase</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your current $750K Business Interruption coverage may be insufficient given your projected revenue growth to $572K in 2025. This coverage should typically represent 12-18 months of gross revenue to ensure adequate protection. Consider increasing this to $850K-$1M to better align with your revenue projections and ensure you can maintain operations during an extended interruption period. The relatively low premium increase would provide significantly better protection.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Cyber Liability</span>
                        <Badge variant="destructive">Not Covered</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        You currently lack Cyber Liability insurance, which represents a significant gap in your risk management strategy. Given the increasing frequency of cyber attacks on businesses of all sizes, this coverage is essential. Cyber incidents can result in data breaches, ransomware attacks, business interruption, and regulatory fines. For a business of your size, consider $1M-$2M in cyber liability coverage. This should include first-party costs (data recovery, business interruption) and third-party liability (customer notification, legal defense, regulatory fines). The annual premium would typically be $2,000-$4,000, which is minimal compared to the potential exposure.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Professional Liability</span>
                        <Badge variant="secondary">Well Covered</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your $1M Professional Liability coverage provides solid protection against errors and omissions claims related to your professional services. This coverage is appropriate for your current business size and client base. The policy protects against claims alleging negligent acts, errors, or omissions in your professional services, and covers legal defense costs and settlements. Monitor this coverage as your business grows and consider increasing if you take on larger clients or higher-risk projects.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="important" className="space-y-6">
            {/* Business Registration Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Business Registration</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingRegistration(!isEditingRegistration)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditingRegistration ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium">Corporation Number</Label>
                      <Input
                        value={businessRegistration.corporationNumber}
                        onChange={(e) => setBusinessRegistration({...businessRegistration, corporationNumber: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Business Number</Label>
                      <Input
                        value={businessRegistration.businessNumber}
                        onChange={(e) => setBusinessRegistration({...businessRegistration, businessNumber: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Tax Year End</Label>
                      <Input
                        value={businessRegistration.taxYearEnd}
                        onChange={(e) => setBusinessRegistration({...businessRegistration, taxYearEnd: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Next Tax Return Due</Label>
                      <Input
                        value={businessRegistration.nextTaxReturnDue}
                        onChange={(e) => setBusinessRegistration({...businessRegistration, nextTaxReturnDue: e.target.value})}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Corporation Number</p>
                      <p className="text-lg font-bold">{businessRegistration.corporationNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Business Number</p>
                      <p className="text-lg font-bold">{businessRegistration.businessNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tax Year End</p>
                      <p className="text-lg font-bold">{businessRegistration.taxYearEnd}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Next Tax Return Due</p>
                      <p className="text-lg font-bold text-orange-600">{businessRegistration.nextTaxReturnDue}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tax Planning Accounts Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Tax Planning Accounts</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingTaxAccounts(!isEditingTaxAccounts)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditingTaxAccounts ? (
                  <div className="space-y-4">
                    {taxAccounts.map((account) => (
                      <div key={account.id} className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
                        <div>
                          <Label className="text-sm font-medium">Account Name</Label>
                          <Input
                            value={account.name}
                            onChange={(e) => setTaxAccounts(taxAccounts.map(a => 
                              a.id === account.id ? {...a, name: e.target.value} : a
                            ))}
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Amount</Label>
                          <Input
                            value={account.amount}
                            onChange={(e) => setTaxAccounts(taxAccounts.map(a => 
                              a.id === account.id ? {...a, amount: e.target.value} : a
                            ))}
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Description</Label>
                          <Input
                            value={account.description}
                            onChange={(e) => setTaxAccounts(taxAccounts.map(a => 
                              a.id === account.id ? {...a, description: e.target.value} : a
                            ))}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {taxAccounts.map((account) => (
                      <div key={account.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-muted-foreground">{account.name}</p>
                        <p className="text-2xl font-bold text-green-600">{account.amount}</p>
                        <p className="text-xs text-green-600">{account.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shareholder Structure Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Shareholder Structure</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingShareholders(!isEditingShareholders)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shareholders.map((shareholder) => (
                    <div key={shareholder.id} className="flex items-center justify-between p-4 border rounded-lg">
                      {isEditingShareholders ? (
                        <div className="grid grid-cols-4 gap-4 w-full">
                          <Input
                            value={shareholder.name}
                            onChange={(e) => setShareholders(shareholders.map(s => 
                              s.id === shareholder.id ? {...s, name: e.target.value} : s
                            ))}
                          />
                          <Input
                            value={shareholder.shareClass}
                            onChange={(e) => setShareholders(shareholders.map(s => 
                              s.id === shareholder.id ? {...s, shareClass: e.target.value} : s
                            ))}
                          />
                          <Input
                            type="number"
                            value={shareholder.shares}
                            onChange={(e) => setShareholders(shareholders.map(s => 
                              s.id === shareholder.id ? {...s, shares: Number(e.target.value)} : s
                            ))}
                          />
                          <Input
                            type="number"
                            value={shareholder.percentage}
                            onChange={(e) => setShareholders(shareholders.map(s => 
                              s.id === shareholder.id ? {...s, percentage: Number(e.target.value)} : s
                            ))}
                          />
                        </div>
                      ) : (
                        <>
                          <div>
                            <h4 className="font-medium">{shareholder.name}</h4>
                            <p className="text-sm text-muted-foreground">{shareholder.shareClass}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{shareholder.shares} shares</p>
                            <p className="text-sm text-muted-foreground">{shareholder.percentage}%</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Share Classes Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Share2 className="h-5 w-5" />
                    <span>Share Classes</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingShareClasses(!isEditingShareClasses)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shareClasses.map((shareClass) => (
                    <div key={shareClass.id} className="p-4 border rounded-lg">
                      {isEditingShareClasses ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Class Name</Label>
                              <Input
                                value={shareClass.name}
                                onChange={(e) => setShareClasses(shareClasses.map(sc => 
                                  sc.id === shareClass.id ? {...sc, name: e.target.value} : sc
                                ))}
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Outstanding Shares</Label>
                              <Input
                                type="number"
                                value={shareClass.outstanding}
                                onChange={(e) => setShareClasses(shareClasses.map(sc => 
                                  sc.id === shareClass.id ? {...sc, outstanding: Number(e.target.value)} : sc
                                ))}
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Description</Label>
                            <Input
                              value={shareClass.description}
                              onChange={(e) => setShareClasses(shareClasses.map(sc => 
                                sc.id === shareClass.id ? {...sc, description: e.target.value} : sc
                              ))}
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <h4 className="font-medium mb-2">{shareClass.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{shareClass.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Outstanding</p>
                              <p className="font-bold">{shareClass.outstanding}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Voting Rights</p>
                              <Badge variant={shareClass.votingRights ? "secondary" : "outline"}>
                                {shareClass.votingRights ? "Yes" : "No"}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Dividend Rights</p>
                              <Badge variant="secondary">{shareClass.dividendRights}</Badge>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Corporate Structure Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Corporate Structure</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingCorporate(!isEditingCorporate)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {corporateEntities.map((entity) => (
                    <div key={entity.id} className="flex items-center justify-between p-4 border rounded-lg">
                      {isEditingCorporate ? (
                        <div className="grid grid-cols-4 gap-4 w-full">
                          <Input
                            value={entity.name}
                            onChange={(e) => setCorporateEntities(corporateEntities.map(ce => 
                              ce.id === entity.id ? {...ce, name: e.target.value} : ce
                            ))}
                          />
                          <Input
                            value={entity.type}
                            onChange={(e) => setCorporateEntities(corporateEntities.map(ce => 
                              ce.id === entity.id ? {...ce, type: e.target.value} : ce
                            ))}
                          />
                          <Input
                            value={entity.status}
                            onChange={(e) => setCorporateEntities(corporateEntities.map(ce => 
                              ce.id === entity.id ? {...ce, status: e.target.value} : ce
                            ))}
                          />
                          <Input
                            value={entity.ownership}
                            onChange={(e) => setCorporateEntities(corporateEntities.map(ce => 
                              ce.id === entity.id ? {...ce, ownership: e.target.value} : ce
                            ))}
                          />
                        </div>
                      ) : (
                        <>
                          <div>
                            <h4 className="font-medium">{entity.name}</h4>
                            <p className="text-sm text-muted-foreground">{entity.type}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={entity.status === "Active" ? "secondary" : "outline"}>{entity.status}</Badge>
                            <p className="text-sm text-muted-foreground mt-1">Ownership: {entity.ownership}</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Important Dates Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Important Dates</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingDates(!isEditingDates)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {importantDates.map((date) => (
                    <div key={date.id} className="p-3 border rounded-lg">
                      {isEditingDates ? (
                        <div className="space-y-2">
                          <Input
                            value={date.name}
                            onChange={(e) => setImportantDates(importantDates.map(d => 
                              d.id === date.id ? {...d, name: e.target.value} : d
                            ))}
                          />
                          <Input
                            value={date.date}
                            onChange={(e) => setImportantDates(importantDates.map(d => 
                              d.id === date.id ? {...d, date: e.target.value} : d
                            ))}
                          />
                        </div>
                      ) : (
                        <>
                          <p className="font-medium">{date.name}</p>
                          <p className={`text-sm ${
                            date.type === 'tax' ? 'text-orange-600' : 
                            date.type === 'filing' ? 'text-blue-600' : 
                            date.type === 'payroll' ? 'text-green-600' : 'text-purple-600'
                          }`}>{date.date}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tax Planning Opportunities Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Tax Planning Opportunities</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingOpportunities(!isEditingOpportunities)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {taxOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className={`p-4 ${
                      opportunity.type === 'green' ? 'bg-green-50 border border-green-200' :
                      opportunity.type === 'blue' ? 'bg-blue-50 border border-blue-200' :
                      'bg-purple-50 border border-purple-200'
                    } rounded-lg`}>
                      {isEditingOpportunities ? (
                        <div className="space-y-2">
                          <Input
                            value={opportunity.title}
                            onChange={(e) => setTaxOpportunities(taxOpportunities.map(to => 
                              to.id === opportunity.id ? {...to, title: e.target.value} : to
                            ))}
                          />
                          <Input
                            value={opportunity.description}
                            onChange={(e) => setTaxOpportunities(taxOpportunities.map(to => 
                              to.id === opportunity.id ? {...to, description: e.target.value} : to
                            ))}
                          />
                        </div>
                      ) : (
                        <>
                          <h4 className={`font-medium ${
                            opportunity.type === 'green' ? 'text-green-800' :
                            opportunity.type === 'blue' ? 'text-blue-800' :
                            'text-purple-800'
                          }`}>{opportunity.title}</h4>
                          <p className={`text-sm ${
                            opportunity.type === 'green' ? 'text-green-600' :
                            opportunity.type === 'blue' ? 'text-blue-600' :
                            'text-purple-600'
                          }`}>{opportunity.description}</p>
                        </>
                      )}
                    </div>
                  ))}
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
