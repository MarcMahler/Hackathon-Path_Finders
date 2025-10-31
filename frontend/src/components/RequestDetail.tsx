import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { ArrowLeft, CheckCircle, XCircle, Clock, Package, RotateCcw, History as HistoryIcon, FileCheck, Minus, Bed, Droplet, Utensils, Armchair } from 'lucide-react';

interface Article {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  acceptedQuantity: number;
  rejectedQuantity: number;
  isEditing?: boolean;
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
    acceptedQuantity: number;
    rejectedQuantity: number;
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
  onStatusChange?: (requestId: string, newStatus: string) => void;
}

export function RequestDetail({ request, onBack, onProductClick, onStatusChange }: RequestDetailProps) {
  const [articles, setArticles] = useState<Article[]>(
    request.articles.map(article => ({
      ...article,
      acceptedQuantity: article.acceptedQuantity || 0,
      rejectedQuantity: article.rejectedQuantity || 0,
      isEditing: false,
    }))
  );
  const [history, setHistory] = useState<HistoryEntry[]>(request.history || []);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [partialQuantity, setPartialQuantity] = useState<{ [key: string]: number }>({});
  const [currentStatus, setCurrentStatus] = useState(request.status);

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

  const handleAcceptAll = (articleId: string) => {
    setArticles(articles.map(article => 
      article.id === articleId 
        ? { ...article, acceptedQuantity: article.quantity, rejectedQuantity: 0, isEditing: false }
        : article
    ));
  };

  const handleRejectAll = (articleId: string) => {
    setArticles(articles.map(article => 
      article.id === articleId 
        ? { ...article, acceptedQuantity: 0, rejectedQuantity: article.quantity, isEditing: false }
        : article
    ));
  };

  const handlePartial = (articleId: string) => {
    setArticles(articles.map(article => 
      article.id === articleId 
        ? { ...article, isEditing: true }
        : article
    ));
  };

  const handlePartialConfirm = (articleId: string) => {
    const article = articles.find(a => a.id === articleId);
    if (!article) return;

    const accepted = partialQuantity[articleId] || 0;
    const rejected = article.quantity - accepted;

    if (accepted < 0 || accepted > article.quantity) return;

    setArticles(articles.map(a => 
      a.id === articleId 
        ? { ...a, acceptedQuantity: accepted, rejectedQuantity: rejected, isEditing: false }
        : a
    ));
    
    // Clear the partial quantity
    const newPartial = { ...partialQuantity };
    delete newPartial[articleId];
    setPartialQuantity(newPartial);
  };

  const handleReset = (articleId: string) => {
    setArticles(articles.map(article => 
      article.id === articleId 
        ? { ...article, acceptedQuantity: 0, rejectedQuantity: 0, isEditing: false }
        : article
    ));
    // Clear partial quantity if exists
    const newPartial = { ...partialQuantity };
    delete newPartial[articleId];
    setPartialQuantity(newPartial);
  };

  const isProcessed = (article: Article) => {
    return article.acceptedQuantity > 0 || article.rejectedQuantity > 0;
  };

  const getArticleStatusBadge = (article: Article) => {
    if (!isProcessed(article)) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Clock className="w-3 h-3 mr-1 inline" />
          Offen
        </Badge>
      );
    }
    
    if (article.acceptedQuantity === article.quantity) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1 inline" />
          Vollständig akzeptiert
        </Badge>
      );
    }
    
    if (article.rejectedQuantity === article.quantity) {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="w-3 h-3 mr-1 inline" />
          Vollständig abgelehnt
        </Badge>
      );
    }
    
    return (
      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
        <Minus className="w-3 h-3 mr-1 inline" />
        Teilweise akzeptiert
      </Badge>
    );
  };

  const handleComplete = () => {
    const newEntry: HistoryEntry = {
      id: `HIST-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'Anfrage überprüft und abgeschlossen',
      comment: comment,
      articles: articles.map(({ isEditing, ...rest }) => rest),
      user: 'Admin User (Überprüfer)',
    };

    setHistory([newEntry, ...history]);
    setComment('');
    setIsCompleteDialogOpen(false);
    
    // Update request status to "Akzeptiert"
    setCurrentStatus('Akzeptiert');
    if (onStatusChange) {
      onStatusChange(request.id, 'Akzeptiert');
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

  const unprocessedCount = articles.filter(a => !isProcessed(a)).length;
  const fullyAcceptedCount = articles.filter(a => a.acceptedQuantity === a.quantity).length;
  const fullyRejectedCount = articles.filter(a => a.rejectedQuantity === a.quantity).length;
  const partiallyAcceptedCount = articles.filter(a => 
    isProcessed(a) && a.acceptedQuantity > 0 && a.acceptedQuantity < a.quantity
  ).length;

  // Button ist nur aktiv, wenn alle Artikel bearbeitet sind
  const allArticlesProcessed = articles.every(a => isProcessed(a));

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
            <h1 className="mb-2">Anfrage Details</h1>
            <p className="text-slate-600">Detaillierte Ansicht der Anfrage</p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(currentStatus)}
            <Button
              onClick={() => setIsCompleteDialogOpen(true)}
              className="gap-2"
              disabled={!allArticlesProcessed}
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
                      {history.map((entry) => (
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
                                  </div>
                                  <div className="pl-2 text-slate-500 text-xs space-y-0.5">
                                    <div>Angefragt: {article.quantity} {article.unit}</div>
                                    {article.acceptedQuantity > 0 && (
                                      <div className="text-green-700">Akzeptiert: {article.acceptedQuantity} {article.unit}</div>
                                    )}
                                    {article.rejectedQuantity > 0 && (
                                      <div className="text-red-700">Abgelehnt: {article.rejectedQuantity} {article.unit}</div>
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
          </div>
        </div>
      </div>

      <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Anfrage abschließen</DialogTitle>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="mb-4">Anfrageinformationen</h3>
          <div className="space-y-3">
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
              <span className="text-sm text-slate-600">Offen</span>
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{unprocessedCount}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Akzeptiert</span>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{fullyAcceptedCount}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Abgelehnt</span>
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{fullyRejectedCount}</Badge>
            </div>
          </div>
        </Card>
      </div>

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
              <TableHead>Status</TableHead>
              <TableHead>Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <>
                <TableRow key={article.id}>
                  <TableCell>
                    <button
                      onClick={() => onProductClick(article.name)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      {(() => {
                        const { icon: CategoryIcon, color } = getCategoryIcon(article.name);
                        return <CategoryIcon className={`w-5 h-5 ${color}`} />;
                      })()}
                      <span className="font-semibold text-slate-900">{article.name}</span>
                    </button>
                  </TableCell>
                  <TableCell>
                    {article.quantity} {article.unit}
                  </TableCell>
                  <TableCell>
                    {getArticleStatusBadge(article)}
                    {isProcessed(article) && (
                      <div className="text-xs text-slate-600 mt-1">
                        {article.acceptedQuantity > 0 && (
                          <div className="text-green-700">✓ {article.acceptedQuantity} {article.unit} akzeptiert</div>
                        )}
                        {article.rejectedQuantity > 0 && (
                          <div className="text-red-700">✗ {article.rejectedQuantity} {article.unit} abgelehnt</div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {!isProcessed(article) && !article.isEditing ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleAcceptAll(article.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Alle
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => handlePartial(article.id)}
                        >
                          <Minus className="w-4 h-4 mr-1" />
                          Teilweise
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRejectAll(article.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Keine
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-slate-600 hover:text-slate-700 hover:bg-slate-50"
                        onClick={() => handleReset(article.id)}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Zurücksetzen
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
                {article.isEditing && (
                  <TableRow key={`${article.id}-edit`}>
                    <TableCell colSpan={4} className="bg-slate-50">
                      <div className="flex items-center gap-4 py-2">
                        <Label className="whitespace-nowrap">Akzeptierte Menge:</Label>
                        <Input
                          type="number"
                          min="0"
                          max={article.quantity}
                          value={partialQuantity[article.id] || ''}
                          onChange={(e) => setPartialQuantity({
                            ...partialQuantity,
                            [article.id]: parseInt(e.target.value) || 0
                          })}
                          placeholder={`Max. ${article.quantity} ${article.unit}`}
                          className="w-32"
                        />
                        <span className="text-sm text-slate-600">
                          von {article.quantity} {article.unit}
                        </span>
                        <div className="flex gap-2 ml-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReset(article.id)}
                          >
                            Abbrechen
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handlePartialConfirm(article.id)}
                            disabled={!partialQuantity[article.id] || partialQuantity[article.id] <= 0 || partialQuantity[article.id] > article.quantity}
                          >
                            Bestätigen
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
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
