<template>
  <div class="checkout-page">
    <div class="checkout-container">
      <!-- Header -->
      <div class="checkout-header">
        <h1 class="checkout-title">
          <i class="bi bi-credit-card" aria-hidden="true"></i>
          Thanh toán
        </h1>
        <p class="checkout-subtitle">
          Vui lòng điền thông tin để hoàn tất đơn hàng
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Đang tải thông tin...</p>
      </div>

      <!-- Empty Cart Redirect -->
      <div v-else-if="cartItems.length === 0" class="empty-checkout">
        <div class="empty-icon">
          <i class="bi bi-cart-x" aria-hidden="true"></i>
        </div>
        <h2 class="empty-title">Giỏ hàng trống</h2>
        <p class="empty-description">
          Bạn cần thêm sản phẩm vào giỏ hàng trước khi thanh toán.
        </p>
        <router-link to="/" class="btn-shop-now">
          <i class="bi bi-shop" aria-hidden="true"></i>
          Mua sắm ngay
        </router-link>
      </div>

      <!-- Checkout Form -->
      <form v-else @submit.prevent="handleSubmit" class="checkout-form" novalidate>
        <div class="form-grid">
          <!-- Customer Information Section -->
          <div class="form-section">
            <h2 class="section-title">
              <i class="bi bi-person" aria-hidden="true"></i>
              Thông tin người nhận
            </h2>

            <div class="form-group">
              <label for="fullname" class="form-label">
                Họ và tên <span class="required">*</span>
              </label>
              <input id="fullname" v-model="formData.name" type="text" class="form-input"
                :class="{ 'invalid': errors.name }" placeholder="Nguyễn Văn A" @blur="validateField('name')"
                @input="clearError('name')" aria-required="true" />
              <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            </div>

            <div class="form-group">
              <label for="phone" class="form-label">
                Số điện thoại <span class="required">*</span>
              </label>
              <input id="phone" v-model="formData.phone" type="tel" class="form-input"
                :class="{ 'invalid': errors.phone }" placeholder="0912345678" @blur="validateField('phone')"
                @input="clearError('phone')" aria-required="true" />
              <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
            </div>

            <div class="form-group">
              <label for="address" class="form-label">
                Địa chỉ giao hàng <span class="required">*</span>
              </label>
              <textarea id="address" v-model="formData.address" class="form-textarea"
                :class="{ 'invalid': errors.address }" rows="3"
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố" @blur="validateField('address')"
                @input="clearError('address')" aria-required="true"></textarea>
              <span v-if="errors.address" class="error-message">{{ errors.address }}</span>
            </div>

            <div class="form-group">
              <label for="payment" class="form-label">
                Phương thức thanh toán <span class="required">*</span>
              </label>
              <div class="payment-options">
                <label class="payment-option">
                  <input type="radio" v-model="formData.payment" value="COD" name="payment" />
                  <div class="option-content">
                    <i class="bi bi-cash-coin" aria-hidden="true"></i>
                    <span>Thanh toán khi nhận hàng (COD)</span>
                  </div>
                </label>
                <label class="payment-option">
                  <input type="radio" v-model="formData.payment" value="BANK" name="payment" />
                  <div class="option-content">
                    <i class="bi bi-bank" aria-hidden="true"></i>
                    <span>Chuyển khoản ngân hàng</span>
                  </div>
                </label>
              </div>
            </div>

            <div class="form-group" v-if="formData.payment === 'BANK'">
              <div class="bank-info">
                <h4>Thông tin chuyển khoản:</h4>
                <p><strong>Ngân hàng:</strong> Vietcombank</p>
                <p><strong>Số tài khoản:</strong> 0123456789</p>
                <p><strong>Chủ tài khoản:</strong> Shop Điện Tử</p>
                <p><strong>Nội dung:</strong> [Mã đơn hàng] - [Họ tên]</p>
              </div>
            </div>

            <div class="form-group">
              <label for="note" class="form-label">
                Ghi chú (tùy chọn)
              </label>
              <textarea id="note" v-model="formData.note" class="form-textarea" rows="2"
                placeholder="Ghi chú thêm cho đơn hàng..."></textarea>
            </div>
          </div>

          <!-- Order Summary Section -->
          <div class="summary-section">
            <div class="summary-card">
              <h2 class="section-title">
                <i class="bi bi-receipt" aria-hidden="true"></i>
                Đơn hàng của bạn
              </h2>

              <div class="order-items">
                <div v-for="item in cartItems" :key="item.id" class="order-item">
                  <img :src="item.image" :alt="item.name" class="item-image" />
                  <div class="item-info">
                    <h4 class="item-name">{{ item.name }}</h4>
                    <p class="item-quantity">Số lượng: {{ item.quantity }}</p>
                  </div>
                  <div class="item-price">
                    {{ formatPrice(item.price * item.quantity) }}
                  </div>
                </div>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-row">
                <span>Tạm tính:</span>
                <span class="summary-value">{{ formatPrice(subtotal) }}</span>
              </div>

              <div class="summary-row">
                <span>Phí vận chuyển:</span>
                <span class="summary-value">{{ formatPrice(shippingFee) }}</span>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-row summary-total">
                <span>Tổng cộng:</span>
                <span class="summary-value">{{ formatPrice(totalAmount) }}</span>
              </div>

              <button type="submit" class="btn-submit" :disabled="isSubmitting">
                <span v-if="!isSubmitting">
                  <i class="bi bi-check-circle" aria-hidden="true"></i>
                  Xác nhận đặt hàng
                </span>
                <span v-else>
                  <i class="bi bi-arrow-repeat spinning" aria-hidden="true"></i>
                  Đang xử lý...
                </span>
              </button>

              <router-link to="/cart" class="btn-back">
                <i class="bi bi-arrow-left" aria-hidden="true"></i>
                Quay lại giỏ hàng
              </router-link>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Success Modal/Toast would go here -->
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

