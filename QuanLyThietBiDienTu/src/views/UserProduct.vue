<template>
  <div class="product-page">
    <!-- Search Bar -->
    <section class="search-section">
      <div class="search-container">
        <div class="search-wrapper">
          <i class="bi bi-search search-icon" aria-hidden="true"></i>
          <input type="text" class="search-input" placeholder="Tìm kiếm sản phẩm theo tên..." v-model="searchQuery"
            @input="handleSearchInput" aria-label="Tìm kiếm sản phẩm" />
          <button v-if="searchQuery" class="search-clear" @click="clearSearch" aria-label="Xóa tìm kiếm">
            <i class="bi bi-x-circle" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="content-section">
      <div class="content-container">
        <div class="layout-grid">
          <!-- Sidebar Filter -->
          <aside class="filter-sidebar" role="complementary">
            <ProductFilter v-model:category="category" v-model:priceRange="priceRange" />
          </aside>

          <!-- Products Area -->
          <main class="products-main" role="main">
            <!-- Controls Bar -->
            <div class="controls-bar">
              <div class="results-info">
                <span class="results-count" v-if="!isLoading">
                  {{ resultsSummary }}
                </span>
              </div>
              <div class="controls-actions">
                <select v-model="sortBy" class="sort-select" aria-label="Sắp xếp sản phẩm">
                  <option value="default">Mặc định</option>
                  <option value="name-asc">Tên: A-Z</option>
                  <option value="name-desc">Tên: Z-A</option>
                  <option value="price-asc">Giá: Thấp đến cao</option>
                  <option value="price-desc">Giá: Cao đến thấp</option>
                </select>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="loading-state">
              <div class="spinner"></div>
              <p>Đang tải sản phẩm...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="filteredProducts.length === 0" class="empty-state">
              <div class="empty-icon">
                <i class="bi bi-inbox" aria-hidden="true"></i>
              </div>
              <h3 class="empty-title">Không tìm thấy sản phẩm</h3>
              <p class="empty-description">
                {{ emptyStateMessage }}
              </p>
              <button v-if="hasActiveFilters" class="btn-reset-filters" @click="resetFilters">
                <i class="bi bi-arrow-counterclockwise" aria-hidden="true"></i>
                Xóa bộ lọc
              </button>
            </div>

            <!-- Products Grid -->
            <div v-else class="products-grid">
              <div v-for="product in paginatedProducts" :key="product.id" class="product-item">
                <ProductCard :product="product" @add-to-cart="handleAddToCart" />
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1 && !isLoading" class="pagination-wrapper">
              <AppPagination :current-page="currentPage" :total-pages="totalPages"
                @update:currentPage="handlePageChange" />
            </div>
          </main>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { products as sourceProducts } from '../data/products'

// Import Components
import ProductCard from '../components/ProductCard.vue'
import ProductFilter from '../components/ProductFilter.vue'
import AppPagination from '../components/AppPagination.vue'

/**
 * State Management
 */
const searchQuery = ref('')
const debouncedSearch = ref('')
const category = ref('Tất cả')
const priceRange = ref('Tất cả')
const sortBy = ref('default')
const currentPage = ref(1)
const isLoading = ref(true)

/**
 * Configuration
 */
const PAGE_SIZE = 9
const DEBOUNCE_DELAY = 300
let searchTimeout: ReturnType<typeof setTimeout> | null = null

/**
 * Products Data
 */
const products = ref(sourceProducts)

/**
 * Debounced Search Handler
 */
const handleSearchInput = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    debouncedSearch.value = searchQuery.value
  }, DEBOUNCE_DELAY)
}

/**
 * Clear Search
 */
const clearSearch = () => {
  searchQuery.value = ''
  debouncedSearch.value = ''
}

/**
 * Price Range Matching Logic
 */
const matchesPriceRange = (price: number, range: string): boolean => {
  switch (range) {
    case 'Dưới 2 triệu':
      return price < 2000000
    case '2 – 5 triệu':
      return price >= 2000000 && price <= 5000000
    case 'Trên 5 triệu':
      return price > 5000000
    default:
      return true
  }
}

/**
 * Filtered Products
 */
const filteredProducts = computed(() => {
  let filtered = products.value.filter((product) => {
    const matchName = product.name
      .toLowerCase()
      .includes(debouncedSearch.value.toLowerCase())
    const matchCategory =
      category.value === 'Tất cả' || product.category === category.value
    const matchPrice = matchesPriceRange(product.price, priceRange.value)

    return matchName && matchCategory && matchPrice
  })

  // Apply sorting
  if (sortBy.value !== 'default') {
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy.value) {
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        default:
          return 0
      }
    })
  }

  return filtered
})

