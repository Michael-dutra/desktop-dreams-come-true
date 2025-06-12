
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditGoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  goal: any;
  onUpdate: (goal: any) => void;
}

export const EditGoalDialog = ({ isOpen, onClose, goal, onUpdate }: EditGoalDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (goal) {
      setTitle(goal.title || "");
      setDescription(goal.description || "");
      setProgress(goal.progress || 0);
      setStatus(goal.status || "");
    }
  }, [goal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const updatedGoal = {
      ...goal,
      title,
      description,
      progress,
      status
    };

    onUpdate(updatedGoal);
    onClose();
  };

  if (!goal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
          <DialogDescription>
            Update your financial goal details and progress.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Build emergency fund"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your goal and how you plan to achieve it..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="progress">Progress: {progress}%</Label>
            <Slider
              value={[progress]}
              onValueChange={(value) => setProgress(value[0])}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus} required>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planning Phase">Planning Phase</SelectItem>
                <SelectItem value="Research Phase">Research Phase</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Almost Complete">Almost Complete</SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Goal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
