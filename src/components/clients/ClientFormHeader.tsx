import React from "react";
import { UserPlus } from "lucide-react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const ClientFormHeader = () => {
  return (
    <DialogHeader className="flex-shrink-0 pb-2">
      <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
        <UserPlus className="h-5 w-5 text-green-500" />
        Adicionar Novo Cliente Náutico
      </DialogTitle>
      <DialogDescription className="text-gray-600 dark:text-gray-300">
        Preencha as informações para adicionar um novo cliente náutico ao seu
        CRM.
      </DialogDescription>
    </DialogHeader>
  );
};

export default ClientFormHeader;
