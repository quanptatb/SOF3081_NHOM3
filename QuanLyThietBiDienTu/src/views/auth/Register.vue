<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Left Side - Form -->
      <div class="auth-form-container">
        <div class="auth-form">
          <h1 class="form-title">Đăng ký tài khoản</h1>
          <p class="form-subtitle">Tạo tài khoản mới để bắt đầu mua sắm</p>

          <form @submit.prevent="handleRegister" novalidate>
            <!-- Name Field -->
            <div class="form-group">
              <label for="name" class="form-label">
                Họ và tên <span class="required">*</span>
              </label>
              <div class="input-wrapper">
                <i class="bi bi-person input-icon" aria-hidden="true"></i>
                <input id="name" v-model="form.name" type="text" class="form-input" :class="{ 'invalid': errors.name }"
                  placeholder="Nguyễn Văn A" @blur="validateField('name')" @input="clearError('name')"
                  autocomplete="name" />
              </div>
              <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            </div>

            <!-- Email Field -->
            <div class="form-group">
              <label for="email" class="form-label">
                Email <span class="required">*</span>
              </label>
              <div class="input-wrapper">
                <i class="bi bi-envelope input-icon" aria-hidden="true"></i>
                <input id="email" v-model="form.email" type="email" class="form-input"
                  :class="{ 'invalid': errors.email }" placeholder="example@email.com" @blur="validateField('email')"
                  @input="clearError('email')" autocomplete="email" />
              </div>
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <!-- Password Field -->
            <div class="form-group">
              <label for="password" class="form-label">
                Mật khẩu <span class="required">*</span>
              </label>
              <div class="input-wrapper">
                <i class="bi bi-lock input-icon" aria-hidden="true"></i>
                <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
                  class="form-input" :class="{ 'invalid': errors.password }"
                  placeholder="Nhập mật khẩu (ít nhất 6 ký tự)" @blur="validateField('password')"
                  @input="clearError('password')" autocomplete="new-password" />
                <button type="button" class="password-toggle" @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'">
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'" aria-hidden="true"></i>
                </button>
              </div>
              <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
              <div class="password-strength" v-if="form.password">
                <div class="strength-bar" :class="passwordStrengthClass"></div>
                <span class="strength-text">{{ passwordStrengthText }}</span>
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn-submit" :disabled="isLoading">
              <span v-if="!isLoading">
                <i class="bi bi-person-plus" aria-hidden="true"></i>
                Đăng ký
              </span>
              <span v-else>
                <i class="bi bi-arrow-repeat spinning" aria-hidden="true"></i>
                Đang xử lý...
              </span>
            </button>
          </form>

          <!-- Divider -->
          <div class="divider">
            <span>hoặc</span>
          </div>

          <!-- Login Link -->
          <div class="auth-footer">
            <p>Đã có tài khoản?</p>
            <router-link to="/login" class="link-secondary">
              Đăng nhập ngay
            </router-link>
          </div>
        </div>
      </div>

      <!-- Right Side - Illustration -->
      <div class="auth-illustration">
        <div class="illustration-content">
          <div class="logo">
            <i class="bi bi-person-badge" aria-hidden="true"></i>
          </div>
          <h2>Tham gia cùng chúng tôi!</h2>
          <p>Đăng ký để trải nghiệm mua sắm tuyệt vời với hàng ngàn sản phẩm chất lượng</p>
          <div class="benefits">
            <div class="benefit-item">
              <i class="bi bi-check-circle-fill" aria-hidden="true"></i>
              <span>Miễn phí đăng ký</span>
            </div>
            <div class="benefit-item">
              <i class="bi bi-check-circle-fill" aria-hidden="true"></i>
              <span>Ưu đãi độc quyền</span>
            </div>
            <div class="benefit-item">
              <i class="bi bi-check-circle-fill" aria-hidden="true"></i>
              <span>Giao hàng nhanh chóng</span>
            </div>
            <div class="benefit-item">
              <i class="bi bi-check-circle-fill" aria-hidden="true"></i>
              <span>Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '../../composables/useToast'

/**
 * Router
 */
const router = useRouter()

/**
 * State
 */
const form = ref({
  name: '',
  email: '',
  password: '',
  role: 'user'
})

const showPassword = ref(false)
const isLoading = ref(false)
const errors = ref<{ name?: string; email?: string; password?: string }>({})

/**
 * Password Strength
 */
const passwordStrength = computed(() => {
  const pass = form.value.password
  if (!pass) return 0

  let strength = 0
  if (pass.length >= 6) strength++
  if (pass.length >= 8) strength++
  if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++
  if (/\d/.test(pass)) strength++
  if (/[^a-zA-Z0-9]/.test(pass)) strength++

  return Math.min(strength, 3)
})

const passwordStrengthClass = computed(() => {
  const classes = ['weak', 'medium', 'strong']
  return classes[passwordStrength.value - 1] || 'weak'
})

const passwordStrengthText = computed(() => {
  const texts = ['Yếu', 'Trung bình', 'Mạnh']
  return texts[passwordStrength.value - 1] || 'Yếu'
})

