import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { MessageSquare, Send, Search, Plus } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participant: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar: string;
}

const conversations: Conversation[] = [
  { id: 'CONV-001', participant: 'Dr. Sarah Mitchell', lastMessage: 'Die Ressourcenanfrage wurde bearbeitet', timestamp: '2025-10-30T14:30:00', unreadCount: 2, avatar: 'SM' },
  { id: 'CONV-002', participant: 'John Anderson', lastMessage: 'Können wir das Meeting verschieben?', timestamp: '2025-10-30T13:15:00', unreadCount: 1, avatar: 'JA' },
  { id: 'CONV-003', participant: 'Maria Garcia', lastMessage: 'Danke für die schnelle Antwort!', timestamp: '2025-10-30T11:45:00', unreadCount: 0, avatar: 'MG' },
  { id: 'CONV-004', participant: 'David Chen', lastMessage: 'Die Inspection ist abgeschlossen', timestamp: '2025-10-29T16:20:00', unreadCount: 0, avatar: 'DC' },
  { id: 'CONV-005', participant: 'Emily Thompson', lastMessage: 'Statusbericht wurde eingereicht', timestamp: '2025-10-29T14:30:00', unreadCount: 0, avatar: 'ET' },
];

const messageHistory: Record<string, Message[]> = {
  'CONV-001': [
    { id: 'MSG-001', sender: 'Dr. Sarah Mitchell', content: 'Hallo! Ich habe eine Frage zur Ressourcenanfrage für medizinische Vorräte.', timestamp: '2025-10-30T13:00:00', read: true },
    { id: 'MSG-002', sender: 'me', content: 'Natürlich, was möchten Sie wissen?', timestamp: '2025-10-30T13:05:00', read: true },
    { id: 'MSG-003', sender: 'Dr. Sarah Mitchell', content: 'Können wir die Menge auf 15 Kits erhöhen? Wir haben mehr Bedarf als ursprünglich geplant.', timestamp: '2025-10-30T13:10:00', read: true },
    { id: 'MSG-004', sender: 'me', content: 'Ich prüfe das und melde mich gleich zurück.', timestamp: '2025-10-30T13:15:00', read: true },
    { id: 'MSG-005', sender: 'Dr. Sarah Mitchell', content: 'Die Ressourcenanfrage wurde bearbeitet', timestamp: '2025-10-30T14:30:00', read: false },
  ],
  'CONV-002': [
    { id: 'MSG-006', sender: 'John Anderson', content: 'Guten Tag! Wir haben morgen ein Meeting geplant.', timestamp: '2025-10-30T12:00:00', read: true },
    { id: 'MSG-007', sender: 'me', content: 'Ja, um 10:00 Uhr, richtig?', timestamp: '2025-10-30T12:30:00', read: true },
    { id: 'MSG-008', sender: 'John Anderson', content: 'Können wir das Meeting verschieben?', timestamp: '2025-10-30T13:15:00', read: false },
  ],
  'CONV-003': [
    { id: 'MSG-009', sender: 'me', content: 'Die Funkgeräte sind jetzt einsatzbereit.', timestamp: '2025-10-30T11:00:00', read: true },
    { id: 'MSG-010', sender: 'Maria Garcia', content: 'Danke für die schnelle Antwort!', timestamp: '2025-10-30T11:45:00', read: true },
  ],
};

export function DirectMessages() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('CONV-001');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewMessageDialogOpen, setIsNewMessageDialogOpen] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      // In einer echten Anwendung würde hier die Nachricht gesendet werden
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const timeStr = date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    
    if (date.toDateString() === today.toDateString()) {
      return timeStr;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Gestern, ${timeStr}`;
    } else {
      return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">Direct Messages</h1>
          <p className="text-slate-600">Direkte Kommunikation mit Ihrem Team</p>
        </div>
        <Dialog open={isNewMessageDialogOpen} onOpenChange={setIsNewMessageDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Neue Nachricht
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Neue Nachricht erstellen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Empfänger</Label>
                <Input placeholder="Name des Teammitglieds" className="mt-2" />
              </div>
              <div>
                <Label>Nachricht</Label>
                <Textarea placeholder="Ihre Nachricht..." rows={4} className="mt-2" />
              </div>
              <Button className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Senden
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 p-3 rounded-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Konversationen</p>
              <p className="text-2xl">{conversations.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-orange-500 p-3 rounded-lg">
              <Badge className="bg-white text-orange-600 hover:bg-white w-6 h-6 p-0 flex items-center justify-center">
                {totalUnread}
              </Badge>
            </div>
            <div>
              <p className="text-slate-600 text-sm">Ungelesen</p>
              <p className="text-2xl">{totalUnread}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-500 p-3 rounded-lg">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Gesendet heute</p>
              <p className="text-2xl">12</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1 p-4">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Suche..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <ScrollArea className="h-[600px]">
            <div className="space-y-2">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation === conv.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-600 text-white">
                        {conv.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-sm truncate ${conv.unreadCount > 0 ? '' : 'text-slate-600'}`}>
                          {conv.participant}
                        </p>
                        {conv.unreadCount > 0 && (
                          <Badge className="bg-orange-500 text-white hover:bg-orange-500 ml-2">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 truncate">{conv.lastMessage}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {formatTimestamp(conv.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Messages Panel */}
        <Card className="lg:col-span-2 p-6">
          {selectedConversation ? (
            <>
              <div className="border-b pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-blue-600 text-white">
                      {conversations.find(c => c.id === selectedConversation)?.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="mb-1">
                      {conversations.find(c => c.id === selectedConversation)?.participant}
                    </h3>
                    <p className="text-sm text-slate-600">Online</p>
                  </div>
                </div>
              </div>

              <ScrollArea className="h-[450px] mb-4">
                <div className="space-y-4 pr-4">
                  {messageHistory[selectedConversation]?.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          msg.sender === 'me'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-900'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.sender === 'me' ? 'text-blue-100' : 'text-slate-500'
                          }`}
                        >
                          {formatTimestamp(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Textarea
                  placeholder="Nachricht schreiben..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows={2}
                  className="resize-none"
                />
                <Button onClick={handleSendMessage} className="px-6">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p>Wählen Sie eine Konversation aus</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
