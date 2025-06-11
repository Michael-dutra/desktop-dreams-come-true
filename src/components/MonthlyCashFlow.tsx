
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const MonthlyCashFlow = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Monthly Cash Flow</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-2xl font-bold text-green-600">$15,000</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Income</span>
              <span className="text-sm font-medium">$22,500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Debt Payments</span>
              <span className="text-sm font-medium text-red-600">$7,500</span>
            </div>
          </div>
          
          <div className="border-t pt-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Net Cash Flow</span>
              <span className="text-sm font-semibold text-green-600">$7,500</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyCashFlow;
