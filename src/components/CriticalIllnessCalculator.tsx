import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Heart, DollarSign, TrendingUp, AlertTriangle, FileText } from "lucide-react";

export const CriticalIllnessCalculator = () => {
  const [income, setIncome] = useState(75000);
  const [recoveryYears, setRecoveryYears] = useState([3]);
  const [currentCoverage, setCurrentCoverage] = useState(50000);
  const [medicalExpenses, setMedicalExpenses] = useState(25000);
  const [caregivingCosts, setCaregivingCosts] = useState(15000);
  const [homeModifications, setHomeModifications] = useState(10000);
  const [lostIncome, setLostIncome] = useState(income * 0.7);
  const [debtPayment, setDebtPayment] = useState(20000);
  const [emergencyFund, setEmergencyFund] = useState(30000);
  const [showWriteUp, setShowWriteUp] = useState(false);

  // Calculate total need
  const totalAnnualNeed = medicalExpenses + caregivingCosts + lostIncome;
  const totalNeed = (totalAnnualNeed * recoveryYears[0]) + homeModifications + debtPayment + emergencyFund;
  const shortage = Math.max(0, totalNeed - currentCoverage);
  const surplus = Math.max(0, currentCoverage - totalNeed);
  const coveragePercentage = Math.min(100, (currentCoverage / totalNeed) * 100);

  const generateWriteUp = () => {
    const coverageStatus = shortage > 0 ? `shortfall of $${shortage.toLocaleString()}` : 
                          surplus > 0 ? `surplus of $${surplus.toLocaleString()}` : 'adequate coverage';
    
    return `Critical Illness Insurance Analysis Summary

Based on our comprehensive analysis of your potential critical illness financial needs, here are the key findings:

**Financial Impact Assessment:**
A critical illness could significantly impact your $${income.toLocaleString()} annual income. We've projected a ${recoveryYears[0]}-year recovery period, during which you may experience reduced income of approximately $${lostIncome.toLocaleString()} annually.

**Total Financial Need:**
Your total critical illness coverage need is $${totalNeed.toLocaleString()}, which includes:
- Medical treatment costs: $${(medicalExpenses * recoveryYears[0]).toLocaleString()} (over ${recoveryYears[0]} years)
- Caregiving support: $${(caregivingCosts * recoveryYears[0]).toLocaleString()} (over ${recoveryYears[0]} years)
- Lost income replacement: $${(lostIncome * recoveryYears[0]).toLocaleString()} (over ${recoveryYears[0]} years)
- Home modifications: $${homeModifications.toLocaleString()}
- Debt payment assistance: $${debtPayment.toLocaleString()}
- Emergency fund: $${emergencyFund.toLocaleString()}

**Coverage Analysis:**
You currently have $${currentCoverage.toLocaleString()} in critical illness coverage, representing ${coveragePercentage.toFixed(1)}% of your calculated need. This analysis reveals a ${coverageStatus}. ${shortage > 0 ? `Additional coverage would help ensure financial stability during a critical illness recovery period.` : surplus > 0 ? `Your current coverage exceeds your calculated needs, providing substantial financial protection.` : `Your current coverage aligns well with your calculated needs.`}

**Recommendations:**
${shortage > 0 ? `Consider increasing your critical illness coverage to provide comprehensive financial protection. Focus on coverage that pays a lump sum benefit to provide flexibility in how funds are used during recovery.` : `Review your coverage annually to ensure it continues to meet your evolving financial situation and healthcare needs.`}`;
  };

  const needsBreakdown = [
    { label: "Medical Treatment", amount: medicalExpenses * recoveryYears[0], color: "bg-red-500" },
    { label: "Caregiving Support", amount: caregivingCosts * recoveryYears[0], color: "bg-orange-500" },
    { label: "Lost Income", amount: lostIncome * recoveryYears[0], color: "bg-yellow-500" },
    { label: "Home Modifications", amount: homeModifications, color: "bg-blue-500" },
    { label: "Debt Payment", amount: debtPayment, color: "bg-purple-500" },
    { label: "Emergency Fund", amount: emergencyFund, color: "bg-green-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Get Write Up Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Critical Illness Calculator</h2>
        <Button 
          onClick={() => setShowWriteUp(!showWriteUp)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Get Write Up
        </Button>
      </div>

      {showWriteUp && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-lg">Client Report</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generateWriteUp()}
              readOnly
              className="min-h-[300px] text-sm"
            />
          </CardContent>
        </Card>
      )}

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Income & Recovery</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="income">Annual Income</Label>
              <Input
                id="income"
                type="number"
                value={income}
                onChange={(e) => {
                  const newIncome = parseInt(e.target.value) || 0;
                  setIncome(newIncome);
                  setLostIncome(newIncome * 0.7);
                }}
                className="text-lg font-semibold"
              />
            </div>
            <div>
              <Label>Recovery Period: {recoveryYears[0]} years</Label>
              <Slider
                value={recoveryYears}
                onValueChange={setRecoveryYears}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Medical & Care Costs</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="medical">Annual Medical Expenses</Label>
              <Input
                id="medical"
                type="number"
                value={medicalExpenses}
                onChange={(e) => setMedicalExpenses(parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="caregiving">Annual Caregiving Costs</Label>
              <Input
                id="caregiving"
                type="number"
                value={caregivingCosts}
                onChange={(e) => setCaregivingCosts(parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="modifications">Home Modifications</Label>
              <Input
                id="modifications"
                type="number"
                value={homeModifications}
                onChange={(e) => setHomeModifications(parseInt(e.target.value) || 0)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Financial Impact</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="lostIncome">Annual Lost Income</Label>
              <Input
                id="lostIncome"
                type="number"
                value={lostIncome}
                onChange={(e) => setLostIncome(parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="debt">Debt Payment</Label>
              <Input
                id="debt"
                type="number"
                value={debtPayment}
                onChange={(e) => setDebtPayment(parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="emergency">Emergency Fund</Label>
              <Input
                id="emergency"
                type="number"
                value={emergencyFund}
                onChange={(e) => setEmergencyFund(parseInt(e.target.value) || 0)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coverage Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Coverage Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="current">Current Coverage</Label>
              <Input
                id="current"
                type="number"
                value={currentCoverage}
                onChange={(e) => setCurrentCoverage(parseInt(e.target.value) || 0)}
                className="text-lg font-semibold"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Coverage Progress</span>
                <span>{coveragePercentage.toFixed(1)}%</span>
              </div>
              <Progress value={coveragePercentage} className="h-3" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Need</p>
                <p className="text-lg font-bold">${totalNeed.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Current Coverage</p>
                <p className="text-lg font-bold text-blue-600">${currentCoverage.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {shortage > 0 ? "Shortage" : "Surplus"}
                </p>
                <p className={`text-lg font-bold ${shortage > 0 ? "text-red-600" : "text-green-600"}`}>
                  ${(shortage || surplus).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Needs Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {needsBreakdown.map((need) => (
                <div key={need.label} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">{need.label}</span>
                    <span className="text-sm font-semibold">${need.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${need.color} transition-all duration-1000 ease-out`}
                      style={{
                        width: `${(need.amount / totalNeed) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-red-600">Medical Costs</p>
                <p className="text-xl font-bold text-red-700">
                  ${(medicalExpenses * recoveryYears[0]).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-orange-600">Income Impact</p>
                <p className="text-xl font-bold text-orange-700">
                  ${(lostIncome * recoveryYears[0]).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600">Total Need</p>
                <p className="text-xl font-bold text-blue-700">${totalNeed.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-r ${shortage > 0 ? 'from-red-50 to-red-100 border-red-200' : 'from-green-50 to-green-100 border-green-200'}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className={`h-8 w-8 ${shortage > 0 ? 'text-red-600' : 'text-green-600'}`} />
              <div>
                <p className={`text-sm ${shortage > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {shortage > 0 ? 'Coverage Gap' : 'Well Covered'}
                </p>
                <p className={`text-xl font-bold ${shortage > 0 ? 'text-red-700' : 'text-green-700'}`}>
                  ${(shortage || surplus).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
