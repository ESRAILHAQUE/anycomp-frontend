import axios from "axios";
import {
  Specialist,
  SpecialistsResponse,
  SpecialistResponse,
} from "@/types/specialist.types";

// Ensure API URL always ends with /api
const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_API_URL environment variable is required");
  }
  // Remove trailing slash if present
  const cleanUrl = url.replace(/\/$/, "");
  return cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;
};

const API_URL = getApiUrl();

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptors for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

export const specialistApi = {
  // Get all specialists with filters
  getSpecialists: async (params?: {
    page?: number;
    limit?: number;
    status?: "all" | "draft" | "published";
    search?: string;
  }): Promise<SpecialistsResponse> => {
    const response = await apiClient.get<SpecialistsResponse>("/specialists", {
      params,
    });
    return response.data;
  },

  // Get specialist by ID
  getSpecialistById: async (id: string): Promise<SpecialistResponse> => {
    const response = await apiClient.get<SpecialistResponse>(
      `/specialists/${id}`
    );
    return response.data;
  },

  // Create specialist
  createSpecialist: async (
    data: Partial<Specialist>
  ): Promise<SpecialistResponse> => {
    const response = await apiClient.post<SpecialistResponse>(
      "/specialists",
      data
    );
    return response.data;
  },

  // Update specialist
  updateSpecialist: async (
    id: string,
    data: Partial<Specialist>
  ): Promise<SpecialistResponse> => {
    const response = await apiClient.put<SpecialistResponse>(
      `/specialists/${id}`,
      data
    );
    return response.data;
  },

  // Delete specialist
  deleteSpecialist: async (id: string): Promise<void> => {
    await apiClient.delete(`/specialists/${id}`);
  },

  // Toggle publish status
  togglePublishStatus: async (
    id: string,
    is_draft?: boolean
  ): Promise<SpecialistResponse> => {
    const response = await apiClient.patch<SpecialistResponse>(
      `/specialists/${id}/publish`,
      { is_draft }
    );
    return response.data;
  },
};
