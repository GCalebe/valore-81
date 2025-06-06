
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RefreshCw, Database, Shield, Radio } from 'lucide-react';
import { useSupabaseConnection } from '@/hooks/useSupabaseConnection';

export function ConnectionStatus() {
  const { status, loading, checkConnection } = useSupabaseConnection();

  const getStatusIcon = (isWorking: boolean) => {
    return isWorking ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusText = (isWorking: boolean) => {
    return isWorking ? 'Conectado' : 'Erro de conexão';
  };

  const getStatusColor = (isWorking: boolean) => {
    return isWorking ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Database className="h-4 w-4" />
          Status das Conexões Supabase
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={checkConnection}
          disabled={loading}
          className="h-8"
        >
          {loading ? (
            <RefreshCw className="h-3 w-3 animate-spin" />
          ) : (
            <RefreshCw className="h-3 w-3" />
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Auth Status */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="text-sm">Autenticação</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.auth)}
              <span className={`text-xs ${getStatusColor(status.auth)}`}>
                {getStatusText(status.auth)}
              </span>
            </div>
          </div>

          {/* Realtime Status */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4" />
              <span className="text-sm">Tempo Real</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.realtime)}
              <span className={`text-xs ${getStatusColor(status.realtime)}`}>
                {getStatusText(status.realtime)}
              </span>
            </div>
          </div>
        </div>

        {/* Tables Status */}
        <div>
          <h4 className="text-sm font-medium mb-2">Tabelas do Banco de Dados</h4>
          <div className="space-y-2">
            {Object.entries(status.tables).map(([table, isWorking]) => (
              <div
                key={table}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <span className="text-sm">{table}</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(isWorking)}
                  <span className={`text-xs ${getStatusColor(isWorking)}`}>
                    {getStatusText(isWorking)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Status */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status Geral</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.isConnected)}
              <span className={`text-sm font-medium ${getStatusColor(status.isConnected)}`}>
                {status.isConnected ? 'Todas as conexões funcionando' : 'Problemas detectados'}
              </span>
            </div>
          </div>
        </div>

        {/* Errors */}
        {status.errors.length > 0 && (
          <div className="pt-2 border-t">
            <h4 className="text-sm font-medium mb-2 text-red-600">Erros Encontrados</h4>
            <div className="space-y-1">
              {status.errors.map((error, index) => (
                <div key={index} className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                  {error}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
