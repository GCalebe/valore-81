
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ClientsHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-blue-600 dark:bg-gray-800 text-white shadow-md transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">CRM de Clientes Náuticos</h1>
        <div className="flex items-center gap-4">
          <Button variant="default" onClick={() => navigate('/dashboard')} className="bg-amber-500 hover:bg-amber-600 text-blue-600">
            Voltar para Dashboard
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ClientsHeader;
