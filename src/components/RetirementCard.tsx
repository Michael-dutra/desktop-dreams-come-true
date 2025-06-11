import { PiggyBank, TrendingUp, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RetirementDetailDialog } from "./RetirementDetailDialog";
import { useState } from "react";

const RetirementCard = () => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const readinessScore = 78; // Percentage

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <PiggyBank className="h-5 w-5" />
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
          
            <div className="border-t pt-3 space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Retirement Readiness</span>
                  <span className="text-sm font-bold text-green-600">{readinessScore}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${readinessScore}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {readinessScore >= 80 ? "Excellent progress" : 
                   readinessScore >= 60 ? "Good progress" : 
                   "Needs attention"}
                </p>
              </div>
            
              <div className="flex items-center space-x-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">On track for 65</span>
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
