import { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { GetStarted } from './components/GetStarted';
import { Requests } from './components/Requests';
import { Personnel } from './components/Personnel';
import { Database } from './components/Database';
import { ProductDetail } from './components/ProductDetail';
import { ToDos } from './components/ToDos';
import { History } from './components/History';
import { DirectMessages } from './components/DirectMessages';
import { Settings } from './components/Settings';

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

interface CrisisTeam {
  name: string;
  description: string;
  responsiblePerson: string;
  members: string[];
  createdAt: string;
}

// Mock data for open requests count - in real app this would come from a data store
const mockRequests = [
  { id: 'REQ-001', status: 'Offen' },
  { id: 'REQ-002', status: 'Akzeptiert' },
  { id: 'REQ-003', status: 'Offen' },
  { id: 'REQ-004', status: 'Abgelehnt' },
  { id: 'REQ-005', status: 'Akzeptiert' },
  { id: 'REQ-006', status: 'Offen' },
  { id: 'REQ-007', status: 'Akzeptiert' },
  { id: 'REQ-008', status: 'Offen' },
  { id: 'REQ-009', status: 'Offen' },
  { id: 'REQ-010', status: 'Offen' },
];

export default function App() {
  const [crisisTeam, setCrisisTeam] = useState<CrisisTeam | null>(null);
  const [activeModule, setActiveModule] = useState('getstarted');
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<RequestType | null>(null);
  const [navigationContext, setNavigationContext] = useState<'database' | 'requestDetail' | null>(null);

  // Load crisis team from localStorage on mount
  useEffect(() => {
    const savedCrisisTeam = localStorage.getItem("crisisTeam");
    if (savedCrisisTeam) {
      try {
        const parsed = JSON.parse(savedCrisisTeam);
        setCrisisTeam(parsed);
        setActiveModule('requests'); // Switch to requests when crisis team exists
      } catch (error) {
        console.error("Error loading crisis team:", error);
      }
    }
  }, []);

  const openRequestsCount = useMemo(() => {
    return mockRequests.filter(req => req.status === 'Offen').length;
  }, []);

  const handleCrisisTeamCreated = (team: CrisisTeam) => {
    setCrisisTeam(team);
    setActiveModule('requests');
  };

  const handleUpdateCrisisTeam = (team: CrisisTeam) => {
    setCrisisTeam(team);
    localStorage.setItem("crisisTeam", JSON.stringify(team));
  };

  const handleLeaveCrisisTeam = () => {
    setCrisisTeam(null);
    localStorage.removeItem("crisisTeam");
    setActiveModule('getstarted');
  };

  const handleProductSelect = (item: InventoryItem) => {
    setSelectedProduct(item);
    setNavigationContext('database');
  };

  const handleProductSelectFromRequest = (productName: string) => {
    // Find the product in inventory by name
    const inventoryData = [
      { id: 'INV-001', location: 'München Hauptlager', address: 'Dachauer Str. 112, 80636 München', product: 'Feldbetten', category: 'Unterkünfte', available: 250, unit: 'Stück', minStock: 100, lastUpdated: '2 Std. ago' },
      { id: 'INV-002', location: 'München Hauptlager', address: 'Dachauer Str. 112, 80636 München', product: 'Schlafsäcke', category: 'Unterkünfte', available: 180, unit: 'Stück', minStock: 150, lastUpdated: '2 Std. ago' },
      { id: 'INV-003', location: 'München Hauptlager', address: 'Dachauer Str. 112, 80636 München', product: 'Necessair Unisex', category: 'Hygiene', available: 450, unit: 'Stück', minStock: 200, lastUpdated: '1 Std. ago' },
      { id: 'INV-004', location: 'München Hauptlager', address: 'Dachauer Str. 112, 80636 München', product: 'Windeln (Baby)', category: 'Hygiene', available: 85, unit: 'Pakete', minStock: 100, lastUpdated: '3 Std. ago' },
      { id: 'INV-005', location: 'München Hauptlager', address: 'Dachauer Str. 112, 80636 München', product: 'Sandwiches', category: 'Verpflegung', available: 320, unit: 'Stück', minStock: 200, lastUpdated: '30 Min. ago' },
      { id: 'INV-006', location: 'Freising Notunterkunft', address: 'Wippenhauser Str. 45, 85354 Freising', product: 'Feldbetten', category: 'Unterkünfte', available: 120, unit: 'Stück', minStock: 80, lastUpdated: '4 Std. ago' },
      { id: 'INV-007', location: 'Freising Notunterkunft', address: 'Wippenhauser Str. 45, 85354 Freising', product: 'Decken', category: 'Unterkünfte', available: 200, unit: 'Stück', minStock: 100, lastUpdated: '4 Std. ago' },
      { id: 'INV-008', location: 'Freising Notunterkunft', address: 'Wippenhauser Str. 45, 85354 Freising', product: 'Necessair Unisex', category: 'Hygiene', available: 65, unit: 'Stück', minStock: 80, lastUpdated: '5 Std. ago' },
      { id: 'INV-009', location: 'Freising Notunterkunft', address: 'Wippenhauser Str. 45, 85354 Freising', product: 'Trinkwasser', category: 'Verpflegung', available: 500, unit: 'Liter', minStock: 300, lastUpdated: '1 Std. ago' },
      { id: 'INV-010', location: 'Starnberg Versorgungszentrum', address: 'Gautinger Str. 23, 82319 Starnberg', product: 'Wohnung Familie (4 Pers.)', category: 'Unterkünfte', available: 12, unit: 'Einheiten', minStock: 10, lastUpdated: '6 Std. ago' },
      { id: 'INV-011', location: 'Starnberg Versorgungszentrum', address: 'Gautinger Str. 23, 82319 Starnberg', product: 'Necessair Unisex', category: 'Hygiene', available: 140, unit: 'Stück', minStock: 100, lastUpdated: '2 Std. ago' },
      { id: 'INV-012', location: 'Starnberg Versorgungszentrum', address: 'Gautinger Str. 23, 82319 Starnberg', product: 'Windeln (Baby)', category: 'Hygiene', available: 45, unit: 'Pakete', minStock: 60, lastUpdated: '3 Std. ago' },
      { id: 'INV-013', location: 'Starnberg Versorgungszentrum', address: 'Gautinger Str. 23, 82319 Starnberg', product: 'Warme Mahlzeiten', category: 'Verpflegung', available: 180, unit: 'Portionen', minStock: 150, lastUpdated: '1 Std. ago' },
      { id: 'INV-014', location: 'Starnberg Versorgungszentrum', address: 'Gautinger Str. 23, 82319 Starnberg', product: 'Medizinische Masken', category: 'Hygiene', available: 850, unit: 'Stück', minStock: 500, lastUpdated: '12 Std. ago' },
      { id: 'INV-015', location: 'Dachau Betreuungsstelle', address: 'Ludwig-Thoma-Str. 9, 85221 Dachau', product: 'Feldbetten', category: 'Unterkünfte', available: 95, unit: 'Stück', minStock: 100, lastUpdated: '5 Std. ago' },
      { id: 'INV-016', location: 'Dachau Betreuungsstelle', address: 'Ludwig-Thoma-Str. 9, 85221 Dachau', product: 'Schlafsäcke', category: 'Unterkünfte', available: 110, unit: 'Stück', minStock: 80, lastUpdated: '5 Std. ago' },
      { id: 'INV-017', location: 'Dachau Betreuungsstelle', address: 'Ludwig-Thoma-Str. 9, 85221 Dachau', product: 'Sandwiches', category: 'Verpflegung', available: 42, unit: 'Stück', minStock: 100, lastUpdated: '2 Std. ago' },
      { id: 'INV-018', location: 'Dachau Betreuungsstelle', address: 'Ludwig-Thoma-Str. 9, 85221 Dachau', product: 'Hygiene-Sets Kinder', category: 'Hygiene', available: 75, unit: 'Stück', minStock: 50, lastUpdated: '4 Std. ago' },
      { id: 'INV-019', location: 'Erding Notlager', address: 'Freisinger Str. 34, 85435 Erding', product: 'Decken', category: 'Unterkünfte', available: 155, unit: 'Stück', minStock: 120, lastUpdated: '7 Std. ago' },
      { id: 'INV-020', location: 'Erding Notlager', address: 'Freisinger Str. 34, 85435 Erding', product: 'Windeln (Baby)', category: 'Hygiene', available: 120, unit: 'Pakete', minStock: 80, lastUpdated: '3 Std. ago' },
      { id: 'INV-021', location: 'Erding Notlager', address: 'Freisinger Str. 34, 85435 Erding', product: 'Trinkwasser', category: 'Verpflegung', available: 680, unit: 'Liter', minStock: 400, lastUpdated: '2 Std. ago' },
      { id: 'INV-022', location: 'Erding Notlager', address: 'Freisinger Str. 34, 85435 Erding', product: 'Desinfektionsmittel', category: 'Hygiene', available: 95, unit: 'Liter', minStock: 80, lastUpdated: '6 Std. ago' },
    ];
    
    const product = inventoryData.find(item => item.product === productName);
    if (product) {
      setSelectedProduct(product);
      setNavigationContext('requestDetail');
    }
  };

  const handleBackToDatabase = () => {
    setSelectedProduct(null);
    setNavigationContext(null);
  };

  const handleBackToRequestDetail = () => {
    setSelectedProduct(null);
    // Don't reset navigationContext, stay in request context
  };

  const handleRequestSelect = (request: RequestType) => {
    setSelectedRequest(request);
  };

  const handleBackToRequests = () => {
    setSelectedRequest(null);
  };

  const handleModuleChange = (module: string) => {
    // Reset detail views when switching tabs
    if (module === 'requests') {
      setSelectedRequest(null);
    } else if (module === 'database') {
      setSelectedProduct(null);
    }
    setNavigationContext(null);
    setActiveModule(module);
  };

  const renderModule = () => {
    if (!crisisTeam) {
      return <GetStarted onCrisisTeamCreated={handleCrisisTeamCreated} />;
    }

    // Show product detail if a product is selected
    if (selectedProduct) {
      const onBack = navigationContext === 'requestDetail' ? handleBackToRequestDetail : handleBackToDatabase;
      return <ProductDetail item={selectedProduct} onBack={onBack} />;
    }

    switch (activeModule) {
      case 'requests':
        return <Requests selectedRequest={selectedRequest} onRequestSelect={handleRequestSelect} onBack={handleBackToRequests} onProductClick={handleProductSelectFromRequest} />;
      case 'personnel':
        return <Personnel />;
      case 'database':
        return <Database onProductSelect={handleProductSelect} />;
      case 'settings':
        return <Settings crisisTeam={crisisTeam} onUpdate={handleUpdateCrisisTeam} onLeave={handleLeaveCrisisTeam} onBack={() => handleModuleChange('requests')} />;
      case 'todos':
        return <ToDos />;
      case 'history':
        return <History />;
      case 'messages':
        return <DirectMessages />;
      default:
        return <Requests selectedRequest={selectedRequest} onRequestSelect={handleRequestSelect} onBack={handleBackToRequests} onProductClick={handleProductSelectFromRequest} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeModule={activeModule} 
        setActiveModule={handleModuleChange}
        openRequestsCount={openRequestsCount}
        crisisTeam={crisisTeam}
      />
      <main className="flex-1 overflow-auto">
        {renderModule()}
      </main>
    </div>
  );
}
