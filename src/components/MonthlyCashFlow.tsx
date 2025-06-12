
import { TrendingUp, TrendingDown, DollarSign, Eye, PiggyBank } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CashFlowDetailDialog } from "./CashFlowDetailDialog";
import { useState } from "react";

const MonthlyCashFlow = () => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  return (
    <>
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-50 to-transparent rounded-full -translate-y-16 translate-x-16" />
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <span>Monthly Cash Flow</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDetailDialog(true)}
            className="flex items-center gap-2 hover:bg-green-50"
          >
            <Eye className="w-4 h-4" />
            Details
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Net Cash Flow */}
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <p className="text-3xl font-bold text-green-600 mb-1">+$7,500</p>
            <p className="text-sm text-green-700 font-medium">Net Monthly Flow</p>
          </div>
          
          {/* Income vs Expenses */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-800">Income</span>
              </div>
              <p className="text-xl font-bold text-green-600">$22,500</p>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-sm font-semibold text-red-800">Expenses</span>
              </div>
              <p className="text-xl font-bold text-red-600">$15,000</p>
            </div>
          </div>
          
          {/* Key Metrics */}
          <div className="space-y-3 pt-2 border-t border-gray-200">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <PiggyBank className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Savings Rate</span>
              </div>
              <span className="text-lg font-bold text-blue-600">33.3%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
              <span className="text-sm font-medium text-emerald-800">vs Last Month</span>
              <span className="text-lg font-bold text-emerald-600">+$1,200</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <CashFlowDetailDialog 
        isOpen={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
      />
    </>
  );
};

export default MonthlyCashFlow;
