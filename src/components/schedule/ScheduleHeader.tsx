
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RefreshCw, LoaderCircle, ShipWheel } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useThemeSettings } from '@/context/ThemeSettingsContext';
import { ThemeToggle } from '@/components/ThemeToggle';

interface ScheduleHeaderProps {
  isAnyLoading: boolean;
  isAnyRefreshing: boolean;
  lastUpdated: Date | null;
  onRefreshAll: () => void;
}

export function ScheduleHeader({ 
  isAnyLoading, 
  isAnyRefreshing, 
  lastUpdated, 
  onRefreshAll 
}: ScheduleHeaderProps) {
  const { user } = useAuth();
  const { settings } = useThemeSettings();
  const navigate = useNavigate();

  return (
    <>
      <header 
        className="text-white shadow-md transition-colors duration-300"
        style={{ backgroundColor: settings.primaryColor }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/dashboard')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            {settings.logo ? (
              <img 
                src={settings.logo} 
                alt="Logo" 
                className="h-8 w-8 object-contain"
              />
            ) : (
              <ShipWheel 
                className="h-8 w-8"
                style={{ color: settings.secondaryColor }}
              />
            )}
            <h1 className="text-2xl font-bold">{settings.brandName}</h1>
            <span className="text-lg ml-2">- Agenda</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-white/10 text-white border-0 px-3 py-1">
              {user?.user_metadata?.name || user?.email}
            </Badge>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              Agenda Náutica Valore
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={onRefreshAll}
              className="flex items-center gap-2" 
              disabled={isAnyLoading || isAnyRefreshing}
            >
              {isAnyRefreshing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {isAnyRefreshing ? 'Atualizando...' : 'Atualizar'}
            </Button>
            {lastUpdated && (
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden md:inline-block">
                Última atualização: {format(lastUpdated, "dd/MM/yyyy HH:mm:ss")}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
