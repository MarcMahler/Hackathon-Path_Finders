import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { ArrowLeft, CheckCircle, XCircle, Clock, Package, History as HistoryIcon, Bed, Droplet, Utensils, Armchair, MapPin, Phone, Mail, Calendar } from 'lucide-react';

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

interface Request {
  id: string;
  priority: string;
  status: 'Ausstehend' | 'Genehmigt' | 'Abgelehnt' | 'Teilweise genehmigt';
  requestDate: string;
  notes: string;
  deadline: string;
  articles: Article[];
  history?: HistoryEntry[];
  pickupLocation?: string;
  pickupDate?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  instructions?: string;
}

interface RequestedDetailProps {
  request: Request;
  onBack: () => void;
}

export function RequestedDetail({ request, onBack }: RequestedDetailProps) {
  const getCategoryByProductName = (productName: string): string => {
    const name = productName.toLowerCase();
    if (name.includes('feldbett') || name.includes('schlafsack') || name.includes('decke')) {
      return 'Schlafen';
    }
    if (name.includes('hygiene') || name.includes('windel') || name.includes('maske') || name.includes('desinfektions')) {
      return 'Hygiene';
    }
    if (name.includes('mahlzeit') || name.includes('wasser') || name.includes('sandwich') || name.includes('verpflegung')) {
      return 'Verpflegung';
    }
    if (name.includes('tisch') || name.includes('stuhl') || name.includes('möbel')) {
      return 'Möbel';
    }
    return 'Sonstiges';
  };

  const getCategoryIcon = (productName: string) => {
    const category = getCategoryByProductName(productName);
    switch (category) {
      case 'Schlafen':
        return { icon: Bed, color: 'text-purple-500' };
      case 'Hygiene':
        return { icon: Droplet, color: 'text-blue-500' };
      case 'Verpflegung':
        return { icon: Utensils, color: 'text-orange-500' };
      case 'Möbel':
        return { icon: Armchair, color: 'text-green-500' };
      default:
        return { icon: Package, color: 'text-slate-500' };
    }
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

  const getArticleStatusBadge = (status: string) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isDeadlineUrgent = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2 && diffDays >= 0;
  };

  const approvedCount = request.articles.filter(a => a.status === 'Genehmigt' || a.status === 'Teilweise genehmigt').length;
  const rejectedCount = request.articles.filter(a => a.status === 'Abgelehnt').length;
  const pendingCount = request.articles.filter(a => a.status === 'Ausstehend').length;

  return (
    <div className="p-8">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zur Übersicht
      </Button>

      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="mb-2">Anfrage Details</h1>
            <p className="text-slate-600">Detaillierte Ansicht Ihrer Anfrage</p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(request.status)}
            {request.history && request.history.length > 0 && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <HistoryIcon className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[600px] sm:max-w-[600px]">
                  <SheetHeader>
                    <SheetTitle>Aktionsverlauf</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
                    {request.history.length === 0 ? (
                      <div className="text-center text-slate-500 py-8">
                        Noch keine Aktionen aufgezeichnet
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {request.history.map((entry) => (
                          <Card key={entry.id} className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="font-medium">{entry.action}</p>
                                <p className="text-sm text-slate-600">{entry.user}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {formatDateTime(entry.timestamp)}
                              </Badge>
                            </div>
                            
                            {entry.comment && (
                              <div className="mb-3 p-3 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-700">{entry.comment}</p>
                              </div>
                            )}

                            <div className="space-y-2">
                              <p className="text-sm font-medium text-slate-700">Artikel-Status:</p>
                              <div className="space-y-1">
                                {entry.articles.map(article => (
                                  <div key={article.id} className="text-sm">
                                    <div className="flex justify-between items-start">
                                      <span className="text-slate-600">{article.name}</span>
                                      {getArticleStatusBadge(article.status)}
                                    </div>
                                    <div className="pl-2 text-slate-500 text-xs space-y-0.5">
                                      <div>Angefragt: {article.quantity} {article.unit}</div>
                                      {article.approvedQuantity !== undefined && article.approvedQuantity > 0 && (
                                        <div className="text-green-700">Genehmigt: {article.approvedQuantity} {article.unit}</div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="mb-4">Anfrageinformationen</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-600">Priorität</p>
              {getPriorityBadge(request.priority)}
            </div>
            <div>
              <p className="text-sm text-slate-600">Status</p>
              {getStatusBadge(request.status)}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Zeitinformationen</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-600">Erstellt am</p>
              <p>{formatDate(request.requestDate)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Frist</p>
              <Badge 
                variant="outline" 
                className={isDeadlineUrgent(request.deadline) ? 'border-red-500 text-red-700' : 'text-slate-600'}
              >
                {formatDate(request.deadline)}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Artikel Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Ausstehend</span>
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{pendingCount}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Genehmigt</span>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{approvedCount}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Abgelehnt</span>
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{rejectedCount}</Badge>
            </div>
          </div>
        </Card>
      </div>

      {(request.status === 'Genehmigt' || request.status === 'Teilweise genehmigt') && (
        <Card className="p-6 mb-8 border-green-200 bg-green-50">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h2 className="text-green-900">Abholung & Nutzung</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <p className="font-medium text-green-900">Abholort</p>
                </div>
                <p className="text-slate-700 pl-6">
                  {request.pickupLocation || 'Zürich Hauptlager, Bahnhofstrasse 123, 8001 Zürich'}
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <p className="font-medium text-green-900">Abholdatum</p>
                </div>
                <p className="text-slate-700 pl-6">
                  {request.pickupDate ? formatDate(request.pickupDate) : formatDate(request.deadline)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-green-600" />
                  <p className="font-medium text-green-900">Kontaktperson</p>
                </div>
                <p className="text-slate-700 pl-6">
                  {request.contactPerson || 'Max Müller'}
                </p>
                <p className="text-slate-600 text-sm pl-6">
                  {request.contactPhone || '+41 44 123 45 67'}
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-green-600" />
                  <p className="font-medium text-green-900">E-Mail</p>
                </div>
                <p className="text-slate-700 pl-6">
                  {request.contactEmail || 'lager@resilio.ch'}
                </p>
              </div>
            </div>
          </div>

          {request.instructions && (
            <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
              <p className="font-medium text-green-900 mb-2">Wichtige Hinweise:</p>
              <p className="text-slate-700 text-sm">{request.instructions}</p>
            </div>
          )}

          {!request.instructions && (
            <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
              <p className="font-medium text-green-900 mb-2">Wichtige Hinweise:</p>
              <ul className="text-slate-700 text-sm space-y-1 list-disc pl-5">
                <li>Bringen Sie einen gültigen Ausweis zur Abholung mit</li>
                <li>Öffnungszeiten: Mo-Fr 08:00-17:00 Uhr</li>
                <li>Bei Fragen kontaktieren Sie bitte die oben genannte Kontaktperson</li>
              </ul>
            </div>
          )}
        </Card>
      )}

      <Card className="p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Package className="w-5 h-5 text-slate-600" />
          <h2>Angeforderte Artikel</h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produkt</TableHead>
              <TableHead>Angefragt</TableHead>
              <TableHead>Genehmigt</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {request.articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const { icon: CategoryIcon, color } = getCategoryIcon(article.name);
                      return <CategoryIcon className={`w-5 h-5 ${color}`} />;
                    })()}
                    <span className="font-semibold text-slate-900">{article.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {article.quantity} {article.unit}
                </TableCell>
                <TableCell>
                  {article.approvedQuantity !== undefined && article.approvedQuantity > 0 ? (
                    <span className="text-green-600 font-medium">
                      {article.approvedQuantity} {article.unit}
                    </span>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {getArticleStatusBadge(article.status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {request.notes && (
        <Card className="p-6">
          <h3 className="mb-3">Notizen</h3>
          <p className="text-slate-600">{request.notes}</p>
        </Card>
      )}
    </div>
  );
}
