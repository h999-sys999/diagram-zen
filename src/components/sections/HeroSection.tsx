import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Zap, Users } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-background via-primary-muted/20 to-accent-muted/30">
      <div className="container-wide">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Diagram Creation
          </Badge>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6">
            Create Stunning{" "}
            <span className="text-gradient">Diagrams</span>{" "}
            in Seconds
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            The most advanced collaborative diagramming platform. Built on Mermaid.js 
            with AI assistance, real-time collaboration, and templates for everyone.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="btn-hero px-8 py-4 text-lg">
              Start Creating Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
              Watch Demo
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Zap className="h-5 w-5 text-primary" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Users className="h-5 w-5 text-primary" />
              <span>Real-time Collaboration</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>50+ Templates</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};