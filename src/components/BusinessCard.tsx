
import { Briefcase, TrendingUp, DollarSign, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BusinessCard = () => {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-full -translate-y-16 translate-x-16" />
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Briefcase className="h-6 w-6 text-blue-600" />
          </div>
          <span>Business</span>
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2 hover:bg-blue-50"
        >
          View Details
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Business Valuation */}
        <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-lg font-semibold text-blue-900">Business Valuation</p>
              <p className="text-sm text-blue-700">Current Market Value</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-xl font-bold text-blue-600">$450K</p>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+12% YoY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Annual Revenue */}
        <div className="p-5 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-lg font-semibold text-green-900">Annual Revenue</p>
              <p className="text-sm text-green-700">Gross Business Income</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-xl font-bold text-green-600">$185K</p>
              <div className="flex items-center text-sm text-green-600">
                <DollarSign className="h-4 w-4 mr-1" />
                <span>+8% vs target</span>
              </div>
            </div>
          </div>
        </div>

        {/* Business Structure */}
        <div className="p-5 bg-purple-50 border border-purple-200 rounded-xl">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-lg font-semibold text-purple-900">Business Structure</p>
              <p className="text-sm text-purple-700">Incorporated</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-xl font-bold text-purple-600">Corp</p>
              <div className="flex items-center text-sm text-blue-600">
                <Building2 className="h-4 w-4 mr-1" />
                <span>Tax optimized</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessCard;
