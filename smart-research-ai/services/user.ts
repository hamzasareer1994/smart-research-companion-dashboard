import { User } from "@/lib/store";

const getErrorMessage = async (response: Response) => {
    try {
        const data = await response.json();
        return data.detail || data.message || "An error occurred";
    } catch {
        return response.statusText || "An error occurred";
    }
};

export const userService = {
    async getMe(token: string) {
        const response = await fetch("/api/v1/me", {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const message = await getErrorMessage(response);
            throw new Error(message);
        }

        return response.json();
    },

    async getQuotas(token: string) {
        const response = await fetch("/api/v1/user/quotas", {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const message = await getErrorMessage(response);
            throw new Error(message);
        }

        return response.json();
    }
};
