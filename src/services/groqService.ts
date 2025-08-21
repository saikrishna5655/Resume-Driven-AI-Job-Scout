const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export class GroqService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async makeRequest(messages: any[], temperature = 0.7): Promise<string> {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages,
          temperature,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Groq API request failed:', error);
      throw new Error('Failed to communicate with AI service');
    }
  }

  async validateApiKey(): Promise<boolean> {
    try {
      await this.makeRequest([
        { role: 'user', content: 'Test message' }
      ]);
      return true;
    } catch (error) {
      return false;
    }
  }
}