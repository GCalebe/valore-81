import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface Service {
  id: number;
  nome: string;
  preco: number;
  duracao_minutos: number;
  descricao?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchServices = async () => {
    try {
      setLoading(true);

      // Since servicos table doesn't exist, we'll provide default marketing services
      const defaultServices: Service[] = [
        {
          id: 1,
          nome: "Consultoria de Marketing Digital",
          preco: 500,
          duracao_minutos: 120,
          descricao: "Consultoria completa de marketing digital",
          ativo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 2,
          nome: "Gestão de Redes Sociais",
          preco: 800,
          duracao_minutos: 60,
          descricao: "Gestão completa de redes sociais",
          ativo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 3,
          nome: "Criação de Site",
          preco: 1500,
          duracao_minutos: 180,
          descricao: "Desenvolvimento de site institucional",
          ativo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      setServices(defaultServices);
      console.log("Default marketing services loaded");
    } catch (error) {
      console.error("Error in services:", error);
      toast({
        title: "Erro ao carregar serviços",
        description: "Ocorreu um erro ao carregar os serviços.",
        variant: "destructive",
      });
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const addService = async (
    serviceData: Omit<Service, "id" | "created_at" | "updated_at">,
  ) => {
    try {
      // Stub implementation for adding services
      const newService: Service = {
        ...serviceData,
        id: Math.floor(Math.random() * 1000) + 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setServices((prev) => [...prev, newService]);

      toast({
        title: "Serviço adicionado",
        description: "Serviço foi adicionado com sucesso.",
      });

      return newService;
    } catch (error) {
      console.error("Error adding service:", error);
      toast({
        title: "Erro ao adicionar serviço",
        description: "Não foi possível adicionar o serviço.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateService = async (id: number, serviceData: Partial<Service>) => {
    try {
      setServices((prev) =>
        prev.map((service) =>
          service.id === id
            ? {
                ...service,
                ...serviceData,
                updated_at: new Date().toISOString(),
              }
            : service,
        ),
      );

      toast({
        title: "Serviço atualizado",
        description: "Serviço foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Error updating service:", error);
      toast({
        title: "Erro ao atualizar serviço",
        description: "Não foi possível atualizar o serviço.",
        variant: "destructive",
      });
    }
  };

  const deleteService = async (id: number) => {
    try {
      setServices((prev) => prev.filter((service) => service.id !== id));

      toast({
        title: "Serviço removido",
        description: "Serviço foi removido com sucesso.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error deleting service:", error);
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
    deleteService,
  };
}
