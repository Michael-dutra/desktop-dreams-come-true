
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { AssetsDetailDialog } from "./AssetsDetailDialog";
import { Button } from "@/components/ui/button";
import { Eye, TrendingUp, Plus } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bot } from "lucide-react";
import { SectionAIDialog } from "./SectionAIDialog";
import { useFinancialData } from "@/contexts/FinancialDataContext";

const AssetsBreakdown = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rateOfReturn, setRateOfReturn] = useState([7]);
  const [timeHorizon, setTimeHorizon] = useState([10]);
  const [aiDialogOpen, setAIDialogOpen] = useState(false);

  const { assets, getTotalAssets } = useFinancialData();

  // Check if we have any assets
  const hasAssets = assets.length > 0;

  // Calculate projected values only if we have assets
  const projectedAssets = hasAssets ? assets.map(asset => {
    const projectedValue = asset.value * Math.pow(1 + rateOfReturn[0] / 100, timeHorizon[0]);
    return {
      ...asset,
      currentValue: asset.value,
      projectedValue: projectedValue,
      growth: projectedValue - asset.value
    };
  }) : [];

  const totalCurrentValue = getTotalAssets();
  const totalProjectedValue = hasAssets ? projectedAssets.reduce((sum, asset) => sum + asset.projectedValue, 0) : 0;
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
    if (!hasAssets) {
      return `Your Asset Portfolio Awaits:\n\nHello! You haven't added any assets yet. Getting started is simple:\n\n1. Click the "Add Asset" button to begin\n2. Choose from various asset types (real estate, investments, retirement accounts, etc.)\n3. Watch your net worth automatically update\n\nTips for Getting Started:\n- Start with your largest assets first (home, retirement accounts)\n- Include all investment accounts (RRSP, TFSA, non-registered)\n- Don't forget about business assets or other valuable holdings\n- Real estate should reflect current market value\n\nOnce you add assets, you'll be able to:\n- Project future growth with interactive sliders\n- See detailed tax implications\n- Analyze your asset allocation\n- Plan for retirement and estate needs\n\nReady to build your financial picture? Click "Add Asset" to start!`;
    }

    let text = `Your Personalized Asset Overview:\n\n`;
    text += `Hello! Here's a breakdown of your current and projected net worth:\n\n`;
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

  // Blank state when no assets
  if (!hasAssets) {
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
          <CardContent className="flex-1 flex flex-col items-center justify-center p-6 pt-0">
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-12 w-12 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">No Assets Added Yet</h3>
                <p className="text-gray-600 max-w-sm">Start building your financial picture by adding your first asset. Track real estate, investments, retirement accounts, and more.</p>
              </div>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Asset
              </Button>
            </div>
          </CardContent>
        </Card>
        <AssetsDetailDialog 
          isOpen={isDialogOpen} 
          onClose={() => setIsDialogOpen(false)} 
        />
        <SectionAIDialog
          isOpen={aiDialogOpen}
          onClose={() => setAIDialogOpen(false)}
          title="Assets"
          content={generateAIAnalysis()}
        />
      </>
    );
  }

  // Normal state when assets exist
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
              onClick={() => setIsDialogOpen(true)}
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
            <div className="rounded-lg border flex-1 flex flex-col min-h-0 mb-4 p-6">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">No Assets to Display</h3>
                    <p className="text-gray-600 text-sm">Add your first asset to see it here</p>
                  </div>
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Asset Here
                  </Button>
                </div>
              </div>
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
