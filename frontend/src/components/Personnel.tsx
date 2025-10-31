import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Plus, Search, Circle } from 'lucide-react';

interface Person {
  id: string;
  name: string;
  organisation: string;
  rolle: string;
  email: string;
  tel: string;
  lastSeen: Date;
}

const initialPersonnel: Person[] = [
  { 
    id: '1', 
    name: 'Dr. Sarah Mitchell', 
    organisation: 'Feuerwehr Zürich', 
    rolle: 'Einsatzleiter', 
    email: 's.mitchell@feuerwehr-zuerich.ch',
    tel: '+41 44 411 3344', 
    lastSeen: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
  },
  { 
    id: '2', 
    name: 'Thomas Weber', 
    organisation: 'Zivilschutz Zürich', 
    rolle: 'Logistik-Koordinator', 
    email: 't.weber@zivilschutz-zh.ch',
    tel: '+41 44 411 3345', 
    lastSeen: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
  },
  { 
    id: '3', 
    name: 'Anna Schneider', 
    organisation: 'Schweizerisches Rotes Kreuz Zürich', 
    rolle: 'Medizinische Versorgung', 
    email: 'a.schneider@srk-zuerich.ch',
    tel: '+41 44 411 3346', 
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  { 
    id: '4', 
    name: 'Michael Bauer', 
    organisation: 'Stadtpolizei Zürich', 
    rolle: 'Sicherheitsbeauftragter', 
    email: 'm.bauer@stadtpolizei.zuerich.ch',
    tel: '+41 44 411 3347', 
    lastSeen: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
  },
  { 
    id: '5', 
    name: 'Julia Hoffmann', 
    organisation: 'Stadt Zürich', 
    rolle: 'Krisenkoordinator', 
    email: 'j.hoffmann@zuerich.ch',
    tel: '+41 44 411 3348', 
    lastSeen: new Date(Date.now() - 1 * 60 * 1000) // 1 minute ago
  },
  { 
    id: '6', 
    name: 'Stefan Müller', 
    organisation: 'Zivilschutz Zürich', 
    rolle: 'Technischer Dienst', 
    email: 's.mueller@zivilschutz-zh.ch',
    tel: '+41 44 411 3349', 
    lastSeen: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
  },
  { 
    id: '7', 
    name: 'Laura Schmidt', 
    organisation: 'Schweizerisches Rotes Kreuz Zürich', 
    rolle: 'Sanitäter', 
    email: 'l.schmidt@srk-zuerich.ch',
    tel: '+41 44 411 3350', 
    lastSeen: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
  },
  { 
    id: '8', 
    name: 'Robert Fischer', 
    organisation: 'Feuerwehr Zürich', 
    rolle: 'Kommunikation', 
    email: 'r.fischer@feuerwehr-zuerich.ch',
    tel: '+41 44 411 3351', 
    lastSeen: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
  },
];

export function Personnel() {
  const [personnel, setPersonnel] = useState<Person[]>(initialPersonnel);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPerson, setNewPerson] = useState({
    name: '',
    organisation: '',
    rolle: '',
    email: '',
    tel: '',
  });

  const filteredPersonnel = personnel.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.organisation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.rolle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Gerade eben';
    if (diffMins < 60) return `vor ${diffMins} Min.`;
    if (diffHours < 24) return `vor ${diffHours} Std.`;
    return `vor ${diffDays} Tagen`;
  };

  const getOnlineStatus = (date: Date) => {
    const diffMins = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (diffMins < 5) return 'online';
    if (diffMins < 30) return 'away';
    return 'offline';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'away':
        return 'text-yellow-500';
      default:
        return 'text-slate-400';
    }
  };

  const handleAddPerson = () => {
    if (newPerson.name && newPerson.organisation && newPerson.rolle && newPerson.email && newPerson.tel) {
      const person: Person = {
        id: String(personnel.length + 1),
        name: newPerson.name,
        organisation: newPerson.organisation,
        rolle: newPerson.rolle,
        email: newPerson.email,
        tel: newPerson.tel,
        lastSeen: new Date(),
      };
      setPersonnel([...personnel, person]);
      setNewPerson({ name: '', organisation: '', rolle: '', email: '', tel: '' });
      setIsAddDialogOpen(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">Mitarbeiter</h1>
          <p className="text-slate-600">Übersicht aller Krisenstabsmitarbeiter</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Mitarbeiter hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby="add-personnel-description">
            <DialogHeader>
              <DialogTitle>Neuen Mitarbeiter hinzufügen</DialogTitle>
              <DialogDescription id="add-personnel-description">
                Fügen Sie einen neuen Mitarbeiter zum Krisenstab hinzu.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Name</Label>
                <Input 
                  placeholder="Vollständiger Name" 
                  value={newPerson.name}
                  onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Organisation</Label>
                <Input 
                  placeholder="z.B. Feuerwehr Zürich" 
                  value={newPerson.organisation}
                  onChange={(e) => setNewPerson({ ...newPerson, organisation: e.target.value })}
                />
              </div>
              <div>
                <Label>Rolle</Label>
                <Input 
                  placeholder="z.B. Einsatzleiter" 
                  value={newPerson.rolle}
                  onChange={(e) => setNewPerson({ ...newPerson, rolle: e.target.value })}
                />
              </div>
              <div>
                <Label>E-Mail</Label>
                <Input 
                  type="email"
                  placeholder="beispiel@organisation.de" 
                  value={newPerson.email}
                  onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
                />
              </div>
              <div>
                <Label>Telefon</Label>
                <Input 
                  placeholder="+49 89 2323-1234" 
                  value={newPerson.tel}
                  onChange={(e) => setNewPerson({ ...newPerson, tel: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setNewPerson({ name: '', organisation: '', rolle: '', email: '', tel: '' });
                  }}
                >
                  Abbrechen
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleAddPerson}
                >
                  Hinzufügen
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Suche nach Name, Organisation oder Rolle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Organisation</TableHead>
              <TableHead>Rolle</TableHead>
              <TableHead>E-Mail</TableHead>
              <TableHead>Tel.</TableHead>
              <TableHead>Last Seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPersonnel.map((person) => {
              const status = getOnlineStatus(person.lastSeen);
              return (
                <TableRow key={person.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarFallback>{getInitials(person.name)}</AvatarFallback>
                        </Avatar>
                        <Circle 
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(status)} fill-current bg-white rounded-full`} 
                        />
                      </div>
                      <span>{person.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{person.organisation}</Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">{person.rolle}</TableCell>
                  <TableCell className="text-slate-600">{person.email}</TableCell>
                  <TableCell className="text-slate-600">{person.tel}</TableCell>
                  <TableCell className="text-slate-600">{formatLastSeen(person.lastSeen)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredPersonnel.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            Keine Mitarbeiter gefunden
          </div>
        )}
      </Card>
    </div>
  );
}
