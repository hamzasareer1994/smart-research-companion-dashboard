"use client"

import { useEffect, useCallback } from 'react'
import { useUserStore } from '@/lib/store'
import { authService } from '@/services/auth'
import { toast } from 'sonner'

/**
 * Hook to automatically refresh JWT tokens before they expire.
 * Prevents session timeout during long research sessions.
 * 
 * JWT tokens expire after ~1 hour. This hook:
 * 1. Checks token expiration every 5 minutes
 * 2. Refreshes token if <10 minutes remaining
 * 3. Silently handles refresh in background
 */
export function useTokenRefresh() {
    const { user, setUser, clearUser } = useUserStore()

    const refreshToken = useCallback(async () => {
        if (!user?.access_token) return

        try {
            // Decode JWT to check expiration
            const tokenParts = user.access_token.split('.')
            if (tokenParts.length !== 3) return

            const payload = JSON.parse(atob(tokenParts[1]))
            const exp = payload.exp * 1000 // Convert to milliseconds
            const now = Date.now()
            const timeUntilExpiry = exp - now
            const tenMinutes = 10 * 60 * 1000

            // Refresh if token expires in less than 10 minutes
            if (timeUntilExpiry < tenMinutes && timeUntilExpiry > 0) {
                console.log('Token expiring soon, refreshing...')

                // Request new token from backend
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${user.access_token}`,
                        'Content-Type': 'application/json'
                    }
                })

                if (response.ok) {
                    const data = await response.json()
                    setUser({
                        ...user,
                        access_token: data.access_token
                    })
                    console.log('Token refreshed successfully')
                } else {
                    console.error('Token refresh failed')
                }
            } else if (timeUntilExpiry <= 0) {
                // Token already expired
                toast.error('Session expired. Please log in again.')
                clearUser()
                window.location.href = '/auth/login'
            }
        } catch (error) {
            console.error('Error refreshing token:', error)
        }
    }, [user, setUser, clearUser])

    useEffect(() => {
        if (!user?.access_token) return

        // Check immediately on mount
        refreshToken()

        // Check every 5 minutes
        const interval = setInterval(refreshToken, 5 * 60 * 1000)

        return () => clearInterval(interval)
    }, [user?.access_token, refreshToken])
}
