import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ComposedChart, Area, AreaChart } from "recharts";
import { TrendingUp, AlertTriangle, CheckCircle, Calculator, DollarSign, Calendar, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RetirementDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RetirementDetailDialog = ({ isOpen, onClose }: RetirementDetailDialogProps) => {
  const [retirementAge, setRetirementAge] = useState([65]);
  const [monthlyContribution, setMonthlyContribution] = useState([1000]);
  const [netMonthlyIncome, setNetMonthlyIncome] = useState([4500]);

  // Current data
  const currentAge = 35;
  const currentSavings = 90000;
  const yearsToRetirement = retirementAge[0] - currentAge;
  const lifeExpectancy = 90;
  const yearsInRetirement = lifeExpectancy - retirementAge[0];

  // Asset allocation (from current total)
  const currentRRSP = 52000;
  const currentTFSA = 38000;
  const currentNonReg = 25000; // From AssetsBreakdown data

  // Calculations
  const projectedCPP = 15000; // Annual at 65
  const projectedOAS = 7500; // Annual at 65
  const inflationRate = 0.025;
  const investmentReturn = 0.07;

  // CPP/OAS adjustments for early/late retirement
  const cppAdjustmentFactor = retirementAge[0] < 65 ? 0.6 + (retirementAge[0] - 60) * 0.08 : 
                             retirementAge[0] > 65 ? Math.min(1.42, 1 + (retirementAge[0] - 65) * 0.084) : 1;
  const oasAdjustmentFactor = retirementAge[0] < 65 ? 0 : retirementAge[0] > 65 ? 1 + (retirementAge[0] - 65) * 0.06 : 1;

  const adjustedCPP = projectedCPP * cppAdjustmentFactor;
  const adjustedOAS = projectedOAS * oasAdjustmentFactor;

  // Future value of current savings and contributions
  const futureCurrentSavings = currentSavings * Math.pow(1 + investmentReturn, yearsToRetirement);
  const futureContributions = monthlyContribution[0] * 12 * (Math.pow(1 + investmentReturn, yearsToRetirement) - 1) / investmentReturn;
  const totalRetirementSavings = futureCurrentSavings + futureContributions;

  // How long assets will last calculation
  const governmentBenefits = adjustedCPP + adjustedOAS;
  const annualIncomeNeed = netMonthlyIncome[0] * 12;
  const incomeGap = Math.max(0, annualIncomeNeed - governmentBenefits);
  
  // Years assets will last (if there's an income gap)
  const yearsAssetsFunded = incomeGap > 0 ? totalRetirementSavings / incomeGap : yearsInRetirement;
  const assetsFundedPercentage = Math.min(100, (yearsAssetsFunded / yearsInRetirement) * 100);

  // RRIF minimum withdrawal rates by age
  const rrfWithdrawalRates: { [key: number]: number } = {
    65: 0.04, 66: 0.0417, 67: 0.0435, 68: 0.0455, 69: 0.0476,
    70: 0.05, 71: 0.0519, 72: 0.054, 73: 0.0563, 74: 0.0588,
    75: 0.0615, 76: 0.0645, 77: 0.0678, 78: 0.0714, 79: 0.0755,
    80: 0.08, 85: 0.1029, 90: 0.1667
  };

  // Annual retirement income need
  const savingsIncome = totalRetirementSavings * 0.04; // 4% withdrawal rule
  const totalProjectedIncome = governmentBenefits + savingsIncome;
  
  // Required savings to hit retirement goal (PV of annuity)
  const requiredAnnualIncome = incomeGap;
  const discountRate = investmentReturn - inflationRate;
  const pvAnnuity = requiredAnnualIncome * (1 - Math.pow(1 + discountRate, -yearsInRetirement)) / discountRate;
  const requiredTotalSavings = pvAnnuity + totalRetirementSavings;
  const additionalSavingsNeeded = Math.max(0, requiredTotalSavings - totalRetirementSavings);
  
  // Monthly savings required
  const requiredMonthlySavings = additionalSavingsNeeded > 0 ? 
    (additionalSavingsNeeded * investmentReturn) / (12 * (Math.pow(1 + investmentReturn, yearsToRetirement) - 1)) : 0;

  // Retirement readiness ratio
  const readinessRatio = Math.min(1, totalProjectedIncome / annualIncomeNeed);

  // 30-year asset breakdown data
  const thirtyYearAssetData = Array.from({ length: 30 }, (_, i) => {
    const age = retirementAge[0] + i;
    const isRetired = age >= retirementAge[0];
    
    // Growth phase (before retirement)
    if (!isRetired) {
      const yearsFromNow = age - currentAge;
      const rrspGrowth = currentRRSP * Math.pow(1 + investmentReturn, yearsFromNow) + 
                        (monthlyContribution[0] * 0.6 * 12 * (Math.pow(1 + investmentReturn, yearsFromNow) - 1) / investmentReturn);
      const tfsaGrowth = currentTFSA * Math.pow(1 + investmentReturn, yearsFromNow) + 
                        (monthlyContribution[0] * 0.3 * 12 * (Math.pow(1 + investmentReturn, yearsFromNow) - 1) / investmentReturn);
      const nonRegGrowth = currentNonReg * Math.pow(1 + investmentReturn, yearsFromNow) + 
                          (monthlyContribution[0] * 0.1 * 12 * (Math.pow(1 + investmentReturn, yearsFromNow) - 1) / investmentReturn);
      
      return {
        age,
        year: age - currentAge,
        rrsp: rrspGrowth / 1000,
        tfsa: tfsaGrowth / 1000,
        nonReg: nonRegGrowth / 1000,
        totalAssets: (rrspGrowth + tfsaGrowth + nonRegGrowth) / 1000,
        withdrawal: 0,
        netAssets: (rrspGrowth + tfsaGrowth + nonRegGrowth) / 1000,
        phase: 'Growth'
      };
    }
    
    // Withdrawal phase (after retirement)
    const yearsIntoRetirement = age - retirementAge[0];
    const withdrawalRate = rrfWithdrawalRates[Math.min(age, 90)] || 0.2;
    
    // Calculate remaining assets after withdrawals
    const remainingRRSP = Math.max(0, 
      (currentRRSP * Math.pow(1 + investmentReturn, yearsToRetirement) * 0.6) * 
      Math.pow(1 - withdrawalRate, yearsIntoRetirement)
    );
    const remainingTFSA = Math.max(0,
      (currentTFSA * Math.pow(1 + investmentReturn, yearsToRetirement) * 0.4) * 
      Math.pow(1 - 0.04, yearsIntoRetirement) // 4% withdrawal from TFSA
    );
    const remainingNonReg = Math.max(0,
      (currentNonReg * Math.pow(1 + investmentReturn, yearsToRetirement) * 0.2) * 
      Math.pow(1 - 0.04, yearsIntoRetirement)
    );
    
    const totalWithdrawal = (remainingRRSP + remainingTFSA + remainingNonReg) * 0.04;
    
    return {
      age,
      year: age - currentAge,
      rrsp: remainingRRSP / 1000,
      tfsa: remainingTFSA / 1000,
      nonReg: remainingNonReg / 1000,
      totalAssets: (remainingRRSP + remainingTFSA + remainingNonReg) / 1000,
      withdrawal: totalWithdrawal / 1000,
      netAssets: (remainingRRSP + remainingTFSA + remainingNonReg - totalWithdrawal) / 1000,
      phase: 'Withdrawal'
    };
  });

  // Extended 50-year asset breakdown data (until assets reach zero)
  const extendedAssetData = Array.from({ length: 50 }, (_, i) => {
    const age = retirementAge[0] + i;
    const isRetired = age >= retirementAge[0];
    
    // Growth phase (before retirement)
    if (!isRetired) {
      const yearsFromNow = age - currentAge;
      const rrspGrowth = currentRRSP * Math.pow(1 + investmentReturn, yearsFromNow) + 
                        (monthlyContribution[0] * 0.6 * 12 * (Math.pow(1 + investmentReturn, yearsFromNow) - 1) / investmentReturn);
      const tfsaGrowth = currentTFSA * Math.pow(1 + investmentReturn, yearsFromNow) + 
                        (monthlyContribution[0] * 0.3 * 12 * (Math.pow(1 + investmentReturn, yearsFromNow) - 1) / investmentReturn);
      const nonRegGrowth = currentNonReg * Math.pow(1 + investmentReturn, yearsFromNow) + 
                          (monthlyContribution[0] * 0.1 * 12 * (Math.pow(1 + investmentReturn, yearsFromNow) - 1) / investmentReturn);
      
      return {
        age,
        year: age - currentAge,
        rrsp: Math.max(0, rrspGrowth),
        tfsa: Math.max(0, tfsaGrowth),
        nonReg: Math.max(0, nonRegGrowth),
        totalAssets: Math.max(0, rrspGrowth + tfsaGrowth + nonRegGrowth),
        rrspWithdrawal: 0,
        tfsaWithdrawal: 0,
        nonRegWithdrawal: 0,
        totalWithdrawal: 0,
        phase: 'Growth'
      };
    }
    
    // Withdrawal phase (after retirement)
    const yearsIntoRetirement = age - retirementAge[0];
    const withdrawalRate = rrfWithdrawalRates[Math.min(age, 90)] || 0.2;
    
    // Calculate previous year balances to determine withdrawals
    let prevRRSP = currentRRSP * Math.pow(1 + investmentReturn, yearsToRetirement) * 0.6;
    let prevTFSA = currentTFSA * Math.pow(1 + investmentReturn, yearsToRetirement) * 0.4;
    let prevNonReg = currentNonReg * Math.pow(1 + investmentReturn, yearsToRetirement) * 0.2;
    
    // Apply withdrawals for each year
    for (let year = 0; year < yearsIntoRetirement; year++) {
      const yearWithdrawalRate = rrfWithdrawalRates[Math.min(retirementAge[0] + year, 90)] || 0.2;
      prevRRSP = Math.max(0, prevRRSP * (1 + investmentReturn) * (1 - yearWithdrawalRate));
      prevTFSA = Math.max(0, prevTFSA * (1 + investmentReturn) * (1 - 0.04));
      prevNonReg = Math.max(0, prevNonReg * (1 + investmentReturn) * (1 - 0.04));
    }
    
    // Current year balances with growth
    const currentRRSP = Math.max(0, prevRRSP * (1 + investmentReturn));
    const currentTFSA = Math.max(0, prevTFSA * (1 + investmentReturn));
    const currentNonReg = Math.max(0, prevNonReg * (1 + investmentReturn));
    
    // Calculate withdrawals for this year
    const rrspWithdrawal = currentRRSP * withdrawalRate;
    const tfsaWithdrawal = currentTFSA * 0.04;
    const nonRegWithdrawal = currentNonReg * 0.04;
    
    // Remaining balances after withdrawals
    const remainingRRSP = Math.max(0, currentRRSP - rrspWithdrawal);
    const remainingTFSA = Math.max(0, currentTFSA - tfsaWithdrawal);
    const remainingNonReg = Math.max(0, currentNonReg - nonRegWithdrawal);
    
    return {
      age,
      year: age - currentAge,
      rrsp: remainingRRSP,
      tfsa: remainingTFSA,
      nonReg: remainingNonReg,
      totalAssets: remainingRRSP + remainingTFSA + remainingNonReg,
      rrspWithdrawal,
      tfsaWithdrawal,
      nonRegWithdrawal,
      totalWithdrawal: rrspWithdrawal + tfsaWithdrawal + nonRegWithdrawal,
      phase: 'Withdrawal'
    };
  }).filter((item, index) => {
    // Stop when all assets are essentially zero
    return item.totalAssets > 1000 || index < 30; // Show at least 30 years or until assets are depleted
  });

  // Chart data
  const incomeProjectionData = Array.from({ length: 25 }, (_, i) => {
    const age = retirementAge[0] + i;
    const withdrawalRate = rrfWithdrawalRates[Math.min(age, 90)] || 0.2;
    return {
      age,
      cpp: adjustedCPP / 1000,
      oas: age >= 65 ? adjustedOAS / 1000 : 0,
      rrsp: (totalRetirementSavings * withdrawalRate) / 1000,
      total: ((adjustedCPP + (age >= 65 ? adjustedOAS : 0) + totalRetirementSavings * withdrawalRate) / 1000)
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
              {/* Retirement Age Slider */}
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

              {/* Net Monthly Income Slider */}
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

              {/* Asset Duration Display */}
              <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-purple-900">Asset Funding Duration</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-purple-600 mb-1">
                        {yearsAssetsFunded.toFixed(1)} years
                      </p>
                      <p className="text-sm text-purple-700 font-medium">Assets Will Last</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-4xl font-bold text-indigo-600 mb-1">
                        {assetsFundedPercentage.toFixed(0)}%
                      </p>
                      <p className="text-sm text-indigo-700 font-medium">of Retirement Goal</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-white/60 rounded-lg">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Years in Retirement:</span>
                      <span className="font-medium">{yearsInRetirement} years</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-gray-600">Funding Status:</span>
                      <span className={`font-medium ${assetsFundedPercentage >= 100 ? 'text-green-600' : assetsFundedPercentage >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {assetsFundedPercentage >= 100 ? 'Fully Funded' : 
                         assetsFundedPercentage >= 75 ? 'Mostly Funded' : 'Underfunded'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Contribution Slider */}
              <div>
                <label className="text-sm font-medium mb-3 block">Monthly Contribution: ${monthlyContribution[0]}</label>
                <Slider
                  value={monthlyContribution}
                  onValueChange={setMonthlyContribution}
                  min={0}
                  max={3000}
                  step={100}
                  className="mb-2"
                />
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
                        <span className="text-sm text-muted-foreground">Retirement Age Factor</span>
                        <span className="text-sm font-medium">{(cppAdjustmentFactor * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span className="text-sm">Adjusted CPP</span>
                        <span className="text-sm">${adjustedCPP.toLocaleString()}</span>
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
                        <span className="text-sm text-muted-foreground">Deferral Factor</span>
                        <span className="text-sm font-medium">{(oasAdjustmentFactor * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span className="text-sm">Adjusted OAS</span>
                        <span className="text-sm">${adjustedOAS.toLocaleString()}</span>
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
                        <span className="text-sm">${pvAnnuity.toLocaleString()}</span>
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
                        <span className="text-sm font-medium">${(requiredTotalSavings / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Additional Needed</span>
                        <span className="text-sm font-medium">${(additionalSavingsNeeded / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span className="text-sm">Required Monthly Savings</span>
                        <span className="text-sm">${requiredMonthlySavings.toFixed(0)}</span>
                      </div>
                    </div>

                    {incomeGap > 0 && (
                      <div className="flex items-center space-x-1 text-orange-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Consider increasing contributions by ${(requiredMonthlySavings - monthlyContribution[0]).toFixed(0)}/month
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
