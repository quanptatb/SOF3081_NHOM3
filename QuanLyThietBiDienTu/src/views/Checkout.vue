<template>
  <div class="checkout-page">
    <div class="checkout-container">
      <div class="checkout-header">
        <h1 class="checkout-title">
          <i class="bi bi-credit-card-2-front-fill text-purple"></i>
          Thanh toán
        </h1>
        <p class="checkout-subtitle">
          Vui lòng điền thông tin để hoàn tất đơn hàng
        </p>
      </div>

      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Đang tải thông tin...</p>
      </div>

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

      <form v-else @submit.prevent="handleSubmit" class="checkout-form" novalidate>
        <div class="form-grid">
          <div class="form-section shadow-sm border-0">
            <h2 class="section-title text-purple">
              <i class="bi bi-person-vcard-fill me-2"></i>
              Thông tin người nhận
            </h2>

            <div class="form-group mb-4">
              <label for="fullname" class="form-label fw-bold">Họ và tên <span class="required">*</span></label>
              <div class="input-wrapper">
                <span class="input-icon"><i class="bi bi-person"></i></span>
                <input id="fullname" v-model="formData.name" type="text" class="form-control custom-input"
                  :class="{ 'is-invalid': errors.name }" placeholder="Nguyễn Văn A" @blur="validateField('name')"
                  @input="clearError('name')" aria-required="true" />
              </div>
              <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            </div>

            <div class="form-group mb-4">
              <label for="phone" class="form-label fw-bold">Số điện thoại <span class="required">*</span></label>
              <div class="input-wrapper">
                <span class="input-icon"><i class="bi bi-telephone"></i></span>
                <input id="phone" v-model="formData.phone" type="tel" class="form-control custom-input"
                  :class="{ 'is-invalid': errors.phone }" placeholder="0912345678" @blur="validateField('phone')"
                  @input="clearError('phone')" aria-required="true" />
              </div>
              <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
            </div>

            <div class="form-group mb-4">
              <label for="address" class="form-label fw-bold">Địa chỉ giao hàng <span class="required">*</span></label>
              <div class="input-wrapper">
                <span class="input-icon top-icon"><i class="bi bi-geo-alt"></i></span>
                <textarea id="address" v-model="formData.address" class="form-control custom-input"
                  :class="{ 'is-invalid': errors.address }" rows="3"
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  @blur="validateField('address')" @input="clearError('address')" aria-required="true"></textarea>
              </div>
              <span v-if="errors.address" class="error-message">{{ errors.address }}</span>
            </div>

            <div class="form-group mb-4">
              <label class="form-label fw-bold mb-3">Phương thức thanh toán <span class="required">*</span></label>
              <div class="payment-options">
                <label class="payment-option" :class="{ active: formData.payment === 'COD' }">
                  <input type="radio" v-model="formData.payment" value="COD" name="payment" hidden />
                  <div class="option-content">
                    <div class="radio-circle"></div>
                    <i class="bi bi-cash-stack text-success fs-4 me-2"></i>
                    <span>Thanh toán khi nhận hàng (COD)</span>
                  </div>
                </label>

                <label class="payment-option" :class="{ active: formData.payment === 'BANK' }">
                  <input type="radio" v-model="formData.payment" value="BANK" name="payment" hidden />
                  <div class="option-content">
                    <div class="radio-circle"></div>
                    <i class="bi bi-bank text-primary fs-4 me-2"></i>
                    <span>Chuyển khoản ngân hàng</span>
                  </div>
                </label>
              </div>
            </div>

            <div class="bank-info mt-3" v-if="formData.payment === 'BANK'">
              <div class="d-flex gap-3 align-items-start">
                <i class="bi bi-info-circle-fill text-purple fs-4 mt-1"></i>
                <div>
                  <h6 class="fw-bold text-purple mb-2">Thông tin chuyển khoản:</h6>
                  <p class="mb-1">Ngân hàng: <strong>Vietinbank</strong></p>
                  <p class="mb-1">Số tài khoản: <strong>0354006080</strong></p>
                  <p class="mb-1">Chủ tài khoản: <strong>Phạm Trần Anh Quân</strong></p>
                  <p class="mb-0 text-muted small">Nội dung: [Mã đơn hàng] - [Tên bạn]</p>
                </div>
              </div>
            </div>

            <div class="form-group mt-4">
              <label for="note" class="form-label fw-bold">Ghi chú (tùy chọn)</label>
              <div class="input-wrapper">
                <span class="input-icon top-icon"><i class="bi bi-pencil"></i></span>
                <textarea id="note" v-model="formData.note" class="form-control custom-input" rows="2"
                  placeholder="Ghi chú thêm cho đơn hàng..."></textarea>
              </div>
            </div>
          </div>

          <div class="summary-section shadow-sm border-0 h-100">
            <div class="summary-card">
              <h2 class="section-title text-dark">
                <i class="bi bi-bag-check-fill text-purple me-2"></i>
                Đơn hàng của bạn
              </h2>

              <div class="order-items custom-scrollbar">
                <div v-for="item in cartItems" :key="item.id" class="order-item">
                  <div class="position-relative me-3">
                    <img :src="item.image" :alt="item.name" class="item-image" />
                  </div>
                  <div class="item-info flex-grow-1">
                    <h4 class="item-name text-truncate" style="max-width: 180px;">{{ item.name }}</h4>
                    <p class="item-price text-purple mb-0">
                      {{ formatPrice(item.price) }}
                      <span class="text-muted small ms-1">x{{ item.quantity }}</span>
                    </p>
                  </div>
                  <div class="item-total fw-bold">
                    {{ formatPrice(item.price * item.quantity) }}
                  </div>
                </div>
              </div>

              <div class="summary-divider my-4"></div>

              <div class="summary-row">
                <span class="text-muted">Tạm tính:</span>
                <span class="summary-value">{{ formatPrice(subtotal) }}</span>
              </div>

              <div class="summary-row">
                <span class="text-muted">Phí vận chuyển:</span>
                <span class="summary-value text-success">{{ formatPrice(shippingFee) }}</span>
              </div>

              <div class="summary-divider my-3"></div>

              <div class="summary-row summary-total align-items-center">
                <span class="fs-5">Tổng cộng:</span>
                <span class="summary-value fs-3 text-purple">{{ formatPrice(totalAmount) }}</span>
              </div>

              <button type="submit" class="btn-submit mt-4" :disabled="isSubmitting">
                <span v-if="!isSubmitting">
                  <i class="bi bi-check-circle me-2"></i> Xác nhận đặt hàng
                </span>
                <span v-else>
                  <i class="bi bi-arrow-repeat spinning me-2"></i> Đang xử lý...
                </span>
              </button>

              <router-link to="/cart" class="btn-back mt-3">
                <i class="bi bi-arrow-left me-1"></i> Quay lại giỏ hàng
              </router-link>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { sendOrderConfirmation } from '../composables/useEmail'
