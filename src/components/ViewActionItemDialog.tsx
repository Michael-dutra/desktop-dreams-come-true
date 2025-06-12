
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle } from "lucide-react";

interface ViewActionItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  action: any;
}

export const ViewActionItemDialog = ({ isOpen, onClose, action }: ViewActionItemDialogProps) => {
  if (!action) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className={action.color}>
              {action.icon}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg">{action.title}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {action.subtitle}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Due Date:</span>
              <span className="text-sm text-muted-foreground">
                {formatDate(action.dueDate)}
              </span>
            </div>
            <Badge className={getPriorityColor(action.priority)}>
              <AlertCircle className="h-3 w-3 mr-1" />
              {action.priority} Priority
            </Badge>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {action.description}
            </p>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button>
              Mark Complete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
