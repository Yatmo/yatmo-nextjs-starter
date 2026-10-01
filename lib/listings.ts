// Stand-in for your listings API or database. Three flats in Belgium (the country of the Yatmo key).
export interface Listing {
  id: string;
  title: string;
  city: string;
  price: number;
  surface: number;
  bedrooms: number;
  epc: string;
  description: string;
  latitude: number;
  longitude: number;
  /** Hide the exact address on the public page (circle instead of a pin, no street in the text titles). */
  discreet: boolean;
}

export const listings: Listing[] = [
  {
    id: 'rue-de-la-loi-16',
    title: 'Bright 2-bedroom flat near the European quarter',
    city: 'Brussels',
    price: 395000,
    surface: 92,
    bedrooms: 2,
    epc: 'B',
    description:
      'Second floor, south-facing living room, fully equipped kitchen, two bedrooms, cellar and bicycle storage. Free of occupation.',
    latitude: 50.8461,
    longitude: 4.3664,
    discreet: false,
  },
  {
    id: 'zuid-antwerp-loft',
    title: 'Loft with terrace in Antwerp South',
    city: 'Antwerp',
    price: 520000,
    surface: 135,
    bedrooms: 2,
    epc: 'A',
    description: 'Top-floor loft in a converted warehouse: 4 m ceilings, 30 m² terrace, parking space included.',
    latitude: 51.2065,
    longitude: 4.3942,
    discreet: true,
  },
  {
    id: 'ghent-patershol-house',
    title: 'Renovated townhouse in the Patershol',
    city: 'Ghent',
    price: 685000,
    surface: 180,
    bedrooms: 4,
    epc: 'B',
    description: 'A 17th-century facade, a 2021 renovation: four bedrooms, office, garden, two minutes from the Gravensteen.',
    latitude: 51.0577,
    longitude: 3.7215,
    discreet: false,
  },
];

export function getListing(id: string): Listing | undefined {
  return listings.find((l) => l.id === id);
}

export const formatPrice = (price: number) => new Intl.NumberFormat('en-BE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
