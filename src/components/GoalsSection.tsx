
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const GoalsSection = () => {
  const goals = [
    {
      title: "RRSP vs TFSA: What's better for 2025?",
      description: "Tax planning strategies for the upcoming year",
      progress: 75,
      status: "In Progress"
    },
    {
      title: "How to reduce your taxable income this year",
      description: "Deduction opportunities and tax-efficient investing",
      progress: 40,
      status: "Research Phase"
    },
    {
      title: "Debt avalanche vs snowball: Which fits your personality?",
      description: "Personalized debt repayment strategies",
      progress: 90,
      status: "Almost Complete"
    },
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

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
        <div className="space-y-6">
          {goals.map((goal, index) => (
            <div key={index} className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{goal.title}</h4>
                  <span className="text-xs text-muted-foreground font-medium">
                    {goal.progress}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{goal.description}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <span className="text-xs font-medium text-foreground">
                    {goal.status}
                  </span>
                </div>
                <Progress 
                  value={goal.progress} 
                  className="h-2"
                />
              </div>
              
              {index < goals.length - 1 && <div className="border-b"></div>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalsSection;
