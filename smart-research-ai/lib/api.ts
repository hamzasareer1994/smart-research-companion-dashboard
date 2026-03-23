import { useUserStore } from "./store";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
    refreshSubscribers.push(cb);
}

function onTokenRefreshed(token: string) {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
}

export const apiClient = async (path: string, options: RequestInit = {}) => {
    const { user, setUser, clearUser } = useUserStore.getState();
    const token = user?.access_token;

    const isFormData = options.body instanceof FormData;

    const defaultHeaders: Record<string, string> = {
        ...(!isFormData ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        } as Record<string, string>,
    };

    try {
        const response = await fetch(`${baseUrl}${path}`, config);

        // If 401 and we have a refresh token, try to refresh
        if (response.status === 401 && user?.refresh_token) {
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const refreshResponse = await fetch(`${baseUrl}/api/v1/auth/refresh`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ refresh_token: user.refresh_token }),
                    });

                    if (refreshResponse.ok) {
                        const newUser = await refreshResponse.json();
                        setUser(newUser);
                        onTokenRefreshed(newUser.access_token);
                        isRefreshing = false;
                    } else {
                        isRefreshing = false;
                        clearUser();
                        window.location.href = "/login";
                        throw new Error("Session expired. Please login again.");
                    }
                } catch (err) {
                    isRefreshing = false;
                    clearUser();
                    window.location.href = "/login";
                    throw err;
                }
            }

            // Wait for refresh to complete and retry
            return new Promise<Response>((resolve) => {
                subscribeTokenRefresh((newToken: string) => {
                    if (config.headers) {
                        config.headers.Authorization = `Bearer ${newToken}`;
                    }
                    resolve(fetch(`${baseUrl}${path}`, config));
                });
            });
        }

        return response;
    } catch (error) {
        console.error("API Call Error:", error);
        throw error;
    }
};
