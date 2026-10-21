import type { VSidebarItem } from '../../components/navigation/VSidebar/VSidebar.types'

export const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
const LONG_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

/** Week of Mon Jul 7 2025. */
export function dayTitle(i: number): string {
  return `${LONG_DAYS[i]}, Jul ${7 + i}, 2025`
}

/** Daily values in $K (profit is 60% of gross). */
export const PROFIT = [41, 29, 38.35, 55, 47, 58, 52]
export const GROSS = PROFIT.map((v) => Math.round((v / 0.6) * 10) / 10)
export const GOALS = [60, 56, 64, 74, 68, 80, 72]
export const DEALS = [1, 1, 1, 2, 1, 2, 1]
export const MARGIN = 60

export const TOTALS = { gross: '$142,500', profit: '$85,500' } as const

export const SALES_MODES = [
  { value: 'gross', label: 'Gross' },
  { value: 'profit', label: 'Profit' },
]

export const PERIOD_OPTIONS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'qtr', label: 'This quarter' },
]

export const APPOINTMENT_BARS = [
  { day: 'MON', value: 14, label: '$0.9M' },
  { day: 'TUE', value: 22, label: '$1.1M' },
  { day: 'WED', value: 18, label: '$1.2M' },
  { day: 'THU', value: 9, label: '$0.4M' },
  { day: 'FRI', value: 12, label: '$0.6M' },
]

export interface ScheduleItem {
  id: string
  day: string
  month: string
  time: string
  name: string
  detail: string
  amount: string
}

export const SCHEDULE: ScheduleItem[] = [
  { id: 's1', day: '16', month: 'Aug', time: '09:30 - 10:15 AM', name: 'Karen Whitfield', detail: 'Property viewing · 14 Oak Lane', amount: '$845K' },
  { id: 's2', day: '16', month: 'Aug', time: '01:00 - 01:45 PM', name: 'Marcus Oyelaran', detail: 'Contract review · Harbor Lofts', amount: '$1.2M' },
  { id: 's3', day: '17', month: 'Aug', time: '11:15 - 12:00 PM', name: 'Priya Natarajan', detail: 'Valuation call · Willow Creek', amount: '$680K' },
]

export const PIPELINE = [
  { id: 'valuation', label: 'Valuation', value: 850, display: '$850K' },
  { id: 'consult', label: 'Consult', value: 1200, display: '$1.2M' },
  { id: 'signing', label: 'Signing', value: 680, display: '$680K' },
]

export interface UpcomingItem {
  id: string
  initials: string
  name: string
  when: string
  tag: string
  tone: 'primary' | 'warning' | 'success'
}

export const UPCOMING: UpcomingItem[] = [
  { id: 'u1', initials: 'DL', name: 'Daniel Lowe', when: 'Tomorrow · 10:00 AM', tag: 'Consult', tone: 'primary' },
  { id: 'u2', initials: 'SM', name: 'Sofia Marchetti', when: 'Wed · 02:30 PM', tag: 'Signing', tone: 'success' },
  { id: 'u3', initials: 'HK', name: 'Hiro Kobayashi', when: 'Thu · 09:00 AM', tag: 'Valuation', tone: 'warning' },
  { id: 'u4', initials: 'AB', name: 'Amara Bello', when: 'Fri · 04:15 PM', tag: 'Consult', tone: 'primary' },
]

export const RAIL_ITEMS = [
  { value: 'globe', label: 'Sites', icon: 'globe' },
  { value: 'chart', label: 'Analytics', icon: 'chart' },
  { value: 'chat', label: 'Conversations', icon: 'chat' },
  { value: 'file', label: 'Documents', icon: 'file' },
  { value: 'nodes', label: 'Automations', icon: 'workflow' },
  { value: 'settings', label: 'Settings', icon: 'settings' },
]

export const NAV_ITEMS: VSidebarItem[] = [
  { value: 'overview', label: 'Overview', icon: 'overview' },
  {
    value: 'g-pipeline',
    label: 'Pipeline',
    type: 'group',
    children: [
      { value: 'listings', label: 'Listings', icon: 'building' },
      { value: 'clients', label: 'Clients', icon: 'users' },
      { value: 'appointments', label: 'Appointments', icon: 'calendar' },
    ],
  },
  {
    value: 'g-reports',
    label: 'Reports',
    type: 'group',
    children: [
      { value: 'revenue', label: 'Revenue', icon: 'wallet' },
      {
        value: 'deals',
        label: 'Deals',
        icon: 'briefcase',
        children: [
          { value: 'deals-open', label: 'Open' },
          { value: 'deals-won', label: 'Won' },
          { value: 'deals-lost', label: 'Lost' },
        ],
      },
      { value: 'performance', label: 'Performance', icon: 'trending' },
    ],
  },
  {
    value: 'g-workspace',
    label: 'Workspace',
    type: 'group',
    children: [
      { value: 'agents', label: 'Agents', icon: 'bot' },
      { value: 'api-keys', label: 'API Keys', icon: 'key' },
      { value: 'members', label: 'Members', icon: 'team' },
      { value: 'billing', label: 'Billing', icon: 'billing' },
    ],
  },
  {
    value: 'g-settings',
    label: 'Settings',
    type: 'group',
    children: [
      { value: 'preferences', label: 'Preferences', icon: 'settings' },
      { value: 'labels', label: 'Labels', icon: 'tag' },
    ],
  },
]
