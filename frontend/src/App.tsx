import { useState, useMemo, useEffect } from 'react';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { GetStarted } from './components/GetStarted';
import { Requests } from './components/Requests';
import { Requested } from './components/Requested';
import { Personnel } from './components/Personnel';
import { Database } from './components/Database';
import { Cart } from './components/Cart';
import { ProductDetail } from './components/ProductDetail';
import { ToDos } from './components/ToDos';
import { History } from './components/History';
import { DirectMessages } from './components/DirectMessages';
import { Settings } from './components/Settings';
import { Maintenance } from './components/Maintenance';
import { WarehouseOrders } from './components/WarehouseOrders';
import { RequestProvider, useRequests } from './contexts/RequestContext';

type UserRole = 'Vorsitzender' | 'Mitarbeitender' | 'Lagerverwaltung';

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

interface RequestedArticle {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  status: 'Ausstehend' | 'Genehmigt' | 'Abgelehnt' | 'Teilweise genehmigt';
  approvedQuantity?: number;
}

interface RequestedHistoryEntry {
  id: string;
  timestamp: string;
  action: string;
  comment: string;
  articles: RequestedArticle[];
  user: string;
}

interface RequestedItemType {
  id: string;
  priority: string;
  status: 'Ausstehend' | 'Genehmigt' | 'Abgelehnt' | 'Teilweise genehmigt';
  requestDate: string;
  deadline: string;
  notes: string;
  articles: RequestedArticle[];
  history?: RequestedHistoryEntry[];
  pickupLocation?: string;
  pickupDate?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  instructions?: string;
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

// Helper function to get default module for each role
const getDefaultModuleForRole = (role: UserRole): string => {
  switch (role) {
    case 'Vorsitzender':
      return 'requests';
    case 'Mitarbeitender':
      return 'database';
    case 'Lagerverwaltung':
      return 'warehouse-1-inventory';
    default:
      return 'getstarted';
  }
};

// Main App component that uses RequestContext
function AppContent() {
  const { getOpenRequestsCount } = useRequests();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [crisisTeam, setCrisisTeam] = useState<CrisisTeam | null>(null);
  const [activeModule, setActiveModule] = useState('getstarted');
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<RequestType | null>(null);
  const [selectedRequestedItem, setSelectedRequestedItem] = useState<RequestedItemType | null>(null);
  const [navigationContext, setNavigationContext] = useState<'database' | 'requestDetail' | null>(null);
  const [cartItems, setCartItems] = useState<InventoryItem[]>([]);

  // Load crisis team and user role from localStorage on mount
  useEffect(() => {
    const savedUserRole = localStorage.getItem("userRole");
    const savedCrisisTeam = localStorage.getItem("crisisTeam");
    
    if (savedUserRole) {
      const userRole = savedUserRole as UserRole;
      setUserRole(userRole);
      
      // Always set the default module for the role, regardless of crisis team
      const defaultModule = getDefaultModuleForRole(userRole);
      setActiveModule(defaultModule);
    }
    
    if (savedCrisisTeam) {
      try {
        const parsed = JSON.parse(savedCrisisTeam);
        setCrisisTeam(parsed);
      } catch (error) {
        console.error("Error loading crisis team:", error);
      }
    }
  }, []);

  const openRequestsCount = useMemo(() => {
    return getOpenRequestsCount();
  }, [getOpenRequestsCount]);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem("userRole", role);
    
    // Set default module for the new role
    const defaultModule = getDefaultModuleForRole(role);
    setActiveModule(defaultModule);
  };

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem("userRole");
    setActiveModule('getstarted');
    setSelectedProduct(null);
    setSelectedRequest(null);
    setNavigationContext(null);
  };

  const handleCrisisTeamCreated = (team: CrisisTeam) => {
    setCrisisTeam(team);
    // Set initial module based on role
    if (userRole === 'Vorsitzender') {
      setActiveModule('requests');
    } else if (userRole === 'Mitarbeitender') {
      setActiveModule('database');
    } else if (userRole === 'Lagerverwaltung') {
      setActiveModule('warehouse-1-inventory');
    }
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
      // Zürich Hauptlager
      { id: 'INV-001', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Feldbetten', category: 'Schlafen', available: 250, unit: 'Stück', minStock: 100, lastUpdated: 'vor 2 Std.' },
      { id: 'INV-002', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Schlafsäcke', category: 'Schlafen', available: 180, unit: 'Stück', minStock: 150, lastUpdated: 'vor 2 Std.' },
      { id: 'INV-003', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Decken', category: 'Schlafen', available: 320, unit: 'Stück', minStock: 150, lastUpdated: 'vor 3 Std.' },
      { id: 'INV-005', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Hygieneset', category: 'Hygiene', available: 450, unit: 'Stück', minStock: 200, lastUpdated: 'vor 1 Std.' },
      { id: 'INV-006', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Windeln', category: 'Hygiene', available: 85, unit: 'Pakete', minStock: 100, lastUpdated: 'vor 3 Std.' },
      { id: 'INV-009', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Sandwiches', category: 'Verpflegung', available: 320, unit: 'Stück', minStock: 200, lastUpdated: 'vor 30 Min.' },
      { id: 'INV-010', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Trinkwasser', category: 'Verpflegung', available: 800, unit: 'Liter', minStock: 500, lastUpdated: 'vor 1 Std.' },
      { id: 'INV-011', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Warme Mahlzeiten', category: 'Verpflegung', available: 250, unit: 'Portionen', minStock: 150, lastUpdated: 'vor 2 Std.' },
      // Oerlikon Depot
      { id: 'INV-014', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Feldbetten', category: 'Schlafen', available: 120, unit: 'Stück', minStock: 80, lastUpdated: 'vor 4 Std.' },
      { id: 'INV-015', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Decken', category: 'Schlafen', available: 200, unit: 'Stück', minStock: 100, lastUpdated: 'vor 4 Std.' },
      { id: 'INV-017', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Hygieneset', category: 'Hygiene', available: 65, unit: 'Stück', minStock: 80, lastUpdated: 'vor 5 Std.' },
      { id: 'INV-020', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Trinkwasser', category: 'Verpflegung', available: 500, unit: 'Liter', minStock: 300, lastUpdated: 'vor 1 Std.' },
      { id: 'INV-021', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Sandwiches', category: 'Verpflegung', available: 180, unit: 'Stück', minStock: 150, lastUpdated: 'vor 2 Std.' },
      // Altstetten Lager
      { id: 'INV-025', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Feldbetten', category: 'Schlafen', available: 80, unit: 'Stück', minStock: 100, lastUpdated: 'vor 5 Std.' },
      { id: 'INV-026', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Schlafsäcke', category: 'Schlafen', available: 140, unit: 'Stück', minStock: 100, lastUpdated: 'vor 5 Std.' },
      { id: 'INV-028', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Hygieneset', category: 'Hygiene', available: 140, unit: 'Stück', minStock: 100, lastUpdated: 'vor 2 Std.' },
      { id: 'INV-029', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Windeln', category: 'Hygiene', available: 45, unit: 'Pakete', minStock: 60, lastUpdated: 'vor 3 Std.' },
      { id: 'INV-032', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Warme Mahlzeiten', category: 'Verpflegung', available: 180, unit: 'Portionen', minStock: 150, lastUpdated: 'vor 1 Std.' },
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

  const handleRequestedItemSelect = (request: RequestedItemType) => {
    setSelectedRequestedItem(request);
  };

  const handleBackToRequestedList = () => {
    setSelectedRequestedItem(null);
  };

  const handleModuleChange = (module: string) => {
    // Reset detail views when switching tabs
    if (module === 'requests') {
      setSelectedRequest(null);
    } else if (module === 'database') {
      setSelectedProduct(null);
    } else if (module === 'requested') {
      setSelectedRequestedItem(null);
    }
    setNavigationContext(null);
    setActiveModule(module);
  };

  const handleViewCart = () => {
    setActiveModule('cart');
  };

  const handleAddToCart = (items: InventoryItem[]) => {
    setCartItems([...cartItems, ...items]);
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
    setActiveModule('database');
  };

  const handleBackFromCart = () => {
    setActiveModule('database');
  };

  // Helper function to get warehouse name from ID
  const getWarehouseName = (warehouseId: string) => {
    const warehouses: { [key: string]: string } = {
      'warehouse-1': 'Zürich Hauptlager',
      'warehouse-2': 'Oerlikon Depot',
      'warehouse-3': 'Altstetten Lager',
    };
    return warehouses[warehouseId] || 'Lager';
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

    // Handle warehouse modules
    if (activeModule.startsWith('warehouse-')) {
      const parts = activeModule.split('-');
      const warehouseId = `${parts[0]}-${parts[1]}`; // e.g., 'warehouse-1'
      const subModule = parts[2]; // 'inventory', 'maintenance', or 'orders'
      const warehouseName = getWarehouseName(warehouseId);

      switch (subModule) {
        case 'inventory':
          return <Database onProductSelect={handleProductSelect} userRole={userRole} onViewCart={handleViewCart} onAddToCart={handleAddToCart} cartItemCount={cartItems.length} selectedLocation={warehouseName} />;
        case 'maintenance':
          return <Maintenance locationName={warehouseName} />;
        case 'orders':
          return <WarehouseOrders locationName={warehouseName} />;
        default:
          return <Database onProductSelect={handleProductSelect} userRole={userRole} onViewCart={handleViewCart} onAddToCart={handleAddToCart} cartItemCount={cartItems.length} selectedLocation={warehouseName} />;
      }
    }

    switch (activeModule) {
      case 'requests':
        return <Requests selectedRequest={selectedRequest} onRequestSelect={handleRequestSelect} onBack={handleBackToRequests} onProductClick={handleProductSelectFromRequest} />;
      case 'requested':
        return <Requested selectedRequest={selectedRequestedItem} onRequestSelect={handleRequestedItemSelect} onBack={handleBackToRequestedList} />;
      case 'personnel':
        return <Personnel />;
      case 'database':
        return <Database onProductSelect={handleProductSelect} userRole={userRole} onViewCart={handleViewCart} onAddToCart={handleAddToCart} cartItemCount={cartItems.length} />;
      case 'cart':
        return <Cart items={cartItems} onBack={handleBackFromCart} onRemoveItem={handleRemoveFromCart} onClearCart={handleClearCart} />;
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

  // Show login screen if no user role is selected
  if (!userRole) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeModule={activeModule} 
        setActiveModule={handleModuleChange}
        openRequestsCount={openRequestsCount}
        crisisTeam={crisisTeam}
        userRole={userRole}
        onLogout={handleLogout}
        cartItemCount={cartItems.length}
      />
      <main className="flex-1 overflow-auto">
        {renderModule()}
      </main>
    </div>
  );
}

// Wrapper component with RequestProvider
export default function App() {
  return (
    <RequestProvider>
      <AppContent />
    </RequestProvider>
  );
}
