<template>
  <div class="orders-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <i class="bi bi-receipt" aria-hidden="true"></i>
          Quản lý đơn hàng
        </h1>
        <p class="page-subtitle">Theo dõi và cập nhật trạng thái đơn hàng</p>
      </div>
      <div class="header-actions">
        <button class="btn-refresh" @click="loadOrders" :disabled="isLoading">
          <i class="bi bi-arrow-clockwise" :class="{ spinning: isLoading }" aria-hidden="true"></i>
          Làm mới
        </button>
        <button class="btn-reset" @click="resetData">
          <i class="bi bi-trash" aria-hidden="true"></i>
          Reset dữ liệu
        </button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon stat-total">
          <i class="bi bi-receipt-cutoff" aria-hidden="true"></i>
        </div>
        <div class="stat-info">
          <h3>{{ totalOrders }}</h3>
          <p>Tổng đơn hàng</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon stat-pending">
          <i class="bi bi-clock-history" aria-hidden="true"></i>
        </div>
        <div class="stat-info">
          <h3>{{ pendingOrders }}</h3>
          <p>Chờ xử lý</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon stat-revenue">
          <i class="bi bi-currency-dollar" aria-hidden="true"></i>
        </div>
        <div class="stat-info">
          <h3>{{ formatCurrency(totalRevenue) }}</h3>
          <p>Tổng doanh thu</p>
        </div>
      </div>
    </div>

    <div class="filters-bar">
      <div class="filter-group">
        <label>Trạng thái:</label>
        <select v-model="filterStatus" class="filter-select">
          <option value="">Tất cả</option>
          <option value="Pending">Chờ xử lý</option>
          <option value="Confirmed">Đã xác nhận</option>
          <option value="Shipping">Đang vận chuyển</option>
          <option value="Delivered">Đã giao hàng</option>
          <option value="Cancelled">Đã hủy</option>
        </select>
      </div>

      <div class="filter-group flex-grow-1">
        <label>Tìm kiếm:</label>
        <div class="search-wrapper">
          <i class="bi bi-search search-icon"></i>
          <input v-model="searchQuery" type="text" class="filter-search"
            placeholder="Tìm theo mã đơn, tên khách hàng, số điện thoại..." />
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Đang tải đơn hàng...</p>
    </div>

    <div v-else-if="filteredOrders.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="bi bi-inbox" aria-hidden="true"></i>
      </div>
      <h3>Chưa có đơn hàng nào</h3>
      <p v-if="searchQuery || filterStatus">
        Không tìm thấy đơn hàng phù hợp với bộ lọc
      </p>
      <p v-else>
        Hiện tại chưa có đơn hàng nào trong hệ thống
      </p>
    </div>

    <div v-else class="orders-table-container">
      <table class="orders-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Số điện thoại</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Phương thức</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in paginatedOrders" :key="order.id" class="order-row">
            <td class="order-id">
              <strong>#{{ order.id }}</strong>
            </td>
            <td>
              <div class="customer-info">
                <div class="customer-name">{{ order.customerName }}</div>
                <div class="customer-address">{{ order.address }}</div>
              </div>
            </td>
            <td>{{ order.phone }}</td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td class="order-total">{{ formatCurrency(order.total) }}</td>
            <td>
              <span class="payment-badge" :class="`payment-${order.payment?.toLowerCase() || 'cod'}`">
                {{ order.payment === 'COD' ? '💵 COD' : '🏦 Chuyển khoản' }}
              </span>
            </td>
            <td>
              <select v-model="order.status" class="status-select" :class="`status-${order.status.toLowerCase()}`"
                @change="updateOrderStatus(order)">
                <option value="Pending">⏳ Chờ xử lý</option>
                <option value="Confirmed">✅ Đã xác nhận</option>
                <option value="Shipping">🚚 Đang vận chuyển</option>
                <option value="Delivered">🎉 Đã giao hàng</option>
                <option value="Cancelled">❌ Đã hủy</option>
              </select>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn-action btn-view" @click="viewOrderDetails(order)" title="Xem chi tiết">
                  <i class="bi bi-eye" aria-hidden="true"></i>
                </button>
                <button class="btn-action btn-delete" @click="confirmDeleteOrder(order)" title="Xóa đơn">
                  <i class="bi bi-trash" aria-hidden="true"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination" v-if="totalPages > 1">
        <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
          <i class="bi bi-chevron-left me-1"></i> Trước
        </button>
        
        <div class="page-info">
          Trang <span class="fw-bold text-purple">{{ currentPage }}</span> / {{ totalPages }}
        </div>
        
        <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
          Sau <i class="bi bi-chevron-right ms-1"></i>
        </button>
      </div>
    </div>

    <div v-if="selectedOrder" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Chi tiết đơn hàng #{{ selectedOrder.id }}</h2>
          <button class="btn-close" @click="closeModal">
            <i class="bi bi-x" aria-hidden="true"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="detail-section">
            <h3>Thông tin khách hàng</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <strong>Họ tên:</strong>
                <span>{{ selectedOrder.customerName }}</span>
              </div>
              <div class="detail-item">
                <strong>Số điện thoại:</strong>
                <span>{{ selectedOrder.phone }}</span>
              </div>
              <div class="detail-item">
                <strong>Địa chỉ:</strong>
                <span>{{ selectedOrder.address }}</span>
              </div>
              <div class="detail-item" v-if="selectedOrder.note">
                <strong>Ghi chú:</strong>
                <span>{{ selectedOrder.note }}</span>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h3>Sản phẩm đã đặt</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selectedOrder.items" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ formatCurrency(item.price) }}</td>
                  <td>{{ formatCurrency(item.price * item.quantity) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3"><strong>Tổng cộng:</strong></td>
                  <td><strong>{{ formatCurrency(selectedOrder.total) }}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { toast } from '../../composables/useToast'
import axios from 'axios'

/**
 * API Configuration
 */
const ORDERS_API_URL = 'http://localhost:3000/orders'

/**
 * Types
 */
interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface Order {
  id: number
  userId?: number
  customerName: string
  phone: string
  address: string
  payment?: string
  note?: string
  total: number
  createdAt: string
  status: string
  items: OrderItem[]
}

/**
 * State
 */
const orders = ref<Order[]>([])
const isLoading = ref(true)
const selectedOrder = ref<Order | null>(null)
const filterStatus = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 10

/**
 * Computed
 */
const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const matchStatus = !filterStatus.value || order.status === filterStatus.value
    const matchSearch = !searchQuery.value ||
      order.id.toString().toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.phone.includes(searchQuery.value)

    return matchStatus && matchSearch
  })
})

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredOrders.value.slice(start, start + pageSize)
})

