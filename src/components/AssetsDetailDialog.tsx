
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line } from "recharts";
import { TrendingUp, DollarSign, Target, Calendar, FileText, X } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Array<{
    name: string;
    amount: string;
    value: number;
    color: string;
  }>;
}

export const AssetsDetailDialog = ({ isOpen, onClose, assets }: AssetsDetailDialogProps) => {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<any>(null);

  const generateReport = (asset: any) => {
    const growthRate = asset.name === "Real Estate" ? 4 : asset.name === "RRSP" ? 7 : asset.name === "TFSA" ? 6 : 5;
    const monthlyContribution = asset.name === "Real Estate" ? 0 : asset.name === "RRSP" ? 750 : asset.name === "TFSA" ? 500 : 300;
    const currentAge = 35;
    const retirementAge = 65;
    const yearsToRetirement = retirementAge - currentAge;
    
    // Simple compound growth calculation
    const futureValue = asset.value * Math.pow(1 + growthRate/100, yearsToRetirement) + 
                       (monthlyContribution * 12 * ((Math.pow(1 + growthRate/100, yearsToRetirement) - 1) / (growthRate/100)));

    return `Your ${asset.name} currently holds ${asset.amount} and is projected to grow to $${Math.round(futureValue).toLocaleString()} by age ${retirementAge}, assuming ${growthRate}% annual returns${monthlyContribution > 0 ? ` and $${monthlyContribution} monthly contributions` : ''}.

Current Value: ${asset.amount}
Growth Assumption: ${growthRate}% annually
${monthlyContribution > 0 ? `Monthly Contributions: $${monthlyContribution}` : 'No regular contributions planned'}
Projected Value at Retirement: $${Math.round(futureValue).toLocaleString()}
Total Growth: $${Math.round(futureValue - asset.value).toLocaleString()}

This projection assumes consistent market performance and regular contributions. Actual results may vary based on market conditions, changes in contribution amounts, and other economic factors.`;
  };

  const handleDocumentClick = (asset: any) => {
    setSelectedAsset(asset);
    setReportModalOpen(true);
  };

  const handleDeleteClick = (asset: any) => {
    setAssetToDelete(asset);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (assetToDelete) {
      // This would need to be passed up to parent component to actually remove from assets array
      console.log("Deleting asset:", assetToDelete.name);
      setDeleteModalOpen(false);
      setAssetToDelete(null);
    }
  };

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  const chartData = assets.map(asset => ({
    ...asset,
    percentage: ((asset.value / totalValue) * 100).toFixed(1)
  }));

  const projectionData = [
    { year: "2024", value: totalValue },
    { year: "2025", value: totalValue * 1.06 },
    { year: "2026", value: totalValue * 1.12 },
    { year: "2027", value: totalValue * 1.19 },
    { year: "2028", value: totalValue * 1.26 },
    { year: "2029", value: totalValue * 1.34 },
    { year: "2030", value: totalValue * 1.42 },
  ];

  const chartConfig = {
    value: { label: "Value", color: "#8b5cf6" },
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <span>Assets Overview</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Total Assets</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">${totalValue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-1">Current market value</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Projected Growth</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">+6.8%</p>
                  <p className="text-sm text-muted-foreground mt-1">Annual average return</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Time Horizon</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">30 years</p>
                  <p className="text-sm text-muted-foreground mt-1">Until retirement</p>
                </CardContent>
              </Card>
            </div>

            {/* Asset Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-80">
                    <PieChart>
                      <Pie
                        data={assets}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {assets.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Growth Projection</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-80">
                    <LineChart data={projectionData}>
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Individual Asset Cards */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Individual Assets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assets.map((asset, index) => (
                  <Card key={index} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: asset.color }}></div>
                          <span>{asset.name}</span>
                        </CardTitle>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-blue-50"
                            onClick={() => handleDocumentClick(asset)}
                          >
                            <FileText className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-50"
                            onClick={() => handleDeleteClick(asset)}
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Current Value</span>
                          <span className="font-semibold">{asset.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Portfolio %</span>
                          <span className="font-semibold">{((asset.value / totalValue) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Growth Rate</span>
                          <span className="font-semibold text-green-600">
                            {asset.name === "Real Estate" ? "4%" : asset.name === "RRSP" ? "7%" : asset.name === "TFSA" ? "6%" : "5%"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t">
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Report Modal */}
      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>{selectedAsset?.name} Report</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">
                {selectedAsset ? generateReport(selectedAsset) : ''}
              </pre>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setReportModalOpen(false)}>
                Close
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Export to PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2 text-red-600">
              <X className="h-5 w-5" />
              <span>Delete Asset Card</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the <strong>{assetToDelete?.name}</strong> asset card? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
