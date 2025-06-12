
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Save, X } from "lucide-react";
import { useState } from "react";

interface Note {
  id: string;
  content: string;
  createdAt: Date;
}

const NotesSection = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      content: "Review client's retirement goals for Q2 2025. Consider adjusting asset allocation based on recent market conditions.",
      createdAt: new Date("2024-12-10")
    },
    {
      id: "2", 
      content: "Action items:\n- Schedule follow-up on insurance coverage\n- Discuss tax planning strategies\n- Review estate planning documents",
      createdAt: new Date("2024-12-11")
    }
  ]);
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleSaveNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote.trim(),
        createdAt: new Date()
      };
      setNotes([note, ...notes]);
      setNewNote("");
      setIsAddingNote(false);
      console.log("Saving note:", note);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Notes</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingNote(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAddingNote && (
          <div className="space-y-2">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add your note here..."
              className="min-h-[100px] resize-none"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveNote}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsAddingNote(false);
                  setNewNote("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {notes.length === 0 ? (
            <p className="text-muted-foreground text-sm">No notes added yet. Click the + button to add a note.</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="border rounded-md p-3 bg-muted/30 relative group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(note.createdAt)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <pre className="whitespace-pre-wrap text-sm font-normal text-foreground">
                  {note.content}
                </pre>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesSection;
