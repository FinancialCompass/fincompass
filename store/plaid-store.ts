import { create } from 'zustand'

interface PlaidState {
    accessToken: string | null
    setAccessToken: (token: string | null) => void
    clearAccessToken: () => void
}

export const usePlaidStore = create<PlaidState>((set) => ({
    accessToken: null,
    setAccessToken: (token) => set({ accessToken: token }),
    clearAccessToken: () => set({ accessToken: null }),
}))