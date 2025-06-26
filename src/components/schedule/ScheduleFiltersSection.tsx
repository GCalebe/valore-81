import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Filter } from "lucide-react";
import { useThemeSettings } from "@/context/ThemeSettingsContext";

interface ScheduleFiltersSectionProps {
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
  hostFilter?: string;
  onHostFilterChange?: (host: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const ScheduleFiltersSection = ({
  statusFilter = "all",
  onStatusFilterChange,
  hostFilter = "all",
  onHostFilterChange,
  onRefresh,
  isRefreshing = false,
}: ScheduleFiltersSectionProps) => {
  const { settings } = useThemeSettings();
  return (
    <div
      className="rounded-lg p-6 mt-8 mb-6 flex items-center gap-8"
      style={{ backgroundColor: settings.primaryColor }}
    >
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-white" />
        <h3 className="text-white text-[16px] font-semibold">
          Filtros da Agenda
        </h3>
      </div>
      <div className="flex flex-col gap-1 min-w-[180px]">
        <span className="text-white text-xs font-medium mb-1">Vendedor</span>
        <Select value={hostFilter} onValueChange={onHostFilterChange}>
          <SelectTrigger className="h-9 border-slate-600 text-white bg-slate-700 hover:bg-slate-600 text-sm rounded-md w-full min-w-[180px]">
            <span className="truncate">
              {hostFilter === "corretor1"
                ? "João Silva"
                : hostFilter === "corretor2"
                  ? "Maria Santos"
                  : hostFilter === "corretor3"
                    ? "Pedro Costa"
                    : "Todos os vendedores"}
            </span>
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            <SelectItem value="all" className="text-white hover:bg-slate-700">
              Todos os vendedores
            </SelectItem>
            <SelectItem
              value="corretor1"
              className="text-white hover:bg-slate-700"
            >
              Agenda 1
            </SelectItem>
            <SelectItem
              value="corretor2"
              className="text-white hover:bg-slate-700"
            >
              Agenda 2
            </SelectItem>
            <SelectItem
              value="corretor3"
              className="text-white hover:bg-slate-700"
            >
              Agenda 3
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1 min-w-[220px]">
        <span className="text-white text-xs font-medium mb-1">Status</span>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="h-9 border-slate-600 text-white bg-slate-700 hover:bg-slate-600 text-sm rounded-md w-full min-w-[220px]">
            <span className="truncate">
              {statusFilter === "confirmado"
                ? "Confirmados"
                : statusFilter === "pendente"
                  ? "Pendentes"
                  : statusFilter === "cancelado"
                    ? "Cancelados"
                    : "Visualizando todos (4 eventos)"}
            </span>
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            <SelectItem value="all" className="text-white hover:bg-slate-700">
              Visualizando todos (4 eventos)
            </SelectItem>
            <SelectItem
              value="confirmado"
              className="text-white hover:bg-slate-700"
            >
              Confirmados
            </SelectItem>
            <SelectItem
              value="pendente"
              className="text-white hover:bg-slate-700"
            >
              Pendentes
            </SelectItem>
            <SelectItem
              value="cancelado"
              className="text-white hover:bg-slate-700"
            >
              Cancelados
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 flex justify-end">
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="border-white text-white bg-transparent hover:bg-white/20 min-w-[110px] transition-all"
          style={{
            height: 40,
            borderRadius: 8,
            borderWidth: 1.4,
          }}
        >
          <RefreshCcw
            className={`mr-2 h-4 w-4 inline-block ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />
          <span>{isRefreshing ? "Atualizando..." : "Atualizar"}</span>
        </Button>
      </div>
    </div>
  );
};

export default ScheduleFiltersSection;
