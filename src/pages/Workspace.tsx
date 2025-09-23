import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { DiagramEditor } from "@/components/workspace/DiagramEditor";
import { DiagramsList } from "@/components/workspace/DiagramsList";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const Workspace = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedDiagramId, setSelectedDiagramId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate("/auth");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          navigate("/auth");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <WorkspaceHeader user={user} />
      
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
          <DiagramsList 
            userId={user.id}
            selectedDiagramId={selectedDiagramId}
            onSelectDiagram={setSelectedDiagramId}
          />
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel defaultSize={75} minSize={60}>
          <DiagramEditor 
            userId={user.id}
            selectedDiagramId={selectedDiagramId}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Workspace;