
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useThemeSettings } from '@/context/ThemeSettingsContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CalendarViewSwitcher } from "./CalendarViewSwitcher";

interface ScheduleHeaderProps {
  onAddEvent: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastUpdated?: Date | null;
  view?: "mes" | "semana" | "dia" | "agenda";
  onViewChange?: (view: "mes" | "semana" | "dia" | "agenda") => void;
  onOpenFilter?: () => void;
}

const ScheduleHeader = ({
  onAddEvent,
  onRefresh,
  isRefreshing,
  lastUpdated,
  view,
  onViewChange,
  onOpenFilter,
}: ScheduleHeaderProps) => {
  const { user } = useAuth();
  // const { settings } = useThemeSettings();
  const navigate = useNavigate();

  // Cores fixas, centralização e layout igual à imagem
  return (
    <header
      className="rounded-b-xl shadow-md bg-[#17327e] transition-colors duration-300"
    >
      <div className="flex flex-row items-center justify-between gap-3 px-6 py-3 w-full min-h-[64px]">
        {/* Grupo esquerdo: Botão voltar, ícone calendário, título, badge */}
        <div className="flex flex-row items-center gap-2 min-w-0 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-white/10"
            aria-label="Voltar para o dashboard"
            style={{ outline: 'none', border: 0, boxShadow: 'none' }}
          >
            <ArrowLeft className="h-6 w-6" color="#fff" />
          </Button>
          <Calendar
            className="h-8 w-8"
            color="#fdb913"
            strokeWidth={2}
            style={{ minWidth: 32 }}
          />
          <h1 className="text-2xl font-bold text-white ml-2 mr-1 select-none tracking-tight">Agenda</h1>
          {lastUpdated && (
            <Badge
              variant="outline"
              className="bg-transparent border border-white/70 text-white font-mono px-3 py-0.5 ml-3 text-xs min-w-fit rounded-full tracking-tight"
              style={{
                letterSpacing: 0.2,
                height: 30,
                lineHeight: 1.8,
                whiteSpace: "nowrap"
              }}
            >
              Última atualização: {lastUpdated.toLocaleTimeString('pt-BR')}
            </Badge>
          )}
        </div>
        {/* Grupo direito: Botões (refresh, filtro, +), abas */}
        <div className="flex flex-row items-center gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="border-white/80 text-white bg-transparent font-medium hover:bg-white/10 min-w-[110px] h-10 px-3"
              style={{
                borderWidth: 1.3,
                borderRadius: 8,
                outline: 'none',
                boxShadow: 'none'
              }}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} color="#fff" />
              <span className="text-white">Atualizar</span>
            </Button>
          )}
          {(!!view && !!onViewChange) && (
            <CalendarViewSwitcher
              view={view}
              onChange={onViewChange}
              onAddEvent={onAddEvent}
              onFilter={onOpenFilter || (() => {
                alert("Funcionalidade de filtros avançados em breve!");
              })}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default ScheduleHeader;
