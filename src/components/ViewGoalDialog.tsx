import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Calendar } from "lucide-react";

interface ViewGoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  goal: any;
}

export const ViewGoalDialog = ({ isOpen, onClose, goal }: ViewGoalDialogProps) => {
  if (!goal) return null;

  const getProgressColor = (progress: number) => {
    // Create a gradient from bright blue (0%) to bright green (100%)
    const normalizedProgress = progress / 100;
    const blue = Math.round(255 * (1 - normalizedProgress));
    const green = Math.round(255 * normalizedProgress);
    // Keep red component low for blue-to-green transition
    const red = Math.round(50 * (1 - normalizedProgress));
    return `rgb(${red}, ${green}, ${blue})`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="text-blue-600">
              <Target className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg">{goal.title}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Financial Goal Details
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Progress:</span>
              <span className="text-sm text-muted-foreground">
                {goal.progress}%
              </span>
            </div>
            <div 
              className="w-16 h-3 rounded-full"
              style={{
                backgroundColor: getProgressColor(goal.progress)
              }}
            />
          </div>
          
          {goal.status && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant="outline">
                {goal.status}
              </Badge>
            </div>
          )}
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {goal.description}
            </p>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button>
              Edit Goal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
