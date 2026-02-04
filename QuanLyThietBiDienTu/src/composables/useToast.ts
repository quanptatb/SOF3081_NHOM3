// Toast Notification Composable
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
    id: number
    type: ToastType
    title?: string
    message: string
    duration: number
}

const toasts = ref<Toast[]>([])
let idCounter = 0

export function useToast() {
    const showToast = (
        message: string,
        type: ToastType = 'info',
        title?: string,
        duration: number = 3000
    ) => {
        const toast: Toast = {
            id: ++idCounter,
            type,
            title,
            message,
            duration
        }

        toasts.value.push(toast)

        // Auto dismiss
        setTimeout(() => {
            dismissToast(toast.id)
        }, duration)

        return toast.id
    }

    const dismissToast = (id: number) => {
        const index = toasts.value.findIndex(t => t.id === id)
        if (index !== -1) {
            toasts.value.splice(index, 1)
        }
    }

    const success = (message: string, title: string = '✅ Thành công') => {
        return showToast(message, 'success', title)
    }

    const error = (message: string, title: string = '❌ Lỗi') => {
        return showToast(message, 'error', title, 4000)
    }

    const warning = (message: string, title: string = '⚠️ Cảnh báo') => {
        return showToast(message, 'warning', title)
    }

    const info = (message: string, title: string = 'ℹ️ Thông tin') => {
        return showToast(message, 'info', title)
    }

    return {
        toasts,
        showToast,
        dismissToast,
        success,
        error,
        warning,
        info
    }
}

// Global toast instance
let globalToast: ReturnType<typeof useToast> | null = null

export function initToast() {
    if (!globalToast) {
        globalToast = useToast()
    }
    return globalToast
}

export function toast() {
    if (!globalToast) {
        globalToast = initToast()
    }
    return globalToast
}
