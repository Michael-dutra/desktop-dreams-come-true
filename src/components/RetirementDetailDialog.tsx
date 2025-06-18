import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PiggyBank, Plus, Minus, Calculator, Info, Check, X } from "lucide-react";
import { useAssets } from "@/contexts/AssetsContext";

interface RetirementDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface YearlyData {
  age: number;
  year: number;
  rrspBalance: number;
  rrspWithdrawal: number;
  tfsaBalance: number;
  tfsaWithdrawal: number;
  nonRegBalance: number;
  nonRegWithdrawal: number;
  totalAssets: number;
  totalWithdrawal: number;
  taxesPaid: number;
  cppIncome: number;
  oasIncome: number;
  totalGovernmentBenefits: number;
  netWithdrawalNeeded: number;
}

type WithdrawalStrategy = "balanced" | "tax-free-first" | "rrsp-first" | "minimize-lifetime-tax" | "preserve-rrsp" | "custom";

export const RetirementDetailDialog = ({ isOpen, onClose }: RetirementDetailDialogProps) => {
  const { assets } = useAssets();
  
  const rrspAsset = assets.find(asset => asset.name === "RRSP");
  const tfsaAsset = assets.find(asset => asset.name === "TFSA");
  const nonRegAsset = assets.find(asset => asset.name === "Non-Registered");
  
  const currentRRSP = rrspAsset?.value || 52000;
  const currentTFSA = tfsaAsset?.value || 38000;
  const currentNonReg = nonRegAsset?.value || 25000;
  
  const [retirementAge, setRetirementAge] = useState([65]);
  const [monthlyIncomeNeeded, setMonthlyIncomeNeeded] = useState([4500]);
  const [retirementRateOfReturn, setRetirementRateOfReturn] = useState([5]);
  const [rrspAllocation, setRrspAllocation] = useState([60]);
  const [tfsaAllocation, setTfsaAllocation] = useState([30]);
  const [nonRegAllocation, setNonRegAllocation] = useState([10]);

  const [taxRate, setTaxRate] = useState([25]);
  const [withdrawalStrategy, setWithdrawalStrategy] = useState<WithdrawalStrategy>("balanced");

  const [cppStartAge, setCppStartAge] = useState(65);
  const [oasStartAge, setOasStartAge] = useState(65);
  const [cppEligibilityPercent, setCppEligibilityPercent] = useState(85);
  const [oasEligibilityPercent, setOasEligibilityPercent] = useState(100);

  const currentAge = 25;
  const yearsToRetirement = retirementAge[0] - currentAge;
  const monthlyContribution = 500;
  const preRetirementRateOfReturn = 0.05;
  const lifeExpectancy = 95;
  const yearsInRetirement = lifeExpectancy - retirementAge[0];

  const formatMonthlyIncomeK = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return `$${value}`;
  };

  const getOptimalAllocations = (strategy: WithdrawalStrategy) => {
    switch (strategy) {
      case "tax-free-first":
        return { rrsp: 0, tfsa: 100, nonReg: 0 };
      case "rrsp-first":
        return { rrsp: 100, tfsa: 0, nonReg: 0 };
      case "minimize-lifetime-tax":
        return { rrsp: 35, tfsa: 45, nonReg: 20 };
      case "preserve-rrsp":
        return { rrsp: 0, tfsa: 50, nonReg: 50 };
      case "custom":
        return { rrsp: rrspAllocation[0], tfsa: tfsaAllocation[0], nonReg: nonRegAllocation[0] };
      case "balanced":
      default:
        return { rrsp: 34, tfsa: 33, nonReg: 33 };
    }
  };

  useEffect(() => {
    if (withdrawalStrategy !== "custom") {
      const optimal = getOptimalAllocations(withdrawalStrategy);
      setRrspAllocation([optimal.rrsp]);
      setTfsaAllocation([optimal.tfsa]);
      setNonRegAllocation([optimal.nonReg]);
    }
  }, [withdrawalStrategy]);

  const calculateFutureValue = (currentValue: number, allocation: number) => {
    let futureValue = currentValue;
    const monthlyContributionToAccount = (monthlyContribution * 12) * (allocation / 100);
    
    for (let i = 0; i < yearsToRetirement; i++) {
      futureValue = futureValue * (1 + preRetirementRateOfReturn) + monthlyContributionToAccount;
    }
    return futureValue;
  };

  const futureRRSP = calculateFutureValue(currentRRSP, 33.33);
  const futureTFSA = calculateFutureValue(currentTFSA, 33.33);
  const futureNonReg = calculateFutureValue(currentNonReg, 33.34);
  const totalFutureSavings = futureRRSP + futureTFSA + futureNonReg;

  const annualIncomeNeeded = monthlyIncomeNeeded[0] * 12;
  
  const calculateGrossWithdrawals = (netIncomeNeeded: number) => {
    const rrspPercent = rrspAllocation[0] / 100;
    const tfsaPercent = tfsaAllocation[0] / 100;
    const nonRegPercent = nonRegAllocation[0] / 100;
    
    const tfsaGross = netIncomeNeeded * tfsaPercent;
    const rrspNet = netIncomeNeeded * rrspPercent;
    const rrspGross = rrspNet / (1 - (taxRate[0] / 100));
    const nonRegNet = netIncomeNeeded * nonRegPercent;
    const nonRegGross = nonRegNet / (1 - (taxRate[0] / 100 * 0.5));
    
    return {
      rrspGross,
      tfsaGross,
      nonRegGross,
      totalGross: rrspGross + tfsaGross + nonRegGross
    };
  };

  const grossWithdrawals = calculateGrossWithdrawals(annualIncomeNeeded);
  const totalRetirementNeeded = grossWithdrawals.totalGross * yearsInRetirement;
  
  const rrspDuration = grossWithdrawals.rrspGross > 0 ? futureRRSP / grossWithdrawals.rrspGross : Infinity;
  const tfsaDuration = grossWithdrawals.tfsaGross > 0 ? futureTFSA / grossWithdrawals.tfsaGross : Infinity;
  const nonRegDuration = grossWithdrawals.nonRegGross > 0 ? futureNonReg / grossWithdrawals.nonRegGross : Infinity;

  const fundingPercentage = Math.min(100, (totalFutureSavings / totalRetirementNeeded) * 100);
  const fundingStatus = fundingPercentage >= 100 ? "Fully Funded" : "Underfunded";

  const calculateTaxes = (rrspWithdrawal: number, nonRegWithdrawal: number) => {
    const rrspTax = rrspWithdrawal * (taxRate[0] / 100);
    const nonRegTaxable = nonRegWithdrawal * 0.5;
    const nonRegTax = nonRegTaxable * (taxRate[0] / 100);
    return rrspTax + nonRegTax;
  };

  const calculateCPP = (startAge: number, eligibilityPercent: number) => {
    const maxCPP = 1308;
    const baseAmount = maxCPP * (eligibilityPercent / 100);
    
    if (startAge < 65) {
      const monthsEarly = (65 - startAge) * 12;
      const penalty = monthsEarly * 0.006;
      return baseAmount * (1 - penalty);
    } else if (startAge > 65) {
      const monthsLate = Math.min((startAge - 65) * 12, 60);
      const bonus = monthsLate * 0.007;
      return baseAmount * (1 + bonus);
    }
    return baseAmount;
  };

  const calculateOAS = (startAge: number, eligibilityPercent: number) => {
    const maxOAS = 707;
    const baseAmount = maxOAS * (eligibilityPercent / 100);
    
    if (startAge < 65) {
      return 0;
    } else if (startAge > 65) {
      const monthsLate = Math.min((startAge - 65) * 12, 60);
      const bonus = monthsLate * 0.006;
      return baseAmount * (1 + bonus);
    }
    return baseAmount;
  };

  const generateYearlyData = (): YearlyData[] => {
    const data: YearlyData[] = [];
    let rrspBalance = futureRRSP;
    let tfsaBalance = futureTFSA;
    let nonRegBalance = futureNonReg;
    const annualRateOfReturn = retirementRateOfReturn[0] / 100;

    const annualCPP = calculateCPP(cppStartAge, cppEligibilityPercent) * 12;
    const annualOAS = calculateOAS(oasStartAge, oasEligibilityPercent) * 12;

    for (let year = 0; year <= 30; year++) {
      const age = retirementAge[0] + year;
      
      if (year > 0) {
        rrspBalance = rrspBalance * (1 + annualRateOfReturn);
        tfsaBalance = tfsaBalance * (1 + annualRateOfReturn);
        nonRegBalance = nonRegBalance * (1 + annualRateOfReturn);
      }
      
      const cppIncome = age >= cppStartAge ? annualCPP : 0;
      const oasIncome = age >= oasStartAge ? annualOAS : 0;
      const totalGovernmentBenefits = cppIncome + oasIncome;
      
      const netWithdrawalNeeded = Math.max(0, annualIncomeNeeded - totalGovernmentBenefits);
      const adjustedGrossWithdrawals = calculateGrossWithdrawals(netWithdrawalNeeded);
      
      let rrspWithdrawal = 0;
      let tfsaWithdrawal = 0;
      let nonRegWithdrawal = 0;

      if (withdrawalStrategy === "tax-free-first") {
        if (tfsaBalance > 0) {
          tfsaWithdrawal = Math.min(tfsaBalance, adjustedGrossWithdrawals.totalGross);
          tfsaBalance -= tfsaWithdrawal;
        } else {
          const remainingNeeded = adjustedGrossWithdrawals.totalGross;
          const halfNeeded = remainingNeeded / 2;
          
          if (rrspBalance > 0) {
            rrspWithdrawal = Math.min(rrspBalance, halfNeeded);
            rrspBalance -= rrspWithdrawal;
          }
          
          if (nonRegBalance > 0) {
            nonRegWithdrawal = Math.min(nonRegBalance, halfNeeded);
            nonRegBalance -= nonRegWithdrawal;
          }
        }
      } else if (withdrawalStrategy === "rrsp-first") {
        if (rrspBalance > 0) {
          rrspWithdrawal = Math.min(rrspBalance, adjustedGrossWithdrawals.totalGross);
          rrspBalance -= rrspWithdrawal;
        } else {
          const remainingNeeded = adjustedGrossWithdrawals.totalGross;
          const halfNeeded = remainingNeeded / 2;
          
          if (tfsaBalance > 0) {
            tfsaWithdrawal = Math.min(tfsaBalance, halfNeeded);
            tfsaBalance -= tfsaWithdrawal;
          }
          
          if (nonRegBalance > 0) {
            nonRegWithdrawal = Math.min(nonRegBalance, halfNeeded);
            nonRegBalance -= nonRegWithdrawal;
          }
        }
      } else {
        if (rrspBalance > 0) {
          rrspWithdrawal = Math.min(rrspBalance, adjustedGrossWithdrawals.rrspGross);
          rrspBalance -= rrspWithdrawal;
        }

        if (tfsaBalance > 0) {
          tfsaWithdrawal = Math.min(tfsaBalance, adjustedGrossWithdrawals.tfsaGross);
          tfsaBalance -= tfsaWithdrawal;
        }

        if (nonRegBalance > 0) {
          nonRegWithdrawal = Math.min(nonRegBalance, adjustedGrossWithdrawals.nonRegGross);
          nonRegBalance -= nonRegWithdrawal;
        }
      }

      const totalWithdrawal = rrspWithdrawal + tfsaWithdrawal + nonRegWithdrawal;
      const totalAssets = rrspBalance + tfsaBalance + nonRegBalance;
      const taxesPaid = calculateTaxes(rrspWithdrawal, nonRegWithdrawal);

      data.push({
        age,
        year,
        rrspBalance,
        rrspWithdrawal,
        tfsaBalance,
        tfsaWithdrawal,
        nonRegBalance,
        nonRegWithdrawal,
        totalAssets,
        totalWithdrawal,
        taxesPaid,
        cppIncome,
        oasIncome,
        totalGovernmentBenefits,
        netWithdrawalNeeded
      });

      if (totalAssets <= 0) break;
    }

    return data;
  };

  const yearlyData = generateYearlyData();
  
  const calculateActualAssetDuration = (): number => {
    if (grossWithdrawals.totalGross === 0) return Infinity;
    
    let lastYearWithAssets = 0;
    for (const year of yearlyData) {
      if (year.totalAssets > 0) {
        lastYearWithAssets = year.year;
      }
    }
    
    const finalYear = yearlyData[lastYearWithAssets];
    if (finalYear && finalYear.totalWithdrawal > 0) {
      const remainingAssets = finalYear.totalAssets;
      const partialYear = remainingAssets / grossWithdrawals.totalGross;
      return lastYearWithAssets + partialYear;
    }
    
    return lastYearWithAssets;
  };

  const actualAssetDuration = calculateActualAssetDuration();
  
  const totalLifetimeTaxes = yearlyData.reduce((total, year) => total + year.taxesPaid, 0);
  const averageAnnualTaxRate = totalLifetimeTaxes / (yearlyData.reduce((total, year) => total + year.totalWithdrawal, 0) || 1) * 100);
  
  const worstCaseStrategy = getOptimalAllocations("balanced");
  const worstCaseTaxes = yearlyData.reduce((total, year) => {
    return total + calculateTaxes(year.rrspWithdrawal * 1.5, year.nonRegWithdrawal * 1.2);
  }, 0);
  const taxEfficiencyScore = Math.max(0, Math.min(100, (1 - totalLifetimeTaxes / worstCaseTaxes) * 100));

  const assetDepletionData = yearlyData.slice(0, 10).map(year => ({
    age: year.age,
    year: `+${year.year}yr`,
    rrsp: year.rrspBalance,
    tfsa: year.tfsaBalance,
    nonReg: year.nonRegBalance,
    totalAssets: year.totalAssets,
    withdrawal: year.totalWithdrawal
  }));

  const areaChartData = yearlyData.map(year => ({
    age: year.age,
    rrsp: year.rrspBalance,
    tfsa: year.tfsaBalance,
    nonReg: year.nonRegBalance,
    totalAssets: year.totalAssets
  }));

  const incomeSourceData = [
    { name: "RRSP", value: rrspAllocation[0], color: "#3b82f6" },
    { name: "TFSA", value: tfsaAllocation[0], color: "#10b981" },
    { name: "Non-Reg", value: nonRegAllocation[0], color: "#f59e0b" }
  ];

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${Math.round(value).toLocaleString()}`;
  };

  const formatCurrencyFull = (value: number) => {
    return `$${Math.round(value).toLocaleString()}`;
  };

  const cppAmount = calculateCPP(cppStartAge, cppEligibilityPercent);
  const oasAmount = calculateOAS(oasStartAge, oasEligibilityPercent);

  const totalAllocation = rrspAllocation[0] + tfsaAllocation[0] + nonRegAllocation[0];

  const getStrategyDescription = (strategy: WithdrawalStrategy) => {
    switch (strategy) {
      case "tax-free-first":
        return "TFSA is used to fully fund retirement income until depleted, then uses a 50/50 split of RRSP and Non-Registered assets.";
      case "rrsp-first":
        return "RRSP is used to fully fund retirement income until depleted, then uses a 50/50 split of TFSA and Non-Registered assets.";
      case "minimize-lifetime-tax":
        return "Optimizes withdrawal order to minimize total lifetime taxes";
      case "preserve-rrsp":
        return "RRSP is preserved and only used as a last resort — or once mandatory withdrawals start at age 71.";
      case "custom":
        return "Use custom allocation percentages set manually with the sliders below.";
      case "balanced":
      default:
        return "Maintains steady withdrawal rates across all accounts";
    }
  };

  const getStrategyProsAndCons = (strategy: WithdrawalStrategy) => {
    switch (strategy) {
      case "balanced":
        return {
          pros: [
            "Keeps your taxes steady over time",
            "Simple and intuitive approach",
            "Draws from all account types evenly"
          ],
          cons: [
            "May not be tax-optimal in all situations",
            "Doesn't preserve TFSA growth potential",
            "May trigger higher taxes in some years"
          ]
        };
      case "tax-free-first":
        return {
          pros: [
            "Zero taxes on withdrawals initially",
            "Preserves taxable accounts longer",
            "Simple to understand and implement"
          ],
          cons: [
            "Depletes tax-free savings quickly",
            "Higher tax burden in later years",
            "No tax diversification benefits"
          ]
        };
      case "rrsp-first":
        return {
          pros: [
            "Takes advantage of potentially lower tax rates early in retirement",
            "Preserves tax-free TFSA growth longer",
            "Avoids mandatory RRSP withdrawals at 71"
          ],
          cons: [
            "Higher tax burden initially",
            "Depletes tax-deferred savings quickly",
            "May push you into higher tax brackets early"
          ]
        };
      case "minimize-lifetime-tax":
        return {
          pros: [
            "Lowest total tax burden over lifetime",
            "Optimizes withdrawal timing strategically",
            "Smart tax bracket management"
          ],
          cons: [
            "More complex planning required",
            "Requires ongoing monitoring and adjustments",
            "May not suit all personal situations"
          ]
        };
      case "preserve-rrsp":
        return {
          pros: [
            "Maximizes tax-deferred growth potential",
            "Delays mandatory withdrawals until 71",
            "Preserves largest retirement account"
          ],
          cons: [
            "Higher tax burden at age 71+",
            "Misses early retirement low-tax years",
            "Limited withdrawal flexibility"
          ]
        };
      case "custom":
        return {
          pros: [
            "Full control over allocation percentages",
            "Tailored to your specific situation",
            "Flexibility to adjust as needed"
          ],
          cons: [
            "Requires manual optimization",
            "May not be tax-optimal without analysis",
            "More complex to manage"
          ]
        };
      default:
        return { pros: [], cons: [] };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5" />
            Retirement Planning Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Retirement Planning Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Retirement Age: {retirementAge[0]}
                  </label>
                  <Slider
                    value={retirementAge}
                    onValueChange={setRetirementAge}
                    min={55}
                    max={75}
                    step={1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Net Monthly Income Needed: ${formatMonthlyIncomeK(monthlyIncomeNeeded[0])}
                  </label>
                  <Slider
                    value={monthlyIncomeNeeded}
                    onValueChange={setMonthlyIncomeNeeded}
                    min={2000}
                    max={8000}
                    step={100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Rate of Return (During Retirement): {retirementRateOfReturn[0]}%
                  </label>
                  <Slider
                    value={retirementRateOfReturn}
                    onValueChange={setRetirementRateOfReturn}
                    min={0}
                    max={15}
                    step={0.5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tax Rate on Withdrawals: {taxRate[0]}%
                  </label>
                  <Slider
                    value={taxRate}
                    onValueChange={setTaxRate}
                    min={15}
                    max={55}
                    step={1}
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Applied to RRSP and 50% of Non-Registered withdrawals
                  </p>
                </div>
              </div>

              {withdrawalStrategy === "custom" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Allocate how your retirement income is sourced from each account (total must be 100%):
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">RRSP</label>
                        <span className="text-sm font-bold">{rrspAllocation[0]}%</span>
                      </div>
                      <Slider
                        value={rrspAllocation}
                        onValueChange={setRrspAllocation}
                        min={0}
                        max={100}
                        step={5}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">TFSA</label>
                        <span className="text-sm font-bold">{tfsaAllocation[0]}%</span>
                      </div>
                      <Slider
                        value={tfsaAllocation}
                        onValueChange={setTfsaAllocation}
                        min={0}
                        max={100}
                        step={5}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">Non-Registered</label>
                        <span className="text-sm font-bold">{nonRegAllocation[0]}%</span>
                      </div>
                      <Slider
                        value={nonRegAllocation}
                        onValueChange={setNonRegAllocation}
                        min={0}
                        max={100}
                        step={5}
                      />
                    </div>
                    {totalAllocation !== 100 && (
                      <div className="text-red-600 text-sm font-medium">
                        Total allocation: {totalAllocation}% (must equal 100%)
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Tax Settings & Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Withdrawal Strategy
                  </label>
                  <Select value={withdrawalStrategy} onValueChange={(value: WithdrawalStrategy) => setWithdrawalStrategy(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="tax-free-first">Tax-Free First</SelectItem>
                      <SelectItem value="rrsp-first">RRSP First</SelectItem>
                      <SelectItem value="minimize-lifetime-tax">Minimize Lifetime Tax</SelectItem>
                      <SelectItem value="preserve-rrsp">Preserve RRSP</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-600 mt-1">
                    {getStrategyDescription(withdrawalStrategy)}
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Net Income Needed (Annual):</span>
                    <span className="font-semibold">{formatCurrency(annualIncomeNeeded)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gross Withdrawal Required:</span>
                    <span className="font-semibold">{formatCurrency(grossWithdrawals.totalGross)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Additional Amount for Taxes:</span>
                    <span className="font-semibold text-red-600">{formatCurrency(grossWithdrawals.totalGross - annualIncomeNeeded)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  {withdrawalStrategy.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Strategy
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Pros
                    </h4>
                    <ul className="space-y-2">
                      {getStrategyProsAndCons(withdrawalStrategy).pros.map((pro, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-800 mb-3 flex items-center gap-2">
                      <X className="h-4 w-4" />
                      Cons
                    </h4>
                    <ul className="space-y-2">
                      {getStrategyProsAndCons(withdrawalStrategy).cons.map((con, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {averageAnnualTaxRate.toFixed(1)}%
                  </div>
                  <p className="text-xs text-gray-600">Avg Tax Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {taxEfficiencyScore.toFixed(0)}%
                  </div>
                  <p className="text-xs text-gray-600">Tax Efficiency</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">
                    {formatCurrency(totalLifetimeTaxes)}
                  </div>
                  <p className="text-xs text-gray-600">Lifetime Taxes</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {formatCurrency(totalLifetimeTaxes / yearsInRetirement)}
                  </div>
                  <p className="text-xs text-gray-600">Annual Taxes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 p-8 rounded-xl border text-white shadow-lg">
              <div className="text-center">
                <h4 className="text-4xl font-bold mb-8 text-purple-100">Retirement</h4>
                <div className="space-y-6">
                  <div className="text-9xl font-bold leading-none">
                    {actualAssetDuration === Infinity ? "∞" : actualAssetDuration.toFixed(1)}
                  </div>
                  <div className="text-4xl font-semibold text-purple-100">Years</div>
                  <div className="text-3xl text-purple-200 mt-8">Assets Will Last</div>
                </div>
                <div className="mt-10 pt-10 border-t border-purple-400">
                  <div className="text-7xl font-bold text-green-300 mb-4">{fundingPercentage.toFixed(0)}%</div>
                  <div className="text-3xl text-purple-200 mb-6">of Retirement Goal</div>
                  <div className="text-xl text-purple-300">
                    <div>Funding Status: {fundingStatus}</div>
                  </div>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Account Funding Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">RRSP</span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{rrspAllocation[0]}%</div>
                      <div className="text-sm text-blue-600">
                        Funds {rrspDuration === Infinity ? "∞" : rrspDuration.toFixed(1)} yrs
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">TFSA</span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{tfsaAllocation[0]}%</div>
                      <div className="text-sm text-green-600">
                        Funds {tfsaDuration === Infinity ? "∞" : tfsaDuration.toFixed(1)} yrs
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Non-Reg</span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-orange-600">{nonRegAllocation[0]}%</div>
                      <div className="text-sm text-orange-600">
                        Funds {nonRegDuration === Infinity ? "∞" : nonRegDuration.toFixed(1)} yrs
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalFutureSavings)}
              </div>
              <p className="text-sm text-blue-600">Projected Savings</p>
            </div>
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(annualIncomeNeeded)}
              </div>
              <p className="text-sm text-green-600">Annual Income</p>
            </div>
            <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(Math.max(0, totalRetirementNeeded - totalFutureSavings))}
              </div>
              <p className="text-sm text-orange-600">Income Gap</p>
            </div>
            <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {fundingPercentage.toFixed(0)}%
              </div>
              <p className="text-sm text-purple-600">Funded</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tax Optimization Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    Strategy: {withdrawalStrategy.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h3>
                  <div className="text-4xl font-bold text-red-600 mb-2">
                    {formatCurrencyFull(totalLifetimeTaxes)}
                  </div>
                  <p className="text-gray-600">Total Lifetime Taxes</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Applied Tax Rate:</span>
                    <span className="font-semibold">{taxRate[0]}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Annual Tax Rate:</span>
                    <span className="font-semibold">{averageAnnualTaxRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax Efficiency Score:</span>
                    <span className="font-semibold text-green-600">{taxEfficiencyScore.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual Tax Burden:</span>
                    <span className="font-semibold">{formatCurrency(totalLifetimeTaxes / yearsInRetirement)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Year-by-Year Account Breakdown</CardTitle>
              <p className="text-sm text-gray-600">
                Detailed year-by-year breakdown showing investment growth, withdrawals, and remaining balances
              </p>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Age</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Net Withdrawal Needed</TableHead>
                      <TableHead>RRSP Balance</TableHead>
                      <TableHead>RRSP Withdrawal</TableHead>
                      <TableHead>TFSA Balance</TableHead>
                      <TableHead>TFSA Withdrawal</TableHead>
                      <TableHead>Non-Reg Balance</TableHead>
                      <TableHead>Non-Reg Withdrawal</TableHead>
                      <TableHead>Taxes Paid</TableHead>
                      <TableHead>Total Assets</TableHead>
                      <TableHead>Total Withdrawal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearlyData.map((year, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{year.age}</TableCell>
                        <TableCell>{year.year}</TableCell>
                        <TableCell className="font-medium text-orange-700">
                          {year.netWithdrawalNeeded > 0 ? formatCurrencyFull(year.netWithdrawalNeeded) : "-"}
                        </TableCell>
                        <TableCell>{formatCurrencyFull(year.rrspBalance)}</TableCell>
                        <TableCell>{year.rrspWithdrawal > 0 ? formatCurrencyFull(year.rrspWithdrawal) : "-"}</TableCell>
                        <TableCell>{formatCurrencyFull(year.tfsaBalance)}</TableCell>
                        <TableCell>{year.tfsaWithdrawal > 0 ? formatCurrencyFull(year.tfsaWithdrawal) : "-"}</TableCell>
                        <TableCell>{formatCurrencyFull(year.nonRegBalance)}</TableCell>
                        <TableCell>{year.nonRegWithdrawal > 0 ? formatCurrencyFull(year.nonRegWithdrawal) : "-"}</TableCell>
                        <TableCell className="font-medium text-red-600">{year.taxesPaid > 0 ? formatCurrencyFull(year.taxesPaid) : "-"}</TableCell>
                        <TableCell className="font-bold">{formatCurrencyFull(year.totalAssets)}</TableCell>
                        <TableCell className="font-bold">{formatCurrencyFull(year.totalWithdrawal)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800">Growth Phase</h4>
              <p className="text-sm text-green-600">Assets growing before retirement</p>
            </div>
            <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800">Withdrawal Phase</h4>
              <p className="text-sm text-blue-600">Assets being withdrawn in retirement</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
