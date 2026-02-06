<template>
  <div class="auth-page">
    <div class="container">
      <div class="row justify-content-center align-items-center h-100">
        <div class="col-xl-10">
          <div class="card border-0 shadow-lg overflow-hidden rounded-4">
            <div class="row g-0">
              
              <div class="col-lg-6 d-none d-lg-block bg-register-image">
                <div class="h-100 d-flex flex-column justify-content-center align-items-center text-white p-5 text-center overlay-content">
                  <div class="mb-4 icon-box">
                    <i class="bi bi-person-badge display-4"></i>
                  </div>
                  <h2 class="fw-bold mb-3">Tham gia cùng chúng tôi!</h2>
                  <p class="lead opacity-75">Tạo tài khoản ngay để trải nghiệm mua sắm tuyệt vời với hàng ngàn ưu đãi.</p>
                </div>
              </div>

              <div class="col-lg-6">
                <div class="p-5">
                  
                  <div class="text-center mb-5">
                    <h2 class="fw-bold text-dark">Đăng ký tài khoản</h2>
                    <p class="text-muted">Nhập thông tin để bắt đầu</p>
                  </div>

                  <form @submit.prevent="handleRegister" novalidate>
                    
                    <div class="form-floating mb-3">
                      <input 
                        type="text" 
                        class="form-control" 
                        id="floatingName" 
                        placeholder="Nguyễn Văn A"
                        v-model="form.name"
                        :class="{ 'is-invalid': errors.name }"
                        @input="clearError('name')"
                      >
                      <label for="floatingName"><i class="bi bi-person me-2"></i>Họ và tên</label>
                      <div class="invalid-feedback text-start">{{ errors.name }}</div>
                    </div>

                    <div class="form-floating mb-3">
                      <input 
                        type="email" 
                        class="form-control" 
                        id="floatingEmail" 
                        placeholder="name@example.com"
                        v-model="form.email"
                        :class="{ 'is-invalid': errors.email }"
                        @input="clearError('email')"
                      >
                      <label for="floatingEmail"><i class="bi bi-envelope me-2"></i>Email</label>
                      <div class="invalid-feedback text-start">{{ errors.email }}</div>
                    </div>

                    <div class="form-floating mb-3 position-relative">
                      <input 
                        :type="showPassword ? 'text' : 'password'" 
                        class="form-control" 
                        id="floatingPassword" 
                        placeholder="Password"
                        v-model="form.password"
                        :class="{ 'is-invalid': errors.password }"
                        @input="clearError('password')"
                      >
                      <label for="floatingPassword"><i class="bi bi-lock me-2"></i>Mật khẩu</label>
                      
                      <span class="position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer" 
                            @click="showPassword = !showPassword"
                            style="cursor: pointer; z-index: 10;">
                        <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'" class="text-muted"></i>
                      </span>
                      <div class="invalid-feedback text-start">{{ errors.password }}</div>
                    </div>

                    <button type="submit" class="btn btn-purple w-100 py-3 fw-bold shadow-sm mb-4" :disabled="isLoading">
                      <span v-if="!isLoading">Đăng ký</span>
                      <span v-else>
                        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Đang xử lý...
                      </span>
                    </button>

                    <div class="position-relative mb-4">
                      <hr class="text-muted opacity-25">
                      <span class="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                        hoặc đăng ký với
                      </span>
                    </div>

                    <button @click="handleGoogleLogin" type="button" class="btn btn-light-google w-100 py-2 border d-flex align-items-center justify-content-center mb-4" :disabled="isLoadingGoogle">
                      <svg class="me-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                        <path fill="#1976D2" d="M43.611,20.083L43.611,20.083c-0.251-1.267-0.389-2.576-0.389-3.917h-1.611H24v8h11.303c-0.814,2.298-2.316,4.244-4.113,5.762l6.19,5.238C41.332,31.424,44,26.16,44,20.083z"/>
                      </svg>
                      <span class="fw-medium text-secondary">Google</span>
                    </button>

                    <div class="text-center">
                      <p class="mb-0 text-muted">
                        Đã có tài khoản? 
                        <router-link to="/login" class="text-purple fw-bold text-decoration-none ms-1">
                          Đăng nhập ngay
                        </router-link>
                      </p>
                    </div>

                  </form>
                </div>
              </div>
            </div>
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
import { useGoogleAuth } from '../../composables/useGoogleAuth'
import axios from 'axios'

// --- API & CONFIG ---
const API_URL = 'http://localhost:3000/users'
const router = useRouter()
const { signInWithGoogle } = useGoogleAuth()

