import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Package, Users, MapPin, MessageSquare, CheckSquare, Clock } from 'lucide-react';

interface HistoryEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'Resource' | 'Personnel' | 'Location' | 'Message' | 'Task';
  details: string;
}

const historyData: HistoryEntry[] = [
  { id: 'H-024', timestamp: '2025-10-30T14:30:00', user: 'Dr. Sarah Mitchell', action: 'Ressourcenanfrage akzeptiert', category: 'Resource', details: 'Emergency Food Rations (50 pallets)' },
  { id: 'H-023', timestamp: '2025-10-30T14:15:00', user: 'John Anderson', action: 'Neue Aufgabe erstellt', category: 'Task', details: 'Ressourcen-Bestandsaufnahme' },
  { id: 'H-022', timestamp: '2025-10-30T13:45:00', user: 'Maria Garcia', action: 'Mitarbeiter hinzugefügt', category: 'Personnel', details: 'Robert Martinez zum Team hinzugefügt' },
  { id: 'H-021', timestamp: '2025-10-30T13:20:00', user: 'David Chen', action: 'Nachricht gesendet', category: 'Message', details: 'An alle Teammitglieder: Statusupdate' },
  { id: 'H-020', timestamp: '2025-10-30T12:50:00', user: 'Emily Thompson', action: 'Standort aktualisiert', category: 'Location', details: 'Notunterkunft #2 - Kapazität geändert' },
  { id: 'H-019', timestamp: '2025-10-30T12:30:00', user: 'Michael Brown', action: 'Aufgabe abgeschlossen', category: 'Task', details: 'Transportrouten planen' },
  { id: 'H-018', timestamp: '2025-10-30T11:45:00', user: 'Lisa Wang', action: 'Ressourcenanfrage erstellt', category: 'Resource', details: 'Water Bottles (500 bottles)' },
  { id: 'H-017', timestamp: '2025-10-30T11:20:00', user: 'Dr. Sarah Mitchell', action: 'Ressourcenanfrage abgelehnt', category: 'Resource', details: 'Communication Radios (5 units)' },
  { id: 'H-016', timestamp: '2025-10-30T10:55:00', user: 'John Anderson', action: 'Standort hinzugefügt', category: 'Location', details: 'Feldkrankenhaus Nord' },
  { id: 'H-015', timestamp: '2025-10-30T10:30:00', user: 'Maria Garcia', action: 'Nachricht gesendet', category: 'Message', details: 'An Dr. Sarah Mitchell: Dringende Rückfrage' },
  { id: 'H-014', timestamp: '2025-10-30T10:00:00', user: 'David Chen', action: 'Aufgabe aktualisiert', category: 'Task', details: 'Notunterkunft inspizieren - Status geändert' },
  { id: 'H-013', timestamp: '2025-10-30T09:30:00', user: 'Emily Thompson', action: 'Ressource hinzugefügt', category: 'Resource', details: 'Portable Generators (3 units)' },
  { id: 'H-012', timestamp: '2025-10-29T16:45:00', user: 'Michael Brown', action: 'Mitarbeiter aktualisiert', category: 'Personnel', details: 'Lisa Wang - Rolle geändert' },
  { id: 'H-011', timestamp: '2025-10-29T16:20:00', user: 'Lisa Wang', action: 'Ressourcenanfrage akzeptiert', category: 'Resource', details: 'Tents (8 units)' },
  { id: 'H-010', timestamp: '2025-10-29T15:50:00', user: 'Dr. Sarah Mitchell', action: 'Neue Aufgabe erstellt', category: 'Task', details: 'Notfall-Evakuierungsplan erstellen' },
  { id: 'H-009', timestamp: '2025-10-29T15:20:00', user: 'John Anderson', action: 'Nachricht gesendet', category: 'Message', details: 'An alle: Teammeeting um 17:00' },
  { id: 'H-008', timestamp: '2025-10-29T14:45:00', user: 'Maria Garcia', action: 'Standort aktualisiert', category: 'Location', details: 'Warehouse A - GPS-Koordinaten korrigiert' },
  { id: 'H-007', timestamp: '2025-10-29T14:10:00', user: 'David Chen', action: 'Ressourcenanfrage erstellt', category: 'Resource', details: 'Fuel Diesel (200 liters)' },
  { id: 'H-006', timestamp: '2025-10-29T13:30:00', user: 'Emily Thompson', action: 'Aufgabe abgeschlossen', category: 'Task', details: 'Statusbericht verfassen' },
  { id: 'H-005', timestamp: '2025-10-29T12:55:00', user: 'Michael Brown', action: 'Mitarbeiter hinzugefügt', category: 'Personnel', details: 'David Chen zum Team hinzugefügt' },
];

