
import { Shield, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InsuranceCard = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Insurance</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-2xl font-bold text-foreground">$2,400/year</p>
            <p className="text-sm text-muted-foreground">Total Premiums</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Life Insurance</span>
              <span className="text-sm font-medium">$1,200/year</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Home Insurance</span>
              <span className="text-sm font-medium">$800/year</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Auto Insurance</span>
              <span className="text-sm font-medium">$400/year</span>
            </div>
          </div>
          
          <div className="border-t pt-2">
            <div className="flex items-center space-x-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Well covered</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsuranceCard;
