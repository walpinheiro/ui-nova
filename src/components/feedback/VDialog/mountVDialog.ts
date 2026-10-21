import type { IconifyIcon } from '@iconify/types'
import bellIcon from '@iconify-icons/keyline-icons/bell'
import binIcon from '@iconify-icons/keyline-icons/bin'
import circleCheckIcon from '@iconify-icons/keyline-icons/circle-check'
import circleQuestionIcon from '@iconify-icons/keyline-icons/circle-question'
import triangleAlertIcon from '@iconify-icons/keyline-icons/triangle-alert'
import fileTextIcon from '@iconify-icons/keyline-icons/file-text'
import maximize2Icon from '@iconify-icons/keyline-icons/maximize-2'
import xIcon from '@iconify-icons/keyline-icons/x'
import type { VDialogIntent, VDialogProps, VDialogSize, VDialogVariant } from './VDialog.types'

const SIZES: VDialogSize[] = ['sm', 'md', 'lg']
const VARIANTS: VDialogVariant[] = ['basic', 'confirmation', 'alert', 'form', 'fullscreen']

export const V_DIALOG_CLOSE_ICON: IconifyIcon = xIcon

export const V_DIALOG_VARIANT_ICONS: Record<VDialogVariant, IconifyIcon> = {
  basic: bellIcon,
  confirmation: circleQuestionIcon,
  alert: triangleAlertIcon,
  form: fileTextIcon,
  fullscreen: maximize2Icon,
}

export const V_DIALOG_INTENT_ICONS: Record<VDialogIntent, IconifyIcon> = {
  neutral: circleQuestionIcon,
  destructive: binIcon,
  success: circleCheckIcon,
}

/** `alert` acknowledges something that already happened: warning icon unless it is a success. */
const V_DIALOG_ALERT_ICONS: Record<VDialogIntent, IconifyIcon> = {
  neutral: triangleAlertIcon,
  destructive: triangleAlertIcon,
  success: circleCheckIcon,
}

export function mountVDialog(props: VDialogProps) {
  const size: VDialogSize = SIZES.includes(props.size as VDialogSize) ? (props.size as VDialogSize) : 'md'
  const rawVariant = props.variant as string | undefined
  const legacy: Record<string, VDialogVariant> = {
    default: 'basic',
    primary: 'basic',
    subtle: 'basic',
  }
  const variant: VDialogVariant =
    (rawVariant && legacy[rawVariant]) ||
    (VARIANTS.includes(rawVariant as VDialogVariant) ? (rawVariant as VDialogVariant) : 'basic')
  const intent = props.intent ?? 'neutral'
  const open = Boolean(props.modelValue ?? props.open ?? false)
  const showConfirmActions = variant === 'confirmation' || variant === 'alert'
  // An alert is acknowledged, not decided: a single action, no cancel.
  const showCancel = variant === 'confirmation'

  return {
    size,
    variant,
    intent,
    open,
    showClose: props.showClose ?? true,
    dismissible: props.persistent ? false : (props.dismissible ?? true),
    persistent: Boolean(props.persistent),
    disabled: Boolean(props.disabled),
    loading: Boolean(props.loading),
    showConfirmActions,
    showCancel,
    cancelText: props.cancelText ?? 'Cancel',
    confirmText: props.confirmText ?? (variant === 'alert' ? 'OK' : 'Confirm'),
    iconData:
      variant === 'alert'
        ? V_DIALOG_ALERT_ICONS[intent]
        : showConfirmActions
          ? V_DIALOG_INTENT_ICONS[intent]
          : V_DIALOG_VARIANT_ICONS[variant],
    closeIcon: V_DIALOG_CLOSE_ICON,
  } as const
}
