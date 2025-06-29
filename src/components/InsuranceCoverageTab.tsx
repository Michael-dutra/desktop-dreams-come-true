
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InsuranceCoverageCard } from "./InsuranceCoverageCard";
import { AddInsuranceCoverageDialog } from "./AddInsuranceCoverageDialog";
import { EditInsuranceCoverageDialog } from "./EditInsuranceCoverageDialog";

export interface InsuranceCoverage {
  id: string;
  type: "Term Life" | "Whole Life" | "Universal Life" | "Critical Illness" | "Disability";
  policyNumber?: string; // New field for policy number
  coverageAmount?: number; // Optional for disability
  monthlyBenefit?: number; // For disability insurance
  insuredPerson: string;
  beneficiary?: string; // Optional for disability
  owner: string;
  startDate: string;
  expiryDate?: string;
  features: string;
  premiumFrequency?: "Monthly" | "Quarterly" | "Semi-Annual" | "Annual";
  premiumAmount?: number; // New field for premium amount
}

export const InsuranceCoverageTab = () => {
  const [coverages, setCoverages] = useState<InsuranceCoverage[]>([
    {
      id: "1",
      type: "Term Life",
      policyNumber: "TL-2020-001234",
      coverageAmount: 500000,
      insuredPerson: "John Doe",
      beneficiary: "Spouse + Children",
      owner: "Corporation",
      startDate: "2020-01-01",
      expiryDate: "2040-01-01",
      features: "Convertible to whole life, guaranteed renewable",
      premiumFrequency: "Monthly",
      premiumAmount: 125
    },
    {
      id: "2",
      type: "Critical Illness",
      policyNumber: "CI-2021-005678",
      coverageAmount: 100000,
      insuredPerson: "John Doe",
      beneficiary: "Self",
      owner: "John Doe",
      startDate: "2021-03-15",
      features: "Covers 25 critical conditions, return of premium option",
      premiumFrequency: "Annual",
      premiumAmount: 850
    },
    {
      id: "3",
      type: "Disability",
      policyNumber: "DI-2019-009876",
      monthlyBenefit: 5000,
      insuredPerson: "John Doe",
      owner: "John Doe",
      startDate: "2019-06-01",
      features: "Own occupation coverage, 90-day elimination period",
      premiumFrequency: "Monthly",
      premiumAmount: 320
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCoverage, setEditingCoverage] = useState<InsuranceCoverage | null>(null);

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

  const handleEditCoverage = (coverage: InsuranceCoverage) => {
    setEditingCoverage(coverage);
  };

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
      </Card>

      {/* Coverage Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coverages.map((coverage) => (
          <InsuranceCoverageCard
            key={coverage.id}
            coverage={coverage}
            onUpdate={(updatedCoverage) => handleUpdateCoverage(coverage.id, updatedCoverage)}
            onDelete={() => handleDeleteCoverage(coverage.id)}
            onEdit={() => handleEditCoverage(coverage)}
          />
        ))}
      </div>

      {/* Add Coverage Dialog */}
      <AddInsuranceCoverageDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddCoverage}
      />

      {/* Edit Coverage Dialog */}
      {editingCoverage && (
        <EditInsuranceCoverageDialog
          isOpen={!!editingCoverage}
          onClose={() => setEditingCoverage(null)}
          onUpdate={(updatedCoverage) => {
            handleUpdateCoverage(editingCoverage.id, updatedCoverage);
            setEditingCoverage(null);
          }}
          coverage={editingCoverage}
        />
      )}
    </div>
  );
};
