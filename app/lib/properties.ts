export interface Property {
  id: string
  slug: string
  name: string
  location: string
  state: string
  type: 'Beach' | 'Desert' | 'Mountain'
  emoji: string
  bedrooms: number
  bathrooms: number
  sleepsMin: number
  sleepsMax: number
  pricePerNight: number
  description: string
  shortDesc: string
  amenities: string[]
  imageUrl: string
  ownerrezUrl: string
  highlights: string[]
  photos: string[]
}

export const properties: Property[] = [
  {
    id: 'casa-grande',
    slug: 'casa-grande',
    name: 'Casa Grandè',
    location: 'Clearwater',
    state: 'FL',
    type: 'Beach',
    emoji: '🌊',
    bedrooms: 5,
    bathrooms: 3,
    sleepsMin: 10,
    sleepsMax: 16,
    pricePerNight: 1751,
    description: 'White-sand beaches, turquoise waters, and fiery sunsets await when you stay at this stunning 5-bedroom, 3-bathroom vacation rental in Clearwater. The home greets guests with a sleek interior packed with modern decor and high-end amenities. Easily host family gatherings between the kitchen, dining areas, and living room thanks to the breezy open floor plan.',
    shortDesc: 'White-sand beaches, turquoise waters & fiery sunsets. Private pool, steps from Pier 60.',
    amenities: ['Private Pool', 'Pet Friendly', 'WiFi', 'Near Ocean', 'Modern Kitchen', 'Outdoor Dining'],
    imageUrl: 'https://uc.orez.io/i/d9fccbcf4d134005b4a23f9add34764f-Medium',
    ownerrezUrl: 'https://www.fabvacayvibes.com/casa-grand%c3%a8-orp5b613a7x',
    highlights: ['Walk to Pier 60', 'Clearwater Marine Aquarium nearby', 'BayCare Ballpark — Spring Training'],
    photos: [
    '/images/casa-grande/01-001_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/02-002_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/03-005_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/04-006_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/05-003_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/06-004_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/07-007_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/08-008_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/09-009_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/10-010_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/11-011_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/12-012_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/13-013_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/14-014_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/15-015_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/16-016_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/17-017_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/18-018_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/19-019_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/20-020_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/21-021_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/22-022_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/23-023_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/24-024_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/25-025_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/26-026_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/27-027_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/28-028_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/29-029_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/30-030_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/31-031_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/32-032_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/33-033_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/34-034_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/35-035_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/36-036_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/37-037_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/38-038_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/39-039_18 Maywood Ave_by_Johnruzphoto.com.jpg',
    '/images/casa-grande/40-040_18 Maywood Ave_by_Johnruzphoto.com.jpg'
  ],
  },
  {
    id: 'owl-and-hare',
    slug: 'owl-and-hare',
    name: 'Owl & Hare',
    location: 'Joshua Tree',
    state: 'CA',
    type: 'Desert',
    emoji: '🏜️',
    bedrooms: 4,
    bathrooms: 4,
    sleepsMin: 7,
    sleepsMax: 10,
    pricePerNight: 3218,
    description: 'Owl & Hare is a 4-bed wellness retreat fitted with a pool, hot tub & vintage Airstream perched in the Joshua Tree Highlands overlooking the park entrance. Comprised of 2 stand-alone homes, the property is perfect for couples, families, or any group wanting to be together in a serene compound.',
    shortDesc: 'Wellness retreat in the Joshua Tree Highlands. Pool, hot tub & vintage Airstream with park views.',
    amenities: ['Private Pool', 'Hot Tub', 'Vintage Airstream', 'Pet Friendly', 'WiFi', 'Fire Pit', 'Mountain Views', 'Desert Views'],
    imageUrl: 'https://uc.orez.io/i/e52465e2ecfc4e90ac7a4d1cf90d6867-Medium',
    ownerrezUrl: 'https://www.fabvacayvibes.com/owl-hare-orp5b6e904x',
    highlights: ['5 min to Joshua Tree NP', '5 min to Downtown JT', "25 min to Pappy & Harriet's"],
    photos: [],
  },
  {
    id: 'sierra-crest-haven',
    slug: 'sierra-crest-haven',
    name: 'Sierra Crest Haven',
    location: 'Oakhurst',
    state: 'CA',
    type: 'Mountain',
    emoji: '🏔️',
    bedrooms: 7,
    bathrooms: 3,
    sleepsMin: 12,
    sleepsMax: 16,
    pricePerNight: 4075,
    description: "Nestled on a premier ridge in Oakhurst, Sierra Crest Haven is a sprawling 4,700 sq. ft. private estate designed for those who seek both adventure and absolute relaxation. This 7-bedroom home offers a rare 'dual-view' experience: start your morning watching the sunrise over the high Sierra peaks and end your day with the sunset over the valley.",
    shortDesc: '4,700 sq ft mountain estate on a premier ridge. Dual sunrise & sunset views over the High Sierra.',
    amenities: ['Hot Tub', 'Fireplace', 'Mountain Views', 'Forest Setting', 'WiFi', 'Accessible', 'Multiple Living Areas'],
    imageUrl: 'https://uc.orez.io/i/7975782670be426bbcb386e4d1a002f6-Medium',
    ownerrezUrl: 'https://www.fabvacayvibes.com/sierra-crest-haven-orp5b74fbax',
    highlights: ['Dual sunrise & sunset views', 'Near Yosemite', '4,700 sq ft estate'],
    photos: [],
  },
]
