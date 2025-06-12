
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { AssetsDetailDialog } from "./AssetsDetailDialog";
import { Button } from "@/components/ui/button";
import { Eye, TrendingUp, FileText, Edit2, Copy, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const AssetsBreakdown = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableReport, setEditableReport] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const [assets, setAssets] = useState([
    { name: "Real Estate", amount: "$620,000", value: 620000, color: "#3b82f6" },
    { name: "RRSP", amount: "$52,000", value: 52000, color: "#10b981" },
    { name: "TFSA", amount: "$38,000", value: 38000, color: "#8b5cf6" },
    { name: "Non-Registered", amount: "$25,000", value: 25000, color: "#f59e0b" },
  ]);

  const chartConfig = {
    realEstate: { label: "Real Estate", color: "#3b82f6" },
    rrsp: { label: "RRSP", color: "#10b981" },
    tfsa: { label: "TFSA", color: "#8b5cf6" },
    nonRegistered: { label: "Non-Registered", color: "#f59e0b" },
  };

  const generateReport = (asset) => {
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

  const handleGenerateReport = (asset) => {
    setSelectedAsset(asset);
    const report = generateReport(asset);
    setEditableReport(report);
    setReportModalOpen(true);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleCopyReport = async () => {
    try {
      await navigator.clipboard.writeText(editableReport);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
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
        <CardContent>
          <div className="space-y-6">
            {/* Breakdown List */}
            <div className="space-y-3">
              {assets.map((asset, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: asset.color }}></div>
                    <span className="text-lg font-medium">{asset.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold">{asset.amount}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleGenerateReport(asset)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Chart - Made bigger and better centered */}
            <div className="flex justify-center">
              <ChartContainer config={chartConfig} className="h-80 w-full max-w-md mx-auto">
                <PieChart>
                  <Pie
                    data={assets}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {assets.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>

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
              {isEditing ? (
                <Textarea
                  value={editableReport}
                  onChange={(e) => setEditableReport(e.target.value)}
                  className="min-h-[300px] font-mono text-sm resize-none"
                />
              ) : (
                <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">
                  {editableReport}
                </pre>
              )}
            </div>
            <div className="flex justify-between">
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleEditToggle}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  {isEditing ? 'Preview' : 'Edit'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCopyReport}
                  className="flex items-center gap-2"
                >
                  {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copySuccess ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setReportModalOpen(false)}>
                  Close
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Export to PDF
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AssetsDetailDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        assets={assets}
      />
    </>
  );
};

export default AssetsBreakdown;
