import { apiClient } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";

export const userService = {
    async getMe(token: string) {
        const response = await apiClient("/api/v1/me");
        if (!response.ok) {
            const message = await getErrorMessage(response);
            throw new Error(message);
        }
        return response.json();
    },

    async getQuotas(token: string) {
        const response = await apiClient("/api/v1/user/quotas");
        if (!response.ok) {
            const message = await getErrorMessage(response);
            throw new Error(message);
        }
        return response.json();
    },

    async getTransactions() {
        const response = await apiClient("/api/v1/user/transactions");
        if (!response.ok) {
            const message = await getErrorMessage(response);
            throw new Error(message);
        }
        return response.json();
    },
};
