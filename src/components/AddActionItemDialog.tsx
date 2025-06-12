
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckSquare,
  Upload,
  Calculator,
  User,
  DollarSign,
  FileText,
  Calendar,
  TrendingUp
} from "lucide-react";

interface AddActionItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (actionItem: any) => void;
}

const iconOptions = [
  { value: "check", label: "Check Square", icon: CheckSquare },
  { value: "upload", label: "Upload", icon: Upload },
  { value: "calculator", label: "Calculator", icon: Calculator },
  { value: "user", label: "User", icon: User },
  { value: "dollar", label: "Dollar Sign", icon: DollarSign },
  { value: "file", label: "File Text", icon: FileText },
  { value: "calendar", label: "Calendar", icon: Calendar },
  { value: "trending", label: "Trending Up", icon: TrendingUp },
];

const colorOptions = [
  { value: "text-orange-600", label: "Orange" },
  { value: "text-blue-600", label: "Blue" },
  { value: "text-purple-600", label: "Purple" },
  { value: "text-green-600", label: "Green" },
  { value: "text-red-600", label: "Red" },
  { value: "text-indigo-600", label: "Indigo" },
];

export const AddActionItemDialog = ({ isOpen, onClose, onAdd }: AddActionItemDialogProps) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [iconType, setIconType] = useState("");
  const [color, setColor] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subtitle || !iconType || !color) return;

    const selectedIcon = iconOptions.find(option => option.value === iconType);
    
    const newActionItem = {
      icon: selectedIcon ? <selectedIcon.icon className="h-4 w-4" /> : <CheckSquare className="h-4 w-4" />,
      title,
      subtitle,
      color,
    };

    onAdd(newActionItem);
    
    // Reset form
    setTitle("");
    setSubtitle("");
    setIconType("");
    setColor("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Action Item</DialogTitle>
          <DialogDescription>
            Create a new action item to track important tasks.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Action Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Review investment portfolio"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Description</Label>
            <Input
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g., Quarterly review due"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Select value={iconType} onValueChange={setIconType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <option.icon className="h-4 w-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Select value={color} onValueChange={setColor} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full ${option.value.replace('text-', 'bg-')}`}></div>
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Action Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
