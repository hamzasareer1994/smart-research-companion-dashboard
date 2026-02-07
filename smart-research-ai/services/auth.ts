import { LoginValues, SignupValues } from "@/lib/schema"

const getErrorMessage = async (response: Response) => {
    try {
        const data = await response.json();
        return data.detail || data.message || "An error occurred";
    } catch {
        return response.statusText || "An error occurred";
    }
};

export const authService = {
    async login(data: LoginValues) {
        const response = await fetch("/api/v1/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
            }),
        })

        if (!response.ok) {
            const message = await getErrorMessage(response);
            throw new Error(message)
        }

        return response.json()
    },

    async signup(data: SignupValues) {
        const response = await fetch("/api/v1/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
            }),
        })

        if (!response.ok) {
            const message = await getErrorMessage(response);
            throw new Error(message)
        }

        return response.json()
    }
}
