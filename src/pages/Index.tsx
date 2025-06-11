
import DashboardHeader from "@/components/DashboardHeader";
import LearningProgress from "@/components/LearningProgress";
import NetWorthCard from "@/components/NetWorthCard";
import AssetsBreakdown from "@/components/AssetsBreakdown";
import LiabilitiesBreakdown from "@/components/LiabilitiesBreakdown";
import MonthlyCashFlow from "@/components/MonthlyCashFlow";
import GoalsSection from "@/components/GoalsSection";
import ActionItems from "@/components/ActionItems";
import InquiryBreakdownChart from "@/components/InquiryBreakdownChart";
import InquiriesPerMonthChart from "@/components/InquiriesPerMonthChart";
import SourceBreakdownChart from "@/components/SourceBreakdownChart";
import IncomeSourceChart from "@/components/IncomeSourceChart";
import StatCards from "@/components/StatCards";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Charts */}
          <div className="col-span-2 space-y-6">
            <StatCards />
            <InquiryBreakdownChart />
          </div>
          
          {/* Learning Progress - Takes up 1 column */}
          <div className="col-span-2">
            <LearningProgress />
          </div>
          
          {/* Main Financial Overview - Takes up 6 columns */}
          <div className="col-span-6 space-y-6">
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
          
          {/* Right Column - More Charts */}
          <div className="col-span-2 space-y-6">
            <InquiriesPerMonthChart />
            <SourceBreakdownChart />
            <IncomeSourceChart />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
