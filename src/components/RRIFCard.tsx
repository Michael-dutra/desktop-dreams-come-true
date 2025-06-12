
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, X, TrendingDown } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

const RRIFCard = () => {
  const [currentValue, setCurrentValue] = useState([350000]);
  const [returnRate, setReturnRate] = useState([5]);
  const [timeHorizon, setTimeHorizon] = useState([20]);
  const [showReport, setShowReport] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // CRA factor for age 71 is 5.28%
  const minWithdrawalFactor = 0.0528;
  const minWithdrawalAt71 = currentValue[0] * minWithdrawalFactor;

  // Generate projection data
  const generateProjectionData = () => {
    const data = [];
    let balance = currentValue[0];
    const annualReturn = returnRate[0] / 100;
    
    for (let year = 0; year <= timeHorizon[0]; year++) {
      data.push({
        year: year,
        balance: Math.round(balance)
      });
      
      if (year < timeHorizon[0]) {
        // Apply growth
        balance = balance * (1 + annualReturn);
        // Apply minimum withdrawal (starting from year 1)
        balance = balance - (balance * minWithdrawalFactor);
      }
    }
    
    return data;
  };

  const projectionData = generateProjectionData();
  const finalBalance = projectionData[projectionData.length - 1]?.balance || 0;

  const generateReport = () => {
    return `Based on a starting RRIF value of $${currentValue[0].toLocaleString()}, a ${returnRate[0]}% return, and a ${timeHorizon[0]}-year time horizon, your account will provide minimum annual withdrawals starting at $${Math.round(minWithdrawalAt71).toLocaleString()} at age 71. Over time, the account will gradually decline, with an estimated balance of $${finalBalance.toLocaleString()} at the end of the projection.

Current RRIF Value: $${currentValue[0].toLocaleString()}
Expected Annual Return: ${returnRate[0]}%
Time Horizon: ${timeHorizon[0]} years
Minimum Withdrawal at Age 71: $${Math.round(minWithdrawalAt71).toLocaleString()}
Projected Final Balance: $${finalBalance.toLocaleString()}

This projection assumes consistent market performance and follows CRA minimum withdrawal requirements. Actual results may vary based on market conditions and withdrawal strategies.`;
  };

  const chartConfig = {
    balance: { label: "RRIF Balance", color: "#ef4444" },
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-xl flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            <span>RRIF</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowReport(true)}
              className="text-blue-600 hover:bg-blue-50 p-1"
            >
              <FileText className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-600 hover:bg-red-50 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current RRIF Value */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Current RRIF Value</label>
            <div className="flex items-center space-x-2">
              <span className="text-sm">$</span>
              <Input 
                type="number" 
                value={currentValue[0]} 
                onChange={(e) => setCurrentValue([parseInt(e.target.value) || 0])}
                className="flex-1"
              />
            </div>
          </div>

          {/* Rate of Return Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Rate of Return (%)</label>
              <span className="text-sm font-semibold">{returnRate[0]}%</span>
            </div>
            <Slider
              value={returnRate}
              onValueChange={setReturnRate}
              max={8}
              min={0}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Time Horizon Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Time Horizon (Years)</label>
              <span className="text-sm font-semibold">{timeHorizon[0]} years</span>
            </div>
            <Slider
              value={timeHorizon}
              onValueChange={setTimeHorizon}
              max={30}
              min={5}
              step={1}
              className="w-full"
            />
          </div>

          {/* Minimum Withdrawal Calculation */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm font-medium text-amber-800">
              Minimum withdrawal at age 71: ${Math.round(minWithdrawalAt71).toLocaleString()}
            </p>
          </div>

          {/* Projection Chart */}
          <div>
            <h4 className="text-sm font-medium mb-3">Remaining Balance Projection</h4>
            <ChartContainer config={chartConfig} className="h-40">
              <LineChart data={projectionData}>
                <XAxis 
                  dataKey="year" 
                  tickFormatter={(value) => `${value}y`}
                />
                <YAxis 
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent formatter={(value) => [`$${value.toLocaleString()}`, "Balance"]} />} 
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Write-Up Report Modal */}
      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>RRIF Projection Report</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">
                {generateReport()}
              </pre>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowReport(false)}>
                Close
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Export to PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <X className="h-5 w-5 text-red-600" />
              <span>Delete RRIF Card</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this RRIF card?
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  setShowDeleteDialog(false);
                  // Handle deletion logic here
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RRIFCard;
