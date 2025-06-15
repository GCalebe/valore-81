
import { useState } from 'react';
import { Contact } from '@/types/client';

export const useContactsState = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isPauseDurationDialogOpen, setIsPauseDurationDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    clientName: '',
    clientSize: '',
    clientType: '',
    cpfCnpj: '',
    asaasCustomerId: '',
    status: 'Active',
    notes: '',
    tags: [],
    responsibleUser: '',
    sales: 0,
    clientSector: '',
    budget: 0,
    paymentMethod: '',
    clientObjective: '',
    lossReason: '',
    contractNumber: '',
    contractDate: '',
    payment: '',
    uploadedFiles: [],
    consultationStage: 'Nova consulta',
    kanbanStage: 'Entraram',
  });

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailSheetOpen(true);
  };

  const openEditModal = () => {
    if (!selectedContact) return;
    setNewContact({
      name: selectedContact.name,
      email: selectedContact.email,
      phone: selectedContact.phone,
      address: selectedContact.address,
      clientName: selectedContact.clientName,
      clientSize: selectedContact.clientSize,
      clientType: selectedContact.clientType,
      cpfCnpj: selectedContact.cpfCnpj,
      asaasCustomerId: selectedContact.asaasCustomerId,
      status: selectedContact.status,
      notes: selectedContact.notes,
      tags: selectedContact.tags || [],
      responsibleUser: selectedContact.responsibleUser || '',
      sales: selectedContact.sales || 0,
      clientSector: selectedContact.clientSector || '',
      budget: selectedContact.budget || 0,
      paymentMethod: selectedContact.paymentMethod || '',
      clientObjective: selectedContact.clientObjective || '',
      lossReason: selectedContact.lossReason || '',
      contractNumber: selectedContact.contractNumber || '',
      contractDate: selectedContact.contractDate || '',
      payment: selectedContact.payment || '',
      uploadedFiles: selectedContact.uploadedFiles || [],
      consultationStage: selectedContact.consultationStage || 'Nova consulta',
      kanbanStage: selectedContact.kanbanStage || 'Entraram',
    });
    setIsEditModalOpen(true);
  };

  const resetNewContact = () => {
    setNewContact({
      name: '',
      email: '',
      phone: '',
      address: '',
      clientName: '',
      clientSize: '',
      clientType: '',
      cpfCnpj: '',
      asaasCustomerId: '',
      status: 'Active',
      notes: '',
      tags: [],
      responsibleUser: '',
      sales: 0,
      clientSector: '',
      budget: 0,
      paymentMethod: '',
      clientObjective: '',
      lossReason: '',
      contractNumber: '',
      contractDate: '',
      payment: '',
      uploadedFiles: [],
      consultationStage: 'Nova consulta',
      kanbanStage: 'Entraram',
    });
  };

  return {
    selectedContact,
    setSelectedContact,
    isAddContactOpen,
    setIsAddContactOpen,
    isDetailSheetOpen,
    setIsDetailSheetOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isMessageDialogOpen,
    setIsMessageDialogOpen,
    isPauseDurationDialogOpen,
    setIsPauseDurationDialogOpen,
    messageText,
    setMessageText,
    newContact,
    setNewContact,
    handleContactClick,
    openEditModal,
    resetNewContact,
  };
};
