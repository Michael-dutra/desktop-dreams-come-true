
import DashboardHeader from "@/components/DashboardHeader";
import ClientInfo from "@/components/ClientInfo";
import NetWorthCard from "@/components/NetWorthCard";
import AssetsBreakdown from "@/components/AssetsBreakdown";
import LiabilitiesBreakdown from "@/components/LiabilitiesBreakdown";
import MonthlyCashFlow from "@/components/MonthlyCashFlow";
import InsuranceCard from "@/components/InsuranceCard";
import RetirementCard from "@/components/RetirementCard";
import GoalsSection from "@/components/GoalsSection";
import ActionItems from "@/components/ActionItems";
import RecentGuidance from "@/components/RecentGuidance";
import FinancialVault from "@/components/FinancialVault";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="p-6">
        <div className="space-y-6">
          {/* Client Information Header */}
          <ClientInfo />
          
          {/* First Row - Net Worth, Assets, Liabilities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NetWorthCard />
            <AssetsBreakdown />
            <LiabilitiesBreakdown />
          </div>
          
          {/* Second Row - Cash Flow, Insurance, Retirement */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MonthlyCashFlow />
            <InsuranceCard />
            <RetirementCard />
          </div>
          
          {/* Third Row - Goals and Action Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GoalsSection />
            <ActionItems />
          </div>
          
          {/* Bottom Row - Recent Guidance and Financial Vault */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentGuidance />
            <FinancialVault />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
