import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ComposedChart, Area } from "recharts";
import { TrendingUp, AlertTriangle, CheckCircle, Calculator, DollarSign, Calendar, Clock, Plus, Minus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RetirementDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RetirementDetailDialog = ({ isOpen, onClose }: RetirementDetailDialogProps) => {
  const [retirementAge, setRetirementAge] = useState([65]);
  const [netMonthlyIncome, setNetMonthlyIncome] = useState([4500]);
  const [cppAdjustment, setCppAdjustment] = useState(0);
  const [oasAdjustment, setOasAdjustment] = useState(0);

  // Now dynamic: incomeAllocation affects ALL calculations
  const [incomeAllocation, setIncomeAllocation] = useState<[number, number, number]>([60, 30, 10]); // RRSP, TFSA, Non-Reg

  // Helper: force sum = 100
  const setSyncedAllocation = (idx: number, newValue: number) => {
    let [rrsp, tfsa, nonReg] = incomeAllocation;
    if (idx === 0) rrsp = newValue;
    if (idx === 1) tfsa = newValue;
    if (idx === 2) nonReg = newValue;
    // Clamp and adjust to sum 100
    let values = [rrsp, tfsa, nonReg];
    let sum = values.reduce((a,b)=>a+b,0);
    // If sum != 100, adjust the others proportionally
    if (sum !== 100) {
      const rest = [0,1,2].filter(i => i !== idx);
      const delta = 100 - newValue;
      const restSum = values[rest[0]] + values[rest[1]];
      if (restSum === 0) {
        values[rest[0]] = (100-newValue)/2;
        values[rest[1]] = (100-newValue)/2;
      } else {
        values[rest[0]] = Math.round(values[rest[0]] / restSum * (100 - newValue));
        values[rest[1]] = 100 - newValue - values[rest[0]];
      }
    }
    setIncomeAllocation([Math.round(values[0]), Math.round(values[1]), Math.round(values[2])]);
  };

  // Shorthands
  const [rrspPct, tfsaPct, nonRegPct] = incomeAllocation;

  // Current state
  const currentAge = 35;
  const currentSavings = 90000;
  const yearsToRetirement = retirementAge[0] - currentAge;
  const lifeExpectancy = 90;
  const yearsInRetirement = lifeExpectancy - retirementAge[0];

  // Asset allocation (from current total)
  const currentRRSP = 52000;
  const currentTFSA = 38000;
  const currentNonReg = 25000;
  const monthlyContribution = 1000;

  // Calculations
  const projectedCPP = 15000; // Annual at 65
  const projectedOAS = 7500; // Annual at 65
  const inflationRate = 0.025;
  const investmentReturn = 0.07;

  // CPP/OAS adjustments for early/late retirement AND manual adjustments
  const actualCppAge = retirementAge[0] + cppAdjustment;
  const actualOasAge = Math.max(65, retirementAge[0] + oasAdjustment); // OAS can't start before 65

  const cppAdjustmentFactor = actualCppAge < 65 ? 0.6 + (actualCppAge - 60) * 0.08 : 
                             actualCppAge > 65 ? Math.min(1.42, 1 + (actualCppAge - 65) * 0.084) : 1;
  const oasAdjustmentFactor = actualOasAge < 65 ? 0 : actualOasAge > 65 ? 1 + (actualOasAge - 65) * 0.06 : 1;

  const adjustedCPP = projectedCPP * cppAdjustmentFactor;
  const adjustedOAS = projectedOAS * oasAdjustmentFactor;

  // Projected future values using the sliders' allocation
  function futureValue(principal: number, pctAllocation: number) {
    return principal * Math.pow(1 + investmentReturn, yearsToRetirement) +
      (monthlyContribution * (pctAllocation / 100) * 12 * (Math.pow(1 + investmentReturn, yearsToRetirement) - 1) / investmentReturn);
  }
  const futureRRSP = futureValue(currentRRSP, rrspPct);
  const futureTFSA = futureValue(currentTFSA, tfsaPct);
  const futureNonReg = futureValue(currentNonReg, nonRegPct);

  // Total projected savings at retirement (should reflect allocation sliders)
  const totalRetirementSavings = futureRRSP + futureTFSA + futureNonReg;

  // How much each account needs to provide monthly (income allocation)
  const rrspIncomeShare = netMonthlyIncome[0] * (rrspPct / 100);
  const tfsaIncomeShare = netMonthlyIncome[0] * (tfsaPct / 100);
  const nonRegIncomeShare = netMonthlyIncome[0] * (nonRegPct / 100);

  // For each, how many years that account can fund its share of income
  const rrspYears = rrspIncomeShare > 0 ? futureRRSP / (rrspIncomeShare * 12) : 0;
  const tfsaYears = tfsaIncomeShare > 0 ? futureTFSA / (tfsaIncomeShare * 12) : 0;
  const nonRegYears = nonRegIncomeShare > 0 ? futureNonReg / (nonRegIncomeShare * 12) : 0;

  // Calculate when assets run out while funding required annual income gap
  // New calculation should update on: rrspPct, tfsaPct, nonRegPct sliders, AND retirementAge/netMonthlyIncome
  // Recompute incomeGap after gov't benefits, then simulate year by year asset depletion
  let simulatedYearsAssetsLast = 0;
  let remainingRRSP = futureRRSP;
  let remainingTFSA = futureTFSA;
  let remainingNonReg = futureNonReg;

  // For each year in retirement, subtract each account's share of income until one depletes (assets run out)
  for (let i = 0; i < yearsInRetirement; i++) {
    if (remainingRRSP > 0) remainingRRSP -= rrspIncomeShare * 12;
    if (remainingTFSA > 0) remainingTFSA -= tfsaIncomeShare * 12;
    if (remainingNonReg > 0) remainingNonReg -= nonRegIncomeShare * 12;
    if (remainingRRSP <= 0 && remainingTFSA <= 0 && remainingNonReg <= 0) {
      simulatedYearsAssetsLast = i + 1;
      break;
    }
  }
  if (simulatedYearsAssetsLast === 0) {
    simulatedYearsAssetsLast = yearsInRetirement;
  }

  // Use the simulated value for yearsAssetsFunded and assetsFundedPercentage
  const yearsAssetsFunded = simulatedYearsAssetsLast;
  const assetsFundedPercentage = Math.min(100, (yearsAssetsFunded / yearsInRetirement) * 100);

  // Asset depletion over retirement: for each year, subtract account's monthly allocation * 12 from its bucket
  const allocationDepletionData = Array.from({ length: yearsInRetirement + 1 }).map((_, i) => ({
    year: i,
    RRSP: Math.max(0, futureRRSP - rrspIncomeShare * 12 * i),
    TFSA: Math.max(0, futureTFSA - tfsaIncomeShare * 12 * i),
    NonReg: Math.max(0, futureNonReg - nonRegIncomeShare * 12 * i)
  }));

  // Asset funding duration and percent calculation
  const governmentBenefits = adjustedCPP + adjustedOAS;
  const annualIncomeNeed = netMonthlyIncome[0] * 12;
  const incomeGap = Math.max(0, annualIncomeNeed - governmentBenefits);
  // const yearsAssetsFunded = incomeGap > 0 ? totalRetirementSavings / incomeGap : yearsInRetirement;
  // const assetsFundedPercentage = Math.min(100, (yearsAssetsFunded / yearsInRetirement) * 100);

  // Dynamic initial allocations for each account
  const initialAllocations = [
    { type: "rrsp", pct: rrspPct, current: currentRRSP },
    { type: "tfsa", pct: tfsaPct, current: currentTFSA },
    { type: "nonReg", pct: nonRegPct, current: currentNonReg }
  ];

  // Generalized function for initial value for any account
  function growthValue(start: number, pct: number, years: number) {
    return start * Math.pow(1 + investmentReturn, years) +
      (monthlyContribution * (pct / 100) * 12 * (Math.pow(1 + investmentReturn, years) - 1) / investmentReturn);
  }

  // 30-Year Asset & Withdrawal Breakdown
  const thirtyYearAssetData = Array.from({ length: 30 }, (_, i) => {
    const age = retirementAge[0] + i;
    const yearsFromNow = age - currentAge;
    if (age < retirementAge[0]) {
      // During growth
      const rrsp = growthValue(currentRRSP, rrspPct, yearsFromNow);
      const tfsa = growthValue(currentTFSA, tfsaPct, yearsFromNow);
      const nonReg = growthValue(currentNonReg, nonRegPct, yearsFromNow);
      const totalAssets = rrsp + tfsa + nonReg;
      return {
        age,
        year: i,
        rrsp: rrsp / 1000,
        tfsa: tfsa / 1000,
        nonReg: nonReg / 1000,
        totalAssets: totalAssets / 1000,
        withdrawal: 0,
        netAssets: totalAssets / 1000,
        phase: 'Growth'
      };
    }
    // Withdrawal phase (~4% rule, or any rate)
    const yearsIntoRetirement = age - retirementAge[0];
    // Use previous year ending balances (initialize with future[] above)
    let prevRRSP = futureRRSP;
    let prevTFSA = futureTFSA;
    let prevNonReg = futureNonReg;
    for (let year = 0; year < yearsIntoRetirement; year++) {
      prevRRSP = Math.max(0, prevRRSP - rrspIncomeShare * 12);
      prevTFSA = Math.max(0, prevTFSA - tfsaIncomeShare * 12);
      prevNonReg = Math.max(0, prevNonReg - nonRegIncomeShare * 12);
    }
    const withdrawal = rrspIncomeShare + tfsaIncomeShare + nonRegIncomeShare;
    const totalAssets = prevRRSP + prevTFSA + prevNonReg;
    return {
      age,
      year: i,
      rrsp: prevRRSP / 1000,
      tfsa: prevTFSA / 1000,
      nonReg: prevNonReg / 1000,
      totalAssets: totalAssets / 1000,
      withdrawal: withdrawal * 12 / 1000,
      netAssets: (totalAssets - withdrawal * 12) / 1000,
      phase: 'Withdrawal'
    };
  });

  // Year-by-Year Account Breakdown Table (until assets exhausted or 50 years)
  const maxYears = Math.max(
    Math.ceil(Math.max(rrspYears, tfsaYears, nonRegYears)),
    30,
    yearsInRetirement
  );
  const extendedAssetData = Array.from({ length: maxYears }, (_, i) => {
    const age = retirementAge[0] + i;
    let prevRRSP = futureRRSP;
    let prevTFSA = futureTFSA;
    let prevNonReg = futureNonReg;
    for (let year = 0; year < i; year++) {
      prevRRSP = Math.max(0, prevRRSP - rrspIncomeShare * 12);
      prevTFSA = Math.max(0, prevTFSA - tfsaIncomeShare * 12);
      prevNonReg = Math.max(0, prevNonReg - nonRegIncomeShare * 12);
    }
    const rrspWithdrawal = prevRRSP > 0 ? Math.min(rrspIncomeShare * 12, prevRRSP) : 0;
    const tfsaWithdrawal = prevTFSA > 0 ? Math.min(tfsaIncomeShare * 12, prevTFSA) : 0;
    const nonRegWithdrawal = prevNonReg > 0 ? Math.min(nonRegIncomeShare * 12, prevNonReg) : 0;
    const totalAssets = prevRRSP + prevTFSA + prevNonReg;
    return {
      age,
      year: i,
      rrsp: prevRRSP,
      tfsa: prevTFSA,
      nonReg: prevNonReg,
      totalAssets: totalAssets,
      rrspWithdrawal,
      tfsaWithdrawal,
      nonRegWithdrawal,
      totalWithdrawal: rrspWithdrawal + tfsaWithdrawal + nonRegWithdrawal,
      phase: i < yearsToRetirement ? 'Growth' : 'Withdrawal'
    };
  }).filter((item, idx) => item.totalAssets > 1000 || idx < 30);

  // Tax calculation is based on withdrawals/balances as before, using latest future* values and durations
  const rrspTax = Math.floor(Math.min(futureRRSP, rrspYears * rrspIncomeShare * 12) * 0.3);
  const tfsaTax = 0;
  const nonRegGain = Math.max(0, futureNonReg - currentNonReg);
  const nonRegTax = Math.floor(nonRegGain * 0.5 * 0.25);
  const totalDepletionTax = rrspTax + tfsaTax + nonRegTax;

  // Retirement readiness ratio
  const savingsIncome = totalRetirementSavings * 0.04; // 4% withdrawal rule
  const totalProjectedIncome = governmentBenefits + savingsIncome;
  const readinessRatio = Math.min(1, totalProjectedIncome / annualIncomeNeed);

  // Chart data
  const incomeProjectionData = Array.from({ length: 25 }, (_, i) => {
    const age = retirementAge[0] + i;
    const withdrawalRate = 0.04; // simplified fixed withdrawal rate
    return {
      age,
      cpp: adjustedCPP / 1000,
      oas: age >= 65 ? adjustedOAS / 1000 : 0,
      rrsp: (futureRRSP * withdrawalRate) / 1000,
      total: ((adjustedCPP + (age >= 65 ? adjustedOAS : 0) + futureRRSP * withdrawalRate) / 1000)
    };
  });

  const incomeSourcesData = [
    { source: "CPP", amount: adjustedCPP, color: "#3b82f6" },
    { source: "OAS", amount: adjustedOAS, color: "#10b981" },
    { source: "RRSP/RRIF", amount: savingsIncome, color: "#f59e0b" },
    { source: "Gap", amount: incomeGap, color: "#ef4444" }
  ];

  const chartConfig = {
    cpp: { label: "CPP", color: "#3b82f6" },
    oas: { label: "OAS", color: "#10b981" },
    rrsp: { label: "RRSP", color: "#f59e0b" },
    tfsa: { label: "TFSA", color: "#8b5cf6" },
    nonReg: { label: "Non-Registered", color: "#06b6d4" },
    totalAssets: { label: "Total Assets", color: "#10b981" },
    withdrawal: { label: "Annual Withdrawal", color: "#ef4444" },
    total: { label: "Total Income", color: "#8b5cf6" },
    savings: { label: "Projected Savings", color: "#06b6d4" }
  };

  // RRIF minimum withdrawal rates by age
  const rrfWithdrawalRates: { [key: number]: number } = {
    65: 0.04, 66: 0.0417, 67: 0.0435, 68: 0.0455, 69: 0.0476,
    70: 0.05, 71: 0.0519, 72: 0.054, 73: 0.0563, 74: 0.0588,
    75: 0.0615, 76: 0.0645, 77: 0.0678, 78: 0.0714, 79: 0.0755,
    80: 0.08, 85: 0.1029, 90: 0.1667
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Retirement Planning Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Interactive Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Retirement Planning Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Retirement Age and Monthly Income on Same Line */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-3 block">Retirement Age: {retirementAge[0]}</label>
                  <Slider
                    value={retirementAge}
                    onValueChange={setRetirementAge}
                    min={55}
                    max={70}
                    step={1}
                    className="mb-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-3 block">Net Monthly Income Needed: ${netMonthlyIncome[0].toLocaleString()}</label>
                  <Slider
                    value={netMonthlyIncome}
                    onValueChange={setNetMonthlyIncome}
                    min={2000}
                    max={8000}
                    step={100}
                    className="mb-2"
                  />
                </div>
              </div>

              {/* NEW: Income Allocation Sliders */}
              <div className="mt-6 p-4 border border-gray-200 rounded-xl bg-gradient-to-r from-blue-50 via-violet-50 to-emerald-50">
                <div className="mb-3 text-xs text-gray-700 font-semibold">
                  Allocate how your retirement income is sourced from each account (total must be 100%):
                </div>
                <div className="space-y-3 w-full max-w-lg">
                  {/* RRSP Slider */}
                  <div>
                    <div className="flex justify-between text-sm font-medium">
                      <span>RRSP</span>
                      <span>{rrspPct}%</span>
                    </div>
                    <Slider
                      value={[rrspPct]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={([value]) => setSyncedAllocation(0, value)}
                    />
                  </div>
                  {/* TFSA Slider */}
                  <div>
                    <div className="flex justify-between text-sm font-medium">
                      <span>TFSA</span>
                      <span>{tfsaPct}%</span>
                    </div>
                    <Slider
                      value={[tfsaPct]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={([value]) => setSyncedAllocation(1, value)}
                    />
                  </div>
                  {/* Non-Reg Slider */}
                  <div>
                    <div className="flex justify-between text-sm font-medium">
                      <span>Non-Registered</span>
                      <span>{nonRegPct}%</span>
                    </div>
                    <Slider
                      value={[nonRegPct]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={([value]) => setSyncedAllocation(2, value)}
                    />
                  </div>
                </div>
                {/* Validation message */}
                {(rrspPct + tfsaPct + nonRegPct !== 100) && (
                  <div className="mt-2 text-red-600 text-xs font-medium">
                    Allocation must total 100%.
                  </div>
                )}
              </div>

              {/* Asset Duration Display (UPDATED and Responsive) */}
              <div className="p-8 bg-[#f5f3ff] rounded-2xl border border-[#a78bfa]">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center mb-5 md:mb-0">
                    <Clock className="h-6 w-6 text-purple-500" />
                    <h3 className="text-xl font-bold text-purple-800">Asset Funding Duration</h3>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:gap-16 justify-between w-full">
                    <div>
                      <p className="text-5xl font-extrabold text-purple-600 mb-1 leading-none">
                        {yearsAssetsFunded.toFixed(1)} <span className="text-2xl font-bold">years</span>
                      </p>
                      <p className="text-base text-purple-700 font-medium mb-4 md:mb-0">Assets Will Last</p>
                    </div>
                    <div>
                      <p className="text-5xl font-extrabold text-purple-600 mb-1 leading-none">
                        {assetsFundedPercentage.toFixed(0)}<span className="text-3xl font-extrabold">%</span>
                      </p>
                      <p className="text-base text-purple-700 font-medium mb-4 md:mb-0">of Retirement Goal</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl bg-white/90 px-6 py-4 mt-1 flex flex-col md:flex-row md:gap-14 md:justify-start">
                  <div className="flex flex-row items-center md:mb-0 mb-2">
                    <span className="text-gray-600 font-medium mr-2">Years in Retirement:</span>
                    <span className="text-black font-bold">{yearsInRetirement} years</span>
                  </div>
                  <div className="flex flex-row items-center">
                    <span className="text-gray-600 font-medium mr-2">Funding Status:</span>
                    <span className={assetsFundedPercentage >= 100 ? 'font-bold text-green-600'
                      : assetsFundedPercentage >= 75 ? 'font-bold text-yellow-500'
                      : 'font-bold text-red-600'}>
                      {assetsFundedPercentage >= 100 ? 'Fully Funded'
                        : assetsFundedPercentage >= 75 ? 'Mostly Funded'
                        : 'Underfunded'}
                    </span>
                  </div>
                </div>
              </div>

              {/* NEW: ACCOUNT FUNDING SUMMARY & DEPLETION CHART */}
              <div className="p-6 mt-2 bg-gradient-to-r from-violet-50 to-cyan-50 rounded-xl border border-violet-200">
                <div className="font-semibold mb-2">Account Funding Analysis</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <div className="text-xs text-purple-700 font-medium">RRSP</div>
                    <div className="text-2xl font-bold">{rrspPct}%</div>
                    <div className="text-sm text-purple-800">Funds {rrspYears.toFixed(1)} yrs</div>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <div className="text-xs text-emerald-700 font-medium">TFSA</div>
                    <div className="text-2xl font-bold">{tfsaPct}%</div>
                    <div className="text-sm text-emerald-800">Funds {tfsaYears.toFixed(1)} yrs</div>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <div className="text-xs text-blue-700 font-medium">Non-Reg</div>
                    <div className="text-2xl font-bold">{nonRegPct}%</div>
                    <div className="text-sm text-blue-800">Funds {nonRegYears.toFixed(1)} yrs</div>
                  </div>
                </div>
                {/* Timeline of Depletion */}
                <div className="mt-6 mb-2 font-medium text-sm">Projected Asset Depletion by Account</div>
                <ChartContainer config={{
                  RRSP: { label: "RRSP", color: "#a78bfa" },
                  TFSA: { label: "TFSA", color: "#6ee7b7" },
                  NonReg: { label: "Non-Registered", color: "#7dd3fc" },
                }} className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={allocationDepletionData}>
                      <XAxis dataKey="year" tickFormatter={v=>`+${v}yr`} />
                      <YAxis />
                      <Bar dataKey="RRSP" stackId="a" fill="#a78bfa" name="RRSP" />
                      <Bar dataKey="TFSA" stackId="a" fill="#6ee7b7" name="TFSA" />
                      <Bar dataKey="NonReg" stackId="a" fill="#7dd3fc" name="Non-Reg" />
                      <ChartTooltip content={<ChartTooltipContent formatter={(v, n) => [`$${Math.round(v).toLocaleString()}`, n]}/>} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Retirement Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{(readinessRatio * 100).toFixed(0)}%</p>
                  <p className="text-sm text-muted-foreground">Retirement Readiness</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">${(totalRetirementSavings / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-muted-foreground">Projected Savings</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">${(totalProjectedIncome / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-muted-foreground">Annual Income</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">${(incomeGap / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-muted-foreground">Income Gap</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Below "Income Gap": TAX OPTIMIZATION LAYER */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Tax Optimization Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="font-medium text-sm text-slate-500">Estimated Total Taxes Owed <span className="text-xs">(lifetime from drawdowns)</span></div>
                  <div className="text-3xl font-bold text-rose-600">${totalDepletionTax.toLocaleString()}</div>
                </div>
                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-700 text-sm font-medium">
                  {rrspPct >= 70 ? "Front-loading RRSP withdrawals reduces long-term tax risk, but taxes are higher initially." :
                   rrspPct <= 20 ? "Delaying RRSP drawdown risks higher taxes later (higher balance, higher bracket)." :
                   "Balanced withdrawals help manage steady tax rates over retirement."}
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="projections" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="projections">Asset Breakdown</TabsTrigger>
              <TabsTrigger value="government">CPP/OAS Analysis</TabsTrigger>
              <TabsTrigger value="rrif">RRIF Schedule</TabsTrigger>
              <TabsTrigger value="requirements">Savings Requirements</TabsTrigger>
            </TabsList>

            <TabsContent value="projections" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Retirement Income Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-64">
                      <PieChart>
                        <Pie
                          data={incomeSourcesData.filter(item => item.amount > 0)}
                          dataKey="amount"
                          nameKey="source"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                        >
                          {incomeSourcesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Income Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-64">
                      <LineChart data={incomeProjectionData}>
                        <XAxis dataKey="age" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="cpp" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="oas" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="rrsp" stroke="#f59e0b" strokeWidth={2} />
                        <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={3} />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">30-Year Asset & Withdrawal Breakdown</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Detailed projection showing asset growth, withdrawal amounts, and remaining balances over 30 years
                  </p>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96 w-full">
                    <ChartContainer config={chartConfig} className="h-80 w-full min-w-[800px]">
                      <ComposedChart data={thirtyYearAssetData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="age" />
                        <YAxis />
                        <ChartTooltip 
                          content={<ChartTooltipContent 
                            formatter={(value, name) => [
                              `$${Number(value).toFixed(0)}K`, 
                              name === 'rrsp' ? 'RRSP' : 
                              name === 'tfsa' ? 'TFSA' : 
                              name === 'nonReg' ? 'Non-Registered' : 
                              name === 'totalAssets' ? 'Total Assets' :
                              name === 'withdrawal' ? 'Annual Withdrawal' : name
                            ]}
                          />} 
                        />
                        {/* Asset areas */}
                        <Area 
                          type="monotone" 
                          dataKey="rrsp" 
                          stackId="assets"
                          stroke="#f59e0b" 
                          fill="#f59e0b" 
                          fillOpacity={0.6}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="tfsa" 
                          stackId="assets"
                          stroke="#8b5cf6" 
                          fill="#8b5cf6" 
                          fillOpacity={0.6}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="nonReg" 
                          stackId="assets"
                          stroke="#06b6d4" 
                          fill="#06b6d4" 
                          fillOpacity={0.6}
                        />
                        {/* Total assets line */}
                        <Line 
                          type="monotone" 
                          dataKey="totalAssets" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          dot={false}
                        />
                        {/* Withdrawal bars */}
                        <Bar 
                          dataKey="withdrawal" 
                          fill="#ef4444" 
                          fillOpacity={0.8}
                          name="Annual Withdrawal"
                        />
                      </ComposedChart>
                    </ChartContainer>
                  </ScrollArea>
                  
                  {/* Legend */}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-500 rounded"></div>
                      <span>RRSP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded"></div>
                      <span>TFSA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-cyan-500 rounded"></div>
                      <span>Non-Registered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Total Assets</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Annual Withdrawal</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Year-by-Year Account Breakdown Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Year-by-Year Account Breakdown</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Detailed annual breakdown showing each account balance and withdrawals until assets reach zero
                  </p>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96 w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Age</TableHead>
                          <TableHead className="w-16">Year</TableHead>
                          <TableHead className="text-right">RRSP Balance</TableHead>
                          <TableHead className="text-right">RRSP Withdrawal</TableHead>
                          <TableHead className="text-right">TFSA Balance</TableHead>
                          <TableHead className="text-right">TFSA Withdrawal</TableHead>
                          <TableHead className="text-right">Non-Reg Balance</TableHead>
                          <TableHead className="text-right">Non-Reg Withdrawal</TableHead>
                          <TableHead className="text-right">Total Assets</TableHead>
                          <TableHead className="text-right">Total Withdrawal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {extendedAssetData.map((item, index) => (
                          <TableRow key={index} className={item.phase === 'Growth' ? 'bg-green-50' : 'bg-blue-50'}>
                            <TableCell className="font-medium">{item.age}</TableCell>
                            <TableCell>{item.year}</TableCell>
                            <TableCell className="text-right font-mono">
                              ${item.rrsp.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </TableCell>
                            <TableCell className="text-right font-mono text-red-600">
                              {item.rrspWithdrawal > 0 ? `$${item.rrspWithdrawal.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '-'}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              ${item.tfsa.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </TableCell>
                            <TableCell className="text-right font-mono text-red-600">
                              {item.tfsaWithdrawal > 0 ? `$${item.tfsaWithdrawal.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '-'}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              ${item.nonReg.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </TableCell>
                            <TableCell className="text-right font-mono text-red-600">
                              {item.nonRegWithdrawal > 0 ? `$${item.nonRegWithdrawal.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '-'}
                            </TableCell>
                            <TableCell className="text-right font-mono font-bold">
                              ${item.totalAssets.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </TableCell>
                            <TableCell className="text-right font-mono font-bold text-red-600">
                              {item.totalWithdrawal > 0 ? `$${item.totalWithdrawal.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                  
                  {/* Summary Info */}
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="font-medium">Growth Phase</span>
                      </div>
                      <span className="text-muted-foreground">Assets growing before retirement</span>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="font-medium">Withdrawal Phase</span>
                      </div>
                      <span className="text-muted-foreground">Assets being withdrawn in retirement</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="government" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">CPP/QPP Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Base CPP (at 65)</span>
                        <span className="text-sm font-medium">${projectedCPP.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Actual Start Age</span>
                        <span className="text-sm font-medium">{actualCppAge}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Adjustment Factor</span>
                        <span className="text-sm font-medium">{(cppAdjustmentFactor * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span className="text-sm">Adjusted CPP</span>
                        <span className="text-sm">${adjustedCPP.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* CPP Timing Adjustment Toggle */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">CPP Timing Adjustment</span>
                        <span className="text-xs text-muted-foreground">±5 years</span>
                      </div>
                      <div className="flex items-center justify-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCppAdjustment(Math.max(-5, cppAdjustment - 1))}
                          disabled={cppAdjustment <= -5}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <div className="text-center min-w-[100px]">
                          <div className="text-lg font-bold">
                            {cppAdjustment > 0 ? '+' : ''}{cppAdjustment} years
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Start at {actualCppAge}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCppAdjustment(Math.min(5, cppAdjustment + 1))}
                          disabled={cppAdjustment >= 5}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="mt-2 text-xs text-center text-muted-foreground">
                        {cppAdjustment < 0 ? 'Early start reduces benefits' : 
                         cppAdjustment > 0 ? 'Delayed start increases benefits' : 
                         'Normal retirement timing'}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      CPP can start as early as 60 (reduced by 0.6% per month) or delayed to 70 (increased by 0.7% per month)
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">OAS Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Base OAS (at 65)</span>
                        <span className="text-sm font-medium">${projectedOAS.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Actual Start Age</span>
                        <span className="text-sm font-medium">{actualOasAge}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Deferral Factor</span>
                        <span className="text-sm font-medium">{(oasAdjustmentFactor * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span className="text-sm">Adjusted OAS</span>
                        <span className="text-sm">${adjustedOAS.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* OAS Timing Adjustment Toggle */}
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">OAS Timing Adjustment</span>
                        <span className="text-xs text-muted-foreground">±5 years</span>
                      </div>
                      <div className="flex items-center justify-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setOasAdjustment(Math.max(-5, oasAdjustment - 1))}
                          disabled={oasAdjustment <= -5 || retirementAge[0] + oasAdjustment <= 65}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <div className="text-center min-w-[100px]">
                          <div className="text-lg font-bold">
                            {oasAdjustment > 0 ? '+' : ''}{oasAdjustment} years
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Start at {actualOasAge}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setOasAdjustment(Math.min(5, oasAdjustment + 1))}
                          disabled={oasAdjustment >= 5}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="mt-2 text-xs text-center text-muted-foreground">
                        {actualOasAge === 65 ? 'Normal start at 65' :
                         actualOasAge > 65 ? 'Delayed start increases benefits' :
                         'Cannot start before 65'}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      OAS can be deferred to 70 (increased by 0.6% per month). Not available before 65.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="rrif" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">RRIF Minimum Withdrawal Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-medium">Withdrawal Rates by Age</h4>
                      <div className="space-y-1 text-sm">
                        {Object.entries(rrfWithdrawalRates).slice(0, 10).map(([age, rate]) => (
                          <div key={age} className="flex justify-between">
                            <span>Age {age}</span>
                            <span>{(rate * 100).toFixed(2)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Your Projected Withdrawals</h4>
                      <div className="space-y-1 text-sm">
                        {incomeProjectionData.slice(0, 10).map((item) => (
                          <div key={item.age} className="flex justify-between">
                            <span>Age {item.age}</span>
                            <span>${(item.rrsp * 1000).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Retirement Lump Sum Calculation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Required Annual Income</span>
                        <span className="text-sm font-medium">${annualIncomeNeed.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Government Benefits</span>
                        <span className="text-sm font-medium">${governmentBenefits.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Income Gap</span>
                        <span className="text-sm font-medium">${incomeGap.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Years in Retirement</span>
                        <span className="text-sm font-medium">{yearsInRetirement}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span className="text-sm">Required Lump Sum (PV)</span>
                        <span className="text-sm">${(incomeGap > 0 ? (incomeGap * (1 - Math.pow(1 + (investmentReturn - inflationRate), -yearsInRetirement)) / (investmentReturn - inflationRate)) : 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Required Savings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Current Trajectory</span>
                        <span className="text-sm font-medium">${(totalRetirementSavings / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Target Savings</span>
                        <span className="text-sm font-medium">${(totalRetirementSavings / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Additional Needed</span>
                        <span className="text-sm font-medium">$0K</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span className="text-sm">Required Monthly Savings</span>
                        <span className="text-sm">$0</span>
                      </div>
                    </div>

                    {incomeGap > 0 && (
                      <div className="flex items-center space-x-1 text-orange-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Consider increasing contributions by $0/month
                        </span>
                      </div>
                    )}
                    
                    {incomeGap <= 0 && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">On track for retirement goals</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
