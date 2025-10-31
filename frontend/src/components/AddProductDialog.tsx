import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { X, Plus, Upload, Image as ImageIcon } from 'lucide-react';

interface AddProductDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (product: ProductFormData) => void;
  isUpdate?: boolean;
  initialData?: ProductFormData;
}

export interface ProductFormData {
  product: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  supplier: string;
  orderDetails: string;
  pickupDescription?: string;
  imageUrl?: string;
  expiryDate?: string;
  maintenanceInterval?: string;
  maintenanceNotes?: string;
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

export function AddProductDialog({ open, onClose, onAdd, isUpdate = false, initialData }: AddProductDialogProps) {
  const [formData, setFormData] = useState<ProductFormData>(initialData || {
    product: '',
    category: 'Unterkünfte',
    quantity: 0,
    unit: 'Stück',
    minStock: 0,
    supplier: '',
    orderDetails: '',
    pickupDescription: '',
    imageUrl: '',
    expiryDate: '',
    maintenanceInterval: '',
    maintenanceNotes: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
    // Reset form
    setFormData({
      product: '',
      category: 'Unterkünfte',
      quantity: 0,
      unit: 'Stück',
      minStock: 0,
      supplier: '',
      orderDetails: '',
      pickupDescription: '',
      imageUrl: '',
      expiryDate: '',
      maintenanceInterval: '',
      maintenanceNotes: '',
    });
    setImagePreview(null);
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
          <DialogTitle>
            {isUpdate ? 'Artikel bearbeiten' : 'Neuen Artikel hinzufügen'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Quantity Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Bestandsinformationen</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="quantity">Anzahl *</Label>
                <Input
                  id="quantity"
                  type="number"
                  required
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                />
              </div>
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
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              {isUpdate ? 'Aktualisieren' : 'Hinzufügen'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