// --- STATE ---
const form = ref({
  name: '',
  email: '',
  password: '',
  role: 'user'
})
const showPassword = ref(false)
const isLoading = ref(false)
const isLoadingGoogle = ref(false)
const errors = ref<{ name?: string; email?: string; password?: string }>({})

// --- VALIDATION ---
const validateForm = (): boolean => {
  let isValid = true
  errors.value = {}

  if (!form.value.name.trim()) {
    errors.value.name = 'Vui lòng nhập họ tên'
    isValid = false
  } else if (form.value.name.trim().length < 3) {
    errors.value.name = 'Họ tên phải có ít nhất 3 ký tự'
    isValid = false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.value.email.trim()) {
    errors.value.email = 'Vui lòng nhập email'
    isValid = false
  } else if (!emailRegex.test(form.value.email)) {
    errors.value.email = 'Email không hợp lệ'
    isValid = false
  }

  if (!form.value.password) {
    errors.value.password = 'Vui lòng nhập mật khẩu'
    isValid = false
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    isValid = false
  }

  return isValid
}

const clearError = (field: 'name' | 'email' | 'password') => delete errors.value[field]

// --- REGISTER HANDLER ---
const handleRegister = async () => {
  if (!validateForm()) return

  isLoading.value = true
  try {
    const checkResponse = await axios.get(`${API_URL}?email=${form.value.email}`)
    if (checkResponse.data && checkResponse.data.length > 0) {
      toast().error('Email này đã được sử dụng', 'Đăng ký thất bại')
      errors.value.email = 'Email này đã tồn tại'
      return
    }

    const newUser = { ...form.value }
    await axios.post(API_URL, newUser)

    toast().success('Tạo tài khoản thành công!')
    
    setTimeout(() => {
      router.push('/login')
    }, 1000)

  } catch (error) {
    console.error(error)
    toast().error('Lỗi kết nối server!')
  } finally {
    isLoading.value = false
  }
}

// --- GOOGLE LOGIN HANDLER ---
const handleGoogleLogin = async () => {
  isLoadingGoogle.value = true
  try {
    const result = await signInWithGoogle()
    if (result.success && result.user) {
      localStorage.setItem("currentUser", JSON.stringify(result.user))
      toast().success(`Chào mừng ${result.user.name}!`)
      setTimeout(() => {
        router.push("/")
      }, 500)
    } else {
      toast().error("Đăng nhập Google thất bại")
    }
  } catch (error) {
    console.error(error)
    toast().error("Lỗi hệ thống")
  } finally {
    isLoadingGoogle.value = false
  }
}
</script>

<style scoped>
/* CSS Custom Properties */
:root {
  --primary-color: #6f42c1;
}

/* 1. STYLE CHUNG CHO TRANG */
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  padding: 2rem 0;
  /* Đã bỏ dòng font-family Poppins */
}

/* Ảnh nền bên trái */
.bg-register-image {
  background: url('https://images.unsplash.com/photo-1529539795054-3c162aabcc2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80') center center/cover no-repeat;
  position: relative;
}
.bg-register-image::before {
  content: "";
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to bottom right, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));
}
.overlay-content {
  position: relative;
  z-index: 1;
}

/* Icon Box */
.icon-box {
  width: 90px;
  height: 90px;
  background: rgba(255,255,255,0.2);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

/* Input Styles */
.form-floating > .form-control {
  border-radius: 12px;
  border: 1px solid #e1e1e1;
  padding-top: 1.625rem;
  padding-bottom: 0.625rem;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

.form-floating > .form-control:focus {
  border-color: #6f42c1;
  box-shadow: 0 0 0 4px rgba(111, 66, 193, 0.1);
}

.form-floating > label {
  color: #9ca3af;
  font-weight: 400;
}

/* Text Purple */
.text-purple {
  color: #6f42c1 !important;
  transition: color 0.3s;
}
.text-purple:hover {
  color: #5a32a3 !important;
  text-decoration: underline !important;
}

/* Button Purple */
.btn-purple {
  background: linear-gradient(to right, #6f42c1, #5a32a3);
  border: none;
  color: white;
  transition: all 0.3s ease;
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 6px -1px rgba(111, 66, 193, 0.2);
}
.btn-purple:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(111, 66, 193, 0.3);
  background: linear-gradient(to right, #7b4ecf, #663bb0);
}

/* Button Google */
.btn-light-google {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  transition: all 0.3s;
  font-weight: 500;
  color: #374151;
  border-radius: 12px;
}
.btn-light-google:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

h2 {
  letter-spacing: -0.5px;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
::-webkit-scrollbar-thumb {
  background: #c1c1c1; 
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8; 
}
</style>