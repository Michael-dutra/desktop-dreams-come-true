
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Bot } from "lucide-react";

type SectionAIDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
};

export const SectionAIDialog: React.FC<SectionAIDialogProps> = ({ isOpen, onClose, title, content }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-600" />
          {title} – AI Analysis
        </DialogTitle>
      </DialogHeader>
      <div className="p-2 text-base text-gray-800 whitespace-pre-line leading-relaxed">
        {content}
      </div>
      <DialogClose asChild>
        <button className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200 transition">
          Close
        </button>
      </DialogClose>
    </DialogContent>
  </Dialog>
);

