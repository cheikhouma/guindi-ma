import { School, User } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Aminata Diallo',
  email: 'aminata@example.com',
  role: 'admin',
  favorites: ['1', '3'],
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
};

export const mockSchools: School[] = [
  {
    id: '1',
    name: 'École Primaire Liberté',
    type: 'private',
    level: 'primary',
    address: 'Avenue Bourguiba, Dakar',
    region: 'Dakar',
    coordinates: { lat: 14.6937, lng: -17.4441 },
    students: 450,
    facilities: ['Bibliothèque', 'Cantine', 'Terrain de sport', 'Laboratoire'],
    rating: 4.2,
    reviews: [
      {
        id: '1',
        userId: '1',
        userName: 'Fatou Diop',
        rating: 4,
        comment: 'Excellente école avec des enseignants dévoués.',
        date: '2024-01-15'
      }
    ],
    images: [
      'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    phone: '+221 33 123 45 67',
    email: 'contact@liberte.edu.sn',
    established: 1985,
    user: mockUser.id
  },
  {
    id: '2',
    name: 'Collège Blaise Diagne',
    type: 'public',
    level: 'secondary',
    address: 'Rue Félix Faure,Medina, Dakar',
    region: 'Kaffrine',
    coordinates: { lat: 14.6728, lng: -17.4519 },
    students: 680,
    facilities: ['Bibliothèque', 'Laboratoire informatique', 'Terrain de basket', 'Infirmerie'],
    rating: 4.5,
    reviews: [
      {
        id: '2',
        userId: '2',
        userName: 'Mamadou Sy',
        rating: 5,
        comment: 'Un collège avec d\'excellents résultats au BFEM.',
        date: '2024-12-20'
      }
    ],
    images: [
      'https://images.pexels.com/photos/159775/library-la-trobe-study-students-159775.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    phone: '+221 33 234 56 78',
    established: 1960,
    user: mockUser.id
  },
  {
    id: '3',
    name: 'Lycée Lamine Guèye',
    level: 'high_school',
    type: 'public',
    address: 'Avenue Lamine Guèye, Dakar',
    region: 'Fatick',
    coordinates: { lat: 14.6892, lng: -17.4479 },
    students: 1200,
    facilities: ['Bibliothèque', 'Laboratoire de sciences', 'Terrain de football', 'Amphithéâtre'],
    rating: 4.7,
    reviews: [
      {
        id: '3',
        userId: '3',
        userName: 'Aïcha Fall',
        rating: 5,
        comment: 'Le meilleur lycée de Dakar pour la préparation au bac.',
        date: '2024-01-25'
      }
    ],
    images: [
      'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    phone: '+221 33 345 67 89',
    established: 1950,
    user: mockUser.id
  },
  {
    id: '4',
    name: 'École Primaire de Thiès',
    level: 'primary',
    type: 'public',
    address: 'Centre-ville, Thiès',
    region: 'Thiès',
    coordinates: { lat: 14.7886, lng: -16.9246 },
    students: 320,
    facilities: ['Cantine', 'Terrain de jeux', 'Bibliothèque'],
    rating: 3.8,
    reviews: [],
    images: [
      'https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    phone: '+221 33 951 12 34',
    established: 1975,
    user: mockUser.id
  },
  {
    id: '5',
    name: 'Lycée de Saint-Louis',
    level: 'high_school',
    type: 'public',
    address: 'Île de Saint-Louis',
    region: 'Saint-Louis',
    coordinates: { lat: 16.0280, lng: -16.4951 },
    students: 800,
    facilities: ['Bibliothèque', 'Laboratoire', 'Terrain de sport'],
    rating: 4.1,
    reviews: [],
    images: [
      'https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    phone: '+221 33 961 23 45',
    established: 1965,
    user: mockUser.id
  },
  
  {
    id: '6',
    name: 'International School of Dakar',
    type: 'private',
    level: 'high_school',
    address: 'Mermoz, Dakar',
    region: 'Kédougou',
    coordinates: { lat: 14.7167, lng: -17.4694 },
    students: 780,
    facilities: ['Piscine', 'Bibliothèque', 'Laboratoire informatique', 'Terrains sportifs'],
    rating: 4.8,
    reviews: [
      {
        id: 'r1',
        userId: 'u1',
        userName: 'Paul Ndiaye',
        rating: 5,
        comment: 'Programme bilingue de très bonne qualité, encadrement excellent.',
        date: '2024-02-10'
      }
    ],
    images: [
      'https://example.com/isd1.jpg',
      'https://example.com/isd2.jpg'
    ],
    phone: '+221 33 820 55 00',
    email: 'info@isdakar.org',
    established: 1983,
    user: mockUser.id
  },
  {
    id: '7',
    name: 'Lycée Français Jean‑Mermoz',
    level: 'high_school',
    type: 'private',
    address: 'Avenue Cheikh Anta Diop, Ouakam, Dakar',
    region: 'Matam',
    coordinates: { lat: 14.6870, lng: -17.4830 },
    students: 2500,
    facilities: ['Cantine', 'Bibliothèque', 'Gymnase', 'Laboratoire scientifique'],
    rating: 4.7,
    reviews: [
      {
        id: 'r2',
        userId: 'u2',
        userName: 'Aïssatou Ba',
        rating: 5,
        comment: 'Parfait pour un cursus français, taux de réussite au bac très élevé.',
        date: '2024-03-05'
      }
    ],
    images: [
      'https://example.com/mermoz1.jpg',
      'https://example.com/mermoz2.jpg'
    ],
    phone: '+221 33 860 45 33',
    email: 'contact@lyceemermoz.sn',
    established: 1976,
    user: mockUser.id
  },
  {
    id: '8',
    name: 'Cours Sainte‑Marie de Hann',
    level: 'primary',
    type: 'private',
    address: 'Hann Bel‑Air, Dakar',
    region: 'Saint-Louis',
    coordinates: { lat: 14.6950, lng: -17.3650 },
    students: 5000,
    facilities: ['Programme bilingue FR/SN', 'Cantine', 'Terrain de jeux'],
    rating: 4.6,
    reviews: [
      {
        id: 'r3',
        userId: 'u3',
        userName: 'Fatou Thiam',
        rating: 4,
        comment: 'École très diversifiée, primée par l\'UNESCO.',
        date: '2024-01-12'
      }
    ],
    images: [
      'https://example.com/sainte-marie1.jpg',
      'https://example.com/sainte-marie2.jpg'
    ],
    phone: '+221 33 123 00 00',
    email: 'contact@cmsm.sn',
    established: 1949,
    user: mockUser.id
  },
  {
    id: '9',
    name: 'École Ndiarème B',
    level: 'primary',
    type: 'public',
    address: 'Guinaw Rails, Dakar',
    region: 'Dakar',
    coordinates: { lat: 14.7050, lng: -17.4300 },
    students: 300,
    facilities: ['Bibliothèque communautaire', 'Accès eau potable', 'Sanitaires séparés'],
    rating: 4.3,
    reviews: [],
    images: [
      'https://example.com/ndiareme1.jpg'
    ],
    phone: '',
    email: '',
    established: 1996,
    user: mockUser.id
  }

];



export const regions = [
  'Dakar',
  'Thiès',
  'Saint-Louis',
  'Kaolack',
  'Ziguinchor',
  'Diourbel',
  'Louga',
  'Fatick',
  'Kolda',
  'Tambacounda',
  'Kédougou',
  'Sédhiou',
  'Kaffrine',
  'Matam'
];

export const schoolLevels = [
  { value: 'primary', label: 'École Primaire', color: 'bg-yellow-500' },
  { value: 'secondary', label: 'Collège', color: 'bg-red-500' },
  { value: 'high_school', label: 'Lycée', color: 'bg-green-500' },
];

export const schoolTypes = [
  { value: 'public', label: 'Publique', color: 'bg-orange-500' },
  { value: 'private', label: 'Privée', color: 'bg-blue-500' },
];


