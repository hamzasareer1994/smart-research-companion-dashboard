import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserTier = 'student' | 'professor' | 'researcher' | 'payg' | 'pro'

export interface User {
    id: string
    email: string
    tier: UserTier | string
    credits: number
    credit_balance_cents?: number
    access_token: string
    refresh_token?: string
    full_name?: string
}

export interface SearchFilters {
    year_range?: [number, number]
    citations_min?: number
    open_access: boolean
    field_of_study?: string
}

export interface Paper {
    id: string
    title: string
    authors: string[]
    year?: number
    citations: number
    abstract?: string
    source: string
    doi?: string
    url?: string
    pdf_url?: string
    open_access: boolean
    relevance_score: number
}

export interface SearchRequest {
    query: string
    filters?: SearchFilters
    sources?: string[]
    page: number
    limit: number
}

export interface SearchResponse {
    results: Paper[]
    total_count: number
    page: number
    sources_used: string[]
    credits?: number
}

interface UserState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    searchHistory: string[]

    setUser: (user: User) => void
    clearUser: () => void
    updateCredits: (newBalance: number) => void
    addSearchHistory: (query: string) => void
    clearSearchHistory: () => void
    setLoading: (loading: boolean) => void
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            searchHistory: [],

            setUser: (user) => set({
                user: {
                    ...user,
                    tier: user.tier || 'student',
                    credits: user.credits ?? 0,
                    credit_balance_cents: user.credit_balance_cents ?? (user.credits ? user.credits * 100 : 0)
                },
                isAuthenticated: true
            }),
            clearUser: () => set({ user: null, isAuthenticated: false }),
            updateCredits: (balance) =>
                set((state) => ({
                    user: state.user ? { 
                        ...state.user, 
                        credits: balance,
                        credit_balance_cents: balance * 100 
                    } : null
                })),
            addSearchHistory: (query) =>
                set((state) => {
                    const newHistory = [query, ...state.searchHistory.filter(q => q !== query)].slice(0, 10)
                    return { searchHistory: newHistory }
                }),
            clearSearchHistory: () => set({ searchHistory: [] }),
            setLoading: (loading) => set({ isLoading: loading }),
        }),
        {
            name: 'smart-research-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                searchHistory: state.searchHistory
            }),
        }
    )
)
