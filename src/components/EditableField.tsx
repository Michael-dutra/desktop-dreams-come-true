
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
  editingField: string | null;
  tempValue: string;
  onStartEdit: (fieldId: string, currentValue: number | string) => void;
  onSaveEdit: (fieldId: string) => void;
  onCancelEdit: () => void;
  setTempValue: (value: string) => void;
}

export const EditableField = ({ 
  fieldId, 
  value, 
  label, 
  isEditable = true, 
  prefix = "$",
  suffix = "",
  isAutoCalculated = false,
  tip,
  editingField,
  tempValue,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  setTempValue
}: EditableFieldProps) => {
  const isEditing = editingField === fieldId;
  
  return (
    <div className="relative">
      <p className="text-sm text-muted-foreground">{label}</p>
      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="text-lg font-semibold"
            type="number"
            autoFocus
          />
          <Button size="sm" variant="ghost" onClick={() => onSaveEdit(fieldId)}>
            <Check className="w-4 h-4 text-green-600" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onCancelEdit}>
            <X className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={`font-semibold text-lg ${isAutoCalculated ? 'text-blue-600' : 'text-green-600'}`}>
              {prefix}{value.toLocaleString()}{suffix}
            </p>
            {tip && (
              <p className="text-xs text-muted-foreground/80 mt-1 italic">
                💡 {tip}
              </p>
            )}
          </div>
          {isEditable && !isAutoCalculated && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => onStartEdit(fieldId, value)}
              className="opacity-50 hover:opacity-100"
            >
              <Edit2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
