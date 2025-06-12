import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, Plus, Edit, Eye } from "lucide-react";
import { AddGoalDialog } from "./AddGoalDialog";
import { EditGoalDialog } from "./EditGoalDialog";
import { ViewGoalDialog } from "./ViewGoalDialog";

const GoalsSection = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const [goals, setGoals] = useState([
    {
      id: "1",
      title: "Save for a Down Payment",
      description: "Accumulate funds for a down payment on a new home.",
      progress: 35,
    },
    {
      id: "2",
      title: "Pay off Credit Card Debt",
      description: "Eliminate outstanding credit card balances.",
      progress: 70,
    },
    {
      id: "3",
      title: "Invest in Retirement",
      description: "Contribute regularly to a retirement savings account.",
      progress: 50,
    },
  ]);

  const handleAddGoal = (newGoal: any) => {
    setGoals(prevGoals => [...prevGoals, { ...newGoal, id: String(Date.now()) }]);
  };

  const handleEditGoal = (goal: any) => {
    setSelectedGoal(goal);
    setIsEditDialogOpen(true);
  };

  const handleUpdateGoal = (updatedGoal: any) => {
    setGoals(prevGoals =>
      prevGoals.map(goal => (goal.id === updatedGoal.id ? updatedGoal : goal))
    );
    setIsEditDialogOpen(false);
  };

  const handleViewGoal = (goal: any) => {
    setSelectedGoal(goal);
    setIsViewDialogOpen(true);
  };

  const getProgressColor = (progress: number) => {
    // Create a gradient from red (0%) to green (100%)
    const red = Math.max(0, 255 - (progress * 2.55));
    const green = Math.min(255, progress * 2.55);
    return `rgb(${red}, ${green}, 0)`;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Goals
            </CardTitle>
            <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{goal.title}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewGoal(goal)}
                        className="h-6 w-6 p-0"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditGoal(goal)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Progress 
                    value={goal.progress} 
                    className="h-2"
                  />
                  <div 
                    className="absolute top-0 left-0 h-2 rounded-full transition-all"
                    style={{
                      width: `${goal.progress}%`,
                      backgroundColor: getProgressColor(goal.progress)
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{goal.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AddGoalDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddGoal}
      />

      <EditGoalDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        goal={selectedGoal}
        onUpdate={handleUpdateGoal}
      />

      <ViewGoalDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        goal={selectedGoal}
      />
    </>
  );
};

export default GoalsSection;
