import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, FileText, Trash2, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Diagram {
  id: string;
  title: string;
  diagram_type: string;
  created_at: string;
  updated_at: string;
}

interface DiagramsListProps {
  userId: string;
  selectedDiagramId: string | null;
  onSelectDiagram: (id: string) => void;
}

export const DiagramsList = ({ userId, selectedDiagramId, onSelectDiagram }: DiagramsListProps) => {
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDiagrams();
  }, [userId]);

  const fetchDiagrams = async () => {
    try {
      const { data, error } = await supabase
        .from("diagrams")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setDiagrams(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createNewDiagram = async (template?: string) => {
    const templates = {
      flowchart: "graph TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Action]\n    B -->|No| D[Alternative]\n    C --> E[End]\n    D --> E",
      sequence: "sequenceDiagram\n    participant A as Alice\n    participant B as Bob\n    A->>B: Hello Bob!\n    B->>A: Hi Alice!",
      class: "classDiagram\n    class Animal{\n        +String name\n        +int age\n        +makeSound()\n    }\n    class Dog{\n        +bark()\n    }\n    Animal <|-- Dog",
      erDiagram: "erDiagram\n    CUSTOMER ||--o{ ORDER : places\n    ORDER ||--|{ LINE-ITEM : contains\n    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses",
      gantt: "gantt\n    title Project Timeline\n    dateFormat YYYY-MM-DD\n    section Phase 1\n    Task 1 :a1, 2024-01-01, 30d\n    Task 2 :after a1, 20d",
    };

    try {
      const { data, error } = await supabase
        .from("diagrams")
        .insert([
          {
            user_id: userId,
            title: `New ${template || 'Flowchart'}`,
            content: templates[template as keyof typeof templates] || templates.flowchart,
            diagram_type: template || "flowchart",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setDiagrams([data, ...diagrams]);
      onSelectDiagram(data.id);
      
      toast({
        title: "Success",
        description: "New diagram created",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteDiagram = async (diagramId: string) => {
    try {
      const { error } = await supabase
        .from("diagrams")
        .delete()
        .eq("id", diagramId);

      if (error) throw error;

      setDiagrams(diagrams.filter(d => d.id !== diagramId));
      
      if (selectedDiagramId === diagramId) {
        onSelectDiagram(diagrams[0]?.id || "");
      }

      toast({
        title: "Success",
        description: "Diagram deleted",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-full border-r border-border p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full border-r border-border flex flex-col">
      <div className="p-4 border-b border-border space-y-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="btn-hero w-full">
              <Plus className="mr-2 h-4 w-4" />
              New Diagram
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem onClick={() => createNewDiagram("flowchart")}>
              Flowchart
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => createNewDiagram("sequence")}>
              Sequence Diagram
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => createNewDiagram("class")}>
              Class Diagram
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => createNewDiagram("erDiagram")}>
              ER Diagram
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => createNewDiagram("gantt")}>
              Gantt Chart
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {diagrams.length === 0 ? (
            <Card className="card-elevated">
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No diagrams yet. Create your first diagram to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            diagrams.map((diagram) => (
              <Card
                key={diagram.id}
                className={`card-elevated cursor-pointer transition-all hover:shadow-md ${
                  selectedDiagramId === diagram.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => onSelectDiagram(diagram.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium truncate">
                      {diagram.title}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDiagram(diagram.id);
                      }}
                      className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground capitalize">
                    {diagram.diagram_type}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(diagram.updated_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};