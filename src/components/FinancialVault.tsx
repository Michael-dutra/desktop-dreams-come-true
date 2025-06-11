
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vault, Upload, FileText, Download, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const FinancialVault = () => {
  const documents = [
    {
      name: "2024 Tax Return",
      type: "Tax Document",
      uploadDate: "Mar 15, 2025",
      size: "2.4 MB",
      status: "verified",
      icon: <FileText className="h-4 w-4" />
    },
    {
      name: "Investment Portfolio Statement",
      type: "Investment",
      uploadDate: "Feb 28, 2025",
      size: "1.8 MB",
      status: "verified",
      icon: <FileText className="h-4 w-4" />
    },
    {
      name: "Life Insurance Policy",
      type: "Insurance",
      uploadDate: "Jan 20, 2025",
      size: "3.2 MB",
      status: "verified",
      icon: <FileText className="h-4 w-4" />
    },
    {
      name: "Mortgage Agreement",
      type: "Real Estate",
      uploadDate: "Dec 10, 2024",
      size: "4.1 MB",
      status: "verified",
      icon: <FileText className="h-4 w-4" />
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Vault className="h-5 w-5" />
            <span>Financial Vault</span>
          </div>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="text-muted-foreground">
                  {doc.icon}
                </div>
                <div>
                  <p className="font-medium text-sm">{doc.name}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>{doc.type}</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{doc.uploadDate}</span>
                    </span>
                    <span>{doc.size}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      {doc.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">Drag and drop files here, or click to browse</p>
          <Button variant="outline" size="sm">
            Select Files
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialVault;
