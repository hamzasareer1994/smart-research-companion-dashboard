import { useUserStore } from "@/lib/store";

const getErrorMessage = async (response: Response) => {
    try {
        const data = await response.json();
        return data.detail || data.message || "An error occurred";
    } catch {
        return response.statusText || "An error occurred";
    }
};

export const aiService = {
    async generateAbstract(text: string) {
        const accessToken = useUserStore.getState().user?.access_token;
        const response = await fetch("/api/v1/ai/abstract", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ text }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || "Failed to generate abstract");
        }

        if (data.credits !== undefined) {
            useUserStore.getState().updateCredits(data.credits);
        }

        return data.abstract;
    },

    async extractInsights(text: string) {
        const accessToken = useUserStore.getState().user?.access_token;
        const response = await fetch("/api/v1/ai/insights", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ text }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || "Failed to extract insights");
        }

        if (data.credits !== undefined) {
            useUserStore.getState().updateCredits(data.credits);
        }

        return data.insights;
    },

    async generateSummary(title: string, text: string) {
        const accessToken = useUserStore.getState().user?.access_token;
        const response = await fetch("/api/v1/ai/summary", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ title, text }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || "Failed to generate summary");
        }

        if (data.credits !== undefined) {
            useUserStore.getState().updateCredits(data.credits);
        }

        return data.summary;
    }
};
