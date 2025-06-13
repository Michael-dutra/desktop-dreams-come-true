import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FinancialFieldProps {
  fieldId: string;
  value: number;
  label: string;
  prefix?: string;
}

const FinancialField = ({ fieldId, value, label, prefix }: FinancialFieldProps) => {
  return (
    <div>
      <Label htmlFor={fieldId}>{label}</Label>
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-gray-500">
            {prefix}
          </div>
        )}
        <Input
          type="number"
          id={fieldId}
          value={value}
          className="pl-8"
        />
      </div>
    </div>
  );
};

export default FinancialField;
