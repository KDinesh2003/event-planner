export interface Event {
    [x: string]: ReactNode;
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    category: string;
    organizer_id?: number;
    description?: string;
    registration_count: number;
  }
  
  export interface User {
    id: number;
    name: string;
    email: string;
    token?: string;
  }
  