import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { N8nChatHistory } from "@/types/chat";
import { fetchChatHistory } from "@/lib/chatService";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  MessageCircle,
  Calendar,
  Clock,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

interface InteractionTimelineProps {
  sessionId: string | null;
  maxHeight?: string;
}

interface TimelineItem {
  id: number;
  type: "message" | "status" | "event";
  content: string;
  timestamp: string;
  sender?: "user" | "bot";
  metadata?: Record<string, any>;
}

const InteractionTimeline: React.FC<InteractionTimelineProps> = ({
  sessionId,
  maxHeight = "300px",
}) => {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    const loadChatHistory = async () => {
      setLoading(true);
      try {
        const history = await fetchChatHistory(sessionId);
        const formattedItems = formatTimelineItems(history);
        setTimelineItems(formattedItems);
      } catch (error) {
        console.error("Erro ao carregar histórico de interações:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChatHistory();
  }, [sessionId]);

  const formatTimelineItems = (history: N8nChatHistory[]): TimelineItem[] => {
    return history.map((item) => {
      const timestamp = item.data || new Date().toISOString();
      const messageObj =
        typeof item.message === "string"
          ? JSON.parse(item.message)
          : item.message;

      // Determinar o tipo de mensagem e o remetente
      let type: "message" | "status" | "event" = "message";
      let sender: "user" | "bot" = "user";
      let content = "";

      if (messageObj.type === "status_update") {
        type = "status";
        content = messageObj.content || "Atualização de status";
      } else if (messageObj.type === "event") {
        type = "event";
        content = messageObj.content || "Evento do sistema";
      } else {
        // É uma mensagem normal
        content = messageObj.content || messageObj.message || "Mensagem";
        sender =
          messageObj.sender || messageObj.from === "user" ? "user" : "bot";
      }

      return {
        id: item.id,
        type,
        content,
        timestamp,
        sender,
        metadata: messageObj,
      };
    });
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    } catch (e) {
      return "Data desconhecida";
    }
  };

  const renderTimelineItem = (item: TimelineItem) => {
    const formattedTime = formatTimestamp(item.timestamp);

    return (
      <div
        key={item.id}
        className="mb-4 relative pl-6 border-l-2 border-gray-200 dark:border-gray-700"
      >
        <div className="absolute -left-1.5 mt-1.5">
          {item.type === "message" ? (
            <Badge
              className={
                item.sender === "user" ? "bg-blue-500" : "bg-green-500"
              }
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              {item.sender === "user" ? "Cliente" : "Bot"}
            </Badge>
          ) : item.type === "status" ? (
            <Badge
              variant="outline"
              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Status
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
            >
              <Clock className="h-3 w-3 mr-1" />
              Evento
            </Badge>
          )}
        </div>

        <div className="ml-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formattedTime}
          </p>
          <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <p className="text-sm">{item.content}</p>
          </div>
        </div>
      </div>
    );
  };

  if (!sessionId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Histórico de Interações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 dark:text-gray-400">
            Selecione uma conversa para ver o histórico de interações
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Histórico de Interações</CardTitle>
        <div className="flex space-x-2">
          <Badge variant="outline" className="flex items-center">
            <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
            Recebidas
          </Badge>
          <Badge variant="outline" className="flex items-center">
            <ArrowDown className="h-3 w-3 mr-1 text-blue-500" />
            Enviadas
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="h-6 w-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : timelineItems.length > 0 ? (
          <ScrollArea
            className={`pr-4 ${maxHeight ? `max-h-[${maxHeight}]` : ""}`}
          >
            <div className="space-y-1">
              {timelineItems.map(renderTimelineItem)}
            </div>
          </ScrollArea>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            Nenhuma interação encontrada para esta conversa
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractionTimeline;
