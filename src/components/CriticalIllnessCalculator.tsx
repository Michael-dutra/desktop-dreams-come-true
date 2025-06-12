
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Heart, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";

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

  // Calculate total need
  const totalAnnualNeed = medicalExpenses + caregivingCosts + lostIncome;
  const totalNeed = (totalAnnualNeed * recoveryYears[0]) + homeModifications + debtPayment + emergencyFund;
  const shortage = Math.max(0, totalNeed - currentCoverage);
  const surplus = Math.max(0, currentCoverage - totalNeed);
  const coveragePercentage = Math.min(100, (currentCoverage / totalNeed) * 100);

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
