
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, AlertTriangle, CheckCircle, TrendingUp, Shield } from "lucide-react";

interface BusinessDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const BusinessDetailDialog: React.FC<BusinessDetailDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const riskAssessments = [
    {
      category: "Key Person Risk",
      status: "well-covered",
      coverage: "$2.5M Key Person Life Insurance",
      assessment: "Your business has excellent key person coverage with $2.5M in life insurance on critical leadership. This amount represents approximately 5x annual salary and covers recruitment, training, and business continuity costs. The coverage is well-structured and provides adequate protection for business operations in case of unexpected loss of key personnel.",
      recommendation: "Current coverage is appropriate. Review annually as business grows."
    },
    {
      category: "Business Interruption",
      status: "moderate",
      coverage: "$750K Annual Coverage",
      assessment: "Current business interruption coverage of $750K provides protection for approximately 18 months of operations. While this covers basic operating expenses, it may be insufficient for extended disruptions or major market downturns. Consider that technology businesses often face longer recovery periods due to client relationship rebuilding.",
      recommendation: "Consider increasing to $1.2M to cover 24-30 months of operations and include additional client retention costs."
    },
    {
      category: "Professional Liability",
      status: "needs-attention",
      coverage: "$1M General Coverage",
      assessment: "Your current $1M professional liability coverage is below industry standards for a business of your size and revenue level. Technology consulting firms typically carry $2-5M in coverage due to the high-value nature of client projects and potential for significant financial impact from errors or omissions. The current coverage exposes the business to substantial financial risk.",
      recommendation: "Immediately increase professional liability coverage to at least $3M. Consider industry-specific technology errors & omissions insurance."
    },
    {
      category: "Cyber Liability",
      status: "well-covered",
      coverage: "$2M Cyber Protection",
      assessment: "Excellent cyber liability coverage at $2M provides comprehensive protection against data breaches, ransomware, and business interruption from cyber events. This coverage includes both first-party costs (incident response, legal fees, notification costs) and third-party liability. The amount is appropriate for your business size and industry risk profile.",
      recommendation: "Coverage is excellent. Monitor emerging cyber threats and adjust coverage as business scales."
    },
    {
      category: "Directors & Officers",
      status: "moderate",
      coverage: "$1.5M D&O Coverage",
      assessment: "Your D&O coverage of $1.5M provides reasonable protection for management decisions and fiduciary responsibilities. However, as your business grows and potentially considers outside investment or expansion, higher coverage limits may be necessary. The current amount covers most standard claims but could be insufficient for complex litigation or regulatory actions.",
      recommendation: "Consider increasing to $3M as business approaches next growth phase. Add employment practices liability if not included."
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "well-covered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "moderate":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "needs-attention":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Shield className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "well-covered":
        return "bg-green-100 text-green-800 border-green-200";
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "needs-attention":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Building2 className="h-6 w-6 text-indigo-600" />
            </div>
            <span>Business Insurance Risk Assessment</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-6">
            {riskAssessments.map((risk, index) => (
              <Card key={index} className="border-l-4 border-l-indigo-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center space-x-3">
                      {getStatusIcon(risk.status)}
                      <span>{risk.category}</span>
                    </CardTitle>
                    <Badge 
                      variant="secondary" 
                      className={`${getStatusColor(risk.status)} font-medium`}
                    >
                      {risk.status === "well-covered" && "Well Covered"}
                      {risk.status === "moderate" && "Moderate Risk"}
                      {risk.status === "needs-attention" && "Needs Attention"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Current Coverage</p>
                    <p className="font-semibold text-indigo-600">{risk.coverage}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Risk Assessment</p>
                    <p className="text-sm leading-relaxed text-gray-700">
                      {risk.assessment}
                    </p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-800 mb-1">Recommendation</p>
                    <p className="text-sm text-blue-700">
                      {risk.recommendation}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-indigo-800">
                <TrendingUp className="h-5 w-5" />
                <span>Overall Business Risk Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-indigo-700 leading-relaxed">
                Your business maintains a <strong>moderate to good</strong> insurance risk profile. Key person and cyber liability coverage are excellent and align with industry best practices. However, professional liability coverage requires immediate attention given your business size and industry exposure. Business interruption and D&O coverage are adequate but should be enhanced as the business continues its growth trajectory.
              </p>
              <div className="mt-4 p-3 bg-white rounded-lg border border-indigo-200">
                <p className="text-sm font-medium text-indigo-800 mb-1">Priority Action Items</p>
                <ul className="text-sm text-indigo-700 space-y-1">
                  <li>• Increase professional liability coverage to $3M minimum</li>
                  <li>• Review business interruption coverage for 24-30 month protection</li>
                  <li>• Plan D&O coverage increase for next growth phase</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessDetailDialog;
