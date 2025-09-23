import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GitBranch,
  BarChart3,
  Network,
  Calendar,
  Database,
  Workflow,
  User,
  Building
} from "lucide-react";

const templates = [
  {
    icon: GitBranch,
    title: "Flowcharts",
    description: "Decision trees, process flows, and workflow diagrams",
    category: "Process",
    color: "bg-blue-500/10 text-blue-600"
  },
  {
    icon: BarChart3,
    title: "Gantt Charts",
    description: "Project timelines and milestone tracking",
    category: "Project",
    color: "bg-green-500/10 text-green-600"
  },
  {
    icon: Network,
    title: "Network Diagrams",
    description: "System architecture and infrastructure maps",
    category: "Technical",
    color: "bg-purple-500/10 text-purple-600"
  },
  {
    icon: Calendar,
    title: "Journey Maps",
    description: "Customer and user experience workflows",
    category: "UX",
    color: "bg-pink-500/10 text-pink-600"
  },
  {
    icon: Database,
    title: "ER Diagrams",
    description: "Database schemas and relationship models",
    category: "Database",
    color: "bg-orange-500/10 text-orange-600"
  },
  {
    icon: Workflow,
    title: "Sequence Diagrams",
    description: "API interactions and system communications",
    category: "Technical",
    color: "bg-teal-500/10 text-teal-600"
  },
  {
    icon: User,
    title: "Org Charts",
    description: "Team structures and reporting hierarchies",
    category: "HR",
    color: "bg-indigo-500/10 text-indigo-600"
  },
  {
    icon: Building,
    title: "Mind Maps",
    description: "Brainstorming and concept visualization",
    category: "Creative",
    color: "bg-amber-500/10 text-amber-600"
  }
];

export const TemplatesSection = () => {
  return (
    <section id="templates" className="section-padding bg-muted/20">
      <div className="container-wide">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Start Fast with{" "}
            <span className="text-gradient">Professional Templates</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Skip the blank canvas. Choose from 50+ professionally designed templates 
            or let AI create custom diagrams from your descriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {templates.map((template, index) => (
            <Card 
              key={template.title} 
              className="card-elevated hover:scale-105 transition-all duration-300 cursor-pointer group animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-lg ${template.color} flex items-center justify-center mb-3`}>
                  <template.icon className="h-6 w-6" />
                </div>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-display group-hover:text-primary transition-colors">
                    {template.title}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm leading-relaxed">
                  {template.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="btn-hero px-8 py-4">
            Browse All Templates
          </Button>
        </div>
      </div>
    </section>
  );
};