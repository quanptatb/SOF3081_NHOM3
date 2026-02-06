<template>
  <div class="product-card">
    <div class="product-image-wrapper">
      <img :src="product.image" :alt="product.name" class="product-image" @error="handleImageError" loading="lazy" />
      <div class="product-badge" v-if="isNew">
        <span>Mới</span>
      </div>
    </div>

    <div class="product-info">
      <h3 class="product-title">{{ product.name }}</h3>
      <p class="product-category">
        <i class="bi bi-tag" aria-hidden="true"></i>
        {{ product.category }}
      </p>
      <div class="product-price">
        <span class="price-value">{{ formatPrice(product.price) }}</span>
      </div>
    </div>

    <div class="product-actions">
      <button class="btn-add-cart" @click="handleAddToCart" aria-label="Thêm vào giỏ hàng">
        <i class="bi bi-cart-plus" aria-hidden="true"></i>
        <span>Thêm giỏ</span>
      </button>
      <router-link :to="`/productuser/${product.id}`" class="btn-detail" aria-label="Xem chi tiết sản phẩm">
        <i class="bi bi-eye" aria-hidden="true"></i>
        <span>Chi tiết</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * Props Definition
 */
interface Product {
  id: number
  name: string
  category: string
  price: number
  image: string
  createdAt?: string
}

const props = defineProps<{
  product: Product
}>()

/**
 * Emits Definition
 */
const emit = defineEmits<{
  'add-to-cart': [product: Product]
}>()

/**
 * Computed Properties
 */
const isNew = computed(() => {
  if (!props.product.createdAt) return false
  const createdDate = new Date(props.product.createdAt)
  const daysSinceCreation = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
  return daysSinceCreation < 7 // New if created within 7 days
})

/**
 * Format price to VND currency
 */
const formatPrice = (price: number): string => {
  return price.toLocaleString('vi-VN') + ' ₫'
}

/**
 * Handle image loading error
 */
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/300x300?text=No+Image'
}

/**
 * Handle add to cart action
 */
const handleAddToCart = () => {
  emit('add-to-cart', props.product)
}
</script>

<style scoped>
/* CSS Custom Properties */
:root {
  --card-bg: #ffffff;
  --card-border: #e0e0e0;
  --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  --card-shadow-hover: 0 8px 24px rgba(0, 0, 0, 0.15);
  --primary-color: #0d6efd;
  --primary-hover: #0a58ca;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --text-color: #212529;
  --text-muted: #6c757d;
  --badge-bg: #ff4757;
  --badge-text: #ffffff;
  --transition-speed: 0.3s;
  --border-radius: 12px;
}

/* Product Card Container */
.product-card {
  position: relative;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: all var(--transition-speed) cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--card-shadow-hover);
  border-color: var(--primary-color);
}

/* Image Section */
.product-image-wrapper {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform var(--transition-speed) ease;
}

.product-card:hover .product-image {
  transform: scale(1.1);
}

/* New Badge */
.product-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--badge-bg);
  color: var(--badge-text);
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(255, 71, 87, 0.4);
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Product Info Section */
.product-info {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.8em;
}

.product-category {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
}

.product-category i {
  font-size: 0.875rem;
}

.product-price {
  margin-top: auto;
  padding-top: 0.75rem;
}

.price-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
  display: block;
}

/* Actions Section */
.product-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  padding: 0 1rem 1rem;
}

.btn-add-cart,
.btn-detail {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  text-decoration: none;
}

.btn-add-cart {
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.btn-add-cart:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
}

.btn-add-cart:active {
  transform: translateY(0);
}

.btn-detail {
  background: var(--primary-color);
  color: white;
  border: 2px solid var(--primary-color);
}

.btn-detail:hover {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
  color: white;
}

.btn-detail:active {
  transform: translateY(0);
}

/* Icon Animations */
.btn-add-cart i,
.btn-detail i {
  transition: transform var(--transition-speed) ease;
}

.btn-add-cart:hover i {
  transform: scale(1.2);
}

.btn-detail:hover i {
  transform: translateX(4px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-image-wrapper {
    height: 200px;
  }

  .product-info {
    padding: 1rem;
  }

  .product-title {
    font-size: 0.9375rem;
  }

  .price-value {
    font-size: 1.125rem;
  }

  .product-actions {
    padding: 0 0.75rem 0.75rem;
  }

  .btn-add-cart,
  .btn-detail {
    font-size: 0.8125rem;
    padding: 0.5rem 0.75rem;
  }

  .btn-add-cart span,
  .btn-detail span {
    display: none;
  }

  .btn-add-cart i,
  .btn-detail i {
    font-size: 1.125rem;
  }
}

/* Loading State (Optional) */
.product-card.loading {
  pointer-events: none;
  opacity: 0.6;
}

.product-card.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>