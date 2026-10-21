export type Tone = 'pos' | 'neg'

export interface Kpi {
  id: string
  label: string
  value: string
  delta: string
  tone: Tone | 'neutral'
  /** `up` / `down` arrow, or none for plain captions. */
  trend?: 'up' | 'down'
  caption: string
}

export const KPIS: Kpi[] = [
  { id: 'portfolio', label: 'Total Portfolio Value', value: '$125,340', delta: '+12.04%', tone: 'pos', trend: 'up', caption: 'This Year' },
  { id: 'daily', label: 'Daily P/L', value: '+$540', delta: '+0.43%', tone: 'pos', trend: 'up', caption: 'Last Year' },
  { id: 'monthly', label: 'Monthly Return', value: '+8.2%', delta: '-1.4%', tone: 'neg', trend: 'down', caption: 'Vs S&P' },
  { id: 'dividend', label: 'Dividend Income', value: '$2,240', delta: 'YTD', tone: 'neutral', caption: 'Paid quarterly' },
  { id: 'risk', label: 'Risk Score', value: '0.87', delta: 'Moderate', tone: 'neutral', caption: 'Beta' },
]

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Cumulative return in %, Jan-Dec. */
export const PORTFOLIO_SERIES = [0.2, 0.9, 0.5, 1.4, 1.1, 2.0, 2.6, 4.9, 3.8, 3.2, 3.9, 4.25]
export const BENCHMARK_SERIES = [0.1, 0.4, -0.2, 0.6, 0.3, 0.9, 1.2, 2.4, 1.7, 1.1, 1.5, 1.8]

export interface BenchmarkLegend {
  id: string
  label: string
  value: string
  tone: Tone
}

export const LEGEND: BenchmarkLegend[] = [
  { id: 'portfolio', label: 'Portfolio', value: '+4.25%', tone: 'pos' },
  { id: 'sp500', label: 'S&P 500', value: '-1.39%', tone: 'neg' },
  { id: 'nasdaq', label: 'Nasdaq', value: '-1.1%', tone: 'neg' },
  { id: 'crypto', label: 'Crypto', value: '+8.9%', tone: 'pos' },
]

export interface Holding {
  ticker: string
  name: string
  price: string
  weight: number
  pl: string
  color: string
  glyph: string
}

export const HOLDINGS: Holding[] = [
  { ticker: 'MATIC', name: 'Polygon', price: '$0.58', weight: 24.5, pl: '+6.2%', color: '#7c3aed', glyph: 'M' },
  { ticker: 'DOGE', name: 'Dogecoin', price: '$0.162', weight: 18.2, pl: '+3.4%', color: '#eab308', glyph: 'D' },
  { ticker: 'SOL', name: 'Solana', price: '$172.40', weight: 15.8, pl: '+9.1%', color: '#14b8a6', glyph: 'S' },
  { ticker: 'XRP', name: 'Ripple', price: '$0.52', weight: 12.4, pl: '+1.8%', color: '#3f3f46', glyph: 'X' },
  { ticker: 'ADA', name: 'Cardano', price: '$0.45', weight: 9.6, pl: '+2.7%', color: '#2563eb', glyph: 'A' },
]

export const ALLOCATION_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const ALLOCATION_SERIES = [4.8, 6.1, 5.4, 8.2, 12.45, 9.6, 11.1]

export interface Mover {
  ticker: string
  name: string
  change: string
}

export const GAINERS: Mover[] = [
  { ticker: 'SOFI', name: 'SoFi Technologies', change: '+12.4%' },
  { ticker: 'CRWD', name: 'CrowdStrike', change: '+8.7%' },
]
export const LOSERS: Mover[] = [
  { ticker: 'SNAP', name: 'Snap Inc.', change: '-14%' },
  { ticker: 'RIVN', name: 'Rivian Automotive', change: '-9.8%' },
]

export interface Intel {
  id: string
  caption: string
  headline: string
  time: string
}

export const INTEL: Intel[] = [
  { id: 'i1', caption: 'MACRO · AMERICAS', headline: 'Fed holds rates steady, signals two cuts before year-end', time: '2h Ago' },
  { id: 'i2', caption: 'CRYPTO · GLOBAL', headline: 'Spot ETF inflows hit a four-month high as volatility cools', time: '3h Ago' },
  { id: 'i3', caption: 'EQUITIES · US', headline: 'Fintech earnings beat estimates, lifting mid-cap growth names', time: '5h Ago' },
]

export const RAIL_ITEMS = [
  { value: 'panel', label: 'Toggle panel', icon: 'canvas' },
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'wallet', label: 'Wallet', icon: 'wallet' },
  { value: 'grid', label: 'Dashboard', icon: 'grid' },
  { value: 'allocation', label: 'Allocation', icon: 'layers' },
  { value: 'analytics', label: 'Analytics', icon: 'chart' },
  { value: 'assistant', label: 'Assistant', icon: 'sparkles' },
]

export const TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'holdings', label: 'Holdings' },
  { value: 'market', label: 'Market watch' },
]
