
import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const MediaTab: React.FC = () => {
  return (
    <div className="text-center py-8 text-gray-500">
      <h3 className="text-lg font-medium mb-2">Mídia</h3>
      <p>Upload de imagens, vídeos ou documentos.</p>
      <Button className="mt-4">
        <Upload className="h-4 w-4 mr-2" />
        Upload de Mídia
      </Button>
    </div>
  );
};

export default MediaTab;
