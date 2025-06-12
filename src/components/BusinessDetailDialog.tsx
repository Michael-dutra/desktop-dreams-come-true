import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, TrendingUp, Shield, Users, DollarSign, Target, AlertTriangle, CheckCircle, Plus, Edit, Trash2, Calendar, FileText, Briefcase } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

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

  // Financial Data State
  const [financialData, setFinancialData] = useState<FinancialData[]>([
    { year: "2020", valuation: 150000, revenue: 280000, profit: 45000, expenses: 235000 },
    { year: "2021", valuation: 180000, revenue: 320000, profit: 58000, expenses: 262000 },
    { year: "2022", valuation: 220000, revenue: 385000, profit: 72000, expenses: 313000 },
    { year: "2023", valuation: 275000, revenue: 450000, profit: 89000, expenses: 361000 },
    { year: "2024", valuation: 325000, revenue: 485000, profit: 105000, expenses: 380000 },
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

  // Business Information State
  const [businessInfo, setBusinessInfo] = useState({
    corporationNumber: "123456789",
    businessNumber: "987654321 RC0001",
    taxYearEnd: "December 31",
    nextTaxDue: "June 30, 2025",
    capitalDividendAccount: 45000,
    eligibleLCGE: 971190,
    usedLCGE: 0
  });

  const [shareholderStructure] = useState([
    { name: "John Smith", shares: 100, class: "Class A Common", percentage: 60 },
    { name: "Jane Smith", shares: 67, class: "Class A Common", percentage: 40 }
  ]);

  const [shareClasses] = useState([
    { class: "Class A Common", shares: 167, voting: "Yes", dividend: "Yes", description: "Voting common shares" },
    { class: "Class B Preferred", shares: 0, voting: "No", dividend: "Fixed 5%", description: "Non-voting preferred shares" }
  ]);

  const [holdingCompanies] = useState([
    { name: "Smith Holdings Inc.", ownership: "100%", purpose: "Investment holding", structure: "Active" },
    { name: "Family Trust Co.", ownership: "75%", purpose: "Estate planning", structure: "Trust" }
  ]);

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

          <TabsContent value="important" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Briefcase className="h-5 w-5" />
                    <span>Business Registration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Corporation Number</p>
                    <p className="text-lg font-bold">{businessInfo.corporationNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Business Number</p>
                    <p className="text-lg font-bold">{businessInfo.businessNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tax Year End</p>
                    <p className="text-lg font-bold">{businessInfo.taxYearEnd}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Next Tax Return Due</p>
                    <p className="text-lg font-bold text-orange-600">{businessInfo.nextTaxDue}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Tax Planning Accounts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Capital Dividend Account</p>
                    <p className="text-2xl font-bold text-green-600">${businessInfo.capitalDividendAccount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Available for tax-free distribution</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Eligible LCGE Remaining</p>
                    <p className="text-2xl font-bold text-blue-600">${businessInfo.eligibleLCGE.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Lifetime Capital Gains Exemption</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">LCGE Used to Date</p>
                    <p className="text-lg font-bold">${businessInfo.usedLCGE.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Shareholder Structure</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shareholderStructure.map((shareholder, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{shareholder.name}</h4>
                        <p className="text-sm text-muted-foreground">{shareholder.class}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{shareholder.shares} shares</p>
                        <p className="text-sm text-muted-foreground">{shareholder.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Share Classes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shareClasses.map((shareClass, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <h4 className="font-medium">{shareClass.class}</h4>
                          <p className="text-sm text-muted-foreground">{shareClass.description}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Outstanding</p>
                          <p className="text-lg font-bold">{shareClass.shares}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Voting Rights</p>
                          <Badge variant={shareClass.voting === "Yes" ? "default" : "secondary"}>
                            {shareClass.voting}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Dividend Rights</p>
                          <p className="text-sm font-medium">{shareClass.dividend}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Corporate Structure</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {holdingCompanies.map((company, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{company.name}</h4>
                        <p className="text-sm text-muted-foreground">{company.purpose}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{company.structure}</Badge>
                        <p className="text-sm text-muted-foreground mt-1">Ownership: {company.ownership}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Important Dates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">Corporate Tax Return</span>
                    <span className="text-sm font-bold text-orange-600">June 30, 2025</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">Annual Return</span>
                    <span className="text-sm font-bold">March 31, 2025</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">Payroll Remittance</span>
                    <span className="text-sm font-bold">15th of each month</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">GST/HST Filing</span>
                    <span className="text-sm font-bold">Quarterly</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tax Planning Opportunities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900">Capital Dividend Distribution</h4>
                    <p className="text-sm text-green-700">$45,000 available for tax-free distribution</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900">LCGE Planning</h4>
                    <p className="text-sm text-blue-700">$971,190 lifetime exemption available</p>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-900">Income Splitting</h4>
                    <p className="text-sm text-yellow-700">Consider family trust distributions</p>
                  </div>
                </CardContent>
              </Card>
            </div>
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
