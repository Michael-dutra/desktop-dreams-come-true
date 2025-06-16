
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditableFieldProps {
  fieldId: string;
  value: number;
  label: string;
  isEditable?: boolean;
  prefix?: string;
  suffix?: string;
  isAutoCalculated?: boolean;
  tip?: string;
  onChange?: (value: number) => void;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  fieldId,
  value,
  label,
  isEditable = true,
  prefix = "",
  suffix = "",
  isAutoCalculated = false,
  tip,
  onChange
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0;
    onChange?.(newValue);
  };

  const displayValue = `${prefix}${value.toLocaleString()}${suffix}`;

  return (
    <div className="space-y-1">
      <Label htmlFor={fieldId} className="text-sm font-medium">
        {label}
        {isAutoCalculated && (
          <span className="text-xs text-gray-500 ml-1">(calculated)</span>
        )}
      </Label>
      {isEditable && !isAutoCalculated ? (
        <Input
          id={fieldId}
          type="number"
          value={value}
          onChange={handleChange}
          className="w-full"
        />
      ) : (
        <div className="p-2 bg-gray-50 rounded border text-sm">
          {displayValue}
        </div>
      )}
      {tip && (
        <p className="text-xs text-gray-500">{tip}</p>
      )}
    </div>
  );
};
