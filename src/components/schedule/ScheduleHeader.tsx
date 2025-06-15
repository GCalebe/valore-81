
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

  // Para view switcher
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
  const { settings } = useThemeSettings();
  const navigate = useNavigate();

  return (
    <header 
      className="shadow-md transition-colors duration-300 rounded-b-xl"
      style={{ backgroundColor: settings.primaryColor }}
    >
      <div className="container max-w-full mx-auto px-4 py-3 flex flex-row items-center justify-between gap-6 min-h-[60px] w-full">
        {/* Branding, título e atualização */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-white/20"
            aria-label="Voltar para o dashboard"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <Calendar 
            className="h-8 w-8"
            style={{ color: settings.secondaryColor }}
          />
          <h1 className="text-2xl font-bold whitespace-nowrap text-white">Agenda</h1>
          {lastUpdated && (
            <Badge 
              variant="outline" 
              className="bg-white/10 text-white border border-white/60 px-3 py-1 ml-4 font-mono text-xs min-w-fit"
              style={{ letterSpacing: 0.5 }}
            >
              Última atualização: {lastUpdated.toLocaleTimeString('pt-BR')}
            </Badge>
          )}
        </div>
        {/* Controles (refresh, filters, add, views...) */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {onRefresh && (
            <Button 
              variant="outline" 
              onClick={onRefresh}
              disabled={isRefreshing}
              className="border-white text-white bg-white/0 font-medium hover:bg-white/20 dark:border-white min-w-[110px] focus-visible:ring-white"
              style={{height: 40}}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Atualizando...' : 'Atualizar'}
            </Button>
          )}
          {(!!view && !!onViewChange) && (
            <div className="flex items-center gap-2">
              <CalendarViewSwitcher
                view={view}
                onChange={onViewChange}
                onAddEvent={onAddEvent}
                onFilter={onOpenFilter || (() => {
                  alert("Funcionalidade de filtros avançados em breve!");
                })}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ScheduleHeader;
