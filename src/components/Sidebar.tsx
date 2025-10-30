import { Home, Database, ClipboardList, Users, MapPin } from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

export function Sidebar({ activeModule, setActiveModule }: SidebarProps) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'requests', label: 'Requests', icon: ClipboardList },
    { id: 'personnel', label: 'Personnel', icon: Users },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'database', label: 'Database', icon: Database },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl">Crisis Manager</h1>
        <p className="text-sm text-slate-400 mt-1">Resource Management</p>
      </div>
      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                activeModule === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
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
