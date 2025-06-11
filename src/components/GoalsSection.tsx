
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const GoalsSection = () => {
  const goals = [
    {
      title: "RRSP vs TFSA: What's better for 2025?",
      description: "Tax planning strategies for the upcoming year",
    },
    {
      title: "How to reduce your taxable income this year",
      description: "Deduction opportunities and tax-efficient investing",
    },
    {
      title: "Debt avalanche vs snowball: Which fits your personality?",
      description: "Personalized debt repayment strategies",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Goals</span>
        </CardTitle>
        <Button size="sm" className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Goal</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-medium text-sm">{goal.title}</h4>
              <p className="text-xs text-muted-foreground">{goal.description}</p>
              {index < goals.length - 1 && <div className="border-b"></div>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalsSection;
