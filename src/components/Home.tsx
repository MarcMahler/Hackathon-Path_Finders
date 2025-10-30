import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Plus, X, Mail, Trash2, Users, CheckSquare, History, MessageSquare, ChevronRight } from "lucide-react";

interface CrisisTeam {
  name: string;
  description: string;
  responsiblePerson: string;
  members: string[];
  createdAt: string;
}

interface HomeProps {
  setActiveModule: (module: string) => void;
}

export function Home({ setActiveModule }: HomeProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [invitedMembers, setInvitedMembers] = useState<string[]>([]);
  const [crisisTeam, setCrisisTeam] = useState<CrisisTeam | null>(null);
  const [crisisName, setCrisisName] = useState("");
  const [crisisDescription, setCrisisDescription] = useState("");
  const [responsiblePerson, setResponsiblePerson] = useState("");

  // Load crisis team from localStorage on component mount
  useEffect(() => {
    const savedCrisisTeam = localStorage.getItem("crisisTeam");
    if (savedCrisisTeam) {
      try {
        const parsed = JSON.parse(savedCrisisTeam);
        setCrisisTeam(parsed);
      } catch (error) {
        console.error("Error loading crisis team:", error);
      }
    }
  }, []);

  // Save crisis team to localStorage whenever it changes
  const saveCrisisTeam = (team: CrisisTeam) => {
    setCrisisTeam(team);
    localStorage.setItem("crisisTeam", JSON.stringify(team));
  };

  // Delete crisis team
  const deleteCrisisTeam = () => {
    setCrisisTeam(null);
    localStorage.removeItem("crisisTeam");
  };

  const handleAddEmail = () => {
    if (
      emailInput &&
      emailInput.includes("@") &&
      !invitedMembers.includes(emailInput)
    ) {
      setInvitedMembers([...invitedMembers, emailInput]);
      setEmailInput("");
    }
  };

  const handleRemoveEmail = (email: string) => {
    setInvitedMembers(
      invitedMembers.filter((e) => e !== email),
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  return (
    <div className="p-8">
      {crisisTeam && (
        <div className="mb-8 pb-6 border-b">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="mb-2">{crisisTeam.name}</h1>
              <p className="text-slate-600">{crisisTeam.description}</p>
              <div className="mt-4 flex items-center gap-4">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  Verantwortlich: {crisisTeam.responsiblePerson}
                </Badge>
                <Badge variant="outline">
                  {crisisTeam.members.length} Mitarbeiter
                </Badge>
                <Badge variant="outline" className="text-slate-600">
                  Erstellt: {new Date(crisisTeam.createdAt).toLocaleDateString('de-DE')}
                </Badge>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                if (confirm('Möchten Sie den Krisenstab wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
                  deleteCrisisTeam();
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Krisenstab löschen
            </Button>
          </div>
        </div>
      )}
      
      {!crisisTeam && (
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-2xl p-12 text-center">
            <div className="mb-8">
              <h1 className="mb-4">
                Willkommen im Krisenmanagement-System
              </h1>
              <p className="text-slate-600 mb-8">
                Erstellen Sie einen neuen Krisenstab, um eine
                Krisensituation zu koordinieren und zu verwalten.
              </p>
            </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        >
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Krisenstab kreieren
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Neuen Krisenstab kreieren
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              <div>
                <Label htmlFor="crisis-name">
                  Krisenname *
                </Label>
                <Input
                  id="crisis-name"
                  placeholder="z.B. Hochwasser München 2025"
                  className="mt-2"
                  value={crisisName}
                  onChange={(e) => setCrisisName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="crisis-description">
                  Krisenbeschreibung *
                </Label>
                <Textarea
                  id="crisis-description"
                  placeholder="Beschreiben Sie die Krisensituation..."
                  rows={4}
                  className="mt-2"
                  value={crisisDescription}
                  onChange={(e) => setCrisisDescription(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="responsible-person">
                  Verantwortliche Person *
                </Label>
                <Input
                  id="responsible-person"
                  placeholder="Name der verantwortlichen Person"
                  className="mt-2"
                  value={responsiblePerson}
                  onChange={(e) => setResponsiblePerson(e.target.value)}
                />
              </div>

              <div className="border-t pt-6">
                <Label htmlFor="member-email">
                  Krisenstabsmitarbeiter einladen
                </Label>
                <p className="text-sm text-slate-600 mt-1 mb-3">
                  Fügen Sie E-Mail-Adressen hinzu, um
                  Mitarbeiter zum Krisenstab einzuladen
                </p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      id="member-email"
                      type="email"
                      placeholder="mitarbeiter@example.com"
                      value={emailInput}
                      onChange={(e) =>
                        setEmailInput(e.target.value)
                      }
                      onKeyPress={handleKeyPress}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddEmail}
                  >
                    Hinzufügen
                  </Button>
                </div>
              </div>

              {invitedMembers.length > 0 && (
                <div>
                  <Label className="mb-3 block">
                    Eingeladene Mitarbeiter (
                    {invitedMembers.length})
                  </Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {invitedMembers.map((email, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border"
                      >
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-500" />
                          <span className="text-sm">
                            {email}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleRemoveEmail(email)
                          }
                          className="h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setInvitedMembers([]);
                    setEmailInput("");
                  }}
                >
                  Abbrechen
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    if (crisisName && crisisDescription && responsiblePerson) {
                      const newCrisisTeam = {
                        name: crisisName,
                        description: crisisDescription,
                        responsiblePerson: responsiblePerson,
                        members: invitedMembers,
                        createdAt: new Date().toISOString(),
                      };
                      saveCrisisTeam(newCrisisTeam);
                      setIsDialogOpen(false);
                      setInvitedMembers([]);
                      setEmailInput("");
                      setCrisisName("");
                      setCrisisDescription("");
                      setResponsiblePerson("");
                    }
                  }}
                >
                  Krisenstab erstellen
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
          </Card>
        </div>
      )}

      {crisisTeam && (
        <div>
          <div className="mb-6">
            <h2 className="mb-2">Dashboard</h2>
            <p className="text-slate-600">Übersicht über alle wichtigen Bereiche</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mitarbeiter Card */}
            <Card 
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => setActiveModule('personnel')}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="mb-2">Mitarbeiter</h3>
              <p className="text-slate-600 mb-4">
                Verwalten Sie Ihr Krisenstabsteam
              </p>
              <div className="flex items-center gap-4">
                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                  {crisisTeam.members.length} Aktive Mitarbeiter
                </Badge>
              </div>
            </Card>

            {/* ToDo's Card */}
            <Card 
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => setActiveModule('todos')}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckSquare className="w-8 h-8 text-green-600" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-green-600 transition-colors" />
              </div>
              <h3 className="mb-2">ToDo's</h3>
              <p className="text-slate-600 mb-4">
                Aufgaben und offene Punkte verwalten
              </p>
              <div className="flex items-center gap-4">
                <Badge className="bg-green-50 text-green-700 hover:bg-green-50">
                  5 Offene Aufgaben
                </Badge>
                <Badge variant="outline">
                  12 Abgeschlossen
                </Badge>
              </div>
            </Card>

            {/* History Card */}
            <Card 
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => setActiveModule('history')}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <History className="w-8 h-8 text-purple-600" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 transition-colors" />
              </div>
              <h3 className="mb-2">History</h3>
              <p className="text-slate-600 mb-4">
                Verlauf aller Aktivitäten und Änderungen
              </p>
              <div className="flex items-center gap-4">
                <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-50">
                  24 Einträge heute
                </Badge>
              </div>
            </Card>

            {/* Direct Messages Card */}
            <Card 
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => setActiveModule('messages')}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <MessageSquare className="w-8 h-8 text-orange-600" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-orange-600 transition-colors" />
              </div>
              <h3 className="mb-2">Direct Messages</h3>
              <p className="text-slate-600 mb-4">
                Direkte Kommunikation mit dem Team
              </p>
              <div className="flex items-center gap-4">
                <Badge className="bg-orange-50 text-orange-700 hover:bg-orange-50">
                  3 Neue Nachrichten
                </Badge>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}