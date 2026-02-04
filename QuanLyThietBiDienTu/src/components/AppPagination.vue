<template>
  <nav v-if="totalPages > 1" class="pagination-container" role="navigation" aria-label="Pagination">
    <ul class="pagination">
      <!-- First Page Button -->
      <li class="pagination-item">
        <button class="pagination-btn" :class="{ disabled: currentPage === 1 }" :disabled="currentPage === 1"
          @click="goToPage(1)" aria-label="Trang đầu" title="Trang đầu">
          <i class="bi bi-chevron-double-left" aria-hidden="true"></i>
        </button>
      </li>

      <!-- Previous Page Button -->
      <li class="pagination-item">
        <button class="pagination-btn" :class="{ disabled: currentPage === 1 }" :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)" aria-label="Trang trước" title="Trang trước">
          <i class="bi bi-chevron-left" aria-hidden="true"></i>
        </button>
      </li>

      <!-- Page Numbers -->
      <li v-for="page in visiblePages" :key="page" class="pagination-item">
        <button v-if="page !== '...'" class="pagination-btn pagination-number" :class="{ active: currentPage === page }"
          @click="goToPage(page)" :aria-label="`Trang ${page}`"
          :aria-current="currentPage === page ? 'page' : undefined">
          {{ page }}
        </button>
        <span v-else class="pagination-ellipsis" aria-hidden="true">
          ...
        </span>
      </li>

      <!-- Next Page Button -->
      <li class="pagination-item">
        <button class="pagination-btn" :class="{ disabled: currentPage === totalPages }"
          :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)" aria-label="Trang tiếp"
          title="Trang tiếp">
          <i class="bi bi-chevron-right" aria-hidden="true"></i>
        </button>
      </li>

      <!-- Last Page Button -->
      <li class="pagination-item">
        <button class="pagination-btn" :class="{ disabled: currentPage === totalPages }"
          :disabled="currentPage === totalPages" @click="goToPage(totalPages)" aria-label="Trang cuối"
          title="Trang cuối">
          <i class="bi bi-chevron-double-right" aria-hidden="true"></i>
        </button>
      </li>
    </ul>

    <!-- Page Info -->
    <div class="pagination-info">
      Trang <strong>{{ currentPage }}</strong> / <strong>{{ totalPages }}</strong>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * Props Definition
 */
const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

/**
 * Emits Definition
 */
const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

/**
 * Calculate visible page numbers with smart ellipsis
 */
const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const delta = 1 // Number of pages to show around current page

  // Show all pages if total is small
  if (props.totalPages <= 7) {
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i)
    }
    return pages
  }

  // Always show first page
  pages.push(1)

  // Calculate range around current page
  const rangeStart = Math.max(2, props.currentPage - delta)
  const rangeEnd = Math.min(props.totalPages - 1, props.currentPage + delta)

  // Add ellipsis if needed before range
  if (rangeStart > 2) {
    pages.push('...')
  }

  // Add range around current page
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i)
  }

  // Add ellipsis if needed after range
  if (rangeEnd < props.totalPages - 1) {
    pages.push('...')
  }

  // Always show last page
  if (props.totalPages > 1) {
    pages.push(props.totalPages)
  }

  return pages
})

/**
 * Navigate to specific page
 */
const goToPage = (page: number | string) => {
  if (typeof page === 'number' && page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page)
  }
}
</script>

<style scoped>
/* CSS Custom Properties */
:root {
  --pagination-bg: #ffffff;
  --pagination-border: #dee2e6;
  --pagination-hover: #e9ecef;
  --pagination-active: #0d6efd;
  --pagination-active-text: #ffffff;
  --pagination-disabled: #6c757d;
  --pagination-text: #212529;
  --transition-speed: 0.2s;
  --border-radius: 8px;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.08);
}

/* Pagination Container */
.pagination-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.5rem 0;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pagination List */
.pagination {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
  flex-wrap: wrap;
  justify-content: center;
}

.pagination-item {
  list-style: none;
}

/* Pagination Buttons */
.pagination-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0.5rem;
  background: var(--pagination-bg);
  color: var(--pagination-text);
  border: 2px solid var(--pagination-border);
  border-radius: var(--border-radius);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  box-shadow: var(--shadow-sm);
}

.pagination-btn:hover:not(.disabled):not(.active) {
  background: var(--pagination-hover);
  border-color: var(--pagination-active);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

.pagination-btn:active:not(.disabled) {
  transform: translateY(0);
}

/* Active Page */
.pagination-btn.active {
  background: var(--pagination-active);
  color: var(--pagination-active-text);
  border-color: var(--pagination-active);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
  cursor: default;
  pointer-events: none;
}

/* Disabled State */
.pagination-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

/* Page Number Buttons */
.pagination-number {
  min-width: 40px;
  font-weight: 700;
}

/* Ellipsis */
.pagination-ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  color: var(--pagination-disabled);
  font-weight: 700;
  user-select: none;
}

/* Pagination Info */
.pagination-info {
  font-size: 0.9375rem;
  color: var(--pagination-text);
  text-align: center;
}

.pagination-info strong {
  color: var(--pagination-active);
  font-weight: 700;
}

/* Icon Animations */
.pagination-btn i {
  transition: transform var(--transition-speed) ease;
}

.pagination-btn:hover:not(.disabled) i {
  transform: scale(1.2);
}

/* Responsive Design */
@media (max-width: 768px) {
  .pagination {
    gap: 0.375rem;
  }

  .pagination-btn {
    min-width: 36px;
    height: 36px;
    font-size: 0.875rem;
  }

  .pagination-number {
    min-width: 36px;
  }

  .pagination-ellipsis {
    min-width: 30px;
    height: 36px;
  }

  .pagination-info {
    font-size: 0.875rem;
  }

  /* Hide first/last buttons on very small screens */
  .pagination-item:first-child,
  .pagination-item:last-child {
    display: none;
  }
}

@media (max-width: 480px) {
  .pagination-btn {
    min-width: 32px;
    height: 32px;
    padding: 0.375rem;
    font-size: 0.8125rem;
  }

  .pagination-number {
    min-width: 32px;
  }
}

/* Keyboard Focus */
.pagination-btn:focus-visible {
  outline: 2px solid var(--pagination-active);
  outline-offset: 2px;
}

/* Loading State (Optional) */
.pagination-container.loading {
  opacity: 0.6;
  pointer-events: none;
}

/* Smooth Transition for Page Changes */
.pagination-btn {
  position: relative;
  overflow: hidden;
}

.pagination-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(13, 110, 253, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
}

.pagination-btn:active::before {
  width: 100%;
  height: 100%;
}
</style>