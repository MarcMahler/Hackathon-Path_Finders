import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Phone, Mail, Clock, Building2, Users, Truck, AlertTriangle, Shield, Stethoscope, Headphones } from 'lucide-react';

interface SupportProps {
  onBack?: () => void;
}

const emergencyContacts = [
  {
    department: 'Notfall-Hotline',
    description: 'Sofortige Hilfe bei akuten Krisen und Notfällen',
    phone: '+41 44 117 00 00',
    email: 'notfall@resilio.ch',
    availability: '24/7 verfügbar',
    priority: 'kritisch',
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  {
    department: 'Krisenstab Leitung',
    description: 'Koordination und strategische Entscheidungen',
    phone: '+41 44 123 45 00',
    email: 'krisenstab@resilio.ch',
    availability: 'Mo-So 6:00-22:00',
    priority: 'hoch',
    icon: Shield,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  {
    department: 'Lagerverwaltung',
    description: 'Bestandsanfragen und Logistik-Koordination',
    phone: '+41 44 123 45 10',
    email: 'lager@resilio.ch',
    availability: 'Mo-Fr 7:00-18:00, Sa 9:00-14:00',
    priority: 'normal',
    icon: Building2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    department: 'Transport & Logistik',
    description: 'Fahrzeuge, Transporte und Lieferungen',
    phone: '+41 44 123 45 20',
    email: 'transport@resilio.ch',
    availability: 'Mo-Fr 6:00-20:00, Sa 8:00-16:00',
    priority: 'normal',
    icon: Truck,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  {
    department: 'Medizinische Unterstützung',
    description: 'Gesundheitswesen und medizinische Hilfe',
    phone: '+41 44 123 45 30',
    email: 'medizin@resilio.ch',
    availability: 'Mo-Fr 8:00-18:00, Notfall 24/7',
    priority: 'hoch',
    icon: Stethoscope,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    department: 'Personalkoordination',
    description: 'Helfer-Einsatzplanung und Freiwillige',
    phone: '+41 44 123 45 40',
    email: 'personal@resilio.ch',
    availability: 'Mo-Fr 9:00-17:00',
    priority: 'normal',
    icon: Users,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
  },
  {
    department: 'IT-Support',
    description: 'Technische Probleme und System-Support',
    phone: '+41 44 123 45 50',
    email: 'it-support@resilio.ch',
    availability: 'Mo-Fr 8:00-17:00',
    priority: 'normal',
    icon: Headphones,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
  },
];

const quickActions = [
  {
    title: 'Zentrale Leitstelle',
    description: 'Direkte Verbindung zur Einsatzleitstelle',
    action: 'Anrufen: +41 44 117 00 00',
    urgent: true,
  },
  {
    title: 'SMS-Notfall',
    description: 'Kurznachricht bei Kommunikationsproblemen',
    action: 'SMS an: +41 79 123 45 67',
    urgent: true,
  },
  {
    title: 'E-Mail Sammeladresse',
    description: 'Alle Abteilungen gleichzeitig kontaktieren',
    action: 'E-Mail: alle@resilio.ch',
    urgent: false,
  },
];

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'kritisch':
      return <Badge className="bg-red-600 text-white hover:bg-red-600">Kritisch</Badge>;
    case 'hoch':
      return <Badge className="bg-orange-500 text-white hover:bg-orange-500">Hoch</Badge>;
    case 'normal':
      return <Badge className="bg-blue-500 text-white hover:bg-blue-500">Normal</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
};

export function Support({ onBack }: SupportProps) {
  const handlePhoneCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, '_blank');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2">Support & Notfallkontakte</h1>
        <p className="text-slate-600">Wichtige Telefonnummern und Kontaktinformationen der verschiedenen Abteilungen</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4">Schnelle Hilfe</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                action.urgent 
                  ? 'border-red-200 bg-red-50 hover:border-red-300' 
                  : 'border-blue-200 bg-blue-50 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className={`text-lg ${action.urgent ? 'text-red-800' : 'text-blue-800'}`}>
                  {action.title}
                </h3>
                {action.urgent && (
                  <Badge className="bg-red-600 text-white hover:bg-red-600">
                    EILIG
                  </Badge>
                )}
              </div>
              <p className={`text-sm mb-3 ${action.urgent ? 'text-red-700' : 'text-blue-700'}`}>
                {action.description}
              </p>
              <p className={`font-mono text-sm ${action.urgent ? 'text-red-900' : 'text-blue-900'}`}>
                {action.action}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div>
        <h2 className="mb-4">Abteilungskontakte</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {emergencyContacts.map((contact, index) => {
            const Icon = contact.icon;
            return (
              <Card 
                key={index} 
                className={`p-6 transition-all hover:shadow-lg ${contact.borderColor} ${contact.bgColor}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${contact.bgColor} border ${contact.borderColor}`}>
                    <Icon className={`w-6 h-6 ${contact.color}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg text-slate-900">{contact.department}</h3>
                      {getPriorityBadge(contact.priority)}
                    </div>
                    
                    <p className="text-slate-700 mb-4">{contact.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Phone className={`w-4 h-4 ${contact.color}`} />
                        <Button
                          variant="link"
                          className={`p-0 h-auto font-mono text-left ${contact.color} hover:underline`}
                          onClick={() => handlePhoneCall(contact.phone)}
                        >
                          {contact.phone}
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Mail className={`w-4 h-4 ${contact.color}`} />
                        <Button
                          variant="link"
                          className={`p-0 h-auto text-left ${contact.color} hover:underline`}
                          onClick={() => handleEmail(contact.email)}
                        >
                          {contact.email}
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 ${contact.color}`} />
                        <span className="text-sm text-slate-600">{contact.availability}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Important Notes */}
      <Card className="mt-8 p-6 border-amber-200 bg-amber-50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-amber-800 mb-2">Wichtige Hinweise</h3>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Bei lebensbedrohlichen Notfällen immer zuerst die 144 (Sanitätsnotruf) wählen</li>
              <li>• Bei Feuer und Explosionsgefahr die 118 (Feuerwehr) kontaktieren</li>
              <li>• Bei Verbrechen und Sicherheitsbedrohungen die 117 (Polizei) rufen</li>
              <li>• Für koordinierte Hilfeleistungen nutzen Sie unsere Notfall-Hotline: +41 44 117 00 00</li>
              <li>• Halten Sie bei allen Anfragen Ihre Mitarbeiter-ID und den aktuellen Standort bereit</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}