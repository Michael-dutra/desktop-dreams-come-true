
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
        <div className="space-y-6">
          {/* Top Row - 4 sections across */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCards />
            <LearningProgress />
            <NetWorthCard />
            <InquiryBreakdownChart />
          </div>
          
          {/* Second Row - 3 sections across */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AssetsBreakdown />
            <LiabilitiesBreakdown />
            <MonthlyCashFlow />
          </div>
          
          {/* Third Row - 3 sections across */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GoalsSection />
            <InquiriesPerMonthChart />
            <SourceBreakdownChart />
          </div>
          
          {/* Bottom Row - 2 sections across */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActionItems />
            <IncomeSourceChart />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
