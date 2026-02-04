<template>
    <Teleport to="body">
        <div class="toast-container">
            <TransitionGroup name="toast">
                <div v-for="toast in toasts" :key="toast.id" class="toast"
                    :class="[`toast-${toast.type}`, { 'toast-dismissing': toast.dismissing }]"
                    @click="dismissToast(toast.id)">
                    <div class="toast-icon">
                        <i :class="getIcon(toast.type)" aria-hidden="true"></i>
                    </div>
                    <div class="toast-content">
                        <h4 v-if="toast.title" class="toast-title">{{ toast.title }}</h4>
                        <p class="toast-message">{{ toast.message }}</p>
                    </div>
                    <button class="toast-close" @click.stop="dismissToast(toast.id)" aria-label="Đóng">
                        <i class="bi bi-x" aria-hidden="true"></i>
                    </button>
                    <div class="toast-progress" :style="{ animationDuration: `${toast.duration}ms` }"></div>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

/**
 * Toast Types
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
    id: number
    type: ToastType
    title?: string
    message: string
    duration: number
    dismissing: boolean
}

/**
 * State
 */
const toasts = ref<Toast[]>([])
let idCounter = 0

/**
 * Get icon for toast type
 */
const getIcon = (type: ToastType): string => {
    const icons = {
        success: 'bi bi-check-circle-fill',
        error: 'bi bi-x-circle-fill',
        warning: 'bi bi-exclamation-triangle-fill',
        info: 'bi bi-info-circle-fill'
    }
    return icons[type]
}

/**
 * Show toast notification
 */
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
        duration,
        dismissing: false
    }

    toasts.value.push(toast)

    // Auto dismiss after duration
    setTimeout(() => {
        dismissToast(toast.id)
    }, duration)
}

/**
 * Dismiss toast
 */
const dismissToast = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
        toasts.value[index].dismissing = true
        setTimeout(() => {
            toasts.value.splice(index, 1)
        }, 300)
    }
}

/**
 * Expose methods for use in other components
 */
defineExpose({
    showToast,
    success: (message: string, title?: string) => showToast(message, 'success', title),
    error: (message: string, title?: string) => showToast(message, 'error', title),
    warning: (message: string, title?: string) => showToast(message, 'warning', title),
    info: (message: string, title?: string) => showToast(message, 'info', title)
})
</script>

<style scoped>
.toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 12px;
    pointer-events: none;
}

.toast {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    min-width: 320px;
    max-width: 420px;
    padding: 16px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    pointer-events: auto;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast:hover {
    transform: translateX(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.toast-icon {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.toast-success {
    border-left: 4px solid #28a745;
}

.toast-success .toast-icon {
    color: #28a745;
}

.toast-error {
    border-left: 4px solid #dc3545;
}

.toast-error .toast-icon {
    color: #dc3545;
}

.toast-warning {
    border-left: 4px solid #ffc107;
}

.toast-warning .toast-icon {
    color: #ffc107;
}

.toast-info {
    border-left: 4px solid #0d6efd;
}

.toast-info .toast-icon {
    color: #0d6efd;
}

.toast-content {
    flex: 1;
    min-width: 0;
}

.toast-title {
    margin: 0 0 4px;
    font-size: 14px;
    font-weight: 700;
    color: #212529;
}

.toast-message {
    margin: 0;
    font-size: 14px;
    color: #6c757d;
    line-height: 1.4;
    word-wrap: break-word;
}

.toast-close {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: 4px;
    color: #6c757d;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 18px;
}

.toast-close:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #212529;
}

.toast-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    width: 100%;
    background: currentColor;
    opacity: 0.3;
    animation: progress linear forwards;
    transform-origin: left;
}

@keyframes progress {
    from {
        transform: scaleX(1);
    }

    to {
        transform: scaleX(0);
    }
}

/* Toast Animations */
.toast-enter-active {
    animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-leave-active {
    animation: slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(100%);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideOut {
    from {
        opacity: 1;
        transform: translateX(0) scale(1);
    }

    to {
        opacity: 0;
        transform: translateX(100%) scale(0.8);
    }
}

.toast-dismissing {
    animation: slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Responsive */
@media (max-width: 480px) {
    .toast-container {
        left: 12px;
        right: 12px;
        top: 12px;
    }

    .toast {
        min-width: auto;
        max-width: none;
        width: 100%;
    }
}
</style>
