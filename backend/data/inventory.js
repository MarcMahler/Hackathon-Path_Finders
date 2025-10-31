// Inventory data extracted from frontend Database.tsx
// This represents the current inventory across 3 warehouse locations

const inventoryData = [
  // Zürich Hauptlager
  { id: 'INV-001', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Feldbetten', category: 'Schlafen', available: 250, unit: 'Stück', minStock: 100, lastUpdated: 'vor 2 Std.' },
  { id: 'INV-002', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Schlafsäcke', category: 'Schlafen', available: 180, unit: 'Stück', minStock: 150, lastUpdated: 'vor 2 Std.' },
  { id: 'INV-003', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Decken', category: 'Schlafen', available: 320, unit: 'Stück', minStock: 150, lastUpdated: 'vor 3 Std.' },
  { id: 'INV-004', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Kissen', category: 'Schlafen', available: 280, unit: 'Stück', minStock: 150, lastUpdated: 'vor 3 Std.' },
  { id: 'INV-005', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Hygieneset', category: 'Hygiene', available: 450, unit: 'Stück', minStock: 200, lastUpdated: 'vor 1 Std.' },
  { id: 'INV-006', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Windeln', category: 'Hygiene', available: 85, unit: 'Pakete', minStock: 100, lastUpdated: 'vor 3 Std.' },
  { id: 'INV-007', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Masken', category: 'Hygiene', available: 1200, unit: 'Stück', minStock: 500, lastUpdated: 'vor 5 Std.' },
  { id: 'INV-008', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Desinfektionsmittel', category: 'Hygiene', available: 150, unit: 'Liter', minStock: 100, lastUpdated: 'vor 4 Std.' },
  { id: 'INV-009', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Sandwiches', category: 'Verpflegung', available: 320, unit: 'Stück', minStock: 200, lastUpdated: 'vor 30 Min.' },
  { id: 'INV-010', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Trinkwasser', category: 'Verpflegung', available: 800, unit: 'Liter', minStock: 500, lastUpdated: 'vor 1 Std.' },
  { id: 'INV-011', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Warme Mahlzeiten', category: 'Verpflegung', available: 250, unit: 'Portionen', minStock: 150, lastUpdated: 'vor 2 Std.' },
  { id: 'INV-012', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Tisch', category: 'Möbel', available: 60, unit: 'Stück', minStock: 40, lastUpdated: 'vor 6 Std.' },
  { id: 'INV-013', location: 'Zürich Hauptlager', address: 'Badenerstrasse 123, 8004 Zürich', product: 'Stuhl', category: 'Möbel', available: 220, unit: 'Stück', minStock: 150, lastUpdated: 'vor 6 Std.' },
  
  // Oerlikon Depot
  { id: 'INV-014', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Feldbetten', category: 'Schlafen', available: 120, unit: 'Stück', minStock: 80, lastUpdated: 'vor 4 Std.' },
  { id: 'INV-015', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Decken', category: 'Schlafen', available: 200, unit: 'Stück', minStock: 100, lastUpdated: 'vor 4 Std.' },
  { id: 'INV-016', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Schlafsäcke', category: 'Schlafen', available: 95, unit: 'Stück', minStock: 80, lastUpdated: 'vor 5 Std.' },
  { id: 'INV-017', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Hygieneset', category: 'Hygiene', available: 65, unit: 'Stück', minStock: 80, lastUpdated: 'vor 5 Std.' },
  { id: 'INV-018', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Kinder-Hygieneset', category: 'Hygiene', available: 110, unit: 'Stück', minStock: 70, lastUpdated: 'vor 3 Std.' },
  { id: 'INV-019', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Windeln', category: 'Hygiene', available: 140, unit: 'Pakete', minStock: 100, lastUpdated: 'vor 4 Std.' },
  { id: 'INV-020', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Trinkwasser', category: 'Verpflegung', available: 500, unit: 'Liter', minStock: 300, lastUpdated: 'vor 1 Std.' },
  { id: 'INV-021', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Sandwiches', category: 'Verpflegung', available: 180, unit: 'Stück', minStock: 150, lastUpdated: 'vor 2 Std.' },
  { id: 'INV-022', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Babynahrung', category: 'Verpflegung', available: 75, unit: 'Einheiten', minStock: 60, lastUpdated: 'vor 3 Std.' },
  { id: 'INV-023', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Tisch', category: 'Möbel', available: 35, unit: 'Stück', minStock: 25, lastUpdated: 'vor 7 Std.' },
  { id: 'INV-024', location: 'Oerlikon Depot', address: 'Schaffhauserstrasse 45, 8050 Oerlikon', product: 'Stuhl', category: 'Möbel', available: 120, unit: 'Stück', minStock: 90, lastUpdated: 'vor 7 Std.' },
  
  // Altstetten Lager
  { id: 'INV-025', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Feldbetten', category: 'Schlafen', available: 80, unit: 'Stück', minStock: 100, lastUpdated: 'vor 5 Std.' },
  { id: 'INV-026', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Schlafsäcke', category: 'Schlafen', available: 140, unit: 'Stück', minStock: 100, lastUpdated: 'vor 5 Std.' },
  { id: 'INV-027', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Decken', category: 'Schlafen', available: 210, unit: 'Stück', minStock: 150, lastUpdated: 'vor 6 Std.' },
  { id: 'INV-028', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Hygieneset', category: 'Hygiene', available: 140, unit: 'Stück', minStock: 100, lastUpdated: 'vor 2 Std.' },
  { id: 'INV-029', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Windeln', category: 'Hygiene', available: 45, unit: 'Pakete', minStock: 60, lastUpdated: 'vor 3 Std.' },
  { id: 'INV-030', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Masken', category: 'Hygiene', available: 850, unit: 'Stück', minStock: 500, lastUpdated: 'vor 12 Std.' },
  { id: 'INV-031', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Desinfektionsmittel', category: 'Hygiene', available: 65, unit: 'Liter', minStock: 80, lastUpdated: 'vor 8 Std.' },
  { id: 'INV-032', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Warme Mahlzeiten', category: 'Verpflegung', available: 180, unit: 'Portionen', minStock: 150, lastUpdated: 'vor 1 Std.' },
  { id: 'INV-033', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Trinkwasser', category: 'Verpflegung', available: 420, unit: 'Liter', minStock: 400, lastUpdated: 'vor 2 Std.' },
  { id: 'INV-034', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Sandwiches', category: 'Verpflegung', available: 90, unit: 'Stück', minStock: 120, lastUpdated: 'vor 3 Std.' },
  { id: 'INV-035', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Tisch', category: 'Möbel', available: 45, unit: 'Stück', minStock: 30, lastUpdated: 'vor 6 Std.' },
  { id: 'INV-036', location: 'Altstetten Lager', address: 'Lindenstrasse 23, 8048 Altstetten', product: 'Stuhl', category: 'Möbel', available: 165, unit: 'Stück', minStock: 120, lastUpdated: 'vor 6 Std.' },
];

module.exports = inventoryData;