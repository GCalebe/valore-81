
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useThemeSettings } from '@/context/ThemeSettingsContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar } from 'lucide-react';
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

const HEADER_BG = "#183385"; // cor fixa igual à imagem, você pode ajustar, mas representa o azul sólido

const ScheduleHeader = ({
  onAddEvent,
  onRefresh,
  isRefreshing,
  lastUpdated,
  view,
  onViewChange,
  onOpenFilter,
}: ScheduleHeaderProps) => {
  const { settings } = useThemeSettings();
  const navigate = useNavigate();

  return (
    <header 
      className="rounded-b-xl"
      style={{ backgroundColor: HEADER_BG }}
      data-testid="schedule-header"
    >
      <div
        className="flex flex-row items-center justify-between min-h-[64px] w-full px-6 py-0"
        style={{ height: 64 }}
      >
        {/* Branding e título totalmente centralizados */}
        <div className="flex flex-row items-center gap-4 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-white/20 focus-visible:ring-white"
            style={{ minWidth: 32, minHeight: 32, padding: 0 }}
            aria-label="Voltar para o dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Calendar 
            className="h-7 w-7"
            style={{
              color: "#FFC72C", // amarelo do calendário igual ao da imagem
              strokeWidth: 2.3,
              marginBottom: 2
            }}
          />
          <h1 className="text-2xl font-bold text-white pl-1 pr-1 tracking-tight leading-none" style={{ minWidth: 0 }}>
            Agenda
          </h1>
          {lastUpdated && (
            <Badge
              variant="outline"
              className="bg-transparent text-white border border-white/70 px-3 py-1 ml-3 font-mono text-xs min-w-fit !leading-none"
              style={{
                letterSpacing: 0.5,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                fontWeight: 500,
                background: "rgba(255,255,255,0.06)"
              }}
            >
              Última atualização: {lastUpdated.toLocaleTimeString('pt-BR')}
            </Badge>
          )}
        </div>
        {/* Controles todos alinhados verticalmente e espaçados */}
        <div className="flex flex-row items-center gap-3">
          {onRefresh && (
            <Button 
              variant="outline"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="border-white text-white bg-transparent hover:bg-white/20 min-w-[110px] transition-all"
              style={{
                height: 40,
                borderRadius: 8,
                borderWidth: 1.4
              }}
            >
              <svg
                className={`mr-2 h-4 w-4 inline-block ${isRefreshing ? 'animate-spin' : ''}`}
                fill="none" stroke="currentColor" strokeWidth={2.1}
                viewBox="0 0 24 24"
              >
                <path d="M21 2v6h-6M3 22v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.13-3.36L21 8m0 8a9 9 0 0 1-14.13 3.36L3 16" />
              </svg>
              {isRefreshing ? 'Atualizando...' : 'Atualizar'}
            </Button>
          )}
          {(!!view && !!onViewChange) && (
            <div className="flex flex-row items-center gap-2">
              <CalendarViewSwitcher
                view={view}
                onChange={onViewChange}
                onAddEvent={onAddEvent}
                onFilter={onOpenFilter || (() => { alert("Funcionalidade de filtros avançados em breve!"); })}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ScheduleHeader;
