import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Plus, Search, Package, MapPin, AlertTriangle, TrendingUp, Bed, Droplet, Utensils, Armchair, ShoppingCart, ArrowLeft, Building2, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { AddProductDialog, ProductFormData } from './AddProductDialog';
import { EditProductDialog } from './EditProductDialog';
import { Edit } from 'lucide-react';

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
  requestedQuantity?: number;
}

const inventoryData: InventoryItem[] = [
  // Zürich Hauptlager
  { id: 'INV-001', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Feldbetten', category: 'Schlafen', available: 250, unit: 'Stück', minStock: 100, lastUpdated: 'vor 2 Std.' },
  { id: 'INV-002', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Schlafsäcke', category: 'Schlafen', available: 180, unit: 'Stück', minStock: 150, lastUpdated: 'vor 2 Std.' },
  { id: 'INV-003', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Decken', category: 'Schlafen', available: 320, unit: 'Stück', minStock: 150, lastUpdated: 'vor 3 Std.' },
  { id: 'INV-004', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Kissen', category: 'Schlafen', available: 280, unit: 'Stück', minStock: 150, lastUpdated: 'vor 3 Std.' },
  { id: 'INV-005', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Hygieneset', category: 'Hygiene', available: 450, unit: 'Stück', minStock: 200, lastUpdated: 'vor 1 Std.' },
  { id: 'INV-006', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Windeln', category: 'Hygiene', available: 85, unit: 'Pakete', minStock: 100, lastUpdated: 'vor 3 Std.' },
  { id: 'INV-007', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Masken', category: 'Hygiene', available: 1200, unit: 'Stück', minStock: 500, lastUpdated: 'vor 5 Std.' },
  { id: 'INV-008', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Desinfektionsmittel', category: 'Hygiene', available: 150, unit: 'Liter', minStock: 100, lastUpdated: 'vor 4 Std.' },
  { id: 'INV-009', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Sandwiches', category: 'Verpflegung', available: 320, unit: 'Stück', minStock: 200, lastUpdated: 'vor 30 Min.' },
  { id: 'INV-010', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Trinkwasser', category: 'Verpflegung', available: 800, unit: 'Liter', minStock: 500, lastUpdated: 'vor 1 Std.' },
  { id: 'INV-011', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Warme Mahlzeiten', category: 'Verpflegung', available: 250, unit: 'Portionen', minStock: 150, lastUpdated: 'vor 2 Std.' },
  { id: 'INV-012', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Tisch', category: 'Möbel', available: 60, unit: 'Stück', minStock: 40, lastUpdated: 'vor 6 Std.' },
  { id: 'INV-013', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Stuhl', category: 'Möbel', available: 220, unit: 'Stück', minStock: 150, lastUpdated: 'vor 6 Std.' },
  
  // Oerlikon Depot
  { id: 'INV-014', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Feldbetten', category: 'Schlafen', available: 120, unit: 'Stück', minStock: 80, lastUpdated: 'vor 4 Std.' },
  { id: 'INV-015', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Decken', category: 'Schlafen', available: 200, unit: 'Stück', minStock: 100, lastUpdated: 'vor 4 Std.' },
  { id: 'INV-016', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Schlafsäcke', category: 'Schlafen', available: 95, unit: 'Stück', minStock: 80, lastUpdated: 'vor 5 Std.' },
  { id: 'INV-017', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Hygieneset', category: 'Hygiene', available: 65, unit: 'Stück', minStock: 80, lastUpdated: 'vor 5 Std.' },
  { id: 'INV-018', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Kinder-Hygieneset', category: 'Hygiene', available: 110, unit: 'Stück', minStock: 70, lastUpdated: 'vor 3 Std.' },
  { id: 'INV-019', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Windeln', category: 'Hygiene', available: 140, unit: 'Pakete', minStock: 100, lastUpdated: 'vor 4 Std.' },
  { id: 'INV-020', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Trinkwasser', category: 'Verpflegung', available: 500, unit: 'Liter', minStock: 300, lastUpdated: 'vor 1 Std.' },
  { id: 'INV-021', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Sandwiches', category: 'Verpflegung', available: 180, unit: 'Stück', minStock: 150, lastUpdated: 'vor 2 Std.' },
  { id: 'INV-022', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Babynahrung', category: 'Verpflegung', available: 75, unit: 'Einheiten', minStock: 60, lastUpdated: 'vor 3 Std.' },
  { id: 'INV-023', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Tisch', category: 'Möbel', available: 35, unit: 'Stück', minStock: 25, lastUpdated: 'vor 7 Std.' },
  { id: 'INV-024', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Stuhl', category: 'Möbel', available: 120, unit: 'Stück', minStock: 90, lastUpdated: 'vor 7 Std.' },
  
  // Altstetten Lager
  { id: 'INV-025', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Feldbetten', category: 'Schlafen', available: 80, unit: 'Stück', minStock: 100, lastUpdated: 'vor 5 Std.' },
  { id: 'INV-026', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Schlafsäcke', category: 'Schlafen', available: 140, unit: 'Stück', minStock: 100, lastUpdated: 'vor 5 Std.' },
  { id: 'INV-027', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Decken', category: 'Schlafen', available: 210, unit: 'Stück', minStock: 150, lastUpdated: 'vor 6 Std.' },
  { id: 'INV-028', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Hygieneset', category: 'Hygiene', available: 140, unit: 'Stück', minStock: 100, lastUpdated: 'vor 2 Std.' },
  { id: 'INV-029', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Windeln', category: 'Hygiene', available: 45, unit: 'Pakete', minStock: 60, lastUpdated: 'vor 3 Std.' },
  { id: 'INV-030', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Masken', category: 'Hygiene', available: 850, unit: 'Stück', minStock: 500, lastUpdated: 'vor 12 Std.' },
  { id: 'INV-031', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Desinfektionsmittel', category: 'Hygiene', available: 65, unit: 'Liter', minStock: 80, lastUpdated: 'vor 8 Std.' },
  { id: 'INV-032', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Warme Mahlzeiten', category: 'Verpflegung', available: 180, unit: 'Portionen', minStock: 150, lastUpdated: 'vor 1 Std.' },
  { id: 'INV-033', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Trinkwasser', category: 'Verpflegung', available: 420, unit: 'Liter', minStock: 400, lastUpdated: 'vor 2 Std.' },
  { id: 'INV-034', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Sandwiches', category: 'Verpflegung', available: 90, unit: 'Stück', minStock: 120, lastUpdated: 'vor 3 Std.' },
  { id: 'INV-035', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Tisch', category: 'Möbel', available: 45, unit: 'Stück', minStock: 30, lastUpdated: 'vor 6 Std.' },
  { id: 'INV-036', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Stuhl', category: 'Möbel', available: 165, unit: 'Stück', minStock: 120, lastUpdated: 'vor 6 Std.' },
];

type UserRole = 'Vorsitzender' | 'Mitarbeitender' | 'Lagerverwaltung';

interface DatabaseProps {
  onProductSelect: (item: InventoryItem) => void;
  userRole?: UserRole;
  onViewCart?: () => void;
  onAddToCart?: (items: InventoryItem[]) => void;
  cartItemCount?: number;
  selectedLocation?: string;
}

export function Database({ onProductSelect, userRole, onViewCart, onAddToCart, cartItemCount = 0, selectedLocation: propSelectedLocation }: DatabaseProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(propSelectedLocation || null);
  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
  const [editProductDialogOpen, setEditProductDialogOpen] = useState(false);
  const [addStockDialogOpen, setAddStockDialogOpen] = useState(false);
  const [addStockQuantity, setAddStockQuantity] = useState(0);

  const filteredInventory = inventoryData.filter(item => {
    const matchesSearch = 
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const matchesLocation = !selectedLocation || item.location === selectedLocation;
    
    return matchesSearch && matchesTab && matchesLocation;
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

  const categories = ['all', 'Schlafen', 'Hygiene', 'Verpflegung', 'Möbel'];

  const getCategoryIcon = (category: string) => {
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

  const handleOrderClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setOrderQuantity(1);
    setOrderDialogOpen(true);
  };

  const handleAddProduct = (productData: ProductFormData) => {
    console.log('Neues Produkt hinzugefügt:', productData);
    // In a real application, this would save to backend
    alert(`Produkt "${productData.product}" wurde erfolgreich hinzugefügt!`);
  };

  const handleEditProduct = (item: InventoryItem) => {
    setSelectedItem(item);
    setEditProductDialogOpen(true);
  };

  const handleSaveEdit = (productData: ProductFormData) => {
    console.log('Artikel aktualisiert:', productData);
    alert(`Artikel "${productData.product}" wurde erfolgreich aktualisiert!`);
  };

  const handleAddStock = (item: InventoryItem) => {
    setSelectedItem(item);
    setAddStockQuantity(0);
    setAddStockDialogOpen(true);
  };

  const handleConfirmAddStock = () => {
    if (selectedItem && addStockQuantity > 0) {
      console.log(`${addStockQuantity} ${selectedItem.unit} zu ${selectedItem.product} hinzugefügt`);
      alert(`${addStockQuantity} ${selectedItem.unit} wurden zu "${selectedItem.product}" hinzugefügt!`);
    }
    setAddStockDialogOpen(false);
    setSelectedItem(null);
    setAddStockQuantity(0);
  };

  const handleConfirmOrder = () => {
    if (selectedItem && onAddToCart) {
      // Create a new item with the requested quantity
      const itemWithQuantity = { ...selectedItem, requestedQuantity: orderQuantity };
      onAddToCart([itemWithQuantity]);
    }
    setOrderDialogOpen(false);
    setSelectedItem(null);
    setOrderQuantity(1);
  };

  // Get unique locations with their data
  const locations = Array.from(new Set(inventoryData.map(item => item.location))).map(location => {
    const items = inventoryData.filter(item => item.location === location);
    const address = items[0]?.address || '';
    const totalItems = items.length;
    const criticalCount = items.filter(item => getStockStatus(item.available, item.minStock) === 'critical').length;
    const lowCount = items.filter(item => getStockStatus(item.available, item.minStock) === 'low').length;
    const goodCount = items.filter(item => getStockStatus(item.available, item.minStock) === 'good').length;
    
    return {
      name: location,
      address,
      totalItems,
      criticalCount,
      lowCount,
      goodCount,
    };
  });

  // If we have a selectedLocation from props (warehouse tabs), use it
  if (propSelectedLocation && !selectedLocation) {
    setSelectedLocation(propSelectedLocation);
  }

  // If we're in Lagerverwaltung role and no location selected, show location cards (not needed anymore with new tab structure)
  if (userRole === 'Lagerverwaltung' && !selectedLocation && !propSelectedLocation) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="mb-2">Meine Lager</h1>
          <p className="text-slate-600">Wählen Sie ein Lager zur Verwaltung aus</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location) => (
            <Card 
              key={location.name}
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
              onClick={() => setSelectedLocation(location.name)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3>{location.name}</h3>
                    <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {location.address}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl text-green-700">{location.goodCount}</p>
                  <p className="text-xs text-green-600 mt-1">Verfügbar</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-2xl text-yellow-700">{location.lowCount}</p>
                  <p className="text-xs text-yellow-600 mt-1">Niedrig</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl text-red-700">{location.criticalCount}</p>
                  <p className="text-xs text-red-600 mt-1">Kritisch</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">{location.totalItems}</span> Produkte im Lager
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          {selectedLocation ? (
            <>
              <h1 className="mb-2">Lagerbestand - {selectedLocation}</h1>
              <p className="text-slate-600">Aktuelle Bestände und Verfügbarkeit</p>
            </>
          ) : (
            <>
              <h1 className="mb-2">Produktverwaltung</h1>
              <p className="text-slate-600">Übersicht aller verfügbaren Produkte und Bestände</p>
            </>
          )}
        </div>
        {userRole === 'Lagerverwaltung' && (
          <Button 
            onClick={() => setAddProductDialogOpen(true)}
            className="bg-green-600 hover:bg-green-700 gap-2"
          >
            <Plus className="w-4 h-4" />
            Neuer Artikel
          </Button>
        )}
      </div>

      {userRole !== 'Mitarbeitender' && !selectedLocation && (
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
      )}

      <Card className="p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Suche nach Standort oder Produkt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category filter buttons */}
        <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-slate-200">
          {categories.map((category) => {
            const isActive = activeTab === category;
            const { icon: CategoryIcon, color } = getCategoryIcon(category);
            const categoryLabel = category === 'all' ? 'Alle' : category;
            const count = category === 'all' 
              ? inventoryData.filter(item => {
                  const matchesSearch = item.location.toLowerCase().includes(searchTerm.toLowerCase()) || item.product.toLowerCase().includes(searchTerm.toLowerCase()) || item.address.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesLocation = !selectedLocation || item.location === selectedLocation;
                  return matchesSearch && matchesLocation;
                }).length
              : inventoryData.filter(item => {
                  const matchesSearch = item.location.toLowerCase().includes(searchTerm.toLowerCase()) || item.product.toLowerCase().includes(searchTerm.toLowerCase()) || item.address.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesLocation = !selectedLocation || item.location === selectedLocation;
                  return item.category === category && matchesSearch && matchesLocation;
                }).length;
            
            return (
              <Button
                key={category}
                variant={isActive ? "default" : "outline"}
                className={`gap-2 ${isActive ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-slate-50'}`}
                onClick={() => setActiveTab(category)}
              >
                <CategoryIcon className={`w-4 h-4 ${isActive ? 'text-white' : color}`} />
                <span>{categoryLabel}</span>
                <Badge 
                  variant="secondary" 
                  className={`ml-1 ${isActive ? 'bg-blue-500 text-white hover:bg-blue-500' : 'bg-slate-100'}`}
                >
                  {count}
                </Badge>
              </Button>
            );
          })}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produkt</TableHead>
                {!selectedLocation && <TableHead>Lagerstandort</TableHead>}
                <TableHead>Verfügbar</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => {
                const { icon: CategoryIcon, color } = getCategoryIcon(item.category);
                return (
                  <TableRow 
                    key={item.id} 
                    className="hover:bg-slate-50"
                  >
                    <TableCell 
                      className="cursor-pointer"
                      onClick={() => onProductSelect(item)}
                    >
                      <div className="flex items-center gap-2">
                        <CategoryIcon className={`w-5 h-5 ${color}`} />
                        <span className="font-semibold text-slate-900">{item.product}</span>
                      </div>
                    </TableCell>
                    {!selectedLocation && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span>{item.location}</span>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={
                              getStockStatus(item.available, item.minStock) === 'critical' 
                                ? 'text-red-600 font-medium cursor-help' 
                                : getStockStatus(item.available, item.minStock) === 'low'
                                ? 'text-yellow-600 font-medium cursor-help'
                                : 'cursor-help'
                            }>
                              {item.available} {item.unit}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Mindestbestand: {item.minStock} {item.unit}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{getStockBadge(item.available, item.minStock)}</TableCell>
                    <TableCell className="text-right">
                      {userRole === 'Mitarbeitender' ? (
                        <Button 
                          size="sm"
                          variant="outline"
                          className="border-blue-500 text-blue-600 hover:bg-blue-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrderClick(item);
                          }}
                        >
                          Bestellen
                        </Button>
                      ) : userRole === 'Lagerverwaltung' ? (
                        <Button 
                          size="sm"
                          variant="outline"
                          className="border-orange-500 text-orange-600 hover:bg-orange-50 gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditProduct(item);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                          Bearbeiten
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })}
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

      {/* Order Dialog */}
      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent aria-describedby="order-dialog-description">
          <DialogHeader>
            <DialogTitle>Produkt bestellen</DialogTitle>
            <DialogDescription id="order-dialog-description">
              Geben Sie die gewünschte Menge ein und fügen Sie das Produkt zum Warenkorb hinzu.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {(() => {
                    const { icon: CategoryIcon, color } = getCategoryIcon(selectedItem.category);
                    return <CategoryIcon className={`w-5 h-5 ${color}`} />;
                  })()}
                  <span className="font-semibold text-slate-900">{selectedItem.product}</span>
                </div>
                <p className="text-sm text-slate-600">
                  Lagerstandort: {selectedItem.location}
                </p>
                <p className="text-sm text-slate-600">
                  Verfügbar: {selectedItem.available} {selectedItem.unit}
                </p>
              </div>
              <div>
                <Label>Anzahl</Label>
                <Input
                  type="number"
                  min="1"
                  max={selectedItem.available}
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(Math.max(1, Math.min(selectedItem.available, parseInt(e.target.value) || 1)))}
                  className="mt-2"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Max. {selectedItem.available} {selectedItem.unit} verfügbar
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setOrderDialogOpen(false)}>
                  Abbrechen
                </Button>
                <Button onClick={handleConfirmOrder}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Zum Warenkorb
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Stock Dialog */}
      <Dialog open={addStockDialogOpen} onOpenChange={setAddStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bestand hinzufügen</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {(() => {
                    const { icon: CategoryIcon, color } = getCategoryIcon(selectedItem.category);
                    return <CategoryIcon className={`w-5 h-5 ${color}`} />;
                  })()}
                  <span className="font-semibold text-slate-900">{selectedItem.product}</span>
                </div>
                <p className="text-sm text-slate-600">
                  Aktueller Bestand: {selectedItem.available} {selectedItem.unit}
                </p>
              </div>
              <div>
                <Label>Hinzuzufügende Anzahl</Label>
                <Input
                  type="number"
                  min="1"
                  value={addStockQuantity}
                  onChange={(e) => setAddStockQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                  className="mt-2"
                  placeholder="z.B. 50"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setAddStockDialogOpen(false)}>
                  Abbrechen
                </Button>
                <Button 
                  onClick={handleConfirmAddStock}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Hinzufügen
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <AddProductDialog
        open={addProductDialogOpen}
        onClose={() => setAddProductDialogOpen(false)}
        onAdd={handleAddProduct}
      />

      {/* Edit Product Dialog */}
      {selectedItem && (
        <EditProductDialog
          open={editProductDialogOpen}
          onClose={() => setEditProductDialogOpen(false)}
          onSave={handleSaveEdit}
          initialData={{
            product: selectedItem.product,
            category: selectedItem.category,
            quantity: selectedItem.available,
            available: selectedItem.available,
            unit: selectedItem.unit,
            minStock: selectedItem.minStock,
            supplier: '',
            orderDetails: '',
          }}
        />
      )}
    </div>
  );
}
