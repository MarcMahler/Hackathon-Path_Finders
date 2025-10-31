import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { ArrowLeft, CheckCircle, XCircle, Clock, Package, RotateCcw, History as HistoryIcon, FileCheck } from 'lucide-react';

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
  articles: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    status: 'Pending' | 'Accepted' | 'Rejected';
  }[];
  user: string;
}

interface Request {
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

interface RequestDetailProps {
  request: Request;
  onBack: () => void;
  onProductClick: (productName: string) => void;
}

export function RequestDetail({ request, onBack, onProductClick }: RequestDetailProps) {
  const [articles, setArticles] = useState<Article[]>(request.articles);
  const [history, setHistory] = useState<HistoryEntry[]>(request.history || []);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [comment, setComment] = useState('');

  const handleArticleStatus = (articleId: string, newStatus: 'Accepted' | 'Rejected' | 'Pending') => {
    setArticles(articles.map(article => 
      article.id === articleId ? { ...article, status: newStatus } : article
    ));
  };

  const handleComplete = () => {
    const newEntry: HistoryEntry = {
      id: `HIST-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'Request überprüft und abgeschlossen',
      comment: comment,
      articles: [...articles],
      user: 'Admin User (Überprüfer)',
    };

    setHistory([newEntry, ...history]);
    setComment('');
    setIsCompleteDialogOpen(false);
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

  const getArticleStatusBadge = (status: string) => {
    const configs: Record<string, { className: string; icon: any }> = {
      'Pending': { className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100', icon: Clock },
      'Accepted': { className: 'bg-green-100 text-green-800 hover:bg-green-100', icon: CheckCircle },
      'Rejected': { className: 'bg-red-100 text-red-800 hover:bg-red-100', icon: XCircle },
    };
    const config = configs[status] || configs['Pending'];
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

  const isDeadlineUrgent = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2 && diffDays >= 0;
  };

  const pendingCount = articles.filter(a => a.status === 'Pending').length;
  const acceptedCount = articles.filter(a => a.status === 'Accepted').length;
  const rejectedCount = articles.filter(a => a.status === 'Rejected').length;

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
            <h1 className="mb-2">Request Details</h1>
            <p className="text-slate-600">Detaillierte Ansicht der Ressourcenanfrage</p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(request.status)}
            <Button
              onClick={() => setIsCompleteDialogOpen(true)}
              className="gap-2"
            >
              <FileCheck className="w-4 h-4" />
              Abschließen
            </Button>
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
                  {history.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">
                      Noch keine Aktionen aufgezeichnet
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {history.map((entry, index) => (
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
                                <div key={article.id} className="flex justify-between items-center text-sm">
                                  <span className="text-slate-600">
                                    {article.name} ({article.quantity} {article.unit})
                                  </span>
                                  {getArticleStatusBadge(article.status)}
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
          </div>
        </div>
      </div>

      <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request abschließen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Kommentar zur Überprüfung</Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Fügen Sie einen Kommentar zu Ihrer Überprüfung hinzu..."
                rows={5}
                className="mt-2"
              />
              <p className="text-sm text-slate-500 mt-2">
                Dieser Kommentar wird im Aktionsverlauf gespeichert und ist für alle Beteiligten sichtbar.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCompleteDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleComplete}>
                Speichern & Abschließen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="w-full lg:w-1/2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="mb-4">Anfrageinformationen</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-600">Request ID</p>
              <p>{request.id}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Organisation</p>
              <p>{request.organisation}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Angefragt von</p>
              <p>{request.requestedBy}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Priorität</p>
              {getPriorityBadge(request.priority)}
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
              <p className="text-sm text-slate-600">Deadline</p>
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
              <span className="text-sm text-slate-600">Offen</span>
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{pendingCount}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Akzeptiert</span>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{acceptedCount}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Abgelehnt</span>
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{rejectedCount}</Badge>
            </div>
          </div>
        </Card>
        </div>
      </div>

      <Card className="p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Package className="w-5 h-5 text-slate-600" />
          <h2>Angeforderte Artikel</h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Artikel ID</TableHead>
              <TableHead>Artikel Name</TableHead>
              <TableHead>Menge</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="text-slate-600">{article.id}</TableCell>
                <TableCell>
                  <button
                    onClick={() => onProductClick(article.name)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Package className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold text-slate-900">{article.name}</span>
                  </button>
                </TableCell>
                <TableCell>
                  {article.quantity} {article.unit}
                </TableCell>
                <TableCell>
                  {getArticleStatusBadge(article.status)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {article.status === 'Pending' ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleArticleStatus(article.id, 'Accepted')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Akzeptieren
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleArticleStatus(article.id, 'Rejected')}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Ablehnen
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => handleArticleStatus(article.id, 'Pending')}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Zurücksetzen
                      </Button>
                    )}
                  </div>
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
