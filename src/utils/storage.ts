export class StorageService {
  private static readonly API_KEY = 'groq_api_key';

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY, apiKey);
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY);
  }

  static removeApiKey(): void {
    localStorage.removeItem(this.API_KEY);
  }

  static hasApiKey(): boolean {
    const key = this.getApiKey();
    return key !== null && key.trim().length > 0;
  }
}