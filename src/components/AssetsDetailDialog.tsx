
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Home, Wallet, PiggyBank, DollarSign } from "lucide-react";

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
  // Mock detailed data for demonstration
  const realEstateDetails = {
    purchasePrice: 480000,
    purchaseYear: 2019,
    currentFMV: 620000,
    improvements: 35000,
    mortgageBalance: 285000,
    equity: 335000,
    yearlyAppreciation: 4.2,
    totalReturn: 29.2,
    address: "123 Maple Street, Toronto, ON"
  };

  const rrspDetails = {
    totalContributions: 45000,
    currentValue: 52000,
    availableRoom: 18500,
    ytdGrowth: 8.2,
    holdings: [
      { name: "Canadian Equity", value: 22000, percentage: 42.3 },
      { name: "US Equity", value: 15000, percentage: 28.8 },
      { name: "Bonds", value: 10000, percentage: 19.2 },
      { name: "International", value: 5000, percentage: 9.6 }
    ]
  };

  const tfsaDetails = {
    totalContributions: 35000,
    currentValue: 38000,
    availableRoom: 8500,
    ytdGrowth: 6.1,
    holdings: [
      { name: "Growth ETFs", value: 18000, percentage: 47.4 },
      { name: "Dividend Stocks", value: 12000, percentage: 31.6 },
      { name: "Cash", value: 8000, percentage: 21.1 }
    ]
  };

  const nonRegisteredDetails = {
    totalValue: 25000,
    ytdGrowth: 12.5,
    unrealizedGains: 3200,
    holdings: [
      { name: "Individual Stocks", value: 15000, percentage: 60 },
      { name: "High-Yield Savings", value: 7000, percentage: 28 },
      { name: "Crypto", value: 3000, percentage: 12 }
    ]
  };

  const fmvHistory = [
    { year: 2019, value: 480000 },
    { year: 2020, value: 495000 },
    { year: 2021, value: 540000 },
    { year: 2022, value: 565000 },
    { year: 2023, value: 590000 },
    { year: 2024, value: 620000 }
  ];

  const chartConfig = {
    value: { label: "Value", color: "#3b82f6" },
    equity: { label: "Equity", color: "#10b981" },
    bonds: { label: "Bonds", color: "#8b5cf6" },
    cash: { label: "Cash", color: "#f59e0b" }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Assets Portfolio Details</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="real-estate" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="real-estate" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Real Estate
            </TabsTrigger>
            <TabsTrigger value="rrsp" className="flex items-center gap-2">
              <PiggyBank className="w-4 h-4" />
              RRSP
            </TabsTrigger>
            <TabsTrigger value="tfsa" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              TFSA
            </TabsTrigger>
            <TabsTrigger value="non-registered" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Non-Registered
            </TabsTrigger>
          </TabsList>

          <TabsContent value="real-estate" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Property Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{realEstateDetails.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Purchase Price</p>
                      <p className="font-semibold text-lg">${realEstateDetails.purchasePrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Purchase Year</p>
                      <p className="font-semibold text-lg">{realEstateDetails.purchaseYear}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current FMV</p>
                      <p className="font-semibold text-lg text-green-600">${realEstateDetails.currentFMV.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Improvements</p>
                      <p className="font-semibold text-lg">${realEstateDetails.improvements.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mortgage Balance</p>
                      <p className="font-semibold text-lg text-red-600">${realEstateDetails.mortgageBalance.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Net Equity</p>
                      <p className="font-semibold text-lg text-green-600">${realEstateDetails.equity.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm">
                      <span className="font-semibold text-green-600">{realEstateDetails.totalReturn}%</span> total return
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fair Market Value History</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-64">
                    <LineChart data={fmvHistory}>
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </LineChart>
                  </ChartContainer>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>Annual appreciation rate: <span className="font-semibold text-green-600">{realEstateDetails.yearlyAppreciation}%</span></p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rrsp" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>RRSP Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Value</p>
                      <p className="font-semibold text-xl text-green-600">${rrspDetails.currentValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Contributions</p>
                      <p className="font-semibold text-xl">${rrspDetails.totalContributions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available Room</p>
                      <p className="font-semibold text-xl">${rrspDetails.availableRoom.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">YTD Growth</p>
                      <p className="font-semibold text-xl text-green-600">+{rrspDetails.ytdGrowth}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-48">
                    <PieChart>
                      <Pie
                        data={rrspDetails.holdings}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {rrspDetails.holdings.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={assets[index % assets.length]?.color || "#3b82f6"} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                  <div className="mt-4 space-y-2">
                    {rrspDetails.holdings.map((holding, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{holding.name}</span>
                        <span className="font-semibold">{holding.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tfsa" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>TFSA Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Value</p>
                      <p className="font-semibold text-xl text-green-600">${tfsaDetails.currentValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Contributions</p>
                      <p className="font-semibold text-xl">${tfsaDetails.totalContributions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available Room</p>
                      <p className="font-semibold text-xl">${tfsaDetails.availableRoom.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">YTD Growth</p>
                      <p className="font-semibold text-xl text-green-600">+{tfsaDetails.ytdGrowth}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Holdings Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-48">
                    <BarChart data={tfsaDetails.holdings}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Bar dataKey="value" fill="#8b5cf6" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                  </ChartContainer>
                  <div className="mt-4 space-y-2">
                    {tfsaDetails.holdings.map((holding, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{holding.name}</span>
                        <span className="font-semibold">${holding.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="non-registered" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Non-Registered Investments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Value</p>
                      <p className="font-semibold text-xl text-green-600">${nonRegisteredDetails.totalValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">YTD Growth</p>
                      <p className="font-semibold text-xl text-green-600">+{nonRegisteredDetails.ytdGrowth}%</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Unrealized Gains</p>
                      <p className="font-semibold text-xl text-green-600">+${nonRegisteredDetails.unrealizedGains.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Investment Mix</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-48">
                    <PieChart>
                      <Pie
                        data={nonRegisteredDetails.holdings}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {nonRegisteredDetails.holdings.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={assets[index % assets.length]?.color || "#f59e0b"} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                  <div className="mt-4 space-y-2">
                    {nonRegisteredDetails.holdings.map((holding, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{holding.name}</span>
                        <span className="font-semibold">${holding.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
