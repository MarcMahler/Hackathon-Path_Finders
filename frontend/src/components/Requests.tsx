import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { RequestDetail } from './RequestDetail';
import { useRequests } from '../contexts/RequestContext';

interface Article {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
}

interface HistoryEntry {
  id: string;
  timestamp: string;
  action: string;
  comment: string;
  articles: Article[];
  user: string;
}

interface RequestType {
  id: string;
  organisation: string;
  requestedBy: string;
  priority: string;
  status: string;
  requestDate: string;
  notes: string;
  deadline: string;
  articles: Article[];
  history?: HistoryEntry[];
}

const initialRequests: RequestType[] = [
  { 
    id: 'REQ-001', 
    organisation: 'Schweizerisches Rotes Kreuz Zürich', 
    requestedBy: 'Dr. Sarah Mitchell', 
    priority: 'Hoch', 
    status: 'Offen', 
    requestDate: '2025-10-30', 
    notes: 'Benötigt für Feldkrankenhaus Nord', 
    deadline: '2025-11-02',
    articles: [
      { id: 'ART-001', name: 'Feldbetten', quantity: 50, unit: 'Stück', status: 'Pending' },
      { id: 'ART-002', name: 'Decken', quantity: 80, unit: 'Stück', status: 'Pending' },
      { id: 'ART-003', name: 'Masken', quantity: 500, unit: 'Stück', status: 'Pending' },
    ]
  },
  { 
    id: 'REQ-002', 
    organisation: 'Zivilschutz Zürich', 
    requestedBy: 'John Anderson', 
    priority: 'Kritisch', 
    status: 'Akzeptiert', 
    requestDate: '2025-10-30', 
    notes: 'Dringend für Notunterkunft #1', 
    deadline: '2025-10-31',
    articles: [
      { id: 'ART-004', name: 'Warme Mahlzeiten', quantity: 150, unit: 'Portionen', status: 'Accepted' },
      { id: 'ART-005', name: 'Trinkwasser', quantity: 800, unit: 'Liter', status: 'Accepted' },
    ],
    history: [
      {
        id: 'HIST-001',
        timestamp: '2025-10-30T14:23:00',
        action: 'Anfrage überprüft und abgeschlossen',
        comment: 'Alle Artikel wurden genehmigt. Notunterkunft hat höchste Priorität. Lieferung wurde für morgen früh angesetzt.',
        articles: [
          { id: 'ART-004', name: 'Warme Mahlzeiten', quantity: 150, unit: 'Portionen', status: 'Accepted' },
          { id: 'ART-005', name: 'Trinkwasser', quantity: 800, unit: 'Liter', status: 'Accepted' },
        ],
        user: 'Admin User (Überprüfer)',
      },
      {
        id: 'HIST-002',
        timestamp: '2025-10-30T10:15:00',
        action: 'Anfrage erstellt',
        comment: 'Dringende Anfrage für Notunterkunft #1 eingegangen.',
        articles: [
          { id: 'ART-004', name: 'Warme Mahlzeiten', quantity: 150, unit: 'Portionen', status: 'Pending' },
          { id: 'ART-005', name: 'Trinkwasser', quantity: 800, unit: 'Liter', status: 'Pending' },
        ],
        user: 'John Anderson (Anfragender)',
      },
    ]
  },
  { 
    id: 'REQ-003', 
    organisation: 'Feuerwehr Zürich', 
    requestedBy: 'Maria Garcia', 
    priority: 'Hoch', 
    status: 'Offen', 
    requestDate: '2025-10-29', 
    notes: 'Verteilung in Zone 3', 
    deadline: '2025-11-01',
    articles: [
      { id: 'ART-006', name: 'Trinkwasser', quantity: 600, unit: 'Liter', status: 'Pending' },
      { id: 'ART-007', name: 'Desinfektionsmittel', quantity: 50, unit: 'Liter', status: 'Pending' },
    ]
  },
  { 
    id: 'REQ-004', 
    organisation: 'Stadtpolizei Zürich', 
    requestedBy: 'David Chen', 
    priority: 'Mittel', 
    status: 'Abgelehnt', 
    requestDate: '2025-10-29', 
    notes: 'Nicht genügend Bestand verfügbar', 
    deadline: '2025-11-03',
    articles: [
      { id: 'ART-008', name: 'Tisch', quantity: 15, unit: 'Stück', status: 'Rejected' },
    ]
  },
  { 
    id: 'REQ-005', 
    organisation: 'Schweizer Armee', 
    requestedBy: 'Emily Thompson', 
    priority: 'Kritisch', 
    status: 'Akzeptiert', 
    requestDate: '2025-10-28', 
    notes: 'Für Kommunikationszentrale', 
    deadline: '2025-10-30',
    articles: [
      { id: 'ART-009', name: 'Feldbetten', quantity: 40, unit: 'Stück', status: 'Accepted' },
      { id: 'ART-010', name: 'Schlafsäcke', quantity: 40, unit: 'Stück', status: 'Accepted' },
    ]
  },
  { 
    id: 'REQ-006', 
    organisation: 'Johanniter', 
    requestedBy: 'Michael Brown', 
    priority: 'Mittel', 
    status: 'Offen', 
    requestDate: '2025-10-28', 
    notes: 'Notunterkunft #2', 
    deadline: '2025-11-04',
    articles: [
      { id: 'ART-011', name: 'Decken', quantity: 120, unit: 'Stück', status: 'Pending' },
      { id: 'ART-012', name: 'Hygieneset', quantity: 80, unit: 'Stück', status: 'Pending' },
      { id: 'ART-013', name: 'Schlafsäcke', quantity: 60, unit: 'Stück', status: 'Pending' },
    ]
  },
  { 
    id: 'REQ-007', 
    organisation: 'Malteser', 
    requestedBy: 'Lisa Wang', 
    priority: 'Hoch', 
    status: 'Akzeptiert', 
    requestDate: '2025-10-27', 
    notes: 'Temporäres Lager Zone 5', 
    deadline: '2025-11-01',
    articles: [
      { id: 'ART-014', name: 'Feldbetten', quantity: 35, unit: 'Stück', status: 'Accepted' },
    ]
  },
  { 
    id: 'REQ-008', 
    organisation: 'Samariterverein Zürich', 
    requestedBy: 'Robert Martinez', 
    priority: 'Hoch', 
    status: 'Offen', 
    requestDate: '2025-10-27', 
    notes: 'Für Transportfahrzeuge', 
    deadline: '2025-11-02',
    articles: [
      { id: 'ART-015', name: 'Sandwiches', quantity: 200, unit: 'Stück', status: 'Pending' },
      { id: 'ART-016', name: 'Trinkwasser', quantity: 400, unit: 'Liter', status: 'Pending' },
    ]
  },
  { 
    id: 'REQ-009', 
    organisation: 'SLRG Zürich', 
    requestedBy: 'Sophie Weber', 
    priority: 'Mittel', 
    status: 'Offen', 
    requestDate: '2025-10-26', 
    notes: 'Rettungsausrüstung für Wassergebiet', 
    deadline: '2025-11-05',
    articles: [
      { id: 'ART-017', name: 'Windeln', quantity: 30, unit: 'Pakete', status: 'Pending' },
      { id: 'ART-018', name: 'Kinder-Hygieneset', quantity: 40, unit: 'Stück', status: 'Pending' },
    ]
  },
  { 
    id: 'REQ-010', 
    organisation: 'Schweizerisches Rotes Kreuz Zürich', 
    requestedBy: 'Thomas Müller', 
    priority: 'Niedrig', 
    status: 'Offen', 
    requestDate: '2025-10-26', 
    notes: 'Nachschub für Erste-Hilfe-Stationen', 
    deadline: '2025-11-06',
    articles: [
      { id: 'ART-019', name: 'Masken', quantity: 300, unit: 'Stück', status: 'Pending' },
      { id: 'ART-020', name: 'Desinfektionsmittel', quantity: 25, unit: 'Liter', status: 'Pending' },
    ]
  },
];

