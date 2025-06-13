
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from "lucide-react";

const LCGEQualificationCheck = () => {
  const [totalAssets, setTotalAssets] = useState<number>(0);
  const [activeBusinessAssets, setActiveBusinessAssets] = useState<number>(0);

  const lcgeRatio = totalAssets > 0 ? (activeBusinessAssets / totalAssets) * 100 : 0;
  const qualifiesForLCGE = lcgeRatio >= 90;
  const purificationNeeded = lcgeRatio < 90 && lcgeRatio > 0;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          LCGE Qualification Check
          {qualifiesForLCGE && lcgeRatio > 0 && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          {purificationNeeded && (
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalAssets">Total Assets (FMV)</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-gray-500">
                $
              </div>
              <Input
                type="number"
                id="totalAssets"
                value={totalAssets || ""}
                onChange={(e) => setTotalAssets(Number(e.target.value) || 0)}
                className="pl-8"
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activeBusinessAssets">Active Business Assets (FMV)</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-gray-500">
                $
              </div>
              <Input
                type="number"
                id="activeBusinessAssets"
                value={activeBusinessAssets || ""}
                onChange={(e) => setActiveBusinessAssets(Number(e.target.value) || 0)}
                className="pl-8"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>LCGE Ratio</Label>
              <div className="text-2xl font-bold text-blue-600">
                {lcgeRatio.toFixed(1)}%
              </div>
            </div>

            <div className="space-y-2">
              <Label>Qualifies for LCGE?</Label>
              <div>
                {lcgeRatio > 0 ? (
                  <Badge 
                    variant={qualifiesForLCGE ? "default" : "destructive"}
                    className={qualifiesForLCGE ? "bg-green-500" : ""}
                  >
                    {qualifiesForLCGE ? "✅ Yes" : "❌ No"}
                  </Badge>
                ) : (
                  <Badge variant="secondary">Pending Input</Badge>
                )}
              </div>
            </div>
          </div>

          {purificationNeeded && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <div className="font-medium text-yellow-800">Purification Needed</div>
                  <div className="text-sm text-yellow-700 mt-1">
                    The active business assets ratio is below 90%. Consider purifying non-active assets 
                    to qualify for the LCGE. Need to increase active business assets by{" "}
                    <span className="font-medium">
                      {formatCurrency(totalAssets * 0.9 - activeBusinessAssets)}
                    </span>{" "}
                    or reduce total assets.
                  </div>
                </div>
              </div>
            </div>
          )}

          {qualifiesForLCGE && lcgeRatio > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium text-green-800">LCGE Qualified</div>
                  <div className="text-sm text-green-700 mt-1">
                    This corporation qualifies for the Lifetime Capital Gains Exemption 
                    with an active business assets ratio of {lcgeRatio.toFixed(1)}%.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LCGEQualificationCheck;
