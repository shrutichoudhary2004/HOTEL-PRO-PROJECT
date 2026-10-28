// Embedded Luxury Suite Data & State for Seamless Cloud / Vercel Deployments
export const initialRooms = [
  {
    _id: 'room_1',
    id: 'room_1',
    roomNumber: '101',
    title: 'Deluxe Garden View King',
    type: 'Deluxe',
    floor: 1,
    pricePerNight: 240,
    capacity: { adults: 2, children: 1 },
    bedType: 'King Bed',
    sizeSqFt: 420,
    description: 'Immerse yourself in lush botanical surroundings. Features an artisanal espresso bar, private teak balcony, and spa bath.',
    amenities: ['Private Balcony', 'High-Speed Wi-Fi', 'Nespresso Coffee', 'Rainfall Shower', '4K Smart TV', 'Mini Bar', 'Climate Control'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    rating: 4.9,
    numReviews: 28,
    featured: true,
  },
  {
    _id: 'room_2',
    id: 'room_2',
    roomNumber: '201',
    title: 'Azure Horizon Executive Suite',
    type: 'Executive Suite',
    floor: 2,
    pricePerNight: 480,
    capacity: { adults: 2, children: 2 },
    bedType: 'California King',
    sizeSqFt: 680,
    description: 'Panoramic oceanfront vistas with private living room, deep soaking jacuzzi tub, and executive club lounge privileges.',
    amenities: ['Oceanfront Terrace', 'Jacuzzi Soaking Tub', 'Executive Lounge Access', 'Butler Service', 'Bang & Olufsen Sound', 'Walk-in Wardrobe'],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'occupied',
    rating: 5.0,
    numReviews: 42,
    featured: true,
  },
  {
    _id: 'room_3',
    id: 'room_3',
    roomNumber: '301',
    title: 'The Grand Imperial Penthouse',
    type: 'Presidential Suite',
    floor: 3,
    pricePerNight: 1150,
    capacity: { adults: 4, children: 2 },
    bedType: '2 King Beds',
    sizeSqFt: 1450,
    description: 'The pinnacle of luxury. Private rooftop infinity plunge pool, full chef kitchen, 24/7 dedicated butler, and private elevator.',
    amenities: ['Private Plunge Pool', 'Private Elevator', '24/7 Butler Service', 'Chef Kitchen', 'Wine Cellar', 'Marble Fireplace', 'Chauffeured Limousine'],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    rating: 4.98,
    numReviews: 19,
    featured: true,
  },
  {
    _id: 'room_4',
    id: 'room_4',
    roomNumber: '102',
    title: 'Serenity Classic Double',
    type: 'Standard',
    floor: 1,
    pricePerNight: 160,
    capacity: { adults: 2, children: 0 },
    bedType: 'Queen Bed',
    sizeSqFt: 310,
    description: 'Thoughtfully designed minimalist sanctuary equipped with ergonomic workspace, plush organic linens, and acoustic soundproofing.',
    amenities: ['Ultra-Fast Wi-Fi', 'Workstation Desk', 'Smart Lighting', 'Organic Linens', 'Walk-in Shower', 'Safety Locker'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'cleaning',
    rating: 4.7,
    numReviews: 35,
    featured: false,
  },
  {
    _id: 'room_5',
    id: 'room_5',
    roomNumber: '202',
    title: 'Royal Palm Family Villa',
    type: 'Family Villa',
    floor: 2,
    pricePerNight: 650,
    capacity: { adults: 4, children: 3 },
    bedType: '1 King + 2 Queens',
    sizeSqFt: 920,
    description: 'Generous multi-room villa designed for families. Includes private garden dining area, games corner, and dual en-suite baths.',
    amenities: ['Private Garden Patio', 'Kitchenette', 'Dual En-suite Bathrooms', 'Kids Play Area', 'Full Laundry In-Unit', 'Board Games & Gaming Console'],
    images: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    rating: 4.88,
    numReviews: 16,
    featured: true,
  },
  {
    _id: 'room_6',
    id: 'room_6',
    roomNumber: '203',
    title: 'Skyline Sunset Studio',
    type: 'Deluxe',
    floor: 2,
    pricePerNight: 290,
    capacity: { adults: 2, children: 0 },
    bedType: 'King Bed',
    sizeSqFt: 460,
    description: 'West-facing floor-to-ceiling windows capturing breathtaking golden-hour sunsets. Cocktail bar set and freestanding soaking tub.',
    amenities: ['Sunset Views', 'Freestanding Tub', 'Artisan Cocktail Bar', 'Motorized Blackout Blinds', 'Bose Bluetooth Speaker'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'available',
    rating: 4.92,
    numReviews: 24,
    featured: false,
  },
  {
    _id: 'room_7',
    id: 'room_7',
    roomNumber: '302',
    title: 'Alpine Vista Executive Suite',
    type: 'Executive Suite',
    floor: 3,
    pricePerNight: 520,
    capacity: { adults: 3, children: 1 },
    bedType: 'King Bed + Sofa Bed',
    sizeSqFt: 750,
    description: 'Elevated mountain panorama with wrap-around glass walls, Finnish cedar sauna, and handcrafted stone fireplace.',
    amenities: ['Wrap-around Glass Balcony', 'Cedar Wood Sauna', 'Fireplace', 'Wine Chiller', 'Complimentary Breakfast', 'Pillow Menu'],
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'available',
    rating: 4.95,
    numReviews: 31,
    featured: false,
  },
  {
    _id: 'room_8',
    id: 'room_8',
    roomNumber: '103',
    title: 'Courtyard Minimalist Queen',
    type: 'Standard',
    floor: 1,
    pricePerNight: 175,
    capacity: { adults: 2, children: 0 },
    bedType: 'Queen Bed',
    sizeSqFt: 330,
    description: 'Overlooking the Zen water fountain courtyard. Peaceful, soothing, and equipped with circadian lighting.',
    amenities: ['Courtyard View', 'Circadian Lighting', 'Silent Air Flow', 'High-Speed Wi-Fi', 'Premium Bath Robes'],
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'maintenance',
    rating: 4.65,
    numReviews: 18,
    featured: false,
  },
];

export const initialBookings = [
  {
    _id: 'booking_1',
    id: 'booking_1',
    bookingCode: 'HP-2026-1042',
    guest: 'user_3',
    guestDetails: {
      name: 'Sophia Laurent',
      email: 'guest@hotelpro.com',
      phone: '+1 (555) 987-6543',
    },
    room: initialRooms[1],
    checkInDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    checkOutDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    totalNights: 4,
    numberOfGuests: { adults: 2, children: 1 },
    roomRate: 480,
    extraServices: [{ name: 'Executive Airport Transfer', price: 95 }],
    taxAmount: 242,
    serviceFee: 101,
    totalAmount: 2358,
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    bookingStatus: 'checked-in',
    specialRequests: 'Late arrival, extra hypoallergenic pillows requested.',
    invoiceNumber: 'INV-2026-881902',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    _id: 'booking_2',
    id: 'booking_2',
    bookingCode: 'HP-2026-1088',
    guest: 'user_3',
    guestDetails: {
      name: 'Sophia Laurent',
      email: 'guest@hotelpro.com',
      phone: '+1 (555) 987-6543',
    },
    room: initialRooms[0],
    checkInDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    checkOutDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8).toISOString(),
    totalNights: 3,
    numberOfGuests: { adults: 2, children: 0 },
    roomRate: 240,
    extraServices: [{ name: 'Artisan Champagne on Arrival', price: 120 }],
    taxAmount: 101,
    serviceFee: 42,
    totalAmount: 983,
    paymentStatus: 'paid',
    paymentMethod: 'stripe',
    bookingStatus: 'confirmed',
    specialRequests: 'Celebrating 5th anniversary stay.',
    invoiceNumber: 'INV-2026-914023',
    createdAt: new Date().toISOString(),
  },
];

export const initialUsers = [
  {
    id: 'user_1',
    _id: 'user_1',
    name: 'Eleanor Vance',
    email: 'admin@hotelpro.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'user_2',
    _id: 'user_2',
    name: 'Marcus Sterling',
    email: 'staff@hotelpro.com',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'user_3',
    _id: 'user_3',
    name: 'Sophia Laurent',
    email: 'guest@hotelpro.com',
    role: 'guest',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  },
];

// Persistent LocalStorage Store for Cloud Sandbox / Vercel
export const getStoredRooms = () => {
  const data = localStorage.getItem('hotelpro_rooms');
  if (!data) {
    localStorage.setItem('hotelpro_rooms', JSON.stringify(initialRooms));
    return initialRooms;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return initialRooms;
  }
};

export const saveStoredRooms = (rooms) => {
  localStorage.setItem('hotelpro_rooms', JSON.stringify(rooms));
};

export const getStoredBookings = () => {
  const data = localStorage.getItem('hotelpro_bookings');
  if (!data) {
    localStorage.setItem('hotelpro_bookings', JSON.stringify(initialBookings));
    return initialBookings;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return initialBookings;
  }
};

export const saveStoredBookings = (bookings) => {
  localStorage.setItem('hotelpro_bookings', JSON.stringify(bookings));
};