interface RequestsProps {
  selectedRequest: RequestType | null;
  onRequestSelect: (request: RequestType) => void;
  onBack: () => void;
  onProductClick: (productName: string) => void;
}

export function Requests({ selectedRequest, onRequestSelect, onBack, onProductClick }: RequestsProps) {
  const { getRequestsForChairman, updateRequestStatus } = useRequests();
  const requests = getRequestsForChairman(); // Get dynamic data instead of hardcoded
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Offen');

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    console.log('🔄 Starting request status update:', { requestId, newStatus });
    
    try {
      // Use the context to update request status
      await updateRequestStatus(
        requestId, 
        newStatus as any, // Convert string to proper status type
        `Status geändert zu: ${newStatus}`,
        'Krisenstab Leitung' // In real app, this would be the current user
      );
      
      console.log('✅ Request status updated successfully:', { requestId, newStatus });
    } catch (error) {
      console.error('❌ Failed to update request status:', error);
    }
  };

  if (selectedRequest) {
    return (
      <RequestDetail 
        request={selectedRequest} 
        onBack={onBack}
        onProductClick={onProductClick}
        onStatusChange={handleStatusChange}
      />
    );
  }

  const filteredRequests = requests
    .filter(request =>
      (request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.organisation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.notes.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'Alle' || request.status === statusFilter)
    );

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
      'Kritisch': { className: 'bg-red-600 text-white hover:bg-red-600' },
      'Hoch': { className: 'bg-orange-500 text-white hover:bg-orange-500' },
      'Mittel': { className: 'bg-blue-500 text-white hover:bg-blue-500' },
      'Niedrig': { className: 'bg-slate-500 text-white hover:bg-slate-500' },
    };
    const config = configs[priority] || configs['Mittel'];
    return <Badge className={config.className}>{priority}</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
  };

  const isDeadlineUrgent = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2 && diffDays >= 0;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2">Anfragen</h1>
        <p className="text-slate-600">Übersicht aller Produktanfragen</p>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Suche nach Organisation, Name oder Notizen..."
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
              <SelectItem value="Offen">Offen</SelectItem>
              <SelectItem value="Akzeptiert">Akzeptiert</SelectItem>
              <SelectItem value="Abgelehnt">Abgelehnt</SelectItem>
              <SelectItem value="Alle">Alle Status</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organisation</TableHead>
              <TableHead>Angefragt von</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Erstellt</TableHead>
              <TableHead>Frist</TableHead>
              <TableHead>Notizen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <TableRow 
                  key={request.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => onRequestSelect(request)}
                >
                  <TableCell>
                    {request.organisation}
                  </TableCell>
                  <TableCell>{request.requestedBy}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-slate-600">{formatDate(request.requestDate)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={isDeadlineUrgent(request.deadline) ? 'border-red-500 text-red-700' : 'text-slate-600'}
                    >
                      {formatDate(request.deadline)}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <p className="truncate text-slate-600" title={request.notes}>
                      {request.notes}
                    </p>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                  Keine Anfragen gefunden
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
