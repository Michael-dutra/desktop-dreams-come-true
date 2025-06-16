
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PiggyBank } from "lucide-react";
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

  const currentAge = 25;
  const yearsToRetirement = retirementAge[0] - currentAge;
  const monthlyContribution = 500;
  const rateOfReturn = 0.05;
  const lifeExpectancy = 95;
  const yearsInRetirement = lifeExpectancy - retirementAge[0];
  
  // Calculate future values at retirement
  const calculateFutureValue = (currentValue: number) => {
    let futureValue = currentValue;
    for (let i = 0; i < yearsToRetirement; i++) {
      futureValue = futureValue * (1 + rateOfReturn) + (monthlyContribution * 12 * 0.33); // Assume 1/3 goes to each account
    }
    return futureValue;
  };

  const futureRRSP = calculateFutureValue(currentRRSP);
  const futureTFSA = calculateFutureValue(currentTFSA);
  const futureNonReg = calculateFutureValue(currentNonReg);
  const totalFutureSavings = futureRRSP + futureTFSA + futureNonReg;

  const annualIncomeNeeded = monthlyIncomeNeeded[0] * 12;
  const totalRetirementNeeded = annualIncomeNeeded * yearsInRetirement;
  
  // Calculate withdrawals based on allocation
  const annualRrspWithdrawal = annualIncomeNeeded * (rrspAllocation[0] / 100);
  const annualTfsaWithdrawal = annualIncomeNeeded * (tfsaAllocation[0] / 100);
  const annualNonRegWithdrawal = annualIncomeNeeded * (nonRegAllocation[0] / 100);

  // Calculate how long each account will last
  const rrspDuration = futureRRSP / annualRrspWithdrawal;
  const tfsaDuration = futureTFSA / annualTfsaWithdrawal;
  const nonRegDuration = futureNonReg / annualNonRegWithdrawal;

  const fundingPercentage = Math.min(100, (totalFutureSavings / totalRetirementNeeded) * 100);
  const fundingStatus = fundingPercentage >= 100 ? "Fully Funded" : "Underfunded";

  // Generate year-by-year breakdown
  const generateYearlyData = (): YearlyData[] => {
    const data: YearlyData[] = [];
    let rrspBalance = futureRRSP;
    let tfsaBalance = futureTFSA;
    let nonRegBalance = futureNonReg;

    for (let year = 0; year <= 56; year++) {
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
  
  // Calculate tax optimization
  const estimatedLifetimeTaxes = yearlyData.reduce((total, year) => {
    const taxableWithdrawal = year.rrspWithdrawal + (year.nonRegWithdrawal * 0.5); // Assume 50% of non-reg is taxable
    return total + (taxableWithdrawal * 0.25); // Assume 25% tax rate
  }, 0);

  // Chart data for 30-year breakdown
  const chartData = yearlyData.slice(0, 30).map(year => ({
    age: year.age,
    rrsp: year.rrspBalance,
    tfsa: year.tfsaBalance,
    nonReg: year.nonRegBalance,
    totalAssets: year.totalAssets,
    withdrawal: year.totalWithdrawal
  }));

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5" />
            Retirement Planning Analysis
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="controls" className="space-y-4">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="tax">Tax Analysis</TabsTrigger>
            <TabsTrigger value="breakdown">Asset Breakdown</TabsTrigger>
            <TabsTrigger value="cpp">CPP/OAS</TabsTrigger>
            <TabsTrigger value="rrif">RRIF Schedule</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="controls" className="space-y-6">
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
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Asset Funding Duration</h4>
                  <p className="text-2xl font-bold">{yearsInRetirement} years</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Assets Will Last</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {fundingPercentage.toFixed(0)}%
                    </div>
                    <p className="text-lg">of Retirement Goal</p>
                    <div className="mt-4 space-y-2">
                      <p><strong>Years in Retirement:</strong> {yearsInRetirement} years</p>
                      <p><strong>Funding Status:</strong> {fundingStatus}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Funding Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>RRSP</span>
                    <div className="text-right">
                      <div className="font-bold">{rrspAllocation[0]}%</div>
                      <div className="text-sm text-gray-600">Funds {rrspDuration.toFixed(1)} yrs</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>TFSA</span>
                    <div className="text-right">
                      <div className="font-bold">{tfsaAllocation[0]}%</div>
                      <div className="text-sm text-gray-600">Funds {tfsaDuration.toFixed(1)} yrs</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Non-Reg</span>
                    <div className="text-right">
                      <div className="font-bold">{nonRegAllocation[0]}%</div>
                      <div className="text-sm text-gray-600">Funds {nonRegDuration.toFixed(1)} yrs</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Retirement Readiness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(totalFutureSavings)}
                    </div>
                    <p className="text-sm text-gray-600">Projected Savings</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(annualIncomeNeeded)}
                    </div>
                    <p className="text-sm text-gray-600">Annual Income</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(Math.max(0, totalRetirementNeeded - totalFutureSavings))}
                    </div>
                    <p className="text-sm text-gray-600">Income Gap</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tax" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Optimization Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Estimated Total Taxes Owed (lifetime from drawdowns)
                  </h3>
                  <div className="text-3xl font-bold text-red-600">
                    {formatCurrencyFull(estimatedLifetimeTaxes)}
                  </div>
                </div>
                <p className="text-center text-gray-600">
                  Balanced withdrawals help manage steady tax rates over retirement.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-6">
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
                  totalAssets: { label: "Total Assets", color: "#8b5cf6" },
                  withdrawal: { label: "Annual Withdrawal", color: "#ef4444" }
                }} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="age" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="rrsp" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="tfsa" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="nonReg" stroke="#f59e0b" strokeWidth={2} />
                      <Line type="monotone" dataKey="totalAssets" stroke="#8b5cf6" strokeWidth={3} />
                      <Bar dataKey="withdrawal" fill="#ef4444" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cpp" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>CPP/OAS Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">CPP Projection</h4>
                    <p className="text-2xl font-bold">$1,200/month</p>
                    <p className="text-sm text-gray-600">Starting at age 65</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">OAS Projection</h4>
                    <p className="text-2xl font-bold">$700/month</p>
                    <p className="text-sm text-gray-600">Starting at age 65</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rrif" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>RRIF Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  RRSP must be converted to RRIF by age 71. Minimum withdrawal rates apply.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Age 71:</strong> 5.28% minimum</div>
                  <div><strong>Age 75:</strong> 5.82% minimum</div>
                  <div><strong>Age 80:</strong> 6.82% minimum</div>
                  <div><strong>Age 85:</strong> 8.51% minimum</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Savings Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Current Monthly Contribution</h4>
                    <p className="text-2xl font-bold">{formatCurrency(monthlyContribution)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Recommended Rate of Return</h4>
                    <p className="text-2xl font-bold">{(rateOfReturn * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
