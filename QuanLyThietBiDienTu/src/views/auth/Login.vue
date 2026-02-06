<template>
  <div class="auth-page">
    <div class="container">
      <div class="row justify-content-center align-items-center h-100">
        <div class="col-xl-10">
          <div class="card border-0 shadow-lg overflow-hidden rounded-4">
            <div class="row g-0">
              
              <div class="col-lg-6 d-none d-lg-block bg-login-image">
                <div class="h-100 d-flex flex-column justify-content-center align-items-center text-white p-5 text-center overlay-content">
                  <div class="mb-4 icon-box">
                    <i class="bi bi-shop display-4"></i>
                  </div>
                  <h2 class="fw-bold mb-3">Chào mừng trở lại!</h2>
                  <p class="lead opacity-75">Kết nối và khám phá thế giới công nghệ cùng cộng đồng của chúng tôi.</p>
                </div>
              </div>

              <div class="col-lg-6">
                <div class="p-5">
                  <div class="text-center mb-5">
                    <h2 class="fw-bold text-dark">Đăng Nhập</h2>
                    <p class="text-muted">Nhập thông tin để truy cập tài khoản</p>
                  </div>

                  <form @submit.prevent="handleLogin" novalidate>
                    
                    <div class="form-floating mb-3">
                      <input 
                        type="email" 
                        class="form-control" 
                        id="floatingEmail" 
                        placeholder="name@example.com"
                        v-model="email"
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
                        v-model="password"
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

                    <div class="d-flex justify-content-between align-items-center mb-4">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="rememberMe">
                        <label class="form-check-label text-muted small" for="rememberMe">
                          Ghi nhớ đăng nhập
                        </label>
                      </div>
                      <a href="#" class="text-decoration-none small text-purple fw-bold">Quên mật khẩu?</a>
                    </div>

                    <button type="submit" class="btn btn-purple w-100 py-3 fw-bold shadow-sm mb-4" :disabled="isLoading">
                      <span v-if="!isLoading">Đăng Nhập</span>
                      <span v-else>
                        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Đang xử lý...
                      </span>
                    </button>

                    <div class="position-relative mb-4">
                      <hr class="text-muted opacity-25">
                      <span class="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                        hoặc đăng nhập với
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
                      <span class="text-muted">Chưa có tài khoản? </span>
                      <router-link to="/register" class="text-purple fw-bold text-decoration-none">Đăng ký ngay</router-link>
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "../../composables/useToast";
import { useGoogleAuth } from "../../composables/useGoogleAuth";
import axios from "axios";

// --- API & ROUTER SETUP ---
const API_URL = 'http://localhost:3000/users';
const router = useRouter();
const { signInWithGoogle } = useGoogleAuth();

// --- STATE MANAGEMENT ---
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const isLoadingGoogle = ref(false);
const errors = ref<{ email?: string; password?: string }>({});

// --- VALIDATION LOGIC ---
const validateForm = (): boolean => {
  let isValid = true;
  errors.value = {}; // Reset errors

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    errors.value.email = 'Vui lòng nhập email của bạn';
    isValid = false;
  } else if (!emailRegex.test(email.value)) {
    errors.value.email = 'Email không đúng định dạng';
    isValid = false;
  }

  if (!password.value) {
    errors.value.password = 'Vui lòng nhập mật khẩu';
    isValid = false;
  } else if (password.value.length < 3) {
    errors.value.password = 'Mật khẩu quá ngắn';
    isValid = false;
  }

  return isValid;
};

const clearError = (field: 'email' | 'password') => delete errors.value[field];

// --- LOGIN HANDLER ---
const handleLogin = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  try {
    // Gọi API kiểm tra user
    const { data } = await axios.get(`${API_URL}?email=${email.value}`);
    const user = data[0];

    if (!user) {
      errors.value.email = 'Email này chưa được đăng ký';
      toast().error('Tài khoản không tồn tại', 'Đăng nhập thất bại');
    } else if (user.password !== password.value) {
      errors.value.password = 'Mật khẩu không chính xác';
      toast().error('Sai mật khẩu', 'Đăng nhập thất bại');
    } else {
      // Thành công
      localStorage.setItem("currentUser", JSON.stringify(user));
      toast().success(`Chào mừng quay lại, ${user.name}!`);
      
      // Delay nhẹ để người dùng thấy thông báo
      setTimeout(() => {
        router.push(user.role === "admin" ? "/admin/users" : "/");
      }, 800);
    }
  } catch (err) {
    console.error(err);
    toast().error("Lỗi kết nối server!");
  } finally {
    isLoading.value = false;
  }
};

// --- GOOGLE LOGIN HANDLER ---
const handleGoogleLogin = async () => {
  isLoadingGoogle.value = true;
  try {
    const result = await signInWithGoogle();
    if (result.success && result.user) {
      localStorage.setItem("currentUser", JSON.stringify(result.user));
      toast().success(`Chào mừng ${result.user.name}!`);
      setTimeout(() => {
        router.push(result.user.role === "admin" ? "/admin/users" : "/");
      }, 800);
    } else {
      toast().error("Đăng nhập Google thất bại");
    }
  } catch (err) {
    console.error(err);
    toast().error("Lỗi hệ thống");
  } finally {
    isLoadingGoogle.value = false;
  }
};
</script>

<style scoped>
/* BACKGROUND TÍM GRADIENT */
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  padding: 2rem 0;
}

/* CỘT ẢNH BÊN TRÁI */
.bg-login-image {
  background: url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80') center center/cover no-repeat;
  position: relative;
}
/* Lớp phủ màu tím lên ảnh */
.bg-login-image::before {
  content: "";
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to bottom right, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));
}
.overlay-content {
  position: relative; /* Để nổi lên trên lớp phủ */
  z-index: 1;
}

/* CUSTOM INPUTS */
.form-floating > .form-control:focus {
  border-color: #6f42c1;
  box-shadow: 0 0 0 0.25rem rgba(111, 66, 193, 0.15);
}
.form-floating > label {
  color: #6c757d;
}

/* MÀU TÍM CUSTOM */
.text-purple {
  color: #6f42c1 !important;
  transition: color 0.3s;
}
.text-purple:hover {
  color: #5a32a3 !important;
}

/* BUTTONS */
.btn-purple {
  background-color: #6f42c1;
  border-color: #6f42c1;
  color: white;
  transition: all 0.3s ease;
  border-radius: 0.5rem; /* Bo tròn nút */
}
.btn-purple:hover {
  background-color: #5a32a3;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(111, 66, 193, 0.3);
}

.btn-light-google {
  background-color: #f8f9fa;
  border-color: #dee2e6;
  transition: all 0.3s;
}
.btn-light-google:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
}

/* ICON BOX */
.icon-box {
  width: 80px;
  height: 80px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
}
</style>