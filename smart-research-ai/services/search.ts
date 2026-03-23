import { apiClient } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";

export const searchService = {
    async searchPapers(data: any) {
        const response = await apiClient("/api/v1/search/cite", {
            method: "POST",
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const message = await getErrorMessage(response);
            throw new Error(message);
        }

        return response.json();
    },

    async semanticSearch(query: string, projectId?: string) {
        const response = await apiClient("/api/v1/search/semantic", {
            method: "POST",
            body: JSON.stringify({ query, project_id: projectId }),
        });

        if (!response.ok) {
            const message = await getErrorMessage(response);
            throw new Error(message);
        }

        return response.json();
    }
};
