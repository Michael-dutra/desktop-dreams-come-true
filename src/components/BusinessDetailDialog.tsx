
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LCGEQualificationCheck from "./LCGEQualificationCheck";
import InvestmentsTab from "./InvestmentsTab";

interface BusinessDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BusinessDetailDialog = ({ open, onOpenChange }: BusinessDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Business Details</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Business Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Company Name:</span> ABC Manufacturing Ltd.</p>
                    <p><span className="font-medium">Industry:</span> Manufacturing</p>
                    <p><span className="font-medium">Incorporation Date:</span> January 2018</p>
                    <p><span className="font-medium">Business Number:</span> 123456789RC0001</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Financial Overview</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Annual Revenue:</span> $485,000</p>
                    <p><span className="font-medium">Current Valuation:</span> $3.88M</p>
                    <p><span className="font-medium">Employees:</span> 12</p>
                    <p><span className="font-medium">Ownership:</span> 100%</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="assets" className="mt-6">
            <LCGEQualificationCheck />
          </TabsContent>
          
          <TabsContent value="investments" className="mt-6">
            <InvestmentsTab />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessDetailDialog;
