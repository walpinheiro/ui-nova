export type VisitTone = 'primary' | 'lime'

export interface TimelineVisit {
  id: string
  patient: string
  /** Decimal hour, 24h clock (8.5 = 8:30). */
  start: number
  end: number
  tone?: VisitTone
}

export interface TimelineRow {
  id: string
  name: string
  initials?: string
  /** Avatar background (data-viz color, defined as local CSS color). */
  color?: string
  /** Orange dot: caregiver needs attention (overtime, late check-in...). */
  alert?: boolean
  open?: boolean
  visits: TimelineVisit[]
}

export const SCHEDULE_START_HOUR = 7
export const SCHEDULE_END_HOUR = 19

export const openShifts: TimelineRow = {
  id: 'open',
  name: 'Open shifts',
  open: true,
  visits: [
    { id: 'o1', patient: 'Unassigned · Hartley', start: 8, end: 10 },
    { id: 'o2', patient: 'Unassigned · Okafor', start: 11.5, end: 13 },
    { id: 'o3', patient: 'Unassigned · Lindqvist', start: 15, end: 17.5 },
  ],
}

export const caregivers: TimelineRow[] = [
  {
    id: 'c1', name: 'Maria Alvarez', color: '#e0709a', alert: true,
    visits: [
      { id: 'c1a', patient: 'Dorothy Reyes', start: 7.5, end: 9 },
      { id: 'c1b', patient: 'Harold Finch', start: 9.5, end: 11.5, tone: 'lime' },
      { id: 'c1c', patient: 'Evelyn Park', start: 13, end: 15 },
      { id: 'c1d', patient: 'Walter Nguyen', start: 15.5, end: 17.5 },
    ],
  },
  {
    id: 'c2', name: 'James Okoye', color: '#5b8def',
    visits: [
      { id: 'c2a', patient: 'Margaret Holt', start: 8, end: 10 },
      { id: 'c2b', patient: 'Frank Delgado', start: 10.5, end: 12 },
      { id: 'c2c', patient: 'Ruth Abrams', start: 13.5, end: 16, tone: 'lime' },
    ],
  },
  {
    id: 'c3', name: 'Priya Raman', color: '#f2a03d',
    visits: [
      { id: 'c3a', patient: 'George Whitman', start: 7, end: 8.5 },
      { id: 'c3b', patient: 'Alice Brennan', start: 9, end: 11 },
      { id: 'c3c', patient: 'Leonard Cho', start: 11.5, end: 13.5 },
      { id: 'c3d', patient: 'Joan Mercer', start: 14, end: 16 },
      { id: 'c3e', patient: 'Pearl Dixon', start: 16.5, end: 18 },
    ],
  },
  {
    id: 'c4', name: 'Daniel Brooks', color: '#46b39b', alert: true,
    visits: [
      { id: 'c4a', patient: 'Irene Castillo', start: 9, end: 11 },
      { id: 'c4b', patient: 'Samuel Ortiz', start: 12, end: 14, tone: 'lime' },
      { id: 'c4c', patient: 'Beatrice Lang', start: 14.5, end: 17 },
    ],
  },
  {
    id: 'c5', name: 'Chloe Martin', color: '#9b7be6',
    visits: [
      { id: 'c5a', patient: 'Victor Sandoval', start: 7, end: 9 },
      { id: 'c5b', patient: 'Nora Ellis', start: 9.5, end: 11 },
      { id: 'c5c', patient: 'Arthur Kim', start: 12.5, end: 14.5 },
      { id: 'c5d', patient: 'Helen Vasquez', start: 15, end: 18 },
    ],
  },
  {
    id: 'c6', name: 'Tomás Herrera', color: '#d9885b',
    visits: [
      { id: 'c6a', patient: 'Lucille Barnes', start: 8.5, end: 10.5 },
      { id: 'c6b', patient: 'Raymond Fox', start: 11, end: 13, tone: 'lime' },
      { id: 'c6c', patient: 'Edith Morales', start: 14, end: 15.5 },
    ],
  },
  {
    id: 'c7', name: 'Aisha Rahman', color: '#4fa3c7',
    visits: [
      { id: 'c7a', patient: 'Clarence Webb', start: 7.5, end: 9.5 },
      { id: 'c7b', patient: 'Gloria Tran', start: 10, end: 12 },
      { id: 'c7c', patient: 'Stanley Pratt', start: 12.5, end: 14 },
      { id: 'c7d', patient: 'Mildred Shaw', start: 16, end: 18.5 },
    ],
  },
  {
    id: 'c8', name: 'Kevin O’Neil', color: '#7a8bd1',
    visits: [
      { id: 'c8a', patient: 'Doris Mackenzie', start: 9, end: 10.5 },
      { id: 'c8b', patient: 'Howard Singh', start: 11, end: 13.5 },
      { id: 'c8c', patient: 'Vera Lindgren', start: 15, end: 17, tone: 'lime' },
    ],
  },
  {
    id: 'c9', name: 'Sofia Petrova', color: '#e06a6a', alert: true,
    visits: [
      { id: 'c9a', patient: 'Oscar Bell', start: 7, end: 8.5 },
      { id: 'c9b', patient: 'Jean Whitaker', start: 9, end: 11.5 },
      { id: 'c9c', patient: 'Marvin Cole', start: 13, end: 15 },
      { id: 'c9d', patient: 'Ida Fletcher', start: 15.5, end: 17 },
    ],
  },
  {
    id: 'c10', name: 'Marcus Webb', color: '#58b368',
    visits: [
      { id: 'c10a', patient: 'Agnes Poole', start: 8, end: 9.5 },
      { id: 'c10b', patient: 'Roy Gallagher', start: 10, end: 12.5 },
      { id: 'c10c', patient: 'Lena Fischer', start: 13, end: 14.5 },
      { id: 'c10d', patient: 'Carl Jensen', start: 15, end: 17.5 },
    ],
  },
]
