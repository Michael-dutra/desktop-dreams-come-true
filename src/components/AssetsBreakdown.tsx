
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { AssetsDetailDialog } from "./AssetsDetailDialog";
import { Button } from "@/components/ui/button";
import { Eye, TrendingUp } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bot } from "lucide-react";
import { SectionAIDialog } from "./SectionAIDialog";

// Dummy asset data for dialog
const defaultAsset = {
  id: "1",
  name: "Real Estate",
  assetType: "Property",
  assetCategory: "Home",
  assetSubCategory: "Detached",
  currency: "USD",
  acquisitionDate: new Date().toISOString(),
  quantity: 1,
  interestRate: 0,
  apy: 0,
  termLength: 0,
  acquisitionCost: 450000,
  currentValue: 620000,
  annualDepreciation: 0,
  annualIncome: 0,
  estimatedGrowthRate: 0,
  notes: ""
};

const AssetsBreakdown = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rateOfReturn, setRateOfReturn] = useState([7]);
  const [timeHorizon, setTimeHorizon] = useState([10]);
  const [aiDialogOpen, setAIDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(defaultAsset);

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

  // Handler to open dialog for asset details
  const handleOpenDetails = (asset) => {
    setSelectedAsset({
      ...defaultAsset,
      ...asset,
      id: asset.name + "-id"
    });
    setIsDialogOpen(true);
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-2xl flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <span>Assets</span>
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleOpenDetails(assets[0])}
              className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Eye className="w-4 h-4" />
              Details
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
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-6 pt-0">
          <div className="flex-1 flex flex-col">
            {/* Interactive Controls */}
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 mb-6">
              <div className="grid grid-cols-2 gap-6">
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
            
            {/* Assets Table - Takes up remaining space */}
            <div className="rounded-lg border flex-1 flex flex-col min-h-0 mb-4">
              <Table className="h-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold text-gray-900 text-xl h-16">Asset</TableHead>
                    <TableHead className="font-bold text-gray-900 text-xl text-right h-16">Current</TableHead>
                    <TableHead className="font-bold text-gray-900 text-xl text-right h-16">Projected</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectedAssets.map((asset, index) => (
                    <TableRow key={index} className="hover:bg-gray-50 h-20">
                      <TableCell className="font-semibold text-xl py-6">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-5 h-5 rounded-full" 
                            style={{ backgroundColor: asset.color }}
                          />
                          <span>{asset.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-xl py-6">
                        {formatCurrency(asset.currentValue)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-blue-600 text-xl py-6">
                        {formatCurrency(asset.projectedValue)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2 bg-gray-50 font-bold h-20">
                    <TableCell className="font-bold text-gray-900 text-2xl py-6">Total</TableCell>
                    <TableCell className="text-right font-bold text-gray-900 text-2xl py-6">
                      {formatCurrency(totalCurrentValue)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-blue-600 text-2xl py-6">
                      {formatCurrency(totalProjectedValue)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Growth Summary */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 font-medium">Total Growth</p>
                <p className="text-xl font-bold text-green-600">+{formatCurrency(totalGrowth)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-blue-600 font-medium">Projection Period</p>
                <p className="text-xl font-bold text-blue-800">{timeHorizon[0]} years at {rateOfReturn[0]}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <AssetsDetailDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        asset={selectedAsset}
      />
      <SectionAIDialog
        isOpen={aiDialogOpen}
        onClose={() => setAIDialogOpen(false)}
        title="Assets"
        content={generateAIAnalysis()}
      />
    </>
  );
};

export default AssetsBreakdown;
