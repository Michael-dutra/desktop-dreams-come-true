import { Building2, Eye, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useState } from "react";
import BusinessDetailDialog from "./BusinessDetailDialog";
import { Bot } from "lucide-react";
import { SectionAIDialog } from "./SectionAIDialog";

const BusinessCard = () => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [aiDialogOpen, setAIDialogOpen] = useState(false);

  // Interactive business parameters
  const [annualGrowthRate, setAnnualGrowthRate] = useState([18]);
  const [yearsProjection, setYearsProjection] = useState([5]);
  const [valuationMultiplier, setValuationMultiplier] = useState([8]);
  
  const grossRevenue = 485000;
  const currentYear = 2024;
  
  // Helper function to format large numbers
  const formatLargeNumber = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 0)}K`;
    }
    return value.toString();
  };
  
  // Generate dynamic business growth data
  const generateBusinessData = () => {
    const data = [];
    const growthRate = annualGrowthRate[0] / 100;
    const multiplier = valuationMultiplier[0];
    
    for (let i = 0; i <= yearsProjection[0]; i++) {
      const year = (currentYear + i).toString();
      const projectedRevenue = grossRevenue * Math.pow(1 + growthRate, i);
      const valuation = projectedRevenue * multiplier;
      data.push({ 
        year, 
        valuation: Math.round(valuation),
        revenue: Math.round(projectedRevenue)
      });
    }
    
    return data;
  };

  const businessGrowthData = generateBusinessData();
  const currentValuation = businessGrowthData[0]?.valuation || 325000;
  const finalValuation = businessGrowthData[businessGrowthData.length - 1]?.valuation || currentValuation;
  const projectedGrowth = ((finalValuation - currentValuation) / currentValuation) * 100;

  const chartConfig = {
    valuation: {
      label: "Business Valuation",
      color: "#8b5cf6",
    },
  };

  const generateAIAnalysis = () => {
    let text = `Business Analysis:\n\n`;
    text += `- Current revenue: $${formatLargeNumber(grossRevenue)}\n`;
    text += `- Valuation: $${formatLargeNumber(currentValuation)} (x${valuationMultiplier[0]})\n`;
    text += `- Projected ${yearsProjection[0]}-year value: $${formatLargeNumber(finalValuation)}\n`;
    text += `- Growth potential: +${projectedGrowth.toFixed(1)}%\n\n`;
    text += `Changing the growth rate, years, or valuation multiple affects these estimates.`;
    return text;
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Building2 className="h-5 w-5 text-indigo-600" />
              </div>
              <span>Business</span>
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                onClick={() => setShowDetailDialog(true)}
              >
                <Eye className="h-4 w-4" />
                <span>Details</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center border-indigo-600 text-indigo-700 hover:bg-indigo-50 px-3 rounded-lg shadow-sm"
                onClick={() => setAIDialogOpen(true)}
                style={{ border: '2px solid #6366f1' }}
              >
                <Bot className="w-4 h-4 mr-1 text-indigo-600" />
                AI
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Business Value Comparison Section */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Current Value</p>
                  <p className="text-2xl font-bold text-blue-600">${formatLargeNumber(currentValuation)}</p>
                  <p className="text-xs text-muted-foreground">{currentYear}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Projected Value</p>
                  <p className="text-2xl font-bold text-green-600">${formatLargeNumber(finalValuation)}</p>
                  <p className="text-xs text-muted-foreground">{currentYear + yearsProjection[0]}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Current Annual Revenue</p>
                <p className="text-2xl font-bold">${formatLargeNumber(grossRevenue)}</p>
                <p className="text-sm text-muted-foreground mt-1">Base 2024</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Projected Growth</p>
                <p className="text-2xl font-bold text-green-600">+{projectedGrowth.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground mt-1">{yearsProjection[0]} year potential</p>
              </div>
            </div>

            {/* Interactive Controls */}
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg space-y-4 border border-indigo-200">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-indigo-700">Annual Growth Rate</span>
                    <span className="text-sm font-bold text-indigo-600">{annualGrowthRate[0]}%</span>
                  </div>
                  <Slider
                    value={annualGrowthRate}
                    onValueChange={setAnnualGrowthRate}
                    max={50}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-purple-700">Years</span>
                      <span className="text-xs font-bold text-purple-600">{yearsProjection[0]}</span>
                    </div>
                    <Slider
                      value={yearsProjection}
                      onValueChange={setYearsProjection}
                      max={15}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-emerald-700">Valuation {valuationMultiplier[0]}x</span>
                      <span className="text-xs font-bold text-emerald-600">Revenue</span>
                    </div>
                    <Slider
                      value={valuationMultiplier}
                      onValueChange={setValuationMultiplier}
                      max={20}
                      min={0}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3">{yearsProjection[0]}-Year Business Projection</h4>
              <p className="text-xs text-muted-foreground mb-3">
                At {annualGrowthRate[0]}% growth • {valuationMultiplier[0]}x revenue multiple
              </p>
              <div className="w-full">
                <ChartContainer config={chartConfig} className="h-40 w-full">
                  <AreaChart data={businessGrowthData}>
                    <defs>
                      <linearGradient id="businessGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="year" 
                      tick={{ fontSize: 12, fill: 'white' }}
                      axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                      tickLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: 'white' }}
                      axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                      tickLine={{ stroke: '#e2e8f0' }}
                      tickFormatter={(value) => `$${formatLargeNumber(value)}``}
                    />
                    <ChartTooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white border-2 border-indigo-500 rounded-lg p-3 shadow-lg">
                              <p className="text-gray-900 font-bold text-sm mb-1">{label}</p>
                              <p className="text-indigo-600 font-semibold text-base">
                                Valuation: ${formatLargeNumber(data.valuation)}
                              </p>
                              <p className="text-gray-600 text-sm">
                                Revenue: ${formatLargeNumber(data.revenue)}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="valuation" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      fill="url(#businessGradient)"
                      dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <BusinessDetailDialog 
        isOpen={showDetailDialog} 
        onClose={() => setShowDetailDialog(false)} 
      />
      <SectionAIDialog
        isOpen={aiDialogOpen}
        onClose={() => setAIDialogOpen(false)}
        title="Business"
        content={generateAIAnalysis()}
      />
    </>
  );
};

export default BusinessCard;
