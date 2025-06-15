
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
      className="text-white shadow-md transition-colors duration-300"
      style={{ backgroundColor: settings.primaryColor }}
    >
      <div className="container mx-auto px-4 py-3 flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
        {/* Branding e atualização */}
        <div className="flex items-center gap-4 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-white/10"
            aria-label="Voltar para o dashboard"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2 min-w-fit">
            <Calendar 
              className="h-8 w-8"
              style={{ color: settings.secondaryColor }}
            />
            <h1 className="text-2xl font-bold whitespace-nowrap">Agenda</h1>
          </div>
          {lastUpdated && (
            <Badge variant="outline" className="bg-white/10 text-white border-0 px-3 py-1 ml-4">
              Última atualização: {lastUpdated.toLocaleTimeString('pt-BR')}
            </Badge>
          )}
        </div>
        {/* Controles */}
        <div className="flex-1 flex flex-col gap-2 items-end xl:flex-row xl:items-center xl:justify-end">
          <div className="flex gap-2">
            {onRefresh && (
              <Button 
                variant="outline" 
                onClick={onRefresh}
                disabled={isRefreshing}
                className="border-white text-white bg-transparent hover:bg-white/10 dark:border-gray-600"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Atualizando...' : 'Atualizar'}
              </Button>
            )}
          </div>
          {/* View Switcher (filtros, novo evento, tabs - se disponíveis) */}
          {(!!view && !!onViewChange) && (
            <div className="mt-2 xl:mt-0 flex gap-2 w-full max-w-full justify-end">
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
