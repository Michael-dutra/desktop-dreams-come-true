
import DashboardHeader from "@/components/DashboardHeader";
import LearningProgress from "@/components/LearningProgress";
import NetWorthCard from "@/components/NetWorthCard";
import AssetsBreakdown from "@/components/AssetsBreakdown";
import LiabilitiesBreakdown from "@/components/LiabilitiesBreakdown";
import MonthlyCashFlow from "@/components/MonthlyCashFlow";
import GoalsSection from "@/components/GoalsSection";
import ActionItems from "@/components/ActionItems";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Learning Progress - Takes up 1 column */}
          <div className="lg:col-span-1">
            <LearningProgress />
          </div>
          
          {/* Main Financial Overview - Takes up 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <NetWorthCard />
              <AssetsBreakdown />
              <LiabilitiesBreakdown />
            </div>
            
            {/* Middle Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MonthlyCashFlow />
              <GoalsSection />
            </div>
            
            {/* Bottom Row */}
            <ActionItems />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
