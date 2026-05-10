'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAlumnos, useMessages } from '@/lib/hooks/useFirestore';
import TrainerNav from '@/components/navigation/TrainerNav';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { 
  MessageSquare, 
  Search, 
  Send, 
  MoreHorizontal, 
  Check, 
  CheckCheck,
  Clock,
  User,
  X,
  Phone,
  Video
} from 'lucide-react';

interface Conversation {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'online' | 'offline';
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  isOwn: boolean;
}

export default function TrainerMessagesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { alumnos, loading: alumnosLoading } = useAlumnos(user?.uid);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [messageText, setMessageText] = useState('');

  const chatId = selectedConversation && user ? `${user.uid}_${selectedConversation.studentId}` : undefined;
  const { messages, sendMessage } = useMessages(chatId);

  const conversations: Conversation[] = (alumnos || []).map(a => ({
    id: a.id,
    studentId: a.id,
    studentName: a.nombre,
    studentAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(a.nombre)}&background=random`,
    lastMessage: 'Ver mensajes',
    lastMessageTime: '',
    unreadCount: 0,
    status: 'online' as const
  }));

  const filteredConversations = conversations.filter(conv =>
    conv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Redirect if not authenticated or not trainer
  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (!authLoading && user && user.role !== 'trainer' && user.role !== 'admin') {
      router.push('/client/dashboard');
    }
  }, [user, authLoading, router]);

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim() || !user) return;
    await sendMessage(user.uid, messageText);
    setMessageText('');
  };

  if (selectedConversation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TrainerNav />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button
              variant="outline"
              size="md"
              icon={<MessageSquare className="w-4 h-4" />}
              onClick={handleBackToList}
            >
              Volver a Conversaciones
            </Button>
          </div>

          <Card className="h-[calc(100vh-200px)]">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Image
                      src={selectedConversation.studentAvatar}
                      alt={selectedConversation.studentName}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      selectedConversation.status === 'online' ? 'bg-success-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{selectedConversation.studentName}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.status === 'online' ? 'En línea' : 'Desconectado'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" icon={<Phone className="w-4 h-4" />} />
                  <Button variant="ghost" size="sm" icon={<Video className="w-4 h-4" />} />
                  <Button variant="ghost" size="sm" icon={<MoreHorizontal className="w-4 h-4" />} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[500px] flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col-reverse">
                  <div className="space-y-3">
                    {messages.map(msg => {
                      const isOwn = msg.senderId === user?.uid;
                      return (
                        <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <div className={`p-3 rounded-xl max-w-xs ${isOwn ? 'bg-primary-500 text-white rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                            <p className={`text-sm ${isOwn ? 'text-white' : 'text-gray-800'}`}>{msg.text}</p>
                            <span className={`text-xs mt-1 block ${isOwn ? 'text-primary-200' : 'text-gray-500'}`}>
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Escribe un mensaje..."
                      value={messageText}
                      onChange={e => setMessageText(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" variant="primary" size="md" icon={<Send className="w-4 h-4" />}>
                      Enviar
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TrainerNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Mensajes</h1>
            <p className="text-gray-500 font-medium">Comunícate con tus alumnos</p>
          </div>
          <Button
            variant="primary"
            size="lg"
            icon={<Send className="w-5 h-5" />}
            onClick={() => setShowNewMessage(true)}
            className="mt-4 sm:mt-0"
          >
            Nuevo Mensaje
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar conversaciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-xl"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConversations.map((conversation) => (
            <Card
              key={conversation.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleConversationClick(conversation)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <Image
                      src={conversation.studentAvatar}
                      alt={conversation.studentName}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      conversation.status === 'online' ? 'bg-success-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-gray-900 truncate">{conversation.studentName}</h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{conversation.lastMessageTime}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate mb-2">{conversation.lastMessage}</p>
                    {conversation.unreadCount > 0 && (
                      <Badge className="bg-primary-500 text-white" variant="default">
                        {conversation.unreadCount} mensajes sin leer
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* New Message Modal */}
        {showNewMessage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-lg w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Nuevo Mensaje</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<X className="w-5 h-5" />}
                    onClick={() => setShowNewMessage(false)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Seleccionar Alumno</label>
                    <select className="w-full h-12 rounded-xl border border-gray-200 px-4">
                      <option>Seleccionar alumno...</option>
                      <option>Juan Pérez</option>
                      <option>María García</option>
                      <option>Ana López</option>
                      <option>Carlos Ruiz</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Mensaje</label>
                    <textarea
                      placeholder="Escribe tu mensaje..."
                      className="w-full h-32 rounded-xl border border-gray-200 p-4 resize-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="primary"
                      size="md"
                      icon={<Send className="w-4 h-4" />}
                      className="flex-1"
                      onClick={() => setShowNewMessage(false)}
                    >
                      Enviar
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => setShowNewMessage(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
