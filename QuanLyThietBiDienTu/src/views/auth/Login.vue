<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Left Side - Illustration -->
      <div class="auth-illustration">
        <div class="illustration-content">
          <div class="logo">
            <i class="bi bi-shop" aria-hidden="true"></i>
          </div>
          <h2>Chào mừng trở lại!</h2>
          <p>Đăng nhập để tiếp tục mua sắm các sản phẩm công nghệ tuyệt vời</p>
          <div class="features">
            <div class="feature-item">
              <i class="bi bi-shield-check" aria-hidden="true"></i>
              <span>Bảo mật cao</span>
            </div>
            <div class="feature-item">
              <i class="bi bi-lightning-fill" aria-hidden="true"></i>
              <span>Giao dịch nhanh</span>
            </div>
            <div class="feature-item">
              <i class="bi bi-award" aria-hidden="true"></i>
              <span>Uy tín đáng tin</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="auth-form-container">
        <div class="auth-form">
          <h1 class="form-title">Đăng nhập</h1>
          <p class="form-subtitle">Nhập thông tin để truy cập tài khoản</p>

          <form @submit.prevent="handleLogin" novalidate>
            <!-- Email Field -->
            <div class="form-group">
              <label for="email" class="form-label">
                Email <span class="required">*</span>
              </label>
              <div class="input-wrapper">
                <i class="bi bi-envelope input-icon" aria-hidden="true"></i>
                <input id="email" v-model="email" type="email" class="form-input" :class="{ 'invalid': errors.email }"
                  placeholder="example@email.com" @blur="validateField('email')" @input="clearError('email')"
                  autocomplete="email" />
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
                <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" class="form-input"
                  :class="{ 'invalid': errors.password }" placeholder="Nhập mật khẩu" @blur="validateField('password')"
                  @input="clearError('password')" autocomplete="current-password" />
                <button type="button" class="password-toggle" @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'">
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'" aria-hidden="true"></i>
                </button>
              </div>
              <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn-submit" :disabled="isLoading">
              <span v-if="!isLoading">
                <i class="bi bi-box-arrow-in-right" aria-hidden="true"></i>
                Đăng nhập
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

          <!-- Register Link -->
          <div class="auth-footer">
            <p>Chưa có tài khoản?</p>
            <router-link to="/register" class="link-secondary">
              Đăng ký ngay
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '../../composables/useToast'

/**
 * Router
 */
const router = useRouter()

/**
 * State
 */
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errors = ref < { email?: string; password?: string } > ({})

/**
 * Validation
 */
const validateEmail = (): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email.value.trim()) {
    errors.value.email = 'Vui lòng nhập email'
    return false
  }

  if (!emailRegex.test(email.value)) {
    errors.value.email = 'Email không hợp lệ'
    return false
  }

  delete errors.value.email
  return true
}

const validatePassword = (): boolean => {
  if (!password.value) {
    errors.value.password = 'Vui lòng nhập mật khẩu'
    return false
  }

  if (password.value.length < 3) {
    errors.value.password = 'Mật khẩu phải có ít nhất 3 ký tự'
    return false
  }

  delete errors.value.password
  return true
}

const validateField = (field: 'email' | 'password') => {
  if (field === 'email') return validateEmail()
  if (field === 'password') return validatePassword()
  return true
}

const clearError = (field: 'email' | 'password') => {
  delete errors.value[field]
}

const validateForm = (): boolean => {
  const emailValid = validateEmail()
  const passwordValid = validatePassword()
  return emailValid && passwordValid
}

/**
 * Handle Login
 */
const handleLogin = async () => {
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
    const adminAccount = {
      email: 'admin@gmail.com',
      password: '123',
      name: 'Admin',
      role: 'admin'
    }

    const allUsers = [...users, adminAccount]
    const user = allUsers.find(
      u => u.email === email.value && u.password === password.value
    )

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user))

      toast().success(
        `Chào mừng ${user.name}!`,
        '✅ Đăng nhập thành công'
      )

      // Redirect after short delay
      setTimeout(() => {
        if (user.role === 'admin') {
          router.push('/admin/users')
        } else {
          router.push('/')
        }
      }, 500)
    } else {
      toast().error('Email hoặc mật khẩu không chính xác', '❌ Đăng nhập thất bại')
    }
  } catch (error) {
    console.error('Login error:', error)
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

.features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.feature-item i {
  font-size: 1.5rem;
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