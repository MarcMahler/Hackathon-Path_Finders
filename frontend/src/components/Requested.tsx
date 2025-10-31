import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import { RequestedDetail } from './RequestedDetail';
import { useRequests } from '../contexts/RequestContext';

interface Article {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  status: 'Ausstehend' | 'Genehmigt' | 'Abgelehnt' | 'Teilweise genehmigt';
  approvedQuantity?: number;
}

interface HistoryEntry {
  id: string;
  timestamp: string;
  action: string;
  comment: string;
  articles: Article[];
  user: string;
}

interface RequestedItem {
  id: string;
  priority: string;
  status: 'Ausstehend' | 'Genehmigt' | 'Abgelehnt' | 'Teilweise genehmigt';
  requestDate: string;
  deadline: string;
  notes: string;
  articles: Article[];
  history?: HistoryEntry[];
  pickupLocation?: string;
  pickupDate?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  instructions?: string;
}

const mockRequestedItems: RequestedItem[] = [
  {
    id: 'REQ-001',
    priority: 'Hoch',
    status: 'Ausstehend',
    requestDate: '2025-10-30',
    deadline: '2025-11-02',
    notes: 'Dringend für neue Notunterkunft',
    articles: [
      { id: 'ART-001', name: 'Feldbetten', quantity: 50, unit: 'Stück', status: 'Ausstehend' },
      { id: 'ART-002', name: 'Decken', quantity: 80, unit: 'Stück', status: 'Ausstehend' },
      { id: 'ART-003', name: 'Masken', quantity: 500, unit: 'Stück', status: 'Ausstehend' },
    ],
  },
  {
    id: 'REQ-002',
    priority: 'Kritisch',
    status: 'Genehmigt',
    requestDate: '2025-10-29',
    deadline: '2025-11-01',
    notes: 'Versorgung für Notunterkunft Kloten',
    articles: [
      { id: 'ART-004', name: 'Warme Mahlzeiten', quantity: 150, unit: 'Portionen', status: 'Genehmigt', approvedQuantity: 150 },
      { id: 'ART-005', name: 'Trinkwasser', quantity: 800, unit: 'Liter', status: 'Genehmigt', approvedQuantity: 800 },
    ],
    history: [
      {
        id: 'HIST-001',
        timestamp: '2025-10-30T14:23:00',
        action: 'Anfrage genehmigt',
        comment: 'Alle Artikel wurden genehmigt. Abholung im Hauptlager möglich ab morgen 08:00 Uhr.',
        articles: [
          { id: 'ART-004', name: 'Warme Mahlzeiten', quantity: 150, unit: 'Portionen', status: 'Genehmigt', approvedQuantity: 150 },
          { id: 'ART-005', name: 'Trinkwasser', quantity: 800, unit: 'Liter', status: 'Genehmigt', approvedQuantity: 800 },
        ],
        user: 'Krisenstab Leitung',
      },
    ],
    pickupLocation: 'Zürich Hauptlager, Bahnhofstrasse 123, 8001 Zürich',
    pickupDate: '2025-11-01',
    contactPerson: 'Max Müller',
    contactPhone: '+41 44 123 45 67',
    contactEmail: 'lager@resilio.ch',
    instructions: 'Bitte bringen Sie einen Transportwagen mit. Die Mahlzeiten müssen kühl gehalten werden.',
  },
  {
    id: 'REQ-003',
    priority: 'Mittel',
    status: 'Teilweise genehmigt',
    requestDate: '2025-10-28',
    deadline: '2025-10-31',
    notes: 'Versorgung für 3 Tage',
    articles: [
      { id: 'ART-006', name: 'Trinkwasser', quantity: 500, unit: 'Liter', status: 'Teilweise genehmigt', approvedQuantity: 300 },
      { id: 'ART-007', name: 'Hygieneset', quantity: 100, unit: 'Stück', status: 'Genehmigt', approvedQuantity: 100 },
    ],
    history: [
      {
        id: 'HIST-002',
        timestamp: '2025-10-29T10:15:00',
        action: 'Anfrage teilweise genehmigt',
        comment: 'Hygieneset vollständig verfügbar. Trinkwasser nur teilweise verfügbar - 300 Liter können bereitgestellt werden.',
        articles: [
          { id: 'ART-006', name: 'Trinkwasser', quantity: 500, unit: 'Liter', status: 'Teilweise genehmigt', approvedQuantity: 300 },
          { id: 'ART-007', name: 'Hygieneset', quantity: 100, unit: 'Stück', status: 'Genehmigt', approvedQuantity: 100 },
        ],
        user: 'Krisenstab Leitung',
      },
    ],
    pickupLocation: 'Winterthur Versorgungszentrum, Hauptstrasse 45, 8400 Winterthur',
    pickupDate: '2025-10-31',
    contactPerson: 'Anna Schmidt',
    contactPhone: '+41 52 234 56 78',
    contactEmail: 'winterthur@resilio.ch',
  },
  {
    id: 'REQ-004',
    priority: 'Niedrig',
    status: 'Abgelehnt',
    requestDate: '2025-10-27',
    deadline: '2025-10-30',
    notes: 'Nachbestellung Möbel',
    articles: [
      { id: 'ART-008', name: 'Tisch', quantity: 15, unit: 'Stück', status: 'Abgelehnt' },
    ],
    history: [
      {
        id: 'HIST-003',
        timestamp: '2025-10-28T16:45:00',
        action: 'Anfrage abgelehnt',
        comment: 'Nicht genügend Bestand verfügbar. Bitte reduzieren Sie die Menge oder wählen Sie eine spätere Frist.',
        articles: [
          { id: 'ART-008', name: 'Tisch', quantity: 15, unit: 'Stück', status: 'Abgelehnt' },
        ],
        user: 'Lagerverwaltung',
      },
    ],
  },
];

