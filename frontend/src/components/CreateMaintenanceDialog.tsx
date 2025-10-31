import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Plus, X } from 'lucide-react';
import { Checkbox } from './ui/checkbox';

interface ChecklistItem {
  id: string;
  task: string;
}

interface MaintenanceFormData {
  product: string;
  maintenanceType: string;
  interval: string;
  intervalDays: number;
  instructions: string;
  checklist: ChecklistItem[];
}

interface CreateMaintenanceDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: MaintenanceFormData) => void;
  availableProducts: string[];
}

const maintenanceTypes = [
  'Wartung',
  'Inspektion',
  'Reinigung',
  'Kontrolle',
  'Prüfung',
];

const intervalOptions = [
  { label: 'Täglich', days: 1 },
  { label: 'Wöchentlich', days: 7 },
  { label: '2 Wochen', days: 14 },
  { label: 'Monatlich', days: 30 },
  { label: 'Vierteljährlich', days: 90 },
  { label: 'Halbjährlich', days: 180 },
  { label: 'Jährlich', days: 365 },
];

export function CreateMaintenanceDialog({ open, onClose, onCreate, availableProducts }: CreateMaintenanceDialogProps) {
  const [formData, setFormData] = useState<MaintenanceFormData>({
    product: '',
    maintenanceType: 'Wartung',
    interval: 'Monatlich',
    intervalDays: 30,
    instructions: '',
    checklist: [],
  });
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create maintenance for each selected product
    selectedProducts.forEach(product => {
      onCreate({
        ...formData,
        product,
      });
    });
    onClose();
    // Reset form
    setFormData({
      product: '',
      maintenanceType: 'Wartung',
      interval: 'Monatlich',
      intervalDays: 30,
      instructions: '',
      checklist: [],
    });
    setSelectedProducts([]);
    setNewChecklistItem('');
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setFormData({
        ...formData,
        checklist: [
          ...formData.checklist,
          { id: Date.now().toString(), task: newChecklistItem.trim() }
        ]
      });
      setNewChecklistItem('');
    }
  };

  const removeChecklistItem = (id: string) => {
    setFormData({
      ...formData,
      checklist: formData.checklist.filter(item => item.id !== id)
    });
  };

  const toggleProduct = (product: string) => {
    if (selectedProducts.includes(product)) {
      setSelectedProducts(selectedProducts.filter(p => p !== product));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Neue Wartungs-Checkliste erstellen</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Maintenance Type */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Wartungsart</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maintenanceType">Typ *</Label>
                <select
                  id="maintenanceType"
                  required
                  value={formData.maintenanceType}
                  onChange={(e) => setFormData({ ...formData, maintenanceType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  {maintenanceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="interval">Intervall *</Label>
                <select
                  id="interval"
                  required
                  value={formData.interval}
                  onChange={(e) => {
                    const selected = intervalOptions.find(opt => opt.label === e.target.value);
                    setFormData({ 
                      ...formData, 
                      interval: e.target.value,
                      intervalDays: selected?.days || 30
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  {intervalOptions.map(option => (
                    <option key={option.label} value={option.label}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Product Selection */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Betroffene Artikel *</h3>
            <div className="border border-slate-200 rounded-lg p-4 max-h-48 overflow-y-auto">
              <div className="space-y-2">
                {availableProducts.map(product => (
                  <div key={product} className="flex items-center gap-2">
                    <Checkbox
                      id={`product-${product}`}
                      checked={selectedProducts.includes(product)}
                      onCheckedChange={() => toggleProduct(product)}
                    />
                    <label
                      htmlFor={`product-${product}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {product}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {selectedProducts.length > 0 && (
              <p className="text-xs text-slate-500 mt-2">
                {selectedProducts.length} Artikel ausgewählt
              </p>
            )}
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Anweisungen</h3>
            <Textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="Detaillierte Anweisungen für die Durchführung der Wartung..."
              rows={4}
            />
          </div>

          {/* Checklist */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Checkliste</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  placeholder="Neuen Checklistenpunkt hinzufügen..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addChecklistItem();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addChecklistItem}
                  className="gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Hinzufügen
                </Button>
              </div>

              {formData.checklist.length > 0 && (
                <div className="space-y-2 mt-4">
                  {formData.checklist.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 p-3 rounded-lg border border-slate-200">
                      <span className="text-sm flex-1">{item.task}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeChecklistItem(item.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={selectedProducts.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Wartung erstellen
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
