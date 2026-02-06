// Email Composable using EmailJS
import emailjs from '@emailjs/browser'
import { EMAIL_CONFIG } from '../config/emailConfig'

/**
 * Format price to VND currency
 */
const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' ₫'
}

/**
 * Format items list for email
 */
const formatItemsForEmail = (items) => {
    return items.map((item, index) => `
    <div style="padding: 10px; border-bottom: 1px solid #eee;">
      <strong>${index + 1}. ${item.name}</strong><br>
      Số lượng: ${item.quantity} × ${formatPrice(item.price)}<br>
      Thành tiền: ${formatPrice(item.price * item.quantity)}
    </div>
  `).join('')
}

/**
 * Send order confirmation email
 * @param {Object} orderData - Order information
 * @param {string} userEmail - Customer email address
 * @returns {Promise} EmailJS response
 */
export const sendOrderConfirmation = async (orderData, userEmail) => {
    try {
        // Initialize EmailJS with public key
        emailjs.init(EMAIL_CONFIG.publicKey)

        // Prepare template parameters
        // Note: Email người nhận phải được cấu hình trong EmailJS template settings
        // không truyền qua parameter to_email
        const templateParams = {
            user_email: userEmail, // Giữ lại để có thể dùng trong template nếu cần
            orderNumber: orderData.orderNumber || 'N/A',
            customerName: orderData.customerName || 'Khách hàng',
            total: formatPrice(orderData.total || 0),
            address: orderData.address || 'N/A',
            payment: orderData.payment === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng',
            items: formatItemsForEmail(orderData.items || [])
        }

        // Send email via EmailJS
        const response = await emailjs.send(
            EMAIL_CONFIG.serviceId,
            EMAIL_CONFIG.templateId,
            templateParams
        )

        console.log('✅ Email sent successfully:', response)
        return response
    } catch (error) {
        console.error('❌ Email send failed:', error)
        throw error
    }
}

/**
 * Composable export
 */
export const useEmail = () => {
    return {
        sendOrderConfirmation
    }
}
