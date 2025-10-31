import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, CheckCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';

interface Todo {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Offen' | 'In Bearbeitung' | 'Abgeschlossen';
  assignedTo: string;
  dueDate: string;
  completed: boolean;
}

const initialTodos: Todo[] = [
  { id: 'TODO-001', title: 'Notfall-Evakuierungsplan erstellen', description: 'Detaillierten Plan für Zone A erstellen', priority: 'Critical', status: 'In Bearbeitung', assignedTo: 'Dr. Sarah Mitchell', dueDate: '2025-10-31', completed: false },
  { id: 'TODO-002', title: 'Ressourcen-Bestandsaufnahme', description: 'Vollständige Inventur aller medizinischen Vorräte', priority: 'High', status: 'Offen', assignedTo: 'John Anderson', dueDate: '2025-11-02', completed: false },
  { id: 'TODO-003', title: 'Kommunikationstest durchführen', description: 'Alle Funkgeräte auf Funktionsfähigkeit prüfen', priority: 'High', status: 'Offen', assignedTo: 'Maria Garcia', dueDate: '2025-11-01', completed: false },
  { id: 'TODO-004', title: 'Notunterkunft inspizieren', description: 'Sicherheitscheck der temporären Unterkünfte', priority: 'Medium', status: 'Offen', assignedTo: 'David Chen', dueDate: '2025-11-03', completed: false },
  { id: 'TODO-005', title: 'Statusbericht verfassen', description: 'Täglicher Bericht an Einsatzleitung', priority: 'Medium', status: 'Offen', assignedTo: 'Emily Thompson', dueDate: '2025-10-30', completed: false },
  { id: 'TODO-006', title: 'Transportrouten planen', description: 'Alternative Routen für Versorgungsfahrzeuge', priority: 'High', status: 'Abgeschlossen', assignedTo: 'Michael Brown', dueDate: '2025-10-29', completed: true },
  { id: 'TODO-007', title: 'Erste-Hilfe-Training', description: 'Schulung für neue Freiwillige', priority: 'Medium', status: 'Abgeschlossen', assignedTo: 'Lisa Wang', dueDate: '2025-10-28', completed: true },
];

export function ToDos() {
  const [todos, setTodos] = useState(initialTodos);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('Alle');

  const toggleTodoComplete = (id: string) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed,
          status: !todo.completed ? 'Abgeschlossen' : 'Offen'
        };
      }
      return todo;
    }));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const getPriorityBadge = (priority: string) => {
    const configs: Record<string, { className: string }> = {
      'Critical': { className: 'bg-red-600 text-white hover:bg-red-600' },
      'High': { className: 'bg-orange-500 text-white hover:bg-orange-500' },
      'Medium': { className: 'bg-blue-500 text-white hover:bg-blue-500' },
      'Low': { className: 'bg-slate-500 text-white hover:bg-slate-500' },
    };
    const config = configs[priority] || configs['Medium'];
    return <Badge className={config.className}>{priority}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { className: string; icon: any }> = {
      'Offen': { className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100', icon: Clock },
      'In Bearbeitung': { className: 'bg-blue-100 text-blue-800 hover:bg-blue-100', icon: AlertCircle },
      'Abgeschlossen': { className: 'bg-green-100 text-green-800 hover:bg-green-100', icon: CheckCircle },
    };
    const config = configs[status] || configs['Offen'];
    const Icon = config.icon;
    return (
      <Badge className={config.className}>
        <Icon className="w-3 h-3 mr-1 inline" />
        {status}
      </Badge>
    );
  };

  const filteredTodos = filterStatus === 'Alle' 
    ? todos 
    : todos.filter(todo => todo.status === filterStatus);

  const openTodos = todos.filter(t => !t.completed).length;
  const completedTodos = todos.filter(t => t.completed).length;
  const criticalTodos = todos.filter(t => t.priority === 'Critical' && !t.completed).length;

  const stats = [
    { label: 'Gesamt', value: todos.length, color: 'bg-blue-500' },
    { label: 'Offen', value: openTodos, color: 'bg-yellow-500' },
    { label: 'Abgeschlossen', value: completedTodos, color: 'bg-green-500' },
    { label: 'Kritisch', value: criticalTodos, color: 'bg-red-500' },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">ToDo's</h1>
          <p className="text-slate-600">Verwalten Sie Aufgaben und offene Punkte</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Neue Aufgabe
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Neue Aufgabe erstellen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Titel</Label>
                <Input placeholder="Aufgabentitel" className="mt-2" />
              </div>
              <div>
                <Label>Beschreibung</Label>
                <Textarea placeholder="Detaillierte Beschreibung..." rows={3} className="mt-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priorität</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Wählen Sie..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Fälligkeitsdatum</Label>
                  <Input type="date" className="mt-2" />
                </div>
              </div>
              <div>
                <Label>Zugewiesen an</Label>
                <Input placeholder="Name des Mitarbeiters" className="mt-2" />
              </div>
              <Button className="w-full">Aufgabe erstellen</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
              <span className="text-white text-xl">{stat.value}</span>
            </div>
            <p className="text-slate-600">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="mb-4">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Status filtern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Alle">Alle Aufgaben</SelectItem>
            <SelectItem value="Offen">Offen</SelectItem>
            <SelectItem value="In Bearbeitung">In Bearbeitung</SelectItem>
            <SelectItem value="Abgeschlossen">Abgeschlossen</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredTodos.map((todo) => (
          <Card key={todo.id} className={`p-6 ${todo.completed ? 'bg-slate-50' : ''}`}>
            <div className="flex items-start gap-4">
              <Checkbox 
                checked={todo.completed}
                onCheckedChange={() => toggleTodoComplete(todo.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className={`mb-1 ${todo.completed ? 'line-through text-slate-500' : ''}`}>
                      {todo.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-3">{todo.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="outline" className="text-slate-600">{todo.id}</Badge>
                  {getPriorityBadge(todo.priority)}
                  {getStatusBadge(todo.status)}
                  <Badge variant="outline">
                    Zugewiesen: {todo.assignedTo}
                  </Badge>
                  <Badge variant="outline" className="text-slate-600">
                    Fällig: {new Date(todo.dueDate).toLocaleDateString('de-DE')}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
