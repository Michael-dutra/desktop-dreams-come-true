import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, TrendingUp, Bot } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SectionAIDialog } from "./SectionAIDialog";

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssetsDetailDialog = ({ isOpen, onClose }: AssetsDetailDialogProps) => {
  const [rateOfReturn, setRateOfReturn] = useState([7]);
  const [timeHorizon, setTimeHorizon] = useState([10]);
  const [aiDialogOpen, setAIDialogOpen] = useState(false);

  const [assets] = useState([
    { name: "Real Estate", amount: "$620,000", value: 620000, color: "#3b82f6" },
    { name: "RRSP", amount: "$52,000", value: 52000, color: "#10b981" },
    { name: "TFSA", amount: "$38,000", value: 38000, color: "#8b5cf6" },
    { name: "Non-Registered", amount: "$25,000", value: 25000, color: "#f59e0b" },
    { name: "Digital Asset", amount: "$15,000", value: 15000, color: "#ef4444" },
  ]);

  // Calculate projected values
  const projectedAssets = assets.map(asset => {
    const projectedValue = asset.value * Math.pow(1 + rateOfReturn[0] / 100, timeHorizon[0]);
    return {
      ...asset,
      currentValue: asset.value,
      projectedValue: projectedValue,
      growth: projectedValue - asset.value
    };
  });

  const totalCurrentValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalProjectedValue = projectedAssets.reduce((sum, asset) => sum + asset.projectedValue, 0);
  const totalGrowth = totalProjectedValue - totalCurrentValue;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else {
      return `$${(value / 1000).toFixed(0)}K`;
    }
  };

  // Generate AI write-up based on live section data
  const generateAIAnalysis = () => {
    let text = `Your Personalized Asset Overview:\n\n`;
    text += `Hello! Here’s a breakdown of your current and projected net worth:\n\n`;
    text += `- Current total assets: ${formatCurrency(totalCurrentValue)}\n`;
    text += `- Projected asset value in ${timeHorizon[0]} years (at ${rateOfReturn[0]}%): ${formatCurrency(totalProjectedValue)}\n`;
    text += `- Anticipated growth: +${formatCurrency(totalGrowth)}\n\n`;
    text += `Detailed by asset type:\n`;
    projectedAssets.forEach(asset => {
      text += `• ${asset.name}: starts at ${formatCurrency(asset.currentValue)}, could reach ${formatCurrency(asset.projectedValue)} (growth: ${asset.growth >= 0 ? "+" : ""}${formatCurrency(asset.growth)})\n`;
    });
    text += `\nTips:\n`;
    text += `- A diverse asset allocation helps reduce risk while building wealth.\n`;
    text += `- Regular review of your portfolio and rate of return assumptions is wise, especially as markets and your risk tolerance change.\n\n`;
    text += `Have other assets not listed? Add them for an even more tailored plan.\n\nAdjust Rate of Return and Time Horizon sliders to visualize different outcomes.`;
    return text;
  };

  const handleAIDialogOpen = () => {
    setAIDialogOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Assets Details
            </DialogTitle>
          </DialogHeader>

          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Asset Allocation</CardTitle>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center border-indigo-600 text-indigo-700 hover:bg-indigo-50 px-3 rounded-lg shadow-sm"
                onClick={handleAIDialogOpen} // existing handler for AI analysis/show description
                style={{ border: '2px solid #6366f1' }}
              >
                <Bot className="w-4 h-4 mr-1 text-indigo-600" />
                AI
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Interactive Controls */}
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-orange-700">
                        Rate of Return: {rateOfReturn[0]}%
                      </label>
                      <Slider
                        value={rateOfReturn}
                        onValueChange={setRateOfReturn}
                        min={1}
                        max={15}
                        step={0.5}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-purple-700">
                        Time Horizon: {timeHorizon[0]} years
                      </label>
                      <Slider
                        value={timeHorizon}
                        onValueChange={setTimeHorizon}
                        min={1}
                        max={30}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <ChartContainer config={{}} className="h-64">
                  <PieChart>
                    <Pie
                      data={projectedAssets}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    >
                      {projectedAssets.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Projected Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold text-gray-900 text-xl">Asset</TableHead>
                    <TableHead className="font-bold text-gray-900 text-xl text-right">Current</TableHead>
                    <TableHead className="font-bold text-gray-900 text-xl text-right">Projected</TableHead>
                    <TableHead className="font-bold text-gray-900 text-xl text-right">Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectedAssets.map((asset, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-semibold text-xl py-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-5 h-5 rounded-full"
                            style={{ backgroundColor: asset.color }}
                          />
                          <span>{asset.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-xl py-4">{formatCurrency(asset.currentValue)}</TableCell>
                      <TableCell className="text-right font-bold text-blue-600 text-xl py-4">{formatCurrency(asset.projectedValue)}</TableCell>
                      <TableCell className="text-right font-bold text-green-600 text-xl py-4">+{formatCurrency(asset.growth)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2 bg-gray-50 font-bold">
                    <TableCell className="font-bold text-gray-900 text-2xl py-6">Total</TableCell>
                    <TableCell className="text-right font-bold text-gray-900 text-2xl py-6">{formatCurrency(totalCurrentValue)}</TableCell>
                    <TableCell className="text-right font-bold text-blue-600 text-2xl py-6">{formatCurrency(totalProjectedValue)}</TableCell>
                    <TableCell className="text-right font-bold text-green-600 text-2xl py-6">+{formatCurrency(totalGrowth)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
      <SectionAIDialog
        isOpen={aiDialogOpen}
        onClose={() => setAIDialogOpen(false)}
        title="Assets"
        content={generateAIAnalysis()}
      />
    </>
  );
};