interface FormData {
  name: string
  phone: string
  address: string
  payment: string
  note: string
}

interface FormErrors {
  name?: string
  phone?: string
  address?: string
}

/**
 * State
 */
const router = useRouter()
const cartItems = ref<CartItem[]>([])
const isLoading = ref(true)
const isSubmitting = ref(false)

const formData = ref<FormData>({
  name: '',
  phone: '',
  address: '',
  payment: 'COD',
  note: ''
})

const errors = ref<FormErrors>({})

/**
 * Constants
 */
const SHIPPING_FEE = 30000 // 30,000 VND

/**
 * Computed Properties
 */
const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const shippingFee = computed(() => SHIPPING_FEE)

const totalAmount = computed(() => {
  return subtotal.value + shippingFee.value
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
 * Validation Functions
 */
const validateName = (): boolean => {
  if (!formData.value.name.trim()) {
    errors.value.name = 'Vui lòng nhập họ tên'
    return false
  }
  if (formData.value.name.trim().length < 3) {
    errors.value.name = 'Họ tên phải có ít nhất 3 ký tự'
    return false
  }
  delete errors.value.name
  return true
}

const validatePhone = (): boolean => {
  const phoneRegex = /^(0|\+84)[0-9]{9,10}$/
  if (!formData.value.phone.trim()) {
    errors.value.phone = 'Vui lòng nhập số điện thoại'
    return false
  }
  if (!phoneRegex.test(formData.value.phone.trim())) {
    errors.value.phone = 'Số điện thoại không hợp lệ (VD: 0912345678)'
    return false
  }
  delete errors.value.phone
  return true
}

const validateAddress = (): boolean => {
  if (!formData.value.address.trim()) {
    errors.value.address = 'Vui lòng nhập địa chỉ giao hàng'
    return false
  }
  if (formData.value.address.trim().length < 10) {
    errors.value.address = 'Địa chỉ quá ngắn, vui lòng nhập đầy đủ'
    return false
  }
  delete errors.value.address
  return true
}

const validateField = (field: keyof FormErrors) => {
  switch (field) {
    case 'name':
      return validateName()
    case 'phone':
      return validatePhone()
    case 'address':
      return validateAddress()
    default:
      return true
  }
}

const validateForm = (): boolean => {
  const nameValid = validateName()
  const phoneValid = validatePhone()
  const addressValid = validateAddress()

  return nameValid && phoneValid && addressValid
}

const clearError = (field: keyof FormErrors) => {
  delete errors.value[field]
}

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  // Validate form
  if (!validateForm()) {
    // Scroll to first error
    const firstError = Object.keys(errors.value)[0]
    document.getElementById(firstError)?.focus()
    return
  }

  isSubmitting.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Generate order ID
    const orderId = 'DH' + Math.floor(1000 + Math.random() * 9000)

    // Create order object
    const newOrder = {
      id: orderId,
      customerName: formData.value.name,
      phone: formData.value.phone,
      address: formData.value.address,
      payment: formData.value.payment,
      note: formData.value.note,
      total: totalAmount.value,
      date: new Date().toISOString(),
      status: 'Pending',
      items: cartItems.value
    }

    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('site_orders') || '[]')
    existingOrders.unshift(newOrder)
    localStorage.setItem('site_orders', JSON.stringify(existingOrders))

    // Clear cart
    localStorage.removeItem('cart')
    window.dispatchEvent(new Event('storage'))

    // Show success message (you can replace with a toast notification)
    alert(`✅ Đặt hàng thành công!\n\nMã đơn hàng: ${orderId}\nChúng tôi sẽ liên hệ với bạn sớm nhất!`)

    // Redirect to home
    router.push('/')
  } catch (error) {
    console.error('Error submitting order:', error)
    alert('❌ Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!')
  } finally {
    isSubmitting.value = false
  }
}

