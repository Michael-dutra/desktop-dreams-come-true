import { Crown, FileText, Shield, AlertTriangle, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import EstateDetailDialog from "./EstateDetailDialog";

const EstateCard = () => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  return (
    <>
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-50 to-transparent rounded-full -translate-y-16 translate-x-16" />
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl flex items-center space-x-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Crown className="h-6 w-6 text-amber-600" />
            </div>
            <span>Estate</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 hover:bg-amber-50"
            onClick={() => setShowDetailDialog(true)}
          >
            <Eye className="w-4 h-4" />
            Details
          </Button>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Estate Value */}
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-lg font-semibold text-amber-900">Total Estate Value</p>
                <p className="text-sm text-amber-700">Current Net Worth</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xl font-bold text-amber-600">$785K</p>
                <div className="flex items-center text-sm text-green-600">
                  <Crown className="h-4 w-4 mr-1" />
                  <span>Growing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Will Status */}
          <div className="p-5 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-lg font-semibold text-green-900">Will & Testament</p>
                <p className="text-sm text-green-700">Last Updated</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xl font-bold text-green-600">Current</p>
                <div className="flex items-center text-sm text-green-600">
                  <FileText className="h-4 w-4 mr-1" />
                  <span>Mar 2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tax Planning */}
          <div className="p-5 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-lg font-semibold text-red-900">Estate Tax Liability</p>
                <p className="text-sm text-red-700">Estimated Taxes</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xl font-bold text-red-600">$25K</p>
                <div className="flex items-center text-sm text-orange-600">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span>Needs review</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EstateDetailDialog 
        isOpen={showDetailDialog} 
        onClose={() => setShowDetailDialog(false)} 
      />
    </>
  );
};

export default EstateCard;