/**
 * Validation
 */
const validateName = (): boolean => {
  if (!form.value.name.trim()) {
    errors.value.name = 'Vui lòng nhập họ tên'
    return false
  }

  if (form.value.name.trim().length < 3) {
    errors.value.name = 'Họ tên phải có ít nhất 3 ký tự'
    return false
  }

  delete errors.value.name
  return true
}

const validateEmail = (): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!form.value.email.trim()) {
    errors.value.email = 'Vui lòng nhập email'
    return false
  }

  if (!emailRegex.test(form.value.email)) {
    errors.value.email = 'Email không hợp lệ'
    return false
  }

  delete errors.value.email
  return true
}

const validatePassword = (): boolean => {
  if (!form.value.password) {
    errors.value.password = 'Vui lòng nhập mật khẩu'
    return false
  }

  if (form.value.password.length < 6) {
    errors.value.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    return false
  }

  delete errors.value.password
  return true
}

const validateField = (field: 'name' | 'email' | 'password') => {
  if (field === 'name') return validateName()
  if (field === 'email') return validateEmail()
  if (field === 'password') return validatePassword()
  return true
}

const clearError = (field: 'name' | 'email' | 'password') => {
  delete errors.value[field]
}

const validateForm = (): boolean => {
  const nameValid = validateName()
  const emailValid = validateEmail()
  const passwordValid = validatePassword()
  return nameValid && emailValid && passwordValid
}

/**
 * Handle Register
 */
const handleRegister = async () => {
  // Validate form
  if (!validateForm()) {
    toast().warning('Vui lòng kiểm tra lại thông tin')
    return
  }

  isLoading.value = true

  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const users = JSON.parse(localStorage.getItem('users') || '[]')

    // Check if email already exists
    if (users.find((u: any) => u.email === form.value.email)) {
      toast().error('Email này đã được đăng ký', '❌ Đăng ký thất bại')
      errors.value.email = 'Email đã tồn tại'
      return
    }

    // Create new user
    const newUser = {
      ...form.value,
      id: Date.now()
    }

    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))

    toast().success(
      'Bạn có thể đăng nhập ngay bây giờ!',
      '✅ Đăng ký thành công'
    )

    // Redirect after short delay
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  } catch (error) {
    console.error('Register error:', error)
    toast().error('Có lỗi xảy ra, vui lòng thử lại')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* CSS Custom Properties */
:root {
  --primary-color: #0d6efd;
  --primary-hover: #0a58ca;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --light-color: #f8f9fa;
  --dark-color: #212529;
  --border-color: #dee2e6;
  --text-muted: #6c757d;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);
  --border-radius: 12px;
}

/* Page Layout */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.auth-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  width: 100%;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Form Side */
.auth-form-container {
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-form {
  width: 100%;
  max-width: 400px;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--dark-color);
  margin: 0 0 0.5rem;
}

.form-subtitle {
  color: var(--text-muted);
  margin: 0 0 2rem;
}

/* Form Groups */
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

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 1.125rem;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.form-input.invalid {
  border-color: var(--danger-color);
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1.125rem;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: var(--primary-color);
}

.error-message {
  display: block;
  color: var(--danger-color);
  font-size: 0.875rem;
  margin-top: 0.375rem;
}

/* Password Strength */
.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  height: 4px;
  border-radius: 2px;
  transition: all 0.3s ease;
  margin-bottom: 0.25rem;
}

.strength-bar.weak {
  width: 33%;
  background: var(--danger-color);
}

.strength-bar.medium {
  width: 66%;
  background: var(--warning-color);
}

.strength-bar.strong {
  width: 100%;
  background: var(--success-color);
}

.strength-text {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Submit Button */
.btn-submit {
  width: 100%;
  padding: 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.btn-submit:hover:not(:disabled) {
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Divider */
.divider {
  position: relative;
  text-align: center;
  margin: 2rem 0;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border-color);
}

.divider span {
  position: relative;
  background: white;
  padding: 0 1rem;
}

/* Footer Links */
.auth-footer {
  text-align: center;
}

.auth-footer p {
  color: var(--text-muted);
  margin: 0 0 0.5rem;
}

.link-secondary {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.link-secondary:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

/* Illustration Side */
.auth-illustration {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.illustration-content {
  text-align: center;
}

.logo {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  font-size: 2.5rem;
  backdrop-filter: blur(10px);
}

.illustration-content h2 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1rem;
}

.illustration-content p {
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 0 0 2rem;
}

.benefits {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.benefit-item i {
  font-size: 1.5rem;
  opacity: 0.9;
}

/* Responsive */
@media (max-width: 768px) {
  .auth-container {
    grid-template-columns: 1fr;
  }

  .auth-illustration {
    display: none;
  }

  .auth-form-container {
    padding: 2rem 1.5rem;
  }

  .form-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .auth-page {
    padding: 1rem 0.5rem;
  }

  .auth-form-container {
    padding: 1.5rem 1rem;
  }
}
</style>