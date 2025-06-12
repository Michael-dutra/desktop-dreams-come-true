import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { InsuranceDetailDialog } from "./InsuranceDetailDialog";

const InsuranceCard = () => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Insurance Coverage</span>
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
              <p className="text-2xl font-bold text-blue-600">$1.2M</p>
              <p className="text-sm text-muted-foreground">Total Coverage</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Life Insurance</span>
                <span className="text-sm font-medium">$500K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Home Insurance</span>
                <span className="text-sm font-medium">$400K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Auto Insurance</span>
                <span className="text-sm font-medium">$300K</span>
              </div>
            </div>
            
            <div className="border-t pt-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Monthly Premiums</span>
                <span className="text-sm font-semibold text-blue-600">$485</span>
              </div>
            </div>

            {/* AI Guidance */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">AI Insurance Tips</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                  <p className="text-blue-800">Consider umbrella insurance for additional liability protection beyond your current coverage limits.</p>
                </div>
                <div className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                  <p className="text-green-800">Review your life insurance needs annually. Your current coverage may need adjustment based on income changes.</p>
                </div>
                <div className="p-2 bg-purple-50 border border-purple-200 rounded text-xs">
                  <p className="text-purple-800">Bundle home and auto insurance with the same provider to potentially save 10-25% on premiums.</p>
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
