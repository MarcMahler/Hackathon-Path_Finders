import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { ArrowLeft, Package, MapPin, Clock, AlertCircle, CheckCircle, AlertTriangle, Bed, Droplet, Utensils, Armchair } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

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

interface ProductDetailProps {
  item: InventoryItem;
  onBack: () => void;
}

const productDetails: Record<string, {
  description: string;
  specifications: { label: string; value: string }[];
  image: string;
  procurement: {
    difficulty: 'Einfach' | 'Mittel' | 'Schwierig';
    description: string;
    leadTime: string;
    suppliers: string;
  };
  lastInspection: {
    date: string;
    inspector: string;
    condition: string;
  };
}> = {
  'Feldbetten': {
    description: 'Robuste Feldbetten für Notunterkünfte. Klappbar und leicht transportierbar. Geeignet für Erwachsene bis 120kg Körpergewicht.',
    specifications: [
      { label: 'Abmessungen', value: '190 x 65 x 42 cm (L x B x H)' },
      { label: 'Gewicht', value: '8,5 kg' },
      { label: 'Belastbarkeit', value: 'bis 120 kg' },
      { label: 'Material', value: 'Aluminium-Gestell, Polyester-Gewebe' },
      { label: 'Verpackung', value: 'Tragetasche, 10 Stück/Palette (Palette EU-Norm 120x80cm)' },
    ],
    image: '/bett.png',
    procurement: {
      difficulty: 'Mittel',
      description: 'Abholung: Zürich Hauptlager, Badenerstrasse 123, 8004 Zürich\n\nÖffnungszeiten: Mo-Fr 7:30-17:00, Sa 9:00-12:00\n\nZugänglichkeit: LKW-Zufahrt vorhanden, Laderampe, Gabelstapler verfügbar. Anmeldung 24h im Voraus erforderlich.\n\nKontakt: Thomas Meier, Tel: 044 123 45 67, Email: meier@resilio-zh.ch\n\nHinweis: Palettenweise Ausgabe, Mindestabnahme 1 Palette (10 Stück)',
      leadTime: '2-4 Wochen',
      suppliers: 'Zivilschutz-Beschaffung, Katastrophenschutz Zürich, diverse Online-Händler',
    },
    lastInspection: {
      date: '15. Oktober 2025',
      inspector: 'M. Schmidt (Zivilschutz)',
      condition: 'Einwandfrei - alle Betten funktionsfähig',
    },
  },
  'Schlafsäcke': {
    description: 'Winterfeste Schlafsäcke für Temperaturen bis -10°C. Mit Kompressionsbeutel für platzsparende Lagerung.',
    specifications: [
      { label: 'Abmessungen', value: '220 x 80 cm' },
      { label: 'Gewicht', value: '1,8 kg' },
      { label: 'Temperaturbereich', value: '-10°C bis +15°C (Komfort)' },
      { label: 'Material', value: 'Polyester-Füllung, Nylon-Außenhülle' },
      { label: 'Verpackung', value: 'Kompressionsbeutel, 20 Stück/Karton (Karton 60x40x40cm)' },
    ],
    image: '/schlafsack.png',
    procurement: {
      difficulty: 'Einfach',
      description: 'Abholung: Oerlikon Depot, Schaffhauserstrasse 45, 8050 Oerlikon\n\nÖffnungszeiten: Mo-Fr 8:00-18:00, Sa 10:00-14:00\n\nZugänglichkeit: Begrenzte LKW-Zufahrt (max. 7.5t), enge Zufahrtsstraße. PKW und Transporter problemlos möglich.\n\nKontakt: Sandra Keller, Tel: 044 234 56 78, Email: keller@resilio-zh.ch\n\nHinweis: Selbstabholung bevorzugt, Lieferung bei größeren Mengen nach Absprache möglich',
      leadTime: '3-7 Tage',
      suppliers: 'Outdoor-Fachhändler, Online-Shops, THW-Beschaffung',
    },
    lastInspection: {
      date: '20. Oktober 2025',
      inspector: 'L. Müller (Lagerleitung)',
      condition: 'Gut - vereinzelt kleinere Verschmutzungen',
    },
  },
  'Decken': {
    description: 'Warme Wolldecken für Notunterkünfte. Waschbar bei 60°C, flammhemmend behandelt.',
    specifications: [
      { label: 'Abmessungen', value: '200 x 150 cm' },
      { label: 'Gewicht', value: '1,2 kg' },
      { label: 'Material', value: '70% Wolle, 30% Polyester' },
      { label: 'Eigenschaften', value: 'Flammhemmend, waschbar 60°C' },
      { label: 'Verpackung', value: '20 Stück/Karton (Karton 80x60x40cm)' },
    ],
    image: '',
    procurement: {
      difficulty: 'Einfach',
      description: 'Abholung: Zürich Hauptlager, Badenerstrasse 123, 8004 Zürich\n\nÖffnungszeiten: Mo-Fr 7:30-17:00, Sa 9:00-12:00\n\nZugänglichkeit: LKW-Zufahrt vorhanden, Laderampe. Großmengen problemlos möglich.\n\nKontakt: Klaus Weber, Tel: 044 123 45 70, Email: weber@resilio-zh.ch\n\nHinweis: Kartonweise Ausgabe, bei Bedarf auch einzelne Decken verfügbar',
      leadTime: '1-2 Wochen',
      suppliers: 'Textilgroßhandel, Katastrophenschutz-Lieferanten',
    },
    lastInspection: {
      date: '18. Oktober 2025',
      inspector: 'K. Weber (Lagerleitung)',
      condition: 'Sehr gut - alle Decken gereinigt und einsatzbereit',
    },
  },
  'Necessair Unisex': {
    description: 'Komplettes Hygiene-Set mit Grundausstattung für 3-5 Tage. Enthält Zahnbürste, Zahnpasta, Seife, Shampoo, Kamm, Handtuch.',
    specifications: [
      { label: 'Inhalt', value: 'Zahnbürste, Zahnpasta (75ml), Seife, Shampoo (100ml), Kamm, Handtuch' },
      { label: 'Abmessungen', value: '25 x 15 x 8 cm' },
      { label: 'Gewicht', value: '450 g' },
      { label: 'Material Tasche', value: 'Wasserabweisendes Nylon' },
      { label: 'Verpackung', value: '50 Stück/Karton (Karton 60x40x50cm)' },
    ],
    image: '',
    procurement: {
      difficulty: 'Einfach',
      description: 'Abholung: Altstetten Lager, Lindenstrasse 23, 8048 Altstetten\n\nÖffnungszeiten: Mo-Fr 9:00-16:00\n\nZugänglichkeit: Keine LKW-Zufahrt, nur PKW/Transporter. Parkplätze direkt vor dem Gebäude.\n\nKontakt: Sarah Fischer, Tel: 044 345 67 89, Email: fischer@resilio-zh.ch\n\nHinweis: Sets sind vorkonfektioniert und versiegelt, keine Einzelentnahme möglich',
      leadTime: '1-2 Wochen',
      suppliers: 'Hygiene-Großhändler, DRK, Malteser',
    },
    lastInspection: {
      date: '25. Oktober 2025',
      inspector: 'S. Fischer (Hygiene-Beauftragter)',
      condition: 'Einwandfrei - alle Sets vollständig und verschlossen',
    },
  },
  'Windeln (Baby)': {
    description: 'Einwegwindeln für Babys und Kleinkinder. Größe 3 (6-10 kg). Atmungsaktiv und hautfreundlich.',
    specifications: [
      { label: 'Größe', value: 'Größe 3 (6-10 kg)' },
      { label: 'Menge pro Paket', value: '50 Stück' },
      { label: 'Material', value: 'Zellstoff, Superabsorber, Vliesstoff' },
      { label: 'Eigenschaften', value: 'Atmungsaktiv, hautfreundlich, dermatologisch getestet' },
      { label: 'Verpackung', value: '6 Pakete/Karton (Karton 50x40x35cm)' },
    ],
    image: '',
    procurement: {
      difficulty: 'Einfach',
      description: 'Abholung: Oerlikon Depot, Schaffhauserstrasse 45, 8050 Oerlikon\n\nÖffnungszeiten: Mo-Fr 8:00-18:00, Sa 10:00-14:00\n\nZugänglichkeit: Begrenzte LKW-Zufahrt (max. 7.5t), enge Zufahrtsstraße. Entladung im Hof möglich.\n\nKontakt: Anna Becker, Tel: 044 234 56 80, Email: becker@resilio-zh.ch\n\nHinweis: Kartonweise Ausgabe (6 Pakete), verschiedene Größen auf Anfrage verfügbar',
      leadTime: '3-5 Tage',
      suppliers: 'Drogeriemärkte (dm, Rossmann), Großhändler, Hersteller',
    },
    lastInspection: {
      date: '28. Oktober 2025',
      inspector: 'A. Becker (Lagerleitung)',
      condition: 'Gut - Haltbarkeit bis 2027',
    },
  },
  'Sandwiches': {
    description: 'Frische, verzehrfertige Sandwiches mit verschiedenen Belägen. Gekühlt gelagert, Haltbarkeit 3 Tage.',
    specifications: [
      { label: 'Varianten', value: 'Käse, Schinken, Vegetarisch' },
      { label: 'Gewicht', value: 'ca. 150 g pro Sandwich' },
      { label: 'Lagerung', value: 'Gekühlt bei 2-7°C' },
      { label: 'Haltbarkeit', value: '3 Tage ab Produktion' },
      { label: 'Verpackung', value: 'Einzeln verpackt, 12 Stück/Karton (Karton 40x30x15cm)' },
    ],
    image: '',
    procurement: {
      difficulty: 'Mittel',
      description: 'Abholung: Zürich Hauptlager, Badenerstrasse 123, 8004 Zürich (Kühlraum)\n\nÖffnungszeiten: Täglich 6:00-10:00 (Frischware)\n\nZugänglichkeit: LKW-Zufahrt vorhanden, Kühlkette muss gewährleistet sein. Kühlboxen erforderlich.\n\nKontakt: Peter Richter, Tel: 044 123 45 75, Email: richter@resilio-zh.ch\n\nHinweis: Bestellung bis 16:00 Uhr Vortag, Mindestabnahme 12 Stück. Verschiedene Varianten verfügbar.',
      leadTime: '1-2 Tage (täglich)',
      suppliers: 'Lokale Bäckereien, Catering-Services, Großküchen',
    },
    lastInspection: {
      date: '30. Oktober 2025 (täglich)',
      inspector: 'P. Richter (Verpflegung)',
      condition: 'Frisch - Temperatur korrekt, Qualität einwandfrei',
    },
  },
  'Trinkwasser': {
    description: 'Abgefülltes Trinkwasser in 1,5L PET-Flaschen. Mineralarm, für alle Altersgruppen geeignet.',
    specifications: [
      { label: 'Gebindegröße', value: '1,5 Liter PET-Flasche' },
      { label: 'Typ', value: 'Mineralarm, stilles Wasser' },
      { label: 'Lagerung', value: 'Kühl und trocken, vor Sonnenlicht geschützt' },
      { label: 'Haltbarkeit', value: '12 Monate ab Abfüllung' },
      { label: 'Verpackung', value: '6 Flaschen/Träger, 72 Flaschen/Palette (Palette EU-Norm 120x80cm)' },
    ],
    image: '',
    procurement: {
      difficulty: 'Einfach',
      description: 'Abholung: Zürich Hauptlager, Badenerstrasse 123, 8004 Zürich\n\nÖffnungszeiten: Mo-Fr 7:30-17:00, Sa 9:00-12:00\n\nZugänglichkeit: LKW-Zufahrt vorhanden, Laderampe. Palettenausgabe mit Gabelstapler.\n\nKontakt: Tanja Klein, Tel: 044 123 45 72, Email: klein@resilio-zh.ch\n\nHinweis: Palettenweise Ausgabe (72 Flaschen), sehr hohe Verfügbarkeit. Bei Großbestellungen (>10 Paletten) 48h Vorlauf.',
      leadTime: '1-3 Tage',
      suppliers: 'Getränkegroßhändler, Supermärkte, Hersteller',
    },
    lastInspection: {
      date: '27. Oktober 2025',
      inspector: 'T. Klein (Lagerleitung)',
      condition: 'Einwandfrei - Haltbarkeit bis 2026',
    },
  },
  'Wohnung Familie (4 Pers.)': {
    description: 'Vollständig möblierte 3-Zimmer-Wohnung für Familien mit bis zu 4 Personen. Küche, Bad, Wohnzimmer, 2 Schlafzimmer.',
    specifications: [
      { label: 'Wohnfläche', value: '65-75 m²' },
      { label: 'Zimmer', value: '3 Zimmer (Wohnzimmer, 2 Schlafzimmer)' },
      { label: 'Ausstattung', value: 'Komplett möbliert, Küche, Bad' },
      { label: 'Kapazität', value: '4 Personen' },
      { label: 'Lage', value: 'Verschiedene Standorte in Starnberg' },
    ],
    image: '',
    procurement: {
      difficulty: 'Schwierig',
      description: 'Koordination: Resilio Immobilien-Service, Sihlquai 131, 8005 Zürich\n\nÖffnungszeiten: Mo-Fr 9:00-17:00 (nur nach Terminvereinbarung)\n\nZugänglichkeit: Büro im 3. Stock, kein Aufzug. Wohnungen an verschiedenen Standorten.\n\nKontakt: Robert Hoffmann, Tel: 044 456 78 90, Email: hoffmann@resilio-immobilien.ch\n\nHinweis: Besichtigung erforderlich, Schlüsselübergabe nach Vertragsabschluss. Mindestmietdauer 3 Monate.',
      leadTime: '4-8 Wochen',
      suppliers: 'Städtische Wohnungsbaugesellschaften, Private Vermieter, Landratsamt',
    },
    lastInspection: {
      date: '10. Oktober 2025',
      inspector: 'R. Hoffmann (Immobilien-Koordinator)',
      condition: 'Gut - alle Wohnungen bezugsfertig und geprüft',
    },
  },
  'Warme Mahlzeiten': {
    description: 'Frisch zubereitete warme Mahlzeiten aus Großküche. Vegetarische und nicht-vegetarische Optionen.',
    specifications: [
      { label: 'Portionsgröße', value: 'ca. 400-500 g' },
      { label: 'Varianten', value: 'Vegetarisch, Fleisch, Vegan (auf Anfrage)' },
      { label: 'Lagerung', value: 'Warmhaltung bei mind. 65°C' },
      { label: 'Verzehr', value: 'Innerhalb 2-3 Stunden nach Zubereitung' },
      { label: 'Verpackung', value: 'Einweg-Warmhaltebehälter' },
    ],
    image: '',
    procurement: {
      difficulty: 'Mittel',
      description: 'Abholung: Altstetten Lager, Lindenstrasse 23, 8048 Altstetten (Ausgabestelle Verpflegung)\n\nÖffnungszeiten: Täglich 11:00-13:00 und 17:00-19:00\n\nZugänglichkeit: Keine LKW-Zufahrt, nur PKW/Transporter. Warmhaltung vor Ort möglich.\n\nKontakt: Maria Schulze, Tel: 044 345 67 92, Email: schulze@resilio-zh.ch\n\nHinweis: Bestellung bis 9:00 Uhr am gleichen Tag, Mindestabnahme 20 Portionen. Eigene Warmhaltebehälter von Vorteil.',
      leadTime: '1 Tag (täglich)',
      suppliers: 'Städtische Großküchen, Catering-Services, Hilfsorganisationen',
    },
    lastInspection: {
      date: '30. Oktober 2025 (täglich)',
      inspector: 'M. Schulze (Verpflegungsleitung)',
      condition: 'Frisch - Temperatur und Qualität geprüft',
    },
  },
  'Medizinische Masken': {
    description: 'Medizinische Einweg-Gesichtsmasken (OP-Masken) Typ II. 3-lagig, mit Nasenbügel und Ohrschlaufen.',
    specifications: [
      { label: 'Typ', value: 'Medizinische Gesichtsmaske Typ II' },
      { label: 'Aufbau', value: '3-lagig (Vliesstoff)' },
      { label: 'Eigenschaften', value: 'Nasenbügel, elastische Ohrschlaufen' },
      { label: 'Zertifizierung', value: 'CE-zertifiziert nach EN 14683' },
      { label: 'Verpackung', value: '50 Stück/Box, 2000 Stück/Karton (Karton 60x40x30cm)' },
    ],
    image: '',
    procurement: {
      difficulty: 'Einfach',
      description: 'Abholung: Zürich Hauptlager, Badenerstrasse 123, 8004 Zürich (Medizinlager)\n\nÖffnungszeiten: Mo-Fr 8:00-17:00\n\nZugänglichkeit: Separater Eingang für medizinische Güter, LKW-Zufahrt vorhanden. Laderampe verfügbar.\n\nKontakt: Dr. Julia Werner, Tel: 044 123 45 85, Email: werner@resilio-zh.ch\n\nHinweis: Kartonweise Ausgabe (2000 Stück), CE-Zertifikat wird mitgeliefert. Sehr hohe Verfügbarkeit.',
      leadTime: '3-7 Tage',
      suppliers: 'Medizinische Großhändler, Apotheken-Großhandel, Hersteller',
    },
    lastInspection: {
      date: '22. Oktober 2025',
      inspector: 'Dr. J. Werner (Gesundheitsamt)',
      condition: 'Einwandfrei - Haltbarkeit bis 2028, CE-konform',
    },
  },
  'Hygiene-Sets Kinder': {
    description: 'Spezielles Hygiene-Set für Kinder. Enthält kindgerechte Hygieneartikel und kleine Spielzeuge zur Ablenkung.',
    specifications: [
      { label: 'Inhalt', value: 'Zahnbürste (Kinder), Zahnpasta, Seife, Shampoo, Kamm, Handtuch, kleines Spielzeug' },
      { label: 'Altersgruppe', value: '3-12 Jahre' },
      { label: 'Abmessungen', value: '20 x 12 x 6 cm' },
      { label: 'Material Tasche', value: 'Buntes, wasserabweisendes Nylon' },
      { label: 'Verpackung', value: '40 Stück/Karton (Karton 50x35x40cm)' },
    ],
    image: '',
    procurement: {
      difficulty: 'Mittel',
      description: 'Abholung: Altstetten Lager, Lindenstrasse 23, 8048 Altstetten\n\nÖffnungszeiten: Mo-Fr 9:00-16:00\n\nZugänglichkeit: Keine LKW-Zufahrt, nur PKW/Transporter. Parkplätze direkt vor dem Gebäude.\n\nKontakt: Lisa Zimmermann, Tel: 044 345 67 93, Email: zimmermann@resilio-zh.ch\n\nHinweis: Sets müssen 2 Wochen im Voraus bestellt werden. Altersgerechte Zusammenstellung, Spielzeug geprüft.',
      leadTime: '2-3 Wochen',
      suppliers: 'Hilfsorganisationen (DRK, UNICEF), spezialisierte Anbieter',
    },
    lastInspection: {
      date: '24. Oktober 2025',
      inspector: 'L. Zimmermann (Sozialarbeit)',
      condition: 'Gut - alle Sets vollständig, Spielzeug kindersicher',
    },
  },
  'Desinfektionsmittel': {
    description: 'Händedesinfektionsmittel auf Alkoholbasis. Viruzid, bakterizid und fungizid. Für hygienische und chirurgische Händedesinfektion.',
    specifications: [
      { label: 'Gebindegröße', value: '1 Liter Flasche' },
      { label: 'Wirkstoff', value: 'Ethanol 70% (v/v)' },
      { label: 'Wirkspektrum', value: 'Viruzid, bakterizid, fungizid' },
      { label: 'Einwirkzeit', value: '30 Sekunden' },
      { label: 'Verpackung', value: '12 Flaschen/Karton (Karton 40x30x30cm)' },
    ],
    image: '',
    procurement: {
      difficulty: 'Einfach',
      description: 'Abholung: Zürich Hauptlager, Badenerstrasse 123, 8004 Zürich (Medizinlager)\n\nÖffnungszeiten: Mo-Fr 8:00-17:00\n\nZugänglichkeit: Separater Eingang für medizinische Güter, LKW-Zufahrt vorhanden.\n\nKontakt: Dr. Michael Bauer, Tel: 044 123 45 88, Email: bauer@resilio-zh.ch\n\nHinweis: Kartonweise Ausgabe (12 Flaschen), Sicherheitsdatenblatt wird mitgeliefert. Gefahrguttransport beachten.',
      leadTime: '3-7 Tage',
      suppliers: 'Medizinische Großhändler, Apotheken-Großhandel, Hersteller',
    },
    lastInspection: {
      date: '26. Oktober 2025',
      inspector: 'Dr. M. Bauer (Hygiene)',
      condition: 'Einwandfrei - Haltbarkeit bis 2027, verschlossen',
    },
  },
};

