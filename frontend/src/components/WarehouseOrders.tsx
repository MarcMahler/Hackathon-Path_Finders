import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Search, Package, Calendar, TrendingUp, CheckCircle2, Clock, XCircle, ArrowLeft, User } from 'lucide-react';

interface OrderItem {
  product: string;
  quantity: number;
  unit: string;
  category: string;
}

interface Order {
  orderDate: string;
  status: 'Bestellt' | 'Geliefert' | 'Storniert' | 'In Bearbeitung';
  items: OrderItem[];
  notes: string;
  orderedBy: string;
  orderedByEmail: string;
  department?: string;
}

interface WarehouseOrdersProps {
  locationName: string;
}

const ordersData: Order[] = [
  {
    orderDate: '2025-10-25',
    status: 'In Bearbeitung',
    items: [
      { product: 'Feldbetten', quantity: 100, unit: 'Stück', category: 'Unterkünfte' },
      { product: 'Decken', quantity: 150, unit: 'Stück', category: 'Unterkünfte' },
    ],
    notes: 'Dringende Anfrage für neue Unterkunft',
    orderedBy: 'Anna Müller',
    orderedByEmail: 'anna.mueller@zuerich.ch',
    department: 'Logistik',
  },
  {
    orderDate: '2025-10-28',
    status: 'Bestellt',
    items: [
      { product: 'Hygiene-Sets', quantity: 300, unit: 'Stück', category: 'Hygiene' },
      { product: 'Masken', quantity: 1000, unit: 'Stück', category: 'Hygiene' },
    ],
    notes: 'Erhöhter Bedarf aufgrund neuer Anforderungen',
    orderedBy: 'Thomas Weber',
    orderedByEmail: 'thomas.weber@zuerich.ch',
    department: 'Gesundheit',
  },
  {
    orderDate: '2025-10-20',
    status: 'Geliefert',
    items: [
      { product: 'Sandwiches', quantity: 500, unit: 'Stück', category: 'Verpflegung' },
      { product: 'Trinkwasser', quantity: 1000, unit: 'Liter', category: 'Verpflegung' },
    ],
    notes: 'Vollständig erhalten, keine Mängel',
    orderedBy: 'Sarah Fischer',
    orderedByEmail: 'sarah.fischer@zuerich.ch',
    department: 'Verpflegung',
  },
  {
    orderDate: '2025-10-22',
    status: 'Bestellt',
    items: [
      { product: 'Schlafsäcke', quantity: 80, unit: 'Stück', category: 'Unterkünfte' },
      { product: 'Kissen', quantity: 80, unit: 'Stück', category: 'Unterkünfte' },
    ],
    notes: 'Ergänzung für Winterausstattung',
    orderedBy: 'Michael Keller',
    orderedByEmail: 'michael.keller@zuerich.ch',
    department: 'Beschaffung',
  },
  {
    orderDate: '2025-10-29',
    status: 'In Bearbeitung',
    items: [
      { product: 'Windeln', quantity: 200, unit: 'Pakete', category: 'Hygiene' },
      { product: 'Babynahrung', quantity: 150, unit: 'Einheiten', category: 'Verpflegung' },
    ],
    notes: 'Wird aktuell zusammengestellt',
    orderedBy: 'Lisa Meier',
    orderedByEmail: 'lisa.meier@zuerich.ch',
    department: 'Betreuung',
  },
];

export function WarehouseOrders({ locationName }: WarehouseOrdersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Alle');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = 
      order.orderedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.product.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'Alle' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Bestellt':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Bestellt</Badge>;
      case 'In Bearbeitung':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">In Bearbeitung</Badge>;
      case 'Geliefert':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Geliefert</Badge>;
      case 'Storniert':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Storniert</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Bestellt':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'In Bearbeitung':
        return <Package className="w-4 h-4 text-purple-600" />;
      case 'Geliefert':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'Storniert':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  if (selectedOrder) {
    return (
      <div className="p-8">
        <Button
          variant="ghost"
          onClick={() => setSelectedOrder(null)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Übersicht
        </Button>

        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="mb-2">Bestellung von {selectedOrder.orderedBy}</h1>
              <p className="text-slate-600">{selectedOrder.department}</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(selectedOrder.status)}
              {getStatusBadge(selectedOrder.status)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg mb-4">Bestellte Artikel</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produkt</TableHead>
                    <TableHead>Kategorie</TableHead>
                    <TableHead className="text-right">Anzahl</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrder.items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <span className="font-semibold text-slate-900">{item.product}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity} {item.unit}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {selectedOrder.notes && (
              <Card className="p-6">
                <h3 className="text-lg mb-3">Notizen</h3>
                <p className="text-slate-600">{selectedOrder.notes}</p>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg mb-4">Bestelldetails</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Bestelldatum</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <p className="text-sm">{selectedOrder.orderDate}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedOrder.status)}
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg mb-4">Bestellende Person</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{selectedOrder.orderedBy}</p>
                    <p className="text-xs text-slate-500">{selectedOrder.department}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">E-Mail</p>
                  <p className="text-sm">{selectedOrder.orderedByEmail}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Bestellt', value: ordersData.filter(o => o.status === 'Bestellt').length, color: 'blue' },
    { label: 'In Bearbeitung', value: ordersData.filter(o => o.status === 'In Bearbeitung').length, color: 'purple' },
    { label: 'Geliefert', value: ordersData.filter(o => o.status === 'Geliefert').length, color: 'green' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2">Bestellungen - {locationName}</h1>
        <p className="text-slate-600">Übersicht aller eingehenden Bestellungen für diesen Standort</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            purple: 'bg-purple-100 text-purple-600',
            green: 'bg-green-100 text-green-600',
          };
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-4">
                <div className={`${colorClasses[stat.color as keyof typeof colorClasses]} p-3 rounded-lg`}>
                  <Package className="w-6 h-6" />
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
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Suche nach Person, Abteilung oder Produkt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm"
          >
            <option value="Alle">Alle Status</option>
            <option value="Bestellt">Bestellt</option>
            <option value="In Bearbeitung">In Bearbeitung</option>
            <option value="Geliefert">Geliefert</option>
            <option value="Storniert">Storniert</option>
          </select>
        </div>

        <div className="space-y-3">
          {filteredOrders.map((order, idx) => (
            <Card 
              key={idx} 
              className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-blue-300"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-slate-900">{order.orderedBy}</span>
                      <span className="text-sm text-slate-600">•</span>
                      <span className="text-sm text-slate-600">{order.department}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500">{order.orderDate}</span>
                      </div>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{order.items.length} Artikel</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>Keine Bestellungen gefunden</p>
          </div>
        )}
      </Card>
    </div>
  );
}
