import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Asset } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Copy, CheckCircle, AlertCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAsset, updateAsset } from "@/lib/api";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { AssetDetailField } from "./AssetDetailField";

type AssetsDetailDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset;
};

export const AssetsDetailDialog: React.FC<AssetsDetailDialogProps> = ({
  isOpen,
  onClose,
  asset,
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = React.useState<
    string | undefined
  >(undefined);
  const [editedAsset, setEditedAsset] = React.useState<Asset>(asset);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  React.useEffect(() => {
    setEditedAsset(asset);
  }, [asset]);

  const updateAssetMutation = useMutation({
    mutationFn: updateAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast({
        title: "Asset updated",
        description: "Your asset has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Failed to update the asset. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteAssetMutation = useMutation({
    mutationFn: deleteAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast({
        title: "Asset deleted",
        description: "Your asset has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Failed to delete the asset. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Asset
  ) => {
    const value = e.target.value;
    setEditedAsset((prev) => ({ ...prev, [field]: value }));
  };

  const handleAssetTypeChange = (assetType: string) => {
    setEditedAsset((prev) => ({ ...prev, assetType }));
  };

  const handleAssetCategoryChange = (assetCategory: string) => {
    setEditedAsset((prev) => ({ ...prev, assetCategory }));
  };

  const handleAssetSubCategoryChange = (assetSubCategory: string) => {
    setEditedAsset((prev) => ({ ...prev, assetSubCategory }));
  };

  const handleCurrencyChange = (currency: string) => {
    setEditedAsset((prev) => ({ ...prev, currency }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setEditedAsset((prev) => ({
      ...prev,
      acquisitionDate: date ? date.toISOString() : null,
    }));
  };

  const handleSave = async () => {
    updateAssetMutation.mutate(editedAsset);
    onClose();
  };

  const handleDelete = async () => {
    deleteAssetMutation.mutate(asset.id);
    onClose();
  };

  const handleCopyAssetId = async () => {
    try {
      await navigator.clipboard.writeText(asset.id);
      toast({
        title: "Asset ID copied",
        description: "Asset ID copied to clipboard!",
        variant: "default",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Asset Details</DialogTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleCopyAssetId}>
                <Copy className="mr-2 h-4 w-4" /> Copy Asset ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:bg-destructive/5"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </DialogHeader>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="general" id="general">
            <AccordionTrigger
              onClick={() =>
                setIsAccordionOpen(
                  isAccordionOpen === "general" ? undefined : "general"
                )
              }
            >
              General Information
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AssetDetailField
                  fieldId="name"
                  value={editedAsset.name}
                  label="Asset Name"
                  onChange={(e) => handleInputChange(e, "name")}
                  isEditable
                />
                <div className="grid gap-2">
                  <Label htmlFor="assetType">Asset Type</Label>
                  <Input
                    id="assetType"
                    value={editedAsset.assetType}
                    onChange={(e) => handleInputChange(e, "assetType")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assetCategory">Asset Category</Label>
                  <Input
                    id="assetCategory"
                    value={editedAsset.assetCategory}
                    onChange={(e) => handleInputChange(e, "assetCategory")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assetSubCategory">Asset Sub-Category</Label>
                  <Input
                    id="assetSubCategory"
                    value={editedAsset.assetSubCategory}
                    onChange={(e) => handleInputChange(e, "assetSubCategory")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={editedAsset.currency}
                    onChange={(e) => handleInputChange(e, "currency")}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="acquisitionDate">Acquisition Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal",
                          !editedAsset.acquisitionDate
                            ? "text-muted-foreground"
                            : ""
                        )}
                      >
                        {editedAsset.acquisitionDate ? (
                          format(parseISO(editedAsset.acquisitionDate), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                      <Calendar
                        mode="single"
                        selected={
                          editedAsset.acquisitionDate
                            ? parseISO(editedAsset.acquisitionDate)
                            : undefined
                        }
                        onSelect={handleDateChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <AssetDetailField
                  fieldId="quantity"
                  value={editedAsset.quantity?.toString() || ""}
                  label="Quantity"
                  onChange={(e) => handleInputChange(e, "quantity")}
                  isEditable
                />
                <AssetDetailField
                  fieldId="interestRate"
                  value={editedAsset.interestRate?.toString() || ""}
                  label="Interest Rate"
                  onChange={(e) => handleInputChange(e, "interestRate")}
                  isEditable
                />
                <AssetDetailField
                  fieldId="apy"
                  value={editedAsset.apy?.toString() || ""}
                  label="APY"
                  onChange={(e) => handleInputChange(e, "apy")}
                  isEditable
                />
                <AssetDetailField
                  fieldId="termLength"
                  value={editedAsset.termLength?.toString() || ""}
                  label="Term Length"
                  onChange={(e) => handleInputChange(e, "termLength")}
                  isEditable
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="value" id="value">
            <AccordionTrigger
              onClick={() =>
                setIsAccordionOpen(
                  isAccordionOpen === "value" ? undefined : "value"
                )
              }
            >
              Value Information
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AssetDetailField
                  fieldId="acquisitionCost"
                  value={editedAsset.acquisitionCost?.toString() || ""}
                  label="Aquisition Cost"
                  onChange={(e) => handleInputChange(e, "acquisitionCost")}
                  prefix="$"
                  isEditable
                />
                <AssetDetailField
                  fieldId="currentValue"
                  value={editedAsset.currentValue?.toString() || ""}
                  label="Current Value"
                  onChange={(e) => handleInputChange(e, "currentValue")}
                  prefix="$"
                  isEditable
                />
                <AssetDetailField
                  fieldId="annualDepreciation"
                  value={editedAsset.annualDepreciation?.toString() || ""}
                  label="Annual Deprecation"
                  onChange={(e) => handleInputChange(e, "annualDepreciation")}
                  prefix="$"
                  isEditable
                />
                <AssetDetailField
                  fieldId="annualIncome"
                  value={editedAsset.annualIncome?.toString() || ""}
                  label="Annual Income"
                  onChange={(e) => handleInputChange(e, "annualIncome")}
                  prefix="$"
                  isEditable
                />
                <AssetDetailField
                  fieldId="estimatedGrowthRate"
                  value={editedAsset.estimatedGrowthRate?.toString() || ""}
                  label="Estimated Growth Rate"
                  onChange={(e) => handleInputChange(e, "estimatedGrowthRate")}
                  isEditable
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="notes" id="notes">
            <AccordionTrigger
              onClick={() =>
                setIsAccordionOpen(
                  isAccordionOpen === "notes" ? undefined : "notes"
                )
              }
            >
              Notes
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={editedAsset.notes || ""}
                  onChange={(e) => handleInputChange(e, "notes")}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex justify-end space-x-2 mt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
