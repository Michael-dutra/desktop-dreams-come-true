
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const RecentGuidance = () => {
  const guidanceItems = [
    {
      icon: <TrendingUp className="h-5 w-5" />,
      type: "Investment Opportunity",
      title: "Consider increasing TFSA contributions",
      description: "Based on Michael's income growth and current tax bracket, maximizing TFSA contributions could save $2,400 annually in taxes. Current contribution room: $15,000.",
      priority: "high",
      action: "Schedule Review",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: <AlertTriangle className="h-5 w-5" />,
      type: "Risk Assessment",
      title: "Insurance coverage gap identified",
      description: "Life insurance coverage is 4x annual income. With two dependents, recommend increasing to 8-10x income ($640K-$800K) to ensure family security.",
      priority: "medium",
      action: "Get Quote",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      type: "Tax Optimization",
      title: "Debt consolidation strategy working",
      description: "Current debt avalanche approach has reduced total interest by $1,200 this quarter. On track to save $4,800 annually. Continue current strategy.",
      priority: "low",
      action: "Monitor",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>Recent AI Guidance</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
          {guidanceItems.map((item, index) => (
            <div key={index} className={`p-4 rounded-lg ${item.bgColor} border-l-4 border-l-current ${item.color}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`${item.color} mt-1`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {item.type}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.priority === 'high' ? 'bg-red-100 text-red-700' :
                        item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {item.priority} priority
                      </span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="ml-4">
                  {item.action}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentGuidance;
