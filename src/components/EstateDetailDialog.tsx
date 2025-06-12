import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown, FileText, Shield, Users, DollarSign, Calendar, AlertTriangle, CheckCircle, Calculator, Plus, Edit, Trash2 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface EstateDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const EstateDetailDialog = ({ isOpen, onClose }: EstateDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Document status state
  const [estateDocs, setEstateDocs] = useState([
    { id: 1, document: "Last Will & Testament", status: "Current", lastUpdated: "Mar 2024", expires: "Review in 5 years" },
    { id: 2, document: "Power of Attorney", status: "Current", lastUpdated: "Mar 2024", expires: "No expiry" },
    { id: 3, document: "Living Will", status: "Outdated", lastUpdated: "Jan 2020", expires: "Review needed" },
    { id: 4, document: "Beneficiary Designations", status: "Current", lastUpdated: "Feb 2024", expires: "Annual review" },
  ]);
  
  // Trust structures state
  const [trusts, setTrusts] = useState([
    { id: 1, name: "Family Trust", type: "Discretionary", assets: "$185,000", purpose: "Tax minimization" },
    { id: 2, name: "Children's Education Trust", type: "Fixed", assets: "$50,000", purpose: "Education funding" },
  ]);
  
  // Document actions state
  const [documentActions, setDocumentActions] = useState([
    { id: 1, title: "Update Living Will", icon: "FileText" },
    { id: 2, title: "Schedule Annual Review", icon: "Calendar" },
    { id: 3, title: "Review Beneficiaries", icon: "Shield" },
    { id: 4, title: "Estate Tax Planning", icon: "Crown" },
  ]);
  
  // Beneficiaries state
  const [beneficiaries, setBeneficiaries] = useState([
    { id: 1, name: "Sarah Johnson", relationship: "Spouse", allocation: 60, amount: 471000 },
    { id: 2, name: "Michael Johnson", relationship: "Son", allocation: 25, amount: 196250 },
    { id: 3, name: "Emma Johnson", relationship: "Daughter", allocation: 15, amount: 117750 },
  ]);

  // Editing states
  const [editingDoc, setEditingDoc] = useState<number | null>(null);
  const [editingTrust, setEditingTrust] = useState<number | null>(null);
  const [editingAction, setEditingAction] = useState<number | null>(null);
  const [editingBeneficiary, setEditingBeneficiary] = useState<number | null>(null);

  // Functions to handle document operations
  const addDocument = () => {
    const newDoc = {
      id: Date.now(),
      document: "New Document",
      status: "Draft",
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      expires: "To be determined"
    };
    setEstateDocs([...estateDocs, newDoc]);
    setEditingDoc(newDoc.id);
  };

  const deleteDocument = (id: number) => {
    setEstateDocs(estateDocs.filter(doc => doc.id !== id));
  };

  const updateDocument = (id: number, field: string, value: string) => {
    setEstateDocs(estateDocs.map(doc => 
      doc.id === id ? { ...doc, [field]: value } : doc
    ));
  };

  // Functions to handle trust operations
  const addTrust = () => {
    const newTrust = {
      id: Date.now(),
      name: "New Trust",
      type: "Discretionary",
      assets: "$0",
      purpose: "To be defined"
    };
    setTrusts([...trusts, newTrust]);
    setEditingTrust(newTrust.id);
  };

  const deleteTrust = (id: number) => {
    setTrusts(trusts.filter(trust => trust.id !== id));
  };

  const updateTrust = (id: number, field: string, value: string) => {
    setTrusts(trusts.map(trust => 
      trust.id === id ? { ...trust, [field]: value } : trust
    ));
  };

  // Functions to handle action operations
  const addAction = () => {
    const newAction = {
      id: Date.now(),
      title: "New Action",
      icon: "FileText"
    };
    setDocumentActions([...documentActions, newAction]);
    setEditingAction(newAction.id);
  };

  const deleteAction = (id: number) => {
    setDocumentActions(documentActions.filter(action => action.id !== id));
  };

  const updateAction = (id: number, field: string, value: string) => {
    setDocumentActions(documentActions.map(action => 
      action.id === id ? { ...action, [field]: value } : action
    ));
  };

  // Functions to handle beneficiary operations
  const addBeneficiary = () => {
    const newBeneficiary = {
      id: Date.now(),
      name: "New Beneficiary",
      relationship: "Family",
      allocation: 0,
      amount: 0
    };
    setBeneficiaries([...beneficiaries, newBeneficiary]);
    setEditingBeneficiary(newBeneficiary.id);
  };

  const deleteBeneficiary = (id: number) => {
    setBeneficiaries(beneficiaries.filter(ben => ben.id !== id));
  };

  const updateBeneficiary = (id: number, field: string, value: string | number) => {
    setBeneficiaries(beneficiaries.map(ben => 
      ben.id === id ? { ...ben, [field]: value } : ben
    ));
  };

  // Estate breakdown and tax calculations
  const estateBreakdown = [
    { asset: "Real Estate", value: 425000, color: "#8b5cf6", taxable: true, taxRate: 0.06 },
    { asset: "Investment Accounts", value: 185000, color: "#06b6d4", taxable: true, taxRate: 0.12 },
    { asset: "RRSP/RRIF", value: 95000, color: "#10b981", taxable: true, taxRate: 0.25 },
    { asset: "TFSA", value: 55000, color: "#f59e0b", taxable: false, taxRate: 0 },
    { asset: "Business Assets", value: 25000, color: "#ef4444", taxable: true, taxRate: 0.08 },
  ];

  const taxBreakdown = estateBreakdown.map(asset => ({
    ...asset,
    taxAmount: asset.taxable ? asset.value * asset.taxRate : 0,
    afterTaxValue: asset.taxable ? asset.value - (asset.value * asset.taxRate) : asset.value
  }));

  const finalTaxesData = taxBreakdown.filter(asset => asset.taxAmount > 0).map(asset => ({
    asset: asset.asset,
    value: asset.taxAmount,
    color: asset.color
  }));

  const totalTaxes = taxBreakdown.reduce((sum, asset) => sum + asset.taxAmount, 0);
  const probateFees = 12000;
  const totalCosts = totalTaxes + probateFees;

  const taxProjections = [
    { scenario: "Current Plan", estateTax: 25000, probateFees: 12000, total: 37000 },
    { scenario: "With Trust", estateTax: 15000, probateFees: 8000, total: 23000 },
    { scenario: "Optimized", estateTax: 8000, probateFees: 5000, total: 13000 },
  ];

  const chartConfig = {
    value: { label: "Value", color: "#8b5cf6" },
  };

  const totalEstate = estateBreakdown.reduce((sum, asset) => sum + asset.value, 0);
  const taxableEstate = estateBreakdown.filter(asset => asset.taxable).reduce((sum, asset) => sum + asset.value, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 text-2xl">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Crown className="h-6 w-6 text-amber-600" />
            </div>
            <span>Estate Planning Details</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents & Beneficiaries</TabsTrigger>
            <TabsTrigger value="tax-planning">Tax Planning</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Estate Value</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Estate</p>
                    <p className="text-3xl font-bold">${totalEstate.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Taxable Portion</p>
                    <p className="text-xl font-bold text-amber-600">${taxableEstate.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tax-Free Portion</p>
                    <p className="text-xl font-bold text-green-600">$55,000</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Tax Liability</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Estate Tax</p>
                    <p className="text-2xl font-bold text-red-600">$25,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Probate Fees</p>
                    <p className="text-xl font-bold text-orange-600">$12,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Costs</p>
                    <p className="text-xl font-bold">$37,000</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Last Review</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Estate Plan</p>
                    <p className="text-xl font-bold">Mar 2024</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Next Review</p>
                    <p className="text-lg font-bold text-blue-600">Mar 2025</p>
                  </div>
                  <Badge variant="secondary" className="w-full justify-center">
                    Up to Date
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Final Taxes Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ChartContainer config={chartConfig} className="h-80">
                    <PieChart>
                      <Pie
                        data={finalTaxesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {finalTaxesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent formatter={(value) => [`$${value.toLocaleString()}`, "Tax Amount"]} />} />
                    </PieChart>
                  </ChartContainer>
                  
                  <div className="space-y-3">
                    {finalTaxesData.map((asset) => {
                      const originalAsset = taxBreakdown.find(a => a.asset === asset.asset);
                      return (
                        <div key={asset.asset} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: asset.color }} />
                            <div>
                              <p className="font-medium">{asset.asset}</p>
                              <p className="text-sm text-muted-foreground">
                                Tax Rate: {originalAsset ? (originalAsset.taxRate * 100).toFixed(1) : 0}%
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-red-600">${asset.value.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">
                              {totalTaxes > 0 ? ((asset.value / totalTaxes) * 100).toFixed(1) : 0}% of total taxes
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {totalTaxes === 0 && (
                      <div className="text-center p-4 text-muted-foreground">
                        No taxable assets in current plan
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Final Taxes Breakdown by Asset</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {taxBreakdown.map((asset) => (
                    <div key={asset.asset} className="p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: asset.color }} />
                          <div>
                            <h4 className="font-medium">{asset.asset}</h4>
                            <p className="text-sm text-muted-foreground">
                              {asset.taxable ? `Taxable at ${(asset.taxRate * 100).toFixed(1)}%` : "Tax-Free"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Asset Value</p>
                          <p className="text-lg font-bold">${asset.value.toLocaleString()}</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Tax Calculation</p>
                          {asset.taxable ? (
                            <p className="text-sm">
                              ${asset.value.toLocaleString()} × {(asset.taxRate * 100).toFixed(1)}% = 
                              <span className="font-bold text-red-600 ml-1">
                                ${asset.taxAmount.toLocaleString()}
                              </span>
                            </p>
                          ) : (
                            <p className="text-sm font-bold text-green-600">$0</p>
                          )}
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">After-Tax Value</p>
                          <p className="text-lg font-bold text-green-600">
                            ${asset.afterTaxValue.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tax Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                    <span className="font-medium">Total Estate Taxes</span>
                    <span className="text-lg font-bold text-red-600">
                      ${totalTaxes.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <span className="font-medium">Probate Fees</span>
                    <span className="text-lg font-bold text-orange-600">
                      ${probateFees.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="font-bold">Total Final Costs</span>
                    <span className="text-xl font-bold">
                      ${totalCosts.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estate Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">Total Estate Value</span>
                    <span className="text-lg font-bold">
                      ${totalEstate.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">Less: Final Costs</span>
                    <span className="text-lg font-bold text-red-600">
                      -${totalCosts.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span className="font-bold">Net to Beneficiaries</span>
                    <span className="text-xl font-bold text-green-600">
                      ${(totalEstate - totalCosts).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tax Rate Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-medium">Asset Tax Rates Applied:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Real Estate: 6% (Capital gains + probate)</li>
                      <li>• Investment Accounts: 12% (Capital gains tax)</li>
                      <li>• RRSP/RRIF: 25% (Income tax on withdrawal)</li>
                      <li>• TFSA: 0% (Tax-free)</li>
                      <li>• Business Assets: 8% (Capital gains + valuation)</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Additional Considerations:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Probate fees: Fixed at $12,000</li>
                      <li>• Legal and administrative costs included</li>
                      <li>• Rates may vary by province/territory</li>
                      <li>• Professional valuation may be required</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Estate Documents Status</span>
                  </div>
                  <Button onClick={addDocument} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Document
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {estateDocs.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3 flex-1">
                        {doc.status === "Current" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-orange-600" />
                        )}
                        <div className="flex-1 space-y-2">
                          {editingDoc === doc.id ? (
                            <div className="space-y-2">
                              <Input
                                value={doc.document}
                                onChange={(e) => updateDocument(doc.id, 'document', e.target.value)}
                                placeholder="Document name"
                              />
                              <div className="grid grid-cols-3 gap-2">
                                <Input
                                  value={doc.status}
                                  onChange={(e) => updateDocument(doc.id, 'status', e.target.value)}
                                  placeholder="Status"
                                />
                                <Input
                                  value={doc.lastUpdated}
                                  onChange={(e) => updateDocument(doc.id, 'lastUpdated', e.target.value)}
                                  placeholder="Last updated"
                                />
                                <Input
                                  value={doc.expires}
                                  onChange={(e) => updateDocument(doc.id, 'expires', e.target.value)}
                                  placeholder="Expires"
                                />
                              </div>
                              <div className="flex space-x-2">
                                <Button size="sm" onClick={() => setEditingDoc(null)}>Save</Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingDoc(null)}>Cancel</Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <h4 className="font-medium">{doc.document}</h4>
                              <p className="text-sm text-muted-foreground">Last Updated: {doc.lastUpdated}</p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex items-center space-x-2">
                        {editingDoc !== doc.id && (
                          <>
                            <div>
                              <Badge 
                                variant={doc.status === "Current" ? "secondary" : "destructive"}
                                className="mb-2"
                              >
                                {doc.status}
                              </Badge>
                              <p className="text-sm text-muted-foreground">{doc.expires}</p>
                            </div>
                            <div className="flex flex-col space-y-1">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setEditingDoc(doc.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => deleteDocument(doc.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Trust Structures</span>
                    <Button onClick={addTrust} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Trust
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {trusts.map((trust) => (
                    <div key={trust.id} className="p-4 border rounded-lg">
                      {editingTrust === trust.id ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label>Trust Name</Label>
                              <Input
                                value={trust.name}
                                onChange={(e) => updateTrust(trust.id, 'name', e.target.value)}
                                placeholder="Trust name"
                              />
                            </div>
                            <div>
                              <Label>Type</Label>
                              <Input
                                value={trust.type}
                                onChange={(e) => updateTrust(trust.id, 'type', e.target.value)}
                                placeholder="Trust type"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label>Assets</Label>
                              <Input
                                value={trust.assets}
                                onChange={(e) => updateTrust(trust.id, 'assets', e.target.value)}
                                placeholder="Asset value"
                              />
                            </div>
                            <div>
                              <Label>Purpose</Label>
                              <Input
                                value={trust.purpose}
                                onChange={(e) => updateTrust(trust.id, 'purpose', e.target.value)}
                                placeholder="Trust purpose"
                              />
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => setEditingTrust(null)}>Save</Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingTrust(null)}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{trust.name}</h4>
                            <div className="flex space-x-1">
                              <Badge variant="outline">{trust.type}</Badge>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setEditingTrust(trust.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => deleteTrust(trust.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">Assets: {trust.assets}</p>
                          <p className="text-sm text-muted-foreground">{trust.purpose}</p>
                        </>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Document Actions</span>
                    <Button onClick={addAction} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Action
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {documentActions.map((action) => (
                    <div key={action.id} className="flex items-center justify-between">
                      {editingAction === action.id ? (
                        <div className="flex-1 flex space-x-2">
                          <Input
                            value={action.title}
                            onChange={(e) => updateAction(action.id, 'title', e.target.value)}
                            placeholder="Action title"
                            className="flex-1"
                          />
                          <Button size="sm" onClick={() => setEditingAction(null)}>Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingAction(null)}>Cancel</Button>
                        </div>
                      ) : (
                        <>
                          <Button variant="outline" className="w-full justify-start">
                            <FileText className="h-4 w-4 mr-2" />
                            {action.title}
                          </Button>
                          <div className="flex space-x-1 ml-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setEditingAction(action.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => deleteAction(action.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Beneficiary Allocation</span>
                  </div>
                  <Button onClick={addBeneficiary} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Beneficiary
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {beneficiaries.map((beneficiary) => (
                    <div key={beneficiary.id} className="flex items-center justify-between p-4 border rounded-lg">
                      {editingBeneficiary === beneficiary.id ? (
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label>Name</Label>
                              <Input
                                value={beneficiary.name}
                                onChange={(e) => updateBeneficiary(beneficiary.id, 'name', e.target.value)}
                                placeholder="Beneficiary name"
                              />
                            </div>
                            <div>
                              <Label>Relationship</Label>
                              <Input
                                value={beneficiary.relationship}
                                onChange={(e) => updateBeneficiary(beneficiary.id, 'relationship', e.target.value)}
                                placeholder="Relationship"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label>Allocation (%)</Label>
                              <Input
                                type="number"
                                value={beneficiary.allocation}
                                onChange={(e) => updateBeneficiary(beneficiary.id, 'allocation', parseInt(e.target.value) || 0)}
                                placeholder="Allocation percentage"
                              />
                            </div>
                            <div>
                              <Label>Amount ($)</Label>
                              <Input
                                type="number"
                                value={beneficiary.amount}
                                onChange={(e) => updateBeneficiary(beneficiary.id, 'amount', parseInt(e.target.value) || 0)}
                                placeholder="Amount"
                              />
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => setEditingBeneficiary(null)}>Save</Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingBeneficiary(null)}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <h4 className="font-medium">{beneficiary.name}</h4>
                            <p className="text-sm text-muted-foreground">{beneficiary.relationship}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">{beneficiary.allocation}%</p>
                            <p className="text-sm text-muted-foreground">
                              ${beneficiary.amount.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex flex-col space-y-1 ml-4">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setEditingBeneficiary(beneficiary.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => deleteBeneficiary(beneficiary.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribution Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Immediate Distribution</h4>
                    <p className="text-sm text-muted-foreground">Available immediately upon probate</p>
                    <p className="text-lg font-bold">$300,000</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Trust Distribution</h4>
                    <p className="text-sm text-muted-foreground">Through family trust over time</p>
                    <p className="text-lg font-bold">$485,000</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Special Provisions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900">Education Fund</h4>
                    <p className="text-sm text-blue-700">$50,000 allocated for grandchildren's education</p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900">Charitable Bequest</h4>
                    <p className="text-sm text-green-700">$25,000 to local hospital foundation</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tax-planning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Optimization Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64">
                  <BarChart data={taxProjections}>
                    <XAxis dataKey="scenario" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="estateTax" fill="#ef4444" name="Estate Tax" />
                    <Bar dataKey="probateFees" fill="#f59e0b" name="Probate Fees" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {taxProjections.map((scenario) => (
                <Card key={scenario.scenario}>
                  <CardHeader>
                    <CardTitle className="text-lg">{scenario.scenario}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Estate Tax</p>
                      <p className="text-lg font-bold text-red-600">
                        ${scenario.estateTax.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Probate Fees</p>
                      <p className="text-lg font-bold text-orange-600">
                        ${scenario.probateFees.toLocaleString()}
                      </p>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">Total Cost</p>
                      <p className="text-xl font-bold">
                        ${scenario.total.toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tax Planning Strategies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Asset Transfer Strategies</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Joint ownership with spouse</li>
                      <li>• Family trust establishment</li>
                      <li>• Life insurance optimization</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Income Splitting</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Spousal RRSP contributions</li>
                      <li>• Family loan strategies</li>
                      <li>• Trust income distributions</li>
                    </ul>
                  </div>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Potential Tax Savings</h4>
                  <p className="text-green-700">
                    Implementing optimized strategy could save approximately <strong>$24,000</strong> in estate costs
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            Schedule Consultation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EstateDetailDialog;
