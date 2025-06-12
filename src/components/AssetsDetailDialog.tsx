import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface AssetsDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssetsDetailDialog = ({ isOpen, onClose }: AssetsDetailDialogProps) => {
  const [address, setAddress] = useState("123 Main St, Anytown");
  const [currentFMV, setCurrentFMV] = useState(500000);
  const [futureValue, setFutureValue] = useState(600000);
  const [annualAppreciation, setAnnualAppreciation] = useState(2);
  const [insuranceProvider, setInsuranceProvider] = useState("Acme Insurance");
  const [policyNumber, setPolicyNumber] = useState("AX12345");
  const [coverageAmount, setCoverageAmount] = useState(550000);
  const [renewalDate, setRenewalDate] = useState<Date | undefined>(new Date());
  const [secondaryPropertyFMV, setSecondaryPropertyFMV] = useState(250000);
  const [secondaryPropertyFutureValue, setSecondaryPropertyFutureValue] = useState(300000);
  const [secondaryPropertyName, setSecondaryPropertyName] = useState("Secondary Property");

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleCurrentFMVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentFMV(Number(e.target.value));
  };

  const handleFutureValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFutureValue(Number(e.target.value));
  };

  const handleAnnualAppreciationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnnualAppreciation(Number(e.target.value));
  };

  const handleInsuranceProviderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInsuranceProvider(e.target.value);
  };

  const handlePolicyNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPolicyNumber(e.target.value);
  };

  const handleCoverageAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoverageAmount(Number(e.target.value));
  };

  const handleRenewalDateChange = (date: Date | undefined) => {
    setRenewalDate(date);
  };

  const handleSecondaryPropertyFMVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecondaryPropertyFMV(Number(e.target.value));
  };

  const handleSecondaryPropertyFutureValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecondaryPropertyFutureValue(Number(e.target.value));
  };

  const renderSecondaryPropertySection = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Property Name</label>
        <input
          type="text"
          value={secondaryPropertyName}
          onChange={(e) => setSecondaryPropertyName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          placeholder="Enter property name"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-700">Current FMV</label>
        <input
          type="number"
          value={secondaryPropertyFMV}
          onChange={(e) => setSecondaryPropertyFMV(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          placeholder="Current market value"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Future Value</label>
        <input
          type="number"
          value={secondaryPropertyFutureValue}
          onChange={(e) => setSecondaryPropertyFutureValue(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          placeholder="Projected future value"
        />
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Asset Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="address">Address</Label>
            <Input type="text" id="address" value={address} onChange={handleAddressChange} />
          </div>

          <div>
            <Label htmlFor="currentFMV">Current FMV</Label>
            <Input type="number" id="currentFMV" value={currentFMV} onChange={handleCurrentFMVChange} />
          </div>

          <div>
            <Label htmlFor="futureValue">Future Value</Label>
            <Input type="number" id="futureValue" value={futureValue} onChange={handleFutureValueChange} />
          </div>

          <div>
            <Label htmlFor="annualAppreciation">Annual Appreciation (%)</Label>
            <Input
              type="number"
              id="annualAppreciation"
              value={annualAppreciation}
              onChange={handleAnnualAppreciationChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="insuranceProvider">Insurance Provider</Label>
              <Input
                type="text"
                id="insuranceProvider"
                value={insuranceProvider}
                onChange={handleInsuranceProviderChange}
              />
            </div>

            <div>
              <Label htmlFor="policyNumber">Policy Number</Label>
              <Input
                type="text"
                id="policyNumber"
                value={policyNumber}
                onChange={handlePolicyNumberChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="coverageAmount">Coverage Amount</Label>
            <Input
              type="number"
              id="coverageAmount"
              value={coverageAmount}
              onChange={handleCoverageAmountChange}
            />
          </div>

          <div>
            <Label>Renewal Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={
                    "w-[240px] justify-start text-left font-normal" +
                    (renewalDate ? " text-foreground" : " text-muted-foreground")
                  }
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {renewalDate ? format(renewalDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={renewalDate}
                  onSelect={handleRenewalDateChange}
                  disabled={(date) =>
                    date > new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {renderSecondaryPropertySection()}
        </div>

        <Button type="submit">Save</Button>
      </DialogContent>
    </Dialog>
  );
};
