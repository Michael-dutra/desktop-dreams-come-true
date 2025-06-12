
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp, PieChart, BarChart3, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

const ReportsSection = () => {
  const [selections, setSelections] = useState({
    netWorth: false,
    assets: false,
    liabilities: false,
    cashFlow: false,
    insurance: false,
    retirement: false,
    aiGuidance: false,
    goals: false,
    actionItems: false,
    clientProfile: false
  });

  const reportSections = [
    { key: "netWorth", label: "Net Worth", icon: <TrendingUp className="h-4 w-4" /> },
    { key: "assets", label: "Assets", icon: <PieChart className="h-4 w-4" /> },
    { key: "liabilities", label: "Liabilities", icon: <BarChart3 className="h-4 w-4" /> },
    { key: "cashFlow", label: "Cash Flow", icon: <FileText className="h-4 w-4" /> },
    { key: "insurance", label: "Insurance", icon: <FileText className="h-4 w-4" /> },
    { key: "retirement", label: "Retirement", icon: <FileText className="h-4 w-4" /> },
    { key: "aiGuidance", label: "Recent AI Guidance", icon: <FileText className="h-4 w-4" /> },
    { key: "goals", label: "Goals", icon: <FileText className="h-4 w-4" /> },
    { key: "actionItems", label: "Action Items", icon: <FileText className="h-4 w-4" /> },
    { key: "clientProfile", label: "Client Profile", icon: <User className="h-4 w-4" /> }
  ];

  const handleSelectionChange = (section: string, checked: boolean) => {
    setSelections(prev => ({ ...prev, [section]: checked }));
  };

  const handleGenerateReport = () => {
    console.log("Generating report with selections:", selections);
    // Here you would implement the actual report generation logic
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Reports</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Generate Custom Report</h3>
          <div className="grid grid-cols-2 gap-6">
            {/* First column - 5 items */}
            <div className="space-y-3">
              {reportSections.slice(0, 5).map((section) => (
                <div key={section.key} className="flex items-center space-x-3">
                  <Checkbox 
                    id={section.key}
                    checked={selections[section.key as keyof typeof selections]}
                    onCheckedChange={(checked) => handleSelectionChange(section.key, checked as boolean)}
                  />
                  <div className="flex items-center space-x-2 flex-1">
                    <div className="text-muted-foreground">
                      {section.icon}
                    </div>
                    <label htmlFor={section.key} className="text-sm font-medium cursor-pointer">
                      {section.label}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Second column - 5 items */}
            <div className="space-y-3">
              {reportSections.slice(5, 10).map((section) => (
                <div key={section.key} className="flex items-center space-x-3">
                  <Checkbox 
                    id={section.key}
                    checked={selections[section.key as keyof typeof selections]}
                    onCheckedChange={(checked) => handleSelectionChange(section.key, checked as boolean)}
                  />
                  <div className="flex items-center space-x-2 flex-1">
                    <div className="text-muted-foreground">
                      {section.icon}
                    </div>
                    <label htmlFor={section.key} className="text-sm font-medium cursor-pointer">
                      {section.label}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={handleGenerateReport} className="w-full">
            Generate Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsSection;
