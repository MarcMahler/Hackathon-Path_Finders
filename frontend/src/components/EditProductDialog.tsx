import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Plus, Minus, Save, Upload, X } from 'lucide-react';
import { ProductFormData } from './AddProductDialog';

interface EditProductDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: ProductFormData) => void;
  initialData: ProductFormData & { available?: number };
}

const categories = [
  'Unterkünfte',
  'Hygiene',
  'Verpflegung',
  'Medizin',
  'Werkzeuge',
  'Kommunikation',
  'Sonstiges'
];

const units = [
  'Stück',
  'Pakete',
  'Liter',
  'Kilogramm',
  'Einheiten',
  'Portionen'
];

export function EditProductDialog({ open, onClose, onSave, initialData }: EditProductDialogProps) {
  const [formData, setFormData] = useState<ProductFormData>(initialData);
  const [stockChange, setStockChange] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);

  const currentStock = (initialData.available || initialData.quantity) + stockChange;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      quantity: currentStock,
    };
    onSave(updatedData);
    onClose();
    setStockChange(0);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, imageUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Artikel bearbeiten</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Stock Management */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Bestandsverwaltung</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Aktueller Bestand:</span>
                <span className="text-lg">{initialData.available || initialData.quantity} {formData.unit}</span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStockChange(prev => prev - 10)}
                  className="gap-1"
                >
                  <Minus className="w-3 h-3" />
                  10
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStockChange(prev => prev - 1)}
                  className="gap-1"
                >
                  <Minus className="w-3 h-3" />
                  1
                </Button>
                <Input
                  type="number"
                  value={stockChange}
                  onChange={(e) => setStockChange(parseInt(e.target.value) || 0)}
                  className="text-center flex-1"
                  placeholder="±Änderung"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStockChange(prev => prev + 1)}
                  className="gap-1"
                >
                  <Plus className="w-3 h-3" />
                  1
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStockChange(prev => prev + 10)}
                  className="gap-1"
                >
                  <Plus className="w-3 h-3" />
                  10
                </Button>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-blue-200">
                <span className="text-sm font-semibold text-slate-900">Neuer Bestand:</span>
                <span className={`text-lg ${stockChange !== 0 ? 'text-blue-600 font-semibold' : ''}`}>
                  {currentStock} {formData.unit}
                  {stockChange !== 0 && (
                    <span className="text-sm ml-2">
                      ({stockChange > 0 ? '+' : ''}{stockChange})
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Grundinformationen</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="product">Artikelname *</Label>
                <Input
                  id="product"
                  required
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  placeholder="z.B. Feldbetten"
                />
              </div>
              <div>
                <Label htmlFor="category">Kategorie *</Label>
                <select
                  id="category"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stock Settings */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Bestandseinstellungen</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="unit">Einheit *</Label>
                <select
                  id="unit"
                  required
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="minStock">Mindestbestand *</Label>
                <Input
                  id="minStock"
                  type="number"
                  required
                  min="0"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          {/* Supplier Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Beschaffungsinformationen</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="supplier">Lieferant *</Label>
                <Input
                  id="supplier"
                  required
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  placeholder="z.B. Katastrophenschutz Zürich"
                />
              </div>
              <div>
                <Label htmlFor="orderDetails">Bestelldetails</Label>
                <Textarea
                  id="orderDetails"
                  value={formData.orderDetails}
                  onChange={(e) => setFormData({ ...formData, orderDetails: e.target.value })}
                  placeholder="Kontaktinformationen, Bestellnummer, Lieferzeiten, etc."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="pickupDescription">Abholbeschreibung</Label>
                <Textarea
                  id="pickupDescription"
                  value={formData.pickupDescription}
                  onChange={(e) => setFormData({ ...formData, pickupDescription: e.target.value })}
                  placeholder="z.B. Abholbar im Lager von 7:30 - 17:00, Zufahrt nur mit Auto möglich"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Produktbild</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="image">Bild hochladen</Label>
                <div className="mt-2">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image')?.click()}
                    className="w-full gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Bild auswählen
                  </Button>
                </div>
              </div>
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Produktvorschau"
                    className="w-full h-40 object-cover rounded-lg border border-slate-200"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-white"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData({ ...formData, imageUrl: '' });
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Zusatzinformationen</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Ablaufdatum (für Lebensmittel)</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="maintenanceInterval">Wartungsintervall</Label>
                <Input
                  id="maintenanceInterval"
                  value={formData.maintenanceInterval}
                  onChange={(e) => setFormData({ ...formData, maintenanceInterval: e.target.value })}
                  placeholder="z.B. Monatlich, Vierteljährlich"
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="maintenanceNotes">Wartungshinweise</Label>
              <Textarea
                id="maintenanceNotes"
                value={formData.maintenanceNotes}
                onChange={(e) => setFormData({ ...formData, maintenanceNotes: e.target.value })}
                placeholder="Besondere Anforderungen oder Hinweise zur Wartung"
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
              <Save className="w-4 h-4 mr-2" />
              Änderungen speichern
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
