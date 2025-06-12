
import { Shield, TrendingUp, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InsuranceDetailDialog } from "./InsuranceDetailDialog";
import { useState } from "react";

const InsuranceCard = () => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  return (
    <>
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-full -translate-y-16 translate-x-16" />
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <span>Insurance</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDetailDialog(true)}
            className="flex items-center gap-2 hover:bg-blue-50"
          >
            <Eye className="w-4 h-4" />
            Details
          </Button>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Life Insurance */}
          <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-lg font-semibold text-blue-900">Life Insurance</p>
                <p className="text-sm text-blue-700">$320K Coverage</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xl font-bold text-blue-600">$1,200/year</p>
                <div className="flex items-center text-sm text-orange-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Gap: $320K</span>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Illness */}
          <div className="p-5 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-lg font-semibold text-green-900">Critical Illness</p>
                <p className="text-sm text-green-700">$50K Coverage</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xl font-bold text-green-600">$400/year</p>
                <div className="flex items-center text-sm text-red-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Gap: $100K</span>
                </div>
              </div>
            </div>
          </div>

          {/* Disability Insurance */}
          <div className="p-5 bg-purple-50 border border-purple-200 rounded-xl">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-lg font-semibold text-purple-900">Disability Insurance</p>
                <p className="text-sm text-purple-700">$3K/month Coverage</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xl font-bold text-purple-600">$800/year</p>
                <div className="flex items-center text-sm text-yellow-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Gap: $1.5K/mo</span>
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
