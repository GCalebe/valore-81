
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ClientsRefreshButtonProps {
  handleRefresh: () => void;
  refreshing: boolean;
}

const ClientsRefreshButton: React.FC<ClientsRefreshButtonProps> = ({ handleRefresh, refreshing }) => (
  <Button
    variant="outline"
    onClick={handleRefresh}
    disabled={refreshing}
    className="flex items-center gap-2 text-white border-white hover:bg-white/20"
    style={{ background: "rgba(255,255,255,0.08)" }}
  >
    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""} text-white`} />
    <span className="hidden sm:inline">Atualizar</span>
  </Button>
);

export default ClientsRefreshButton;
