import { useUserStore, SearchRequest, SearchResponse } from "@/lib/store"

export const searchService = {
    async searchPapers(request: SearchRequest): Promise<SearchResponse> {
        const user = useUserStore.getState().user
        const accessToken = user?.access_token

        const response = await fetch("/api/v1/search/papers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(request)
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.detail || "Search failed")
        }

        const data: SearchResponse = await response.json()

        // Sync credits if returned
        if (data.credits !== undefined && data.credits !== null) {
            useUserStore.getState().updateCredits(data.credits)
        }

        return data
    }
}
