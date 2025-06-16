import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Banknote,
  Percent,
  TrendingUp,
  Calendar,
  Settings,
  HelpCircle,
  Plus,
  X,
  FileText,
  Edit,
  Save,
  Copy,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import {
  calculateFutureValue,
  calculateAnnuityPayment,
  calculateYearsToTarget,
} from "@/utils/retirementCalculations";
import { EditableField } from "@/components/EditableField";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface RetirementDetails {
  id: string;
  type: string;
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  annualContribution: number;
  expectedReturnRate: number;
  inflationRate: number;
  incomeReplacementRate: number;
  lifeExpectancy: number;
}

interface RetirementDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RetirementDetailDialog = ({
  isOpen,
  onClose,
}: RetirementDetailDialogProps) => {
  const { toast } = useToast();

  // Summary dialog state
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [selectedRetirementSummary, setSelectedRetirementSummary] = useState<{
    retirement: RetirementDetails;
    projectedSavings: number;
    annualWithdrawal: number;
    yearsToTarget: number;
    totalContributions: number;
  } | null>(null);

  // Edit mode state for write-up
  const [isEditingWriteUp, setIsEditingWriteUp] = useState(false);
  const [editableWriteUp, setEditableWriteUp] = useState("");

  // Original retirement details
  const [personalRetirementDetails, setPersonalRetirementDetails] = useState({
    id: "personal-retirement",
    type: "Personal Retirement",
    currentAge: 35,
    retirementAge: 65,
    currentSavings: 100000,
    annualContribution: 12000,
    expectedReturnRate: 7.0,
    inflationRate: 2.0,
    incomeReplacementRate: 80.0,
    lifeExpectancy: 90,
  });

  const [spouseRetirementDetails, setSpouseRetirementDetails] = useState({
    id: "spouse-retirement",
    type: "Spouse Retirement",
    currentAge: 33,
    retirementAge: 63,
    currentSavings: 80000,
    annualContribution: 10000,
    expectedReturnRate: 6.5,
    inflationRate: 2.0,
    incomeReplacementRate: 75.0,
    lifeExpectancy: 90,
  });

  // New retirements state
  const [customRetirements, setCustomRetirements] = useState<RetirementDetails[]>([]);

  // Add new retirement functionality - automatically triggered on selection
  const handleRetirementTypeSelect = (retirementType: string) => {
    if (!retirementType) return;

    const newId = `custom-${Date.now()}`;
    const newRetirement: RetirementDetails = {
      id: newId,
      type: retirementType,
      currentAge: 30,
      retirementAge: 65,
      currentSavings: 50000,
      annualContribution: 5000,
      expectedReturnRate: 6.0,
      inflationRate: 2.0,
      incomeReplacementRate: 70.0,
      lifeExpectancy: 85,
    };

    setCustomRetirements([...customRetirements, newRetirement]);
  };

  const updateCustomRetirement = (id: string, updates: Partial<RetirementDetails>) => {
    setCustomRetirements(customRetirements.map(retirement =>
      retirement.id === id ? { ...retirement, ...updates } : retirement
    ));
  };

  const removeCustomRetirement = (id: string) => {
    setCustomRetirements(customRetirements.filter(retirement => retirement.id !== id));
  };

  // Calculation functions
  const calculateRetirementDetails = (retirementDetails: RetirementDetails) => {
    const {
      currentAge,
      retirementAge,
      currentSavings,
      annualContribution,
      expectedReturnRate,
      inflationRate,
      incomeReplacementRate,
      lifeExpectancy,
    } = retirementDetails;

    // Calculate the number of years until retirement
    const yearsToRetirement = retirementAge - currentAge;

    // Calculate future value of current savings
    const futureValueOfSavings = calculateFutureValue(
      currentSavings,
      expectedReturnRate / 100,
      yearsToRetirement
    );

    // Calculate future value of annual contributions
    const futureValueOfContributions = calculateFutureValue(
      annualContribution,
      expectedReturnRate / 100,
      yearsToRetirement,
      true // isAnnuity
    );

    // Calculate total projected savings at retirement
    const projectedSavings = futureValueOfSavings + futureValueOfContributions;

    // Calculate annual withdrawal needed to maintain income
    const annualWithdrawal = calculateAnnuityPayment(
      projectedSavings,
      (expectedReturnRate - inflationRate) / 100,
      lifeExpectancy - retirementAge
    );

    // Calculate years to reach target savings
    const yearsToTarget = calculateYearsToTarget(
      currentSavings,
      annualContribution,
      expectedReturnRate / 100,
      projectedSavings
    );

    // Calculate total contributions until retirement
    const totalContributions = annualContribution * yearsToRetirement;

    return {
      projectedSavings,
      annualWithdrawal,
      yearsToTarget,
      totalContributions,
    };
  };

  const getIconForType = (type: string) => {
    switch (type.toLowerCase()) {
      case "personal retirement":
        return Banknote;
      case "spouse retirement":
        return Banknote;
      case "401k":
        return TrendingUp;
      case "ira":
        return TrendingUp;
      case "pension":
        return Calendar;
      default:
        return HelpCircle;
    }
  };

  const removeRetirement = (retirementId: string) => {
    if (retirementId === "personal-retirement") {
      // Handle personal retirement removal if needed - for now just console log
      console.log("Cannot remove default personal retirement");
    } else if (retirementId === "spouse-retirement") {
      // Handle spouse retirement removal if needed - for now just console log
      console.log("Cannot remove default spouse retirement");
    } else {
      removeCustomRetirement(retirementId);
    }
  };

  const handleCopyReport = async () => {
    try {
      await navigator.clipboard.writeText(editableWriteUp);
      toast({
        title: "Report copied",
        description: "The retirement report has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy the report to clipboard.",
        variant: "destructive",
      });
    }
  };

  const generateRetirementSummary = (retirement: RetirementDetails) => {
    const {
      projectedSavings,
      annualWithdrawal,
      yearsToTarget,
      totalContributions,
    } = calculateRetirementDetails(retirement);

    // Generate initial write-up content
    const initialWriteUp = `Your ${retirement.type} is projected to have $${projectedSavings.toLocaleString()} at retirement.

Current Age: ${retirement.currentAge}
Retirement Age: ${retirement.retirementAge}
Current Savings: $${retirement.currentSavings.toLocaleString()}
Annual Contribution: $${retirement.annualContribution.toLocaleString()}
Expected Return Rate: ${retirement.expectedReturnRate}%
Inflation Rate: ${retirement.inflationRate}%
Income Replacement Rate: ${retirement.incomeReplacementRate}%
Life Expectancy: ${retirement.lifeExpectancy}

Projected Savings at Retirement: $${projectedSavings.toLocaleString()}
Annual Withdrawal Needed: $${annualWithdrawal.toLocaleString()}
Years to Reach Target: ${yearsToTarget}
Total Contributions: $${totalContributions.toLocaleString()}

This projection assumes consistent contribution and return rates. Actual results may vary based on market conditions and personal circumstances.`;

    setEditableWriteUp(initialWriteUp);
    setSelectedRetirementSummary({
      retirement,
      projectedSavings,
      annualWithdrawal,
      yearsToTarget,
      totalContributions,
    });
    setSummaryDialogOpen(true);
    setIsEditingWriteUp(false);
  };

  const handleSaveWriteUp = () => {
    setIsEditingWriteUp(false);
    toast({
      title: "Write-up saved",
      description: "Your retirement report has been updated successfully.",
    });
  };

  const handleCancelEdit = () => {
    setIsEditingWriteUp(false);
    // Reset to original content if needed
    if (selectedRetirementSummary) {
      generateRetirementSummary(selectedRetirementSummary.retirement);
    }
  };

  const renderRetirementCard = (retirement: RetirementDetails) => {
    const Icon = getIconForType(retirement.type);
    const {
      projectedSavings,
      annualWithdrawal,
      yearsToTarget,
      totalContributions,
    } = calculateRetirementDetails(retirement);

    const chartData = [
      { name: "Projected Savings", value: projectedSavings },
      { name: "Annual Withdrawal", value: annualWithdrawal },
    ];

    const chartConfig = {
      savings: { label: "Projected Savings", color: "#ef4444" },
      withdrawal: { label: "Annual Withdrawal", color: "#10b981" },
    };

    return (
      <Card key={retirement.id}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl">
            <div className="flex items-center gap-2">
              <Icon className="w-6 h-6" />
              {retirement.type}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => generateRetirementSummary(retirement)}
                className="text-blue-600 hover:bg-blue-50 p-1"
              >
                <FileText className="w-4 h-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove the {retirement.type} from your retirements. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => removeRetirement(retirement.id)} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 p-4 rounded-lg bg-gray-50">
            <h4 className="font-semibold mb-3">Retirement Details</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium">Current Age</Label>
                <Input
                  type="number"
                  value={retirement.currentAge}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (retirement.id === "personal-retirement") {
                      setPersonalRetirementDetails(prev => ({ ...prev, currentAge: value }));
                    } else if (retirement.id === "spouse-retirement") {
                      setSpouseRetirementDetails(prev => ({ ...prev, currentAge: value }));
                    } else {
                      updateCustomRetirement(retirement.id, { currentAge: value });
                    }
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Retirement Age</Label>
                <Input
                  type="number"
                  value={retirement.retirementAge}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (retirement.id === "personal-retirement") {
                      setPersonalRetirementDetails(prev => ({ ...prev, retirementAge: value }));
                    } else if (retirement.id === "spouse-retirement") {
                      setSpouseRetirementDetails(prev => ({ ...prev, retirementAge: value }));
                    } else {
                      updateCustomRetirement(retirement.id, { retirementAge: value });
                    }
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Current Savings</Label>
                <Input
                  type="number"
                  value={retirement.currentSavings}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (retirement.id === "personal-retirement") {
                      setPersonalRetirementDetails(prev => ({ ...prev, currentSavings: value }));
                    } else if (retirement.id === "spouse-retirement") {
                      setSpouseRetirementDetails(prev => ({ ...prev, currentSavings: value }));
                    } else {
                      updateCustomRetirement(retirement.id, { currentSavings: value });
                    }
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Annual Contribution</Label>
                <Input
                  type="number"
                  value={retirement.annualContribution}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (retirement.id === "personal-retirement") {
                      setPersonalRetirementDetails(prev => ({ ...prev, annualContribution: value }));
                    } else if (retirement.id === "spouse-retirement") {
                      setSpouseRetirementDetails(prev => ({ ...prev, annualContribution: value }));
                    } else {
                      updateCustomRetirement(retirement.id, { annualContribution: value });
                    }
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Expected Return Rate (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={retirement.expectedReturnRate}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (retirement.id === "personal-retirement") {
                      setPersonalRetirementDetails(prev => ({ ...prev, expectedReturnRate: value }));
                    } else if (retirement.id === "spouse-retirement") {
                      setSpouseRetirementDetails(prev => ({ ...prev, expectedReturnRate: value }));
                    } else {
                      updateCustomRetirement(retirement.id, { expectedReturnRate: value });
                    }
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Inflation Rate (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={retirement.inflationRate}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (retirement.id === "personal-retirement") {
                      setPersonalRetirementDetails(prev => ({ ...prev, inflationRate: value }));
                    } else if (retirement.id === "spouse-retirement") {
                      setSpouseRetirementDetails(prev => ({ ...prev, inflationRate: value }));
                    } else {
                      updateCustomRetirement(retirement.id, { inflationRate: value });
                    }
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Income Replacement Rate (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={retirement.incomeReplacementRate}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (retirement.id === "personal-retirement") {
                      setPersonalRetirementDetails(prev => ({ ...prev, incomeReplacementRate: value }));
                    } else if (retirement.id === "spouse-retirement") {
                      setSpouseRetirementDetails(prev => ({ ...prev, incomeReplacementRate: value }));
                    } else {
                      updateCustomRetirement(retirement.id, { incomeReplacementRate: value });
                    }
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Life Expectancy</Label>
                <Input
                  type="number"
                  value={retirement.lifeExpectancy}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (retirement.id === "personal-retirement") {
                      setPersonalRetirementDetails(prev => ({ ...prev, lifeExpectancy: value }));
                    } else if (retirement.id === "spouse-retirement") {
                      setSpouseRetirementDetails(prev => ({ ...prev, lifeExpectancy: value }));
                    } else {
                      updateCustomRetirement(retirement.id, { lifeExpectancy: value });
                    }
                  }}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-green-50">
              <p className="text-sm font-medium text-green-800">Projected Savings</p>
              <p className="text-lg font-bold text-green-600">${projectedSavings.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <p className="text-sm font-medium text-blue-800">Annual Withdrawal</p>
              <p className="text-lg font-bold text-blue-600">${annualWithdrawal.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-50">
              <p className="text-sm font-medium text-orange-800">Years to Target</p>
              <p className="text-lg font-bold text-orange-600">{yearsToTarget} years</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <p className="text-sm font-medium text-purple-800">Total Contributions</p>
              <p className="text-lg font-bold text-purple-600">${totalContributions.toLocaleString()}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Retirement Chart</h4>
            <ChartContainer config={chartConfig} className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name]}
                    labelFormatter={(label) => label}
                  />
                  <ChartLegend
                    content={<ChartLegendContent />}
                    verticalAlign="top"
                    height={36}
                  />
                  <Line
                    dataKey="value"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Value"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Calculate totals
  const allRetirements = [personalRetirementDetails, spouseRetirementDetails, ...customRetirements];
  const totalProjectedSavings = allRetirements.reduce((sum, retirement) => {
    const { projectedSavings } = calculateRetirementDetails(retirement);
    return sum + projectedSavings;
  }, 0);
  const totalAnnualWithdrawal = allRetirements.reduce((sum, retirement) => {
    const { annualWithdrawal } = calculateRetirementDetails(retirement);
    return sum + annualWithdrawal;
  }, 0);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">Retirement</DialogTitle>
          </DialogHeader>

          {/* Retirement Summary */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Retirement Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Projected Savings</p>
                  <p className="font-bold text-2xl text-green-600">
                    ${totalProjectedSavings.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Annual Withdrawal</p>
                  <p className="font-bold text-2xl text-blue-600">
                    ${totalAnnualWithdrawal.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Individual Retirement Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderRetirementCard(personalRetirementDetails)}
            {renderRetirementCard(spouseRetirementDetails)}

            {/* Custom Retirements */}
            {customRetirements.map(retirement => renderRetirementCard(retirement))}

            {/* Add Retirement Card */}
            <Card className="border-dashed border-2 border-muted-foreground/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-muted-foreground">
                  <Plus className="w-6 h-6" />
                  Add Retirement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Retirement Type</label>
                    <Select value="" onValueChange={handleRetirementTypeSelect}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select retirement type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="401k">401k</SelectItem>
                        <SelectItem value="IRA">IRA</SelectItem>
                        <SelectItem value="Pension">Pension</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Retirement Write-up Dialog */}
      <Dialog open={summaryDialogOpen} onOpenChange={setSummaryDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                {selectedRetirementSummary?.retirement.type} Report
              </div>
              <div className="flex items-center gap-2">
                {!isEditingWriteUp ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyReport}
                      className="text-gray-600 hover:bg-gray-50"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingWriteUp(true)}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSaveWriteUp}
                      className="text-green-600 hover:bg-green-50"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="text-gray-600 hover:bg-gray-50"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedRetirementSummary && (
            <div className="space-y-4">
              {!isEditingWriteUp ? (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm font-mono text-gray-700 leading-relaxed">
                    {editableWriteUp}
                  </pre>
                </div>
              ) : (
                <div className="space-y-4">
                  <Label htmlFor="writeup-editor" className="text-sm font-medium">
                    Edit Report Content
                  </Label>
                  <Textarea
                    id="writeup-editor"
                    value={editableWriteUp}
                    onChange={(e) => setEditableWriteUp(e.target.value)}
                    className="min-h-[400px] font-mono text-sm"
                    placeholder="Enter your retirement report content here..."
                  />
                </div>
              )}

              <div className="flex justify-end pt-4 border-t gap-2">
                <Button variant="outline" onClick={() => setSummaryDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
