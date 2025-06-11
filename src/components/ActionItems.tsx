
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Calendar, Upload, Calculator, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const ActionItems = () => {
  const actions = [
    {
      icon: <CheckSquare className="h-4 w-4" />,
      title: "Revisit RRSP planning",
      subtitle: "Due before July",
      color: "text-orange-600",
    },
    {
      icon: <Upload className="h-4 w-4" />,
      title: "Upload 2024 tax return",
      subtitle: "Add to Financial Vault",
      color: "text-blue-600",
    },
    {
      icon: <Calculator className="h-4 w-4" />,
      title: "Run debt strategy calculator",
      subtitle: "Optimize repayment plan",
      color: "text-purple-600",
    },
    {
      icon: <User className="h-4 w-4" />,
      title: "Book AI Financial Check-In",
      subtitle: "Monthly review session",
      color: "text-green-600",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Action Items</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`${action.color}`}>
                  {action.icon}
                </div>
                <div>
                  <p className="text-sm font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.subtitle}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionItems;
