import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Document type definition
export interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  category: string;
  titulo?: string | null;
  metadata?: Record<string, any> | null;
}

export const useDocuments = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Safe way to extract values from metadata
  const getMetadataValue = (metadata: any, key: string, defaultValue: string): string => {
    if (typeof metadata === 'object' && metadata !== null && key in metadata) {
      return String(metadata[key]) || defaultValue;
    }
    return defaultValue;
  };

  // Since there's no documents table in Supabase, we'll work with mock data
  // and only use the webhook functionality for actual document management
  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      
      // For now, we'll start with an empty array since there's no documents table
      // The actual documents will be managed through webhooks
      setDocuments([]);
      
    } catch (err) {
      console.error('Unexpected error fetching documents:', err);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível carregar os documentos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Filter documents to keep only unique titulo entries
  const filterUniqueByTitle = (docs: Document[]): Document[] => {
    const uniqueTitles = new Set<string>();
    return docs.filter(doc => {
      const title = doc.titulo || doc.name;
      if (uniqueTitles.has(title)) {
        return false;
      }
      uniqueTitles.add(title);
      return true;
    });
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDocuments();
    toast({
      title: "Atualizando documentos",
      description: "Os documentos estão sendo atualizados.",
    });
  };

  // Delete document - Updated to call the webhook with the title
  const handleDeleteDocument = async (id: number, title: string) => {
    try {
      // Call webhook to delete file from RAG system
      console.log('Enviando solicitação para excluir arquivo:', title);
      
      const response = await fetch('https://webhook.comercial247.com.br/webhook/excluir-arquivo-rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          titulo: title 
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao excluir o arquivo: ${response.statusText}`);
      }

      // Only remove from UI if webhook call was successful
      setDocuments(documents.filter(doc => doc.id !== id));
      
      toast({
        title: "Documento excluído",
        description: "O documento foi removido com sucesso!",
        variant: "destructive",
      });
    } catch (err) {
      console.error('Unexpected error deleting document:', err);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível excluir o documento.",
        variant: "destructive",
      });
    }
  };

  // New function to clear all documents
  const clearAllDocuments = async () => {
    try {
      console.log('Enviando solicitação para excluir toda a base de conhecimento');
      
      const response = await fetch('https://webhook.comercial247.com.br/webhook/excluir-rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Erro ao limpar a base de conhecimento: ${response.statusText}`);
      }

      // Clear the documents array
      setDocuments([]);
      
      toast({
        title: "Base de conhecimento limpa",
        description: "Todos os documentos foram removidos com sucesso!",
        variant: "destructive",
      });
    } catch (err) {
      console.error('Unexpected error clearing knowledge base:', err);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível limpar a base de conhecimento.",
        variant: "destructive",
      });
    }
  };

  // Upload file to webhook
  const uploadFileToWebhook = async (file: File, category: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      console.log('Enviando arquivo para o webhook:', file.name, 'categoria:', category);
      
      const response = await fetch('https://webhook.comercial247.com.br/webhook/envia_rag', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro ao enviar o arquivo: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Arquivo enviado com sucesso:', result);
      
      // After successful upload, add a mock document to the list
      const newDocument: Document = {
        id: Date.now(),
        name: file.name,
        type: file.type || 'unknown',
        size: `${Math.round(file.size / 1024)} KB`,
        uploadedAt: new Date().toISOString().split('T')[0],
        category: category,
        titulo: file.name
      };
      
      setDocuments(prev => [...prev, newDocument]);
      
      toast({
        title: "Documento adicionado",
        description: `${file.name} foi adicionado com sucesso!`,
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao enviar o arquivo:', error);
      
      toast({
        title: "Erro ao enviar documento",
        description: "Não foi possível enviar o documento para o sistema de conhecimento.",
        variant: "destructive",
      });
      
      return false;
    }
  };

  // Load documents on hook initialization
  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    isLoading,
    isRefreshing,
    fetchDocuments,
    handleRefresh,
    handleDeleteDocument,
    uploadFileToWebhook,
    clearAllDocuments
  };
};
