import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, DollarSign, TrendingUp, Calendar, Briefcase } from "lucide-react";

interface BusinessDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RevenueSource {
  id: string;
  source: string;
  amount: number;
  frequency: "Monthly" | "Quarterly" | "Annually";
  category: "Sales" | "Services" | "Other";
}

interface BusinessExpense {
  id: string;
  category: string;
  amount: number;
  frequency: "Monthly" | "Quarterly" | "Annually";
  type: "Operating" | "Administrative" | "Other";
}

export const BusinessDetailDialog = ({ isOpen, onClose }: BusinessDetailDialogProps) => {
  const [revenueStreams, setRevenueStreams] = useState<RevenueSource[]>([
    { id: "1", source: "Product Sales", amount: 50000, frequency: "Monthly", category: "Sales" },
    { id: "2", source: "Consulting", amount: 15000, frequency: "Monthly", category: "Services" },
  ]);

  const [businessExpenses, setBusinessExpenses] = useState<BusinessExpense[]>([
    { id: "1", category: "Rent", amount: 8000, frequency: "Monthly", type: "Operating" },
    { id: "2", category: "Salaries", amount: 30000, frequency: "Monthly", type: "Administrative" },
  ]);

  const [showAddRevenue, setShowAddRevenue] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const [newRevenue, setNewRevenue] = useState({
    source: "",
    amount: 0,
    frequency: "Monthly" as "Monthly" | "Quarterly" | "Annually",
    category: "Sales" as "Sales" | "Services" | "Other"
  });

  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: 0,
    frequency: "Monthly" as "Monthly" | "Quarterly" | "Annually",
    type: "Operating" as "Operating" | "Administrative" | "Other"
  });

  const handleAddRevenue = () => {
    if (newRevenue.source.trim() && newRevenue.amount > 0) {
      const revenue: RevenueSource = {
        id: Date.now().toString(),
        source: newRevenue.source,
        amount: newRevenue.amount,
        frequency: newRevenue.frequency,
        category: newRevenue.category
      };
      setRevenueStreams([...revenueStreams, revenue]);
      setNewRevenue({ source: "", amount: 0, frequency: "Monthly", category: "Sales" });
      setShowAddRevenue(false);
    }
  };

  const handleAddExpense = () => {
    if (newExpense.category.trim() && newExpense.amount > 0) {
      const expense: BusinessExpense = {
        id: Date.now().toString(),
        category: newExpense.category,
        amount: newExpense.amount,
        frequency: newExpense.frequency,
        type: newExpense.type
      };
      setBusinessExpenses([...businessExpenses, expense]);
      setNewExpense({ category: "", amount: 0, frequency: "Monthly", type: "Operating" });
      setShowAddExpense(false);
    }
  };

  const handleDeleteRevenue = (id: string) => {
    setRevenueStreams(revenueStreams.filter(r => r.id !== id));
  };

  const handleDeleteExpense = (id: string) => {
    setBusinessExpenses(businessExpenses.filter(e => e.id !== id));
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    } else {
      return `$${value.toLocaleString()}`;
    }
  };

  const calculateAnnualAmount = (amount: number, frequency: string) => {
    switch (frequency) {
      case "Monthly":
        return amount * 12;
      case "Quarterly":
        return amount * 4;
      case "Annually":
        return amount;
      default:
        return amount;
    }
  };

  const totalAnnualRevenue = revenueStreams.reduce((sum, r) => sum + calculateAnnualAmount(r.amount, r.frequency), 0);
  const totalAnnualExpenses = businessExpenses.reduce((sum, e) => sum + calculateAnnualAmount(e.amount, e.frequency), 0);
  const netIncome = totalAnnualRevenue - totalAnnualExpenses;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Business Financial Details
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue">Revenue Streams</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Revenue Streams</CardTitle>
                <Button size="sm" onClick={() => setShowAddRevenue(true)}>
                  Add Revenue
                </Button>
              </CardHeader>
              <CardContent>
                {revenueStreams.length === 0 ? (
                  <p className="text-muted-foreground">No revenue streams added yet.</p>
                ) : (
                  <div className="space-y-3">
                    {revenueStreams.map((rev) => (
                      <div key={rev.id} className="flex justify-between items-center p-3 border rounded-md bg-white">
                        <div>
                          <p className="font-medium">{rev.source}</p>
                          <p className="text-sm text-muted-foreground">{rev.category} - {rev.frequency}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-semibold">{formatCurrency(rev.amount)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRevenue(rev.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add Revenue Dialog */}
            <Dialog open={showAddRevenue} onOpenChange={setShowAddRevenue}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Revenue Stream</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Source</label>
                    <Input
                      value={newRevenue.source}
                      onChange={(e) => setNewRevenue({ ...newRevenue, source: e.target.value })}
                      placeholder="e.g., Product Sales"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Amount</label>
                    <Input
                      type="number"
                      value={newRevenue.amount}
                      onChange={(e) => setNewRevenue({ ...newRevenue, amount: Number(e.target.value) })}
                      placeholder="e.g., 50000"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Frequency</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      value={newRevenue.frequency}
                      onChange={(e) => setNewRevenue({ ...newRevenue, frequency: e.target.value as "Monthly" | "Quarterly" | "Annually" })}
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Annually">Annually</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      value={newRevenue.category}
                      onChange={(e) => setNewRevenue({ ...newRevenue, category: e.target.value as "Sales" | "Services" | "Other" })}
                    >
                      <option value="Sales">Sales</option>
                      <option value="Services">Services</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowAddRevenue(false)}>Cancel</Button>
                    <Button onClick={handleAddRevenue}>Add</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Business Expenses</CardTitle>
                <Button size="sm" onClick={() => setShowAddExpense(true)}>
                  Add Expense
                </Button>
              </CardHeader>
              <CardContent>
                {businessExpenses.length === 0 ? (
                  <p className="text-muted-foreground">No expenses added yet.</p>
                ) : (
                  <div className="space-y-3">
                    {businessExpenses.map((exp) => (
                      <div key={exp.id} className="flex justify-between items-center p-3 border rounded-md bg-white">
                        <div>
                          <p className="font-medium">{exp.category}</p>
                          <p className="text-sm text-muted-foreground">{exp.type} - {exp.frequency}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-semibold">{formatCurrency(exp.amount)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add Expense Dialog */}
            <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Business Expense</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Input
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                      placeholder="e.g., Rent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Amount</label>
                    <Input
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                      placeholder="e.g., 8000"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Frequency</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      value={newExpense.frequency}
                      onChange={(e) => setNewExpense({ ...newExpense, frequency: e.target.value as "Monthly" | "Quarterly" | "Annually" })}
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Annually">Annually</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      value={newExpense.type}
                      onChange={(e) => setNewExpense({ ...newExpense, type: e.target.value as "Operating" | "Administrative" | "Other" })}
                    >
                      <option value="Operating">Operating</option>
                      <option value="Administrative">Administrative</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowAddExpense(false)}>Cancel</Button>
                    <Button onClick={handleAddExpense}>Add</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <DollarSign className="mx-auto mb-2 h-6 w-6 text-green-600" />
                    <p className="text-lg font-bold text-green-800">{formatCurrency(totalAnnualRevenue)}</p>
                    <p className="text-sm text-green-700">Annual Revenue</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <DollarSign className="mx-auto mb-2 h-6 w-6 text-red-600" />
                    <p className="text-lg font-bold text-red-800">{formatCurrency(totalAnnualExpenses)}</p>
                    <p className="text-sm text-red-700">Annual Expenses</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <TrendingUp className="mx-auto mb-2 h-6 w-6 text-blue-600" />
                    <p className={`text-lg font-bold ${netIncome >= 0 ? "text-blue-800" : "text-red-800"}`}>
                      {formatCurrency(netIncome)}
                    </p>
                    <p className="text-sm text-blue-700">Net Income</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
