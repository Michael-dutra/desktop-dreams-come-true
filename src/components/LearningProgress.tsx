
import { BookOpen, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const LearningProgress = () => {
  return (
    <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white border-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <CardTitle className="text-lg">Learning Progress</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-90">Lessons Completed</span>
          <span className="font-semibold">14/24</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="opacity-90">Progress</span>
            <span>58%</span>
          </div>
          <Progress value={58} className="h-2 bg-white/20" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <Target className="h-4 w-4" />
              <span className="text-xs opacity-90">Daily Goal</span>
            </div>
            <p className="text-sm font-medium">80%</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs opacity-90">This month</span>
            </div>
            <p className="text-sm font-medium">4 hrs</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-3 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">6-day streak</p>
              <p className="text-xs opacity-75">Keep it up!</p>
            </div>
            <div className="text-2xl">🔥</div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Most Engaged Topic</p>
          <p className="text-lg font-bold">Investing Basics</p>
          <p className="text-xs opacity-75">16 hours spent</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningProgress;