/**
 * Pagination
 */
const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / PAGE_SIZE)
)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredProducts.value.slice(start, start + PAGE_SIZE)
})

/**
 * UI Helper Computed Properties
 */
const hasActiveFilters = computed(() => {
  return (
    debouncedSearch.value !== '' ||
    category.value !== 'Tất cả' ||
    priceRange.value !== 'Tất cả' ||
    sortBy.value !== 'default'
  )
})

const resultsSummary = computed(() => {
  const count = filteredProducts.value.length
  if (count === 0) return 'Không có sản phẩm'
  if (count === 1) return '1 sản phẩm'
  return `${count} sản phẩm`
})

const emptyStateMessage = computed(() => {
  if (debouncedSearch.value) {
    return `Không tìm thấy sản phẩm nào với từ khóa "${debouncedSearch.value}"`
  }
  if (category.value !== 'Tất cả' || priceRange.value !== 'Tất cả') {
    return 'Không có sản phẩm nào phù hợp với bộ lọc của bạn'
  }
  return 'Không có sản phẩm nào'
})

/**
 * Event Handlers
 */
const handlePageChange = (page: number) => {
  currentPage.value = page
  // Scroll to top of products
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const resetFilters = () => {
  searchQuery.value = ''
  debouncedSearch.value = ''
  category.value = 'Tất cả'
  priceRange.value = 'Tất cả'
  sortBy.value = 'default'
  currentPage.value = 1
}

const handleAddToCart = (product: any) => {
  try {
    // Get current cart from localStorage
    const cartData = localStorage.getItem('cart')
    const cart = cartData ? JSON.parse(cartData) : []

    // Check if product already in cart
    const existingIndex = cart.findIndex((item: any) => item.id === product.id)

    if (existingIndex >= 0) {
      // Increase quantity
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1
    } else {
      // Add new product
      cart.push({
        ...product,
        quantity: 1
      })
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart))

    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'))

    console.log('Đã thêm vào giỏ hàng:', product.name)
  } catch (error) {
    console.error('Lỗi khi thêm vào giỏ hàng:', error)
  }
}

/**
 * Watchers
 */
watch([debouncedSearch, category, priceRange, sortBy], () => {
  currentPage.value = 1
})

/**
 * Lifecycle
 */
onMounted(() => {
  // Simulate loading
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})
</script>

<style scoped>
/* CSS Custom Properties */
:root {
  --primary-color: #0d6efd;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --light-color: #f8f9fa;
  --dark-color: #212529;
  --border-color: #dee2e6;
  --transition-speed: 0.3s;
  --border-radius: 8px;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Layout */
.product-page {
  min-height: 100vh;
  background: var(--light-color);
}

/* Search Section */
.search-section {
  background: white;
  padding: 1.5rem 0;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.search-wrapper {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--secondary-color);
  font-size: 1.125rem;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.875rem 3rem 0.875rem 3rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: all var(--transition-speed) ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.search-clear {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--secondary-color);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  transition: color var(--transition-speed) ease;
}

.search-clear:hover {
  color: var(--danger-color);
}

/* Content Section */
.content-section {
  padding: 0 0 3rem;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.layout-grid {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

/* Filter Sidebar */
.filter-sidebar {
  position: sticky;
  top: 1rem;
  height: fit-content;
}

/* Products Main */
.products-main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Controls Bar */
.controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}

.results-info {
  display: flex;
  align-items: center;
}

.results-count {
  font-weight: 600;
  color: var(--dark-color);
}

.controls-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.sort-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: border-color var(--transition-speed) ease;
}

.sort-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}

.empty-icon {
  font-size: 4rem;
  color: var(--secondary-color);
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
}

.empty-description {
  color: var(--secondary-color);
  margin-bottom: 1.5rem;
}

.btn-reset-filters {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
}

.btn-reset-filters:hover {
  background: #0a58ca;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  animation: fadeIn 0.5s ease-out;
}

.product-item {
  animation: slideUp 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 2rem 0 1rem;
}

/* Responsive Design */
@media (max-width: 992px) {
  .layout-grid {
    grid-template-columns: 200px 1fr;
    gap: 1.5rem;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .layout-grid {
    grid-template-columns: 1fr;
  }

  .filter-sidebar {
    position: static;
  }

  .controls-bar {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .controls-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .sort-select {
    width: 100%;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 576px) {
  .search-section {
    padding: 1rem 0;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>