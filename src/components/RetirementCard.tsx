
import { PiggyBank, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RetirementCard = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <PiggyBank className="h-5 w-5" />
          <span>Retirement</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-2xl font-bold text-foreground">$90,000</p>
            <p className="text-sm text-muted-foreground">Total Retirement Savings</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">RRSP</span>
              <span className="text-sm font-medium">$52,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">TFSA</span>
              <span className="text-sm font-medium">$38,000</span>
            </div>
          </div>
          
          <div className="border-t pt-2">
            <div className="flex items-center space-x-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">On track for 65</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RetirementCard;
