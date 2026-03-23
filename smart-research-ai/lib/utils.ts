import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getErrorMessage = async (response: Response) => {
  try {
    const data = await response.json();
    return data.detail || data.message || "An error occurred";
  } catch {
    return response.statusText || "An error occurred";
  }
};
