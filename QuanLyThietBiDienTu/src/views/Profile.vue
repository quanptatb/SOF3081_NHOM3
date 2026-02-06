<template>
    <div class="profile-page">
        <div class="profile-container">
            <!-- Header -->
            <div class="profile-header">
                <div class="avatar-section">
                    <div class="avatar">
                        <i class="bi bi-person-circle"></i>
                    </div>
                    <h1 class="user-name">{{ user?.name || 'Người dùng' }}</h1>
                    <p class="user-email">{{ user?.email || 'email@example.com' }}</p>
                </div>
            </div>

            <!-- User Information Card -->
            <div class="info-section">
                <div class="info-card">
                    <h2 class="section-title">
                        <i class="bi bi-info-circle"></i>
                        Thông tin cá nhân
                    </h2>

                    <div class="info-grid">
                        <div class="info-item">
                            <label>Họ và tên:</label>
                            <span>{{ user?.name || 'Chưa cập nhật' }}</span>
                        </div>

                        <div class="info-item">
                            <label>Email:</label>
                            <span>{{ user?.email || 'Chưa cập nhật' }}</span>
                        </div>

                        <div class="info-item">
                            <label>Vai trò:</label>
                            <span class="role-badge" :class="user?.role">
                                {{ user?.role === 'admin' ? 'Quản trị viên' : 'Người dùng' }}
                            </span>
                        </div>

                        <div class="info-item">
                            <label>Ngày tham gia:</label>
                            <span>{{ formatDate(user?.createdAt) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Orders History Card -->
                <div class="orders-card">
                    <h2 class="section-title">
                        <i class="bi bi-receipt"></i>
                        Lịch sử đơn hàng
                    </h2>

                    <div v-if="orders.length === 0" class="empty-orders">
                        <i class="bi bi-inbox"></i>
                        <p>Bạn chưa có đơn hàng nào</p>
                        <router-link to="/" class="btn-shop">Mua sắm ngay</router-link>
                    </div>

                    <div v-else class="orders-list">
                        <div v-for="order in orders" :key="order.id" class="order-item">
                            <div class="order-header">
                                <span class="order-id">#{{ order.id }}</span>
                                <span class="order-status" :class="order.status.toLowerCase()">
                                    {{ order.status }}
                                </span>
                            </div>

                            <div class="order-details">
                                <p><strong>Ngày đặt:</strong> {{ formatDate(order.createdAt) }}</p>
                                <p><strong>Tổng tiền:</strong> {{ formatPrice(order.total) }}</p>
                                <p><strong>Thanh toán:</strong> {{ order.payment === 'COD' ? 'COD' : 'Chuyển khoản' }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
                <router-link to="/" class="btn btn-secondary">
                    <i class="bi bi-house"></i>
                    Trang chủ
                </router-link>
                <button @click="handleLogout" class="btn btn-danger">
                    <i class="bi bi-box-arrow-right"></i>
                    Đăng xuất
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const user = ref(null)
const orders = ref([])

// Load user info from localStorage
const loadUserInfo = () => {
    const userStr = localStorage.getItem('currentUser')
    if (userStr) {
        user.value = JSON.parse(userStr)
    }
}

// Load user's orders from API
const loadOrders = async () => {
    try {
        if (!user.value) return

        const response = await axios.get(`http://localhost:3000/orders?userId=${user.value.id}`)
        orders.value = response.data || []
    } catch (error) {
        console.error('Error loading orders:', error)
        orders.value = []
    }
}

// Format date
const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN')
}

// Format price
const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' ₫'
}

// Handle logout
const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('currentUser')
        window.dispatchEvent(new Event('storage'))
        router.push('/login')
    }
}

// Lifecycle
onMounted(() => {
    loadUserInfo()
    loadOrders()
})
</script>

<style scoped>
.profile-page {
    min-height: calc(100vh - 200px);
    padding: 2rem 0;
    background: #f8f9fa;
}

.profile-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 1rem;
}

/* Header */
.profile-header {
    background: white;
    padding: 3rem 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    margin-bottom: 2rem;
    text-align: center;
}

.avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.avatar {
    font-size: 6rem;
    color: #0d6efd;
    line-height: 1;
}

.user-name {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    color: #212529;
}

.user-email {
    color: #6c757d;
    margin: 0;
}

/* Info Section */
.info-section {
    display: grid;
    gap: 2rem;
    margin-bottom: 2rem;
}

.info-card,
.orders-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.375rem;
    font-weight: 700;
    color: #212529;
    margin: 0 0 1.5rem;
}

.section-title i {
    color: #0d6efd;
    font-size: 1.5rem;
}

/* Info Grid */
.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.info-item label {
    font-weight: 600;
    color: #6c757d;
    font-size: 0.875rem;
}

.info-item span {
    font-size: 1rem;
    color: #212529;
}

.role-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
    width: fit-content;
}

.role-badge.admin {
    background: #0d6efd;
    color: white;
}

.role-badge.user {
    background: #28a745;
    color: white;
}

/* Orders */
.empty-orders {
    text-align: center;
    padding: 3rem 1rem;
    color: #6c757d;
}

.empty-orders i {
    font-size: 4rem;
    opacity: 0.5;
    margin-bottom: 1rem;
}

.empty-orders p {
    margin: 0 0 1.5rem;
    font-size: 1.125rem;
}

.btn-shop {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: #0d6efd;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-shop:hover {
    background: #0a58ca;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    color: white;
}

.orders-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.order-item {
    padding: 1.25rem;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #0d6efd;
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.order-id {
    font-weight: 700;
    color: #212529;
    font-size: 1.125rem;
}

.order-status {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
}

.order-status.pending {
    background: #ffc107;
    color: #000;
}

.order-status.completed {
    background: #28a745;
    color: white;
}

.order-status.cancelled {
    background: #dc3545;
    color: white;
}

.order-details p {
    margin: 0.5rem 0;
    color: #495057;
}

/* Action Buttons */
.action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 2rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s ease;
}

.btn-secondary {
    background: #6c757d;
    color: white;
}

.btn-secondary:hover {
    background: #5a6268;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    color: white;
}

.btn-danger {
    background: #dc3545;
    color: white;
}

.btn-danger:hover {
    background: #c82333;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* Responsive */
@media (max-width: 768px) {
    .info-grid {
        grid-template-columns: 1fr;
    }

    .action-buttons {
        flex-direction: column;
    }

    .btn {
        width: 100%;
        justify-content: center;
    }
}
</style>
