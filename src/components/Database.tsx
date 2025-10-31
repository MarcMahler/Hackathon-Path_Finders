import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Search, Package, MapPin, AlertTriangle, TrendingUp } from 'lucide-react';

interface InventoryItem {
  id: string;
  location: string;
  address: string;
  product: string;
  category: string;
  available: number;
  unit: string;
  minStock: number;
  lastUpdated: string;
}

const inventoryData: InventoryItem[] = [
  // München Hauptlager
  { id: 'INV-001', location: 'München Hauptlager', address: 'Dachauer Str. 112, 80636 München', product: 'Feldbetten', category: 'Unterkünfte', available: 250, unit: 'Stück', minStock: 100, lastUpdated: '2 Std. ago' },
  { id: 'INV-002', location: 'München Hauptlager', address: 'Dachauer Str. 112, 80636 München', product: 'Schlafsäcke', category: 'Unterkünfte', available: 180, unit: 'Stück', minStock: 150, lastUpdated: '2 Std. ago' },
  { id: 'INV-003', location: 'München Hauptlager', address: 'Dachauer Str. 112, 80636 München', product: 'Necessair Unisex', category: 'Hygiene', available: 450, unit: 'Stück', minStock: 200, lastUpdated: '1 Std. ago' },
  { id: 'INV-004', location: 'München Hauptlager', address: 'Dachauer Str. 112, 80636 München', product: 'Windeln (Baby)', category: 'Hygiene', available: 85, unit: 'Pakete', minStock: 100, lastUpdated: '3 Std. ago' },
  { id: 'INV-005', location: 'München Hauptlager', address: 'Dachauer Str. 112, 80636 München', product: 'Sandwiches', category: 'Verpflegung', available: 320, unit: 'Stück', minStock: 200, lastUpdated: '30 Min. ago' },
  
  // Freising Notunterkunft
  { id: 'INV-006', location: 'Freising Notunterkunft', address: 'Wippenhauser Str. 45, 85354 Freising', product: 'Feldbetten', category: 'Unterkünfte', available: 120, unit: 'Stück', minStock: 80, lastUpdated: '4 Std. ago' },
  { id: 'INV-007', location: 'Freising Notunterkunft', address: 'Wippenhauser Str. 45, 85354 Freising', product: 'Decken', category: 'Unterkünfte', available: 200, unit: 'Stück', minStock: 100, lastUpdated: '4 Std. ago' },
  { id: 'INV-008', location: 'Freising Notunterkunft', address: 'Wippenhauser Str. 45, 85354 Freising', product: 'Necessair Unisex', category: 'Hygiene', available: 65, unit: 'Stück', minStock: 80, lastUpdated: '5 Std. ago' },
  { id: 'INV-009', location: 'Freising Notunterkunft', address: 'Wippenhauser Str. 45, 85354 Freising', product: 'Trinkwasser', category: 'Verpflegung', available: 500, unit: 'Liter', minStock: 300, lastUpdated: '1 Std. ago' },
  
  // Starnberg Versorgungszentrum
  { id: 'INV-010', location: 'Starnberg Versorgungszentrum', address: 'Gautinger Str. 23, 82319 Starnberg', product: 'Wohnung Familie (4 Pers.)', category: 'Unterkünfte', available: 12, unit: 'Einheiten', minStock: 10, lastUpdated: '6 Std. ago' },
  { id: 'INV-011', location: 'Starnberg Versorgungszentrum', address: 'Gautinger Str. 23, 82319 Starnberg', product: 'Necessair Unisex', category: 'Hygiene', available: 140, unit: 'Stück', minStock: 100, lastUpdated: '2 Std. ago' },
  { id: 'INV-012', location: 'Starnberg Versorgungszentrum', address: 'Gautinger Str. 23, 82319 Starnberg', product: 'Windeln (Baby)', category: 'Hygiene', available: 45, unit: 'Pakete', minStock: 60, lastUpdated: '3 Std. ago' },
  { id: 'INV-013', location: 'Starnberg Versorgungszentrum', address: 'Gautinger Str. 23, 82319 Starnberg', product: 'Warme Mahlzeiten', category: 'Verpflegung', available: 180, unit: 'Portionen', minStock: 150, lastUpdated: '1 Std. ago' },
  { id: 'INV-014', location: 'Starnberg Versorgungszentrum', address: 'Gautinger Str. 23, 82319 Starnberg', product: 'Medizinische Masken', category: 'Hygiene', available: 850, unit: 'Stück', minStock: 500, lastUpdated: '12 Std. ago' },
  
  // Dachau Betreuungsstelle
  { id: 'INV-015', location: 'Dachau Betreuungsstelle', address: 'Ludwig-Thoma-Str. 9, 85221 Dachau', product: 'Feldbetten', category: 'Unterkünfte', available: 95, unit: 'Stück', minStock: 100, lastUpdated: '5 Std. ago' },
  { id: 'INV-016', location: 'Dachau Betreuungsstelle', address: 'Ludwig-Thoma-Str. 9, 85221 Dachau', product: 'Schlafsäcke', category: 'Unterkünfte', available: 110, unit: 'Stück', minStock: 80, lastUpdated: '5 Std. ago' },
  { id: 'INV-017', location: 'Dachau Betreuungsstelle', address: 'Ludwig-Thoma-Str. 9, 85221 Dachau', product: 'Sandwiches', category: 'Verpflegung', available: 42, unit: 'Stück', minStock: 100, lastUpdated: '2 Std. ago' },
  { id: 'INV-018', location: 'Dachau Betreuungsstelle', address: 'Ludwig-Thoma-Str. 9, 85221 Dachau', product: 'Hygiene-Sets Kinder', category: 'Hygiene', available: 75, unit: 'Stück', minStock: 50, lastUpdated: '4 Std. ago' },
  
  // Erding Notlager
  { id: 'INV-019', location: 'Erding Notlager', address: 'Freisinger Str. 34, 85435 Erding', product: 'Decken', category: 'Unterkünfte', available: 155, unit: 'Stück', minStock: 120, lastUpdated: '7 Std. ago' },
  { id: 'INV-020', location: 'Erding Notlager', address: 'Freisinger Str. 34, 85435 Erding', product: 'Windeln (Baby)', category: 'Hygiene', available: 120, unit: 'Pakete', minStock: 80, lastUpdated: '3 Std. ago' },
  { id: 'INV-021', location: 'Erding Notlager', address: 'Freisinger Str. 34, 85435 Erding', product: 'Trinkwasser', category: 'Verpflegung', available: 680, unit: 'Liter', minStock: 400, lastUpdated: '2 Std. ago' },
  { id: 'INV-022', location: 'Erding Notlager', address: 'Freisinger Str. 34, 85435 Erding', product: 'Desinfektionsmittel', category: 'Hygiene', available: 95, unit: 'Liter', minStock: 80, lastUpdated: '6 Std. ago' },
];

