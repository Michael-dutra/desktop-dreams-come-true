import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { TrendingUp, FileText, X, Plus, Brain, Lightbulb, Edit2, Check } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState, useEffect, useMemo } from "react";

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

const AssetWriteupDialog = ({ isOpen, onClose, assetType, assetName }: { 
  isOpen: boolean; 
  onClose: () => void; 
  assetType: string; 
  assetName: string; 
}) => {
  const getWriteupContent = () => {
    switch (assetType) {
      case "Primary Residence":
        return {
          title: "Primary Residence Analysis",
          content: `Your primary residence represents a significant portion of your net worth and serves as both a place to live and a long-term investment. 

**Key Considerations:**
• **Equity Building**: Each mortgage payment builds equity while providing housing security
• **Tax Benefits**: Principal residence exemption protects capital gains from taxation
• **Market Appreciation**: Historical real estate appreciation averages 3-5% annually
• **Leverage Benefits**: Mortgage financing allows you to control a large asset with less capital

**Risks to Monitor:**
• **Concentration Risk**: Over-exposure to real estate market fluctuations
• **Liquidity Constraints**: Real estate is not easily converted to cash
• **Market Cycles**: Property values can decline during economic downturns
• **Maintenance Costs**: Ongoing expenses for repairs, taxes, and improvements

**Strategic Recommendations:**
• Continue building equity through regular mortgage payments
• Consider market timing for potential refinancing opportunities
• Maintain adequate emergency funds for property-related expenses
• Monitor local market trends and comparable sales data`
        };
      
      case "Secondary Property":
        return {
          title: "Secondary Property Investment Analysis",
          content: `Your secondary property represents an investment real estate holding that can provide both appreciation and potential rental income.

**Investment Benefits:**
• **Diversification**: Geographic or property type diversification from primary residence
• **Income Potential**: Rental income can offset carrying costs and provide cash flow
• **Tax Advantages**: Depreciation and expense deductions available for investment properties
• **Inflation Hedge**: Real estate typically appreciates with or above inflation rates

**Tax Considerations:**
• **Capital Gains**: 50% inclusion rate on capital gains when sold
• **Rental Income**: Fully taxable as regular income
• **Depreciation Recapture**: Previously claimed depreciation may be recaptured on sale

**Risk Factors:**
• **Vacancy Risk**: Periods without rental income
• **Property Management**: Time and cost of managing tenants and maintenance
• **Market Risk**: Local real estate market fluctuations
• **Liquidity Risk**: Longer time to sell compared to liquid investments

**Optimization Strategies:**
• Regular market analysis to ensure competitive rental rates
• Maintain adequate reserves for repairs and vacancy periods
• Consider professional property management if time-intensive
• Monitor cap rates and comparable property values`
        };

      case "RRSP":
        return {
          title: "RRSP Investment Strategy Analysis",
          content: `Your Registered Retirement Savings Plan (RRSP) is a tax-advantaged account designed to help you save for retirement while reducing current taxable income.

**Tax Benefits:**
• **Immediate Deduction**: Contributions reduce your current year's taxable income
• **Tax-Deferred Growth**: Investments grow tax-free within the plan
• **Income Splitting**: Potential spousal RRSP strategies for retirement income splitting

**Investment Strategy:**
• **Long-Term Growth**: Focus on equity investments for long-term appreciation
• **Diversification**: Balance across asset classes, geographies, and sectors
• **Cost Management**: Minimize fees through low-cost index funds or ETFs
• **Rebalancing**: Regular portfolio rebalancing to maintain target allocations

**Contribution Optimization:**
• **Annual Limits**: 18% of previous year's income (up to annual maximum)
• **Unused Room**: Carry forward unused contribution room indefinitely
• **Timing**: Consider contributing early in the year for maximum tax-deferred growth

**Withdrawal Considerations:**
• **Tax Treatment**: All withdrawals taxed as regular income
• **Withholding Tax**: Immediate withholding tax applied to withdrawals
• **Lost Room**: Contribution room is permanently lost on withdrawal
• **Mandatory Conversion**: Must convert to RRIF by age 71`
        };

      case "TFSA":
        return {
          title: "TFSA Investment Strategy Analysis", 
          content: `Your Tax-Free Savings Account (TFSA) offers the most tax-efficient investment growth available to Canadian residents.

**Tax Advantages:**
• **Tax-Free Growth**: All investment gains, dividends, and interest grow tax-free
• **Tax-Free Withdrawals**: No tax implications when you withdraw funds
• **Contribution Room**: Withdrawals can be re-contributed in future years
• **No Impact on Benefits**: Withdrawals don't affect income-tested benefits

**Investment Strategy:**
• **High-Growth Focus**: Ideal for investments with highest return potential
• **Dividend-Paying Stocks**: Dividend income is completely tax-free
• **Growth Stocks**: Capital gains are not taxable within TFSA
• **International Exposure**: Foreign dividends face withholding tax but no Canadian tax

**Contribution Limits:**
• **Annual Room**: $6,500 for 2023 (indexed to inflation)
• **Cumulative Room**: Total room since 2009 if you were 18+ and Canadian resident
• **Over-Contribution Penalty**: 1% per month on excess contributions

**Optimization Strategies:**
• **Maximize Contributions**: Prioritize TFSA for tax-free growth
• **Withdrawal Timing**: Strategic withdrawals can help manage taxable income
• **Estate Planning**: TFSA can be transferred tax-free to spouse
• **Investment Selection**: Focus on highest-return potential investments`
        };

      case "Non-Registered":
        return {
          title: "Non-Registered Investment Analysis",
          content: `Your non-registered (taxable) investment account provides investment flexibility without contribution limits but with annual tax implications.

**Tax Treatment:**
• **Capital Gains**: 50% inclusion rate on realized gains
• **Dividends**: Eligible dividends receive favorable tax treatment through dividend tax credit
• **Interest Income**: Fully taxable as regular income
• **Foreign Income**: Foreign dividends and interest subject to withholding tax and Canadian tax

**Investment Strategy:**
• **Tax Efficiency**: Focus on low-turnover, tax-efficient investments
• **Asset Location**: Place tax-inefficient investments in registered accounts first
• **Capital Gains Management**: Time realization of gains and losses for tax optimization
• **Dividend Focus**: Canadian eligible dividends for favorable tax treatment

**Tax Planning Opportunities:**
• **Tax Loss Harvesting**: Realize losses to offset gains
• **Charitable Giving**: Donate appreciated securities to eliminate capital gains
• **Income Splitting**: Income attribution rules may apply for family members
• **Estate Planning**: Step-up in cost base at death eliminates accrued gains

**Liquidity Benefits:**
• **No Withdrawal Restrictions**: Access funds anytime without penalty
• **Emergency Fund**: Can serve as part of emergency fund strategy
• **Large Purchases**: Available for major expenses or opportunities
• **Flexibility**: No contribution limits allow unlimited investing`
        };

      default:
        return {
          title: `${assetName} Analysis`,
          content: `This asset represents part of your overall investment portfolio and contributes to your long-term financial security.

**General Investment Principles:**
• **Diversification**: Spread risk across different asset types and sectors
• **Time Horizon**: Align investment strategy with your time frame and goals
• **Risk Management**: Balance growth potential with your risk tolerance
• **Cost Management**: Minimize fees and taxes to maximize net returns

**Monitoring and Review:**
• **Regular Assessment**: Review performance and allocation quarterly
• **Rebalancing**: Maintain target asset allocation through periodic rebalancing
• **Tax Efficiency**: Optimize for after-tax returns
• **Goal Alignment**: Ensure investments support your financial objectives

**Strategic Considerations:**
• **Market Cycles**: Understand that markets fluctuate in cycles
• **Dollar-Cost Averaging**: Regular contributions can smooth market volatility
• **Professional Advice**: Consider professional guidance for complex strategies
• **Documentation**: Maintain detailed records for tax and planning purposes`
        };
    }
  };

  const { title, content } = getWriteupContent();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="prose prose-sm max-w-none">
            {content.split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <h4 key={index} className="font-semibold text-lg mt-4 mb-2 text-foreground">
                    {paragraph.replace(/\*\*/g, '')}
                  </h4>
                );
              } else if (paragraph.startsWith('•')) {
                return (
                  <p key={index} className="ml-4 mb-1 text-muted-foreground">
                    {paragraph}
                  </p>
                );
              } else if (paragraph.trim()) {
                return (
                  <p key={index} className="mb-3 text-foreground leading-relaxed">
                    {paragraph}
                  </p>
                );
              }
              return null;
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const AssetsDetailDialog = ({ isOpen, onClose, assets }: AssetsDetailDialogProps) => {
  const [writeupDialog, setWriteupDialog] = useState<{
    isOpen: boolean;
    assetType: string;
    assetName: string;
  }>({
    isOpen: false,
    assetType: "",
    assetName: ""
  });

  const showAssetWriteup = (assetType: string, assetName: string) => {
    setWriteupDialog({
      isOpen: true,
      assetType,
      assetName
    });
  };

  const closeWriteupDialog = () => {
    setWriteupDialog({
      isOpen: false,
      assetType: "",
      assetName: ""
    });
  };

  const confirmDeleteAsset = (assetId: string, assetName: string) => {
    console.log(`Delete confirmed for asset: ${assetName}`);
    removeDynamicAsset(assetId);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">Assets</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-500"></div>
                    <span>Primary Residence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => showAssetWriteup("Primary Residence", "Primary Residence")}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Primary Residence</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "Primary Residence"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => confirmDeleteAsset("Primary Residence", "Primary Residence")}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Content for Primary Residence */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500"></div>
                    <span>RRSP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => showAssetWriteup("RRSP", "RRSP")}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete RRSP</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "RRSP"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => confirmDeleteAsset("RRSP", "RRSP")}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Content for RRSP */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-violet-500"></div>
                    <span>TFSA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => showAssetWriteup("TFSA", "TFSA")}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete TFSA</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "TFSA"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => confirmDeleteAsset("TFSA", "TFSA")}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Content for TFSA */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-red-500"></div>
                    <span>Non-Registered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => showAssetWriteup("Non-Registered", "Non-Registered")}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Non-Registered</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "Non-Registered"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => confirmDeleteAsset("Non-Registered", "Non-Registered")}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Content for Non-Registered */}
              </CardContent>
            </Card>

            {/* Dynamic assets rendering */}
            {dynamicAssets.map((asset) => (
              <DynamicAssetCard key={asset.id} asset={asset} />
            ))}

            <Card className="border-dashed border-2 border-muted-foreground/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-muted-foreground">
                  <Plus className="w-6 h-6" />
                  Add Asset
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Asset Type</label>
                    <Select onValueChange={(value) => addDynamicAsset(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Primary Residence">Primary Residence</SelectItem>
                        <SelectItem value="Secondary Property">Secondary Property</SelectItem>
                        <SelectItem value="RRSP">RRSP</SelectItem>
                        <SelectItem value="RRIF">RRIF</SelectItem>
                        <SelectItem value="TFSA">TFSA</SelectItem>
                        <SelectItem value="Non-Registered">Non-Registered</SelectItem>
                        <SelectItem value="DB">DB (Defined Benefit)</SelectItem>
                        <SelectItem value="DC">DC (Defined Contribution)</SelectItem>
                        <SelectItem value="IPP">IPP (Individual Pension Plan)</SelectItem>
                        <SelectItem value="LIRA">LIRA (Locked-in Retirement Account)</SelectItem>
                        <SelectItem value="LIF">LIF (Life Income Fund)</SelectItem>
                        <SelectItem value="Pension">Pension</SelectItem>
                        <SelectItem value="Chequing">Chequing Account</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <AssetWriteupDialog 
            isOpen={writeupDialog.isOpen}
            onClose={closeWriteupDialog}
            assetType={writeupDialog.assetType}
            assetName={writeupDialog.assetName}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
