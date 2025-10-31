import { Database, ClipboardList, Users, Play, Settings as SettingsIcon } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

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
}

export function Sidebar({ activeModule, setActiveModule, openRequestsCount = 0, crisisTeam }: SidebarProps) {
  const getStartedItems = [
    { id: 'getstarted', label: 'Get Started', icon: Play },
  ];

  const mainMenuItems = [
    { id: 'requests', label: 'Requests', icon: ClipboardList, badge: openRequestsCount },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'personnel', label: 'Personnel', icon: Users },
  ];

  const menuItems = crisisTeam ? mainMenuItems : getStartedItems;

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>Resilio</h1>
        <p className="text-sm text-slate-400 mt-1">Crisis Manager</p>
      </div>
      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mb-2 transition-colors ${
                activeModule === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <Badge className="bg-orange-500 text-white hover:bg-orange-500 ml-2">
                  {item.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>
      
      {crisisTeam && (
        <div className="p-4 border-t border-slate-700">
          <p className="text-xs text-slate-400 mb-2">Aktiver Krisenstab</p>
          <div className="bg-slate-800 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm flex-1">{crisisTeam.name}</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
                onClick={() => setActiveModule('settings')}
              >
                <SettingsIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm">
            AU
          </div>
          <div>
            <p className="text-sm">Admin User</p>
            <p className="text-xs text-slate-400">admin@company.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
