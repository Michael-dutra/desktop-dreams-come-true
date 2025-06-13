
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { AssetsDetailDialog } from "./AssetsDetailDialog";
import { Button } from "@/components/ui/button";
import { Eye, TrendingUp } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AssetsBreakdown = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rateOfReturn, setRateOfReturn] = useState([7]);
  const [timeHorizon, setTimeHorizon] = useState([10]);

  const [assets] = useState([
    { name: "Real Estate", amount: "$620,000", value: 620000, color: "#3b82f6" },
    { name: "RRSP", amount: "$52,000", value: 52000, color: "#10b981" },
    { name: "TFSA", amount: "$38,000", value: 38000, color: "#8b5cf6" },
    { name: "Non-Registered", amount: "$25,000", value: 25000, color: "#f59e0b" },
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

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-2xl flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <span>Assets</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <Eye className="w-4 h-4" />
            Details
          </Button>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-6">
            {/* Interactive Controls */}
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
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
            
            {/* Assets Table */}
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold text-gray-900 text-lg">Asset</TableHead>
                    <TableHead className="font-bold text-gray-900 text-lg text-right">Current</TableHead>
                    <TableHead className="font-bold text-gray-900 text-lg text-right">Projected</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectedAssets.map((asset, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-semibold text-base py-4">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: asset.color }}
                          />
                          <span>{asset.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-base py-4">
                        {formatCurrency(asset.currentValue)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-blue-600 text-base py-4">
                        {formatCurrency(asset.projectedValue)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2 bg-gray-50 font-bold">
                    <TableCell className="font-bold text-gray-900 text-lg py-4">Total</TableCell>
                    <TableCell className="text-right font-bold text-gray-900 text-lg py-4">
                      {formatCurrency(totalCurrentValue)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-blue-600 text-lg py-4">
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
        assets={assets}
      />
    </>
  );
};

export default AssetsBreakdown;
