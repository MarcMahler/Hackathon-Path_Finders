import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Plus, Search, ClipboardList, CheckCircle, XCircle, Clock } from 'lucide-react';

const initialRequests = [
  { id: 'REQ-001', requestedBy: 'Dr. Sarah Mitchell', resource: 'Medical Supplies Kit', quantity: 10, unit: 'kits', priority: 'High', status: 'Offen', requestDate: '2025-10-30', notes: 'Benötigt für Feldkrankenhaus Nord' },
  { id: 'REQ-002', requestedBy: 'John Anderson', resource: 'Emergency Food Rations', quantity: 50, unit: 'pallets', priority: 'Critical', status: 'Akzeptiert', requestDate: '2025-10-30', notes: 'Dringend für Notunterkunft #1' },
  { id: 'REQ-003', requestedBy: 'Maria Garcia', resource: 'Water Bottles (500ml)', quantity: 500, unit: 'bottles', priority: 'High', status: 'Offen', requestDate: '2025-10-29', notes: 'Verteilung in Zone 3' },
  { id: 'REQ-004', requestedBy: 'David Chen', resource: 'Communication Radios', quantity: 5, unit: 'units', priority: 'Medium', status: 'Abgelehnt', requestDate: '2025-10-29', notes: 'Nicht genügend Bestand verfügbar' },
  { id: 'REQ-005', requestedBy: 'Emily Thompson', resource: 'Portable Generators', quantity: 2, unit: 'units', priority: 'Critical', status: 'Akzeptiert', requestDate: '2025-10-28', notes: 'Für Kommunikationszentrale' },
  { id: 'REQ-006', requestedBy: 'Michael Brown', resource: 'Blankets', quantity: 100, unit: 'units', priority: 'Medium', status: 'Offen', requestDate: '2025-10-28', notes: 'Notunterkunft #2' },
  { id: 'REQ-007', requestedBy: 'Lisa Wang', resource: 'Tents (6-person)', quantity: 8, unit: 'units', priority: 'High', status: 'Akzeptiert', requestDate: '2025-10-27', notes: 'Temporäres Lager Zone 5' },
  { id: 'REQ-008', requestedBy: 'Robert Martinez', resource: 'Fuel (Diesel)', quantity: 200, unit: 'liters', priority: 'High', status: 'Offen', requestDate: '2025-10-27', notes: 'Für Transportfahrzeuge' },
];

export function Requests() {
  const [requests, setRequests] = useState(initialRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Alle');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredRequests = requests
    .filter(request =>
      (request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'Alle' || request.status === statusFilter)
    )
    .sort((a, b) => {
      const statusOrder = { 'Offen': 1, 'Akzeptiert': 2, 'Abgelehnt': 3 };
      return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
    });

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { className: string; icon: any }> = {
      'Offen': { className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100', icon: Clock },
      'Akzeptiert': { className: 'bg-green-100 text-green-800 hover:bg-green-100', icon: CheckCircle },
      'Abgelehnt': { className: 'bg-red-100 text-red-800 hover:bg-red-100', icon: XCircle },
    };
    const config = configs[status] || configs['Offen'];
    const Icon = config.icon;
    return (
      <Badge className={config.className}>
        <Icon className="w-3 h-3 mr-1 inline" />
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const configs: Record<string, { className: string }> = {
      'Critical': { className: 'bg-red-600 text-white hover:bg-red-600' },
      'High': { className: 'bg-orange-500 text-white hover:bg-orange-500' },
      'Medium': { className: 'bg-blue-500 text-white hover:bg-blue-500' },
      'Low': { className: 'bg-slate-500 text-white hover:bg-slate-500' },
    };
    const config = configs[priority] || configs['Medium'];
    return <Badge className={config.className}>{priority}</Badge>;
  };

  const totalRequests = requests.length;
  const openRequests = requests.filter(r => r.status === 'Offen').length;
  const acceptedRequests = requests.filter(r => r.status === 'Akzeptiert').length;
  const rejectedRequests = requests.filter(r => r.status === 'Abgelehnt').length;

  const stats = [
    { label: 'Gesamt Anfragen', value: totalRequests, icon: ClipboardList, color: 'bg-blue-500' },
    { label: 'Offen', value: openRequests, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Akzeptiert', value: acceptedRequests, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Abgelehnt', value: rejectedRequests, icon: XCircle, color: 'bg-red-500' },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">Ressourcenanfragen</h1>
          <p className="text-slate-600">Verwalten Sie alle Ressourcenanfragen von Krisenstabsmitarbeitern</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Neue Anfrage
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Neue Ressourcenanfrage erstellen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Ressource</Label>
                <Input placeholder="Name der benötigten Ressource" className="mt-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Menge</Label>
                  <Input type="number" placeholder="0" className="mt-2" />
                </div>
                <div>
                  <Label>Einheit</Label>
                  <Input placeholder="z.B. Stück, Paletten" className="mt-2" />
                </div>
              </div>
              <div>
                <Label>Priorität</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Priorität wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Notizen</Label>
                <Textarea 
                  placeholder="Zusätzliche Informationen zur Anfrage..." 
                  rows={3}
                  className="mt-2"
                />
              </div>
              <Button className="w-full">Anfrage erstellen</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm">{stat.label}</p>
                  <p className="text-2xl">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <div className="mb-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Suche nach Anfragen, Ressourcen oder Mitarbeitern..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status filtern" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Alle">Alle Status</SelectItem>
              <SelectItem value="Offen">Offen</SelectItem>
              <SelectItem value="Akzeptiert">Akzeptiert</SelectItem>
              <SelectItem value="Abgelehnt">Abgelehnt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Angefragt von</TableHead>
              <TableHead>Ressource</TableHead>
              <TableHead>Menge</TableHead>
              <TableHead>Priorität</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead>Notizen</TableHead>
              <TableHead>Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="text-slate-600">{request.id}</TableCell>
                <TableCell>{request.requestedBy}</TableCell>
                <TableCell>{request.resource}</TableCell>
                <TableCell>
                  {request.quantity} {request.unit}
                </TableCell>
                <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell className="text-slate-600">{request.requestDate}</TableCell>
                <TableCell className="text-slate-600 max-w-[200px] truncate">{request.notes}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {request.status === 'Offen' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => {
                            setRequests(requests.map(r => 
                              r.id === request.id ? { ...r, status: 'Akzeptiert' } : r
                            ));
                          }}
                        >
                          Akzeptieren
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            setRequests(requests.map(r => 
                              r.id === request.id ? { ...r, status: 'Abgelehnt' } : r
                            ));
                          }}
                        >
                          Ablehnen
                        </Button>
                      </>
                    )}
                    {request.status !== 'Offen' && (
                      <Button variant="outline" size="sm">Details</Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
