<template>
  <div class="filter-card">
    <div class="filter-header">
      <h3 class="filter-title">
        <i class="bi bi-funnel" aria-hidden="true"></i>
        Bộ lọc
      </h3>
      <button v-if="hasActiveFilters" class="btn-reset" @click="resetFilters" aria-label="Xóa tất cả bộ lọc">
        <i class="bi bi-arrow-counterclockwise" aria-hidden="true"></i>
        <span>Xóa</span>
      </button>
    </div>

    <div class="filter-body">
      <!-- Category Filter -->
      <div class="filter-group">
        <label class="filter-label" for="category-select">
          <i class="bi bi-tag" aria-hidden="true"></i>
          Danh mục
          <span v-if="category !== 'Tất cả'" class="filter-active-badge">1</span>
        </label>
        <select id="category-select" class="filter-select" :value="category" @change="handleCategoryChange"
          aria-label="Chọn danh mục">
          <option value="Tất cả">Tất cả danh mục</option>
          <option value="CPU">💻 CPU - Bộ xử lý</option>
          <option value="RAM">🎯 RAM - Bộ nhớ</option>
          <option value="GPU">🎮 GPU - Card đồ họa</option>
          <option value="SSD">⚡ SSD - Ổ cứng SSD</option>
          <option value="HDD">💾 HDD - Ổ cứng</option>
        </select>
      </div>

      <!-- Price Range Filter -->
      <div class="filter-group">
        <label class="filter-label" for="price-select">
          <i class="bi bi-currency-dollar" aria-hidden="true"></i>
          Khoảng giá
          <span v-if="priceRange !== 'Tất cả'" class="filter-active-badge">1</span>
        </label>
        <select id="price-select" class="filter-select" :value="priceRange" @change="handlePriceChange"
          aria-label="Chọn khoảng giá">
          <option value="Tất cả">Tất cả mức giá</option>
          <option value="Dưới 2 triệu">💸 Dưới 2 triệu</option>
          <option value="2 – 5 triệu">💰 2 - 5 triệu</option>
          <option value="Trên 5 triệu">💎 Trên 5 triệu</option>
        </select>
      </div>

      <!-- Active Filters Summary -->
      <div v-if="hasActiveFilters" class="active-filters">
        <div class="active-filter-item" v-if="category !== 'Tất cả'">
          <span class="filter-tag">
            <i class="bi bi-tag-fill" aria-hidden="true"></i>
            {{ category }}
          </span>
          <button class="filter-tag-remove" @click="clearCategory" aria-label="Xóa bộ lọc danh mục">
            <i class="bi bi-x" aria-hidden="true"></i>
          </button>
        </div>
        <div class="active-filter-item" v-if="priceRange !== 'Tất cả'">
          <span class="filter-tag">
            <i class="bi bi-cash-stack" aria-hidden="true"></i>
            {{ priceRange }}
          </span>
          <button class="filter-tag-remove" @click="clearPriceRange" aria-label="Xóa bộ lọc giá">
            <i class="bi bi-x" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * Props Definition
 */
const props = defineProps<{
  category: string
  priceRange: string
}>()

/**
 * Emits Definition
 */
const emit = defineEmits<{
  'update:category': [value: string]
  'update:priceRange': [value: string]
}>()

/**
 * Computed Properties
 */
const hasActiveFilters = computed(() => {
  return props.category !== 'Tất cả' || props.priceRange !== 'Tất cả'
})

/**
 * Event Handlers
 */
const handleCategoryChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:category', target.value)
}

const handlePriceChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:priceRange', target.value)
}

const resetFilters = () => {
  emit('update:category', 'Tất cả')
  emit('update:priceRange', 'Tất cả')
}

const clearCategory = () => {
  emit('update:category', 'Tất cả')
}

const clearPriceRange = () => {
  emit('update:priceRange', 'Tất cả')
}
</script>

<style scoped>
/* CSS Custom Properties */
:root {
  --filter-bg: #ffffff;
  --filter-border: #e0e0e0;
  --filter-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  --primary-color: #0d6efd;
  --primary-hover: #0a58ca;
  --secondary-color: #6c757d;
  --danger-color: #dc3545;
  --success-color: #28a745;
  --text-color: #212529;
  --text-muted: #6c757d;
  --badge-bg: #0d6efd;
  --badge-text: #ffffff;
  --transition-speed: 0.3s;
  --border-radius: 12px;
}

/* Filter Card Container */
.filter-card {
  background: var(--filter-bg);
  border: 1px solid var(--filter-border);
  border-radius: var(--border-radius);
  box-shadow: var(--filter-shadow);
  overflow: hidden;
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Filter Header */
.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.filter-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
}

.filter-title i {
  font-size: 1.25rem;
}

.btn-reset {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
}

.btn-reset:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.btn-reset i {
  font-size: 1rem;
}

/* Filter Body */
.filter-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Filter Group */
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.filter-label i {
  color: var(--primary-color);
  font-size: 1rem;
}

.filter-active-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: var(--badge-bg);
  color: var(--badge-text);
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-left: auto;
}

.filter-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--filter-border);
  border-radius: 8px;
  font-size: 0.9375rem;
  color: var(--text-color);
  background: white;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
  padding-right: 2.5rem;
}

.filter-select:hover {
  border-color: var(--primary-color);
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

/* Active Filters */
.active-filters {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px dashed var(--filter-border);
}

.active-filter-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: rgba(13, 110, 253, 0.1);
  color: var(--primary-color);
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  flex: 1;
}

.filter-tag i {
  font-size: 0.875rem;
}

.filter-tag-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: transparent;
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
}

.filter-tag-remove:hover {
  background: var(--danger-color);
  color: white;
  transform: rotate(90deg);
}

.filter-tag-remove i {
  font-size: 1rem;
  font-weight: bold;
}

/* Responsive Design */
@media (max-width: 768px) {
  .filter-card {
    margin-bottom: 1.5rem;
  }

  .filter-header {
    padding: 0.875rem 1rem;
  }

  .filter-title {
    font-size: 1rem;
  }

  .filter-body {
    padding: 1rem;
    gap: 1.25rem;
  }

  .btn-reset span {
    display: none;
  }

  .btn-reset {
    padding: 0.375rem 0.5rem;
  }
}

/* Animation for filter changes */
.filter-select {
  animation: pulse 0.3s ease;
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.02);
  }
}
</style>