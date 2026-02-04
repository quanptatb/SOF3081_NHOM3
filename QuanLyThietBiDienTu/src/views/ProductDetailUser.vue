<template>
  <div class="product-detail-page">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>Đang tải sản phẩm...</p>
    </div>

    <!-- Not Found State -->
    <div v-else-if="!product" class="not-found">
      <div class="not-found-icon">
        <i class="bi bi-box-seam" aria-hidden="true"></i>
      </div>
      <h2>Không tìm thấy sản phẩm</h2>
      <p>Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      <router-link to="/" class="btn-back-home">
        <i class="bi bi-arrow-left" aria-hidden="true"></i>
        Quay lại trang chủ
      </router-link>
    </div>

    <!-- Product Detail -->
    <div v-else class="detail-container">
      <!-- Breadcrumb -->
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <router-link to="/" class="breadcrumb-item">Trang chủ</router-link>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item">{{ product.category }}</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">{{ product.name }}</span>
      </nav>

      <!-- Main Product Section -->
      <div class="product-main">
        <!-- Image Gallery -->
        <div class="product-gallery">
          <div class="main-image">
            <img :src="currentImage" :alt="product.name" @error="handleImageError" />
            <div v-if="isNew" class="badge-new">Mới</div>
          </div>
          <div class="thumbnail-list" v-if="productImages.length > 1">
            <button v-for="(img, index) in productImages" :key="index" class="thumbnail"
              :class="{ active: currentImage === img }" @click="currentImage = img">
              <img :src="img" :alt="`${product.name} - Ảnh ${index + 1}`" />
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div class="product-info">
          <h1 class="product-title">{{ product.name }}</h1>

          <div class="product-meta">
            <span class="product-category">
              <i class="bi bi-tag" aria-hidden="true"></i>
              {{ product.category }}
            </span>
            <span class="product-id">Mã SP: #{{ product.id }}</span>
          </div>

          <div class="product-price">
            <span class="current-price">{{ formatPrice(product.price) }}</span>
          </div>

          <div class="product-description" v-if="productDescription">
            <h3>Mô tả sản phẩm</h3>
            <p>{{ productDescription }}</p>
          </div>

          <!-- Specifications -->
          <div class="product-specs" v-if="productSpecs">
            <h3>Thông số kỹ thuật</h3>
            <table class="specs-table">
              <tbody>
                <tr v-for="(value, key) in productSpecs" :key="key">
                  <th>{{ key }}</th>
                  <td>{{ value }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Suitable For -->
          <div class="product-suitable" v-if="productSuitable">
            <h3>Phù hợp cho</h3>
            <div class="suitable-tags">
              <span v-for="item in productSuitable" :key="item" class="tag">
                <i class="bi bi-check-circle" aria-hidden="true"></i>
                {{ item }}
              </span>
            </div>
          </div>

          <!-- Quantity Selector -->
          <div class="quantity-section">
            <label>Số lượng:</label>
            <div class="quantity-controls">
              <button class="qty-btn" @click="decreaseQuantity" :disabled="quantity <= 1" aria-label="Giảm số lượng">
                <i class="bi bi-dash" aria-hidden="true"></i>
              </button>
              <input type="number" v-model.number="quantity" min="1" max="99" class="qty-input" aria-label="Số lượng" />
              <button class="qty-btn" @click="increaseQuantity" :disabled="quantity >= 99" aria-label="Tăng số lượng">
                <i class="bi bi-plus" aria-hidden="true"></i>
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button class="btn-add-cart" @click="handleAddToCart">
              <i class="bi bi-cart-plus" aria-hidden="true"></i>
              Thêm vào giỏ hàng
            </button>
            <button class="btn-buy-now" @click="handleBuyNow">
              <i class="bi bi-lightning-fill" aria-hidden="true"></i>
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div class="related-products" v-if="relatedProducts.length > 0">
        <h2 class="section-title">
          <i class="bi bi-grid" aria-hidden="true"></i>
          Sản phẩm liên quan
        </h2>
        <div class="products-grid">
          <div v-for="relatedProduct in relatedProducts" :key="relatedProduct.id" class="related-product-card">
            <router-link :to="`/productuser/${relatedProduct.id}`" class="card-link">
              <div class="card-image">
                <img :src="relatedProduct.image" :alt="relatedProduct.name" />
              </div>
              <div class="card-info">
                <h4 class="card-title">{{ relatedProduct.name }}</h4>
                <p class="card-price">{{ formatPrice(relatedProduct.price) }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { products } from '../data/products'
import { toast } from '../composables/useToast'

/**
 * Router
 */
const route = useRoute()
const router = useRouter()

/**
 * State
 */
const isLoading = ref(true)
const quantity = ref(1)
const currentImage = ref('')

/**
 * Product data with full details
 */
const productData = [
  {
    id: 1,
    name: 'CPU Intel i5',
    category: 'CPU',
    price: 4500000,
    image: '/src/assets/images/inteli5.png',
    description: 'CPU Intel Core i5 thế hệ mới với hiệu năng vượt trội, phù hợp cho học tập, làm việc văn phòng và lập trình cơ bản. Tiết kiệm điện năng, ổn định trong mọi tác vụ.',
    specs: {
      'Nhân / Luồng': '6 nhân / 12 luồng',
      'Xung nhịp cơ bản': '3.2 GHz',
      'Xung nhịp tối đa': '4.4 GHz',
      'Socket': 'LGA 1700',
      'Cache': '12 MB',
      'TDP': '65W'
    },
    suitable: ['Học tập', 'Văn phòng', 'Lập trình cơ bản'],
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 2,
    name: 'CPU Intel i7',
    category: 'CPU',
    price: 6500000,
    image: '/src/assets/images/inteli7.png',
    description: 'CPU Intel Core i7 hiệu năng mạnh mẽ, xử lý đa nhiệm xuất sắc. Tối ưu cho gaming, thiết kế đồ họa và render video chuyên nghiệp.',
    specs: {
      'Nhân / Luồng': '8 nhân / 16 luồng',
      'Xung nhịp cơ bản': '3.6 GHz',
      'Turbo Boost': '5.0 GHz',
      'Socket': 'LGA 1700',
      'Cache': '16 MB',
      'TDP': '125W'
    },
    suitable: ['Gaming', 'Designer', 'Render', 'Lập trình'],
    createdAt: new Date().toISOString()
  },
  // Add other products following the same pattern...
  ...products.slice(2).map((p, idx) => ({
    ...p,
    description: `Sản phẩm ${p.name} chất lượng cao với hiệu năng tốt trong phân khúc. Phù hợp cho nhiều nhu cầu sử dụng khác nhau.`,
    specs: {
      'Thương hiệu': p.name.split(' ')[0],
      'Model': p.name,
      'Phân loại': p.category
    },
    suitable: ['Đa dụng'],
    createdAt: idx < 3 ? new Date().toISOString() : new Date('2023-12-01').toISOString()
  }))
]

/**
 * Computed
 */
const product = computed(() => {
  const id = Number(route.params.id)
  return productData.find(p => p.id === id)
})

const productSpecs = computed(() => product.value?.specs)
const productDescription = computed(() => product.value?.description)
const productSuitable = computed(() => product.value?.suitable)

const productImages = computed(() => {
  if (!product.value) return []
  // In a real app, you would have multiple images
  return [product.value.image]
})

const isNew = computed(() => {
  if (!product.value?.createdAt) return false
  const createdDate = new Date(product.value.createdAt)
  const daysSinceCreation = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
  return daysSinceCreation < 7
})

const relatedProducts = computed(() => {
  if (!product.value) return []
  return productData
    .filter(p => p.category === product.value!.category && p.id !== product.value!.id)
    .slice(0, 4)
})

/**
 * Methods
 */
const formatPrice = (price: number): string => {
  return price.toLocaleString('vi-VN') + ' ₫'
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/500x500?text=No+Image'
}

const increaseQuantity = () => {
  if (quantity.value < 99) quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--
}

const handleAddToCart = () => {
  if (!product.value) return

  try {
    const cartData = localStorage.getItem('cart')
    const cart = cartData ? JSON.parse(cartData) : []

    const existingIndex = cart.findIndex((item: any) => item.id === product.value!.id)

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity.value
    } else {
      cart.push({
        ...product.value,
        quantity: quantity.value
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('storage'))

    toast().success(
      `Đã thêm ${quantity.value} sản phẩm vào giỏ hàng`,
      '✅ Thành công'
    )

    quantity.value = 1
  } catch (error) {
    console.error('Error adding to cart:', error)
    toast().error('Không thể thêm sản phẩm vào giỏ hàng', '❌ Lỗi')
  }
}

const handleBuyNow = () => {
  handleAddToCart()
  setTimeout(() => {
    router.push('/cart')
  }, 500)
}

/**
 * Lifecycle
 */
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
    if (product.value) {
      currentImage.value = product.value.image
    }
  }, 500)
})
</script>

