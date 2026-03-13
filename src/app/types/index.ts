export interface NewsEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'news' | 'event';
}

export interface TimetableEntry {
  id: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
}

export interface Link {
  id: string;
  title: string;
  url: string;
  description: string;
}

export interface ClassData {
  id: string;
  name: string;
  mentor: string;
  news: NewsEvent[];
  timetable: TimetableEntry[];
  contacts: Contact[];
  links: Link[];
}