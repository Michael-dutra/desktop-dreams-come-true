
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { LifeInsuranceCalculator } from "./LifeInsuranceCalculator";
import { CriticalIllnessCalculator } from "./CriticalIllnessCalculator";
import { DisabilityCalculator } from "./DisabilityCalculator";

interface InsuranceDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InsuranceDetailDialog = ({ isOpen, onClose }: InsuranceDetailDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Insurance Details</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList>
            <TabsTrigger value="calculator">Life Insurance Calculator</TabsTrigger>
            <TabsTrigger value="critical">Critical Illness Calculator</TabsTrigger>
            <TabsTrigger value="disability">Disability Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <LifeInsuranceCalculator />
          </TabsContent>

          <TabsContent value="critical" className="space-y-6">
            <CriticalIllnessCalculator />
          </TabsContent>

          <TabsContent value="disability" className="space-y-6">
            <DisabilityCalculator />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
