
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2, Check, X } from "lucide-react";

interface EditableFieldProps {
  fieldId: string;
  value: number;
  label: string;
  isEditable?: boolean;
  prefix?: string;
  suffix?: string;
  isAutoCalculated?: boolean;
  tip?: string;
  onValueChange?: (value: number) => void;
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
  onValueChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());

  const handleSave = () => {
    const numValue = parseFloat(editValue);
    if (!isNaN(numValue) && onValueChange) {
      onValueChange(numValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value.toString());
    setIsEditing(false);
  };

  const formatValue = (val: number) => {
    if (val >= 1000000) {
      return `${prefix}${(val / 1000000).toFixed(2)}M${suffix}`;
    } else if (val >= 1000) {
      return `${prefix}${(val / 1000).toFixed(0)}K${suffix}`;
    } else {
      return `${prefix}${val.toLocaleString()}${suffix}`;
    }
  };

  if (isEditing && isEditable) {
    return (
      <div className="flex items-center space-x-2">
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-32"
          type="number"
        />
        <Button size="sm" onClick={handleSave}>
          <Check className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={handleCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="font-medium">{formatValue(value)}</span>
      {isEditable && !isAutoCalculated && (
        <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
          <Edit2 className="h-4 w-4" />
        </Button>
      )}
      {tip && (
        <span className="text-xs text-gray-500">({tip})</span>
      )}
    </div>
  );
};
