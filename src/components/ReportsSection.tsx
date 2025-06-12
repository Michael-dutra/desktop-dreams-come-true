
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Calendar, TrendingUp, PieChart, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const ReportsSection = () => {
  const [filterType, setFilterType] = useState("all");

  const allReports = [
    {
      icon: <PieChart className="h-4 w-4" />,
      title: "Portfolio Performance Report",
      description: "Q4 2024 detailed analysis",
      date: "Generated Dec 15, 2024",
      color: "text-blue-600",
      type: "section",
    },
    {
      icon: <BarChart3 className="h-4 w-4" />,
      title: "Tax Optimization Summary",
      description: "2024 tax year recommendations",
      date: "Generated Dec 10, 2024",
      color: "text-green-600",
      type: "section",
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      title: "Net Worth Projection",
      description: "5-year financial forecast",
      date: "Generated Dec 8, 2024",
      color: "text-purple-600",
      type: "section",
    },
    {
      icon: <FileText className="h-4 w-4" />,
      title: "Comprehensive Financial Report",
      description: "Complete client analysis and recommendations",
      date: "Generated Dec 5, 2024",
      color: "text-orange-600",
      type: "full",
    },
    {
      icon: <FileText className="h-4 w-4" />,
      title: "Annual Financial Review",
      description: "Year-end comprehensive assessment",
      date: "Generated Dec 1, 2024",
      color: "text-red-600",
      type: "full",
    },
  ];

  const filteredReports = filterType === "all" 
    ? allReports 
    : allReports.filter(report => report.type === filterType);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Reports</span>
          </CardTitle>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="section">By Section</SelectItem>
              <SelectItem value="full">Full Report</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredReports.map((report, index) => (
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
      </CardContent>
    </Card>
  );
};

export default ReportsSection;
