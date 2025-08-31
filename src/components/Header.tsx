import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b border-border/50 bg-gradient-to-r from-background to-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-billiards-gold to-billiards-felt bg-clip-text text-transparent">
                Cue Bill Boss
              </h1>
              <p className="text-sm text-muted-foreground">
                Professional Billiards Management
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-primary text-primary">
              Live System
            </Badge>
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">
                {new Date().toLocaleDateString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};