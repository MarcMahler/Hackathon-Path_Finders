import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Search, Users, UserCheck, Clock, Shield } from 'lucide-react';

const initialPersonnel = [
  { id: 'PER-001', name: 'Dr. Sarah Mitchell', role: 'Medical Lead', team: 'Medical Response', status: 'Active', availability: 'Available', contact: '+1 555-0101' },
  { id: 'PER-002', name: 'John Anderson', role: 'Logistics Coordinator', team: 'Supply Chain', status: 'Active', availability: 'On Assignment', contact: '+1 555-0102' },
  { id: 'PER-003', name: 'Maria Garcia', role: 'Emergency Nurse', team: 'Medical Response', status: 'Active', availability: 'Available', contact: '+1 555-0103' },
  { id: 'PER-004', name: 'David Chen', role: 'Communications Officer', team: 'Command', status: 'Active', availability: 'Available', contact: '+1 555-0104' },
  { id: 'PER-005', name: 'Emily Thompson', role: 'Safety Officer', team: 'Safety & Security', status: 'Active', availability: 'On Assignment', contact: '+1 555-0105' },
  { id: 'PER-006', name: 'Michael Brown', role: 'Resource Manager', team: 'Supply Chain', status: 'Active', availability: 'Available', contact: '+1 555-0106' },
  { id: 'PER-007', name: 'Lisa Wang', role: 'Field Coordinator', team: 'Operations', status: 'Off Duty', availability: 'Unavailable', contact: '+1 555-0107' },
  { id: 'PER-008', name: 'Robert Martinez', role: 'Transport Lead', team: 'Logistics', status: 'Active', availability: 'Available', contact: '+1 555-0108' },
];

export function Personnel() {
  const [personnel, setPersonnel] = useState(initialPersonnel);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredPersonnel = personnel.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Active') {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
    }
    return <Badge variant="secondary">Off Duty</Badge>;
  };

  const getAvailabilityBadge = (availability: string) => {
    const configs: Record<string, { className: string }> = {
      'Available': { className: 'bg-green-100 text-green-800 hover:bg-green-100' },
      'On Assignment': { className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
      'Unavailable': { className: 'bg-slate-100 text-slate-800 hover:bg-slate-100' },
    };
    const config = configs[availability] || configs['Available'];
    return <Badge className={config.className}>{availability}</Badge>;
  };

  const totalPersonnel = personnel.length;
  const activePersonnel = personnel.filter(p => p.status === 'Active').length;
  const availablePersonnel = personnel.filter(p => p.availability === 'Available').length;

  const stats = [
    { label: 'Total Personnel', value: totalPersonnel, icon: Users, color: 'bg-blue-500' },
    { label: 'Active On Duty', value: activePersonnel, icon: UserCheck, color: 'bg-green-500' },
    { label: 'Available Now', value: availablePersonnel, icon: Shield, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">Personnel Management</h1>
          <p className="text-slate-600">Manage emergency response team members and their assignments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Personnel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Personnel</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Full Name</Label>
                <Input placeholder="Enter full name" />
              </div>
              <div>
                <Label>Role</Label>
                <Input placeholder="Enter role/position" />
              </div>
              <div>
                <Label>Team</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Medical Response</SelectItem>
                    <SelectItem value="supply">Supply Chain</SelectItem>
                    <SelectItem value="command">Command</SelectItem>
                    <SelectItem value="safety">Safety & Security</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="logistics">Logistics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Contact Number</Label>
                <Input placeholder="+1 555-0000" />
              </div>
              <div>
                <Label>Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="off">Off Duty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Add Personnel</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm">{stat.label}</p>
                  <p className="text-2xl">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search personnel by name, role, or team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPersonnel.map((person) => (
              <TableRow key={person.id}>
                <TableCell className="text-slate-600">{person.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(person.name)}</AvatarFallback>
                    </Avatar>
                    <span>{person.name}</span>
                  </div>
                </TableCell>
                <TableCell>{person.role}</TableCell>
                <TableCell>
                  <Badge variant="outline">{person.team}</Badge>
                </TableCell>
                <TableCell className="text-slate-600">{person.contact}</TableCell>
                <TableCell>{getStatusBadge(person.status)}</TableCell>
                <TableCell>{getAvailabilityBadge(person.availability)}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Assign</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
