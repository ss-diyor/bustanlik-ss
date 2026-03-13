import { ClassData } from '../types';

const STORAGE_KEY = 'school_data';

export const getInitialData = (): ClassData[] => {
  return [
    {
      id: 'class-9a',
      name: 'Class 9A',
      mentor: 'Ms. Sarah Johnson',
      news: [
        {
          id: '1',
          title: 'Parent-Teacher Meeting',
          description: 'Parent-teacher meeting scheduled for next Friday at 3 PM.',
          date: '2026-03-20',
          type: 'event',
        },
        {
          id: '2',
          title: 'Science Fair Winners',
          description: 'Congratulations to Team Alpha for winning first place!',
          date: '2026-03-12',
          type: 'news',
        },
      ],
      timetable: [
        { id: '1', day: 'Monday', time: '08:00 - 09:00', subject: 'Mathematics', teacher: 'Mr. Smith', room: 'Room 101' },
        { id: '2', day: 'Monday', time: '09:00 - 10:00', subject: 'English', teacher: 'Ms. Johnson', room: 'Room 102' },
        { id: '3', day: 'Monday', time: '10:00 - 11:00', subject: 'Science', teacher: 'Dr. Brown', room: 'Lab 1' },
        { id: '4', day: 'Tuesday', time: '08:00 - 09:00', subject: 'History', teacher: 'Mr. Davis', room: 'Room 103' },
        { id: '5', day: 'Tuesday', time: '09:00 - 10:00', subject: 'Geography', teacher: 'Ms. Wilson', room: 'Room 104' },
      ],
      contacts: [
        { id: '1', name: 'Ms. Sarah Johnson', role: 'Class Mentor', phone: '(555) 123-4567', email: 'sarah.johnson@school.edu' },
        { id: '2', name: 'Principal Office', role: 'Administration', phone: '(555) 100-0001', email: 'principal@school.edu' },
      ],
      links: [
        { id: '1', title: 'Class Google Classroom', url: 'https://classroom.google.com', description: 'Access homework and assignments' },
        { id: '2', title: 'School Portal', url: 'https://portal.school.edu', description: 'View grades and attendance' },
      ],
    },
    {
      id: 'class-9b',
      name: 'Class 9B',
      mentor: 'Mr. David Anderson',
      news: [
        {
          id: '3',
          title: 'Field Trip Announcement',
          description: 'Field trip to the Science Museum on March 25th. Permission slips required.',
          date: '2026-03-25',
          type: 'event',
        },
      ],
      timetable: [
        { id: '6', day: 'Monday', time: '08:00 - 09:00', subject: 'English', teacher: 'Ms. Taylor', room: 'Room 201' },
        { id: '7', day: 'Monday', time: '09:00 - 10:00', subject: 'Mathematics', teacher: 'Mr. Anderson', room: 'Room 202' },
        { id: '8', day: 'Tuesday', time: '08:00 - 09:00', subject: 'Science', teacher: 'Dr. Martinez', room: 'Lab 2' },
      ],
      contacts: [
        { id: '3', name: 'Mr. David Anderson', role: 'Class Mentor', phone: '(555) 234-5678', email: 'david.anderson@school.edu' },
      ],
      links: [
        { id: '3', title: 'Class Materials', url: 'https://drive.google.com', description: 'Shared class resources' },
      ],
    },
    {
      id: 'class-10a',
      name: 'Class 10A',
      mentor: 'Dr. Emily White',
      news: [
        {
          id: '4',
          title: 'Mock Exams Schedule',
          description: 'Mock exams will begin from March 27th. Please prepare accordingly.',
          date: '2026-03-27',
          type: 'news',
        },
      ],
      timetable: [
        { id: '9', day: 'Monday', time: '08:00 - 09:00', subject: 'Physics', teacher: 'Dr. Lee', room: 'Lab 3' },
        { id: '10', day: 'Monday', time: '09:00 - 10:00', subject: 'Chemistry', teacher: 'Dr. White', room: 'Lab 4' },
        { id: '11', day: 'Tuesday', time: '08:00 - 09:00', subject: 'Mathematics', teacher: 'Mr. Garcia', room: 'Room 301' },
      ],
      contacts: [
        { id: '4', name: 'Dr. Emily White', role: 'Class Mentor', phone: '(555) 345-6789', email: 'emily.white@school.edu' },
      ],
      links: [
        { id: '4', title: 'Exam Preparation', url: 'https://exams.school.edu', description: 'Practice tests and study materials' },
      ],
    },
  ];
};

export const loadData = (): ClassData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  return getInitialData();
};

export const saveData = (data: ClassData[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};