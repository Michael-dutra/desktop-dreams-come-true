
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LCGEQualificationCheck = () => {
  const [totalAssets, setTotalAssets] = useState(4000000);
  const [activeBusinessAssets, setActiveBusinessAssets] = useState(3600000);

  const lcgeRatio = totalAssets > 0 ? (activeBusinessAssets / totalAssets) * 100 : 0;
  const qualifiesForLCGE = lcgeRatio >= 90;
  const purificationNeeded = lcgeRatio < 90;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">LCGE Qualification Check</CardTitle>
          <p className="text-sm text-muted-foreground">
            Determine if the corporation qualifies for the Lifetime Capital Gains Exemption (LCGE)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="totalAssets">Total Assets (FMV)</Label>
              <Input
                id="totalAssets"
                type="number"
                value={totalAssets}
                onChange={(e) => setTotalAssets(parseFloat(e.target.value) || 0)}
                className="text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activeBusinessAssets">Active Business Assets (FMV)</Label>
              <Input
                id="activeBusinessAssets"
                type="number"
                value={activeBusinessAssets}
                onChange={(e) => setActiveBusinessAssets(parseFloat(e.target.value) || 0)}
                className="text-lg"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {lcgeRatio.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">LCGE Ratio</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Active Assets ÷ Total Assets
                </div>
              </div>
              
              <div className="text-center">
                <div className={`text-3xl font-bold ${qualifiesForLCGE ? 'text-green-600' : 'text-red-600'}`}>
                  {qualifiesForLCGE ? '✅' : '❌'}
                </div>
                <div className="text-sm text-muted-foreground">Qualifies for LCGE?</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {qualifiesForLCGE ? 'Meets 90% threshold' : 'Below 90% threshold'}
                </div>
              </div>
              
              <div className="text-center">
                <div className={`text-3xl font-bold ${purificationNeeded ? 'text-orange-600' : 'text-green-600'}`}>
                  {purificationNeeded ? '⚠️' : '✅'}
                </div>
                <div className="text-sm text-muted-foreground">Purification Needed?</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {purificationNeeded ? 'Yes - Below 90%' : 'No - Above 90%'}
                </div>
              </div>
            </div>
          </div>

          {purificationNeeded && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-2">Purification Required</h4>
              <p className="text-sm text-orange-700 mb-2">
                The corporation does not currently qualify for the LCGE as the active business assets represent only {lcgeRatio.toFixed(1)}% of total assets.
              </p>
              <p className="text-sm text-orange-700">
                <strong>Required reduction:</strong> {formatCurrency(totalAssets - (activeBusinessAssets / 0.9))} in non-active assets to reach 90% threshold.
              </p>
            </div>
          )}

          {qualifiesForLCGE && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">LCGE Qualification Met</h4>
              <p className="text-sm text-green-700">
                The corporation qualifies for the Lifetime Capital Gains Exemption with {lcgeRatio.toFixed(1)}% active business assets.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LCGEQualificationCheck;
