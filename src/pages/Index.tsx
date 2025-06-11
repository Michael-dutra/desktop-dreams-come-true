
import DashboardHeader from "@/components/DashboardHeader";
import WelcomeHeader from "@/components/WelcomeHeader";
import LearningProgress from "@/components/LearningProgress";
import NetWorthCard from "@/components/NetWorthCard";
import AssetsBreakdown from "@/components/AssetsBreakdown";
import LiabilitiesBreakdown from "@/components/LiabilitiesBreakdown";
import MonthlyCashFlow from "@/components/MonthlyCashFlow";
import InsuranceCard from "@/components/InsuranceCard";
import RetirementCard from "@/components/RetirementCard";
import GoalsSection from "@/components/GoalsSection";
import ActionItems from "@/components/ActionItems";
import InquiryBreakdownChart from "@/components/InquiryBreakdownChart";
import InquiriesPerMonthChart from "@/components/InquiriesPerMonthChart";
import SourceBreakdownChart from "@/components/SourceBreakdownChart";
import IncomeSourceChart from "@/components/IncomeSourceChart";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="p-6">
        <div className="space-y-6">
          {/* Welcome Message */}
          <WelcomeHeader />
          
          {/* Learning Progress - Full Width */}
          <LearningProgress />
          
          {/* Second Row - Net Worth, Assets, Liabilities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NetWorthCard />
            <AssetsBreakdown />
            <LiabilitiesBreakdown />
          </div>
          
          {/* Third Row - Cash Flow, Insurance, Retirement */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MonthlyCashFlow />
            <InsuranceCard />
            <RetirementCard />
          </div>
          
          {/* Fourth Row - Goals with Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GoalsSection />
            <InquiryBreakdownChart />
            <InquiriesPerMonthChart />
            <SourceBreakdownChart />
          </div>
          
          {/* Fifth Row - Action Items */}
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
