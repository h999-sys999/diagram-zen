import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Download, Eye, Code, ZoomIn, ZoomOut, Maximize2, Minimize2, Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import mermaid from "mermaid";

interface DiagramEditorProps {
  userId: string;
  selectedDiagramId: string | null;
}

interface DiagramData {
  id: string;
  title: string;
  content: string;
  diagram_type: string;
}

export const DiagramEditor = ({ userId, selectedDiagramId }: DiagramEditorProps) => {
  const [diagram, setDiagram] = useState<DiagramData | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState("visual");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState("default");
  const mermaidRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: theme as any,
      securityLevel: "loose",
    });
  }, [theme]);

  // Load diagram when selection changes
  useEffect(() => {
    if (selectedDiagramId) {
      loadDiagram(selectedDiagramId);
    } else {
      setDiagram(null);
      setTitle("");
      setContent("");
    }
  }, [selectedDiagramId]);

  // Render Mermaid diagram when content changes on visual tab
  useEffect(() => {
    if (content && activeTab === "visual") {
      // Small delay to ensure ref is mounted
      const timer = setTimeout(() => {
        renderDiagram();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [content, activeTab]);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && diagram) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        saveDiagram();
      }, 2000); // Auto-save after 2 seconds of inactivity
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [hasUnsavedChanges, title, content]);

  // Track changes
  useEffect(() => {
    if (diagram && (title !== diagram.title || content !== diagram.content)) {
      setHasUnsavedChanges(true);
    }
  }, [title, content, diagram]);

  const loadDiagram = async (diagramId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("diagrams")
        .select("*")
        .eq("id", diagramId)
        .single();

      if (error) throw error;

      setDiagram(data);
      setTitle(data.title);
      setContent(data.content);
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

  const renderDiagram = async () => {
    if (!mermaidRef.current || !content) return;

    const currentRef = mermaidRef.current;

    try {
      // Clear previous diagram
      currentRef.innerHTML = "";
      
      // Create a unique ID for the diagram
      const id = `mermaid-${Date.now()}`;
      
      // Render the diagram
      const { svg } = await mermaid.render(id, content);
      
      // Check if ref is still valid after async operation
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = svg;
      }
    } catch (error) {
      console.error("Mermaid rendering error:", error);
      // Check if ref is still valid before updating
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = `
          <div class="p-4 text-center text-destructive">
            <p>Error rendering diagram</p>
            <p class="text-sm text-muted-foreground mt-2">Check your Mermaid syntax</p>
          </div>
        `;
      }
    }
  };

  const saveDiagram = async () => {
    if (!diagram) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("diagrams")
        .update({
          title: title,
          content: content,
        })
        .eq("id", diagram.id);

      if (error) throw error;

      setHasUnsavedChanges(false);
      
      toast({
        title: "Success",
        description: "Diagram saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const downloadSVG = () => {
    if (!mermaidRef.current) return;

    const svg = mermaidRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = `${title || "diagram"}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const downloadPNG = () => {
    if (!mermaidRef.current) return;

    const svg = mermaidRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = `${title || "diagram"}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
      });
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handleZoomReset = () => {
    setZoom(100);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!selectedDiagramId) {
    return (
      <div className="h-full flex items-center justify-center text-center p-8">
        <div>
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-2xl font-semibold mb-2">Welcome to Mermaid Studio</h3>
          <p className="text-muted-foreground">
            Select a diagram from the sidebar or create a new one to get started.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 mr-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Diagram title"
              className="text-lg font-semibold border-none p-0 h-auto focus-visible:ring-0"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-32">
                <Palette className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="forest">Forest</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={downloadPNG}
              variant="outline"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />
              PNG
            </Button>
            <Button
              onClick={downloadSVG}
              variant="outline"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />
              SVG
            </Button>
            <Button
              onClick={saveDiagram}
              disabled={isSaving || !hasUnsavedChanges}
              className="btn-hero"
              size="sm"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : hasUnsavedChanges ? "Save Changes" : "Saved"}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="border-b border-border px-4 flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="visual" className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                Visual
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center">
                <Code className="mr-2 h-4 w-4" />
                Code
              </TabsTrigger>
            </TabsList>
            
            {activeTab === "visual" && (
              <div className="flex items-center space-x-2">
                <Button onClick={handleZoomOut} variant="ghost" size="sm">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button onClick={handleZoomReset} variant="ghost" size="sm" className="min-w-16">
                  {zoom}%
                </Button>
                <Button onClick={handleZoomIn} variant="ghost" size="sm">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button onClick={toggleFullscreen} variant="ghost" size="sm">
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="visual" className={`h-[calc(100%-60px)] m-0 ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
            <div className="h-full overflow-auto p-8 bg-muted/20 flex items-center justify-center">
              {!content ? (
                <div className="text-center text-muted-foreground space-y-2">
                  <div className="text-4xl mb-4">📊</div>
                  <p className="font-semibold">No diagram yet</p>
                  <p className="text-sm">Switch to Code tab to start creating</p>
                </div>
              ) : (
                <div 
                  ref={mermaidRef} 
                  className="w-full h-full flex items-center justify-center transition-transform duration-200" 
                  style={{ transform: `scale(${zoom / 100})` }}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="code" className="h-[calc(100%-60px)] m-0">
            <div className="h-full p-4 space-y-2">
              <div className="text-xs text-muted-foreground bg-accent/10 p-2 rounded">
                💡 Paste your code below. It will auto-preview in the Visual tab.
              </div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your Mermaid diagram code here...&#10;&#10;Examples:&#10;- graph TD (Flowchart)&#10;- sequenceDiagram (Sequence)&#10;- classDiagram (Class)&#10;- erDiagram (ER Diagram)&#10;- gantt (Gantt Chart)"
                className="h-[calc(100%-3rem)] resize-none font-mono text-sm bg-muted/30 border-2 focus:border-primary"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};