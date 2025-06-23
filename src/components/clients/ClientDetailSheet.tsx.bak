
import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Phone, Mail, MapPin, MessageSquare, CreditCard, FileText, ShipWheel, Edit2, Briefcase, FileBox, Tag, Calendar, DollarSign, Target, AlertCircle } from 'lucide-react';
import { Contact } from '@/types/client';
import SendMessageDialog from './SendMessageDialog';
import ClientUTMData from './ClientUTMData';
import { CustomFieldWithValue } from '@/types/customFields';
import { formatCurrency } from '@/utils/formatters';

interface ClientDetailSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedContact: Contact | null;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onSendMessageClick: () => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  handleDeleteContact: () => void;
  isMessageDialogOpen: boolean;
  setIsMessageDialogOpen: (open: boolean) => void;
  messageText: string;
  setMessageText: (text: string) => void;
  handleMessageSubmit: () => void;
  isPauseDurationDialogOpen: boolean;
  setIsPauseDurationDialogOpen: (open: boolean) => void;
  handlePauseDurationConfirm: (duration: number | null) => void;
  customFields?: CustomFieldWithValue[];
  loadingCustomFields?: boolean;
  displayConfig?: {
    showTags?: boolean;
    showConsultationStage?: boolean;
    showCommercialInfo?: boolean;
    showCustomFields?: boolean;
  };
}

const ClientDetailSheet = ({
  isOpen,
  onOpenChange,
  selectedContact,
  onEditClick,
  onSendMessageClick,
  isMessageDialogOpen,
  setIsMessageDialogOpen,
  messageText,
  setMessageText,
  handleMessageSubmit,
  isPauseDurationDialogOpen,
  setIsPauseDurationDialogOpen,
  handlePauseDurationConfirm,
  customFields = [],
  loadingCustomFields = false,
  displayConfig = {
    showTags: true,
    showConsultationStage: true,
    showCommercialInfo: true,
    showCustomFields: true
  }
}: ClientDetailSheetProps) => {
  if (!selectedContact) return null;

  const [activeTab, setActiveTab] = useState('basico');

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-xl flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600 dark:text-amber-500" />
              {selectedContact.name}
            </SheetTitle>
            <SheetDescription>
              Detalhes do cliente
            </SheetDescription>
          </SheetHeader>

          {/* Tags Section */}
          {selectedContact.tags && selectedContact.tags.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedContact.tags.map((tag, index) => (
                  <span key={index} className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Consultation Stage */}
          {selectedContact.consultationStage && (
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Estágio:</span>
                <span className="text-sm font-medium">{selectedContact.consultationStage}</span>
              </div>
            </div>
          )}

          <div className="mt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="flex w-full mb-4 bg-gray-100 dark:bg-gray-700 h-12 rounded-md overflow-hidden">
                <TabsTrigger value="basico" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs sm:text-sm px-1">
                  Informações Básicas
                </TabsTrigger>
                <TabsTrigger value="utm" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs sm:text-sm px-1">
                  Dados UTM
                </TabsTrigger>
                <TabsTrigger value="documentos" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs sm:text-sm px-1">
                  Documentos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basico" className="space-y-4 mt-0">
                <div className="grid grid-cols-[20px_1fr] gap-x-3 gap-y-4 items-start">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{selectedContact.name || 'Não informado'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Nome Completo</p>
                  </div>
                  
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{selectedContact.email || 'Não informado'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  </div>
                  
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{selectedContact.phone || 'Não informado'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Telefone</p>
                  </div>
                  
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{selectedContact.address || 'Não informado'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Endereço</p>
                  </div>

                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{selectedContact.notes || 'Sem observações'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Observações Iniciais</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="utm" className="space-y-4 mt-0">
                <ClientUTMData contactId={selectedContact.id} />
              </TabsContent>

              <TabsContent value="documentos" className="space-y-4 mt-0">
                <div className="grid grid-cols-[20px_1fr] gap-x-3 gap-y-4 items-start">
                  <FileBox className="h-5 w-5 text-gray-500" />
                  <div>
                    {selectedContact.uploadedFiles && selectedContact.uploadedFiles.length > 0 ? (
                      <div className="space-y-2">
                        {selectedContact.uploadedFiles.map((file, index) => (
                          <p key={index} className="text-sm font-medium">{file}</p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm font-medium">Nenhum documento anexado</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">Documentos</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
            
          <div className="pt-4 mt-4 border-t dark:border-gray-700">
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={onSendMessageClick}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Mensagem
              </Button>
              
              <Button variant="outline" size="sm" onClick={onEditClick}>
                <Edit2 className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <SendMessageDialog 
        isOpen={isMessageDialogOpen}
        selectedContact={selectedContact}
        messageText={messageText}
        setMessageText={setMessageText}
        handleMessageSubmit={handleMessageSubmit}
        onOpenChange={setIsMessageDialogOpen}
        isPauseDurationDialogOpen={isPauseDurationDialogOpen}
        setIsPauseDurationDialogOpen={setIsPauseDurationDialogOpen}
        handlePauseDurationConfirm={handlePauseDurationConfirm}
      />
    </>
  );
};

export default ClientDetailSheet;
