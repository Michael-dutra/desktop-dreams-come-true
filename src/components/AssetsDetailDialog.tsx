import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Home, DollarSign, TrendingUp, PieChart, FileText, Edit, Copy } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts";
import { toast } from "sonner";

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssetsDetailDialog = ({ isOpen, onClose }: AssetsDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [isEditingWriteUp, setIsEditingWriteUp] = useState(false);
  const [writeUpText, setWriteUpText] = useState(`Asset Portfolio Analysis - March 2024

Overview:
Your current asset portfolio totals $1,245,000, representing a well-diversified investment approach across multiple asset classes. The portfolio demonstrates strong growth potential while maintaining reasonable risk levels appropriate for your investment timeline.

Real Estate Holdings ($785,000 - 63%):
Your primary residence valued at $650,000 represents your largest single asset and provides both shelter and long-term appreciation potential. The investment property worth $135,000 generates rental income and adds geographic diversification to your real estate exposure.

Investment Accounts ($285,000 - 23%):
Your non-registered investment accounts show a balanced approach with a mix of growth and income-producing assets. The current allocation supports both capital appreciation and dividend income generation.

Registered Savings ($175,000 - 14%):
RRSP and TFSA accounts provide tax-advantaged growth opportunities. Consider maximizing annual contribution limits to optimize tax efficiency and long-term wealth accumulation.

Recommendations:
1. Consider rebalancing investment accounts if equity allocation exceeds target ranges
2. Evaluate opportunities to increase TFSA contributions for tax-free growth
3. Review real estate insurance coverage to ensure adequate protection
4. Monitor investment fees and consider low-cost index fund options where appropriate

Next Review: September 2024`);

  const handleCopyReport = () => {
    navigator.clipboard.writeText(writeUpText);
    toast.success("Report copied to clipboard");
  };

  const handleSaveWriteUp = () => {
    setIsEditingWriteUp(false);
    toast.success("Report updated successfully");
  };

  const assetBreakdown = [
    { asset: "Primary Residence", value: 650000, growth: 8.2, color: "#8b5cf6" },
    { asset: "Investment Property", value: 135000, growth: 12.1, color: "#06b6d4" },
    { asset: "Investment Accounts", value: 285000, growth: 15.3, color: "#10b981" },
    { asset: "RRSP", value: 125000, growth: 11.8, color: "#f59e0b" },
    { asset: "TFSA", value: 50000, growth: 14.2, color: "#ef4444" },
  ];

  const performanceData = [
    { month: "Jan", value: 1180000 },
    { month: "Feb", value: 1195000 },
    { month: "Mar", value: 1220000 },
    { month: "Apr", value: 1205000 },
    { month: "May", value: 1235000 },
    { month: "Jun", value: 1245000 },
  ];

  const allocationData = [
    { category: "Real Estate", percentage: 63, target: 60, color: "#8b5cf6" },
    { category: "Equities", percentage: 25, target: 30, color: "#06b6d4" },
    { category: "Fixed Income", percentage: 8, target: 8, color: "#10b981" },
    { category: "Cash", percentage: 4, target: 2, color: "#f59e0b" },
  ];

  const chartConfig = {
    value: { label: "Value", color: "#8b5cf6" },
  };

  const totalAssets = assetBreakdown.reduce((sum, asset) => sum + asset.value, 0);
  const totalGrowth = assetBreakdown.reduce((sum, asset) => sum + (asset.value * asset.growth / 100), 0);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3 text-2xl">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <span>Assets Portfolio Details</span>
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="allocation">Allocation</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <span>Total Assets</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Value</p>
                      <p className="text-3xl font-bold">${totalAssets.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Growth (YTD)</p>
                      <p className="text-xl font-bold text-green-600">${totalGrowth.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Growth Rate</p>
                      <p className="text-xl font-bold text-blue-600">12.5%</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Home className="h-5 w-5" />
                      <span>Real Estate</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Primary Residence</p>
                      <p className="text-2xl font-bold">${assetBreakdown[0].value.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Investment Property</p>
                      <p className="text-xl font-bold text-green-600">${assetBreakdown[1].value.toLocaleString()}</p>
                    </div>
                    <Badge variant="secondary" className="w-full justify-center">
                      View Details
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <span>Investments</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Investment Accounts</p>
                      <p className="text-2xl font-bold">${assetBreakdown[2].value.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Registered Savings</p>
                      <p className="text-xl font-bold text-blue-600">${(assetBreakdown[3].value + assetBreakdown[4].value).toLocaleString()}</p>
                    </div>
                    <Badge variant="secondary" className="w-full justify-center">
                      Explore Options
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Asset Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartContainer config={chartConfig} className="h-80">
                      <RechartsPieChart>
                        <Pie
                          data={assetBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {assetBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent formatter={(value) => [`$${value.toLocaleString()}`, ""]} />} />
                      </RechartsPieChart>
                    </ChartContainer>

                    <div className="space-y-3">
                      {assetBreakdown.map((asset) => (
                        <div key={asset.asset} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: asset.color }} />
                            <div>
                              <p className="font-medium">{asset.asset}</p>
                              <p className="text-sm text-muted-foreground">
                                Growth: {asset.growth}%
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${asset.value.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">
                              {((asset.value / totalAssets) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer className="h-80">
                    <LineChart data={performanceData}>
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Historical Growth</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">2023</h4>
                      <p className="text-sm text-muted-foreground">Total Growth</p>
                      <p className="text-lg font-bold text-green-600">$185,000</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">2022</h4>
                      <p className="text-sm text-muted-foreground">Total Growth</p>
                      <p className="text-lg font-bold text-green-600">$142,000</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Future Projections</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900">Optimistic Scenario</h4>
                      <p className="text-sm text-blue-700">Projected growth by 2025</p>
                      <p className="text-lg font-bold">$350,000+</p>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-900">Conservative Scenario</h4>
                      <p className="text-sm text-green-700">Projected growth by 2025</p>
                      <p className="text-lg font-bold">$220,000+</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="allocation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartContainer config={chartConfig} className="h-80">
                      <RechartsPieChart>
                        <Pie
                          data={allocationData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="percentage"
                        >
                          {allocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent formatter={(value) => [`${value}%`, ""]} />} />
                      </RechartsPieChart>
                    </ChartContainer>

                    <div className="space-y-3">
                      {allocationData.map((allocation) => (
                        <div key={allocation.category} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: allocation.color }} />
                            <div>
                              <p className="font-medium">{allocation.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">{allocation.percentage}%</p>
                            <p className="text-sm text-muted-foreground">
                              Target: {allocation.target}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Allocation Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-900">Rebalance Portfolio</h4>
                    <p className="text-sm text-yellow-700">Consider rebalancing to align with target allocations</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900">Diversify Investments</h4>
                    <p className="text-sm text-blue-700">Explore opportunities to diversify across asset classes</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personalized Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Review Insurance Coverage</h4>
                    <p className="text-sm text-muted-foreground">Ensure adequate coverage for real estate and investments</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Optimize Registered Savings</h4>
                    <p className="text-sm text-muted-foreground">Maximize contributions to RRSP and TFSA accounts</p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Action Items</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Update Investment Strategy
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Review Retirement Projections
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Reviews</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">September 2024</h4>
                      <p className="text-sm text-muted-foreground">Next portfolio review</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">December 2024</h4>
                      <p className="text-sm text-muted-foreground">Year-end tax planning</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between items-center pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setSummaryDialogOpen(true)}
              className="flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>View Write-Up</span>
            </Button>
            
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button>
                Schedule Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={summaryDialogOpen} onOpenChange={setSummaryDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Asset Portfolio Write-Up</span>
              </span>
              {!isEditingWriteUp && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyReport}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingWriteUp(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {isEditingWriteUp ? (
              <div className="space-y-4">
                <Textarea
                  value={writeUpText}
                  onChange={(e) => setWriteUpText(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Enter your asset portfolio analysis..."
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingWriteUp(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveWriteUp}>
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-muted p-6 rounded-lg">
                  {writeUpText}
                </pre>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t gap-2">
              <Button variant="outline" onClick={() => setSummaryDialogOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssetsDetailDialog;
