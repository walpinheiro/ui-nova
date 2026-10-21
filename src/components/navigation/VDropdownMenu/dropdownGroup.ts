import { inject, provide, type InjectionKey } from 'vue'

export interface DropdownGroupContext {
  register: (id: symbol, close: () => void) => void
  unregister: (id: symbol) => void
  notifyOpen: (id: symbol) => void
}

export const DROPDOWN_GROUP_KEY: InjectionKey<DropdownGroupContext> = Symbol('VDropdownMenuGroup')

export function createDropdownGroup(): DropdownGroupContext {
  const instances = new Map<symbol, () => void>()

  return {
    register(id, close) {
      instances.set(id, close)
    },
    unregister(id) {
      instances.delete(id)
    },
    notifyOpen(id) {
      for (const [key, close] of instances) {
        if (key !== id) close()
      }
    },
  }
}

export function provideDropdownGroup() {
  const group = createDropdownGroup()
  provide(DROPDOWN_GROUP_KEY, group)
  return group
}

export function useDropdownGroup() {
  return inject(DROPDOWN_GROUP_KEY, null)
}
