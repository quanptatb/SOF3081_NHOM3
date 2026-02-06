<template>
  <div class="cart-page">
    <div class="cart-container">
      <!-- Header -->
      <div class="cart-header">
        <h1 class="cart-title">
          <i class="bi bi-cart3" aria-hidden="true"></i>
          Giỏ hàng của bạn
        </h1>
        <p class="cart-subtitle" v-if="!isLoading && cartItems.length > 0">
          Bạn có <strong>{{ cartItems.length }}</strong> sản phẩm trong giỏ hàng
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Đang tải giỏ hàng...</p>
      </div>

      <!-- Empty Cart State -->
      <div v-else-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-icon">
          <i class="bi bi-cart-x" aria-hidden="true"></i>
        </div>
        <h2 class="empty-title">Giỏ hàng trống</h2>
        <p class="empty-description">
          Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá và thêm sản phẩm yêu thích!
        </p>
        <router-link to="/" class="btn-shop-now">
          <i class="bi bi-shop" aria-hidden="true"></i>
          Mua sắm ngay
        </router-link>
      </div>

      <!-- Cart Items -->
      <div v-else class="cart-content">
        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <div class="item-image">
              <img :src="item.image" :alt="item.name" />
            </div>

            <div class="item-details">
              <h3 class="item-name">{{ item.name }}</h3>
              <p class="item-category">
                <i class="bi bi-tag" aria-hidden="true"></i>
                {{ item.category }}
              </p>
              <p class="item-price">{{ formatPrice(item.price) }}</p>
            </div>

            <div class="item-quantity">
              <label class="quantity-label">Số lượng:</label>
              <div class="quantity-controls">
                <button class="qty-btn qty-decrease" @click="decreaseQuantity(item.id)" :disabled="item.quantity <= 1"
                  aria-label="Giảm số lượng">
                  <i class="bi bi-dash" aria-hidden="true"></i>
                </button>
                <input type="number" class="qty-input" :value="item.quantity" @input="updateQuantity(item.id, $event)"
                  min="1" max="99" aria-label="Số lượng sản phẩm" />
                <button class="qty-btn qty-increase" @click="increaseQuantity(item.id)" :disabled="item.quantity >= 99"
                  aria-label="Tăng số lượng">
                  <i class="bi bi-plus" aria-hidden="true"></i>
                </button>
              </div>
            </div>

            <div class="item-total">
              <span class="total-label">Thành tiền:</span>
              <span class="total-price">{{ formatPrice(item.price * item.quantity) }}</span>
            </div>

            <div class="item-remove">
              <button class="btn-remove" @click="confirmRemoveItem(item)" aria-label="Xóa sản phẩm khỏi giỏ hàng">
                <i class="bi bi-trash3" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="cart-summary">
          <div class="summary-card">
            <h3 class="summary-title">Tóm tắt đơn hàng</h3>

            <div class="summary-row">
              <span>Tạm tính:</span>
              <span class="summary-value">{{ formatPrice(subtotal) }}</span>
            </div>

            <div class="summary-row">
              <span>Giảm giá:</span>
              <span class="summary-value summary-discount">-{{ formatPrice(0) }}</span>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-row summary-total">
              <span>Tổng cộng:</span>
              <span class="summary-value">{{ formatPrice(totalAmount) }}</span>
            </div>

            <router-link to="/checkout" class="btn-checkout">
              <i class="bi bi-credit-card" aria-hidden="true"></i>
              Tiến hành thanh toán
            </router-link>
            
            <router-link to="/checkout" class="btn-checkout buy-now-main">
              <i class="bi bi-bag-check-fill" aria-hidden="true"></i>
              <strong>MUA NGAY TẤT CẢ</strong>
            </router-link>

            <router-link to="/" class="btn-continue">
              <i class="bi bi-arrow-left" aria-hidden="true"></i>
              Tiếp tục mua sắm
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

/**
 * Types
 */
interface CartItem {
  id: number
  name: string
  category: string
  price: number
  image: string
  quantity: number
}

/**
 * State
 */
const router = useRouter()
const cartItems = ref<CartItem[]>([])
const isLoading = ref(true)

/**
 * Computed Properties
 */
const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const totalAmount = computed(() => {
  return subtotal.value // Can add shipping, tax, etc. here
})

/**
 * Format price to VND
 */
const formatPrice = (price: number): string => {
  return price.toLocaleString('vi-VN') + ' ₫'
}

/**
 * Load cart from localStorage
 */
const loadCart = () => {
  try {
    const cartData = localStorage.getItem('cart')
    if (cartData) {
      cartItems.value = JSON.parse(cartData)
    }
  } catch (error) {
    console.error('Error loading cart:', error)
    cartItems.value = []
  } finally {
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }
}

/**
 * Save cart to localStorage
 */
const saveCart = () => {
  try {
    localStorage.setItem('cart', JSON.stringify(cartItems.value))
    window.dispatchEvent(new Event('storage'))
  } catch (error) {
    console.error('Error saving cart:', error)
  }
}

/**
 * Increase item quantity
 */
const increaseQuantity = (itemId: number) => {
  const item = cartItems.value.find(i => i.id === itemId)
  if (item && item.quantity < 99) {
    item.quantity++
    saveCart()
  }
}

/**
 * Decrease item quantity
 */
