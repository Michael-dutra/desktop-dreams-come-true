
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AssetDetailFieldProps {
  fieldId: string;
  value: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isEditable?: boolean;
  prefix?: string;
}

export const AssetDetailField: React.FC<AssetDetailFieldProps> = ({
  fieldId,
  value,
  label,
  onChange,
  isEditable = false,
  prefix,
}) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor={fieldId}>{label}</Label>
      <div className="flex items-center">
        {prefix && <span className="mr-1 text-gray-500">{prefix}</span>}
        <Input
          id={fieldId}
          value={value}
          onChange={onChange}
          readOnly={!isEditable}
        />
      </div>
    </div>
  );
};
