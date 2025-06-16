
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PiggyBank, Plus, Minus } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";

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
}

export const RetirementDetailDialog = ({ isOpen, onClose }: RetirementDetailDialogProps) => {
  const { assets } = useFinancialData();
  
  // Get current account values from context
  const rrspAsset = assets.find(asset => asset.name === "RRSP");
  const tfsaAsset = assets.find(asset => asset.name === "TFSA");
  const nonRegAsset = assets.find(asset => asset.name === "Non-Registered");
  
  const currentRRSP = rrspAsset?.value || 52000;
  const currentTFSA = tfsaAsset?.value || 38000;
  const currentNonReg = nonRegAsset?.value || 25000;
  
  const [retirementAge, setRetirementAge] = useState([65]);
  const [monthlyIncomeNeeded, setMonthlyIncomeNeeded] = useState([4500]);
  const [rrspAllocation, setRrspAllocation] = useState([60]);
  const [tfsaAllocation, setTfsaAllocation] = useState([30]);
  const [nonRegAllocation, setNonRegAllocation] = useState([10]);

  // CPP/OAS Calculator State
  const [cppStartAge, setCppStartAge] = useState(65);
  const [oasStartAge, setOasStartAge] = useState(65);
  const [cppEligibilityPercent, setCppEligibilityPercent] = useState(85);
  const [oasEligibilityPercent, setOasEligibilityPercent] = useState(100);

  const currentAge = 25;
  const yearsToRetirement = retirementAge[0] - currentAge;
  const monthlyContribution = 500;
  const rateOfReturn = 0.05;
  const lifeExpectancy = 95;
  const yearsInRetirement = lifeExpectancy - retirementAge[0];
  
  // Calculate future values at retirement with proper compound growth
  const calculateFutureValue = (currentValue: number, allocation: number) => {
    let futureValue = currentValue;
    const monthlyContributionToAccount = (monthlyContribution * 12) * (allocation / 100);
    
    for (let i = 0; i < yearsToRetirement; i++) {
      futureValue = futureValue * (1 + rateOfReturn) + monthlyContributionToAccount;
    }
    return futureValue;
  };

  const futureRRSP = calculateFutureValue(currentRRSP, 33.33);
  const futureTFSA = calculateFutureValue(currentTFSA, 33.33);
  const futureNonReg = calculateFutureValue(currentNonReg, 33.34);
  const totalFutureSavings = futureRRSP + futureTFSA + futureNonReg;

  const annualIncomeNeeded = monthlyIncomeNeeded[0] * 12;
  const totalRetirementNeeded = annualIncomeNeeded * yearsInRetirement;
  
  // Calculate withdrawals based on allocation
  const annualRrspWithdrawal = annualIncomeNeeded * (rrspAllocation[0] / 100);
  const annualTfsaWithdrawal = annualIncomeNeeded * (tfsaAllocation[0] / 100);
  const annualNonRegWithdrawal = annualIncomeNeeded * (nonRegAllocation[0] / 100);

  // Calculate how long each account will last
  const rrspDuration = annualRrspWithdrawal > 0 ? futureRRSP / annualRrspWithdrawal : Infinity;
  const tfsaDuration = annualTfsaWithdrawal > 0 ? futureTFSA / annualTfsaWithdrawal : Infinity;
  const nonRegDuration = annualNonRegWithdrawal > 0 ? futureNonReg / annualNonRegWithdrawal : Infinity;

  const fundingPercentage = Math.min(100, (totalFutureSavings / totalRetirementNeeded) * 100);
  const fundingStatus = fundingPercentage >= 100 ? "Fully Funded" : "Underfunded";

  // Generate year-by-year breakdown
  const generateYearlyData = (): YearlyData[] => {
    const data: YearlyData[] = [];
    let rrspBalance = futureRRSP;
    let tfsaBalance = futureTFSA;
    let nonRegBalance = futureNonReg;

    for (let year = 0; year <= 30; year++) {
      const age = retirementAge[0] + year;
      
      let rrspWithdrawal = 0;
      let tfsaWithdrawal = 0;
      let nonRegWithdrawal = 0;

      if (rrspBalance > 0) {
        rrspWithdrawal = Math.min(rrspBalance, annualRrspWithdrawal);
        rrspBalance -= rrspWithdrawal;
      }

      if (tfsaBalance > 0) {
        tfsaWithdrawal = Math.min(tfsaBalance, annualTfsaWithdrawal);
        tfsaBalance -= tfsaWithdrawal;
      }

      if (nonRegBalance > 0) {
        nonRegWithdrawal = Math.min(nonRegBalance, annualNonRegWithdrawal);
        nonRegBalance -= nonRegWithdrawal;
      }

      const totalWithdrawal = rrspWithdrawal + tfsaWithdrawal + nonRegWithdrawal;
      const totalAssets = rrspBalance + tfsaBalance + nonRegBalance;

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
        totalWithdrawal
      });

      if (totalAssets <= 0) break;
    }

    return data;
  };

  const yearlyData = generateYearlyData();
  
  // Calculate actual asset duration based on when assets reach zero
  const calculateActualAssetDuration = (): number => {
    if (annualIncomeNeeded === 0) return Infinity;
    
    // Find the last year where total assets > 0
    let lastYearWithAssets = 0;
    for (const year of yearlyData) {
      if (year.totalAssets > 0) {
        lastYearWithAssets = year.year;
      }
    }
    
    // If we have withdrawals in the final year, add partial year calculation
    const finalYear = yearlyData[lastYearWithAssets];
    if (finalYear && finalYear.totalWithdrawal > 0) {
      const remainingAssets = finalYear.totalAssets;
      const partialYear = remainingAssets / annualIncomeNeeded;
      return lastYearWithAssets + partialYear;
    }
    
    return lastYearWithAssets;
  };

  const actualAssetDuration = calculateActualAssetDuration();
  
  // Calculate tax optimization
  const estimatedLifetimeTaxes = yearlyData.reduce((total, year) => {
    const taxableWithdrawal = year.rrspWithdrawal + (year.nonRegWithdrawal * 0.5);
    return total + (taxableWithdrawal * 0.25);
  }, 0);

  // Chart data for asset depletion visualization
  const assetDepletionData = yearlyData.slice(0, 10).map(year => ({
    age: year.age,
    year: `+${year.year}yr`,
    rrsp: year.rrspBalance,
    tfsa: year.tfsaBalance,
    nonReg: year.nonRegBalance,
    totalAssets: year.totalAssets,
    withdrawal: year.totalWithdrawal
  }));

  // Area chart data for 30-year breakdown
  const areaChartData = yearlyData.map(year => ({
    age: year.age,
    rrsp: year.rrspBalance,
    tfsa: year.tfsaBalance,
    nonReg: year.nonRegBalance,
    totalAssets: year.totalAssets
  }));

  // Pie chart data for income sources
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

  // CPP/OAS Calculation Functions with eligibility percentage
  const calculateCPP = (startAge: number, eligibilityPercent: number) => {
    const maxCPP = 1308; // Maximum CPP at age 65 (2024)
    const baseAmount = maxCPP * (eligibilityPercent / 100);
    
    if (startAge < 65) {
      // Early penalty: 0.6% per month before 65
      const monthsEarly = (65 - startAge) * 12;
      const penalty = monthsEarly * 0.006;
      return baseAmount * (1 - penalty);
    } else if (startAge > 65) {
      // Delayed credit: 0.7% per month after 65, max at 70
      const monthsLate = Math.min((startAge - 65) * 12, 60); // Max 60 months
      const bonus = monthsLate * 0.007;
      return baseAmount * (1 + bonus);
    }
    return baseAmount;
  };

  const calculateOAS = (startAge: number, eligibilityPercent: number) => {
    const maxOAS = 707; // Maximum OAS at age 65 (2024)
    const baseAmount = maxOAS * (eligibilityPercent / 100);
    
    if (startAge < 65) {
      return 0; // OAS cannot be taken before 65
    } else if (startAge > 65) {
      // Delayed credit: 0.6% per month after 65, max at 70
      const monthsLate = Math.min((startAge - 65) * 12, 60); // Max 60 months
      const bonus = monthsLate * 0.006;
      return baseAmount * (1 + bonus);
    }
    return baseAmount;
  };

  const cppAmount = calculateCPP(cppStartAge, cppEligibilityPercent);
  const oasAmount = calculateOAS(oasStartAge, oasEligibilityPercent);

  const totalAllocation = rrspAllocation[0] + tfsaAllocation[0] + nonRegAllocation[0];

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
          {/* Retirement Planning Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Retirement Planning Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    Net Monthly Income Needed: {formatCurrency(monthlyIncomeNeeded[0])}
                  </label>
                  <Slider
                    value={monthlyIncomeNeeded}
                    onValueChange={setMonthlyIncomeNeeded}
                    min={2000}
                    max={8000}
                    step={100}
                  />
                </div>
              </div>

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
            </CardContent>
          </Card>

          {/* Enhanced Retirement Duration & Account Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Enhanced Retirement Duration */}
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

            {/* Account Funding Analysis */}
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

          {/* Retirement Readiness Metrics */}
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

          {/* Tax Optimization Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Tax Optimization Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  Estimated Total Taxes Owed (lifetime from drawdowns)
                </h3>
                <div className="text-4xl font-bold text-red-600">
                  {formatCurrencyFull(estimatedLifetimeTaxes)}
                </div>
                <p className="text-gray-600 mt-2">
                  Balanced withdrawals help manage steady tax rates over retirement.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 30-Year Asset & Withdrawal Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>30-Year Asset & Withdrawal Breakdown</CardTitle>
              <p className="text-sm text-gray-600">
                Detailed projection showing asset growth, withdrawal amounts, and remaining balances over 30 years
              </p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                rrsp: { label: "RRSP", color: "#3b82f6" },
                tfsa: { label: "TFSA", color: "#10b981" },
                nonReg: { label: "Non-Registered", color: "#f59e0b" },
                totalAssets: { label: "Total Assets", color: "#8b5cf6" }
              }} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaChartData}>
                    <XAxis dataKey="age" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="rrsp" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="tfsa" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="nonReg" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* CPP/OAS Calculators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CPP Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>CPP Calculator</CardTitle>
                <p className="text-sm text-gray-600">
                  Calculate your Canada Pension Plan benefits
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    CPP Start Age: {cppStartAge}
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCppStartAge(Math.max(60, cppStartAge - 1))}
                      disabled={cppStartAge <= 60}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-16 text-center font-semibold">{cppStartAge}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCppStartAge(Math.min(70, cppStartAge + 1))}
                      disabled={cppStartAge >= 70}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    CPP Eligibility: {cppEligibilityPercent}%
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCppEligibilityPercent(Math.max(0, cppEligibilityPercent - 5))}
                      disabled={cppEligibilityPercent <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-16 text-center font-semibold">{cppEligibilityPercent}%</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCppEligibilityPercent(Math.min(100, cppEligibilityPercent + 5))}
                      disabled={cppEligibilityPercent >= 100}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      ${Math.round(cppAmount).toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-600">Monthly CPP Benefit</div>
                    {cppStartAge < 65 && (
                      <div className="text-xs text-red-600 mt-1">
                        Early withdrawal penalty applied
                      </div>
                    )}
                    {cppStartAge > 65 && (
                      <div className="text-xs text-green-600 mt-1">
                        Delayed retirement bonus applied
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* OAS Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>OAS Calculator</CardTitle>
                <p className="text-sm text-gray-600">
                  Calculate your Old Age Security benefits
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    OAS Start Age: {oasStartAge}
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setOasStartAge(Math.max(65, oasStartAge - 1))}
                      disabled={oasStartAge <= 65}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-16 text-center font-semibold">{oasStartAge}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setOasStartAge(Math.min(70, oasStartAge + 1))}
                      disabled={oasStartAge >= 70}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    OAS Eligibility: {oasEligibilityPercent}%
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setOasEligibilityPercent(Math.max(0, oasEligibilityPercent - 5))}
                      disabled={oasEligibilityPercent <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-16 text-center font-semibold">{oasEligibilityPercent}%</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setOasEligibilityPercent(Math.min(100, oasEligibilityPercent + 5))}
                      disabled={oasEligibilityPercent >= 100}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${Math.round(oasAmount).toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600">Monthly OAS Benefit</div>
                    {oasStartAge < 65 && (
                      <div className="text-xs text-red-600 mt-1">
                        OAS cannot start before age 65
                      </div>
                    )}
                    {oasStartAge > 65 && (
                      <div className="text-xs text-green-600 mt-1">
                        Delayed retirement bonus applied
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Year-by-Year Account Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Year-by-Year Account Breakdown</CardTitle>
              <p className="text-sm text-gray-600">
                Detailed annual breakdown showing each account balance and withdrawals until assets reach zero
              </p>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Age</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>RRSP Balance</TableHead>
                      <TableHead>RRSP Withdrawal</TableHead>
                      <TableHead>TFSA Balance</TableHead>
                      <TableHead>TFSA Withdrawal</TableHead>
                      <TableHead>Non-Reg Balance</TableHead>
                      <TableHead>Non-Reg Withdrawal</TableHead>
                      <TableHead>Total Assets</TableHead>
                      <TableHead>Total Withdrawal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearlyData.map((year, index) => (
                      <TableRow key={index}>
                        <TableCell>{year.age}</TableCell>
                        <TableCell>{year.year}</TableCell>
                        <TableCell>{formatCurrencyFull(year.rrspBalance)}</TableCell>
                        <TableCell>{year.rrspWithdrawal > 0 ? formatCurrencyFull(year.rrspWithdrawal) : "-"}</TableCell>
                        <TableCell>{formatCurrencyFull(year.tfsaBalance)}</TableCell>
                        <TableCell>{year.tfsaWithdrawal > 0 ? formatCurrencyFull(year.tfsaWithdrawal) : "-"}</TableCell>
                        <TableCell>{formatCurrencyFull(year.nonRegBalance)}</TableCell>
                        <TableCell>{year.nonRegWithdrawal > 0 ? formatCurrencyFull(year.nonRegWithdrawal) : "-"}</TableCell>
                        <TableCell className="font-bold">{formatCurrencyFull(year.totalAssets)}</TableCell>
                        <TableCell className="font-bold">{formatCurrencyFull(year.totalWithdrawal)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Growth and Withdrawal Phase Indicators */}
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
