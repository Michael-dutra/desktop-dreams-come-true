
import { Shield, TrendingUp, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InsuranceDetailDialog } from "./InsuranceDetailDialog";
import { useState } from "react";

const InsuranceCard = () => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Insurance</span>
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
              <p className="text-2xl font-bold text-foreground">$2,400/year</p>
              <p className="text-sm text-muted-foreground">Total Coverage Cost</p>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Life Insurance</p>
                    <p className="text-xs text-blue-700">$320K Coverage</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-600">$1,200/year</p>
                    <div className="flex items-center text-xs text-orange-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>Gap: $320K</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-green-900">Critical Illness</p>
                    <p className="text-xs text-green-700">$50K Coverage</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">$400/year</p>
                    <div className="flex items-center text-xs text-red-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>Gap: $100K</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-purple-900">Disability Insurance</p>
                    <p className="text-xs text-purple-700">$3K/month Coverage</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-purple-600">$800/year</p>
                    <div className="flex items-center text-xs text-yellow-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>Gap: $1.5K/mo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <InsuranceDetailDialog 
        isOpen={showDetailDialog}
        onClose={() => setShowDetailDialog(false)}
      />
    </>
  );
};

export default InsuranceCard;
