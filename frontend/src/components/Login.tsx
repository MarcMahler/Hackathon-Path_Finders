import { Card } from './ui/card';
import { Button } from './ui/button';
import { Shield, Users, Warehouse } from 'lucide-react';

type UserRole = 'Vorsitzender' | 'Mitarbeitender' | 'Lagerverwaltung';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

export function Login({ onLogin }: LoginProps) {
  const roles: { role: UserRole; icon: any; color: string; description: string }[] = [
    {
      role: 'Vorsitzender',
      icon: Shield,
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'Vollständiger Zugriff auf alle Funktionen',
    },
    {
      role: 'Mitarbeitender',
      icon: Users,
      color: 'bg-green-500 hover:bg-green-600',
      description: 'Zugriff auf Produkte, Anfragen und Mitarbeiter',
    },
    {
      role: 'Lagerverwaltung',
      icon: Warehouse,
      color: 'bg-purple-500 hover:bg-purple-600',
      description: 'Zugriff auf Lagerverwaltung',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="mb-4">Resilio, Crisis Manager</h1>
          <p className="text-slate-600">Wählen Sie Ihre Rolle um fortzufahren</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map(({ role, icon: Icon, color, description }) => (
            <Card
              key={role}
              className="p-8 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => onLogin(role)}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-20 h-20 rounded-full ${color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="mb-2">{role}</h2>
                  <p className="text-sm text-slate-600">{description}</p>
                </div>
                <Button className="w-full mt-4">Als {role} anmelden</Button>
              </div>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-slate-500 mt-8">
          Vereinfachtes Login-System für Demonstrationszwecke
        </p>
      </div>
    </div>
  );
}
