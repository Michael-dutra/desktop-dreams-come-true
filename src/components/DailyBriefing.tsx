
import { Calendar, Lightbulb, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DailyBriefing = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Daily Briefing</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Lightbulb className="h-4 w-4 mt-1 text-yellow-500" />
            <div>
              <p className="text-sm font-medium text-foreground">Lesson of the Day</p>
              <p className="text-xs text-muted-foreground">Understanding Compound Interest</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Lightbulb className="h-4 w-4 mt-1 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-foreground">Personal Tip</p>
              <p className="text-xs text-muted-foreground">Set aside 20% of your income for savings this month</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Bell className="h-4 w-4 mt-1 text-orange-500" />
            <div>
              <p className="text-sm font-medium text-foreground">Reminder</p>
              <p className="text-xs text-muted-foreground">Review your investment portfolio this weekend</p>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Today's Focus</p>
            <p className="text-sm font-medium text-foreground">Emergency Fund Planning</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyBriefing;
