
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { TrendingUp, FileText, X, Plus, Brain, Lightbulb, Edit2, Check, Copy } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useMemo } from "react";

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

const generateStableChartData = (currentValue: number, futureValue: number, years: number, rate: number) => {
  const points = [];
  const steps = 10;
  
  for (let i = 0; i <= steps; i++) {
    const yearProgress = (years * i) / steps;
    const currentProjection = currentValue * Math.pow(1 + rate / 100, yearProgress);
    
    points.push({
      year: yearProgress.toFixed(1),
      current: currentValue,
      future: currentProjection,
      yearLabel: i === 0 ? 'Now' : i === steps ? `${years}Y` : `${yearProgress.toFixed(1)}Y`
    });
  }
  
  return points;
};

export const AssetsDetailDialog = ({ isOpen, onClose, assets }: AssetsDetailDialogProps) => {
  const [realEstateYears, setRealEstateYears] = useState([10]);
  const [rrspYears, setRrspYears] = useState([10]);
  const [tfsaYears, setTfsaYears] = useState([10]);
  const [nonRegYears, setNonRegYears] = useState([10]);

  const [realEstateRate, setRealEstateRate] = useState([4.2]);
  const [rrspRate, setRrspRate] = useState([7.0]);
  const [tfsaRate, setTfsaRate] = useState([6.5]);
  const [nonRegRate, setNonRegRate] = useState([8.0]);

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>("");

  const [realEstateDetails, setRealEstateDetails] = useState({
    purchasePrice: 480000,
    purchaseYear: 2019,
    currentFMV: 620000,
    improvements: 35000,
    mortgageBalance: 285000,
    equity: 335000,
    yearlyAppreciation: 4.2,
    totalReturn: 29.2,
    address: "123 Maple Street, Toronto, ON",
  });

  const [rrspDetails, setRrspDetails] = useState({
    currentValue: 52000,
    availableRoom: 18500,
    ytdGrowth: 8.2,
    annualContribution: 6000,
    monthlyContribution: 500,
  });

  const [tfsaDetails, setTfsaDetails] = useState({
    currentValue: 38000,
    availableRoom: 8500,
    ytdGrowth: 6.1,
    annualContribution: 5000,
    monthlyContribution: 417,
  });

  const [nonRegisteredDetails, setNonRegisteredDetails] = useState({
    totalValue: 25000,
    unrealizedGains: 3200,
    annualContribution: 2000,
    monthlyContribution: 167,
  });

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<{ name: string; type: string } | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<{ name: string; type: string } | null>(null);
  const [editableReport, setEditableReport] = useState("");
  const [isEditingReport, setIsEditingReport] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Calculate future values
  const realEstateFV = realEstateDetails.currentFMV * Math.pow(1 + realEstateRate[0] / 100, realEstateYears[0]);
  const rrspFV = rrspDetails.currentValue * Math.pow(1 + rrspRate[0] / 100, rrspYears[0]) + 
                 (rrspDetails.annualContribution * ((Math.pow(1 + rrspRate[0] / 100, rrspYears[0]) - 1) / (rrspRate[0] / 100)));
  const tfsaFV = tfsaDetails.currentValue * Math.pow(1 + tfsaRate[0] / 100, tfsaYears[0]) + 
                 (tfsaDetails.annualContribution * ((Math.pow(1 + tfsaRate[0] / 100, tfsaYears[0]) - 1) / (tfsaRate[0] / 100)));
  const nonRegFV = nonRegisteredDetails.totalValue * Math.pow(1 + nonRegRate[0] / 100, nonRegYears[0]) + 
                   (nonRegisteredDetails.annualContribution * ((Math.pow(1 + nonRegRate[0] / 100, nonRegYears[0]) - 1) / (nonRegRate[0] / 100)));

  const generateAssetReport = (assetName: string, assetType: string) => {
    switch (assetType) {
      case "Primary Residence":
        return `Your Primary Residence currently holds $${realEstateDetails.currentFMV.toLocaleString()} and is projected to grow to $${Math.round(realEstateFV).toLocaleString()} over ${realEstateYears[0]} years, assuming ${realEstateRate[0]}% annual appreciation.

Current Fair Market Value: $${realEstateDetails.currentFMV.toLocaleString()}
Purchase Price: $${realEstateDetails.purchasePrice.toLocaleString()}
Mortgage Balance: $${realEstateDetails.mortgageBalance.toLocaleString()}
Net Equity: $${(realEstateDetails.currentFMV - realEstateDetails.mortgageBalance).toLocaleString()}
Growth Assumption: ${realEstateRate[0]}% annually
Projected Value: $${Math.round(realEstateFV).toLocaleString()}
Total Projected Growth: $${Math.round(realEstateFV - realEstateDetails.currentFMV).toLocaleString()}

This projection assumes consistent real estate market performance. Actual results may vary based on local market conditions, property improvements, and economic factors.`;

      case "RRSP":
        return `Your RRSP currently holds $${rrspDetails.currentValue.toLocaleString()} and is projected to grow to $${Math.round(rrspFV).toLocaleString()} over ${rrspYears[0]} years, assuming ${rrspRate[0]}% annual returns and $${rrspDetails.annualContribution.toLocaleString()} in annual contributions.

Current Value: $${rrspDetails.currentValue.toLocaleString()}
Available Contribution Room: $${rrspDetails.availableRoom.toLocaleString()}
Annual Contributions: $${rrspDetails.annualContribution.toLocaleString()}
Monthly Contributions: $${rrspDetails.monthlyContribution.toLocaleString()}
Growth Assumption: ${rrspRate[0]}% annually
Projected Value: $${Math.round(rrspFV).toLocaleString()}
Total Projected Growth: $${Math.round(rrspFV - rrspDetails.currentValue).toLocaleString()}

This projection assumes consistent market performance and regular contributions. RRSP contributions provide immediate tax deductions, making this an excellent tax-deferred growth vehicle.`;

      case "TFSA":
        return `Your TFSA currently holds $${tfsaDetails.currentValue.toLocaleString()} and is projected to grow to $${Math.round(tfsaFV).toLocaleString()} over ${tfsaYears[0]} years, assuming ${tfsaRate[0]}% annual returns and $${tfsaDetails.annualContribution.toLocaleString()} in annual contributions.

Current Value: $${tfsaDetails.currentValue.toLocaleString()}
Available Contribution Room: $${tfsaDetails.availableRoom.toLocaleString()}
Annual Contributions: $${tfsaDetails.annualContribution.toLocaleString()}
Monthly Contributions: $${tfsaDetails.monthlyContribution.toLocaleString()}
Growth Assumption: ${tfsaRate[0]}% annually
Projected Value: $${Math.round(tfsaFV).toLocaleString()}
Total Projected Growth: $${Math.round(tfsaFV - tfsaDetails.currentValue).toLocaleString()}

This projection assumes consistent market performance and regular contributions. TFSA growth is completely tax-free, making this an excellent vehicle for long-term wealth building.`;

      case "Non-Registered":
        return `Your Non-Registered investment account currently holds $${nonRegisteredDetails.totalValue.toLocaleString()} and is projected to grow to $${Math.round(nonRegFV).toLocaleString()} over ${nonRegYears[0]} years, assuming ${nonRegRate[0]}% annual returns and $${nonRegisteredDetails.annualContribution.toLocaleString()} in annual contributions.

Current Value: $${nonRegisteredDetails.totalValue.toLocaleString()}
Unrealized Gains: $${nonRegisteredDetails.unrealizedGains.toLocaleString()}
Annual Contributions: $${nonRegisteredDetails.annualContribution.toLocaleString()}
Monthly Contributions: $${nonRegisteredDetails.monthlyContribution.toLocaleString()}
Growth Assumption: ${nonRegRate[0]}% annually
Projected Value: $${Math.round(nonRegFV).toLocaleString()}
Total Projected Growth: $${Math.round(nonRegFV - nonRegisteredDetails.totalValue).toLocaleString()}

This projection assumes consistent market performance and regular contributions. Note that capital gains and dividends in non-registered accounts are subject to taxation.`;

      default:
        return `Your ${assetName} is being tracked with custom parameters. Please review the detailed projections in the card above for specific growth assumptions and projected values.`;
    }
  };

  const handleAssetReport = (assetName: string, assetType: string) => {
    setSelectedAsset({ name: assetName, type: assetType });
    const report = generateAssetReport(assetName, assetType);
    setEditableReport(report);
    setReportModalOpen(true);
    setIsEditingReport(false);
  };

  const handleEditToggle = () => {
    setIsEditingReport(!isEditingReport);
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

  const confirmAssetDelete = () => {
    if (assetToDelete) {
      console.log(`Delete confirmed for asset: ${assetToDelete.name}`);
      setDeleteModalOpen(false);
      setAssetToDelete(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Assets</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Asset cards would be rendered here */}
        </div>

        {/* Asset Report Modal */}
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
                {isEditingReport ? (
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
                    {isEditingReport ? 'Preview' : 'Edit'}
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
                onClick={confirmAssetDelete}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
};
