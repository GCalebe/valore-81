
import React, { useState } from 'react';
import SearchBar from '@/components/knowledge/SearchBar';
import DocumentGrid from '@/components/knowledge/DocumentGrid';
import AddDocumentDialog from '@/components/knowledge/AddDocumentDialog';
import { useDocuments } from '@/hooks/useDocuments';

const DocumentsTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  
  const { 
    documents, 
    isLoading, 
    isRefreshing, 
    handleRefresh, 
    handleDeleteDocument,
    uploadFileToWebhook,
    clearAllDocuments
  } = useDocuments();

  const handleAddDocument = async (file: File, category: string) => {
    await uploadFileToWebhook(file, category);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Documentos
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie os documentos da base de conhecimento
        </p>
      </div>

      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={handleRefresh}
        onAddDocument={() => setIsAddDocumentOpen(true)}
        onClearAll={clearAllDocuments}
        isRefreshing={isRefreshing}
      />

      <DocumentGrid 
        documents={documents}
        searchQuery={searchQuery}
        onDeleteDocument={handleDeleteDocument}
      />

      <AddDocumentDialog 
        isOpen={isAddDocumentOpen}
        onOpenChange={setIsAddDocumentOpen}
        onAddDocument={handleAddDocument}
      />
    </div>
  );
};

export default DocumentsTab;
