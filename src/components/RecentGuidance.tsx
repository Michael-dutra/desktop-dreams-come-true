
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Shield, Trash2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

const RecentGuidance = () => {
  const [guidanceItems, setGuidanceItems] = useState([
    {
      id: 1,
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
      id: 2,
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
      id: 3,
      icon: <CheckCircle className="h-5 w-5" />,
      type: "Tax Optimization",
      title: "Debt consolidation strategy working",
      description: "Current debt avalanche approach has reduced total interest by $1,200 this quarter. On track to save $4,800 annually. Continue current strategy.",
      priority: "low",
      action: "Monitor",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: 4,
      icon: <DollarSign className="h-5 w-5" />,
      type: "Cash Flow Optimization",
      title: "Emergency fund fully funded",
      description: "You've successfully built a 6-month emergency fund totaling $18,000. Consider redirecting monthly emergency contributions to investment accounts for growth.",
      priority: "medium",
      action: "Rebalance",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      id: 5,
      icon: <Shield className="h-5 w-5" />,
      type: "Retirement Planning",
      title: "RRSP contribution deadline approaching",
      description: "Maximize your 2024 RRSP contribution by March 1st. Contributing $5,500 more could reduce taxable income and save $1,650 in taxes this year.",
      priority: "high",
      action: "Contribute",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    }
  ]);

  const [savedItems, setSavedItems] = useState([]);

  const handleDelete = (id: number) => {
    setGuidanceItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSave = (item: any) => {
    setSavedItems(prev => [...prev, { ...item, savedAt: new Date().toISOString() }]);
    setGuidanceItems(prev => prev.filter(i => i.id !== item.id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent AI Guidance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Recent AI Guidance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {guidanceItems.map((item) => (
              <div key={item.id} className={`p-4 rounded-lg ${item.bgColor} border-l-4 border-l-current ${item.color}`}>
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
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      {item.action}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSave(item)}
                      className="flex items-center space-x-1"
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to delete this guidance?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the AI guidance item.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(item.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Saved AI Guidance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Bookmark className="h-5 w-5" />
            <span>Saved AI Guidance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {savedItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bookmark className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No saved guidance items yet</p>
                <p className="text-sm">Save items from Recent AI Guidance to access them later</p>
              </div>
            ) : (
              savedItems.map((item, index) => (
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
                        <p className="text-xs text-muted-foreground mt-2">
                          Saved on {new Date(item.savedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {item.action}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentGuidance;
