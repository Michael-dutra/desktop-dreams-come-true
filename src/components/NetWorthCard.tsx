
import { TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NetWorthCard = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Net Worth</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-3xl font-bold text-foreground">$287,500</p>
            <div className="flex items-center space-x-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">+$32,500 this month</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-sm text-muted-foreground">Total Assets</p>
              <p className="text-lg font-semibold">$735,000</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Liabilities</p>
              <p className="text-lg font-semibold text-red-600">$447,500</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetWorthCard;