const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / pageSize)
})

const totalOrders = computed(() => orders.value.length)

const pendingOrders = computed(() => {
  return orders.value.filter(o => o.status === 'Pending').length
})

const totalRevenue = computed(() => {
  return orders.value
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0)
})

/**
 * Methods
 */
const formatCurrency = (val: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(val)
}

const formatDate = (dateStr: string): string => {
  try {
    return new Date(dateStr).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateStr
  }
}

const loadOrders = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(ORDERS_API_URL)
    orders.value = response.data
    toast().info('Đã tải lại danh sách đơn hàng')
  } catch (error) {
    console.error('Error loading orders:', error)
    toast().error('Không thể tải danh sách đơn hàng')
  } finally {
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }
}

const updateOrderStatus = async (order: Order) => {
  try {
    await axios.put(`${ORDERS_API_URL}/${order.id}`, order)
    toast().success(`Đã cập nhật trạng thái đơn hàng #${order.id}`)
  } catch (error) {
    console.error('Error updating order status:', error)
    toast().error('Không thể cập nhật trạng thái')
    // Reload to revert any changes
    await loadOrders()
  }
}

const viewOrderDetails = (order: Order) => {
  selectedOrder.value = order
}

const closeModal = () => {
  selectedOrder.value = null
}

const confirmDeleteOrder = (order: Order) => {
  if (confirm(`Bạn có chắc muốn xóa đơn hàng #${order.id}?`)) {
    deleteOrder(order.id)
  }
}

