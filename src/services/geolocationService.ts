export interface GeolocationPosition {
  latitude: number;
  longitude: number;
}

export interface GeolocationError {
  code: number;
  message: string;
}

export class GeolocationService {
  private static instance: GeolocationService;
  private cachedPosition: GeolocationPosition | null = null;
  private cacheExpiry: number = 5 * 60 * 1000; // 5 minutes
  private lastFetch: number = 0;

  private constructor() {}

  public static getInstance(): GeolocationService {
    if (!GeolocationService.instance) {
      GeolocationService.instance = new GeolocationService();
    }
    return GeolocationService.instance;
  }

  public async getCurrentPosition(): Promise<GeolocationPosition> {
    // Check if we have a cached position that's still valid
    if (this.cachedPosition && Date.now() - this.lastFetch < this.cacheExpiry) {
      return this.cachedPosition;
    }

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject({
          code: 0,
          message: 'Geolocation is not supported by this browser.',
        });
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const positionData: GeolocationPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          // Cache the position
          this.cachedPosition = positionData;
          this.lastFetch = Date.now();

          resolve(positionData);
        },
        (error) => {
          const errorData: GeolocationError = {
            code: error.code,
            message: this.getErrorMessage(error.code),
          };
          reject(errorData);
        },
        options
      );
    });
  }

  public async getPositionWithFallback(): Promise<GeolocationPosition> {
    try {
      return await this.getCurrentPosition();
    } catch (error) {
      console.warn('Geolocation failed, using default location (Dhaka, Bangladesh):', error);
      // Fallback to Dhaka, Bangladesh coordinates
      return {
        latitude: 23.8103,
        longitude: 90.4125,
      };
    }
  }

  private getErrorMessage(code: number): string {
    switch (code) {
      case 1:
        return 'Permission denied. Please allow location access to use this feature.';
      case 2:
        return 'Location information is unavailable.';
      case 3:
        return 'Location request timed out.';
      default:
        return 'An unknown error occurred while retrieving location.';
    }
  }

  public clearCache(): void {
    this.cachedPosition = null;
    this.lastFetch = 0;
  }

  public isGeolocationSupported(): boolean {
    return 'geolocation' in navigator;
  }
}

export const geolocationService = GeolocationService.getInstance();
