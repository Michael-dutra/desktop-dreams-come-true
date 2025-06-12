import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Eye, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RetirementDetailDialog } from "./RetirementDetailDialog";

const RetirementCard = () => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Retirement</span>
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
              <p className="text-2xl font-bold text-green-600">$425,000</p>
              <p className="text-sm text-muted-foreground">Total Retirement Savings</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">401(k)</span>
                <span className="text-sm font-medium">$285K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">IRA</span>
                <span className="text-sm font-medium">$95K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Roth IRA</span>
                <span className="text-sm font-medium">$45K</span>
              </div>
            </div>
            
            <div className="border-t pt-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Monthly Contributions</span>
                <span className="text-sm font-semibold text-green-600">$2,150</span>
              </div>
            </div>

            {/* AI Guidance */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">AI Retirement Tips</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                  <p className="text-blue-800">You're saving 19% for retirement - consider maximizing your 401(k) contribution to the annual limit of $23,000.</p>
                </div>
                <div className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                  <p className="text-green-800">Consider a backdoor Roth IRA conversion to maximize tax-free growth potential for retirement.</p>
                </div>
                <div className="p-2 bg-purple-50 border border-purple-200 rounded text-xs">
                  <p className="text-purple-800">Review your 401(k) investment allocation quarterly to ensure it aligns with your risk tolerance and timeline.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <RetirementDetailDialog 
        isOpen={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
      />
    </>
  );
};

export default RetirementCard;
