
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText, Edit, Save } from "lucide-react";
import { useState } from "react";

const NotesSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState("Review client's retirement goals for Q2 2025. Consider adjusting asset allocation based on recent market conditions.\n\nAction items:\n- Schedule follow-up on insurance coverage\n- Discuss tax planning strategies\n- Review estate planning documents");

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would save to a backend
    console.log("Saving notes:", notes);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Notes</span>
          </div>
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
            >
              <Save className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your notes here..."
            className="min-h-[200px] resize-none"
          />
        ) : (
          <div className="min-h-[200px] p-3 bg-muted/30 rounded-md">
            <pre className="whitespace-pre-wrap text-sm font-normal text-foreground">
              {notes || "No notes added yet. Click edit to add notes."}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotesSection;
