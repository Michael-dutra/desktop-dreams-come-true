import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { GrowthChart } from "./GrowthChart";
import { SectionAIDialog } from "./SectionAIDialog";
import {
  Building2,
  TrendingUp,
  DollarSign,
  Calendar,
  Users,
  Target,
  PieChart,
  BarChart3,
  Plus,
  Pencil,
  Trash2,
  Calculator,
  Bot,
  CreditCard,
  Building,
  Truck,
  Banknote,
  HandCoins,
  Briefcase
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type BusinessDetailDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

type CorporateAsset = {
  id: string;
  name: string;
  type: string;
  currentValue: number;
  purchaseDate: string;
  appreciationRate: number;
  description?: string;
};

type CorporateLiability = {
  id: string;
  name: string;
  type: string;
  principal: number;
  interestRate: number;
  monthlyPayment: number;
  remainingMonths: number;
  description?: string;
};

const corporateAssetTypes = [
  "Real Estate",
  "Equipment", 
  "Vehicles",
  "Intellectual Property",
  "Inventory",
  "Technology",
  "Other"
];

const corporateLiabilityTypes = [
  "Business Mortgage",
  "Equipment Loan",
  "Line of Credit", 
  "Corporate Credit Card",
  "Term Loan",
  "Equipment Financing"
];

export const BusinessDetailDialog: React.FC<BusinessDetailDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const [corporateAssets, setCorporateAssets] = React.useState<CorporateAsset[]>([
    {
      id: "1",
      name: "Office Building",
      type: "Real Estate",
      currentValue: 750000,
      purchaseDate: "2022-01-15",
      appreciationRate: 3.5,
      description: "Main office building downtown"
    },
    {
      id: "2", 
      name: "Manufacturing Equipment",
      type: "Equipment",
      currentValue: 250000,
      purchaseDate: "2023-06-01",
      appreciationRate: -8.0,
      description: "Production line machinery"
    }
  ]);

  const [corporateLiabilities, setCorporateLiabilities] = React.useState<CorporateLiability[]>([
    {
      id: "1",
      name: "Office Building Mortgage",
      type: "Business Mortgage", 
      principal: 500000,
      interestRate: 4.5,
      monthlyPayment: 2500,
      remainingMonths: 180,
      description: "Commercial mortgage for main office"
    },
    {
      id: "2",
      name: "Equipment Loan",
      type: "Equipment Loan",
      principal: 150000,
      interestRate: 6.2,
      monthlyPayment: 1800,
      remainingMonths: 84,
      description: "Financing for manufacturing equipment"
    }
  ]);

  const [revenue2025, setRevenue2025] = React.useState([572]);
  const [profit2025, setProfit2025] = React.useState([131]);
  const [valuation2025, setValuation2025] = React.useState([384]);
  const [showAddAssetForm, setShowAddAssetForm] = React.useState(false);
  const [showAddLiabilityForm, setShowAddLiabilityForm] = React.useState(false);
  const [editingAsset, setEditingAsset] = React.useState<CorporateAsset | null>(null);
  const [editingLiability, setEditingLiability] = React.useState<CorporateLiability | null>(null);
  const [aiDialogOpen, setAIDialogOpen] = React.useState(false);
  const [aiDialogTitle, setAIDialogTitle] = React.useState("");
  const [aiDialogContent, setAIDialogContent] = React.useState("");

  // Liability calculation states
  const [extraPayments, setExtraPayments] = React.useState<{ [key: string]: number }>({});
  const [newRates, setNewRates] = React.useState<{ [key: string]: number }>({});

  const generateAssetAIAnalysis = (asset: CorporateAsset) => {
    const yearsOwned = new Date().getFullYear() - new Date(asset.purchaseDate).getFullYear();
    const projectedValue = asset.currentValue * Math.pow(1 + asset.appreciationRate / 100, 5);
    const totalAppreciation = projectedValue - asset.currentValue;
    
    let analysis = `🏢 Corporate Asset Analysis: ${asset.name}\n\n`;
    analysis += `📊 Current Details:\n`;
    analysis += `• Asset Type: ${asset.type}\n`;
    analysis += `• Current Value: $${asset.currentValue.toLocaleString()}\n`;
    analysis += `• Purchase Date: ${new Date(asset.purchaseDate).toLocaleDateString()}\n`;
    analysis += `• Years Owned: ${yearsOwned}\n`;
    analysis += `• Annual ${asset.appreciationRate >= 0 ? 'Appreciation' : 'Depreciation'} Rate: ${Math.abs(asset.appreciationRate)}%\n\n`;
    
    analysis += `📈 5-Year Projection:\n`;
    analysis += `• Projected Value (2029): $${projectedValue.toLocaleString()}\n`;
    analysis += `• Total ${totalAppreciation >= 0 ? 'Appreciation' : 'Depreciation'}: $${Math.abs(totalAppreciation).toLocaleString()}\n\n`;
    
    if (asset.appreciationRate > 0) {
      analysis += `✅ This asset is appreciating and contributes positively to business equity.\n`;
    } else {
      analysis += `⚠️ This asset is depreciating. Consider replacement timeline or maintenance strategies.\n`;
    }
    
    analysis += `\n💡 Consider: Regular valuations, maintenance schedules, and strategic timing for asset replacement or upgrades.`;
    
    return analysis;
  };

  const generateLiabilityAIAnalysis = (liability: CorporateLiability) => {
    const extraPayment = extraPayments[liability.id] || 0;
    const newRate = newRates[liability.id] || liability.interestRate;
    
    // Calculate current scenario
    const totalInterest = (liability.monthlyPayment * liability.remainingMonths) - liability.principal;
    
    // Calculate with extra payments and/or new rate
    const newMonthlyRate = newRate / 100 / 12;
    const adjustedPayment = liability.monthlyPayment + extraPayment;
    
    let newMonths = liability.remainingMonths;
    let newTotalInterest = totalInterest;
    
    if (newMonthlyRate > 0) {
      newMonths = Math.log(1 + (liability.principal * newMonthlyRate) / adjustedPayment) / Math.log(1 + newMonthlyRate);
      newTotalInterest = (adjustedPayment * newMonths) - liability.principal;
    }
    
    const interestSavings = totalInterest - newTotalInterest;
    const monthsSaved = liability.remainingMonths - newMonths;
    
    let analysis = `💼 Corporate Liability Analysis: ${liability.name}\n\n`;
    analysis += `📊 Current Loan Details:\n`;
    analysis += `• Liability Type: ${liability.type}\n`;
    analysis += `• Principal Balance: $${liability.principal.toLocaleString()}\n`;
    analysis += `• Interest Rate: ${liability.interestRate}%\n`;
    analysis += `• Monthly Payment: $${liability.monthlyPayment.toLocaleString()}\n`;
    analysis += `• Remaining Months: ${liability.remainingMonths}\n`;
    analysis += `• Total Interest (Current): $${totalInterest.toLocaleString()}\n\n`;
    
    if (extraPayment > 0 || newRate !== liability.interestRate) {
      analysis += `🔧 Optimized Scenario:\n`;
      if (extraPayment > 0) analysis += `• Extra Monthly Payment: $${extraPayment.toLocaleString()}\n`;
      if (newRate !== liability.interestRate) analysis += `• New Interest Rate: ${newRate}%\n`;
      analysis += `• New Payoff Time: ${Math.round(newMonths)} months\n`;
      analysis += `• Total Interest (Optimized): $${newTotalInterest.toLocaleString()}\n`;
      analysis += `• Interest Savings: $${interestSavings.toLocaleString()}\n`;
      analysis += `• Months Saved: ${Math.round(monthsSaved)}\n\n`;
      
      if (interestSavings > 10000) {
        analysis += `🎉 Significant savings opportunity! Consider implementing this strategy.\n`;
      } else if (interestSavings > 0) {
        analysis += `✅ Moderate savings available. Evaluate cash flow impact.\n`;
      }
    }
    
    analysis += `\n💡 Consider: Refinancing options, extra payment strategies, and business cash flow optimization.`;
    
    return analysis;
  };

  const handleShowAssetAI = (asset: CorporateAsset) => {
    setAIDialogTitle(`Corporate Asset: ${asset.name}`);
    setAIDialogContent(generateAssetAIAnalysis(asset));
    setAIDialogOpen(true);
  };

  const handleShowLiabilityAI = (liability: CorporateLiability) => {
    setAIDialogTitle(`Corporate Liability: ${liability.name}`);
    setAIDialogContent(generateLiabilityAIAnalysis(liability));
    setAIDialogOpen(true);
  };

  const handleAddAsset = (newAsset: Omit<CorporateAsset, 'id'>) => {
    const asset: CorporateAsset = {
      ...newAsset,
      id: Date.now().toString(),
    };
    setCorporateAssets(prev => [...prev, asset]);
    setShowAddAssetForm(false);
    toast({
      title: "Corporate Asset Added",
      description: `${newAsset.name} has been added to your corporate assets.`,
    });
  };

  const handleAddLiability = (newLiability: Omit<CorporateLiability, 'id'>) => {
    const liability: CorporateLiability = {
      ...newLiability,
      id: Date.now().toString(),
    };
    setCorporateLiabilities(prev => [...prev, liability]);
    setShowAddLiabilityForm(false);
    toast({
      title: "Corporate Liability Added", 
      description: `${newLiability.name} has been added to your corporate liabilities.`,
    });
  };

  const handleDeleteAsset = (id: string) => {
    setCorporateAssets(prev => prev.filter(asset => asset.id !== id));
    toast({
      title: "Corporate Asset Deleted",
      description: "The corporate asset has been removed.",
    });
  };

  const handleDeleteLiability = (id: string) => {
    setCorporateLiabilities(prev => prev.filter(liability => liability.id !== id));
    setExtraPayments(prev => {
      const newPayments = { ...prev };
      delete newPayments[id];
      return newPayments;
    });
    setNewRates(prev => {
      const newRates = { ...prev };
      delete newRates[id];
      return newRates;
    });
    toast({
      title: "Corporate Liability Deleted",
      description: "The corporate liability has been removed.",
    });
  };

  // Calculate total corporate assets value
  const totalCorporateAssetsValue = corporateAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
  
  // Calculate total corporate liabilities
  const totalCorporateLiabilities = corporateLiabilities.reduce((sum, liability) => sum + liability.principal, 0);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              Business Planning Details
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projections">Projections</TabsTrigger>
              <TabsTrigger value="corporate-assets">Corporate Assets</TabsTrigger>
              <TabsTrigger value="corporate-liabilities">Corporate Liabilities</TabsTrigger>
              <TabsTrigger value="strategic">Strategic</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Business Valuation Projections (2025-2029)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-2 text-center mb-4">
                      {['2025', '2026', '2027', '2028', '2029'].map((year) => (
                        <div key={year} className="font-semibold text-sm">{year}</div>
                      ))}
                      {['$0.0M', '$0.2M', '$0.4M', '$0.6M', '$0.8M'].map((value, index) => (
                        <div key={index} className="text-blue-600 font-bold">{value}</div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      Revenue Streams
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Core Services</span>
                      <span className="font-bold text-blue-600">$285K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Consulting</span>
                      <span className="font-bold text-green-600">$125K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Products</span>
                      <span className="font-bold text-purple-600">$75K</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue, Profit & Expenses Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Revenue, Profit & Expenses Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2 text-center mb-4">
                    {['2025', '2026', '2027', '2028', '2029'].map((year) => (
                      <div key={year} className="font-semibold text-sm">{year}</div>
                    ))}
                    {['$0', '$300K', '$600K', '$900K', '$1.2M'].map((value, index) => (
                      <div key={index} className="text-purple-600 font-bold">{value}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Current Year, Growth Rates, Projections */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Year</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="font-semibold text-gray-600">Revenue</div>
                      <div className="text-2xl font-bold text-blue-600">$485K</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-600">Profit</div>
                      <div className="text-2xl font-bold text-green-600">$105K</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-600">Valuation</div>
                      <div className="text-2xl font-bold text-purple-600">$325K</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Growth Rates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="font-semibold text-gray-600">Revenue Growth</div>
                      <div className="text-2xl font-bold text-green-600">+18% YoY</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-600">Profit Growth</div>
                      <div className="text-2xl font-bold text-green-600">+25% YoY</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-600">Valuation Growth</div>
                      <div className="text-2xl font-bold text-green-600">+18% YoY</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Projections</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="font-semibold text-gray-600">2025 Revenue</div>
                      <div className="text-2xl font-bold text-blue-600">$572K</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-600">2025 Profit</div>
                      <div className="text-2xl font-bold text-green-600">$131K</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-600">2025 Valuation</div>
                      <div className="text-2xl font-bold text-purple-600">$384K</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projections" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>2025 Revenue Projection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Revenue Target: ${revenue2025[0]}K</Label>
                        <Slider
                          value={revenue2025}
                          onValueChange={setRevenue2025}
                          min={400}
                          max={800}
                          step={10}
                          className="mt-2"
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        Current: $485K → Target: ${revenue2025[0]}K
                        <br />
                        Growth: {(((revenue2025[0] - 485) / 485) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>2025 Profit Projection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Profit Target: ${profit2025[0]}K</Label>
                        <Slider
                          value={profit2025}
                          onValueChange={setProfit2025}
                          min={80}
                          max={200}
                          step={5}
                          className="mt-2"
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        Current: $105K → Target: ${profit2025[0]}K
                        <br />
                        Margin: {((profit2025[0] / revenue2025[0]) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>2025 Valuation Projection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Valuation Target: ${valuation2025[0]}K</Label>
                        <Slider
                          value={valuation2025}
                          onValueChange={setValuation2025}
                          min={250}
                          max={500}
                          step={10}
                          className="mt-2"
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        Current: $325K → Target: ${valuation2025[0]}K
                        <br />
                        Multiple: {(valuation2025[0] / profit2025[0]).toFixed(1)}x
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="corporate-assets" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">Corporate Assets</h3>
                  <p className="text-gray-600">
                    Total Value: ${totalCorporateAssetsValue.toLocaleString()}
                  </p>
                </div>
                <Button onClick={() => setShowAddAssetForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Asset
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {corporateAssets.map((asset) => (
                  <Card key={asset.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{asset.name}</CardTitle>
                          <Badge variant="secondary">{asset.type}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleShowAssetAI(asset)}
                            className="border-indigo-600 text-indigo-700 hover:bg-indigo-50"
                          >
                            <Bot className="w-4 h-4 mr-1" />
                            AI
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingAsset(asset)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteAsset(asset.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Current Value:</span>
                            <div className="font-bold text-lg">
                              ${asset.currentValue.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Annual Change:</span>
                            <div className={`font-bold text-lg ${asset.appreciationRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {asset.appreciationRate >= 0 ? '+' : ''}{asset.appreciationRate}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <span className="text-gray-600 text-sm">5-Year Growth Projection</span>
                          <div className="w-full max-w-full overflow-hidden">
                            <GrowthChart
                              data={[
                                { year: 2024, value: asset.currentValue },
                                { year: 2025, value: asset.currentValue * Math.pow(1 + asset.appreciationRate / 100, 1) },
                                { year: 2026, value: asset.currentValue * Math.pow(1 + asset.appreciationRate / 100, 2) },
                                { year: 2027, value: asset.currentValue * Math.pow(1 + asset.appreciationRate / 100, 3) },
                                { year: 2028, value: asset.currentValue * Math.pow(1 + asset.appreciationRate / 100, 4) },
                                { year: 2029, value: asset.currentValue * Math.pow(1 + asset.appreciationRate / 100, 5) },
                              ]}
                              height={200}
                              className="w-full"
                            />
                          </div>
                        </div>
                        
                        {asset.description && (
                          <p className="text-sm text-gray-600">{asset.description}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {showAddAssetForm && (
                <AddCorporateAssetForm 
                  onAdd={handleAddAsset}
                  onCancel={() => setShowAddAssetForm(false)}
                />
              )}
            </TabsContent>

            <TabsContent value="corporate-liabilities" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">Corporate Liabilities</h3>
                  <p className="text-gray-600">
                    Total Principal: ${totalCorporateLiabilities.toLocaleString()}
                  </p>
                </div>
                <Button onClick={() => setShowAddLiabilityForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Liability
                </Button>
              </div>

              <div className="space-y-6">
                {corporateLiabilities.map((liability) => {
                  const extraPayment = extraPayments[liability.id] || 0;
                  const newRate = newRates[liability.id] || liability.interestRate;
                  
                  // Calculate current scenario
                  const currentTotalPayment = liability.monthlyPayment * liability.remainingMonths;
                  const currentTotalInterest = currentTotalPayment - liability.principal;
                  
                  // Calculate optimized scenario
                  const newMonthlyRate = newRate / 100 / 12;
                  const adjustedPayment = liability.monthlyPayment + extraPayment;
                  
                  let optimizedMonths = liability.remainingMonths;
                  let optimizedTotalInterest = currentTotalInterest;
                  
                  if (newMonthlyRate > 0 && adjustedPayment > liability.principal * newMonthlyRate) {
                    optimizedMonths = Math.log(1 + (liability.principal * newMonthlyRate) / adjustedPayment) / Math.log(1 + newMonthlyRate);
                    optimizedTotalInterest = (adjustedPayment * optimizedMonths) - liability.principal;
                  }
                  
                  const interestSavings = currentTotalInterest - optimizedTotalInterest;
                  const monthsSaved = liability.remainingMonths - optimizedMonths;

                  return (
                    <Card key={liability.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{liability.name}</CardTitle>
                            <Badge variant="secondary">{liability.type}</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleShowLiabilityAI(liability)}
                              className="border-indigo-600 text-indigo-700 hover:bg-indigo-50"
                            >
                              <Bot className="w-4 h-4 mr-1" />
                              AI
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingLiability(liability)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteLiability(liability.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Principal:</span>
                                <div className="font-bold">${liability.principal.toLocaleString()}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Rate:</span>
                                <div className="font-bold">{liability.interestRate}%</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Monthly Payment:</span>
                                <div className="font-bold">${liability.monthlyPayment.toLocaleString()}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Remaining:</span>
                                <div className="font-bold">{liability.remainingMonths} months</div>
                              </div>
                            </div>

                            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                              <div>
                                <Label>Extra Monthly Payment: ${extraPayment}</Label>
                                <Slider
                                  value={[extraPayment]}
                                  onValueChange={(value) => setExtraPayments(prev => ({ ...prev, [liability.id]: value[0] }))}
                                  min={0}
                                  max={2000}
                                  step={50}
                                  className="mt-2"
                                />
                              </div>
                              
                              <div>
                                <Label>New Interest Rate: {newRate}%</Label>
                                <Slider
                                  value={[newRate]}
                                  onValueChange={(value) => setNewRates(prev => ({ ...prev, [liability.id]: value[0] }))}
                                  min={1}
                                  max={12}
                                  step={0.1}
                                  className="mt-2"
                                />
                              </div>
                            </div>

                            {(extraPayment > 0 || newRate !== liability.interestRate) && (
                              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <h4 className="font-semibold text-green-800 mb-2">Optimization Results</h4>
                                <div className="text-sm space-y-1">
                                  <div>Interest Savings: <span className="font-bold text-green-600">${interestSavings.toLocaleString()}</span></div>
                                  <div>Time Saved: <span className="font-bold text-green-600">{Math.round(monthsSaved)} months</span></div>
                                  <div>New Payoff Time: <span className="font-bold">{Math.round(optimizedMonths)} months</span></div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Payoff Comparison</h4>
                              <div className="w-full max-w-full overflow-hidden">
                                <GrowthChart
                                  data={[
                                    { 
                                      year: 0, 
                                      value: liability.principal,
                                      optimized: liability.principal 
                                    },
                                    { 
                                      year: Math.round(liability.remainingMonths / 4), 
                                      value: liability.principal * 0.75,
                                      optimized: optimizedMonths < liability.remainingMonths / 4 ? 0 : liability.principal * 0.6
                                    },
                                    { 
                                      year: Math.round(liability.remainingMonths / 2), 
                                      value: liability.principal * 0.5,
                                      optimized: optimizedMonths < liability.remainingMonths / 2 ? 0 : liability.principal * 0.3
                                    },
                                    { 
                                      year: Math.round(liability.remainingMonths * 0.75), 
                                      value: liability.principal * 0.25,
                                      optimized: optimizedMonths < liability.remainingMonths * 0.75 ? 0 : liability.principal * 0.1
                                    },
                                    { 
                                      year: liability.remainingMonths, 
                                      value: 0,
                                      optimized: 0
                                    }
                                  ]}
                                  height={200}
                                  showOptimized={true}
                                  className="w-full"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {liability.description && (
                          <p className="text-sm text-gray-600 mt-4">{liability.description}</p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {showAddLiabilityForm && (
                <AddCorporateLiabilityForm 
                  onAdd={handleAddLiability}
                  onCancel={() => setShowAddLiabilityForm(false)}
                />
              )}
            </TabsContent>

            <TabsContent value="strategic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-orange-600" />
                      Strategic Objectives
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Market Expansion</span>
                      <Badge variant="outline">Q2 2025</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Product Development</span>
                      <Badge variant="outline">Q3 2025</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Team Growth</span>
                      <Badge variant="outline">Ongoing</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      Key Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Customer Acquisition Cost</span>
                      <span className="font-bold">$125</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer Lifetime Value</span>
                      <span className="font-bold">$2,400</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Recurring Revenue</span>
                      <span className="font-bold">$28,500</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <SectionAIDialog
        isOpen={aiDialogOpen}
        onClose={() => setAIDialogOpen(false)}
        title={aiDialogTitle}
        content={aiDialogContent}
      />
    </>
  );
};

// Add Corporate Asset Form Component
const AddCorporateAssetForm: React.FC<{
  onAdd: (asset: Omit<CorporateAsset, 'id'>) => void;
  onCancel: () => void;
}> = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    type: '',
    currentValue: '',
    purchaseDate: '',
    appreciationRate: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name: formData.name,
      type: formData.type,
      currentValue: parseFloat(formData.currentValue),
      purchaseDate: formData.purchaseDate,
      appreciationRate: parseFloat(formData.appreciationRate),
      description: formData.description
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Corporate Asset</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="asset-name">Asset Name</Label>
              <Input
                id="asset-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="asset-type">Asset Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  {corporateAssetTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="current-value">Current Value ($)</Label>
              <Input
                id="current-value"
                type="number"
                value={formData.currentValue}
                onChange={(e) => setFormData(prev => ({ ...prev, currentValue: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="purchase-date">Purchase Date</Label>
              <Input
                id="purchase-date"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="appreciation-rate">Annual Appreciation Rate (%)</Label>
              <Input
                id="appreciation-rate"
                type="number"
                step="0.1"
                value={formData.appreciationRate}
                onChange={(e) => setFormData(prev => ({ ...prev, appreciationRate: e.target.value }))}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">Add Asset</Button>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Add Corporate Liability Form Component
const AddCorporateLiabilityForm: React.FC<{
  onAdd: (liability: Omit<CorporateLiability, 'id'>) => void;
  onCancel: () => void;
}> = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    type: '',
    principal: '',
    interestRate: '',
    monthlyPayment: '',
    remainingMonths: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name: formData.name,
      type: formData.type,
      principal: parseFloat(formData.principal),
      interestRate: parseFloat(formData.interestRate),
      monthlyPayment: parseFloat(formData.monthlyPayment),
      remainingMonths: parseInt(formData.remainingMonths),
      description: formData.description
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Corporate Liability</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="liability-name">Liability Name</Label>
              <Input
                id="liability-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="liability-type">Liability Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select liability type" />
                </SelectTrigger>
                <SelectContent>
                  {corporateLiabilityTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="principal">Principal Balance ($)</Label>
              <Input
                id="principal"
                type="number"
                value={formData.principal}
                onChange={(e) => setFormData(prev => ({ ...prev, principal: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="interest-rate">Interest Rate (%)</Label>
              <Input
                id="interest-rate"
                type="number"
                step="0.1"
                value={formData.interestRate}
                onChange={(e) => setFormData(prev => ({ ...prev, interestRate: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="monthly-payment">Monthly Payment ($)</Label>
              <Input
                id="monthly-payment"
                type="number"
                value={formData.monthlyPayment}
                onChange={(e) => setFormData(prev => ({ ...prev, monthlyPayment: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="remaining-months">Remaining Months</Label>
              <Input
                id="remaining-months"
                type="number"
                value={formData.remainingMonths}
                onChange={(e) => setFormData(prev => ({ ...prev, remainingMonths: e.target.value }))}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="liability-description">Description (Optional)</Label>
            <Textarea
              id="liability-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">Add Liability</Button>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
