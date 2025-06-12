
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Shield, Calendar, User, Users, DollarSign, FileText } from "lucide-react";
import { InsuranceCoverage } from "./InsuranceCoverageTab";

interface InsuranceCoverageCardProps {
  coverage: InsuranceCoverage;
  onUpdate: (updatedCoverage: Partial<InsuranceCoverage>) => void;
  onDelete: () => void;
  onEdit: () => void;
}

export const InsuranceCoverageCard = ({ coverage, onUpdate, onDelete, onEdit }: InsuranceCoverageCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Term Life":
        return "bg-blue-100 text-blue-800";
      case "Whole Life":
        return "bg-green-100 text-green-800";
      case "Universal Life":
        return "bg-purple-100 text-purple-800";
      case "Critical Illness":
        return "bg-orange-100 text-orange-800";
      case "Disability":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isDisability = coverage.type === "Disability";

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge className={getTypeColor(coverage.type)}>
            {coverage.type}
          </Badge>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Policy Number */}
        {coverage.policyNumber && (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Policy Number</p>
              <p className="text-sm font-medium font-mono">{coverage.policyNumber}</p>
            </div>
          </div>
        )}

        {/* Coverage Amount or Monthly Benefit */}
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-1">
            {isDisability ? (
              <DollarSign className="h-5 w-5 text-blue-600" />
            ) : (
              <Shield className="h-5 w-5 text-blue-600" />
            )}
            <span className="text-sm font-medium text-blue-600">
              {isDisability ? "Monthly Benefit" : "Coverage Amount"}
            </span>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {isDisability 
              ? `${formatCurrency(coverage.monthlyBenefit || 0)}/month`
              : formatCurrency(coverage.coverageAmount || 0)
            }
          </p>
        </div>

        {/* Premium Amount */}
        {coverage.premiumAmount && (
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-green-600">Premium</span>
            </div>
            <p className="text-lg font-semibold text-green-700">
              {formatCurrency(coverage.premiumAmount)}
              {coverage.premiumFrequency && (
                <span className="text-xs text-green-600 ml-1">
                  /{coverage.premiumFrequency.toLowerCase()}
                </span>
              )}
            </p>
          </div>
        )}

        {/* People Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Insured Person</p>
              <p className="text-sm font-medium">{coverage.insuredPerson}</p>
            </div>
          </div>

          {/* Only show beneficiary for non-disability insurance */}
          {!isDisability && coverage.beneficiary && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Beneficiary</p>
                <p className="text-sm font-medium">{coverage.beneficiary}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Owner</p>
              <p className="text-sm font-medium">{coverage.owner}</p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Policy Period</p>
            <p className="text-sm font-medium">
              {formatDate(coverage.startDate)}
              {coverage.expiryDate && ` - ${formatDate(coverage.expiryDate)}`}
            </p>
          </div>
        </div>

        {/* Premium Frequency */}
        {coverage.premiumFrequency && (
          <div>
            <p className="text-xs text-muted-foreground">Premium Frequency</p>
            <Badge variant="outline">{coverage.premiumFrequency}</Badge>
          </div>
        )}

        {/* Features */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Features</p>
          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded text-wrap">{coverage.features}</p>
        </div>
      </CardContent>
    </Card>
  );
};
