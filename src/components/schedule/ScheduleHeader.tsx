
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useThemeSettings } from '@/context/ThemeSettingsContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, RefreshCw } from 'lucide-react';
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
  const navigate = useNavigate();
  
  return (
    <header 
      className="text-white shadow-md transition-colors duration-300"
      style={{ backgroundColor: settings.primaryColor }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-white/10"
            aria-label="Voltar para o dashboard"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2">
            <Calendar 
              className="h-8 w-8"
              style={{ color: settings.secondaryColor }}
            />
            <h1 className="text-2xl font-bold">Agenda</h1>
          </div>
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
        </div>
      </div>
    </header>
  );
};

export default ScheduleHeader;
