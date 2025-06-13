
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AssetsDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AssetsDetailDialog = ({ open, onOpenChange }: AssetsDetailDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assets Details</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p>Assets details content goes here.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssetsDetailDialog;
