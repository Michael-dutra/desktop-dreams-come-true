
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Bot, Copy } from "lucide-react";
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
  const { toast } = useToast();

  // Update editable content if "content" changes (e.g., from sliders)
  React.useEffect(() => {
    setEditableContent(content);
  }, [content]);

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
          <textarea
            value={editableContent}
            onChange={(e) => setEditableContent(e.target.value)}
            className="w-full resize-vertical min-h-[120px] px-3 py-2 border rounded-lg text-base text-gray-800 whitespace-pre-line leading-relaxed bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            aria-label="AI analysis"
          />
          <button
            type="button"
            className="absolute top-2 right-2 px-2 py-1 bg-indigo-100 text-indigo-900 rounded flex items-center gap-1 hover:bg-indigo-200 transition text-xs"
            onClick={handleCopy}
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
        </div>
        <DialogClose asChild>
          <button className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200 transition">
            Close
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