<style scoped>
/* CSS Custom Properties */
:root {
  --primary-color: #0d6efd;
  --primary-hover: #0a58ca;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --light-color: #f8f9fa;
  --dark-color: #212529;
  --border-color: #dee2e6;
  --text-muted: #6c757d;
  --transition-speed: 0.3s;
  --border-radius: 12px;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* Page Layout */
.product-detail-page {
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
  background: var(--light-color);
}

/* Loading & Not Found */
.loading-container,
.not-found {
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

.not-found-icon {
  font-size: 5rem;
  color: var(--text-muted);
  opacity: 0.5;
  margin-bottom: 1.5rem;
}

.btn-back-home {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: var(--primary-color);
  color: white;
  border-radius: var(--border-radius);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-speed) ease;
  margin-top: 1.5rem;
}

.btn-back-home:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  color: white;
}

/* Detail Container */
.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  animation: fadeIn 0.5s ease-out;
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

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.875rem;
}

.breadcrumb-item {
  color: var(--primary-color);
  text-decoration: none;
  transition: color var(--transition-speed) ease;
}

.breadcrumb-item:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

.breadcrumb-item.active {
  color: var(--text-muted);
  cursor: default;
}

.breadcrumb-separator {
  color: var(--text-muted);
}

/* Product Main */
.product-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  background: white;
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}

