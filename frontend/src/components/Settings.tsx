import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { AlertCircle, Save, LogOut, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface CrisisTeam {
  name: string;
  description: string;
  responsiblePerson: string;
  members: string[];
  createdAt: string;
}

interface SettingsProps {
  crisisTeam: CrisisTeam;
  onUpdate: (team: CrisisTeam) => void;
  onLeave: () => void;
  onBack: () => void;
}

export function Settings({ crisisTeam, onUpdate, onLeave, onBack }: SettingsProps) {
  const [description, setDescription] = useState(crisisTeam.description);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(description !== crisisTeam.description);
  }, [description, crisisTeam.description]);

  const handleSave = () => {
    const updatedTeam = {
      ...crisisTeam,
      description: description,
    };
    onUpdate(updatedTeam);
    setHasChanges(false);
  };

  const handleLeave = () => {
    if (confirm('Möchten Sie den Krisenstab wirklich verlassen? Diese Aktion kann nicht rückgängig gemacht werden und alle Daten werden gelöscht.')) {
      onLeave();
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-8 w-8"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="mb-2">Krisenstab Einstellungen</h1>
            <p className="text-slate-600">Verwalten Sie die Einstellungen Ihres Krisenstabs</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Crisis Team Overview */}
        <Card className="p-6">
          <h3 className="mb-4">Krisenstab Übersicht</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-600">Krisenname</Label>
              <p className="mt-1">{crisisTeam.name}</p>
            </div>
            <div>
              <Label className="text-slate-600">Verantwortliche Person</Label>
              <p className="mt-1">{crisisTeam.responsiblePerson}</p>
            </div>
            <div>
              <Label className="text-slate-600">Erstellt am</Label>
              <p className="mt-1">{new Date(crisisTeam.createdAt).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
            <div>
              <Label className="text-slate-600">Mitarbeiter</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {crisisTeam.members.length > 0 ? (
                  crisisTeam.members.map((member, index) => (
                    <Badge key={index} variant="outline">{member}</Badge>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm">Keine Mitarbeiter eingeladen</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Edit Description */}
        <Card className="p-6">
          <h3 className="mb-4">Krisenbeschreibung bearbeiten</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="mt-2"
                placeholder="Beschreiben Sie die Krisensituation..."
              />
            </div>
            {hasChanges && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Sie haben ungespeicherte Änderungen
                </AlertDescription>
              </Alert>
            )}
            <Button 
              onClick={handleSave}
              disabled={!hasChanges}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              Änderungen speichern
            </Button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-red-200 bg-red-50/50">
          <h3 className="mb-4 text-red-800">Gefahrenbereich</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-600">Krisenstab verlassen</Label>
              <p className="text-sm text-slate-600 mt-1 mb-4">
                Wenn Sie den Krisenstab verlassen, werden alle Daten permanent gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
              <Button 
                variant="destructive"
                onClick={handleLeave}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Krisenstab verlassen
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
