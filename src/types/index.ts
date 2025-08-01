export interface School {
  id: string;
  name: string;
  type: 'private' | 'public';
  level: 'primary' | 'secondary' | 'high_school';
  address: string;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  students: number;
  facilities: string[];
  rating: number;
  reviews: Review[];
  images: string[];
  phone?: string;
  email?: string;
  website?: string;
  established: number;
  user: User['id'];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'representant' | 'ministere';
  favorites: string[];
  avatar?: string;
}

export interface FilterState {
  type: string[];
  region: string[];
  minStudents: number;
  maxStudents: number;
  minRating: number;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
  suggestions?: string[];
}