export function ProductDetail({ item, onBack }: ProductDetailProps) {
  const details = productDetails[item.product] || {
    description: 'Keine detaillierten Informationen verfügbar.',
    specifications: [],
    image: '',
    procurement: {
      difficulty: 'Mittel' as const,
      description: 'Keine Informationen verfügbar.',
      leadTime: 'N/A',
      suppliers: 'N/A',
    },
    lastInspection: {
      date: 'N/A',
      inspector: 'N/A',
      condition: 'N/A',
    },
  };

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

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Einfach':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 gap-2">
            <CheckCircle className="w-4 h-4" />
            Einfach
          </Badge>
        );
      case 'Mittel':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 gap-2">
            <AlertCircle className="w-4 h-4" />
            Mittel
          </Badge>
        );
      case 'Schwierig':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 gap-2">
            <AlertTriangle className="w-4 h-4" />
            Schwierig
          </Badge>
        );
      default:
        return <Badge variant="outline">{difficulty}</Badge>;
    }
  };

  const getStockStatus = (available: number, minStock: number) => {
    const percentage = (available / minStock) * 100;
    if (percentage >= 100) return 'good';
    if (percentage >= 50) return 'low';
    return 'critical';
  };

  const getStockBadge = (available: number, minStock: number) => {
    const status = getStockStatus(available, minStock);
    if (status === 'good') {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verfügbar</Badge>;
    }
    if (status === 'low') {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Niedrig</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Kritisch</Badge>;
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
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {(() => {
                const { icon: CategoryIcon, color } = getCategoryIcon(item.category);
                return <CategoryIcon className={`w-6 h-6 ${color}`} />;
              })()}
              <h1>{item.product}</h1>
              <Badge variant="outline">{item.category}</Badge>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4" />
              <span>{item.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Produktbild */}
        <Card className="lg:col-span-1 p-6">
          <h1 className="mb-4 text-3xl font-bold">{item.product}</h1>
          <div className="aspect-square rounded-lg overflow-hidden bg-slate-100">
            {details.image ? (
              <img 
                src={details.image} 
                alt={item.product}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {(() => {
                  const { icon: CategoryIcon, color } = getCategoryIcon(item.category);
                  return <CategoryIcon className={`w-16 h-16 ${color.replace('text-', 'text-slate-300')}`} />;
                })()}
              </div>
            )}
          </div>
        </Card>

        {/* Produktbeschreibung & Spezifikationen */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="mb-4">Produktbeschreibung</h2>
          <p className="text-slate-700 mb-6">{details.description}</p>

          <h3 className="mb-3">Technische Spezifikationen</h3>
          <div className="space-y-3">
            {details.specifications.map((spec, index) => (
              <div key={index} className="flex border-b border-slate-200 pb-2">
                <span className="text-slate-600 min-w-[180px]">{spec.label}:</span>
                <span className="text-slate-900">{spec.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Bestandsinformationen */}
        <Card className="lg:col-span-1 p-6">
          <h2 className="mb-4">Bestandsinformationen</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-600">Aktueller Bestand</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-2xl cursor-help">{item.available} {item.unit}</p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mindestbestand: {item.minStock} {item.unit}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div>
              <Label className="text-slate-600">Status</Label>
              <div className="mt-1">
                {getStockBadge(item.available, item.minStock)}
              </div>
            </div>
          </div>
        </Card>

        {/* Beschaffung */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="mb-4">Beschaffung</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-600">Beschreibung</Label>
              <p className="text-slate-700 mt-1">{details.procurement.description}</p>
            </div>
          </div>
        </Card>

        {/* Letzte Inspektion */}
        <Card className="lg:col-span-3 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-slate-500" />
            <h2>Letzte Inspektion</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-slate-600">Datum</Label>
              <p className="text-slate-900">{details.lastInspection.date}</p>
            </div>
            <div>
              <Label className="text-slate-600">Prüfer</Label>
              <p className="text-slate-900">{details.lastInspection.inspector}</p>
            </div>
            <div>
              <Label className="text-slate-600">Zustand</Label>
              <p className="text-slate-900">{details.lastInspection.condition}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
