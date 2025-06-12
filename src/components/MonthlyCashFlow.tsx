
import { TrendingUp, TrendingDown, DollarSign, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CashFlowDetailDialog } from "./CashFlowDetailDialog";
import { useState } from "react";

const MonthlyCashFlow = () => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Cash Flow</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDetailDialog(true)}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Details
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-2xl font-bold text-green-600">+$7,500</p>
              <p className="text-sm text-muted-foreground">This Month</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">Income</span>
                </div>
                <p className="text-lg font-semibold">$22,500</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-red-600">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-sm font-medium">Expenses</span>
                </div>
                <p className="text-lg font-semibold">$15,000</p>
              </div>
            </div>
            
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Savings Rate</span>
                <span className="font-medium">33.3%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">vs Last Month</span>
                <span className="text-green-600 font-medium">+$1,200</span>
              </div>
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
