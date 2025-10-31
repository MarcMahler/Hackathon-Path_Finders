import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft, ShoppingCart, Trash2, Send, Bed, Droplet, Utensils, Armchair, Package, AlertCircle, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useRequests } from '../contexts/RequestContext';

interface InventoryItem {
  id: string;
  location: string;
  address: string;
  product: string;
  category: string;
  available: number;
  unit: string;
  minStock: number;
  lastUpdated: string;
}

interface CartItem extends InventoryItem {
  requestedQuantity: number;
}

interface CartProps {
  items: InventoryItem[];
  onBack: () => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
}

export function Cart({ items, onBack, onRemoveItem, onClearCart }: CartProps) {
  const { addRequest } = useRequests();
  const [cartItems, setCartItems] = useState<CartItem[]>(
    items.map(item => ({ ...item, requestedQuantity: item.requestedQuantity || 1 }))
  );
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [requestNote, setRequestNote] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Update cartItems when items prop changes
  useEffect(() => {
    setCartItems(items.map(item => ({ ...item, requestedQuantity: item.requestedQuantity || 1 })));
  }, [items]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Schlafen':
        return { icon: Bed, color: 'text-purple-500' };
      case 'Hygiene':
        return { icon: Droplet, color: 'text-blue-500' };
      case 'Verpflegung':
        return { icon: Utensils, color: 'text-orange-500' };
      case 'Möbel':
        return { icon: Armchair, color: 'text-green-500' };
      default:
        return { icon: Package, color: 'text-slate-500' };
    }
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setCartItems(cartItems.map(item =>
      item.id === itemId ? { ...item, requestedQuantity: Math.max(1, quantity) } : item
    ));
  };

  const handleRemove = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
    onRemoveItem(itemId);
  };

  const handleSubmitRequest = async () => {
    // Validate that deadline is set
    if (!deadline || cartItems.length === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the request using the context
      const newRequest = addRequest(
        cartItems, // This will be converted to the proper format by RequestUtils
        {
          priority: 'Mittel', // Default priority
          deadline: deadline,
          notes: requestNote || 'Anfrage über Warenkorb eingereicht',
          requestedBy: 'Janosch Beck', // Demo name
          organisation: 'AOZ', // Demo organization
        }
      );

      // Show success state
      setSubmitSuccess(true);
      
      // Clear form after short delay
      setTimeout(() => {
        setIsSubmitDialogOpen(false);
        setSubmitSuccess(false);
        onClearCart();
        setCartItems([]);
        setRequestNote('');
        setDeadline('');
        setIsSubmitting(false);
      }, 2000);

    } catch (error) {
      console.error('Error submitting request:', error);
      setIsSubmitting(false);
      // In a real app, show error message to user
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="mb-2">Warenkorb</h1>
          <p className="text-slate-600">
            {cartItems.length} {cartItems.length === 1 ? 'Produkt' : 'Produkte'} im Warenkorb
          </p>
        </div>
        {cartItems.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClearCart}>
              Warenkorb leeren
            </Button>
            <Button onClick={() => setIsSubmitDialogOpen(true)}>
              <Send className="w-4 h-4 mr-2" />
              Anfrage senden
            </Button>
          </div>
        )}
      </div>

      {cartItems.length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-slate-500">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h2 className="mb-2">Ihr Warenkorb ist leer</h2>
            <p className="mb-6">Fügen Sie Produkte aus der Produktverwaltung hinzu</p>
            <Button onClick={onBack}>
              Zur Produktverwaltung
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produkt</TableHead>
                <TableHead>Lagerstandort</TableHead>
                <TableHead>Kategorie</TableHead>
                <TableHead>Verfügbar</TableHead>
                <TableHead>Angeforderte Menge</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItems.map((item) => {
                const { icon: CategoryIcon, color } = getCategoryIcon(item.category);
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CategoryIcon className={`w-5 h-5 ${color}`} />
                        <span className="font-semibold text-slate-900">{item.product}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">{item.location}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-600">
                        {item.available} {item.unit}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max={item.available}
                          value={item.requestedQuantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                          className="w-24"
                        />
                        <span className="text-sm text-slate-600">{item.unit}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent className="sm:max-w-[600px]" aria-describedby="submit-request-description">
          <DialogHeader>
            <DialogTitle>Anfrage senden</DialogTitle>
            <DialogDescription id="submit-request-description">
              Senden Sie Ihre Anfrage an den Krisenstab zur Überprüfung.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Zusammenfassung</Label>
              <div className="mt-2 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-2">
                  Sie fordern {cartItems.length} {cartItems.length === 1 ? 'Produkt' : 'Produkte'} an:
                </p>
                <ul className="space-y-1">
                  {cartItems.map(item => (
                    <li key={item.id} className="text-sm text-slate-700">
                      • {item.product}: {item.requestedQuantity} {item.unit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <Label htmlFor="deadline">
                Benötigt bis <span className="text-red-500">*</span>
              </Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-2"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {!deadline && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                <p className="text-sm text-yellow-800">
                  Bitte geben Sie eine Frist an, bis wann Sie die Produkte benötigen.
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="note">Notiz (optional)</Label>
              <Textarea
                id="note"
                placeholder="Zusätzliche Informationen zur Anfrage..."
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
                rows={3}
                className="mt-2"
              />
            </div>

            {submitSuccess && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-800">
                  Anfrage erfolgreich eingereicht! Sie wird nun vom Krisenstab überprüft.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsSubmitDialogOpen(false)}
                disabled={isSubmitting || submitSuccess}
              >
                Abbrechen
              </Button>
              <Button 
                onClick={handleSubmitRequest} 
                disabled={!deadline || isSubmitting || submitSuccess}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Wird eingereicht...
                  </>
                ) : submitSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Eingereicht!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Anfrage senden
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
