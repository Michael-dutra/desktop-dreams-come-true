
import React from 'react';

interface EditableFieldProps {
  fieldId: string;
  value: number;
  label: string;
  isEditable?: boolean;
  prefix?: string;
  suffix?: string;
  isAutoCalculated?: boolean;
  tip?: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  fieldId,
  value,
  label,
  isEditable = true,
  prefix = "",
  suffix = "",
  isAutoCalculated = false,
  tip
}) => {
  return (
    <div className="py-2">
      <span className="text-sm text-gray-600 block mb-1">{label}</span>
      <span className="font-medium text-left">
        {prefix}{value.toLocaleString()}{suffix}
      </span>
    </div>
  );
};
