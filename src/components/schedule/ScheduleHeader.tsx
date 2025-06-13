
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useThemeSettings } from '@/context/ThemeSettingsContext';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ScheduleHeaderProps {
  onAddEvent: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastUpdated?: Date | null;
}

const ScheduleHeader = ({ onAddEvent, onRefresh, isRefreshing, lastUpdated }: ScheduleHeaderProps) => {
  const { user } = useAuth();
  const { settings } = useThemeSettings();
  
  return (
    <header 
      className="text-white shadow-md transition-colors duration-300"
      style={{ backgroundColor: settings.primaryColor }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Calendar 
            className="h-8 w-8"
            style={{ color: settings.secondaryColor }}
          />
          <h1 className="text-2xl font-bold">Agenda</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <Badge variant="outline" className="bg-white/10 text-white border-0 px-3 py-1">
              Última atualização: {lastUpdated.toLocaleTimeString('pt-BR')}
            </Badge>
          )}
          
          {onRefresh && (
            <Button 
              variant="outline" 
              onClick={onRefresh}
              disabled={isRefreshing}
              className="border-white text-white bg-gray-950/50 hover:bg-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Atualizando...' : 'Atualizar'}
            </Button>
          )}
          
          <Button 
            onClick={onAddEvent}
            className="bg-green-500 hover:bg-green-600 text-white border-0"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Evento
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ScheduleHeader;
