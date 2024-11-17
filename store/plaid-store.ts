import { create } from 'zustand';

interface PlaidStore {
    accessToken: string | null;
    setAccessToken: (token: string) => void;
}

export const usePlaidStore = create<PlaidStore>((set) => ({
    accessToken: null,
    setAccessToken: (token) => set({ accessToken: token }),
}));