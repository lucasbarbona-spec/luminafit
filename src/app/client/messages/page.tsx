'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useMessages } from '@/lib/hooks/useFirestore';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import ClientNav from '@/components/navigation/ClientNav';
import { MessageSquare, Send, Search, Check, CheckCheck, Clock } from 'lucide-react';

interface Conversation {
  id: number;
  trainer: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status: string;
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState('');

  // Default trainer conversation
  const conversations: Conversation[] = [
    {
      id: 1,
      trainer: 'Andrea (Entrenadora)',
      lastMessage: 'Ver chat',
      timestamp: '',
      unread: 0,
      status: 'online'
    }
  ];

  // For the client, we assume they have one main trainer
  // In a real app we'd fetch the trainer from the user's document
  // Assuming a static trainer ID for demo, or fetching it from user.trainerId
  const trainerId = 'andrea_admin'; // Hardcoded for this demo, since Andrea is the trainer
  const chatId = selectedConversation && user ? `${trainerId}_${user.uid}` : undefined;
  
  const { messages, sendMessage } = useMessages(chatId);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim() || !user) return;
    await sendMessage(user.uid, messageText);
    setMessageText('');
  };

  const quickReplies = [
    { id: 1, text: '¡Perfecto!' },
    { id: 2, text: 'Gracias' },
    { id: 3, text: '¿A qué hora?' },
    { id: 4, text: 'Confirmado' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex h-[calc(100vh-64px)]">
        {/* Lista de conversaciones */}
        <div className="w-80 bg-white rounded-l-xl border-r border-gray-200 p-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mensajes</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar conversaciones..."
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          {conversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={(e: React.MouseEvent) => setSelectedConversation(conversation)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedConversation?.id === conversation.id
                  ? 'bg-primary-100 border-primary-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium text-gray-900">{conversation.trainer}</h3>
                <span className="text-xs text-gray-500">{conversation.timestamp}</span>
              </div>
              <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
              <div className="flex justify-between items-center mt-1">
                <Badge
                  variant={conversation.status === 'online' ? 'success' : 'default'}
                  size="sm"
                >
                  {conversation.status === 'online' ? 'En línea' : 'Desconectado'}
                </Badge>
                {conversation.unread > 0 && (
                  <Badge
                    variant="primary"
                    size="sm"
                  >
                    {conversation.unread.toString()}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área de chat */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header del chat */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedConversation.trainer}</h3>
                  <Badge
                    variant="success"
                    size="sm"
                  >
                    En línea
                  </Badge>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                >
                  Llamada de video
                </Button>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-xl flex flex-col-reverse">
              <div className="space-y-4">
                {messages.map(message => {
                  const isOwn = message.senderId === user?.uid;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs px-4 py-2 rounded-xl ${
                        isOwn
                          ? 'bg-primary-600 text-white rounded-tr-none'
                          : 'bg-white border text-gray-900 rounded-tl-none'
                      }`}>
                        <p>{message.text}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-xs ${
                            isOwn ? 'text-primary-200' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isOwn && (
                            <span className="ml-2">
                              {message.isRead ? (
                                <CheckCheck className="w-4 h-4" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Área de respuesta */}
            <div className="border-t border-gray-200 pt-4">
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">Respuestas rápidas:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.slice(0, 4).map(reply => (
                    <Button
                      key={reply.id}
                      variant="secondary"
                      size="sm"
                    >
                      {reply.text}
                    </Button>
                  ))}
                </div>
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1"
                />
                <Button type="submit" variant="primary">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white rounded-r-xl p-6">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona una conversación</h3>
              <p className="text-gray-600">Elige una conversación de la lista para empezar a chatear</p>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
