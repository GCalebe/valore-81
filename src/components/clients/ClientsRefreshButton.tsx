
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface ClientsRefreshButtonProps {
  handleRefresh: () => void;
  refreshing: boolean;
}

const ClientsRefreshButton: React.FC<ClientsRefreshButtonProps> = ({ handleRefresh, refreshing }) => (
  <Button
    variant="outline"
    onClick={handleRefresh}
    disabled={refreshing}
    className="flex items-center gap-2 h-9 border-white text-white bg-white/0 font-bold hover:bg-white/20 hover:text-white transition-all"
    style={{ minWidth: 100 }}
    type="button"
  >
    <RefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
    <span>Atualizar</span>
  </Button>
);

export default ClientsRefreshButton;
