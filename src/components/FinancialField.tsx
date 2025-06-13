
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FinancialFieldProps {
  fieldId: string;
  value: number;
  label: string;
  isEditable?: boolean;
  prefix?: string;
  isAutoCalculated?: boolean;
  tip?: string;
  onChange?: (value: number) => void;
}

export const FinancialField = ({ 
  fieldId, 
  value, 
  label, 
  isEditable = true, 
  prefix = "$", 
  isAutoCalculated = false,
  tip,
  onChange 
}: FinancialFieldProps) => {
  return (
    <div>
      <Label className="text-sm font-medium">{label}</Label>
      {tip && <p className="text-xs text-gray-500 mb-1">{tip}</p>}
      <Input
        id={fieldId}
        type="number"
        value={value}
        onChange={isEditable ? (e) => onChange?.(Number(e.target.value)) : undefined}
        readOnly={!isEditable || isAutoCalculated}
        className={`mt-1 ${isAutoCalculated ? 'bg-gray-100' : ''}`}
        placeholder={prefix}
      />
    </div>
  );
};
