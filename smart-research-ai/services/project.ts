import { useUserStore } from "@/lib/store"

export interface ProjectCreate {
    name: string
    description?: string
}

export interface ProjectResponse {
    id: string
    name: string
    description?: string
    paper_count: number
    created_at: string
}

export const projectService = {
    async getProjectDetails(id: string): Promise<any> {
        const user = useUserStore.getState().user
        const accessToken = user?.access_token

        const response = await fetch(`/api/v1/projects/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })

        if (!response.ok) {
            throw new Error("Failed to fetch project details")
        }

        return response.json()
    },

    async getProjects(): Promise<ProjectResponse[]> {
        const user = useUserStore.getState().user
        const accessToken = user?.access_token

        const response = await fetch("/api/v1/projects/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })

        if (!response.ok) {
            throw new Error("Failed to fetch projects")
        }

        return response.json()
    },

    async createProject(data: ProjectCreate): Promise<ProjectResponse> {
        const user = useUserStore.getState().user
        const accessToken = user?.access_token

        const response = await fetch("/api/v1/projects/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.detail || "Failed to create project")
        }

        return response.json()
    },

    async deleteProject(id: string): Promise<void> {
        const user = useUserStore.getState().user
        const accessToken = user?.access_token

        const response = await fetch(`/api/v1/projects/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })

        if (!response.ok) {
            throw new Error("Failed to delete project")
        }
    },

    async addPaperToProject(projectId: string, paper: any): Promise<void> {
        const user = useUserStore.getState().user
        const accessToken = user?.access_token

        const response = await fetch(`/api/v1/projects/${projectId}/papers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(paper)
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.detail || "Failed to add paper to project")
        }
    },

    async removePaper(projectId: string, paperId: string): Promise<void> {
        const user = useUserStore.getState().user
        const accessToken = user?.access_token

        const response = await fetch(`/api/v1/projects/${projectId}/papers/${paperId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.detail || "Failed to remove paper from project")
        }
    }
}