const deleteOrder = async (orderId: number) => {
  try {
    await axios.delete(`${ORDERS_API_URL}/${orderId}`)
    orders.value = orders.value.filter(o => o.id !== orderId)
    toast().success(`Đã xóa đơn hàng #${orderId}`)
  } catch (error) {
    console.error('Error deleting order:', error)
    toast().error('Không thể xóa đơn hàng')
  }
}

const resetData = async () => {
  if (confirm('Bạn có chắc muốn xóa sạch tất cả dữ liệu đơn hàng?')) {
    try {
      // Delete all orders via API
      const deletePromises = orders.value.map(order => 
        axios.delete(`${ORDERS_API_URL}/${order.id}`)
      )
      await Promise.all(deletePromises)
      orders.value = []
      toast().success('Đã xóa sạch dữ liệu đơn hàng')
    } catch (error) {
      console.error('Error resetting data:', error)
      toast().error('Không thể xóa dữ liệu')
    }
  }
}

/**
 * Lifecycle
 */
onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
/* CSS Custom Properties */
:root {
  --primary-color: #6f42c1;
  --success-color: #28a745;
  --warning-color: #ffc107;
  --danger-color: #dc3545;
  --info-color: #17a2b8;
  --light-color: #f8f9fa;
  --dark-color: #212529;
  --border-color: #dee2e6;
  --text-muted: #6c757d;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.12);
  --border-radius: 12px;
}

.orders-page {
  padding: 2rem;
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

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
}

.page-title i {
  color: var(--primary-color);
}

.page-subtitle {
  color: var(--text-muted);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

/* Button Styles */
.btn-refresh {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 6px rgba(111, 66, 193, 0.2);
}

.btn-refresh:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(111, 66, 193, 0.3);
  background: linear-gradient(135deg, #7b4ecf 0%, #663bb0 100%);
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #a0a0a0;
}

.btn-reset {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #ffffff;
  color: #6c757d;
  border: 1px solid #dee2e6;
}

.btn-reset:hover {
  background: #f8f9fa;
  color: #333;
  border-color: #c1c1c1;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}

.stat-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 1.75rem;
}

.stat-total {
  background: rgba(111, 66, 193, 0.1);
  color: var(--primary-color);
}

.stat-pending {
  background: rgba(255, 193, 7, 0.1);
  color: var(--warning-color);
}

.stat-revenue {
  background: rgba(40, 167, 69, 0.1);
  color: var(--success-color);
}

.stat-info h3 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
}

.stat-info p {
  color: var(--text-muted);
  margin: 0;
  font-size: 0.9375rem;
}

/* Filters */
.filters-bar {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  flex-wrap: wrap;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 700;
  font-size: 0.9rem;
  color: #555;
}

.filter-select,
.search-wrapper {
  background-color: #f4f6f8;
  border: 1px solid transparent;
  border-radius: 10px;
  transition: all 0.3s ease;
  height: 48px;
}

.filter-select {
  padding: 0 2rem 0 1rem;
  font-size: 0.95rem;
  color: #495057;
  cursor: pointer;
  min-width: 180px;
}

.search-wrapper {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  width: 100%;
  min-width: 350px;
}

.search-icon {
  color: #a1a5b7;
  font-size: 1.1rem;
  margin-right: 0.8rem;
}

.filter-search {
  border: none;
  background: transparent;
  width: 100%;
  height: 100%;
  font-size: 0.95rem;
  color: #495057;
  outline: none;
}

.filter-select:hover,
.search-wrapper:hover {
  background-color: #ebedf3;
}

.filter-select:focus,
.filter-search:focus,
.search-wrapper:focus-within {
  background-color: #ffffff;
  border-color: #6f42c1;
  box-shadow: 0 0 0 3px rgba(111, 66, 193, 0.1);
  outline: none;
}

