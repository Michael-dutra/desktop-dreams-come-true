
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Building2, TrendingUp, FileText, X, Edit3, Copy, Check, PiggyBank, Home, CreditCard, Wallet } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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

const AssetsDetailDialog = ({ isOpen, onClose, assets }: AssetsDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState("breakdown");
  const [editingAsset, setEditingAsset] = useState<string | null>(null);
  const [copiedAsset, setCopiedAsset] = useState<string | null>(null);
  const [assetReports, setAssetReports] = useState<Record<string, string>>({
    "Real Estate": `ASSET ANALYSIS REPORT - PRIMARY RESIDENCE

Property Details:
- Current Market Value: $620,000
- Property Type: Single Family Home
- Year Built: 2015
- Square Footage: 2,400 sq ft
- Lot Size: 0.25 acres

Market Analysis:
- Recent comparable sales in area: $580K - $650K
- Annual appreciation rate (5-year avg): 4.2%
- Market trend: Stable with moderate growth

Financial Position:
- Estimated mortgage balance: $340,000
- Home equity: $280,000
- Monthly carrying costs: $2,850
- Property taxes: $8,400 annually

Recommendations:
1. Consider mortgage prepayment strategy
2. Evaluate home equity line of credit options
3. Review property insurance coverage annually
4. Monitor local market trends for refinancing opportunities`,

    "RRSP": `REGISTERED RETIREMENT SAVINGS PLAN REPORT

Account Summary:
- Current Balance: $52,000
- Contribution Room Available: $18,500
- Annual Contribution Limit: $29,210
- Years to Retirement: 23

Investment Allocation:
- Equity Funds: 65% ($33,800)
- Bond Funds: 25% ($13,000)
- GICs: 10% ($5,200)

Performance Analysis:
- 1-Year Return: 8.4%
- 3-Year Average: 6.2%
- 5-Year Average: 7.1%

Tax Benefits:
- Annual tax deduction potential: $7,850
- Estimated tax-deferred growth: $145,000 over 20 years

Recommendations:
1. Maximize annual contributions before deadline
2. Consider more aggressive allocation given time horizon
3. Set up automatic monthly contributions
4. Review beneficiary designations annually`,

    "TFSA": `TAX-FREE SAVINGS ACCOUNT REPORT

Account Summary:
- Current Balance: $38,000
- Available Contribution Room: $44,500
- Lifetime Contribution Limit: $88,000
- Tax-Free Growth Potential: Unlimited

Investment Strategy:
- Growth-focused portfolio allocation
- High-quality dividend stocks: 40%
- Growth ETFs: 35%
- Cash/Short-term: 25%

Performance Metrics:
- Year-to-date return: 9.2%
- 3-year average return: 7.8%
- Total tax saved to date: $4,200

Strategic Considerations:
- Emergency fund component: $15,000
- Investment growth component: $23,000
- Withdrawal flexibility: No penalties

Recommendations:
1. Prioritize TFSA contributions for near-term goals
2. Consider higher-growth investments given tax-free status
3. Use for emergency fund portion of portfolio
4. Plan withdrawals strategically to maximize re-contribution`,

    "Non-Registered": `NON-REGISTERED INVESTMENT ACCOUNT REPORT

Account Summary:
- Current Market Value: $25,000
- Cost Base: $22,500
- Unrealized Capital Gains: $2,500
- Annual Income Generated: $850

Holdings Breakdown:
- Canadian Dividend Stocks: 45% ($11,250)
- International ETFs: 35% ($8,750)
- Corporate Bonds: 20% ($5,000)

Tax Efficiency:
- Eligible dividend income: $600
- Capital gains realized (YTD): $1,200
- Tax-loss harvesting opportunities: $300

Income Generation:
- Quarterly dividend payments: $150
- Annual yield: 3.4%
- Tax-advantaged income: 70%

Recommendations:
1. Implement tax-loss harvesting strategy
2. Focus on eligible Canadian dividends
3. Consider capital gains realization timing
4. Maintain records for adjusted cost base tracking`
  });

  // Calculate projections for the charts
  const currentYear = new Date().getFullYear();
  const projectionData = Array.from({ length: 11 }, (_, i) => {
    const year = currentYear + i;
    const realEstateFV = 620000 * Math.pow(1.03, i);
    const rrspFV = 52000 * Math.pow(1.07, i);
    const tfsaFV = 38000 * Math.pow(1.06, i);
    const nonRegFV = 25000 * Math.pow(1.05, i);
    
    return {
      year: year.toString(),
      "Real Estate": Math.round(realEstateFV),
      "RRSP": Math.round(rrspFV),
      "TFSA": Math.round(tfsaFV),
      "Non-Registered": Math.round(nonRegFV),
      total: Math.round(realEstateFV + rrspFV + tfsaFV + nonRegFV)
    };
  });

  const chartConfig = {
    "Real Estate": { label: "Real Estate", color: "#3b82f6" },
    "RRSP": { label: "RRSP", color: "#10b981" },
    "TFSA": { label: "TFSA", color: "#8b5cf6" },
    "Non-Registered": { label: "Non-Registered", color: "#f59e0b" },
  };

  const handleEditAsset = (assetName: string) => {
    setEditingAsset(assetName);
  };

  const handleSaveAsset = (assetName: string, content: string) => {
    setAssetReports(prev => ({
      ...prev,
      [assetName]: content
    }));
    setEditingAsset(null);
  };

  const handleCopyAsset = async (assetName: string) => {
    try {
      await navigator.clipboard.writeText(assetReports[assetName] || '');
      setCopiedAsset(assetName);
      setTimeout(() => setCopiedAsset(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const getAssetIcon = (assetName: string) => {
    switch (assetName) {
      case "Real Estate":
        return Home;
      case "RRSP":
        return PiggyBank;
      case "TFSA":
        return Wallet;
      case "Non-Registered":
        return CreditCard;
      default:
        return FileText;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 text-2xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <span>Assets Details</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            <TabsTrigger value="projections">Projections</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Asset Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-64">
                    <PieChart>
                      <Pie
                        data={assets}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {assets.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Asset Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assets.map((asset) => {
                      const IconComponent = getAssetIcon(asset.name);
                      return (
                        <div key={asset.name} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <IconComponent className="h-5 w-5" style={{ color: asset.color }} />
                            <div>
                              <h4 className="font-medium">{asset.name}</h4>
                              <p className="text-sm text-muted-foreground">Current Value</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-semibold">{asset.amount}</span>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditAsset(asset.name)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopyAsset(asset.name)}
                                className="h-8 w-8 p-0"
                              >
                                {copiedAsset === asset.name ? (
                                  <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>10-Year Asset Projections</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <AreaChart data={projectionData}>
                    <defs>
                      {Object.entries(chartConfig).map(([key, config]) => (
                        <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={config.color} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={config.color} stopOpacity={0.1}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    {Object.entries(chartConfig).map(([key, config]) => (
                      <Area
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stackId="1"
                        stroke={config.color}
                        fill={`url(#gradient-${key})`}
                      />
                    ))}
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {assets.map((asset) => {
                const IconComponent = getAssetIcon(asset.name);
                const isEditing = editingAsset === asset.name;
                const report = assetReports[asset.name] || '';

                return (
                  <Card key={asset.name}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-5 w-5" style={{ color: asset.color }} />
                          <span>{asset.name} Report</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isEditing ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingAsset(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  const textarea = document.querySelector(`#edit-${asset.name}`) as HTMLTextAreaElement;
                                  if (textarea) {
                                    handleSaveAsset(asset.name, textarea.value);
                                  }
                                }}
                              >
                                Save
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditAsset(asset.name)}
                                className="flex items-center gap-2"
                              >
                                <Edit3 className="w-4 h-4" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopyAsset(asset.name)}
                                className="flex items-center gap-2"
                              >
                                {copiedAsset === asset.name ? (
                                  <>
                                    <Check className="w-4 h-4 text-green-600" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4" />
                                    Copy
                                  </>
                                )}
                              </Button>
                            </>
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <Textarea
                          id={`edit-${asset.name}`}
                          defaultValue={report}
                          className="min-h-[300px] font-mono text-sm"
                          placeholder="Enter asset report content..."
                        />
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <pre className="whitespace-pre-wrap text-sm font-mono">
                            {report}
                          </pre>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            Export All Reports
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssetsDetailDialog;
