import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Search, MapPin, AlertTriangle, CheckCircle, Building } from 'lucide-react';

const initialLocations = [
  { id: 'LOC-001', name: 'Central Command Center', type: 'Command', address: '123 Main St, Downtown', status: 'Operational', capacity: 50, occupied: 28, priority: 'Critical' },
  { id: 'LOC-002', name: 'Field Hospital - North', type: 'Medical', address: '456 North Ave, Sector A', status: 'Operational', capacity: 100, occupied: 67, priority: 'Critical' },
  { id: 'LOC-003', name: 'Emergency Shelter #1', type: 'Shelter', address: '789 East Blvd, Zone 3', status: 'Operational', capacity: 200, occupied: 145, priority: 'High' },
  { id: 'LOC-004', name: 'Supply Warehouse A', type: 'Storage', address: '321 Industrial Rd', status: 'Operational', capacity: 500, occupied: 387, priority: 'High' },
  { id: 'LOC-005', name: 'Emergency Shelter #2', type: 'Shelter', address: '654 West St, Zone 5', status: 'At Capacity', capacity: 150, occupied: 150, priority: 'High' },
  { id: 'LOC-006', name: 'Field Hospital - South', type: 'Medical', address: '987 South Way, Sector C', status: 'Operational', capacity: 75, occupied: 43, priority: 'Critical' },
  { id: 'LOC-007', name: 'Distribution Center', type: 'Distribution', address: '147 Harbor Rd', status: 'Operational', capacity: 30, occupied: 18, priority: 'Medium' },
  { id: 'LOC-008', name: 'Communications Hub', type: 'Communications', address: '258 Tower Hill', status: 'Operational', capacity: 20, occupied: 12, priority: 'Critical' },
];

export function Locations() {
  const [locations, setLocations] = useState(initialLocations);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string, capacity: number, occupied: number) => {
    if (status === 'At Capacity' || occupied >= capacity) {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">At Capacity</Badge>;
    }
    const percentage = (occupied / capacity) * 100;
    if (percentage > 80) {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Near Capacity</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Operational</Badge>;
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

  const totalLocations = locations.length;
  const operationalLocations = locations.filter(l => l.status === 'Operational').length;
  const atCapacity = locations.filter(l => l.status === 'At Capacity' || l.occupied >= l.capacity).length;
  const totalCapacity = locations.reduce((sum, loc) => sum + loc.capacity, 0);
  const totalOccupied = locations.reduce((sum, loc) => sum + loc.occupied, 0);

  const stats = [
    { label: 'Total Locations', value: totalLocations, icon: MapPin, color: 'bg-blue-500' },
    { label: 'Operational', value: operationalLocations, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'At Capacity', value: atCapacity, icon: AlertTriangle, color: 'bg-red-500' },
    { label: 'Utilization', value: `${Math.round((totalOccupied / totalCapacity) * 100)}%`, icon: Building, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">Location Management</h1>
          <p className="text-slate-600">Track and manage emergency response locations and facilities</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Location Name</Label>
                <Input placeholder="Enter location name" />
              </div>
              <div>
                <Label>Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="command">Command</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="shelter">Shelter</SelectItem>
                    <SelectItem value="storage">Storage</SelectItem>
                    <SelectItem value="distribution">Distribution</SelectItem>
                    <SelectItem value="communications">Communications</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Address</Label>
                <Input placeholder="Enter address" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Capacity</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div>
                  <Label>Current Occupied</Label>
                  <Input type="number" placeholder="0" />
                </div>
              </div>
              <div>
                <Label>Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Add Location</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              placeholder="Search locations by name, type, or address..."
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
              <TableHead>Location Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Utilization</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLocations.map((location) => {
              const utilization = Math.round((location.occupied / location.capacity) * 100);
              return (
                <TableRow key={location.id}>
                  <TableCell className="text-slate-600">{location.id}</TableCell>
                  <TableCell>{location.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{location.type}</Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">{location.address}</TableCell>
                  <TableCell>
                    {location.occupied} / {location.capacity}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            utilization >= 100 ? 'bg-red-500' : utilization > 80 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(utilization, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-slate-600">{utilization}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(location.priority)}</TableCell>
                  <TableCell>{getStatusBadge(location.status, location.capacity, location.occupied)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Manage</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
