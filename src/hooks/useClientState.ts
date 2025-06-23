
import { useState } from 'react';
import { Contact } from '@/types/client';

export const useClientState = () => {
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
    clientName: '',
    tags: [],
    notes: '',
    consultationStage: 'Nova consulta'
  });

  const resetNewContact = () => {
    setNewContact({
      name: '',
      email: '',
      phone: '',
      clientName: '',
      tags: [],
      notes: '',
      consultationStage: 'Nova consulta'
    });
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailSheetOpen(true);
  };

  const openEditModal = (contact: Contact) => {
    setSelectedContact(contact);
    setNewContact({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      clientName: contact.clientName,
      tags: contact.tags || [],
      notes: contact.notes || '',
      consultationStage: contact.consultationStage || 'Nova consulta',
      responsibleUser: contact.responsibleUser,
      sales: contact.sales,
      clientType: contact.clientType,
      clientSector: contact.clientSector,
      budget: contact.budget,
      paymentMethod: contact.paymentMethod,
      clientObjective: contact.clientObjective,
      lossReason: contact.lossReason,
      contractNumber: contact.contractNumber,
      contractDate: contact.contractDate,
      payment: contact.payment
    });
    setIsEditModalOpen(true);
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
    resetNewContact,
    handleContactClick,
    openEditModal
  };
};
