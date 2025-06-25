import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileIcon, PlusIcon, TrashIcon, DownloadIcon, EyeIcon } from 'lucide-react';
import { ClientDocument } from '@/types/clientDocument';

interface ClientDocumentsProps {
  /**
   * Lista de documentos do cliente
   */
  documents: ClientDocument[];
  
  /**
   * Função para adicionar um novo documento
   */
  onAddDocument?: (document: File, description: string) => Promise<void>;
  
  /**
   * Função para remover um documento
   */
  onRemoveDocument?: (documentId: string) => Promise<void>;
  
  /**
   * Função para visualizar um documento
   */
  onViewDocument?: (documentId: string) => Promise<void>;
  
  /**
   * Função para baixar um documento
   */
  onDownloadDocument?: (documentId: string) => Promise<void>;
  
  /**
   * Define se o componente deve ser exibido em modo compacto
   * @default false
   */
  compact?: boolean;
}

/**
 * Componente que exibe e permite o gerenciamento de documentos do cliente
 */
export const ClientDocuments: React.FC<ClientDocumentsProps> = ({
  documents,
  onAddDocument,
  onRemoveDocument,
  onViewDocument,
  onDownloadDocument,
  compact = false,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddDocument = async () => {
    if (!selectedFile || !onAddDocument) return;
    
    try {
      setIsUploading(true);
      await onAddDocument(selectedFile, description);
      setSelectedFile(null);
      setDescription('');
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Erro ao adicionar documento:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Card className={compact ? 'p-3' : 'p-4'}>
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Documentos</CardTitle>
        {onAddDocument && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <PlusIcon className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Documento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file">Arquivo</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição do documento"
                  />
                </div>
                <Button 
                  onClick={handleAddDocument} 
                  disabled={!selectedFile || isUploading}
                  className="w-full"
                >
                  {isUploading ? 'Enviando...' : 'Adicionar Documento'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {documents.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <FileIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>Nenhum documento encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.fileName}</TableCell>
                    <TableCell>{doc.description || '-'}</TableCell>
                    <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                    <TableCell>{formatDate(doc.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {onViewDocument && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onViewDocument(doc.id)}
                            title="Visualizar"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                        )}
                        {onDownloadDocument && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDownloadDocument(doc.id)}
                            title="Baixar"
                          >
                            <DownloadIcon className="h-4 w-4" />
                          </Button>
                        )}
                        {onRemoveDocument && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onRemoveDocument(doc.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Remover"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientDocuments;