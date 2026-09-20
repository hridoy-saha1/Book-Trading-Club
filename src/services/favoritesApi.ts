// src/services/favoritesApi.ts
import UseAxiosSecure from '@/axios/UseAxiosSecure';

export interface FavoritesResponse {
  success: boolean;
  favoriteBooks?: string[];
  message?: string;
  action?: 'added' | 'removed';
  error?: string;
}

class FavoritesApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      body?: any;
      headers?: Record<string, string>;
      timeout?: number;
    } = {}
  ): Promise<T> {
    const axiosSecure = UseAxiosSecure();

    const method = options.method || 'GET';
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    // All frontend API routes are under /api on the backend
    const url = `/api${endpoint}`;

    const res = await axiosSecure.request<T>({
      url,
      method,
      headers,
      timeout: options.timeout || 30000, // Default 30 seconds, can be overridden
      // Pass the raw object; axios will JSON-serialize it
      data: options.body,
    });

    return res.data as T;
  }

  /**
   * Get user's favorite books
   */
  async getFavorites(uid: string, email?: string): Promise<string[]> {
    try {
      const params = new URLSearchParams();
      if (email) params.append('email', email);

      const queryString = params.toString();
      const endpoint = `/favorites/${uid}${
        queryString ? `?${queryString}` : ''
      }`;

      const response = await this.makeRequest<FavoritesResponse>(endpoint, {
        timeout: 15000 // Shorter timeout for GET requests
      });

      if (response.success) {
        return response.favoriteBooks || [];
      } else {
        throw new Error(response.error || 'Failed to fetch favorites');
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      // Check if it's a timeout error
      if (error instanceof Error && error.message.includes('timeout')) {
        console.warn('Favorites API timeout - using fallback');
      }
      // Fallback to empty array if API fails
      return [];
    }
  }

  /**
   * Add book to favorites
   */
  async addToFavorites(
    uid: string,
    bookId: string,
    email?: string
  ): Promise<boolean> {
    try {
      const response = await this.makeRequest<FavoritesResponse>(
        `/favorites/${uid}`,
        {
          method: 'POST',
          body: { bookId, email },
        }
      );

      return !!response.success;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  }

  /**
   * Remove book from favorites
   */
  async removeFromFavorites(uid: string, bookId: string): Promise<boolean> {
    try {
      const response = await this.makeRequest<FavoritesResponse>(
        `/favorites/${uid}/${bookId}`,
        {
          method: 'DELETE',
        }
      );

      return !!response.success;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  }

  /**
   * Toggle favorite status (add if not present, remove if present)
   */
  async toggleFavorite(
    uid: string,
    bookId: string,
    email?: string
  ): Promise<{ success: boolean; action: 'added' | 'removed' | null }> {
    try {
      const response = await this.makeRequest<FavoritesResponse>(
        `/favorites/${uid}/toggle`,
        {
          method: 'PUT',
          body: { bookId, email },
          timeout: 20000 // 20 seconds for toggle operations
        }
      );

      return {
        success: !!response.success,
        action: response.action || null,
      };
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Check if it's a timeout error
      if (error instanceof Error && error.message.includes('timeout')) {
        console.warn('Favorites toggle timeout - operation may have failed');
      }
      return { success: false, action: null };
    }
  }

  /**
   * Check if server is running
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await this.makeRequest<{ success: boolean }>(`/health`);
      return !!response.success;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

export const favoritesApi = new FavoritesApiService();
