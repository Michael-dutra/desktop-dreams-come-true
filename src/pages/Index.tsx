
import DashboardHeader from "@/components/DashboardHeader";
import ClientInfo from "@/components/ClientInfo";
import NetWorthCard from "@/components/NetWorthCard";
import AssetsBreakdown from "@/components/AssetsBreakdown";
import LiabilitiesBreakdown from "@/components/LiabilitiesBreakdown";
import MonthlyCashFlow from "@/components/MonthlyCashFlow";
import InsuranceCard from "@/components/InsuranceCard";
import RetirementCard from "@/components/RetirementCard";
import BusinessCard from "@/components/BusinessCard";
import EstateCard from "@/components/EstateCard";
import GoalsSection from "@/components/GoalsSection";
import ActionItems from "@/components/ActionItems";
import RecentGuidance from "@/components/RecentGuidance";
import FinancialVault from "@/components/FinancialVault";
import ReportsSection from "@/components/ReportsSection";
import FloatingChatBar from "@/components/FloatingChatBar";
import { LifeInsuranceCalculator } from "@/components/LifeInsuranceCalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="p-6">
        <div className="space-y-6">
          {/* Client Information Header */}
          <ClientInfo />
          
          {/* Life Insurance Calculator */}
          <LifeInsuranceCalculator />
          
          {/* First Row - Net Worth, Assets, and Liabilities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NetWorthCard />
            <AssetsBreakdown />
            <LiabilitiesBreakdown />
          </div>
          
          {/* Second Row - Cash Flow, Insurance, and Retirement */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MonthlyCashFlow />
            <InsuranceCard />
            <RetirementCard />
          </div>

          {/* Third Row - Business and Estate Planning */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BusinessCard />
            <EstateCard />
          </div>
          
          {/* Fourth Row - Recent AI Guidance (wide) */}
          <RecentGuidance />
          
          {/* Fifth Row - Goals and Action Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GoalsSection />
            <ActionItems />
          </div>
          
          {/* Sixth Row - Reports and Financial Vault */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportsSection />
            <FinancialVault />
          </div>
        </div>
      </main>
      
      <FloatingChatBar />
    </div>
  );
};

export default Index;