import axios from 'axios'

/**
 * API Configuration
 */
const CART_API_URL = 'http://localhost:3000/carts'
const ORDERS_API_URL = 'http://localhost:3000/orders'
const PRODUCTS_API_URL = 'http://localhost:3000/products'

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
 * Load cart from API
 */
const loadCart = async () => {
  try {
    // Get current user from localStorage (session)
    const currentUserStr = localStorage.getItem('currentUser')
    if (!currentUserStr) {
      cartItems.value = []
      isLoading.value = false
      return
    }

    const currentUser = JSON.parse(currentUserStr)
    const userId = currentUser.id

    // Fetch cart from API
    const response = await axios.get(`${CART_API_URL}?userId=${userId}`)

    if (response.data && response.data.length > 0) {
      const cart = response.data[0]
      cartItems.value = cart.items || []
    } else {
      cartItems.value = []
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
 * Validate stock availability for all cart items
 */
const validateStock = async (): Promise<{ valid: boolean; errors: string[] }> => {
  const stockErrors: string[] = []

  try {
    // Check each item in cart
    for (const item of cartItems.value) {
      const response = await axios.get(`${PRODUCTS_API_URL}/${item.id}`)
      const product = response.data

      // Check if product exists
      if (!product) {
        stockErrors.push(`Sản phẩm "${item.name}" không tồn tại`)
        continue
      }

      // Check stock availability
      if (product.stock === 0) {
        stockErrors.push(`"${item.name}" đã hết hàng`)
      } else if (product.stock < item.quantity) {
        stockErrors.push(`"${item.name}" chỉ còn ${product.stock} sản phẩm (bạn đặt ${item.quantity})`)
      }
    }

    return {
      valid: stockErrors.length === 0,
      errors: stockErrors
    }
  } catch (error) {
    console.error('Stock validation error:', error)
    return {
      valid: false,
      errors: ['Không thể kiểm tra tồn kho. Vui lòng thử lại!']
    }
  }
}

/**
 * Handle form submission (API Version)
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
    // Validate stock before processing order
    const stockCheck = await validateStock()
    if (!stockCheck.valid) {
      alert('⚠️ Không thể đặt hàng:\n\n' + stockCheck.errors.join('\n'))
      isSubmitting.value = false
      return
    }

    // Get current user
    const currentUserStr = localStorage.getItem('currentUser')
    if (!currentUserStr) {
      alert('⚠️ Bạn cần đăng nhập để đặt hàng!')
      isSubmitting.value = false
      return
    }

    const currentUser = JSON.parse(currentUserStr)
    const userId = currentUser.id

    // Create order object
    const newOrder = {
      userId: userId,
      customerName: formData.value.name,
      phone: formData.value.phone,
      address: formData.value.address,
      payment: formData.value.payment,
      note: formData.value.note,
      total: totalAmount.value,
      createdAt: new Date().toISOString(),
      status: 'Pending',
      items: cartItems.value
    }

    // Save order to API
    const orderResponse = await axios.post(ORDERS_API_URL, newOrder)
    const orderId = orderResponse.data.id

    // Deduct stock for each item in the order
    for (const item of cartItems.value) {
      try {
        // Get current product
        const productResponse = await axios.get(`${PRODUCTS_API_URL}/${item.id}`)
        const product = productResponse.data

        // Calculate new stock
        const newStock = product.stock - item.quantity

        // Update product stock (ensure it doesn't go negative)
        await axios.patch(`${PRODUCTS_API_URL}/${item.id}`, {
          stock: Math.max(0, newStock)
        })
      } catch (error) {
        console.error(`Failed to update stock for product ${item.id}:`, error)
        // Continue with other items even if one fails
      }
    }

    // Clear cart from API
    const cartResponse = await axios.get(`${CART_API_URL}?userId=${userId}`)
    if (cartResponse.data && cartResponse.data.length > 0) {
      const cartId = cartResponse.data[0].id
      await axios.delete(`${CART_API_URL}/${cartId}`)
    }

    // Dispatch event to update navbar
    window.dispatchEvent(new Event('storage'))
    window.dispatchEvent(new Event('cart-updated'))

    // Send order confirmation email
    try {
      await sendOrderConfirmation({
        orderNumber: orderId,
        customerName: formData.value.name,
        items: cartItems.value,
        total: totalAmount.value,
        address: formData.value.address,
        payment: formData.value.payment
      }, currentUser.email)
    } catch (emailError) {
      console.error('⚠️ Failed to send email:', emailError)
    }

    // Show success message
    alert(`✅ Đặt hàng thành công!\n\nMã đơn hàng: #${orderId}`)

    // Redirect to home
    router.push('/')
  } catch (error) {
    console.error('Error submitting order:', error)
    alert('❌ Không thể đặt hàng. Vui lòng thử lại!')
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
/* CSS Variables - Tím Chủ Đạo */
:root {
  --primary-color: #6f42c1;
  --primary-hover: #5a32a3;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --light-bg: #f5f7fa;
  /* Màu nền trang */
  --input-bg: #f8f9fa;
  /* Màu nền input */
  --border-color: #e1e5eb;
  --text-dark: #343a40;
  --border-radius: 12px;
}

/* Helpers */
.text-purple {
  color: #6f42c1 !important;
}

.bg-purple {
  background-color: #6f42c1 !important;
}

/* Page Layout */
.checkout-page {
  min-height: calc(100vh - 80px);
  padding: 40px 0;
  background-color: #f5f7fa;
}

.checkout-container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 15px;
}

.checkout-header {
  text-align: center;
  margin-bottom: 40px;
}

.checkout-title {
  font-size: 2rem;
  font-weight: 800;
  color: #333;
  margin-bottom: 10px;
}

.checkout-subtitle {
  color: #6c757d;
}

/* --- CUSTOM INPUT STYLES (KHUNG NỀN NHẠT) --- */
.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0a0a0;
  font-size: 1.2rem;
  z-index: 2;
  transition: color 0.3s;
}

.input-icon.top-icon {
  top: 20px;
  /* Cho textarea */
}

/* Style cho Input/Textarea */
.custom-input {
  background-color: #f8f9fa;
  /* Nền xám nhạt */
  border: 1px solid #e1e5eb;
  border-radius: 10px;
  padding: 12px 15px 12px 45px;
  /* Padding trái né icon */
  font-size: 0.95rem;
  color: #495057;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

/* Hiệu ứng Focus */
.custom-input:focus {
  background-color: #ffffff;
  border-color: #6f42c1;
  box-shadow: 0 0 0 4px rgba(111, 66, 193, 0.1);
  outline: none;
}

/* Đổi màu icon khi focus */
.custom-input:focus+.input-icon,
.input-wrapper:focus-within .input-icon {
  color: #6f42c1;
}

/* Lỗi Validation */
.custom-input.is-invalid {
  border-color: #dc3545 !important;
  background-color: #fff8f8;
}

.error-message {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 5px;
  display: block;
}

.required {
  color: #dc3545;
}

/* Form Layout */
.form-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 30px;
}

.form-section,
.summary-section {
  background: white;
  padding: 30px;
  border-radius: 16px;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

/* Payment Options (Radio Custom) */
.payment-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.payment-option {
  cursor: pointer;
  display: block;
}

.option-content {
  display: flex;
  align-items: center;
  padding: 15px;
  border: 2px solid #e1e5eb;
  border-radius: 10px;
  transition: all 0.2s;
}

.radio-circle {
  width: 20px;
  height: 20px;
  border: 2px solid #adb5bd;
  border-radius: 50%;
  margin-right: 15px;
  position: relative;
  flex-shrink: 0;
}

/* Trạng thái Active của Payment */
.payment-option.active .option-content {
  border-color: #6f42c1;
  background-color: #f3f0ff;
}

.payment-option.active .radio-circle {
  border-color: #6f42c1;
}

.payment-option.active .radio-circle::after {
  content: '';
  width: 10px;
  height: 10px;
  background: #6f42c1;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Bank Info */
.bank-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
  border: 1px dashed #6f42c1;
}

/* Order Summary Items */
.order-items {
  max-height: 350px;
  overflow-y: auto;
  padding-right: 5px;
}

.order-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #eee;
}

.item-name {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.item-price {
  margin: 0;
  font-size: 0.9rem;
}

.summary-divider {
  height: 1px;
  background: #e1e5eb;
  border-top: 1px dashed #ccc;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 1rem;
}

.summary-value {
  font-weight: 700;
  color: #333;
}

/* Buttons */
.btn-submit {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 6px rgba(111, 66, 193, 0.2);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(111, 66, 193, 0.3);
  background: linear-gradient(135deg, #7b4ecf 0%, #663bb0 100%);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-back {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 15px;
  color: #6c757d;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
  padding: 10px;
}

.btn-back:hover {
  color: #6f42c1;
}

.btn-shop-now {
  display: inline-block;
  padding: 10px 25px;
  background: #6f42c1;
  color: white;
  border-radius: 50px;
  text-decoration: none;
  margin-top: 20px;
}

/* Empty & Loading */
.loading-state,
.empty-checkout {
  text-align: center;
  padding: 50px 20px;
  background: white;
  border-radius: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #eee;
  border-top-color: #6f42c1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Scrollbar nhỏ cho list items */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 10px;
}

/* Responsive */
@media (max-width: 992px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>