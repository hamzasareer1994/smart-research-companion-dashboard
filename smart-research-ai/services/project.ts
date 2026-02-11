import { apiClient } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";

export interface ProjectCreate {
    name: string
    description?: string
}

export interface ProjectUpdate {
    name?: string
    description?: string
    notes?: string
}

export interface Paper {
    id: string
    title: string
    authors?: string
    status: string
    created_at: string
}

export interface ProjectResponse {
    id: string
    name: string
    description?: string
    paper_count: number
    created_at: string
    papers?: Paper[]
}

export const projectService = {
    async getProjectDetails(id: string): Promise<any> {
        const response = await apiClient(`/api/v1/projects/${id}`);

        if (!response.ok) {
            const message = await getErrorMessage(response);
            throw new Error(message || "Failed to fetch project details");
        }

        return response.json();
    },

    async getProjects(): Promise<ProjectResponse[]> {
        const response = await apiClient("/api/v1/projects/");

        if (!response.ok) {
            const message = await getErrorMessage(response);
            throw new Error(message || "Failed to fetch projects");
        }

        return response.json();
    },

    async createProject(data: ProjectCreate): Promise<ProjectResponse> {
        const response = await apiClient("/api/v1/projects/", {
            method: "POST",
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const message = await getErrorMessage(response);
            throw new Error(message || "Failed to create project");
        }

        return response.json();
    },

    async updateProject(id: string, data: ProjectUpdate): Promise<ProjectResponse> {
        const response = await apiClient(`/api/v1/projects/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const message = await getErrorMessage(response);
            throw new Error(message || "Failed to update project");
        }

        return response.json();
    },

    async deleteProject(id: string): Promise<void> {
        const response = await apiClient(`/api/v1/projects/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const message = await getErrorMessage(response);
            throw new Error(message || "Failed to delete project");
        }
    },

    async addPaperToProject(projectId: string, paper: any): Promise<any> {
        const response = await apiClient(`/api/v1/projects/${projectId}/papers`, {
            method: "POST",
            body: JSON.stringify(paper)
        });

        if (!response.ok) {
            const message = await getErrorMessage(response);
            throw new Error(message || "Failed to add paper to project");
        }

        return response.json();
    },

    async removePaper(projectId: string, paperId: string): Promise<void> {
        const response = await apiClient(`/api/v1/projects/${projectId}/papers/${paperId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const message = await getErrorMessage(response);
            throw new Error(message || "Failed to remove paper from project");
        }
    },

    async updatePaperStatus(projectId: string, paperId: string, status: string): Promise<void> {
        const response = await apiClient(`/api/v1/projects/${projectId}/papers/${paperId}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            const message = await getErrorMessage(response);
            throw new Error(message || "Failed to update paper status");
        }
    },

    async uploadFiles(projectId: string, files: File[]): Promise<any> {
        const formData = new FormData();
        files.forEach(file => formData.append("files", file));

        const response = await apiClient(`/api/v1/upload?project_id=${projectId}`, {
            method: "POST",
            // For FormData, we don't set Content-Type, fetch handles it
            body: formData,
            headers: {} // Clear default application/json
        });

        if (!response.ok) {
            const message = await getErrorMessage(response);
            throw new Error(message || "Failed to upload files");
        }

        return response.json();
    }
}