/* Loading & Empty States */
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: white;
  border-radius: var(--border-radius);
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

.empty-icon {
  font-size: 5rem;
  color: var(--text-muted);
  opacity: 0.5;
  margin-bottom: 1rem;
}

/* Orders Table */
.orders-table-container {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table thead {
  background: var(--light-color);
}

.orders-table th,
.orders-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.orders-table th {
  font-weight: 700;
  color: var(--dark-color);
  font-size: 0.875rem;
  text-transform: uppercase;
}

.order-row:hover {
  background: rgba(13, 110, 253, 0.05);
}

.order-id strong {
  color: var(--primary-color);
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.customer-name {
  font-weight: 600;
}

.customer-address {
  font-size: 0.875rem;
  color: var(--text-muted);
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.order-total {
  font-weight: 700;
  color: var(--success-color);
}

.payment-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
}

.payment-cod {
  background: rgba(255, 193, 7, 0.1);
  color: var(--warning-color);
}

.payment-bank {
  background: rgba(23, 162, 184, 0.1);
  color: var(--info-color);
}

.status-select {
  padding: 0.375rem 0.75rem;
  border: 2px solid;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.875rem;
}

.status-pending {
  border-color: var(--warning-color);
  background: rgba(255, 193, 7, 0.1);
  color: var(--warning-color);
}

.status-confirmed {
  border-color: var(--info-color);
  background: rgba(23, 162, 184, 0.1);
  color: var(--info-color);
}

.status-shipping {
  border-color: #6f42c1;
  background: rgba(111, 66, 193, 0.1);
  color: #6f42c1;
}

.status-delivered {
  border-color: var(--success-color);
  background: rgba(40, 167, 69, 0.1);
  color: var(--success-color);
}

.status-cancelled {
  border-color: var(--danger-color);
  background: rgba(220, 53, 69, 0.1);
  color: var(--danger-color);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-view {
  background: rgba(111, 66, 193, 0.1);
  color: var(--primary-color);
}

.btn-view:hover {
  background: var(--primary-color);
  color: white;
}

.btn-delete {
  background: rgba(220, 53, 69, 0.1);
  color: var(--danger-color);
}

.btn-delete:hover {
  background: var(--danger-color);
  color: white;
}

/* --- PAGINATION (ĐÃ SỬA: STYLE HIỆN ĐẠI) --- */
.pagination {
  margin-top: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 1rem;
}

.page-btn {
  background: white;
  border: 1px solid #e0e0e0;
  color: #5e6278;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-btn:hover:not(:disabled) {
  border-color: #6f42c1;
  color: #6f42c1;
  background: #f3f0ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(111, 66, 193, 0.15);
}

.page-btn:disabled {
  background: #f5f5f5;
  color: #bbb;
  border-color: #eee;
  cursor: not-allowed;
  box-shadow: none;
  opacity: 1; /* Đảm bảo không bị mờ quá */
}

.page-info {
  font-weight: 600;
  color: #3f4254;
  background: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.text-purple {
  color: #6f42c1;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.btn-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.3s ease;
}

.btn-close:hover {
  background: var(--light-color);
}

.modal-body {
  padding: 1.5rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h3 {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0 0 1rem;
}

.detail-grid {
  display: grid;
  gap: 1rem;
}

.detail-item {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 1rem;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
}

.items-table th,
.items-table td {
  padding: 0.75rem;
  text-align: left;
  border: 1px solid var(--border-color);
}

.items-table thead th {
  background: var(--light-color);
  font-weight: 700;
}

.items-table tfoot td {
  font-size: 1.125rem;
  color: var(--success-color);
  font-weight: 700;
}

/* Responsive */
@media (max-width: 992px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filters-bar {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .search-wrapper {
    min-width: auto;
  }

  .orders-table-container {
    overflow-x: auto;
  }

  .orders-table {
    min-width: 1000px;
  }
}
</style>