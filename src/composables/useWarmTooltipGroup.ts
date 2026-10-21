const WARM_DELAY = 400
const COOLDOWN_MS = 300

let warmUntil = 0
let cooldownTimer: ReturnType<typeof setTimeout> | null = null

export function useWarmTooltipGroup() {
  const isWarm = () => performance.now() < warmUntil

  const markWarm = () => {
    warmUntil = performance.now() + WARM_DELAY * 4
    if (cooldownTimer) clearTimeout(cooldownTimer)
    cooldownTimer = setTimeout(() => {
      warmUntil = 0
    }, COOLDOWN_MS)
  }

  const getShowDelay = (baseDelay = WARM_DELAY) => (isWarm() ? 0 : baseDelay)

  const onGroupEnter = () => markWarm()
  const onGroupLeave = () => {
    if (cooldownTimer) clearTimeout(cooldownTimer)
    cooldownTimer = setTimeout(() => {
      warmUntil = 0
    }, COOLDOWN_MS)
  }

  return { getShowDelay, onGroupEnter, onGroupLeave, isWarm }
}
