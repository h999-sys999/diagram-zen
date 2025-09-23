import { Button } from "@/components/ui/button";
import { Sparkles, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const NavHeader = () => {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container-wide">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-gradient" />
            <span className="text-xl font-display font-bold text-gradient">
              Mermaid Studio
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#templates" className="text-muted-foreground hover:text-foreground transition-colors">
              Templates
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#docs" className="text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </a>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button className="btn-hero" size="sm">
              Start Creating
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigate through Mermaid Studio
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-6">
                <a href="#features" className="text-foreground hover:text-primary transition-colors">
                  Features
                </a>
                <a href="#templates" className="text-foreground hover:text-primary transition-colors">
                  Templates
                </a>
                <a href="#pricing" className="text-foreground hover:text-primary transition-colors">
                  Pricing
                </a>
                <a href="#docs" className="text-foreground hover:text-primary transition-colors">
                  Docs
                </a>
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Button variant="ghost">Sign In</Button>
                  <Button className="btn-hero">Start Creating</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
};