/**
 * Lifecycle
 */
onMounted(() => {
  loadCart()
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
.checkout-page {
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
  background: var(--light-color);
}

.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.checkout-header {
  text-align: center;
  margin-bottom: 2rem;
  animation: fadeIn 0.5s ease-out;
}

.checkout-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: var(--dark-color);
  margin: 0 0 0.5rem;
}

.checkout-title i {
  font-size: 2.25rem;
  color: var(--primary-color);
}

.checkout-subtitle {
  color: var(--text-muted);
  margin: 0;
}

/* Loading and Empty States */
.loading-state,
.empty-checkout {
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

.empty-icon {
  font-size: 5rem;
  color: var(--text-muted);
  opacity: 0.5;
  margin-bottom: 1.5rem;
}

.empty-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
}

.empty-description {
  color: var(--text-muted);
  margin: 0 0 2rem;
}

.btn-shop-now {
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
}

.btn-shop-now:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  color: white;
}

/* Checkout Form */
.checkout-form {
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
}

/* Form Section */
.form-section,
.summary-section {
  background: white;
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--dark-color);
  margin: 0 0 1.5rem;
}

.section-title i {
  color: var(--primary-color);
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--dark-color);
}

.required {
  color: var(--danger-color);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  transition: all var(--transition-speed) ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.form-input.invalid,
.form-textarea.invalid {
  border-color: var(--danger-color);
}

.error-message {
  display: block;
  color: var(--danger-color);
  font-size: 0.875rem;
  margin-top: 0.375rem;
}

/* Payment Options */
.payment-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.payment-option {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
}

.payment-option:hover {
  border-color: var(--primary-color);
  background: rgba(13, 110, 253, 0.05);
}

.payment-option input[type="radio"] {
  margin-right: 0.75rem;
  accent-color: var(--primary-color);
  width: 20px;
  height: 20px;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.option-content i {
  font-size: 1.25rem;
  color: var(--primary-color);
}

/* Bank Info */
.bank-info {
  padding: 1rem;
  background: rgba(13, 110, 253, 0.05);
  border-left: 4px solid var(--primary-color);
  border-radius: 6px;
}

.bank-info h4 {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  color: var(--primary-color);
}

.bank-info p {
  margin: 0.375rem 0;
  font-size: 0.9375rem;
}

/* Order Summary */
.summary-card {
  position: sticky;
  top: 1rem;
}

.order-items {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.order-item {
  display: grid;
  grid-template-columns: 60px 1fr auto;
  gap: 1rem;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  background: var(--light-color);
  border-radius: 8px;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: contain;
  border-radius: 6px;
  background: white;
  padding: 0.25rem;
}

.item-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-name {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: var(--dark-color);
}

.item-quantity {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
}

.item-price {
  display: flex;
  align-items: center;
  font-weight: 700;
  color: var(--primary-color);
}

.summary-divider {
  height: 1px;
  background: var(--border-color);
  margin: 1rem 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.summary-value {
  font-weight: 600;
}

.summary-total {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
}

/* Buttons */
.btn-submit {
  width: 100%;
  padding: 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1.0625rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  margin-bottom: 0.75rem;
}

.btn-submit:not(:disabled):hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

.btn-back {
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
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-speed) ease;
}

.btn-back:hover {
  background: var(--primary-color);
  color: white;
}

/* Responsive Design */
@media (max-width: 992px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .summary-card {
    position: static;
  }
}

@media (max-width: 480px) {
  .checkout-title {
    font-size: 1.5rem;
  }

  .form-section,
  .summary-section {
    padding: 1.5rem 1rem;
  }

  .section-title {
    font-size: 1.125rem;
  }
}
</style>