export function History() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Alle');

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      'Resource': Package,
      'Personnel': Users,
      'Location': MapPin,
      'Message': MessageSquare,
      'Task': CheckSquare,
    };
    return icons[category] || Clock;
  };

  const getCategoryBadge = (category: string) => {
    const configs: Record<string, { className: string }> = {
      'Resource': { className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
      'Personnel': { className: 'bg-green-100 text-green-800 hover:bg-green-100' },
      'Location': { className: 'bg-purple-100 text-purple-800 hover:bg-purple-100' },
      'Message': { className: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
      'Task': { className: 'bg-pink-100 text-pink-800 hover:bg-pink-100' },
    };
    const config = configs[category] || configs['Resource'];
    const Icon = getCategoryIcon(category);
    return (
      <Badge className={config.className}>
        <Icon className="w-3 h-3 mr-1 inline" />
        {category}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const timeStr = date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    
    if (date.toDateString() === today.toDateString()) {
      return `Heute, ${timeStr}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Gestern, ${timeStr}`;
    } else {
      return date.toLocaleString('de-DE', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  const filteredHistory = historyData
    .filter(entry => 
      (filterCategory === 'Alle' || entry.category === filterCategory) &&
      (entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
       entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
       entry.details.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const stats = [
    { label: 'Gesamt', value: historyData.length, color: 'bg-blue-500' },
    { label: 'Heute', value: historyData.filter(e => new Date(e.timestamp).toDateString() === new Date().toDateString()).length, color: 'bg-green-500' },
    { label: 'Ressourcen', value: historyData.filter(e => e.category === 'Resource').length, color: 'bg-purple-500' },
    { label: 'Aufgaben', value: historyData.filter(e => e.category === 'Task').length, color: 'bg-orange-500' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2">History</h1>
        <p className="text-slate-600">Verlauf aller Aktivitäten und Änderungen im System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
              <span className="text-white text-xl">{stat.value}</span>
            </div>
            <p className="text-slate-600">{stat.label}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6 mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Durchsuchen Sie die History..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Kategorie filtern" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Alle">Alle Kategorien</SelectItem>
              <SelectItem value="Resource">Resource</SelectItem>
              <SelectItem value="Personnel">Personnel</SelectItem>
              <SelectItem value="Location">Location</SelectItem>
              <SelectItem value="Message">Message</SelectItem>
              <SelectItem value="Task">Task</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="space-y-3">
        {filteredHistory.map((entry) => {
          const Icon = getCategoryIcon(entry.category);
          return (
            <Card key={entry.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${
                  entry.category === 'Resource' ? 'bg-blue-100' :
                  entry.category === 'Personnel' ? 'bg-green-100' :
                  entry.category === 'Location' ? 'bg-purple-100' :
                  entry.category === 'Message' ? 'bg-orange-100' :
                  'bg-pink-100'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    entry.category === 'Resource' ? 'text-blue-600' :
                    entry.category === 'Personnel' ? 'text-green-600' :
                    entry.category === 'Location' ? 'text-purple-600' :
                    entry.category === 'Message' ? 'text-orange-600' :
                    'text-pink-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="mb-1">{entry.action}</p>
                      <p className="text-slate-600 text-sm">{entry.details}</p>
                    </div>
                    <Badge variant="outline" className="text-slate-600 whitespace-nowrap ml-4">
                      {entry.id}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {getCategoryBadge(entry.category)}
                    <Badge variant="outline">
                      {entry.user}
                    </Badge>
                    <Badge variant="outline" className="text-slate-600">
                      <Clock className="w-3 h-3 mr-1 inline" />
                      {formatTimestamp(entry.timestamp)}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
