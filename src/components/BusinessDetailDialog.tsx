
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, Shield, Users, DollarSign, Target, AlertTriangle, CheckCircle } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

interface BusinessDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const BusinessDetailDialog = ({ isOpen, onClose }: BusinessDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const businessGrowthData = [
    { year: "2020", valuation: 150000, revenue: 280000, profit: 45000 },
    { year: "2021", valuation: 180000, revenue: 320000, profit: 58000 },
    { year: "2022", valuation: 220000, revenue: 385000, profit: 72000 },
    { year: "2023", valuation: 275000, revenue: 450000, profit: 89000 },
    { year: "2024", valuation: 325000, revenue: 485000, profit: 105000 },
  ];

  const revenueStreams = [
    { name: "Core Services", value: 285000, color: "#8b5cf6" },
    { name: "Consulting", value: 125000, color: "#06b6d4" },
    { name: "Products", value: 75000, color: "#10b981" },
  ];

  const businessMetrics = [
    { metric: "Gross Margin", value: "68%", trend: "+5%", positive: true },
    { metric: "Net Margin", value: "22%", trend: "+3%", positive: true },
    { metric: "Employee Count", value: "12", trend: "+2", positive: true },
    { metric: "Customer Retention", value: "94%", trend: "+2%", positive: true },
  ];

  const insuranceCoverage = [
    { type: "General Liability", coverage: "$2M", status: "Active", premium: "$3,200" },
    { type: "Professional Liability", coverage: "$1M", status: "Active", premium: "$2,800" },
    { type: "Key Person Insurance", coverage: "$500K", status: "Active", premium: "$4,500" },
    { type: "Business Interruption", coverage: "$750K", status: "Active", premium: "$1,900" },
  ];

  const successionPlan = [
    { milestone: "Valuation Assessment", status: "Complete", date: "Mar 2024" },
    { milestone: "Legal Structure Review", status: "In Progress", date: "Jun 2024" },
    { milestone: "Tax Planning Strategy", status: "Pending", date: "Aug 2024" },
    { milestone: "Successor Training", status: "Pending", date: "Oct 2024" },
  ];

  const chartConfig = {
    valuation: { label: "Valuation", color: "#8b5cf6" },
    revenue: { label: "Revenue", color: "#06b6d4" },
    profit: { label: "Profit", color: "#10b981" },
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
            <TabsTrigger value="succession">Succession</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Business Valuation Growth</span>
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
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Revenue Streams</span>
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
                <CardTitle>Revenue & Profit Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <BarChart data={businessGrowthData}>
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="#06b6d4" name="Revenue" />
                    <Bar dataKey="profit" fill="#10b981" name="Profit" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

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
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Business Insurance Coverage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insuranceCoverage.map((insurance) => (
                    <div key={insurance.type} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{insurance.type}</h4>
                        <p className="text-sm text-muted-foreground">Coverage: {insurance.coverage}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="mb-2">
                          {insurance.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          Annual Premium: {insurance.premium}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
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

          <TabsContent value="succession" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Succession Planning Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {successionPlan.map((milestone) => (
                    <div key={milestone.milestone} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {milestone.status === "Complete" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : milestone.status === "In Progress" ? (
                          <Target className="h-5 w-5 text-blue-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-orange-600" />
                        )}
                        <div>
                          <h4 className="font-medium">{milestone.milestone}</h4>
                          <p className="text-sm text-muted-foreground">Target: {milestone.date}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={
                          milestone.status === "Complete" ? "secondary" :
                          milestone.status === "In Progress" ? "default" : "outline"
                        }
                      >
                        {milestone.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Exit Strategy Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Management Buyout</h4>
                    <p className="text-sm text-muted-foreground">Estimated Value: $300K - $350K</p>
                    <p className="text-sm text-muted-foreground">Timeline: 2-3 years</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Third-Party Sale</h4>
                    <p className="text-sm text-muted-foreground">Estimated Value: $350K - $400K</p>
                    <p className="text-sm text-muted-foreground">Timeline: 1-2 years</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Family Transfer</h4>
                    <p className="text-sm text-muted-foreground">Estimated Value: $250K - $300K</p>
                    <p className="text-sm text-muted-foreground">Timeline: 3-5 years</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tax Considerations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Capital Gains Exemption</p>
                    <p className="text-lg font-bold">$971,190</p>
                    <p className="text-xs text-green-600">Available for qualified small business</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Tax Savings</p>
                    <p className="text-lg font-bold text-green-600">$162,000</p>
                    <p className="text-xs text-muted-foreground">Based on current structure</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Consider corporate reorganization to maximize tax efficiency
                    </p>
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
