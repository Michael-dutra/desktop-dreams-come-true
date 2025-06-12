import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { InsuranceCoverage } from "./InsuranceCoverageTab";

interface AddInsuranceCoverageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (coverage: Omit<InsuranceCoverage, "id">) => void;
}

export const AddInsuranceCoverageDialog = ({ isOpen, onClose, onAdd }: AddInsuranceCoverageDialogProps) => {
  const [formData, setFormData] = useState({
    type: "" as InsuranceCoverage["type"],
    policyNumber: "",
    coverageAmount: 0,
    monthlyBenefit: 0,
    insuredPerson: "",
    beneficiary: "",
    owner: "",
    startDate: "",
    expiryDate: "",
    features: "",
    premiumFrequency: "" as InsuranceCoverage["premiumFrequency"],
    premiumAmount: 0
  });

  const isDisability = formData.type === "Disability";

  const getDefaultFeatures = (type: InsuranceCoverage["type"]) => {
    switch (type) {
      case "Term Life":
        return "Convertible to whole life, guaranteed renewable";
      case "Whole Life":
        return "Cash value accumulation, guaranteed death benefit";
      case "Universal Life":
        return "Flexible premiums, investment component";
      case "Critical Illness":
        return "Covers 25 critical conditions, return of premium option";
      case "Disability":
        return "Own occupation coverage, 90-day elimination period";
      default:
        return "";
    }
  };

  const handleTypeChange = (type: InsuranceCoverage["type"]) => {
    setFormData({
      ...formData,
      type,
      features: getDefaultFeatures(type)
    });
  };

  const handleSubmit = () => {
    if (!formData.type || !formData.insuredPerson || !formData.owner || !formData.startDate) {
      return; // Basic validation
    }

    // For disability insurance, don't require beneficiary
    if (!isDisability && !formData.beneficiary) {
      return;
    }

    const coverageData: any = {
      type: formData.type,
      policyNumber: formData.policyNumber || undefined,
      insuredPerson: formData.insuredPerson,
      owner: formData.owner,
      startDate: formData.startDate,
      expiryDate: formData.expiryDate || undefined,
      features: formData.features,
      premiumFrequency: formData.premiumFrequency || undefined,
      premiumAmount: formData.premiumAmount || undefined
    };

    if (isDisability) {
      coverageData.monthlyBenefit = formData.monthlyBenefit;
      coverageData.coverageAmount = undefined;
      coverageData.beneficiary = undefined;
    } else {
      coverageData.coverageAmount = formData.coverageAmount;
      coverageData.beneficiary = formData.beneficiary;
      coverageData.monthlyBenefit = undefined;
    }

    onAdd(coverageData);

    // Reset form
    setFormData({
      type: "" as InsuranceCoverage["type"],
      policyNumber: "",
      coverageAmount: 0,
      monthlyBenefit: 0,
      insuredPerson: "",
      beneficiary: "",
      owner: "",
      startDate: "",
      expiryDate: "",
      features: "",
      premiumFrequency: "" as InsuranceCoverage["premiumFrequency"],
      premiumAmount: 0
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Insurance Coverage</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Insurance Type</Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select insurance type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Term Life">Term Life</SelectItem>
                  <SelectItem value="Whole Life">Whole Life</SelectItem>
                  <SelectItem value="Universal Life">Universal Life</SelectItem>
                  <SelectItem value="Critical Illness">Critical Illness</SelectItem>
                  <SelectItem value="Disability">Disability</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="policyNumber">Policy Number (Optional)</Label>
              <Input
                id="policyNumber"
                value={formData.policyNumber}
                onChange={(e) => setFormData({...formData, policyNumber: e.target.value})}
                placeholder="TL-2024-001234"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={isDisability ? "monthlyBenefit" : "coverageAmount"}>
                {isDisability ? "Monthly Benefit" : "Coverage Amount"}
              </Label>
              <Input
                id={isDisability ? "monthlyBenefit" : "coverageAmount"}
                type="number"
                value={isDisability ? formData.monthlyBenefit : formData.coverageAmount}
                onChange={(e) => setFormData({
                  ...formData,
                  [isDisability ? "monthlyBenefit" : "coverageAmount"]: Number(e.target.value)
                })}
                placeholder={isDisability ? "5000" : "500000"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="premiumAmount">Premium Amount (Optional)</Label>
              <Input
                id="premiumAmount"
                type="number"
                value={formData.premiumAmount}
                onChange={(e) => setFormData({...formData, premiumAmount: Number(e.target.value)})}
                placeholder="125"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="insuredPerson">Insured Person</Label>
              <Input
                id="insuredPerson"
                value={formData.insuredPerson}
                onChange={(e) => setFormData({...formData, insuredPerson: e.target.value})}
                placeholder="John Doe"
              />
            </div>

            {!isDisability && (
              <div className="space-y-2">
                <Label htmlFor="beneficiary">Beneficiary</Label>
                <Input
                  id="beneficiary"
                  value={formData.beneficiary}
                  onChange={(e) => setFormData({...formData, beneficiary: e.target.value})}
                  placeholder="Spouse + Children"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="owner">Policy Owner</Label>
              <Input
                id="owner"
                value={formData.owner}
                onChange={(e) => setFormData({...formData, owner: e.target.value})}
                placeholder="Corporation"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="premiumAmount">Premium Amount (Optional)</Label>
              <Input
                id="premiumAmount"
                type="number"
                value={formData.premiumAmount}
                onChange={(e) => setFormData({...formData, premiumAmount: Number(e.target.value)})}
                placeholder="125"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="premiumFrequency">Premium Frequency (Optional)</Label>
              <Select value={formData.premiumFrequency} onValueChange={(value: InsuranceCoverage["premiumFrequency"]) => 
                setFormData({...formData, premiumFrequency: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Semi-Annual">Semi-Annual</SelectItem>
                  <SelectItem value="Annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="features">Features / Notes</Label>
            <Textarea
              id="features"
              value={formData.features}
              onChange={(e) => setFormData({...formData, features: e.target.value})}
              placeholder="Insurance-specific features and notes"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Add Coverage
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
