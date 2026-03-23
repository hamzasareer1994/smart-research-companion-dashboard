import { useUserStore } from "@/lib/store";
import { apiClient } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";

export const aiService = {
    async generateAbstract(text: string) {
        const response = await apiClient("/api/v1/ai/abstract", {
            method: "POST",
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            const message = await getErrorMessage(response);
            throw new Error(message);
        }

        const data = await response.json();
        if (data.credits !== undefined) {
            useUserStore.getState().updateCredits(data.credits);
        }

        return data.abstract;
    },

    async extractInsights(text: string) {
        const response = await apiClient("/api/v1/ai/insights", {
            method: "POST",
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            const message = await getErrorMessage(response);
            throw new Error(message);
        }

        const data = await response.json();
        if (data.credits !== undefined) {
            useUserStore.getState().updateCredits(data.credits);
        }

        return data.insights;
    },

    async generateSummary(title: string, text: string) {
        const response = await apiClient("/api/v1/ai/summary", {
            method: "POST",
            body: JSON.stringify({ title, text }),
        });

        if (!response.ok) {
            const message = await getErrorMessage(response);
            throw new Error(message);
        }

        const data = await response.json();
        if (data.credits !== undefined) {
            useUserStore.getState().updateCredits(data.credits);
        }

        return data.summary;
    },

    async generateResearchGaps(projectId: string, paperIds: string[]) {
        const response = await apiClient("/api/v1/insights/research-gaps", {
            method: "POST",
            body: JSON.stringify({ project_id: projectId, paper_ids: paperIds }),
        });

        if (!response.ok) {
            const message = await getErrorMessage(response);
            throw new Error(message);
        }

        const data = await response.json();
        if (data.credits !== undefined) {
            useUserStore.getState().updateCredits(data.credits);
        }

        return data.gaps;
    }
};
