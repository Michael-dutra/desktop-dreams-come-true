
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Calendar, Upload, Calculator, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddActionItemDialog } from "./AddActionItemDialog";
import { ViewActionItemDialog } from "./ViewActionItemDialog";
import { useState } from "react";

const ActionItems = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewingAction, setViewingAction] = useState<any>(null);
  const [actions, setActions] = useState([
    {
      id: 1,
      icon: <CheckSquare className="h-4 w-4" />,
      title: "Revisit RRSP planning",
      subtitle: "Due before July",
      color: "text-orange-600",
      description: "Review your RRSP contributions for 2024 and plan optimal strategy for 2025. Consider income projections and tax implications.",
      dueDate: "2025-07-01",
      priority: "High"
    },
    {
      id: 2,
      icon: <Upload className="h-4 w-4" />,
      title: "Upload 2024 tax return",
      subtitle: "Add to Financial Vault",
      color: "text-blue-600",
      description: "Upload your completed 2024 tax return documents to your secure Financial Vault for record keeping.",
      dueDate: "2025-04-30",
      priority: "Medium"
    },
    {
      id: 3,
      icon: <Calculator className="h-4 w-4" />,
      title: "Run debt strategy calculator",
      subtitle: "Optimize repayment plan",
      color: "text-purple-600",
      description: "Use our debt calculator to determine the most efficient repayment strategy for your current debts.",
      dueDate: "2025-01-15",
      priority: "High"
    },
    {
      id: 4,
      icon: <User className="h-4 w-4" />,
      title: "Book AI Financial Check-In",
      subtitle: "Monthly review session",
      color: "text-green-600",
      description: "Schedule your monthly AI-powered financial health check-in to review progress and adjust strategies.",
      dueDate: "2025-01-31",
      priority: "Low"
    },
  ]);

  const handleAddActionItem = (newActionItem: any) => {
    const actionWithId = { ...newActionItem, id: Date.now() };
    setActions(prev => [...prev, actionWithId]);
  };

  const handleViewAction = (action: any) => {
    setViewingAction(action);
    setShowViewDialog(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Action Items</span>
          </CardTitle>
          <Button 
            size="sm" 
            className="flex items-center space-x-2"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {actions.map((action) => (
              <div key={action.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`${action.color}`}>
                    {action.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.subtitle}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleViewAction(action)}
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AddActionItemDialog 
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAdd={handleAddActionItem}
      />

      <ViewActionItemDialog 
        isOpen={showViewDialog}
        onClose={() => setShowViewDialog(false)}
        action={viewingAction}
      />
    </>
  );
};

export default ActionItems;
