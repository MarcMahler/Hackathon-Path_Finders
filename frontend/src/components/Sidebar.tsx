import { Database, ClipboardList, Users, Play, Settings as SettingsIcon, Warehouse, LogOut, FileText, ShoppingCart, Package, ListTodo, TruckIcon, ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useState } from 'react';

type UserRole = 'Vorsitzender' | 'Mitarbeitender' | 'Lagerverwaltung';

interface CrisisTeam {
  name: string;
  description: string;
  responsiblePerson: string;
  members: string[];
  createdAt: string;
}

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  openRequestsCount?: number;
  crisisTeam: CrisisTeam | null;
  userRole: UserRole;
  onLogout: () => void;
  cartItemCount?: number;
}

// Mock data for warehouses - in real app this would come from props or API
const warehouses = [
  { id: 'warehouse-1', name: 'Zürich Hauptlager' },
  { id: 'warehouse-2', name: 'Oerlikon Depot' },
  { id: 'warehouse-3', name: 'Altstetten Lager' },
];

export function Sidebar({ activeModule, setActiveModule, openRequestsCount = 0, crisisTeam, userRole, onLogout, cartItemCount = 0 }: SidebarProps) {
  const [expandedWarehouse, setExpandedWarehouse] = useState<string | null>(null);

  const getStartedItems = [
    { id: 'getstarted', label: 'Erste Schritte', icon: Play },
  ];

  // Define menu items based on user role
  const getMenuItemsForRole = () => {
    if (!crisisTeam) return getStartedItems;

    switch (userRole) {
      case 'Vorsitzender':
        return [
          { id: 'requests', label: 'Anfragen', icon: ClipboardList, badge: openRequestsCount },
          { id: 'database', label: 'Produkte', icon: Database },
          { id: 'personnel', label: 'Mitarbeiter', icon: Users },
        ];
      case 'Mitarbeitender':
        return [
          { id: 'database', label: 'Produkte', icon: Database },
          { id: 'cart', label: 'Warenkorb', icon: ShoppingCart, badge: cartItemCount },
          { id: 'requested', label: 'Angefragt', icon: FileText },
          { id: 'personnel', label: 'Mitarbeiter', icon: Users },
        ];
      case 'Lagerverwaltung':
        return []; // We'll render warehouses separately
      default:
        return getStartedItems;
    }
  };

  const menuItems = getMenuItemsForRole();

  const getRoleLabel = (role: UserRole) => {
    return role;
  };

  const handleWarehouseClick = (warehouseId: string) => {
    if (expandedWarehouse === warehouseId) {
      setExpandedWarehouse(null);
    } else {
      setExpandedWarehouse(warehouseId);
      // Set to inventory by default when opening a warehouse
      setActiveModule(`${warehouseId}-inventory`);
    }
  };

  const handleSubTabClick = (warehouseId: string, subTab: string) => {
    setExpandedWarehouse(warehouseId);
    setActiveModule(`${warehouseId}-${subTab}`);
  };

  const isWarehouseActive = (warehouseId: string) => {
    return activeModule.startsWith(warehouseId);
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-10">
          <img 
            src="/logo.png" 
            alt="Resilio Logo" 
            className="w-20 h-20"
          />
          <div>
            <h1 className="text-3xl text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>Resilio</h1>
            <p className="text-sm text-slate-500">Crisis Manager</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        {userRole === 'Lagerverwaltung' && crisisTeam ? (
          // Render warehouses for Lagerverwaltung role
          <div className="space-y-1">
            {warehouses.map((warehouse) => {
              const isExpanded = expandedWarehouse === warehouse.id;
              const isActive = isWarehouseActive(warehouse.id);
              
              return (
                <div key={warehouse.id}>
                  <button
                    onClick={() => handleWarehouseClick(warehouse.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-50 border border-blue-200 text-blue-700'
                        : 'border border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Warehouse className="w-4 h-4" />
                      <span className="text-sm">{warehouse.name}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="ml-2 mt-1 mb-1 pl-3 border-l-2 border-slate-200 space-y-0.5">
                      <button
                        onClick={() => handleSubTabClick(warehouse.id, 'inventory')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all ${
                          activeModule === `${warehouse.id}-inventory`
                            ? 'bg-blue-50 border border-blue-200 text-blue-700'
                            : 'border border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-200'
                        }`}
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Lagerbestand</span>
                      </button>
                      <button
                        onClick={() => handleSubTabClick(warehouse.id, 'maintenance')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all ${
                          activeModule === `${warehouse.id}-maintenance`
                            ? 'bg-blue-50 border border-blue-200 text-blue-700'
                            : 'border border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-200'
                        }`}
                      >
                        <ListTodo className="w-3.5 h-3.5" />
                        <span>Wartungen</span>
                      </button>
                      <button
                        onClick={() => handleSubTabClick(warehouse.id, 'orders')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all ${
                          activeModule === `${warehouse.id}-orders`
                            ? 'bg-blue-50 border border-blue-200 text-blue-700'
                            : 'border border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-200'
                        }`}
                      >
                        <TruckIcon className="w-3.5 h-3.5" />
                        <span>Bestellungen</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // Render normal menu items for other roles
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                    activeModule === item.id
                      ? 'bg-blue-50 border border-blue-200 text-blue-700'
                      : 'border border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <Badge className="bg-orange-500 text-white hover:bg-orange-500 ml-2 h-5 px-2">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </nav>
      
      {crisisTeam && (
        <div className="p-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 mb-2">Aktiver Krisenstab</p>
          <div className="border border-slate-200 bg-slate-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm flex-1 text-slate-900">{crisisTeam.name}</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                onClick={() => setActiveModule('settings')}
              >
                <SettingsIcon className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full border-2 border-slate-300 bg-slate-100 flex items-center justify-center text-sm text-slate-700">
            {userRole === 'Vorsitzender' ? 'V' : userRole === 'Mitarbeitender' ? 'M' : 'L'}
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-900">{getRoleLabel(userRole)}</p>
            <p className="text-xs text-slate-500">Aktive Rolle</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4" />
          Ausloggen
        </Button>
      </div>
    </div>
  );
}
