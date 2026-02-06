// Google Authentication Composable
import { auth, googleProvider } from '../config/firebaseConfig'
import { signInWithPopup } from 'firebase/auth'
import axios from 'axios'

const API_URL = 'http://localhost:3000/users'

/**
 * Handle Google Sign In
 * Returns user data if successful
 */
export const signInWithGoogle = async () => {
    try {
        // Trigger Google Sign In popup
        const result = await signInWithPopup(auth, googleProvider)

        // Get user info from Google
        const user = result.user
        const userData = {
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL,
            uid: user.uid
        }

        // Check if user exists in database (json-server)
        const response = await axios.get(`${API_URL}?email=${userData.email}`)

        let dbUser
        if (response.data && response.data.length > 0) {
            // User exists, use existing data
            dbUser = response.data[0]
        } else {
            // New user, create in database
            const newUser = {
                name: userData.name,
                email: userData.email,
                password: '', // No password for Google users
                role: 'user',
                googleId: userData.uid,
                photoURL: userData.photoURL
            }

            const createResponse = await axios.post(API_URL, newUser)
            dbUser = createResponse.data
        }

        return {
            success: true,
            user: dbUser
        }
    } catch (error) {
        console.error('Google Sign In Error:', error)
        console.error('Error code:', error.code)
        console.error('Error message:', error.message)

        // Handle specific errors
        if (error.code === 'auth/unauthorized-domain') {
            return {
                success: false,
                error: 'Domain chưa được authorize. Vui lòng thêm localhost vào Firebase Console → Authentication → Settings → Authorized domains'
            }
        }

        if (error.code === 'auth/popup-closed-by-user') {
            return {
                success: false,
                error: 'Đăng nhập bị hủy'
            }
        }

        if (error.code === 'auth/popup-blocked') {
            return {
                success: false,
                error: 'Popup bị chặn. Vui lòng cho phép popup và thử lại.'
            }
        }

        return {
            success: false,
            error: error.message || 'Đăng nhập thất bại'
        }
    }
}

/**
 * Composable export
 */
export const useGoogleAuth = () => {
    return {
        signInWithGoogle
    }
}
