import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Search, Database as DatabaseIcon, Server, HardDrive, RefreshCw } from 'lucide-react';

const databaseRecords = [
  { id: 'DB-001', name: 'Customer Records', type: 'Primary', size: '2.4 GB', records: 12458, status: 'Active', lastSync: '2 min ago' },
  { id: 'DB-002', name: 'Transaction Logs', type: 'Archive', size: '8.7 GB', records: 45632, status: 'Active', lastSync: '5 min ago' },
  { id: 'DB-003', name: 'Inventory Data', type: 'Primary', size: '1.2 GB', records: 5678, status: 'Active', lastSync: '1 min ago' },
  { id: 'DB-004', name: 'Employee Database', type: 'Primary', size: '845 MB', records: 1234, status: 'Active', lastSync: '3 min ago' },
  { id: 'DB-005', name: 'Analytics Cache', type: 'Temporary', size: '3.1 GB', records: 23456, status: 'Active', lastSync: '10 min ago' },
  { id: 'DB-006', name: 'Backup - Oct 2025', type: 'Backup', size: '15.6 GB', records: 89234, status: 'Archived', lastSync: '1 day ago' },
  { id: 'DB-007', name: 'Session Data', type: 'Temporary', size: '456 MB', records: 3421, status: 'Active', lastSync: '30 sec ago' },
  { id: 'DB-008', name: 'Audit Logs', type: 'Archive', size: '5.2 GB', records: 67890, status: 'Active', lastSync: '15 min ago' },
];

const systemMetrics = [
  { server: 'Server 1', cpu: 45, memory: 62, storage: 78, status: 'Healthy' },
  { server: 'Server 2', cpu: 38, memory: 54, storage: 65, status: 'Healthy' },
  { server: 'Server 3', cpu: 72, memory: 81, storage: 89, status: 'Warning' },
  { server: 'Server 4', cpu: 28, memory: 42, storage: 56, status: 'Healthy' },
];

export function Database() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('records');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredRecords = databaseRecords.filter(record =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    if (status === 'Active') {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
    }
    return <Badge variant="secondary">Archived</Badge>;
  };

  const getHealthBadge = (status: string) => {
    if (status === 'Healthy') {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Healthy</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Warning</Badge>;
  };

  const totalRecords = databaseRecords.reduce((sum, db) => sum + db.records, 0);
  const totalSize = databaseRecords.reduce((sum, db) => {
    const sizeInGB = db.size.includes('GB') ? parseFloat(db.size) : parseFloat(db.size) / 1024;
    return sum + sizeInGB;
  }, 0);
  const activeDBs = databaseRecords.filter(db => db.status === 'Active').length;

  const stats = [
    { label: 'Total Records', value: totalRecords.toLocaleString(), icon: DatabaseIcon },
    { label: 'Active Databases', value: activeDBs, icon: Server },
    { label: 'Total Storage', value: `${totalSize.toFixed(1)} GB`, icon: HardDrive },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">Database Management</h1>
          <p className="text-slate-600">Manage and monitor your database systems</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Sync All
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Database
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Database</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Database Name</Label>
                  <Input placeholder="Enter database name" />
                </div>
                <div>
                  <Label>Type</Label>
                  <Input placeholder="Primary, Archive, Backup, etc." />
                </div>
                <div>
                  <Label>Connection String</Label>
                  <Input placeholder="Enter connection string" />
                </div>
                <Button className="w-full">Add Database</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-600" />
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="records">Database Records</TabsTrigger>
          <TabsTrigger value="servers">Server Status</TabsTrigger>
        </TabsList>

        <TabsContent value="records">
          <Card className="p-6">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search databases by name or ID..."
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
                  <TableHead>Type</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Last Sync</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="text-slate-600">{record.id}</TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.type}</Badge>
                    </TableCell>
                    <TableCell>{record.records.toLocaleString()}</TableCell>
                    <TableCell>{record.size}</TableCell>
                    <TableCell className="text-slate-600">{record.lastSync}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Manage</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="servers">
          <Card className="p-6">
            <h3 className="mb-4">Server Health Metrics</h3>
            <div className="space-y-6">
              {systemMetrics.map((metric, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <Server className="w-5 h-5 text-blue-600" />
                      <span>{metric.server}</span>
                    </div>
                    {getHealthBadge(metric.status)}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">CPU Usage</span>
                        <span>{metric.cpu}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${metric.cpu > 70 ? 'bg-red-500' : 'bg-blue-500'}`}
                          style={{ width: `${metric.cpu}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Memory Usage</span>
                        <span>{metric.memory}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${metric.memory > 80 ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${metric.memory}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Storage Usage</span>
                        <span>{metric.storage}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${metric.storage > 85 ? 'bg-red-500' : 'bg-purple-500'}`}
                          style={{ width: `${metric.storage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
