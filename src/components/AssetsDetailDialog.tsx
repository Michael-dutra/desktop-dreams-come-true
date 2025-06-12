
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, Home, Building, DollarSign, Lightbulb } from "lucide-react";

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

export const AssetsDetailDialog = ({ isOpen, onClose, assets }: AssetsDetailDialogProps) => {
  // Sample data for detailed asset breakdown
  const investmentGrowthData = [
    { month: "Jan", value: 785000 },
    { month: "Feb", value: 792000 },
    { month: "Mar", value: 798000 },
    { month: "Apr", value: 805000 },
    { month: "May", value: 812000 },
    { month: "Jun", value: 825000 },
  ];

  const realEstateData = [
    { name: "Primary Residence", value: 620000, color: "#8884d8" },
    { name: "Rental Property", value: 180000, color: "#82ca9d" },
  ];

  const investmentData = [
    { name: "401(k)", value: 285000, color: "#8884d8" },
    { name: "Roth IRA", value: 125000, color: "#82ca9d" },
    { name: "Taxable Investments", value: 215000, color: "#ffc658" },
  ];

  const chartConfig = {
    primary: { label: "Primary Residence", color: "#8884d8" },
    rental: { label: "Rental Property", color: "#82ca9d" },
    retirement: { label: "Retirement", color: "#8884d8" },
    roth: { label: "Roth IRA", color: "#82ca9d" },
    taxable: { label: "Taxable", color: "#ffc658" },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Assets Portfolio Analysis</DialogTitle>
        </DialogHeader>

        {/* Asset Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Asset Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="font-bold text-2xl text-green-600">$1,665,000</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Real Estate</p>
                <p className="font-bold text-2xl text-blue-600">$800,000</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Investments</p>
                <p className="font-bold text-2xl text-purple-600">$825,000</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Cash & Savings</p>
                <p className="font-bold text-2xl text-orange-600">$40,000</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Investment Portfolio Growth */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="w-6 h-6" />
                Investment Portfolio Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={investmentGrowthData}>
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, "Portfolio Value"]}
                    />
                    <Line 
                      dataKey="value"
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Real Estate Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Home className="w-6 h-6" />
                Real Estate Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ChartContainer config={chartConfig} className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={realEstateData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {realEstateData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
                      />
                      <ChartLegend content={<ChartLegendContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                
                <div className="space-y-3">
                  {realEstateData.map((property, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: property.color }}></div>
                        <span className="text-sm font-medium">{property.name}</span>
                      </div>
                      <span className="text-sm font-semibold">${property.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Building className="w-6 h-6" />
                Investment Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ChartContainer config={chartConfig} className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={investmentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {investmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
                      />
                      <ChartLegend content={<ChartLegendContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                
                <div className="space-y-3">
                  {investmentData.map((investment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: investment.color }}></div>
                        <span className="text-sm font-medium">{investment.name}</span>
                      </div>
                      <span className="text-sm font-semibold">${investment.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cash & Cash Equivalents */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <DollarSign className="w-6 h-6" />
                Cash & Cash Equivalents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <h4 className="font-semibold text-green-800">Emergency Fund</h4>
                  <p className="text-2xl font-bold text-green-600">$25,000</p>
                  <p className="text-sm text-green-700">High-yield savings account</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <h4 className="font-semibold text-blue-800">Checking Account</h4>
                  <p className="text-2xl font-bold text-blue-600">$8,500</p>
                  <p className="text-sm text-blue-700">Operating expenses</p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                  <h4 className="font-semibold text-purple-800">Money Market</h4>
                  <p className="text-2xl font-bold text-purple-600">$6,500</p>
                  <p className="text-sm text-purple-700">Short-term goals</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Guidance Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              AI Guidance for Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Diversification Review</h4>
                <p className="text-sm text-blue-700">Your portfolio shows good diversification across real estate and investments. Consider international exposure for further risk reduction.</p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Emergency Fund Status</h4>
                <p className="text-sm text-green-700">Your emergency fund covers about 4-5 months of expenses. Consider increasing to 6 months for optimal financial security.</p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Tax Optimization</h4>
                <p className="text-sm text-purple-700">Maximize your Roth IRA contributions and consider tax-loss harvesting in your taxable accounts to optimize your tax situation.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
