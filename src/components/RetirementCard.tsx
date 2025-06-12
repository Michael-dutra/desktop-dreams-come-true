
import { PiggyBank, TrendingUp, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RetirementDetailDialog } from "./RetirementDetailDialog";
import { useState } from "react";

const RetirementCard = () => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const readinessScore = 78; // Percentage
  
  // Retirement calculations
  const retirementAge = 65;
  const netMonthlyIncomeNeeded = 4500;
  const totalRetirementSavings = 90000;
  const projectedMonthlyIncome = 3200; // From CPP, OAS, and savings
  const lifeExpectancy = 90;
  const yearsInRetirement = lifeExpectancy - retirementAge;
  const yearsIncomeWillLast = totalRetirementSavings / (netMonthlyIncomeNeeded * 12);
  const coverageRatio = Math.min(1, yearsIncomeWillLast / yearsInRetirement);

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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Retirement Age</p>
                  <p className="text-lg font-semibold">{retirementAge}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Net Monthly Income Needed</p>
                  <p className="text-lg font-semibold">${netMonthlyIncomeNeeded.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Income Coverage</span>
                  <span className="text-sm font-bold">
                    {yearsIncomeWillLast.toFixed(0)} of {yearsInRetirement} years
                  </span>
                </div>
                <Progress 
                  value={coverageRatio * 100} 
                  className="h-3"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Years Needed: {yearsInRetirement}</span>
                  <span>Years Covered: {yearsIncomeWillLast.toFixed(0)}</span>
                </div>
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