/* Gallery */
.product-gallery {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image {
  position: relative;
  width: 100%;
  height: 500px;
  background: var(--light-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.main-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.badge-new {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #ff4757;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
}

.thumbnail-list {
  display: flex;
  gap: 0.75rem;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  background: white;
  padding: 0.5rem;
}

.thumbnail:hover {
  border-color: var(--primary-color);
}

.thumbnail.active {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.2);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Product Info */
.product-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.product-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--dark-color);
  margin: 0;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.product-category {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: rgba(13, 110, 253, 0.1);
  color: var(--primary-color);
  border-radius: 6px;
  font-weight: 600;
}

.product-id {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.product-price {
  padding: 1.5rem 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.current-price {
  font-size: 2rem;
  font-weight: 700;
  color: var(--danger-color);
}

.product-description h3,
.product-specs h3,
.product-suitable h3 {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
}

.product-description p {
  color: var(--text-muted);
  line-height: 1.6;
}

.specs-table {
  width: 100%;
  border-collapse: collapse;
}

.specs-table th,
.specs-table td {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  text-align: left;
}

.specs-table th {
  background: var(--light-color);
  font-weight: 600;
  width: 40%;
}

.suitable-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: rgba(40, 167, 69, 0.1);
  color: var(--success-color);
  border-radius: 6px;
  font-weight: 600;
}

/* Quantity */
.quantity-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quantity-section label {
  font-weight: 600;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.qty-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
}

.qty-btn:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: scale(1.1);
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qty-input {
  width: 80px;
  height: 40px;
  text-align: center;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-add-cart,
.btn-buy-now {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
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
  box-shadow: var(--shadow-md);
}

.btn-buy-now {
  background: var(--primary-color);
  color: white;
}

.btn-buy-now:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Related Products */
.related-products {
  margin-top: 3rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.section-title i {
  color: var(--primary-color);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.related-product-card {
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-speed) ease;
}

.related-product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.card-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.card-image {
  height: 200px;
  background: var(--light-color);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.card-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.card-info {
  padding: 1rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: var(--dark-color);
}

.card-price {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
}

/* Responsive */
@media (max-width: 992px) {
  .product-main {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .main-image {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .product-title {
    font-size: 1.5rem;
  }

  .current-price {
    font-size: 1.5rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .main-image {
    height: 300px;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
