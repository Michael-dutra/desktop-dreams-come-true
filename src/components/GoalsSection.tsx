
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AddGoalDialog } from "./AddGoalDialog";
import { EditGoalDialog } from "./EditGoalDialog";
import { useState } from "react";

const GoalsSection = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "RRSP vs TFSA: What's better for 2025?",
      description: "Tax planning strategies for the upcoming year",
      progress: 75,
      status: "In Progress"
    },
    {
      id: 2,
      title: "How to reduce your taxable income this year",
      description: "Deduction opportunities and tax-efficient investing",
      progress: 40,
      status: "Research Phase"
    },
    {
      id: 3,
      title: "Debt avalanche vs snowball: Which fits your personality?",
      description: "Personalized debt repayment strategies",
      progress: 90,
      status: "Almost Complete"
    },
  ]);

  const handleAddGoal = (newGoal: any) => {
    const goalWithId = { ...newGoal, id: Date.now() };
    setGoals(prev => [...prev, goalWithId]);
  };

  const handleEditGoal = (goal: any) => {
    setEditingGoal(goal);
    setShowEditDialog(true);
  };

  const handleUpdateGoal = (updatedGoal: any) => {
    setGoals(prev => prev.map(goal => 
      goal.id === updatedGoal.id ? updatedGoal : goal
    ));
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Goals</span>
          </CardTitle>
          <Button 
            size="sm" 
            className="flex items-center space-x-2"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Add Goal</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {goals.map((goal, index) => (
              <div key={goal.id} className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{goal.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground font-medium">
                        {goal.progress}%
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditGoal(goal)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
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

      <AddGoalDialog 
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAdd={handleAddGoal}
      />

      <EditGoalDialog 
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        goal={editingGoal}
        onUpdate={handleUpdateGoal}
      />
    </>
  );
};

export default GoalsSection;
