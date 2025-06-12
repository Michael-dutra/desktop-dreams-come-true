
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Calendar, TrendingUp, PieChart, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const ReportsSection = () => {
  const [selections, setSelections] = useState({
    netWorth: "",
    assets: "",
    liabilities: "",
    cashFlow: "",
    insurance: "",
    retirement: "",
    aiGuidance: "",
    goals: "",
    actionItems: ""
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
    { key: "actionItems", label: "Action Items", icon: <FileText className="h-4 w-4" /> }
  ];

  const recentReports = [
    {
      icon: <PieChart className="h-4 w-4" />,
      title: "Portfolio Performance Report",
      description: "Q4 2024 detailed analysis",
      date: "Generated Dec 15, 2024",
      color: "text-blue-600",
    },
    {
      icon: <BarChart3 className="h-4 w-4" />,
      title: "Tax Optimization Summary",
      description: "2024 tax year recommendations",
      date: "Generated Dec 10, 2024",
      color: "text-green-600",
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      title: "Net Worth Projection",
      description: "5-year financial forecast",
      date: "Generated Dec 8, 2024",
      color: "text-purple-600",
    }
  ];

  const handleSelectionChange = (section: string, value: string) => {
    setSelections(prev => ({ ...prev, [section]: value }));
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
        <div className="space-y-6">
          {/* Report Generation Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Generate Custom Report</h3>
            <div className="space-y-3">
              {reportSections.map((section) => (
                <div key={section.key} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 flex-1">
                    <div className="text-muted-foreground">
                      {section.icon}
                    </div>
                    <span className="text-sm font-medium min-w-0 flex-1">{section.label}</span>
                  </div>
                  <Select 
                    value={selections[section.key as keyof typeof selections]} 
                    onValueChange={(value) => handleSelectionChange(section.key, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Summary</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                      <SelectItem value="analysis">Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            <Button onClick={handleGenerateReport} className="w-full">
              Generate Report
            </Button>
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Recent Reports Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Recent Reports</h3>
            {recentReports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`${report.color}`}>
                    {report.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{report.title}</p>
                    <p className="text-xs text-muted-foreground">{report.description}</p>
                    <p className="text-xs text-muted-foreground flex items-center space-x-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{report.date}</span>
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsSection;
