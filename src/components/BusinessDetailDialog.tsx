import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react";

interface BusinessDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BusinessRegistration {
  businessName: string;
  registrationNumber: string;
  address: string;
}

export const BusinessDetailDialog = ({ isOpen, onClose }: BusinessDetailDialogProps) => {
  const [businessRegistration, setBusinessRegistration] = useState<BusinessRegistration>({
    businessName: '',
    registrationNumber: '',
    address: '',
  });

  const handleBusinessRegistrationChange = (field: keyof typeof businessRegistration, value: string | number) => {
    setBusinessRegistration(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value : value.toString()
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Business Registration Details</DialogTitle>
          <DialogDescription>
            Enter your business registration information here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="businessName" className="text-right">
              Business Name
            </Label>
            <Input
              id="businessName"
              value={businessRegistration.businessName}
              onChange={(e) => handleBusinessRegistrationChange('businessName', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="registrationNumber" className="text-right">
              Registration Number
            </Label>
            <Input
              id="registrationNumber"
              value={businessRegistration.registrationNumber}
              onChange={(e) => handleBusinessRegistrationChange('registrationNumber', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input
              id="address"
              value={businessRegistration.address}
              onChange={(e) => handleBusinessRegistrationChange('address', e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
