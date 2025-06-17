import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Building2, TrendingUp, Shield, Users, DollarSign, Target, AlertTriangle, CheckCircle, Plus, Edit, Trash2, FileText, Calendar, Share2, PiggyBank, Calculator, X } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { EditableField } from "./EditableField";
import { GrowthChart } from "./GrowthChart";

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

interface CorporateAsset {
  id: string;
  name: string;
  type: "Corporate Real Estate" | "Business Investments" | "Equipment & Machinery" | "Intellectual Property" | "Corporate Bonds" | "Business Cash/Savings";
  currentValue: number;
  costBase: number;
  growthRate: number;
  years: number;
  monthlyContribution: number;
  address?: string;
  mortgage?: number;
}

const BusinessDetailDialog = ({ isOpen, onClose }: BusinessDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const [revenueStreams, setRevenueStreams] = useState<RevenueStream[]>([
    { id: "1", name: "Core Services", value: 285000, color: "#8b5cf6" },
    { id: "2", name: "Consulting", value: 125000, color: "#06b6d4" },
    { id: "3", name: "Products", value: 75000, color: "#10b981" },
  ]);

  const [isEditingRevenue, setIsEditingRevenue] = useState(false);
  const [newRevenueName, setNewRevenueName] = useState("");
  const [newRevenueValue, setNewRevenueValue] = useState(0);

  const [financialData, setFinancialData] = useState<FinancialData[]>([
    { year: "2025", valuation: 384000, revenue: 572000, profit: 131000, expenses: 441000 },
    { year: "2026", valuation: 453000, revenue: 675000, profit: 155000, expenses: 520000 },
    { year: "2027", valuation: 535000, revenue: 797000, profit: 183000, expenses: 614000 },
    { year: "2028", valuation: 632000, revenue: 940000, profit: 216000, expenses: 724000 },
    { year: "2029", valuation: 746000, revenue: 1109000, profit: 255000, expenses: 854000 },
  ]);

  const [isEditingFinancials, setIsEditingFinancials] = useState(false);

  const [currentYearData, setCurrentYearData] = useState<CurrentYearData>({
    revenue: 485000,
    profit: 105000,
    valuation: 325000
  });

  const [isEditingCurrentYear, setIsEditingCurrentYear] = useState(false);

  const [growthRatesData, setGrowthRatesData] = useState<GrowthRatesData>({
    revenueGrowth: 18,
    profitGrowth: 25,
    valuationGrowth: 18
  });

  const [isEditingGrowthRates, setIsEditingGrowthRates] = useState(false);

  const [projectionsData, setProjectionsData] = useState<ProjectionsData>({
    revenue2025: 572000,
    profit2025: 131000,
    valuation2025: 384000
  });

  const [isEditingProjections, setIsEditingProjections] = useState(false);

  // Secondary Will calculation state
  const [businessValuationForWill, setBusinessValuationForWill] = useState([325000]);

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

  const [businessRegistration, setBusinessRegistration] = useState<BusinessRegistration>({
    corporationNumber: "123456789",
    businessNumber: "987654321 RC0001",
    taxYearEnd: "December 31",
    nextTaxReturnDue: "June 30, 2025"
  });

  const [isEditingRegistration, setIsEditingRegistration] = useState(false);

  const [taxAccounts, setTaxAccounts] = useState<TaxAccount[]>([
    { id: "1", name: "Capital Dividend Account", amount: "$45,000", description: "Available for tax-free distribution" },
    { id: "2", name: "Eligible LCGE Remaining", amount: "$971,190", description: "Lifetime Capital Gains Exemption" },
    { id: "3", name: "LCGE Used to Date", amount: "$0", description: "" },
  ]);

  const [isEditingTaxAccounts, setIsEditingTaxAccounts] = useState(false);

  const [shareholders, setShareholders] = useState<Shareholder[]>([
    { id: "1", name: "John Smith", shareClass: "Class A Common", shares: 100, percentage: 60 },
    { id: "2", name: "Jane Smith", shareClass: "Class A Common", shares: 67, percentage: 40 },
  ]);

  const [isEditingShareholders, setIsEditingShareholders] = useState(false);

  const [shareClasses, setShareClasses] = useState<ShareClass[]>([
    { id: "1", name: "Class A Common", description: "Voting common shares", outstanding: 167, votingRights: true, dividendRights: "Yes" },
    { id: "2", name: "Class B Preferred", description: "Non-voting preferred shares", outstanding: 0, votingRights: false, dividendRights: "Fixed 5%" },
  ]);

  const [isEditingShareClasses, setIsEditingShareClasses] = useState(false);

  const [corporateEntities, setCorporateEntities] = useState<CorporateEntity[]>([
    { id: "1", name: "Smith Holdings Inc.", type: "Investment holding", status: "Active", ownership: "100%" },
    { id: "2", name: "Family Trust Co.", type: "Estate planning", status: "Trust", ownership: "75%" },
  ]);

  const [isEditingCorporate, setIsEditingCorporate] = useState(false);

  const [importantDates, setImportantDates] = useState<ImportantDate[]>([
    { id: "1", name: "Corporate Tax Return", date: "June 30, 2025", type: "tax" },
    { id: "2", name: "Annual Return", date: "March 31, 2025", type: "filing" },
    { id: "3", name: "Payroll Remittance", date: "15th of each month", type: "payroll" },
    { id: "4", name: "GST/HST Filing", date: "Quarterly", type: "tax" },
  ]);

  const [isEditingDates, setIsEditingDates] = useState(false);

  const [taxOpportunities, setTaxOpportunities] = useState<TaxOpportunity[]>([
    { id: "1", title: "Capital Dividend Distribution", description: "$45,000 available for tax-free distribution", type: "green" },
    { id: "2", title: "LCGE Planning", description: "$971,190 lifetime exemption available", type: "blue" },
    { id: "3", title: "Income Splitting", description: "Consider family trust distributions", type: "purple" },
  ]);

  const [isEditingOpportunities, setIsEditingOpportunities] = useState(false);

  const [corporateAssets, setCorporateAssets] = useState<CorporateAsset[]>([
    {
      id: "1",
      name: "Office Building",
      type: "Corporate Real Estate",
      currentValue: 850000,
      costBase: 720000,
      growthRate: 4,
      years: 10,
      monthlyContribution: 0,
      address: "123 Business Ave",
      mortgage: 350000
    },
    {
      id: "2", 
      name: "Investment Portfolio",
      type: "Business Investments",
      currentValue: 250000,
      costBase: 200000,
      growthRate: 7,
      years: 15,
      monthlyContribution: 2000
    }
  ]);

  const [isAddingCorporateAsset, setIsAddingCorporateAsset] = useState(false);
  const [newCorporateAsset, setNewCorporateAsset] = useState({
    name: "",
    type: "" as CorporateAsset["type"],
    currentValue: 0,
    costBase: 0,
    growthRate: 5,
    years: 10,
    monthlyContribution: 0
  });

  // LCGE Calculator state
  const [lcgeUsed, setLcgeUsed] = useState(0);
  const [totalLcgeLimit] = useState(1250000); // Updated LCGE limit
  const [companyValuation, setCompanyValuation] = useState([325000]);
  const [totalCorporateAssets, setTotalCorporateAssets] = useState([150000]);
  const [activeBusinessAssets, setActiveBusinessAssets] = useState([280000]);

  // Secondary Will calculation
  const calculateProbateFees = () => {
    return businessValuationForWill[0] * 0.015;
  };

  const probateFees = calculateProbateFees();

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

  const updateFinancialData = (year: string, field: string, value: number) => {
    setFinancialData(financialData.map(data => 
      data.year === year ? { ...data, [field]: value } : data
    ));
  };

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

  const addCorporateAsset = () => {
    if (newCorporateAsset.name && newCorporateAsset.type && newCorporateAsset.currentValue > 0) {
      const asset: CorporateAsset = {
        id: Date.now().toString(),
        ...newCorporateAsset
      };
      setCorporateAssets([...corporateAssets, asset]);
      setNewCorporateAsset({
        name: "",
        type: "" as CorporateAsset["type"],
        currentValue: 0,
        costBase: 0,
        growthRate: 5,
        years: 10,
        monthlyContribution: 0
      });
      setIsAddingCorporateAsset(false);
    }
  };

  const deleteCorporateAsset = (id: string) => {
    setCorporateAssets(corporateAssets.filter(asset => asset.id !== id));
  };

  const updateCorporateAsset = (id: string, field: string, value: any) => {
    setCorporateAssets(corporateAssets.map(asset => 
      asset.id === id ? { ...asset, [field]: value } : asset
    ));
  };

  // LCGE Calculator functions
  const calculateRemainingLcge = () => {
    return totalLcgeLimit - lcgeUsed;
  };

  const calculateActiveAssetRatio = () => {
    const totalAssets = totalCorporateAssets[0];
    const activeAssets = activeBusinessAssets[0];
    const ratio = totalAssets > 0 ? (activeAssets / totalAssets) * 100 : 0;
    
    let status = "❌ Fails QSBC Test";
    let statusColor = "text-red-600";
    let bgColor = "bg-red-50 border-red-200";
    
    if (ratio >= 90) {
      status = "✅ LCGE Eligible";
      statusColor = "text-green-600";
      bgColor = "bg-green-50 border-green-200";
    } else if (ratio >= 50) {
      status = "⚠️ Purification Warning";
      statusColor = "text-yellow-600";
      bgColor = "bg-yellow-50 border-yellow-200";
    }
    
    return {
      ratio,
      status,
      statusColor,
      bgColor
    };
  };

  const calculateLcgeAnalysis = () => {
    const costBase = 100000; // Assuming $100K cost base
    const potentialGain = Math.max(0, companyValuation[0] - costBase);
    const remainingLcge = calculateRemainingLcge();
    const utilizationPercentage = totalLcgeLimit > 0 ? (lcgeUsed / totalLcgeLimit) * 100 : 0;
    const taxableGain = Math.max(0, potentialGain - remainingLcge);
    const taxSavings = Math.min(potentialGain, remainingLcge) * 0.265; // 26.5% capital gains tax rate
    
    return {
      potentialGain,
      remainingLcge,
      utilizationPercentage,
      taxSavings,
      taxableGain
    };
  };

  const activeAssetData = calculateActiveAssetRatio();
  const lcgeAnalysisData = calculateLcgeAnalysis();

  const calculateFutureValue = (currentValue: number, growthRate: number, years: number, monthlyContribution: number) => {
    const monthlyRate = (growthRate / 100) / 12;
    const totalMonths = years * 12;
    
    const currentValueFuture = currentValue * Math.pow(1 + (growthRate / 100), years);
    
    const contributionsFuture = monthlyContribution * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
    
    return currentValueFuture + contributionsFuture;
  };

  const generateAssetChartData = (asset: CorporateAsset) => {
    const data = [];
    for (let i = 0; i <= asset.years; i++) {
      const currentProjection = asset.currentValue * Math.pow(1 + (asset.growthRate / 100), i);
      const monthlyRate = (asset.growthRate / 100) / 12;
      const totalMonths = i * 12;
      const contributionsFuture = asset.monthlyContribution * totalMonths > 0 ? 
        asset.monthlyContribution * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate : 0;
      
      data.push({
        year: new Date().getFullYear() + i,
        baseline: asset.currentValue,
        optimized: currentProjection + contributionsFuture
      });
    }
    return data;
  };

  const getAssetTypeColor = (type: string) => {
    const colors = {
      "Corporate Real Estate": "#8b5cf6",
      "Business Investments": "#06b6d4", 
      "Equipment & Machinery": "#10b981",
      "Intellectual Property": "#f59e0b",
      "Corporate Bonds": "#ef4444",
      "Business Cash/Savings": "#84cc16"
    };
    return colors[type as keyof typeof colors] || "#6b7280";
  };

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
  } satisfies Record<string, { label: string; color: string }>;

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
            <TabsTrigger value="assets">Corporate Assets</TabsTrigger>
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
                      <Calculator className="h-5 w-5" />
                      <span>LCGE Auto-Calculator</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {/* Input Controls */}
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Total Corporate Assets</Label>
                        <div className="mt-1">
                          <Slider
                            value={totalCorporateAssets}
                            onValueChange={setTotalCorporateAssets}
                            min={50000}
                            max={20000000}
                            step={10000}
                            className="mt-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>$50K</span>
                            <span className="font-medium">${totalCorporateAssets[0].toLocaleString()}</span>
                            <span>$20M</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Active Business Assets</Label>
                        <div className="mt-1">
                          <Slider
                            value={activeBusinessAssets}
                            onValueChange={setActiveBusinessAssets}
                            min={0}
                            max={20000000}
                            step={10000}
                            className="mt-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>$0</span>
                            <span className="font-medium">${activeBusinessAssets[0].toLocaleString()}</span>
                            <span>$20M</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">LCGE Already Used</Label>
                        <Input
                          type="number"
                          value={lcgeUsed}
                          onChange={(e) => setLcgeUsed(Number(e.target.value))}
                          placeholder="Amount of LCGE used to date"
                        />
                      </div>
                    </div>

                    {/* Active Business Assets Analysis */}
                    <div className={`p-4 border rounded-lg ${activeAssetData.bgColor}`}>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Building2 className="h-4 w-4 mr-2" />
                        Active Business Assets Analysis
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Active Business Assets</p>
                          <p className="text-lg font-bold text-blue-600">${activeBusinessAssets[0].toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Total Corporate Assets</p>
                          <p className="text-lg font-bold text-purple-600">${totalCorporateAssets[0].toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Active Asset Ratio:</span>
                          <span className="font-medium">{activeAssetData.ratio.toFixed(1)}%</span>
                        </div>

                        {/* Progress bar for active assets ratio */}
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all duration-300 ${
                                activeAssetData.ratio >= 90 
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                                  : activeAssetData.ratio >= 50
                                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                  : 'bg-gradient-to-r from-red-500 to-red-600'
                              }`}
                              style={{ width: `${Math.min(100, activeAssetData.ratio)}%` }}
                            />
                          </div>
                        </div>

                        <div className={`mt-3 p-3 border rounded text-sm font-medium ${activeAssetData.statusColor} ${activeAssetData.bgColor}`}>
                          {activeAssetData.status}
                        </div>
                      </div>
                    </div>

                    {/* LCGE Analysis */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-3">LCGE Analysis</h4>
                      
                      {/* Company Valuation Slider moved here */}
                      <div className="mb-4">
                        <Label className="text-sm font-medium">Company Valuation</Label>
                        <div className="mt-1">
                          <Slider
                            value={companyValuation}
                            onValueChange={setCompanyValuation}
                            min={100000}
                            max={5000000}
                            step={25000}
                            className="mt-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>$100K</span>
                            <span className="font-medium">${companyValuation[0].toLocaleString()}</span>
                            <span>$5M</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Company Valuation</p>
                          <p className="text-lg font-bold text-blue-600">${companyValuation[0].toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Potential Capital Gain</p>
                          <p className="text-lg font-bold text-purple-600">${lcgeAnalysisData.potentialGain.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">LCGE Remaining</p>
                          <p className="text-lg font-bold text-green-600">${lcgeAnalysisData.remainingLcge.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">LCGE Used</p>
                          <p className="text-lg font-bold text-orange-600">${lcgeUsed.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">LCGE Utilization:</span>
                          <span className="font-medium">{lcgeAnalysisData.utilizationPercentage.toFixed(1)}%</span>
                        </div>
                        
                        <div className="flex justify-between items-center p-2 bg-green-100 rounded">
                          <span className="text-sm font-medium text-green-700">Estimated Tax Savings:</span>
                          <span className="font-bold text-green-700">${lcgeAnalysisData.taxSavings.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Progress bar for LCGE utilization */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>LCGE Usage</span>
                          <span>{lcgeAnalysisData.utilizationPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${Math.min(100, lcgeAnalysisData.utilizationPercentage)}%` }}
                          />
                        </div>
                      </div>

                      {lcgeAnalysisData.potentialGain > lcgeAnalysisData.remainingLcge && (
                        <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
                          <AlertTriangle className="h-4 w-4 inline mr-1" />
                          Capital gain exceeds remaining LCGE. Consider tax planning strategies.
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ... keep existing code (rest of the overview tab content) the same */}
          </TabsContent>

          {/* ... keep existing code (other tab contents) the same */}
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
