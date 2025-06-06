
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Service {
  id: number;
  nome: string;
  descricao?: string;
  preco?: number;
  duracao_minutos?: number;
  categoria?: string;
  created_at?: string;
  updated_at?: string;
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .order('categoria', { ascending: true });
      
      if (error) throw error;
      
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Erro ao carregar serviços",
        description: "Ocorreu um erro ao buscar os serviços do banco de dados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addService = async (serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('servicos')
        .insert([serviceData])
        .select();
      
      if (error) throw error;
      
      if (data) {
        setServices(prev => [...prev, ...data]);
        toast({
          title: "Serviço adicionado",
          description: `${serviceData.nome} foi adicionado com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error adding service:', error);
      toast({
        title: "Erro ao adicionar serviço",
        description: "Não foi possível adicionar o serviço.",
        variant: "destructive",
      });
    }
  };

  const updateService = async (id: number, serviceData: Partial<Service>) => {
    try {
      const { error } = await supabase
        .from('servicos')
        .update(serviceData)
        .eq('id', id);
      
      if (error) throw error;
      
      setServices(prev => prev.map(service => 
        service.id === id ? { ...service, ...serviceData } : service
      ));
      
      toast({
        title: "Serviço atualizado",
        description: "As informações do serviço foram atualizadas.",
      });
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: "Erro ao atualizar serviço",
        description: "Não foi possível atualizar o serviço.",
        variant: "destructive",
      });
    }
  };

  const deleteService = async (id: number) => {
    try {
      const { error } = await supabase
        .from('servicos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setServices(prev => prev.filter(service => service.id !== id));
      
      toast({
        title: "Serviço removido",
        description: "O serviço foi removido com sucesso.",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Erro ao remover serviço",
        description: "Não foi possível remover o serviço.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    fetchServices,
    addService,
    updateService,
    deleteService
  };
}
