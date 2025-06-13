
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Copy, Edit, FileDown } from "lucide-react";

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssetsDetailDialog: React.FC<AssetsDetailDialogProps> = ({ isOpen, onClose }) => {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState("456 Investment Lane");
  const [city, setCity] = useState("City");
  const [province, setProvince] = useState("Province");

  const handleAddressEdit = () => {
    setIsEditingAddress(!isEditingAddress);
  };

  const handleCopy = () => {
    // Copy functionality
    navigator.clipboard.writeText("Assets report copied to clipboard");
  };

  const handleEdit = () => {
    // Edit functionality
    console.log("Edit assets report");
  };

  const handleExportPDF = () => {
    // Export to PDF functionality
    console.log("Exporting assets to PDF");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold">Assets Report</DialogTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <FileDown className="w-4 h-4 mr-2" />
              Export to PDF
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-6">
          {/* Primary Residence Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Primary Residence</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Current Market Value</Label>
                <Input value="$620,000" readOnly />
              </div>
              <div>
                <Label>Purchase Price</Label>
                <Input value="$520,000" readOnly />
              </div>
            </div>
          </div>

          <Separator />

          {/* Secondary Property Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Secondary Property</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Current Market Value</Label>
                <Input value="$450,000" readOnly />
              </div>
              <div>
                <Label>Purchase Price</Label>
                <Input value="$380,000" readOnly />
              </div>
            </div>

            {/* Editable Address Section */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Property Address</h4>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddressEdit}
                >
                  {isEditingAddress ? "Save" : "Edit"}
                </Button>
              </div>
              
              {isEditingAddress ? (
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label>Street Address</Label>
                    <Input 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street address"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>City</Label>
                      <Input 
                        value={city} 
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label>Province</Label>
                      <Input 
                        value={province} 
                        onChange={(e) => setProvince(e.target.value)}
                        placeholder="Province"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-700">
                  {address}, {city}, {province}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* RRSP Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">RRSP</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Current Value</Label>
                <Input value="$52,000" readOnly />
              </div>
              <div>
                <Label>Contribution Room</Label>
                <Input value="$15,000" readOnly />
              </div>
            </div>
          </div>

          <Separator />

          {/* TFSA Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">TFSA</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Current Value</Label>
                <Input value="$38,000" readOnly />
              </div>
              <div>
                <Label>Contribution Room</Label>
                <Input value="$22,000" readOnly />
              </div>
            </div>
          </div>

          <Separator />

          {/* Non-Registered Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Non-Registered Investments</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Current Value</Label>
                <Input value="$25,000" readOnly />
              </div>
              <div>
                <Label>Annual Contribution</Label>
                <Input value="$5,000" readOnly />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssetsDetailDialog;
