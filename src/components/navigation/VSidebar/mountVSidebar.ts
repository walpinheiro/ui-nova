import type { IconifyIcon } from '@iconify/types'
import chartPieIcon from '@iconify-icons/keyline-icons/chart-pie'
import slidersIcon from '@iconify-icons/keyline-icons/sliders-horizontal'
import receiptIcon from '@iconify-icons/keyline-icons/receipt'
import chartLineIcon from '@iconify-icons/keyline-icons/chart-line'
import dollarSignIcon from '@iconify-icons/keyline-icons/dollar-sign'
import circleQuestionIcon from '@iconify-icons/keyline-icons/circle-question'
import doorOpenIcon from '@iconify-icons/keyline-icons/door-open'
import sunIcon from '@iconify-icons/keyline-icons/sun'
import moonIcon from '@iconify-icons/keyline-icons/moon'
import botIcon from '@iconify-icons/keyline-icons/bot'
import radarIcon from '@iconify-icons/keyline-icons/radar'
import userIcon from '@iconify-icons/keyline-icons/user'
import idCardIcon from '@iconify-icons/keyline-icons/id-card'
import buildingIcon from '@iconify-icons/keyline-icons/building'
import sendIcon from '@iconify-icons/keyline-icons/send'
import checkIcon from '@iconify-icons/keyline-icons/check'
import inboxIcon from '@iconify-icons/keyline-icons/inbox'
import fileTextIcon from '@iconify-icons/keyline-icons/file-text'
import gitBranchIcon from '@iconify-icons/keyline-icons/git-branch'
import cpuIcon from '@iconify-icons/keyline-icons/cpu'
import playIcon from '@iconify-icons/keyline-icons/play'
import mailIcon from '@iconify-icons/keyline-icons/mail'
import plugIcon from '@iconify-icons/keyline-icons/plug'
import databaseIcon from '@iconify-icons/keyline-icons/database'
import bellIcon from '@iconify-icons/keyline-icons/bell'
import creditCardIcon from '@iconify-icons/keyline-icons/credit-card'
import briefcaseIcon from '@iconify-icons/keyline-icons/briefcase'
import triangleAlertIcon from '@iconify-icons/keyline-icons/triangle-alert'
import homeIcon from '@iconify-icons/keyline-icons/home'
import chartBarIcon from '@iconify-icons/keyline-icons/chart-bar'
import folderIcon from '@iconify-icons/keyline-icons/folder'
import usersIcon from '@iconify-icons/keyline-icons/users'
import layoutDashboardIcon from '@iconify-icons/keyline-icons/layout-dashboard'
import zapIcon from '@iconify-icons/keyline-icons/zap'
import settingsIcon from '@iconify-icons/keyline-icons/settings'
import sparklesIcon from '@iconify-icons/keyline-icons/sparkles'
import searchIcon from '@iconify-icons/keyline-icons/search'
import bookOpenIcon from '@iconify-icons/keyline-icons/book-open'
import messageIcon from '@iconify-icons/keyline-icons/message'
import chevronsLeftIcon from '@iconify-icons/keyline-icons/chevrons-left'
import chevronRightIcon from '@iconify-icons/keyline-icons/chevron-right'
import chevronDownIcon from '@iconify-icons/keyline-icons/chevron-down'
import chevronUpIcon from '@iconify-icons/keyline-icons/chevron-up'
import panelLeftIcon from '@iconify-icons/keyline-icons/panel-left'
import moreHorizontalIcon from '@iconify-icons/keyline-icons/more-horizontal'
import closeIcon from '@iconify-icons/keyline-icons/x'
import starIcon from '@iconify-icons/keyline-icons/star'
import calendarIcon from '@iconify-icons/keyline-icons/calendar'
import shieldIcon from '@iconify-icons/keyline-icons/shield'
import layersIcon from '@iconify-icons/keyline-icons/layers'
import walletIcon from '@iconify-icons/keyline-icons/wallet'
import trendingUpIcon from '@iconify-icons/keyline-icons/trending-up'
import cloudIcon from '@iconify-icons/keyline-icons/cloud'
import plusIcon from '@iconify-icons/keyline-icons/plus'
import globeIcon from '@iconify-icons/keyline-icons/globe'
import clockIcon from '@iconify-icons/keyline-icons/clock'
import archiveIcon from '@iconify-icons/keyline-icons/archive'
import flagIcon from '@iconify-icons/keyline-icons/flag'
import keyIcon from '@iconify-icons/keyline-icons/key'
import activityIcon from '@iconify-icons/keyline-icons/activity'
import rocketIcon from '@iconify-icons/keyline-icons/rocket'
import lockIcon from '@iconify-icons/keyline-icons/lock'
import heartIcon from '@iconify-icons/keyline-icons/heart'
import tagIcon from '@iconify-icons/keyline-icons/tag'
import type {
  ResolvedVSidebarItem,
  VSidebarItem,
  VSidebarItemType,
  VSidebarProps,
  VSidebarSize,
  VSidebarVariant,
} from './VSidebar.types'

