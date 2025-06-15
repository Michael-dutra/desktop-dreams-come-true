
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Bot, Copy, Pen, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type SectionAIDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
};

export const SectionAIDialog: React.FC<SectionAIDialogProps> = ({
  isOpen,
  onClose,
  title,
  content,
}) => {
  const [editableContent, setEditableContent] = React.useState(content);
  const [isEditing, setIsEditing] = React.useState(false);
  const { toast } = useToast();

  // Update editable content if "content" changes (e.g., from sliders)
  React.useEffect(() => {
    setEditableContent(content);
    setIsEditing(false);
  }, [content, isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editableContent);
      toast({
        title: "Copied to clipboard",
        description: "AI analysis text copied!",
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

  // If user cancels editing, revert changes.
  const handleCancel = () => {
    setEditableContent(content);
    setIsEditing(false);
  };

  // When user saves, just close edit mode (do not update original content since it's tied to dynamic data)
  const handleSave = () => {
    setIsEditing(false);
    // Not updating upstream prop, stays local—for now
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            {title} – AI Analysis
          </DialogTitle>
        </DialogHeader>
        <div className="relative">
          {isEditing ? (
            <>
              <textarea
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                className="w-full resize-vertical min-h-[120px] px-3 py-2 border rounded-lg text-base text-gray-800 whitespace-pre-line leading-relaxed bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                aria-label="Edit AI analysis"
              />
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-indigo-100 text-indigo-900 hover:bg-indigo-200 transition text-xs font-semibold"
                  onClick={handleSave}
                  aria-label="Save"
                >
                  <Save className="w-4 h-4" /> Save
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-xs font-semibold"
                  onClick={handleCancel}
                  aria-label="Cancel"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-indigo-100 text-indigo-900 hover:bg-indigo-200 transition text-xs font-semibold ml-auto"
                  onClick={handleCopy}
                  aria-label="Copy"
                >
                  <Copy className="w-4 h-4" /> Copy
                </button>
              </div>
            </>
          ) : (
            <>
              <div
                className="w-full px-3 py-2 text-base text-gray-800 whitespace-pre-line leading-relaxed bg-white rounded-lg border min-h-[120px]"
                aria-label="AI analysis"
                style={{ cursor: "default" }}
              >
                {editableContent}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-indigo-100 text-indigo-900 hover:bg-indigo-200 transition text-xs font-semibold"
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit"
                >
                  <Pen className="w-4 h-4" /> Edit
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-indigo-100 text-indigo-900 hover:bg-indigo-200 transition text-xs font-semibold"
                  onClick={handleCopy}
                  aria-label="Copy"
                >
                  <Copy className="w-4 h-4" /> Copy
                </button>
                <DialogClose asChild>
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-xs font-semibold ml-auto"
                  >
                    <X className="w-4 h-4" /> Close
                  </button>
                </DialogClose>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

