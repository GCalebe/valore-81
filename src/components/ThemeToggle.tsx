
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const navigate = useNavigate();

  const handleThemeSettings = () => {
    navigate('/theme-settings');
  };

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={handleThemeSettings}
      className="bg-background border-foreground/20 text-foreground rounded-full w-8 h-8 p-0"
    >
      <Settings className="h-4 w-4" />
      <span className="sr-only">Configurações de tema</span>
    </Button>
  );
}