const SIZES: VSidebarSize[] = ['sm', 'md', 'lg']
const VARIANTS: VSidebarVariant[] = ['default', 'card', 'workspace', 'icons', 'floating']

export const SIDEBAR_UI_ICONS = {
  search: searchIcon,
  collapse: chevronsLeftIcon,
  expand: chevronRightIcon,
  chevronUp: chevronUpIcon,
  chevronDown: chevronDownIcon,
  panelLeft: panelLeftIcon,
  moreHorizontal: moreHorizontalIcon,
  close: closeIcon,
} as const

const KEYLINE_ICONS: Record<string, IconifyIcon> = {
  home: homeIcon,
  dashboard: homeIcon,
  chart: chartBarIcon,
  analytics: chartBarIcon,
  folder: folderIcon,
  projects: folderIcon,
  team: usersIcon,
  users: usersIcon,
  design: layoutDashboardIcon,
  overview: layoutDashboardIcon,
  integrations: zapIcon,
  settings: settingsIcon,
  sparkle: sparklesIcon,
  sparkles: sparklesIcon,
  search: searchIcon,
  book: bookOpenIcon,
  message: messageIcon,
  chat: messageIcon,
  canvas: layoutDashboardIcon,
  grid: layoutDashboardIcon,
  workbench: folderIcon,
  bot: botIcon,
  agent: botIcon,
  radar: radarIcon,
  signal: radarIcon,
  user: userIcon,
  contact: idCardIcon,
  contacts: idCardIcon,
  building: buildingIcon,
  companies: buildingIcon,
  send: sendIcon,
  campaigns: sendIcon,
  check: checkIcon,
  tasks: checkIcon,
  inbox: inboxIcon,
  file: fileTextIcon,
  templates: fileTextIcon,
  workflow: gitBranchIcon,
  cpu: cpuIcon,
  ai: cpuIcon,
  play: playIcon,
  mail: mailIcon,
  plug: plugIcon,
  connectors: plugIcon,
  database: databaseIcon,
  bell: bellIcon,
  notifications: bellIcon,
  billing: creditCardIcon,
  briefcase: briefcaseIcon,
  alert: triangleAlertIcon,
  exceptions: triangleAlertIcon,
  star: starIcon,
  calendar: calendarIcon,
  shield: shieldIcon,
  layers: layersIcon,
  wallet: walletIcon,
  trending: trendingUpIcon,
  cloud: cloudIcon,
  plus: plusIcon,
  globe: globeIcon,
  clock: clockIcon,
  archive: archiveIcon,
  flag: flagIcon,
  key: keyIcon,
  activity: activityIcon,
  rocket: rocketIcon,
  lock: lockIcon,
  heart: heartIcon,
  tag: tagIcon,
  'pie-chart': chartPieIcon,
  pie: chartPieIcon,
  sliders: slidersIcon,
  receipt: receiptIcon,
  'chart-line': chartLineIcon,
  'trending-up': trendingUpIcon,
  'dollar-sign': dollarSignIcon,
  dollar: dollarSignIcon,
  'help-circle': circleQuestionIcon,
  help: circleQuestionIcon,
  'log-out': doorOpenIcon,
  logout: doorOpenIcon,
  'door-open': doorOpenIcon,
  sun: sunIcon,
  moon: moonIcon,
}

export const DEFAULT_SIDEBAR_ITEMS: VSidebarItem[] = [
  { value: 'dashboard', label: 'Dashboard', icon: 'home', to: '/dashboard' },
  { value: 'analytics', label: 'Analytics', icon: 'analytics', to: '/analytics' },
  { value: 'projects', label: 'Projects', icon: 'projects', to: '/projects' },
  {
    value: 'team', label: 'Team', icon: 'team', defaultOpen: true, children: [
      { value: 'overview', label: 'Overview', to: '/team/overview' },
      { value: 'members', label: 'Members', to: '/team/members' },
      { value: 'settings', label: 'Settings', to: '/team/settings' },
    ]
  },
  { value: 'design-system', label: 'Design System', icon: 'design', to: '/design-system' },
  { value: 'integrations', label: 'Integrations', icon: 'integrations', to: '/integrations' },
  { value: 'settings', label: 'Settings', icon: 'settings', to: '/settings' },
]

