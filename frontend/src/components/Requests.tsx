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
  acceptedQuantity: number;
  rejectedQuantity: number;
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
    priority: 'Kritisch', 
    status: 'Akzeptiert', 
    requestDate: '2025-10-30', 
    notes: 'DRINGEND: Großbrand in Industriegebiet - Notfallversorgung für 200 Personen', 
    deadline: '2025-10-31',
    articles: [
      { id: 'ART-001', name: 'Feldbetten', quantity: 50, unit: 'Stück', status: 'Accepted', acceptedQuantity: 50, rejectedQuantity: 0 },
      { id: 'ART-002', name: 'Decken', quantity: 80, unit: 'Stück', status: 'Accepted', acceptedQuantity: 80, rejectedQuantity: 0 },
      { id: 'ART-003', name: 'Warme Mahlzeiten', quantity: 200, unit: 'Portionen', status: 'Accepted', acceptedQuantity: 200, rejectedQuantity: 0 },
    ]
  },
  { 
    id: 'REQ-002', 
    organisation: 'Zivilschutz Zürich', 
    requestedBy: 'John Anderson', 
    priority: 'Kritisch', 
    status: 'Offen', 
    requestDate: '2025-10-30', 
    notes: 'Evakuierung Wohnblock - 150 Personen benötigen sofortige Unterkunft', 
    deadline: '2025-10-31',
    articles: [
      { id: 'ART-004', name: 'Feldbetten', quantity: 150, unit: 'Stück', status: 'Pending', acceptedQuantity: 0, rejectedQuantity: 0 },
      { id: 'ART-005', name: 'Schlafsäcke', quantity: 150, unit: 'Stück', status: 'Pending', acceptedQuantity: 0, rejectedQuantity: 0 },
      { id: 'ART-024', name: 'Hygieneset', quantity: 150, unit: 'Stück', status: 'Pending', acceptedQuantity: 0, rejectedQuantity: 0 },
    ]
  },
  { 
    id: 'REQ-003', 
    organisation: 'Feuerwehr Zürich', 
    requestedBy: 'Maria Garcia', 
    priority: 'Hoch', 
    status: 'Akzeptiert', 
    requestDate: '2025-10-29', 
    notes: 'Einsatzzentrum Zone 3 - Versorgung Einsatzkräfte 48h', 
    deadline: '2025-11-01',
    articles: [
      { id: 'ART-006', name: 'Trinkwasser', quantity: 600, unit: 'Liter', status: 'Accepted', acceptedQuantity: 600, rejectedQuantity: 0 },
      { id: 'ART-007', name: 'Sandwiches', quantity: 120, unit: 'Stück', status: 'Accepted', acceptedQuantity: 120, rejectedQuantity: 0 },
    ]
  },
  { 
    id: 'REQ-004', 
    organisation: 'Stadtpolizei Zürich', 
    requestedBy: 'David Chen', 
    priority: 'Niedrig', 
    status: 'Abgelehnt', 
    requestDate: '2025-10-29', 
    notes: 'Büroausstattung Ersatz - nicht kritisch für Notfall', 
    deadline: '2025-11-15',
    articles: [
      { id: 'ART-008', name: 'Tisch', quantity: 15, unit: 'Stück', status: 'Rejected', acceptedQuantity: 0, rejectedQuantity: 15 },
      { id: 'ART-025', name: 'Stuhl', quantity: 30, unit: 'Stück', status: 'Rejected', acceptedQuantity: 0, rejectedQuantity: 30 },
    ]
  },
  { 
    id: 'REQ-005', 
    organisation: 'Schweizer Armee', 
    requestedBy: 'Emily Thompson', 
    priority: 'Hoch', 
    status: 'Teilweise genehmigt', 
    requestDate: '2025-10-28', 
    notes: 'Kommunikationszentrale - kritische Infrastruktur', 
    deadline: '2025-10-30',
    articles: [
      { id: 'ART-009', name: 'Feldbetten', quantity: 40, unit: 'Stück', status: 'Accepted', acceptedQuantity: 40, rejectedQuantity: 0 },
      { id: 'ART-010', name: 'Schlafsäcke', quantity: 60, unit: 'Stück', status: 'Accepted', acceptedQuantity: 60, rejectedQuantity: 0 },
    ]
  },
  { 
    id: 'REQ-006', 
    organisation: 'Johanniter', 
    requestedBy: 'Michael Brown', 
    priority: 'Hoch', 
    status: 'Offen', 
    requestDate: '2025-10-28', 
    notes: 'Notunterkunft Gymnasium - 100 Familien mit Kindern', 
    deadline: '2025-11-01',
    articles: [
      { id: 'ART-011', name: 'Decken', quantity: 120, unit: 'Stück', status: 'Pending', acceptedQuantity: 0, rejectedQuantity: 0 },
      { id: 'ART-012', name: 'Kinder-Hygieneset', quantity: 80, unit: 'Stück', status: 'Pending', acceptedQuantity: 0, rejectedQuantity: 0 },
      { id: 'ART-013', name: 'Windeln', quantity: 60, unit: 'Pakete', status: 'Pending', acceptedQuantity: 0, rejectedQuantity: 0 },
    ]
  },
  { 
    id: 'REQ-007', 
    organisation: 'Malteser', 
    requestedBy: 'Lisa Wang', 
    priority: 'Mittel', 
    status: 'Abgelehnt', 
    requestDate: '2025-10-27', 
    notes: 'Planungsreserve - nicht zeitkritisch bei aktueller Lage', 
    deadline: '2025-11-05',
    articles: [
      { id: 'ART-014', name: 'Tisch', quantity: 35, unit: 'Stück', status: 'Rejected', acceptedQuantity: 0, rejectedQuantity: 35 },
    ]
  },
  { 
    id: 'REQ-008', 
    organisation: 'Samariterverein Zürich', 
    requestedBy: 'Robert Martinez', 
    priority: 'Kritisch', 
    status: 'Akzeptiert', 
    requestDate: '2025-10-27', 
    notes: 'Mobile Sanitätsstation - Versorgung Verletzte aus Katastrophengebiet', 
    deadline: '2025-10-30',
    articles: [
      { id: 'ART-015', name: 'Hygieneset', quantity: 200, unit: 'Stück', status: 'Accepted', acceptedQuantity: 200, rejectedQuantity: 0 },
      { id: 'ART-016', name: 'Desinfektionsmittel', quantity: 50, unit: 'Liter', status: 'Accepted', acceptedQuantity: 50, rejectedQuantity: 0 },
    ]
  },
  { 
    id: 'REQ-009', 
    organisation: 'SLRG Zürich', 
    requestedBy: 'Sophie Weber', 
    priority: 'Mittel', 
    status: 'Offen', 
    requestDate: '2025-10-26', 
    notes: 'Wasserrettung Limmat - präventive Bereitstellung', 
    deadline: '2025-11-05',
    articles: [
      { id: 'ART-017', name: 'Trinkwasser', quantity: 300, unit: 'Liter', status: 'Pending', acceptedQuantity: 0, rejectedQuantity: 0 },
      { id: 'ART-018', name: 'Warme Mahlzeiten', quantity: 40, unit: 'Portionen', status: 'Pending', acceptedQuantity: 0, rejectedQuantity: 0 },
    ]
  },
  { 
    id: 'REQ-010', 
    organisation: 'Pflegezentrum Seeblick', 
    requestedBy: 'Thomas Müller', 
    priority: 'Hoch', 
    status: 'Teilweise genehmigt', 
    requestDate: '2025-10-26', 
    notes: 'Evakuierung Pflegeheim - 80 betreuungsbedürftige Personen', 
    deadline: '2025-11-02',
    articles: [
      { id: 'ART-019', name: 'Feldbetten', quantity: 80, unit: 'Stück', status: 'Accepted', acceptedQuantity: 80, rejectedQuantity: 0 },
      { id: 'ART-020', name: 'Hygieneset', quantity: 80, unit: 'Stück', status: 'Accepted', acceptedQuantity: 80, rejectedQuantity: 0 },
      { id: 'ART-021', name: 'Windeln', quantity: 40, unit: 'Pakete', status: 'Accepted', acceptedQuantity: 40, rejectedQuantity: 0 },
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
  const dynamicRequests = getRequestsForChairman(); // Get requests from app usage
  const requests = [...dynamicRequests, ...initialRequests]; // New requests first, then dummy data
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
