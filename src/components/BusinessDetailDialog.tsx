import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, DollarSign, TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface BusinessDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  business: {
    id: string;
    name: string;
    industry: string;
    value: number;
    ownership: number;
    revenue: number;
    netIncome: number;
    employees: number;
    founded: number;
    location: string;
    description: string;
  } | null;
}

export function BusinessDetailDialog({ open, onOpenChange, business }: BusinessDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(business?.name || '');
  const [industry, setIndustry] = useState(business?.industry || '');
  const [value, setValue] = useState(business?.value || 0);
  const [ownership, setOwnership] = useState(business?.ownership || 0);
  const [revenue, setRevenue] = useState(business?.revenue || 0);
  const [netIncome, setNetIncome] = useState(business?.netIncome || 0);
  const [employees, setEmployees] = useState(business?.employees || 0);
  const [founded, setFounded] = useState(business?.founded || 0);
  const [location, setLocation] = useState(business?.location || '');
  const [description, setDescription] = useState(business?.description || '');
  const [companyValuation, setCompanyValuation] = useState([business?.value || 1000000]);
  const [totalCorporateAssets, setTotalCorporateAssets] = useState([1000000]);
  const [activeBusAssets, setActiveBusAssets] = useState([800000]);
  const [personalTaxRate, setPersonalTaxRate] = useState([53.53]);
  const [corporateTaxRate, setCorporateTaxRate] = useState([26.67]);

  const handleSave = () => {
    // Implement save functionality here
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const calculateLcgeAnalysis = () => {
    const totalLcgeLimit = 1250000;
    const annualLcgeLimit = 125000;
    
    // Calculate utilization percentage based on company valuation
    const utilizationPercentage = Math.min((companyValuation[0] / totalLcgeLimit) * 100, 100);
    
    const activeAssetRatio = (activeBusAssets[0] / totalCorporateAssets[0]) * 100;
    const capitalGain = Math.max(0, companyValuation[0] - totalCorporateAssets[0]);
    const remainingLcge = Math.max(0, totalLcgeLimit - companyValuation[0]);
    
    const personalTax = capitalGain * (personalTaxRate[0] / 100);
    const corporateTax = capitalGain * (corporateTaxRate[0] / 100);
    const taxSavings = personalTax - corporateTax;
    
    const lcgeStatus = activeAssetRatio >= 90 ? 'qualified' : 
                      activeAssetRatio >= 50 ? 'warning' : 'not-qualified';
    
    return {
      utilizationPercentage,
      activeAssetRatio,
      capitalGain,
      remainingLcge,
      personalTax,
      corporateTax,
      taxSavings,
      lcgeStatus,
      totalLcgeLimit,
      annualLcgeLimit
    };
  };

  const analysis = calculateLcgeAnalysis();

  if (!business) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {business.name} - Business Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information Section */}
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditing} />
                </div>
                <div>
                  <Label>Industry</Label>
                  <Input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} disabled={!isEditing} />
                </div>
                <div>
                  <Label>Value</Label>
                  <Input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} disabled={!isEditing} />
                </div>
                <div>
                  <Label>Ownership</Label>
                  <Input type="number" value={ownership} onChange={(e) => setOwnership(Number(e.target.value))} disabled={!isEditing} />
                </div>
                <div>
                  <Label>Revenue</Label>
                  <Input type="number" value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} disabled={!isEditing} />
                </div>
                <div>
                  <Label>Net Income</Label>
                  <Input type="number" value={netIncome} onChange={(e) => setNetIncome(Number(e.target.value))} disabled={!isEditing} />
                </div>
                <div>
                  <Label>Employees</Label>
                  <Input type="number" value={employees} onChange={(e) => setEmployees(Number(e.target.value))} disabled={!isEditing} />
                </div>
                <div>
                  <Label>Founded</Label>
                  <Input type="number" value={founded} onChange={(e) => setFounded(Number(e.target.value))} disabled={!isEditing} />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input type="text" value={location} onChange={(e) => setLocation(e.target.value)} disabled={!isEditing} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input type="text" value={description} onChange={(e) => setDescription(e.target.value)} disabled={!isEditing} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* LCGE Auto-Calculator Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                LCGE Auto-Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Corporate Assets */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Total Corporate Assets</Label>
                  <div className="space-y-2">
                    <Slider
                      value={totalCorporateAssets}
                      onValueChange={setTotalCorporateAssets}
                      max={20000000}
                      step={50000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>$0</span>
                      <span className="font-medium text-foreground">
                        ${totalCorporateAssets[0].toLocaleString()}
                      </span>
                      <span>$20M</span>
                    </div>
                  </div>
                </div>

                {/* Active Business Assets */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Active Business Assets</Label>
                  <div className="space-y-2">
                    <Slider
                      value={activeBusAssets}
                      onValueChange={setActiveBusAssets}
                      max={20000000}
                      step={50000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>$0</span>
                      <span className="font-medium text-foreground">
                        ${activeBusAssets[0].toLocaleString()}
                      </span>
                      <span>$20M</span>
                    </div>
                  </div>
                </div>

                {/* Personal Tax Rate */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Personal Tax Rate (%)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={personalTaxRate}
                      onValueChange={setPersonalTaxRate}
                      max={60}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span className="font-medium text-foreground">
                        {personalTaxRate[0].toFixed(1)}%
                      </span>
                      <span>60%</span>
                    </div>
                  </div>
                </div>

                {/* Corporate Tax Rate */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Corporate Tax Rate (%)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={corporateTaxRate}
                      onValueChange={setCorporateTaxRate}
                      max={40}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span className="font-medium text-foreground">
                        {corporateTaxRate[0].toFixed(1)}%
                      </span>
                      <span>40%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* LCGE Analysis Results */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  LCGE Analysis
                </h3>

                {/* Company Valuation Slider - Moved here */}
                <div className="space-y-3 mb-6">
                  <Label className="text-sm font-medium">Company Valuation</Label>
                  <div className="space-y-2">
                    <Slider
                      value={companyValuation}
                      onValueChange={setCompanyValuation}
                      max={5000000}
                      step={50000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>$0</span>
                      <span className="font-medium text-foreground">
                        ${companyValuation[0].toLocaleString()}
                      </span>
                      <span>$5M</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Active Asset Ratio:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{analysis.activeAssetRatio.toFixed(1)}%</span>
                        {analysis.lcgeStatus === 'qualified' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {analysis.lcgeStatus === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                        {analysis.lcgeStatus === 'not-qualified' && <XCircle className="h-4 w-4 text-red-500" />}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Capital Gain:</span>
                      <span className="font-bold text-green-600">
                        ${analysis.capitalGain.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Remaining LCGE:</span>
                      <span className="font-bold">
                        ${analysis.remainingLcge.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Personal Tax:</span>
                      <span className="font-bold text-red-600">
                        ${analysis.personalTax.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Corporate Tax:</span>
                      <span className="font-bold text-orange-600">
                        ${analysis.corporateTax.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Tax Savings:</span>
                      <span className="font-bold text-green-600">
                        ${analysis.taxSavings.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* LCGE Usage Progress Bar */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">LCGE Utilization:</span>
                    <span className="text-sm font-bold">
                      {analysis.utilizationPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={analysis.utilizationPercentage} 
                    className="h-3"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$0</span>
                    <span>${analysis.totalLcgeLimit.toLocaleString()} Total Limit</span>
                  </div>
                </div>

                {/* Warning Messages */}
                {analysis.capitalGain > analysis.remainingLcge && (
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Warning: Capital gain exceeds remaining LCGE by ${(analysis.capitalGain - analysis.remainingLcge).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {analysis.lcgeStatus !== 'qualified' && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800 dark:text-red-200">
                        {analysis.lcgeStatus === 'warning' 
                          ? 'Partial LCGE qualification: Active assets should be ≥90% of total assets'
                          : 'LCGE not qualified: Active assets must be ≥50% of total assets'
                        }
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