function resolveSidebarIcon(icon?: string): IconifyIcon | undefined {
  if (!icon) return undefined
  return KEYLINE_ICONS[icon.toLowerCase()]
}

function resolveItems(
  items: VSidebarItem[],
  disabled: boolean,
  depth = 0,
  parent?: string,
): ResolvedVSidebarItem[] {
  return items.map((item) => {
    const type: VSidebarItemType =
      item.type === 'heading' ? 'heading' : item.type === 'group' ? 'group' : 'item'
    // Groups are containers: their children keep the group's depth (no extra indent).
    const childDepth = type === 'group' ? depth : depth + 1
    const children =
      type !== 'heading' && item.children?.length
        ? resolveItems(item.children, disabled, childDepth, item.value)
        : []
    return {
      value: item.value,
      label: item.label,
      type,
      icon: item.icon,
      href: item.href,
      to: item.to,
      badge: item.badge,
      badgeTone: item.badgeTone === 'primary' ? 'primary' : 'default',
      tag: item.tag,
      iconColor: item.iconColor,
      collapsible: type === 'group' ? item.collapsible !== false : true,
      defaultOpen: item.defaultOpen,
      disabled: disabled || Boolean(item.disabled),
      iconData: type === 'item' ? resolveSidebarIcon(item.icon ?? item.value) : undefined,
      hasChildren: type !== 'heading' && children.length > 0,
      children,
      depth,
      parent,
    }
  })
}

function collectDefaultExpanded(items: VSidebarItem[]): string[] {
  const out: string[] = []
  const walk = (list: VSidebarItem[]) => {
    for (const item of list) {
      if (item.children?.length && item.type !== 'heading') {
        const open = item.type === 'group' ? item.defaultOpen !== false : item.defaultOpen === true
        if (open) out.push(item.value)
        walk(item.children)
      }
    }
  }
  walk(items)
  return out
}

export function mountVSidebar(props: VSidebarProps) {
  const size: VSidebarSize = SIZES.includes(props.size as VSidebarSize)
    ? (props.size as VSidebarSize)
    : 'md'
  const variant: VSidebarVariant = VARIANTS.includes(props.variant as VSidebarVariant)
    ? (props.variant as VSidebarVariant)
    : 'default'
  const items = props.items ?? DEFAULT_SIDEBAR_ITEMS
  const disabled = Boolean(props.disabled)
  const resolvedItems = resolveItems(items, disabled)
  const collapsed = Boolean(props.collapsed ?? props.modelValue ?? false)
  const activeItem = props.activeItem ?? 'dashboard'
  const expandedSections = props.expandedSections ?? collectDefaultExpanded(items)
  const showSearch = props.showSearch ?? true
  const brandName = props.brandName ?? 'VueUI Nova'
  const brandIconData = resolveSidebarIcon(props.brandIcon ?? 'sparkle') ?? sparklesIcon
  const searchPlaceholder = props.searchPlaceholder ?? 'Search…'
  const searchShortcut = props.searchShortcut ?? '⌘K'
  const userName = props.userName ?? 'Alex Chen'
  const userEmail = props.userEmail ?? 'alex@nova.dev'
  const userAvatar = props.userAvatar ?? 'AC'

  return {
    size,
    variant,
    showBrand: props.showBrand ?? true,
    showFooter: props.showFooter ?? true,
    items,
    resolvedItems,
    disabled,
    collapsed,
    activeItem,
    expandedSections,
    accordion: props.accordion ?? true,
    accordionGroups: props.accordionGroups ?? false,
    filterOnSearch: props.filterOnSearch ?? true,
    groupChevron: (props.groupChevron === 'start' ? 'start' : 'end') as 'start' | 'end',
    groupChevronOpen: (props.groupChevronOpen === 'up' ? 'up' : 'down') as 'up' | 'down',
    chevron: (props.chevron === 'updown' ? 'updown' : 'rotate') as 'rotate' | 'updown',
    groupDividers: props.groupDividers ?? false,
    showSearch,
    brandName,
    brandIconData,
    searchPlaceholder,
    searchShortcut,
    userName,
    userEmail,
    userAvatar,
    ariaLabel: props.ariaLabel ?? 'Sidebar navigation',
  } as const
}