interface DatabaseProps {
  onProductSelect: (item: InventoryItem) => void;
}

export function Database({ onProductSelect }: DatabaseProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    location: '',
    address: '',
    product: '',
    category: '',
    available: '',
    unit: '',
    minStock: '',
  });

  const filteredInventory = inventoryData.filter(item => {
    const matchesSearch = 
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const getStockStatus = (available: number, minStock: number) => {
    const percentage = (available / minStock) * 100;
    if (percentage >= 100) return 'good';
    if (percentage >= 50) return 'low';
    return 'critical';
  };

  const getStockBadge = (available: number, minStock: number) => {
    const status = getStockStatus(available, minStock);
    if (status === 'good') {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verfügbar</Badge>;
    }
    if (status === 'low') {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Niedrig</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Kritisch</Badge>;
  };

  const totalLocations = new Set(inventoryData.map(item => item.location)).size;
  const totalProducts = inventoryData.length;
  const lowStockItems = inventoryData.filter(item => getStockStatus(item.available, item.minStock) !== 'good').length;
  const criticalItems = inventoryData.filter(item => getStockStatus(item.available, item.minStock) === 'critical').length;

  const stats = [
    { label: 'Lagerstandorte', value: totalLocations, icon: MapPin, color: 'blue' },
    { label: 'Produkte gesamt', value: totalProducts, icon: Package, color: 'green' },
    { label: 'Niedrige Bestände', value: lowStockItems, icon: TrendingUp, color: 'yellow' },
    { label: 'Kritische Bestände', value: criticalItems, icon: AlertTriangle, color: 'red' },
  ];

  const categories = ['all', 'Unterkünfte', 'Hygiene', 'Verpflegung'];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">Lagerbestandsverwaltung</h1>
          <p className="text-slate-600">Übersicht aller Krisenressourcen und Lagerbestände</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Bestand hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby="add-inventory-description">
            <DialogHeader>
              <DialogTitle>Neuen Lagerbestand hinzufügen</DialogTitle>
              <DialogDescription id="add-inventory-description">
                Fügen Sie einen neuen Lagerbestand zu einem Standort hinzu.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Lagerstandort</Label>
                <Input 
                  placeholder="z.B. München Hauptlager" 
                  value={newItem.location}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                />
              </div>
              <div>
                <Label>Adresse</Label>
                <Input 
                  placeholder="Straße, PLZ Ort" 
                  value={newItem.address}
                  onChange={(e) => setNewItem({ ...newItem, address: e.target.value })}
                />
              </div>
              <div>
                <Label>Produkt</Label>
                <Input 
                  placeholder="z.B. Feldbetten" 
                  value={newItem.product}
                  onChange={(e) => setNewItem({ ...newItem, product: e.target.value })}
                />
              </div>
              <div>
                <Label>Kategorie</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategorie wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unterkünfte">Unterkünfte</SelectItem>
                    <SelectItem value="Hygiene">Hygiene</SelectItem>
                    <SelectItem value="Verpflegung">Verpflegung</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Verfügbare Menge</Label>
                  <Input 
                    type="number"
                    placeholder="0" 
                    value={newItem.available}
                    onChange={(e) => setNewItem({ ...newItem, available: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Einheit</Label>
                  <Input 
                    placeholder="z.B. Stück" 
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Mindestbestand</Label>
                <Input 
                  type="number"
                  placeholder="0" 
                  value={newItem.minStock}
                  onChange={(e) => setNewItem({ ...newItem, minStock: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setNewItem({ location: '', address: '', product: '', category: '', available: '', unit: '', minStock: '' });
                  }}
                >
                  Abbrechen
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => {
                    // Handle add logic here
                    setIsAddDialogOpen(false);
                    setNewItem({ location: '', address: '', product: '', category: '', available: '', unit: '', minStock: '' });
                  }}
                >
                  Hinzufügen
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-full lg:w-2/3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            yellow: 'bg-yellow-100 text-yellow-600',
            red: 'bg-red-100 text-red-600',
          };
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-4">
                <div className={`${colorClasses[stat.color as keyof typeof colorClasses]} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
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
      </div>

      <Card className="p-6">
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Suche nach Standort oder Produkt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Alle Produkte</TabsTrigger>
              <TabsTrigger value="Unterkünfte">Unterkünfte</TabsTrigger>
              <TabsTrigger value="Hygiene">Hygiene</TabsTrigger>
              <TabsTrigger value="Verpflegung">Verpflegung</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produkt</TableHead>
                <TableHead>Lagerstandort</TableHead>
                <TableHead>Kategorie</TableHead>
                <TableHead>Verfügbar</TableHead>
                <TableHead>Mindestbestand</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aktualisiert</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow 
                  key={item.id} 
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => onProductSelect(item)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-blue-500" />
                      <span className="font-semibold text-slate-900">{item.product}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{item.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={
                      getStockStatus(item.available, item.minStock) === 'critical' 
                        ? 'text-red-600 font-medium' 
                        : getStockStatus(item.available, item.minStock) === 'low'
                        ? 'text-yellow-600 font-medium'
                        : ''
                    }>
                      {item.available} {item.unit}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600">{item.minStock} {item.unit}</TableCell>
                  <TableCell>{getStockBadge(item.available, item.minStock)}</TableCell>
                  <TableCell className="text-slate-500 text-sm">{item.lastUpdated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredInventory.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>Keine Lagerbestände gefunden</p>
          </div>
        )}
      </Card>
    </div>
  );
}
