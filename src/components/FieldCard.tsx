
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit2, Check, X, Info } from "lucide-react";

interface FieldCardProps {
  label: string;
  value: string | number;
  isEditable?: boolean;
  isAutoCalculated?: boolean;
  onSave?: (value: string) => void;
  tooltip?: string;
  tip?: string;
  type?: "currency" | "percentage" | "number" | "text";
  variant?: "current" | "future" | "tax" | "net" | "growth" | "default";
}

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case "current":
      return "bg-blue-50 border-blue-200 text-blue-900";
    case "future":
      return "bg-green-50 border-green-200 text-green-900";
    case "tax":
      return "bg-red-50 border-red-200 text-red-900";
    case "net":
      return "bg-purple-50 border-purple-200 text-purple-900";
    case "growth":
      return "bg-emerald-50 border-emerald-200 text-emerald-900";
    default:
      return "bg-gray-50 border-gray-200 text-gray-900";
  }
};

export const FieldCard = ({
  label,
  value,
  isEditable = true,
  isAutoCalculated = false,
  onSave,
  tooltip,
  tip,
  type = "text",
  variant = "default"
}: FieldCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());

  const handleSave = () => {
    if (onSave) {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value.toString());
    setIsEditing(false);
  };

  const formatValue = (val: string | number) => {
    if (type === "currency") {
      const numVal = typeof val === "string" ? parseFloat(val) : val;
      return `$${numVal.toLocaleString()}`;
    }
    if (type === "percentage") {
      return `${val}%`;
    }
    return val.toString();
  };

  const variantStyles = getVariantStyles(variant);

  return (
    <div className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${variantStyles}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm">{label}</h4>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 opacity-60" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {isEditable && !isAutoCalculated && !isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
          >
            <Edit2 className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-8 text-sm"
            autoFocus
          />
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={handleSave}
              className="h-6 px-2 text-xs"
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="h-6 px-2 text-xs"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-lg font-bold mb-1">
            {formatValue(value)}
          </div>
          {isAutoCalculated && (
            <div className="text-xs opacity-60">Auto-calculated</div>
          )}
          {tip && (
            <div className="text-xs opacity-70 mt-1">{tip}</div>
          )}
        </div>
      )}
    </div>
  );
};