interface RequestedProps {
  selectedRequest: RequestedItem | null;
  onRequestSelect: (request: RequestedItem) => void;
  onBack: () => void;
}

export function Requested({ selectedRequest, onRequestSelect, onBack }: RequestedProps) {
  const { getRequestsForEmployee, getRequestCountsByStatus } = useRequests();
  const requestedItems = getRequestsForEmployee(); // Get dynamic data
  const requestCounts = getRequestCountsByStatus(); // Get dynamic counts
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  if (selectedRequest) {
    return <RequestedDetail request={selectedRequest} onBack={onBack} />;
  }

  const filteredRequests = requestedItems.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.articles.some(article => article.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { className: string; icon: any }> = {
      'Ausstehend': { className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100', icon: Clock },
      'Genehmigt': { className: 'bg-green-100 text-green-800 hover:bg-green-100', icon: CheckCircle },
      'Abgelehnt': { className: 'bg-red-100 text-red-800 hover:bg-red-100', icon: XCircle },
      'Teilweise genehmigt': { className: 'bg-purple-100 text-purple-800 hover:bg-purple-100', icon: CheckCircle },
    };
    const config = configs[status] || configs['Ausstehend'];
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

  const pendingCount = requestCounts.pending;
  const approvedCount = requestCounts.approved;
  const rejectedCount = requestCounts.rejected;
  const partialCount = requestCounts.partial;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2">Meine Anfragen</h1>
        <p className="text-slate-600">Übersicht aller von Ihnen gestellten Anfragen</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Ausstehend</p>
              <p className="text-2xl">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Genehmigt</p>
              <p className="text-2xl">{approvedCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Teilweise</p>
              <p className="text-2xl">{partialCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Abgelehnt</p>
              <p className="text-2xl">{rejectedCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Anfragen durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-64">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="Status filtern" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="Ausstehend">Ausstehend</SelectItem>
                <SelectItem value="Genehmigt">Genehmigt</SelectItem>
                <SelectItem value="Teilweise genehmigt">Teilweise genehmigt</SelectItem>
                <SelectItem value="Abgelehnt">Abgelehnt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Artikel</TableHead>
              <TableHead>Priorität</TableHead>
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
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{request.articles.length} Artikel</span>
                      <span className="text-xs text-slate-500">
                        {request.articles.slice(0, 2).map(a => a.name).join(', ')}
                        {request.articles.length > 2 && '...'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(request.priority)}</TableCell>
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