const decreaseQuantity = (itemId: number) => {
  const item = cartItems.value.find(i => i.id === itemId)
  if (item && item.quantity > 1) {
    item.quantity--
    saveCart()
  }
}

/**
 * Update quantity from input
 */
const updateQuantity = (itemId: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const newQuantity = parseInt(target.value) || 1

  const item = cartItems.value.find(i => i.id === itemId)
  if (item) {
    item.quantity = Math.max(1, Math.min(99, newQuantity))
    target.value = item.quantity.toString()
    saveCart()
  }
}

/**
 * Confirm and remove item
 */
const confirmRemoveItem = (item: CartItem) => {
  if (confirm(`Bạn có chắc muốn xóa "${item.name}" khỏi giỏ hàng?`)) {
    removeItem(item.id)
  }
}

/**
 * Remove item from cart
 */
const removeItem = (itemId: number) => {
  cartItems.value = cartItems.value.filter(item => item.id !== itemId)
  saveCart()
}

/**
 * Lifecycle
 */
onMounted(() => {
  loadCart()
})

const handleBuyNowAll = () => {
  // 1. Kiểm tra giỏ hàng có rỗng không
  if (cartItems.value.length === 0) {
    alert("Giỏ hàng của bạn đang rỗng!");
    return;
  }

  // 2. Kiểm tra đăng nhập (Ví dụ giả định)
  const isLoggedIn = localStorage.getItem('userToken');
  if (!isLoggedIn) {
    alert("Vui lòng đăng nhập để tiếp tục thanh toán");
    router.push('/login');
    return;
  }

  // 3. Nếu ổn thì đi đến trang thanh toán
  router.push('/checkout');
}
</script>

<style scoped>
/* CSS Custom Properties */
:root {
  --primary-color: #0d6efd;
  --primary-hover: #0a58ca;
  --danger-color: #dc3545;
  --success-color: #28a745;
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
.cart-page {
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
  background: var(--light-color);
}

.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.cart-header {
  margin-bottom: 2rem;
  text-align: center;
  animation: fadeIn 0.5s ease-out;
}

.cart-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: var(--dark-color);
  margin: 0 0 0.5rem;
}

.cart-title i {
  font-size: 2.25rem;
  color: var(--primary-color);
}

.cart-subtitle {
  color: var(--text-muted);
  margin: 0;
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

/* Empty Cart */
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  animation: fadeIn 0.5s ease-out;
}

.empty-icon {
  font-size: 5rem;
  color: var(--text-muted);
  opacity: 0.5;
  margin-bottom: 1.5rem;
}

.empty-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--dark-color);
  margin: 0 0 0.75rem;
}

.empty-description {
  color: var(--text-muted);
  max-width: 400px;
  margin: 0 0 2rem;
}

.btn-shop-now {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-speed) ease;
}

.btn-shop-now:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  color: white;
}

/* Cart Content */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
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

/* Cart Items */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr 180px 150px 50px;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-speed) ease;
}

.cart-item:hover {
  box-shadow: var(--shadow-md);
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--light-color);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
}

.item-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.item-name {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--dark-color);
  margin: 0;
}

.item-category {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
}

.item-price {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
}

.item-quantity {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quantity-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--dark-color);
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.qty-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  font-size: 1.125rem;
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
  width: 60px;
  height: 36px;
  text-align: center;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
}

.qty-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.item-total {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: right;
}

.total-label {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.total-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--success-color);
}

.item-remove {
  display: flex;
  justify-content: center;
}

.btn-remove {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: var(--danger-color);
  border: 2px solid var(--danger-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  font-size: 1.125rem;
}

.btn-remove:hover {
  background: var(--danger-color);
  color: white;
  transform: rotate(15deg) scale(1.1);
}

/* Cart Summary */
.summary-card {
  position: sticky;
  top: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
}

.summary-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--dark-color);
  margin: 0 0 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.summary-value {
  font-weight: 600;
  color: var(--dark-color);
}

.summary-discount {
  color: var(--danger-color);
}

.summary-divider {
  height: 1px;
  background: var(--border-color);
  margin: 1rem 0;
}

.summary-total {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
}

.btn-checkout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  margin-bottom: 0.75rem;
}

.btn-checkout:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  color: white;
}

.btn-continue {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem;
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  border-radius: var(--border-radius);
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-speed) ease;
}

.btn-continue:hover {
  background: var(--primary-color);
  color: white;
}

/* Responsive Design */
@media (max-width: 992px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .summary-card {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 80px 1fr;
    gap: 1rem;
    padding: 1rem;
  }

  .item-image {
    width: 80px;
    height: 80px;
  }

  .item-quantity,
  .item-total,
  .item-remove {
    grid-column: 2;
  }

  .item-quantity {
    margin-top: 0.5rem;
  }

  .item-remove {
    justify-content: flex-end;
  }
}

@media (max-width: 480px) {
  .cart-title {
    font-size: 1.5rem;
  }

  .cart-title i {
    font-size: 1.75rem;
  }

  .summary-card {
    padding: 1rem;
  }
}

.buy-now-main {
  background: linear-gradient(135deg, #ff4757, #ff6b81) !important; /* Màu đỏ gradient rực rỡ */
  border: none !important;
  font-size: 1.1rem !important;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4);
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.buy-now-main:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 6px 20px rgba(255, 71, 87, 0.6);
  filter: brightness(1.1);
}

.buy-now-main i {
  font-size: 1.3rem;
}
</style>
