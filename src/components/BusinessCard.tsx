
import { Building2, Eye, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";

const BusinessCard = () => {
  const businessGrowthData = [
    { year: "2020", valuation: 150000 },
    { year: "2021", valuation: 180000 },
    { year: "2022", valuation: 220000 },
    { year: "2023", valuation: 275000 },
    { year: "2024", valuation: 325000 },
  ];

  const chartConfig = {
    valuation: {
      label: "Business Valuation",
      color: "#8b5cf6",
    },
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Business Planning</span>
          </CardTitle>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Details</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Business Value</p>
              <p className="text-2xl font-bold">$325,000</p>
              <div className="flex items-center space-x-1 text-green-600 mt-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">+18% this year</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Annual Revenue</p>
              <p className="text-2xl font-bold">$485,000</p>
              <p className="text-sm text-muted-foreground mt-1">Projected 2024</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Business Insurance</span>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Succession Plan</span>
              <span className="text-sm font-medium text-orange-600">In Progress</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Key Person Insurance</span>
              <span className="text-sm font-medium text-green-600">Covered</span>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">Business Valuation Growth</h4>
            <div className="w-full">
              <ChartContainer config={chartConfig} className="h-32 w-full">
                <AreaChart data={businessGrowthData} width="100%">
                  <defs>
                    <linearGradient id="businessGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="year" 
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                    tickLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                    tickLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent 
                      formatter={(value) => [`$${value.toLocaleString()}`, "Valuation"]}
                    />} 
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
  );
};

export default BusinessCard;
