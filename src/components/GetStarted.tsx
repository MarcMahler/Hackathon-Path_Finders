import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Plus, X, Mail } from "lucide-react";

interface CrisisTeam {
  name: string;
  description: string;
  responsiblePerson: string;
  members: string[];
  createdAt: string;
}

interface GetStartedProps {
  onCrisisTeamCreated: (team: CrisisTeam) => void;
}

export function GetStarted({ onCrisisTeamCreated }: GetStartedProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [invitedMembers, setInvitedMembers] = useState<string[]>([]);
  const [crisisName, setCrisisName] = useState("");
  const [crisisDescription, setCrisisDescription] = useState("");
  const [responsiblePerson, setResponsiblePerson] = useState("");

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

  const handleCreateCrisisTeam = () => {
    if (crisisName && crisisDescription && responsiblePerson) {
      const newCrisisTeam: CrisisTeam = {
        name: crisisName,
        description: crisisDescription,
        responsiblePerson: responsiblePerson,
        members: invitedMembers,
        createdAt: new Date().toISOString(),
      };
      
      // Save to localStorage
      localStorage.setItem("crisisTeam", JSON.stringify(newCrisisTeam));
      
      // Notify parent component
      onCrisisTeamCreated(newCrisisTeam);
      
      // Reset form
      setIsDialogOpen(false);
      setInvitedMembers([]);
      setEmailInput("");
      setCrisisName("");
      setCrisisDescription("");
      setResponsiblePerson("");
    }
  };

  return (
    <div className="p-8">
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
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" aria-describedby="create-crisis-team-description">
              <DialogHeader>
                <DialogTitle>
                  Neuen Krisenstab kreieren
                </DialogTitle>
                <DialogDescription id="create-crisis-team-description">
                  Erstellen Sie einen neuen Krisenstab für die Koordination und Verwaltung einer Krisensituation.
                </DialogDescription>
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
                    onClick={handleCreateCrisisTeam}
                  >
                    Krisenstab erstellen
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </Card>
      </div>
    </div>
  );
}
