
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecommendationsCardProps {
  lifeGap: number;
  criticalGap: number;
  disabilityGap: number;
  disabilityReplacementRate: number;
}

export const RecommendationsCard = ({ 
  lifeGap, 
  criticalGap, 
  disabilityGap, 
  disabilityReplacementRate 
}: RecommendationsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Insurance Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {lifeGap > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="font-medium text-red-800">Life Insurance Priority</p>
              <p className="text-sm text-red-600">
                Increase life insurance coverage by ${(lifeGap / 1000).toFixed(0)}K to meet calculated needs based on your financial profile.
              </p>
            </div>
          )}

          {criticalGap > 0 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="font-medium text-orange-800">Critical Illness Gap</p>
              <p className="text-sm text-orange-600">
                Add ${(criticalGap / 1000).toFixed(0)}K in critical illness coverage based on income multiple analysis.
              </p>
            </div>
          )}

          {disabilityGap > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="font-medium text-yellow-800">Disability Income</p>
              <p className="text-sm text-yellow-600">
                Increase disability insurance by ${(disabilityGap / 1000).toFixed(1)}K/month to maintain {(disabilityReplacementRate * 100).toFixed(0)}% income replacement.
              </p>
            </div>
          )}

          {lifeGap === 0 && criticalGap === 0 && disabilityGap === 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="font-medium text-green-800">Excellent Coverage</p>
              <p className="text-sm text-green-600">
                All your insurance coverage levels meet or exceed the calculated needs based on your comprehensive financial analysis!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
