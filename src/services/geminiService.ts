import axios from 'axios';

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export const getAISummary = async (user: any): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('Gemini API key is missing');
    return 'AI summary unavailable (API key missing)';
  }

  try {
    const prompt = `
      Generate a professional summary for this GitHub user profile:
      Username: ${user.login}
      Name: ${user.name || 'Not provided'}
      Bio: ${user.bio || 'Not provided'}
      Followers: ${user.followers}
      Following: ${user.following}
      Public Repositories: ${user.public_repos}

      Create a concise, professional summary that highlights what can be inferred about this 
      developer based on their GitHub statistics. Limit to 2-3 sentences.
    `;

    const response = await axios.post<GeminiResponse>(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const summary = response.data.candidates[0]?.content.parts[0].text || 
      'Unable to generate AI summary.';
    
    return summary;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return 'Unable to generate AI summary at this time.';
  }
};