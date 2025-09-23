import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain, 
  Users, 
  Zap, 
  Palette, 
  Code, 
  Share, 
  Download, 
  Lock,
  GitBranch
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Creation",
    description: "Transform natural language into beautiful diagrams instantly. Just describe what you need and watch it come to life."
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description: "Work together seamlessly with live cursors, comments, and instant updates. Perfect for distributed teams."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Create diagrams 60% faster with smart templates, auto-suggestions, and intelligent auto-completion."
  },
  {
    icon: Palette,
    title: "Visual + Code Editor",
    description: "Switch between intuitive visual editing and powerful Mermaid.js code. Best of both worlds."
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description: "Native Mermaid.js support, version control integration, and seamless Markdown embedding."
  },
  {
    icon: Share,
    title: "Smart Integrations",
    description: "Connect with Slack, Jira, Confluence, and more. Export to any format you need."
  },
  {
    icon: Download,
    title: "Export Anywhere",
    description: "High-quality SVG, PDF, PNG exports. Batch processing and API access for automation."
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "SOC2 compliant with SSO, RBAC, and on-premise deployment options."
  },
  {
    icon: GitBranch,
    title: "Version Control",
    description: "Git-like branching and history. Never lose work with automatic versioning and recovery."
  }
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="section-padding">
      <div className="container-wide">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Everything You Need to{" "}
            <span className="text-gradient">Create Amazing</span> Diagrams
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful features designed for teams who want to move fast without compromising on quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="card-elevated animate-scale-in h-full"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-display">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};