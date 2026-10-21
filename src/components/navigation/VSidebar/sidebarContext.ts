import type { InjectionKey, Slots } from 'vue'
import type { useVSidebar } from './useVSidebar'

export type VSidebarContext = ReturnType<typeof useVSidebar> & { slots: Slots }

export const VSIDEBAR_CONTEXT: InjectionKey<VSidebarContext> = Symbol('VSidebarContext')
