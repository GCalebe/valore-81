
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ClientsHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-blue-600 dark:bg-gray-800 text-white shadow-md transition-colors duration-300">
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
          <h1 className="text-2xl font-bold">CRM de Clientes</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Outros controles podem ser adicionados aqui se necessário */}
        </div>
      </div>
    </header>
  );
};

export default ClientsHeader;
