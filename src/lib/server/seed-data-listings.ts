export type Listing = {
  id: string;
  title: string;
  city: string;
  neighborhood: string;
  priceSEK: number;
  bedrooms: number;
  bathrooms: number;
  livingAreaSqm: number;
  yearBuilt: number;
  description: string;
  imageUrl: string;
  listedBy: string; // username (string)
  createdAt: string;
};

export const SEED_LISTINGS: Listing[] = [
  {
    id: 'l-001',
    title: 'Modern Scandinavian Villa in Saltsjöbaden',
    city: 'Stockholm',
    neighborhood: 'Saltsjöbaden',
    priceSEK: 18_900_000,
    bedrooms: 5,
    bathrooms: 3,
    livingAreaSqm: 220,
    yearBuilt: 2021,
    description: 'A striking architect-designed villa with black metal roof, large picture windows, and a sun-drenched south-facing garden surrounded by birch forest.',
    imageUrl: '/images/houses/house-01.jpg',
    listedBy: 'seed',
    createdAt: '2026-04-12T09:30:00.000Z'
  },
  {
    id: 'l-002',
    title: 'Classic Falu Red Cottage in Dalarna',
    city: 'Mora',
    neighborhood: 'Tällberg',
    priceSEK: 4_250_000,
    bedrooms: 3,
    bathrooms: 1,
    livingAreaSqm: 105,
    yearBuilt: 1924,
    description: 'A storybook Dalarna cottage with original Falu red paint and white trim. Spruce forest behind, snowmobile track nearby. Tile stove still in use.',
    imageUrl: '/images/houses/house-02.jpg',
    listedBy: 'seed',
    createdAt: '2026-04-18T11:15:00.000Z'
  },
  {
    id: 'l-003',
    title: 'Glass A-Frame Cabin by the Lake',
    city: 'Östersund',
    neighborhood: 'Frösön',
    priceSEK: 7_950_000,
    bedrooms: 2,
    bathrooms: 1,
    livingAreaSqm: 88,
    yearBuilt: 2019,
    description: 'Dramatic A-frame with floor-to-ceiling glass overlooking a private cove. Wood stove, sauna, and private jetty included. Year-round road access.',
    imageUrl: '/images/houses/house-03.jpg',
    listedBy: 'seed',
    createdAt: '2026-04-22T14:00:00.000Z'
  },
  {
    id: 'l-004',
    title: 'Sekelskifte Apartment, Östermalm',
    city: 'Stockholm',
    neighborhood: 'Östermalm',
    priceSEK: 14_500_000,
    bedrooms: 4,
    bathrooms: 2,
    livingAreaSqm: 142,
    yearBuilt: 1903,
    description: 'Beautifully restored turn-of-the-century apartment with original parquet, stucco ceilings, and tile stoves. Two French balconies overlooking a quiet courtyard.',
    imageUrl: '/images/houses/house-04.jpg',
    listedBy: 'seed',
    createdAt: '2026-05-01T10:00:00.000Z'
  },
  {
    id: 'l-005',
    title: 'Architect Townhouse, Solna Park',
    city: 'Stockholm',
    neighborhood: 'Solna',
    priceSEK: 11_200_000,
    bedrooms: 4,
    bathrooms: 2,
    livingAreaSqm: 168,
    yearBuilt: 2022,
    description: 'Newly completed townhouse with raw concrete and pale oak facade, private roof terrace, and underfloor heating throughout. Walking distance to Hagaparken.',
    imageUrl: '/images/houses/house-05.jpg',
    listedBy: 'seed',
    createdAt: '2026-05-04T13:20:00.000Z'
  },
  {
    id: 'l-006',
    title: 'Summer House on the Archipelago',
    city: 'Värmdö',
    neighborhood: 'Sandhamn',
    priceSEK: 9_400_000,
    bedrooms: 3,
    bathrooms: 1,
    livingAreaSqm: 96,
    yearBuilt: 1968,
    description: 'Cherished family summer house with deep-water dock, sailboat mooring, and rebuilt cedar deck. Sleeps six. Includes guest cabin and outdoor shower.',
    imageUrl: '/images/houses/house-06.jpg',
    listedBy: 'seed',
    createdAt: '2026-05-08T08:45:00.000Z'
  },
  {
    id: 'l-007',
    title: 'Fjord-View Glass House',
    city: 'Bergen',
    neighborhood: 'Hardanger',
    priceSEK: 16_700_000,
    bedrooms: 3,
    bathrooms: 2,
    livingAreaSqm: 134,
    yearBuilt: 2020,
    description: 'Award-winning cliffside residence cantilevered over the fjord. Triple-glazed Schüco facade, sedum green roof, and outdoor fire pit. Helicopter pad on plot.',
    imageUrl: '/images/houses/house-07.jpg',
    listedBy: 'seed',
    createdAt: '2026-05-11T16:30:00.000Z'
  },
  {
    id: 'l-008',
    title: 'Art Nouveau Residence, Linnéstaden',
    city: 'Göteborg',
    neighborhood: 'Haga',
    priceSEK: 8_300_000,
    bedrooms: 3,
    bathrooms: 2,
    livingAreaSqm: 118,
    yearBuilt: 1907,
    description: 'Generous Jugend apartment on the second floor of a red brick landshövdingehus. Stained glass details, kakelugn, and pantry. Bike storage in cellar.',
    imageUrl: '/images/houses/house-08.jpg',
    listedBy: 'seed',
    createdAt: '2026-05-15T09:10:00.000Z'
  },
  {
    id: 'l-009',
    title: 'Coastal Bungalow with Infinity Pool',
    city: 'Skagen',
    neighborhood: 'Old Town',
    priceSEK: 22_400_000,
    bedrooms: 4,
    bathrooms: 3,
    livingAreaSqm: 245,
    yearBuilt: 2023,
    description: 'Mediterranean-feel Danish bungalow with concrete and cedar facade, full-width sliding glass doors, infinity pool, and direct sea view. Smart home throughout.',
    imageUrl: '/images/houses/house-09.jpg',
    listedBy: 'seed',
    createdAt: '2026-05-19T18:00:00.000Z'
  },
  {
    id: 'l-010',
    title: 'Countryside Farmhouse with Stable',
    city: 'Uppsala',
    neighborhood: 'Vänge',
    priceSEK: 6_800_000,
    bedrooms: 5,
    bathrooms: 2,
    livingAreaSqm: 195,
    yearBuilt: 1872,
    description: 'Working farmhouse with weathered grey timber siding, fully restored interior, large barn with three boxes, and 4 hectares of pasture. Horses optional.',
    imageUrl: '/images/houses/house-10.jpg',
    listedBy: 'seed',
    createdAt: '2026-05-23T07:40:00.000Z'
  }
];
