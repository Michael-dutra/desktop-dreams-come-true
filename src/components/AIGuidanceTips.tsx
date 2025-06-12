
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Lightbulb } from "lucide-react";

export const AIGuidanceTips = () => {
  const tips = [
    "Consider maxing out your TFSA first for tax-free growth",
    "Real estate appreciation rates vary by location and market conditions",
    "Diversify your portfolio across different asset classes",
    "Regular contributions compound over time for significant growth",
    "Review and adjust your projections annually"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Brain className="w-6 h-6 text-blue-600" />
          AI Guidance Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">{tip}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
