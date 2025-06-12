
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InsuranceCoverageCard } from "./InsuranceCoverageCard";
import { AddInsuranceCoverageDialog } from "./AddInsuranceCoverageDialog";

export interface InsuranceCoverage {
  id: string;
  type: "Term Life" | "Whole Life" | "Universal Life" | "Critical Illness" | "Disability";
  coverageAmount: number;
  insuredPerson: string;
  beneficiary: string;
  owner: string;
  startDate: string;
  expiryDate?: string;
  features: string;
  premiumFrequency?: "Monthly" | "Quarterly" | "Semi-Annual" | "Annual";
}

export const InsuranceCoverageTab = () => {
  const [coverages, setCoverages] = useState<InsuranceCoverage[]>([
    {
      id: "1",
      type: "Term Life",
      coverageAmount: 500000,
      insuredPerson: "John Doe",
      beneficiary: "Spouse + Children",
      owner: "Corporation",
      startDate: "2020-01-01",
      expiryDate: "2040-01-01",
      features: "Convertible to whole life, low-cost",
      premiumFrequency: "Monthly"
    },
    {
      id: "2",
      type: "Critical Illness",
      coverageAmount: 100000,
      insuredPerson: "John Doe",
      beneficiary: "Self",
      owner: "John Doe",
      startDate: "2021-03-15",
      features: "Covers 25 critical conditions",
      premiumFrequency: "Annual"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddCoverage = (newCoverage: Omit<InsuranceCoverage, "id">) => {
    const coverage: InsuranceCoverage = {
      ...newCoverage,
      id: Date.now().toString()
    };
    setCoverages([...coverages, coverage]);
  };

  const handleUpdateCoverage = (id: string, updatedCoverage: Partial<InsuranceCoverage>) => {
    setCoverages(coverages.map(coverage => 
      coverage.id === id ? { ...coverage, ...updatedCoverage } : coverage
    ));
  };

  const handleDeleteCoverage = (id: string) => {
    setCoverages(coverages.filter(coverage => coverage.id !== id));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalCoverage = coverages.reduce((sum, coverage) => sum + coverage.coverageAmount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Insurance Coverage Overview</span>
            <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Coverage
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Policies</p>
              <p className="text-2xl font-bold">{coverages.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Coverage</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalCoverage)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Coverage Types</p>
              <p className="text-2xl font-bold">{new Set(coverages.map(c => c.type)).size}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coverage Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coverages.map((coverage) => (
          <InsuranceCoverageCard
            key={coverage.id}
            coverage={coverage}
            onUpdate={(updatedCoverage) => handleUpdateCoverage(coverage.id, updatedCoverage)}
            onDelete={() => handleDeleteCoverage(coverage.id)}
          />
        ))}
      </div>

      {/* Add Coverage Dialog */}
      <AddInsuranceCoverageDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddCoverage}
      />
    </div>
  );
};
