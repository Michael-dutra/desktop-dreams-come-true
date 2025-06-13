import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { TrendingUp, Copy, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssetsDetailDialog = ({ isOpen, onClose }: AssetsDetailDialogProps) => {
  const [assets] = useState([
    { name: "Real Estate", amount: "$620,000", value: 620000, color: "#3b82f6" },
    { name: "RRSP", amount: "$52,000", value: 52000, color: "#10b981" },
    { name: "TFSA", amount: "$38,000", value: 38000, color: "#8b5cf6" },
    { name: "Non-Registered", amount: "$25,000", value: 25000, color: "#f59e0b" },
  ]);

  const totalAssetsValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(0)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <DialogHeader className="flex flex-row items-center justify-between p-6 border-b bg-white">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <DialogTitle className="text-2xl font-bold">Assets Report</DialogTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Copy
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                Export to PDF
              </Button>
            </div>
          </DialogHeader>
          
          <div className="p-6 flex-1 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Asset Breakdown</h3>
            <ul className="space-y-3">
              {assets.map((asset, index) => (
                <li key={index} className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }}></div>
                    <span>{asset.name}</span>
                  </div>
                  <span className="font-semibold">{asset.amount}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-between items-center">
              <span className="font-bold text-gray-700">Total Assets Value:</span>
              <span className="text-xl font-bold text-blue-600">{formatCurrency(totalAssetsValue)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssetsDetailDialog;
